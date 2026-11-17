#!/usr/bin/env python3
"""Build src/data/catalog.json from the live Shopify storefront's public JSON (read-only).
Collection membership and order come from /collections/<handle>/products.json (the store's own sort).
Each sub-collection keeps a small sample (SUB_N) so page weight and the image budget stay low;
each room collection shows a round-robin of its sub-collections' samples (PARENT_N), so it adds no images.
Dining benches keep the existing 37-item set from benches.json."""
import json, re, html, io, os, sys, time, subprocess, urllib.parse
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'src/data/catalog.json')
IMGDIR = os.path.join(ROOT, 'src/assets/products')
CACHE = '/workspace/foothills-migration/live-json'
os.makedirs(CACHE, exist_ok=True)
SUB_N, PARENT_N = 8, 24
STORE = 'https://foothillsamishfurniture.com'

# Live mega-menu order (captured from the live header, 2026-11-17).
TREE = [
  ('amish-dining-room-furniture', 'Dining', ['dining-sets', 'dining-benches', 'buffets', 'dining-chairs', 'hutches', 'islands', 'reclaimed-wood-dining-furniture', 'dining-tables', 'wine-cabinets']),
  ('amish-bedroom-furniture', 'Bedroom', ['bedroom-sets', 'bedroom-accent-furniture', 'bedroom-armoires-wardrobes', 'beds', 'chest-of-drawers', 'dressers', 'mattresses', 'nightstands']),
  ('living-room-furniture', 'Living', ['living-room-collections', 'living-room-chairs-recliners', 'chests-trunks', 'curio-cabinets', 'entertainment-centers', 'living-room-accent-furniture', 'occasional-tables', 'ottomans', 'rockers-gliders', 'sofas-loveseats', 'tv-stands-media-consoles']),
  ('amish-office-furniture', 'Office', ['office-furniture-collections', 'bookcases-book-cabinets', 'office-chairs', 'credenzas', 'desks', 'file-cabinets', 'office-hutches', 'office-tables']),
  ('amish-outdoor-furniture', 'Outdoor', ['poly-outdoor-benches', 'poly-outdoor-chairs', 'poly-outdoor-rockers-gliders', 'poly-outdoor-swings', 'poly-outdoor-tables', 'poly-outdoor-furniture-accessories']),
]
# Menu labels exactly as the live mega-menu shows them.
LABEL = {
 'dining-sets':'Dining Collections','dining-benches':'Benches','buffets':'Buffets & Sideboards','dining-chairs':'Chairs & Stools','hutches':'Hutches & Cupboards','islands':'Islands','reclaimed-wood-dining-furniture':'Reclaimed Wood','dining-tables':'Tables & Pub Tables','wine-cabinets':'Wine Cabinets',
 'bedroom-sets':'Bedroom Collections','bedroom-accent-furniture':'Accents','bedroom-armoires-wardrobes':'Armoires & Wardrobes','beds':'Beds','chest-of-drawers':'Chests & Bureaus','dressers':'Dressers','mattresses':'Mattresses','nightstands':'Nightstands & Bedside Tables',
 'living-room-collections':'Living Room Collections','living-room-chairs-recliners':'Chairs & Recliners','chests-trunks':'Chests & Trunks','curio-cabinets':'Curio Cabinets','entertainment-centers':'Entertainment Centers','living-room-accent-furniture':'Living Room Accents','occasional-tables':'Occasional Tables','ottomans':'Ottomans','rockers-gliders':'Rockers & Gliders','sofas-loveseats':'Couches & Loveseats','tv-stands-media-consoles':'TV Stands & Media Consoles',
 'office-furniture-collections':'Office Collections','bookcases-book-cabinets':'Bookcases & Book Cabinets','office-chairs':'Chairs','credenzas':'Credenzas','desks':'Desks','file-cabinets':'File Cabinets','office-hutches':'Hutches','office-tables':'Tables',
 'poly-outdoor-benches':'Benches','poly-outdoor-chairs':'Chairs','poly-outdoor-rockers-gliders':'Rockers & Gliders','poly-outdoor-swings':'Swings','poly-outdoor-tables':'Tables','poly-outdoor-furniture-accessories':'Outdoor Accessories',
}

def get(url):
    key = os.path.join(CACHE, re.sub(r'[^a-z0-9]+', '_', url.lower())[-120:] + '.json')
    if os.path.exists(key):
        return json.load(open(key))
    for attempt in range(5):
        r = subprocess.run(['curl', '-sL', '--retry', '3', '-A', 'Mozilla/5.0 (foothills demo build)', url], capture_output=True, text=True)
        if r.returncode == 0: break
        time.sleep(2 + attempt * 2)
    d = json.loads(r.stdout); json.dump(d, open(key, 'w')); time.sleep(0.25)
    return d

def text(s):
    s = re.sub(r'<br\s*/?>', ' ', s or ''); s = re.sub(r'<[^>]+>', ' ', s)
    return ' '.join(html.unescape(s).replace('\xa0', ' ').split())

SPECIES = ['Quarter Sawn White Oak','Rustic Quarter Sawn White Oak','Reclaimed Barnwood','Reclaimed Wood','Rustic Brown Maple','Brown Maple','Rustic Cherry','Cherry','Rustic Hickory','Hickory','Red Oak','White Oak','Hard Maple','Wormy Maple','Elm','Walnut','Ash','Sap Cherry','Oak','Maple']
def wood_of(p, body):
    t = p['tags']; ty = (p['product_type'] or '').lower()
    if any('poly' in x.lower() for x in t) or 'poly' in ty or 'poly' in p['title'].lower(): return 'Poly lumber'
    m = re.search(r'(?:pictured|shown)\s+(?:here\s+)?in\s+([^.;:]+)', body, re.I)
    if m:
        seg = m.group(1)
        for s in SPECIES:
            if s.lower() in seg.lower(): return 'Reclaimed Barnwood' if s == 'Reclaimed Wood' else s
    if 'Reclaimed Wood' in t or 'reclaimed' in p['title'].lower(): return 'Reclaimed Barnwood'
    if p['vendor'] in ('Smith Brothers', 'McKinley Leather', 'McKinley Upholstery') or any(x in ty for x in ('sofa','sectional','recliner','loveseat','ottoman','upholster')): return 'Upholstered'
    if 'mattress' in ty: return 'Mattress'
    return 'Your choice'

