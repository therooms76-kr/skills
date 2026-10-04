// scenes.js — 복도(역사의 길) · 전시실 · 사유의 방을 그린다. 배경은 테마가 정한다(그림 또는 사진).
import { artCSS, esc } from './viewer.js';

function poly(pts, fill, stroke, extra = '') { return `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${fill}" ${stroke ? `stroke="${stroke}" stroke-width="1.5"` : ''} ${extra}/>`; }

export function buildCorridor({ svg, over, signs, photoEl }, museum, theme, P, passport) {
  const T = theme.tokens, sc = theme.scenes.corridor, vx = sc.vx * 1600, vy = sc.vy * 900;
  let s = `<defs><linearGradient id="m-fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${T.granite}"/><stop offset="1" stop-color="${T.granite3}"/></linearGradient><linearGradient id="m-ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0ECE3"/><stop offset="1" stop-color="${T.stone2}"/></linearGradient><linearGradient id="m-wl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${T.stone}"/><stop offset="1" stop-color="${T.granite2}"/></linearGradient><linearGradient id="m-wr" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="${T.stone}"/><stop offset="1" stop-color="${T.granite2}"/></linearGradient><radialGradient id="m-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFF8E6" stop-opacity=".9"/><stop offset="1" stop-color="#FFF8E6" stop-opacity="0"/></radialGradient></defs>`;
  s += `<rect width="1600" height="900" fill="${T.granite3}"/>`;
  s += poly([[0, 900], [1600, 900], [vx, vy]], 'url(#m-fl)') + poly([[0, 0], [1600, 0], [vx, vy]], 'url(#m-ce)') + poly([[0, 0], [vx, vy], [0, 900]], 'url(#m-wl)') + poly([[1600, 0], [vx, vy], [1600, 900]], 'url(#m-wr)');
  for (let t = 0.02; t < 0.9; t += 0.06) { const a = P(t, 0, 0), b = P(t, 1, 0); s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#7F7B72" stroke-opacity=".45" stroke-width="1.2"/>`; }
  [0.25, 0.5, 0.75].forEach(l => { const a = P(0, l, 0), b = P(0.95, l, 0); s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#7F7B72" stroke-opacity=".3"/>`; });
  for (let t = 0.03; t < 0.85; t += 0.11) s += poly([P(t, 0.42, 1), P(t, 0.58, 1), P(t + 0.02, 0.58, 1), P(t + 0.02, 0.42, 1)], '#FFF9EA', '', 'opacity=".85"');
  [0, 1].forEach(l => { const a = P(0, l, 0.28), b = P(0.95, l, 0.28); s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${T.granite3}" stroke-width="1.5"/>`; });
  if (sc.pagoda) {
    const end = P(0.93, 0.5, 0), es = 1 / (1 + 0.93 * sc.depth), pw = 170 * es * 3, ph = 600 * es * 3;
    s += `<g transform="translate(${end[0] - pw / 2},${end[1] - ph})">`;
    for (let i = 0; i < 10; i++) { const w = pw * (1 - i * 0.075), hh = ph / 10, y = ph - hh * (i + 1); s += `<rect x="${(pw - w) / 2}" y="${y}" width="${w}" height="${hh * 0.55}" fill="#B7B2A6" stroke="${T.granite3}"/><rect x="${(pw - w * 1.25) / 2}" y="${y + hh * 0.55}" width="${w * 1.25}" height="${hh * 0.2}" fill="${T.granite2}" stroke="${T.granite3}"/>`; }
    s += `</g><ellipse cx="${end[0]}" cy="${end[1] - ph * 0.5}" rx="${pw * 1.6}" ry="${ph * 0.7}" fill="url(#m-glow)" opacity=".5"/>`;
  }
  const doors = museum.halls.map(h => ({ id: h.id, side: h.side, t: h.t, label: `${h.no} ${h.kr}`, sub: h.en }));
  // 특별전 문: 기간 안에만 복도에 나타난다 (exhibitions.json)
  (museum.exhibitions.special || []).forEach(x => doors.push({ id: x.id, side: x.side, t: x.t, label: `특별전 · ${x.kr}`, sub: x.to ? `~ ${x.to}` : x.en, special: true }));
  if (museum.quiet) doors.push({ id: 'quiet', side: 'R', t: 0.80, label: '사유의 방', sub: 'QUIET CONTEMPLATION', quiet: true });
  let d2 = '';
  doors.forEach(d => {
    const lat = d.side === 'L' ? 0 : 1;
    d2 += poly([P(d.t, lat, 0), P(d.t + 0.07, lat, 0), P(d.t + 0.07, lat, 0.62), P(d.t, lat, 0.62)], d.quiet ? '#050505' : d.special ? '#3A2A1E' : '#1D1E1C', d.special ? '#C9A263' : '#6E6A62', `data-door="${d.id}" class="doorpoly"`);
    if (d.special) d2 += poly([P(d.t - 0.004, lat, 0.62), P(d.t + 0.074, lat, 0.62), P(d.t + 0.074, lat, 0.72), P(d.t - 0.004, lat, 0.72)], '#8A2E2E', '#5A1E1E'); // 특별전 현수막
    d2 += poly([P(d.t + 0.01, lat, 0.5), P(d.t + 0.06, lat, 0.5), P(d.t + 0.06, lat, 0.58), P(d.t + 0.01, lat, 0.58)], '#2B2B29', '#8C877D');
    d.sign = P(d.t + 0.035, lat, 0.66); d.s = 1 / (1 + d.t * sc.depth);
  });
  svg.innerHTML = s + d2;
  signs.innerHTML = doors.map(d => { const k = Math.max(0.62, d.s * 1.4); return `<div class="sign ${passport.has('visited', d.id) ? 'done' : ''} ${d.special ? 'special' : ''}" data-id="${d.id}" style="left:${d.sign[0] / 16}%;top:${d.sign[1] / 9}%;font-size:${9 * k}px">${esc(d.label)}<small style="font-size:${7 * k}px">${esc(d.sub)}</small></div>`; }).join('');
  if (sc.photoUrl) photoEl.style.backgroundImage = `url("${sc.photoUrl}")`;
  return doors;
}

export function buildHall({ signEl, spots, cases, photoEl, bench, vault, statement }, hall, theme, passport, docentFor) {
  const sc = theme.scenes.hall;
  signEl.innerHTML = `${esc(hall.no)}<b>${esc(hall.kr)}</b><small>${esc(hall.en)}</small>${hall.special && hall.to ? `<small>~ ${esc(hall.to)}</small>` : ''}`;
  statement.hidden = !(hall.special && hall.statement); if (hall.special) statement.textContent = hall.statement;
  const n = hall.posts.length; let sp = '', cs = '';
  hall.posts.forEach((p, i) => {
    const left = 24 + (60 * (i + 0.5) / n); p._x = left / 100;
    sp += `<div class="spot" style="left:${left}%"></div>`;
    const unl = p.unlabeled && !passport.has('found', p.id);
    const dc = docentFor ? docentFor(p.id) : null;
    const tag = dc ? `<span class="docent-tag ${dc.active ? 'on' : ''}">${dc.active ? '도슨트 진행 중' : esc(dc.label)}</span>` : '';
    cs += `<button class="case ${sc.caseStyle} ${unl ? 'unlabeled' : ''} ${passport.has('stamps', p.id) ? 'seen' : ''}" style="left:${left}%" data-id="${p.id}" aria-label="${unl ? '이름표 없는 진열장' : esc(p.title)}">
      ${tag}<div class="glass"><div class="obj"><div class="art" style="${artCSS(p)}"></div></div><div class="label"><b>${esc(p.title)}</b>${esc(p.date)} · ${esc(p.place)}<i>${esc(p.material)}</i></div></div><div class="ped"></div></button>`;
  });
  spots.innerHTML = sp; cases.innerHTML = cs; bench.hidden = !sc.bench;
  // 수장고 상자: vault 글이 있는 전시실에만 놓인다
  const hasVault = hall.vault && hall.vault.length > 0; vault.hidden = !hasVault;
  if (hasVault) { const opened = hall.vault.every(v => passport.has('opened', v.id)); vault.classList.toggle('open', opened); vault.querySelector('span').textContent = opened ? '수장고 · 꺼내 본 글' : '수장고 상자'; }
  if (sc.photoUrl) photoEl.style.backgroundImage = `url("${sc.photoUrl}")`;
}

export function buildQuiet({ art, photoEl }, museum, theme) {
  if (museum.quiet) art.style.cssText = artCSS(museum.quiet);
  if (theme.scenes.quiet.photoUrl) photoEl.style.backgroundImage = `url("${theme.scenes.quiet.photoUrl}")`;
}
