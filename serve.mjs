// Local static server for dist/ with brotli/gzip and long-cache headers (mirrors Cloudflare Pages defaults). Local only.
import http from 'node:http'; import http2 from 'node:http2'; import fs from 'node:fs'; import path from 'node:path'; import zlib from 'node:zlib';
const root = path.resolve('dist'); const port = +(process.env.PORT || 4321);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json' };
const cache = new Map();
const handler = (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  // GitHub Pages serves this folder at /foothills-demo/; strip that prefix locally.
  if (p === '/foothills-demo' || p.startsWith('/foothills-demo/')) p = p.slice('/foothills-demo'.length) || '/';
  let f = path.join(root, p);
  if (!f.startsWith(root)) { res.writeHead(403); res.end(); return; }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = fs.existsSync(path.join(f, 'index.html')) || !fs.existsSync(f + '.html') ? path.join(f, 'index.html') : f + '.html'; // like GitHub Pages: /collections -> collections.html
  else if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f = f + '.html';
  if (!fs.existsSync(f)) { res.writeHead(404, { 'content-type': 'text/plain' }); res.end('Not in demo'); return; }
  const ext = path.extname(f); const body = fs.readFileSync(f);
  const h = { 'content-type': types[ext] || 'application/octet-stream', 'cache-control': p.startsWith('/_assets/') || p.startsWith('/fonts/') ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate', 'x-robots-tag': 'noindex, nofollow' };
  const ae = req.headers['accept-encoding'] || '';
  if (/\.(html|js|css|svg|json)$/.test(ext)) {
    if (ae.includes('br')) {
      const key = f + ':br';
      if (!cache.has(key)) cache.set(key, zlib.brotliCompressSync(body));
      h['content-encoding'] = 'br'; res.writeHead(200, h); res.end(cache.get(key)); return;
    }
    if (ae.includes('gzip')) {
      const key = f + ':gz';
      if (!cache.has(key)) cache.set(key, zlib.gzipSync(body));
      h['content-encoding'] = 'gzip'; res.writeHead(200, h); res.end(cache.get(key)); return;
    }
  }
  res.writeHead(200, h); res.end(body);
};
http.createServer(handler).listen(port, () => console.log('serving dist on http://localhost:' + port));
// HTTP/2 + TLS on port+1 (self-signed, local only) so Lighthouse models a production CDN connection, not HTTP/1.1.
if (fs.existsSync('.cert/key.pem')) http2.createSecureServer({ key: fs.readFileSync('.cert/key.pem'), cert: fs.readFileSync('.cert/cert.pem'), allowHTTP1: true }, handler)
  .listen(port + 1, () => console.log('serving dist on https://localhost:' + (port + 1) + ' (HTTP/2)'));