ROOMS = {'Dining Room':'Dining room','Bedroom':'Bedroom','Living Room':'Living room','Office':'Office','Home Office':'Office','Outdoor':'Outdoor','Kitchen':'Kitchen','Entryway':'Entryway'}
def rooms_of(p, default):
    r = []
    for t in p['tags']:
        if t in ROOMS and ROOMS[t] not in r: r.append(ROOMS[t])
    return r or [default]

DIM = re.compile(r'(\d+(\.\d+)?\s*["”″]\s*(W|D|H|x|L\b|Long|Wide|Deep|High))|^\s*(dimensions|sizes?|overall)\b', re.I)
def piece(p, default_room, primary):
    body = p['body_html'] or ''
    paras = [text(x) for x in re.findall(r'<p[^>]*>(.*?)</p>', body, re.S)]
    paras = [x for x in paras if len(x) > 2]
    bullets = [text(x) for x in re.findall(r'<li[^>]*>(.*?)</li>', body, re.S)]
    bullets = [x for x in bullets if x][:10]
    if not paras and not bullets and text(body): paras = [text(body)]
    dims = next((x for x in paras + bullets if DIM.search(x) and len(x) < 400), None)
    coll = next((t for t in p['tags'] if t.endswith(' Collection')), None)
    created = (p.get('created_at') or p.get('published_at') or '')[:10]
    return {
        'handle': p['handle'], 'title': ' '.join(p['title'].split()), 'vendor': p['vendor'], 'type': p['product_type'] or '',
        'rooms': rooms_of(p, default_room), 'wood': wood_of(p, text(body)), 'collection': coll, 'dims': dims,
        'paras': paras[:4], 'bullets': bullets, 'tags': p['tags'], 'image': p['handle'] + '.jpg', 'created': created,
        'img_src': p['images'][0]['src'].split('?')[0], 'primary': primary,
    }

def fetch_img(src, dest):
    if os.path.exists(dest): return True
    # Shopify's ?width= resize drops PNG transparency (backgrounds came out flat green), so fetch PNGs at full size.
    url = src if src.split('?')[0].lower().endswith('.png') else src + ('&' if '?' in src else '?') + 'width=1200'
    r = subprocess.run(['curl', '-sL', '--retry', '4', '--retry-all-errors', '-A', 'Mozilla/5.0', url], capture_output=True)
    try:
        im = Image.open(io.BytesIO(r.stdout)).convert('RGBA')
        bg = Image.new('RGB', im.size, (255, 255, 255)); bg.paste(im, mask=im.split()[3]); im = bg
    except Exception as e:
        print('  ! image failed', src, e); return False
    if im.width > 1000: im = im.resize((1000, round(im.height * 1000 / im.width)), Image.LANCZOS)
    im.save(dest, 'JPEG', quality=80, optimize=True, progressive=True); return True

def main():
    meta = {c['handle']: c for c in json.load(open('/workspace/foothills-migration/raw/coll_1.json'))['collections']}
    benches = json.load(open(os.path.join(ROOT, 'src/data/benches.json')))
    products, collections = {}, {}
    ROOM_DEFAULT = {'amish-dining-room-furniture':'Dining room','amish-bedroom-furniture':'Bedroom','living-room-furniture':'Living room','amish-office-furniture':'Office','amish-outdoor-furniture':'Outdoor'}
    for parent, room, subs in TREE:
        samples = []
        for h in subs:
            m = meta[h]
            if h == 'dining-benches':
                handles = [b['handle'] for b in benches if 'Dining Room' in b['tags']]
            else:
                d = get(f'{STORE}/collections/{h}/products.json?limit=40')['products']
                handles = []
                for p in d:
                    if len(handles) >= SUB_N: break
                    if not p['images']: continue
                    dest = os.path.join(IMGDIR, p['handle'] + '.jpg')
                    if p['handle'] not in products:
                        if not fetch_img(p['images'][0]['src'], dest): continue
                        products[p['handle']] = piece(p, ROOM_DEFAULT[parent], h)
                    handles.append(p['handle'])
            collections[h] = {'handle': h, 'title': m['title'], 'label': LABEL[h], 'parent': parent, 'total': m['products_count'],
                              'description': m.get('description') or '', 'products': handles}
            samples.append(handles)
            print(f'{h}: {len(handles)} of {m["products_count"]}', flush=True)
        rr, seen = [], set()
        while len(rr) < PARENT_N and any(samples):
            for s in samples:
                while s and s[0] in seen: s.pop(0)
                if s and len(rr) < PARENT_N:
                    x = s.pop(0); seen.add(x); rr.append(x)
        m = meta[parent]
        collections[parent] = {'handle': parent, 'title': m['title'], 'label': room, 'parent': None, 'total': m['products_count'],
                               'description': m.get('description') or '', 'products': rr, 'children': subs}
    json.dump({'tree': [[p, r, s] for p, r, s in TREE], 'collections': collections, 'products': products}, open(OUT, 'w'), indent=1, ensure_ascii=False)
    print('products', len(products), 'collections', len(collections))

if __name__ == '__main__':
    main()
