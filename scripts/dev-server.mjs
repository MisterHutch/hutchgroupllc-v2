import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import handler from '../api/opportunity-review.js';
import configHandler from '../api/opportunity-review-config.js';
import { createProviderFixture } from './fixtures.mjs';

const root = resolve(import.meta.dirname, '..');
const fixtures = process.argv.includes('--fixtures');
if (fixtures) {
  process.env.SUPABASE_URL = 'https://local-fixture.invalid';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'synthetic-test-key';
  process.env.RESEND_API_KEY = 'synthetic-test-key';
  process.env.TURNSTILE_SITE_KEY = '1x00000000000000000000AA';
  process.env.TURNSTILE_SECRET_KEY = 'synthetic-test-key';
  globalThis.fetch = createProviderFixture().fetch;
}
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (path === '/api/opportunity-review-config') {
    if (!fixtures) { res.writeHead(503); res.end('Local API disabled; run with --fixtures for synthetic testing.'); return; }
    return configHandler(req, res);
  }
  if (path === '/api/opportunity-review') {
    if (!fixtures) { res.writeHead(503); res.end('Local API disabled; run with --fixtures for synthetic testing.'); return; }
    let body = '';
    for await (const chunk of req) { body += chunk; if (body.length > 20000) { res.writeHead(413); res.end(); return; } }
    try { req.body = JSON.parse(body || '{}'); } catch { res.writeHead(400); res.end(); return; }
    return handler(req, res);
  }
  if (path.split('/').some(part => part.startsWith('.') || ['api','docs','scripts','evidence','node_modules'].includes(part))) { res.writeHead(404); res.end(); return; }
  let file = resolve(root, '.' + path);
  if (!file.startsWith(root + '/') && file !== root) { res.writeHead(403); res.end(); return; }
  try {
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    if (!types[extname(file)]) throw new Error('Not a public asset');
    res.setHeader('Content-Type', types[extname(file)] + (['.html','.css','.js'].includes(extname(file)) ? '; charset=utf-8' : ''));
    res.setHeader('Cache-Control', 'no-store');
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(4173, '127.0.0.1', () => console.log(`Local preview: http://127.0.0.1:4173 (${fixtures ? 'SYNTHETIC intake/email providers; no external writes' : 'API disabled'})`));
