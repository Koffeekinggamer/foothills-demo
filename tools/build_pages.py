#!/usr/bin/env python3
"""Turn captured live Shopify page HTML (foothills-migration/live-pages/*.html, fetched read-only on 2026-11-17)
into structured sections for src/data/pages.json. Text is kept verbatim apart from whitespace;
the theme's repeated boilerplate blocks are dropped (see DROP)."""
import json, re, os, sys
from bs4 import BeautifulSoup
SRC = '/workspace/foothills-migration/live-pages'
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src/data/pages.json')
DROP_H = re.compile(r"^(let's get started making your perfect furniture|family-owned\. local\. friendly service\.|“|\"|all set with your|unlike any other|start your custom|ready to)", re.I)
DROP_P = re.compile(r"^(unlike any other furniture store|now offering|come see us|\d\. (search for|customize your|we'll deliver)|click on an image|expand menu|hide menu|read more|learn more|shop now|view (all|more)|contact us today!?|terra v)$", re.I)

def tokens(html):
    s = BeautifulSoup(html, 'html.parser')
    m = s.find('main') or s.body
    for t in m(['script', 'style', 'noscript', 'svg', 'form', 'select', 'nav']): t.decompose()
    for t in m.select('.visually-hidden, .a11y__show, .a11y__hide'): t.decompose()
    out = []
    for el in m.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'li', 'button', 'td', 'th', 'blockquote']):
        if el.name == 'button' and 'faq__button' not in (el.get('class') or []): continue
        if el.name in ('p', 'li', 'td', 'th', 'blockquote') and el.find(['p', 'li', 'h1', 'h2', 'h3', 'h4', 'table']): continue
        if el.name in ('h1','h2','h3','h4','h5') and el.find_parent('button'): continue
        txt = ' '.join(el.get_text(' ').replace('\xa0', ' ').split())
        txt = re.sub(r'\s+([,.;:!?])', r'\1', txt)
        if not txt: continue
        tag = 'q' if el.name == 'button' else ('h4' if el.name in ('h4', 'h5') else el.name)
        if out and out[-1] == [tag, txt]: continue
        out.append([tag, txt])
    return out

def is_label(t):
    return len(t) <= 42 and not re.search(r'[.!?]$', t) and not t.endswith(':')

def sections(toks):
    title, secs, intro = None, [], []
    cur = None; card = None; q = None
    for tag, txt in toks:
        if tag == 'h1' and title is None: title = txt; continue
        if tag in ('h1', 'h2'):
            eb = None
            holder = (q['a'] if q else card['paras'] if card else cur['paras'] if cur else intro)
            if holder and is_label(holder[-1]): eb = holder.pop()
            cur = {'h': txt, 'eyebrow': eb, 'paras': [], 'cards': [], 'faq': []}; secs.append(cur); card = None; q = None; continue
        if cur is None and tag in ('h3', 'h4', 'q'):
            cur = {'h': '', 'eyebrow': None, 'paras': [], 'cards': [], 'faq': []}; secs.append(cur)
        if tag in ('h3', 'h4'):
            eb = None
            if card and card['paras'] and is_label(card['paras'][-1]): eb = card['paras'].pop()
            elif card is None and cur['paras'] and is_label(cur['paras'][-1]) and not cur['cards']: eb = cur['paras'].pop()
            card = {'h': txt, 'eyebrow': eb, 'paras': []}; cur['cards'].append(card); q = None; continue
        if tag == 'q':
            q = {'q': txt, 'a': []}; cur['faq'].append(q); card = None; continue
        if DROP_P.match(txt) or (len(txt) < 40 and txt.endswith(':') and txt[0].isupper() and ' ' in txt and txt.split()[-1] in ('Options:', 'Hardwood:')): continue
        if q is not None: q['a'].append(txt)
        elif card is not None: card['paras'].append(txt)
        elif cur is not None: cur['paras'].append(txt)
        else: intro.append(txt)
    for c in [c for s in secs for c in s['cards']]:
        pass
    secs = [s for s in secs if not DROP_H.match(s['h']) and (s['paras'] or s['cards'] or s['faq'])]
    return title, intro, secs

def main():
    pages = {}
    for f in sorted(os.listdir(SRC)):
        if not f.endswith('.html') or f.startswith('__'): continue
        h = f[:-5]
        title, intro, secs = sections(tokens(open(os.path.join(SRC, f)).read()))
        pages[h] = {'title': title, 'intro': intro, 'sections': secs}
    json.dump(pages, open(OUT, 'w'), indent=1, ensure_ascii=False)
    if '-v' in sys.argv:
        for h, p in pages.items():
            print('########', h, '|', p['title']); [print('  INTRO', x[:160]) for x in p['intro']]
            for s in p['sections']:
                print('  H2', s['h'][:100]); [print('     p', x[:140]) for x in s['paras']]
                for c in s['cards']: print('     H3', c['h'][:80], '|', ' / '.join(x[:90] for x in c['paras']))
                for q in s['faq']: print('     Q', q['q'][:80], '|', ' / '.join(x[:90] for x in q['a']))
main()
