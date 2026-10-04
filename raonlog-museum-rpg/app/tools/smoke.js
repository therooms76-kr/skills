// smoke.js — 자동 점검. 로컬 서버를 띄우고 복도 → 전시실 → 진열장 → 글 읽기 → 도장 → 저장, 그리고 M4 발견 장치까지 돌려 본다.
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
  await new Promise(r => server.listen(0, r)); const port = server.address().port; const base = `http://127.0.0.1:${port}/index.html`;
  const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
  const b = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1000, height: 800 } }); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/ERR_CERT|fonts/.test(m.text())) errs.push('console: ' + m.text()); });
  const fail = msg => { console.error('FAIL', msg); process.exitCode = 1; };
  const ok = msg => console.log('ok', msg);
  const ev = fn => p.evaluate(fn);
  try {
    // 수요일 18:30 으로 시간을 고정해 도슨트까지 점검한다 (2026-10-07 수요일)
    await p.goto(base + '?now=2026-10-07T18:30:00'); await p.waitForFunction(() => window.__museum, null, { timeout: 8000 });
    await ev(() => localStorage.clear()); await p.reload(); await p.waitForFunction(() => window.__museum);
    const doors = await ev(() => window.__museum.app.doors.map(d => d.id)); if (doors.length !== 7 || !doors.includes('sp-three-bowls')) fail(`문 7개(특별전 포함)가 아님: ${doors}`); else ok('복도 문 7개 (특별전 1)');
    await p.locator('polygon[data-door="adventure"]').click(); await p.waitForTimeout(2600);
    if ((await ev(() => window.__museum.app.scene)) !== 'hall') fail('전시실 진입 실패'); else ok('전시실 진입');
    await p.locator('.case').first().click(); await p.waitForTimeout(1800);
    if (!(await ev(() => window.__museum.app.viewer.v.classList.contains('on')))) fail('미리보기 창이 열리지 않음'); else ok('미리보기');
    const docentShown = await ev(() => !document.querySelector('[data-docent]').hidden && document.querySelectorAll('[data-docent] .qa').length === 5);
    if (!docentShown) fail('수요일 도슨트 패널이 안 보임'); else ok('수요일 도슨트 (질문 5개, +25)');
    await p.locator('[data-read]').click(); await p.waitForTimeout(200);
    await ev(() => { const b = document.querySelector('[data-body]'); b.scrollTop = b.scrollHeight; b.dispatchEvent(new Event('scroll')); }); await p.waitForTimeout(300);
    let st = await ev(() => ({ stamps: window.__museum.passport.s.stamps.length, pts: window.__museum.passport.s.pts }));
    if (st.stamps !== 1 || st.pts !== 35) fail(`도장/점수 이상 (도장 10 + 도슨트 25 기대): ${JSON.stringify(st)}`); else ok('도장 +10');
    await p.locator('[data-back]').click(); await p.locator('[data-close]').click(); await p.waitForTimeout(200);
    // 수장고 상자 (나들이 방에 vault 글 1편)
    const vaultVisible = await ev(() => !document.querySelector('[data-vault]').hidden); if (!vaultVisible) fail('수장고 상자가 안 보임'); else ok('수장고 상자 표시');
    await p.locator('[data-vault]').click(); await p.waitForTimeout(2200);
    const vaultOpen = await ev(() => window.__museum.app.viewer.v.classList.contains('on') && /FROM THE VAULT/.test(document.querySelector('[data-meta]').textContent));
    if (!vaultOpen) fail('수장고 글이 열리지 않음'); else ok('수장고 상자 → 1년 전 글 (+25)');
    await p.locator('[data-close]').click(); await p.waitForTimeout(100);
    // 특별전 문
    await ev(() => window.__museum.app.leave()); await p.waitForTimeout(600);
    await p.locator('polygon[data-door="sp-three-bowls"]').click(); await p.waitForTimeout(2600);
    const sp = await ev(() => ({ scene: window.__museum.app.scene, hall: window.__museum.app.hall && window.__museum.app.hall.id, cases: document.querySelectorAll('.case').length, stmt: !document.querySelector('[data-statement]').hidden }));
    if (sp.scene !== 'hall' || sp.hall !== 'sp-three-bowls' || sp.cases !== 3 || !sp.stmt) fail(`특별전 진입 이상: ${JSON.stringify(sp)}`); else ok('특별전 입장 (글 3편, 기획 의도 표시, +25)');
    await p.reload(); await p.waitForFunction(() => window.__museum);
    st = await ev(() => ({ stamps: window.__museum.passport.s.stamps.length, found: window.__museum.passport.s.found.length }));
    if (st.stamps !== 1 || st.found < 3) fail(`새로고침 뒤 여권 이상: ${JSON.stringify(st)}`); else ok(`여권 저장 (도장 ${st.stamps}, 발견 ${st.found})`);
    // 기간 밖이면 특별전 문이 사라지는지
    await p.goto(base + '?now=2027-01-15T12:00:00'); await p.waitForFunction(() => window.__museum);
    const doors2 = await ev(() => window.__museum.app.doors.length); if (doors2 !== 6) fail(`기간 밖인데 특별전 문이 남음: ${doors2}`); else ok('기간이 지나면 특별전 문 사라짐');
    await p.goto(base + '?now=2026-10-07T18:30:00'); await p.waitForFunction(() => window.__museum);
    await p.screenshot({ path: path.join(__dirname, 'smoke.png') });
  } catch (e) { fail(e.message); }
  if (errs.length) fail('페이지 오류: ' + errs.join(' | '));
  await b.close(); server.close(); console.log(process.exitCode ? 'SMOKE FAILED' : 'SMOKE PASSED');
})();
