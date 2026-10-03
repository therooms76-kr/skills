// theme.js — theme/<name>/theme.json을 읽어 CSS 토큰과 이미지 경로를 적용한다.
// 디자인 교체는 여기서 끝난다: 코드는 theme 객체만 읽는다.

const FALLBACK = {
  name: 'fallback', version: 0,
  tokens: { granite: '#B9B6AE', granite2: '#A5A198', granite3: '#8F8B82', stone: '#D9D4C8', stone2: '#C4BEB0', hall: '#3B3C3A', hall2: '#2E2F2D', hallFloor: '#5B5852', hallFloor2: '#4A4842', label: '#F4F1EA', labelInk: '#2B2B29', spot: 'rgba(255,241,214,.5)', glass: 'rgba(255,255,255,.12)', gold: '#F2D28A', bronze: '#8A6A3B', ok: '#2F7D4A', stamp: '#B23A3A', teal: '#1E7A72' },
  fonts: { display: 'Georgia, serif', body: 'system-ui, sans-serif', googleFonts: null },
  sprites: { cat: null, catPlaceholder: 'pixel', collarColors: ['#D95F5F', '#1E7A72', '#D9B663', '#7B5EA7'] },
  scenes: { corridor: { photo: null, vx: 0.5, vy: 0.42, depth: 5.5, pagoda: true }, hall: { photo: null, caseStyle: 'vitrine', bench: true }, quiet: { photo: null, sitAfterMs: 4000 } },
  labels: { style: 'paper' },
};

export async function loadTheme(name = 'default', base = './theme/') {
  let t = FALLBACK;
  try {
    const res = await fetch(`${base}${name}/theme.json`, { cache: 'no-cache' });
    if (res.ok) t = deepMerge(FALLBACK, await res.json());
  } catch (e) { /* 네트워크가 막혀도 기본 테마로 동작한다 */ }
  t.base = `${base}${name}/`;
  applyTokens(t);
  if (t.fonts.googleFonts) {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = t.fonts.googleFonts; document.head.appendChild(l);
  }
  // 스프라이트 시트가 있으면 미리 읽는다.
  if (t.sprites.cat && t.sprites.cat.sheet) {
    t.sprites.catImage = await loadImage(resolve(t.base, t.sprites.cat.sheet)).catch(() => null);
  }
  for (const k of ['corridor', 'hall', 'quiet']) {
    const sc = t.scenes[k]; if (sc.photo) sc.photoUrl = resolve(t.base, sc.photo);
  }
  return t;
}

function applyTokens(t) {
  const root = document.documentElement.style;
  for (const [k, v] of Object.entries(t.tokens)) root.setProperty(`--m-${k}`, v);
  root.setProperty('--m-font-display', t.fonts.display);
  root.setProperty('--m-font-body', t.fonts.body);
}

function resolve(base, p) { return /^(https?:)?\//.test(p) ? p : base + p; }
function loadImage(src) { return new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; }); }
function deepMerge(a, b) {
  if (Array.isArray(a) || Array.isArray(b) || typeof a !== 'object' || typeof b !== 'object' || !a || !b) return b === undefined ? a : b;
  const out = { ...a }; for (const k of Object.keys(b)) out[k] = deepMerge(a[k], b[k]); return out;
}
