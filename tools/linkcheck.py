#!/usr/bin/env python3
"""Check every internal href/src in dist/ resolves (base /foothills-demo). Also checks noindex and that no
third-party script tag is live. Usage: python3 tools/linkcheck.py"""
import os, re, sys, html
ROOT = 'dist'; BASE = '/foothills-demo'
bad, pages, noidx, ext_scripts = {}, 0, [], []
def exists(path):
    p = path.split('#')[0].split('?')[0]
    if not p.startswith(BASE): return None
    p = p[len(BASE):] or '/'
    f = os.path.join(ROOT, p.lstrip('/'))
    if p == '/': f = os.path.join(ROOT, 'index.html')
    return os.path.isfile(f) or os.path.isfile(f + '.html') or os.path.isfile(os.path.join(f, 'index.html'))
for dp, _, fs in os.walk(ROOT):
    for fn in fs:
        if not fn.endswith('.html') or fn == 'booking-embed-placeholder.html': continue
        fp = os.path.join(dp, fn); s = open(fp, encoding='utf-8').read(); pages += 1
        if 'name="robots" content="noindex,nofollow"' not in s: noidx.append(fp)
        body = re.sub(r'<!--.*?-->', '', s, flags=re.S)
        for m in re.finditer(r'<script[^>]+src="(https?:[^"]+)"', body): ext_scripts.append((fp, m.group(1)))
        for m in re.finditer(r'(?:href|src)="([^"]+)"', body):
            u = html.unescape(m.group(1))
            if u.startswith(('http', 'tel:', 'sms:', 'mailto:', '#', 'data:')): continue
            ok = exists(u)
            if ok is None: bad.setdefault(u, []).append(fp)
            elif not ok: bad.setdefault(u, []).append(fp)
print(f'pages {pages}  broken targets {len(bad)}  missing-noindex {len(noidx)}  live external scripts {len(ext_scripts)}')
for u, fps in sorted(bad.items())[:60]: print('  BROKEN', u, '<-', len(fps), 'pages, e.g.', fps[0])
for f in noidx[:10]: print('  NOINDEX MISSING', f)
for f, u in ext_scripts[:10]: print('  EXT SCRIPT', f, u)
sys.exit(1 if bad or noidx or ext_scripts else 0)
