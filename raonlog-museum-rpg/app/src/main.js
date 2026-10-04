// main.js — 시작점. ?theme=이름 으로 테마를, ?data=경로 로 전시 데이터를 바꿀 수 있다.
import { loadTheme } from './theme.js';
import { loadMuseum, loadExhibitions } from './data.js';
import { Passport } from './passport.js';
import { Museum } from './engine.js';

const params = new URLSearchParams(location.search);
const themeName = params.get('theme') || document.body.dataset.theme || 'default';
const dataUrl = params.get('data') || document.body.dataset.data || './data/museum.json';
const exUrl = params.get('exhibitions') || document.body.dataset.exhibitions || './data/exhibitions.json';
const now = params.get('now') ? new Date(params.get('now')) : new Date(); // ?now=2026-10-07T18:30 으로 시간을 바꿔 점검할 수 있다

(async () => {
  const root = document.querySelector('[data-museum]');
  const passEl = document.querySelector('[data-passport]');
  try {
    const [theme, museum] = await Promise.all([loadTheme(themeName), loadMuseum(dataUrl)]);
    await loadExhibitions(museum, exUrl, now);
    document.title = museum.title;
    const passport = new Passport(passEl, { museum, theme, onChange: () => app && app.render() });
    var app = new Museum(root, { museum, theme, passport });
    window.__museum = { app, passport, theme, museum }; // 자동 점검용
  } catch (e) {
    root.innerHTML = `<div class="error">박물관을 열지 못했습니다: ${String(e.message || e)}<br><small>data/museum.json이 있는지, 로컬 서버로 열었는지 확인하세요 (file:// 로는 fetch가 막힙니다).</small></div>`;
    console.error(e);
  }
})();
