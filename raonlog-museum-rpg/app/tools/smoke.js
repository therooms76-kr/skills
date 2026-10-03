// smoke.js — 자동 점검. 로컬 서버를 띄우고 복도 → 전시실 → 진열장 → 글 읽기 → 도장까지 돌려 본다.
// 사용: node tools/smoke.js   (Playwright와 Chromium이 필요. 세션 환경에는 /opt/pw-browsers/chromium이 있다)
const { chromium } = require('playwright');
const http = require('http'); const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.md': 'text/plain' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); res.end('nf'); return; } res.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); res.end(d); });
});
(async () => {
  await new Promise(r => server.listen(0, r)); const port = server.address().port; const url = `http://127.0.0.1:${port}/index.html`;
  const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
  const b = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1000, height: 800 } }); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/ERR_CERT|fonts/.test(m.text())) errs.push('console: ' + m.text()); });
  const fail = msg => { console.error('FAIL', msg); process.exitCode = 1; };
  try {
    await p.goto(url); await p.waitForFunction(() => window.__museum, null, { timeout: 8000 });
    await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForFunction(() => window.__museum);
    const doors = await p.evaluate(() => window.__museum.app.doors.length); if (doors !== 6) fail(`문이 6개가 아님: ${doors}`); else console.log('ok 복도 문 6개');
    await p.locator('polygon[data-door="adventure"]').click(); await p.waitForTimeout(2600);
    const scene = await p.evaluate(() => window.__museum.app.scene); if (scene !== 'hall') fail(`전시실 진입 실패: ${scene}`); else console.log('ok 전시실 진입');
    await p.locator('.case').first().click(); await p.waitForTimeout(1800);
    const open = await p.evaluate(() => window.__museum.app.viewer.v.classList.contains('on')); if (!open) fail('미리보기 창이 열리지 않음'); else console.log('ok 미리보기');
    await p.locator('[data-read]').click(); await p.waitForTimeout(200);
    await p.evaluate(() => { const b = document.querySelector('[data-body]'); b.scrollTop = b.scrollHeight; b.dispatchEvent(new Event('scroll')); }); await p.waitForTimeout(300);
    const st = await p.evaluate(() => ({ stamps: window.__museum.passport.s.stamps.length, pts: window.__museum.passport.s.pts }));
    if (st.stamps !== 1 || st.pts !== 10) fail(`도장/점수 이상: ${JSON.stringify(st)}`); else console.log('ok 도장 +10');
    await p.reload(); await p.waitForFunction(() => window.__museum);
    const kept = await p.evaluate(() => window.__museum.passport.s.stamps.length); if (kept !== 1) fail('새로고침 뒤 여권이 사라짐'); else console.log('ok 여권 저장');
    await p.locator('[data-exit]').click().catch(() => {});
    await p.screenshot({ path: path.join(__dirname, 'smoke.png') });
  } catch (e) { fail(e.message); }
  if (errs.length) fail('페이지 오류: ' + errs.join(' | '));
  await b.close(); server.close(); console.log(process.exitCode ? 'SMOKE FAILED' : 'SMOKE PASSED');
})();
