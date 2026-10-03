// engine.js — 상태·입력·장면 전환·렌더 루프. 그림은 scenes.js, 고양이는 sprite.js, 창은 viewer.js가 맡는다.
import { makeProjection } from './projection.js';
import { CatSprite } from './sprite.js';
import { buildCorridor, buildHall, buildQuiet } from './scenes.js';
import { Viewer } from './viewer.js';

export class Museum {
  constructor(root, { museum, theme, passport }) {
    this.root = root; this.museum = museum; this.theme = theme; this.passport = passport;
    this.proj = makeProjection(theme.scenes.corridor);
    this.scene = 'corr'; this.hall = null; this.cat = { t: 0.02, lat: 0.5, x: 0.12, y: 0.85, dir: 1, step: 0, moving: false };
    this.target = null; this.keys = {}; this.sat = false; this.quietT = null;
    this.mount(); this.bind();
    this.viewer = new Viewer(this.stage, { museum, passport, onNavigate: p => this.openPost(p, true), onClose: () => this.stage.focus(), say: t => this.say(t) });
    this.doors = buildCorridor(this.corrEls, museum, theme, this.proj.P, passport);
    this.applyPhoto(); this.render();
    let last = 0; const loop = ts => { this.tick(Math.min(40, ts - last)); last = ts; requestAnimationFrame(loop); }; requestAnimationFrame(ts => { last = ts; loop(ts); });
  }
  mount() {
    this.root.innerHTML = `
      <div class="top"><span class="crumb" data-crumb><b>입구</b> › 역사의 길</span><span class="muted" data-help>↑ 앞으로 · ← → 좌우 · 문 앞에서 Enter 또는 탭</span>
        <span><a class="btn" data-list ${this.museum.listUrl ? `href="${this.museum.listUrl}"` : 'hidden'}>수장고 (글 목록)</a> <button class="btn" data-reset>처음부터</button></span></div>
      <div class="stage" data-stage tabindex="0" aria-label="박물관. 방향키로 고양이를 움직이세요.">
        <div class="scene corr on" data-scene="corr"><div class="photo" data-photo></div><svg class="drawn" data-svg viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true"></svg><svg class="over" data-over viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true"></svg><div class="signs" data-signs></div></div>
        <div class="scene hall" data-scene="hall"><div class="photo" data-photo></div><div class="wall"></div><div class="cove"></div><div class="skirt"></div><div class="floor"></div><div class="hsign" data-hsign></div><div data-spots></div><div data-cases></div><div class="bench" data-bench></div><button class="exit" data-exit><span>역사의 길로</span></button></div>
        <div class="scene quiet" data-scene="quiet"><div class="photo" data-photo></div><div class="bg"></div><div class="stars"></div><div class="halo"></div><div class="slope"></div><button class="one" data-one aria-label="한 점 보기"><div class="art" data-qart></div></button><div class="word" data-word>두루 깊이 생각하고 · 너그러이 살피는</div><button class="exit" data-qexit><span>나가기</span></button></div>
        <canvas class="cat" data-cat width="16" height="16"></canvas><div class="bubble" data-bubble></div><div class="hud" data-hud></div><div class="fade" data-fade></div>
      </div>
      <div class="ctl"><div class="pad"><span></span><button data-k="up" aria-label="앞으로">▲</button><span></span><button data-k="left" aria-label="왼쪽">◀</button><button data-k="down" aria-label="뒤로">▼</button><button data-k="right" aria-label="오른쪽">▶</button></div><button class="act" data-act>들어가기 / 보기</button><small class="muted">복도에서 ▲는 안쪽으로, ▼는 입구 쪽으로. 바닥을 탭해도 걸어갑니다.</small></div>`;
    const q = s => this.root.querySelector(s); this.q = q; this.stage = q('[data-stage]');
    const sc = n => this.root.querySelector(`[data-scene="${n}"]`);
    this.corrEls = { el: sc('corr'), svg: sc('corr').querySelector('[data-svg]'), over: sc('corr').querySelector('[data-over]'), signs: sc('corr').querySelector('[data-signs]'), photoEl: sc('corr').querySelector('[data-photo]') };
    this.hallEls = { el: sc('hall'), signEl: q('[data-hsign]'), spots: q('[data-spots]'), cases: q('[data-cases]'), photoEl: sc('hall').querySelector('[data-photo]'), bench: q('[data-bench]'), exit: q('[data-exit]') };
    this.quietEls = { el: sc('quiet'), art: q('[data-qart]'), photoEl: sc('quiet').querySelector('[data-photo]'), word: q('[data-word]'), exit: q('[data-qexit]'), one: q('[data-one]') };
    this.catEl = q('[data-cat]'); this.sprite = new CatSprite(this.catEl, this.theme); this.bubble = q('[data-bubble]'); this.hud = q('[data-hud]');
    buildQuiet(this.quietEls, this.museum, this.theme);
  }
  bind() {
    const KM = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', a: 'left', d: 'right', w: 'up', s: 'down' };
    this.stage.addEventListener('keydown', e => { if (this.viewer.isOpen()) { if (e.key === 'Escape') this.viewer.close(); if (this.viewer.v.classList.contains('on')) { if (e.key === 'ArrowLeft') this.viewer.nav(-1); if (e.key === 'ArrowRight') this.viewer.nav(1); } e.preventDefault(); return; } const k = KM[e.key]; if (k) { this.keys[k] = true; e.preventDefault(); } if (e.key === 'Enter' || e.key === ' ') { this.act(); e.preventDefault(); } });
    this.stage.addEventListener('keyup', e => { const k = KM[e.key]; if (k) this.keys[k] = false; });
    this.stage.addEventListener('click', e => {
      if (this.viewer.isOpen()) return; this.stage.focus();
      const r = this.stage.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      if (this.scene === 'corr') { const el = e.target.closest && e.target.closest('.doorpoly'); if (el) { const d = this.doors.find(z => z.id === el.dataset.door); const lat = d.side === 'L' ? 0.3 : 0.7; this.walkTo({ t: d.t + 0.035, lat }, () => this.enter(d.id)); return; } if (y <= this.proj.vy + 0.02) { this.walkTo(this.proj.unproj(x, this.proj.vy + 0.03)); return; } this.walkTo(this.proj.unproj(x, y)); return; }
      const c = e.target.closest && e.target.closest('.case'); if (c) { const p = this.hall.posts.find(z => z.id === c.dataset.id); this.walkTo({ x: p._x, y: 0.78 }, () => this.openPost(p)); return; }
      if (e.target.closest && e.target.closest('[data-exit],[data-qexit]')) { this.walkTo({ x: 0.06, y: 0.86 }, () => this.leave()); return; }
      if (e.target.closest && e.target.closest('[data-one]')) { this.walkTo({ x: 0.5, y: 0.82 }); return; }
      this.walkTo({ x, y });
    });
    this.root.querySelectorAll('.pad button').forEach(b => { const k = b.dataset.k; const on = e => { e.preventDefault(); this.keys[k] = true; this.stage.focus(); }, off = () => { this.keys[k] = false; }; b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off); b.addEventListener('pointercancel', off); });
    this.q('[data-act]').onclick = () => { this.stage.focus(); this.act(); };
    this.q('[data-reset]').onclick = () => this.toCorridor(null, true);
    window.addEventListener('resize', () => this.render());
  }
  // ---- 장면 ----
  show(name) { this.scene = name; this.root.querySelectorAll('.scene').forEach(s => s.classList.toggle('on', s.dataset.scene === name)); this.applyPhoto(); this.render(); }
  applyPhoto() { for (const [n, els] of [['corridor', this.corrEls], ['hall', this.hallEls], ['quiet', this.quietEls]]) { const has = !!this.theme.scenes[n].photoUrl; els.el.classList.toggle('hasphoto', has); els.photoEl.classList.toggle('on', has); } }
  fade(fn) { const f = this.q('[data-fade]'); f.classList.add('on'); setTimeout(() => { fn(); setTimeout(() => f.classList.remove('on'), 60); }, 360); }
  enter(id) { if (id === 'quiet') return this.enterQuiet(); const h = this.museum.halls.find(x => x.id === id); if (!h) return; this.fade(() => { this.hall = h; this.passport.visited(id); buildHall(this.hallEls, h, this.theme, this.passport); Object.assign(this.cat, { x: 0.12, y: 0.85, dir: 1 }); this.show('hall'); this.q('[data-crumb]').innerHTML = `<b>${h.no} ${h.kr}</b> › 전시실`; this.q('[data-help]').textContent = '진열장 앞에서 Enter 또는 탭'; this.say(`${h.kr}에 들어왔어요`); }); }
  enterQuiet() { this.fade(() => { this.hall = null; this.passport.visited('quiet'); Object.assign(this.cat, { x: 0.15, y: 0.9, dir: 1 }); this.sat = false; this.quietEls.word.textContent = '두루 깊이 생각하고 · 너그러이 살피는'; this.show('quiet'); this.q('[data-crumb]').innerHTML = '<b>사유의 방</b>'; this.q('[data-help]').textContent = '명판도 버튼도 없습니다. 가까이 가서 잠시 서 있어 보세요'; }); }
  leave() { const d = this.doors.find(x => x.id === (this.hall ? this.hall.id : 'quiet')); this.toCorridor(d); }
  toCorridor(door, reset = false) { this.fade(() => { this.hall = null; clearTimeout(this.quietT); this.quietT = null; this.doors = buildCorridor(this.corrEls, this.museum, this.theme, this.proj.P, this.passport); if (door && !reset) { this.cat.t = door.t + 0.035; this.cat.lat = door.side === 'L' ? 0.3 : 0.7; } else { this.cat.t = 0.02; this.cat.lat = 0.5; } this.show('corr'); this.q('[data-crumb]').innerHTML = reset ? '<b>입구</b> › 역사의 길' : '<b>역사의 길</b>'; this.q('[data-help]').textContent = '↑ 앞으로 · ← → 좌우 · 문 앞에서 Enter 또는 탭'; }); }
  // ---- 근접 ----
  nearDoor() { if (this.scene !== 'corr') return null; let best = null, bd = 1; for (const d of this.doors) { const dt = Math.abs((d.t + 0.035) - this.cat.t); const ok = d.side === 'L' ? this.cat.lat < 0.35 : this.cat.lat > 0.65; if (dt < 0.06 && ok && dt < bd) { bd = dt; best = d; } } return best; }
  nearCase() { if (this.scene !== 'hall' || this.cat.y > 0.86) return null; let best = null, bd = 1; for (const p of this.hall.posts) { const d = Math.abs(p._x - this.cat.x); if (d < 0.055 && d < bd) { bd = d; best = p; } } return best; }
  nearExit() { return (this.scene === 'hall' || this.scene === 'quiet') && this.cat.x < 0.12; }
  act() { if (this.viewer.isOpen()) return; if (this.scene === 'corr') { const d = this.nearDoor(); d ? this.enter(d.id) : this.say('벽 쪽의 전시실 문 앞으로 가 보세요'); return; } if (this.nearExit()) return this.leave(); if (this.scene === 'hall') { const p = this.nearCase(); p ? this.openPost(p) : this.say('진열장 앞으로 가 보세요'); } }
  openPost(p, jump = false) { if (jump && p.hall !== this.hall) { this.hall = p.hall; this.passport.visited(p.hall.id); buildHall(this.hallEls, p.hall, this.theme, this.passport); this.show('hall'); this.q('[data-crumb]').innerHTML = `<b>${p.hall.no} ${p.hall.kr}</b> › 전시실`; } if (jump) { this.cat.x = p._x; this.cat.y = 0.78; } this.viewer.open(p); buildHall(this.hallEls, this.hall, this.theme, this.passport); this.render(); }
  // ---- 이동 ----
  walkTo(to, cb) { this.target = { ...to, cb }; }
  tick(dt) {
    let moving = false; const k = this.keys, c = this.cat;
    if (this.scene === 'corr') { let vt = 0, vl = 0; const sp = 0.00035 * dt; if (k.up) vt += sp; if (k.down) vt -= sp; if (k.left) vl -= sp * 1.6; if (k.right) vl += sp * 1.6;
      if (vt || vl) this.target = null; else if (this.target) { const dt2 = this.target.t - c.t, dl = this.target.lat - c.lat, d = Math.hypot(dt2, dl); if (d < 0.006) { c.t = this.target.t; c.lat = this.target.lat; const cb = this.target.cb; this.target = null; cb && cb(); } else { vt = dt2 / d * sp; vl = dl / d * sp * 1.2; } }
      moving = !!(vt || vl); if (moving) { c.t = Math.min(0.92, Math.max(0, c.t + vt)); c.lat = Math.min(0.95, Math.max(0.05, c.lat + vl)); if (vl) c.dir = vl < 0 ? -1 : 1; }
    } else { let vx = 0, vy = 0; const sp = 0.00045 * dt; if (k.left) vx -= sp; if (k.right) vx += sp; if (k.up) vy -= sp * 1.2; if (k.down) vy += sp * 1.2;
      if (vx || vy) this.target = null; else if (this.target) { const dx = this.target.x - c.x, dy = this.target.y - c.y, d = Math.hypot(dx, dy); if (d < 0.008) { c.x = this.target.x; c.y = this.target.y; const cb = this.target.cb; this.target = null; cb && cb(); } else { vx = dx / d * sp; vy = dy / d * sp; } }
      moving = !!(vx || vy); if (moving) { c.x = Math.min(0.97, Math.max(0.03, c.x + vx)); c.y = Math.min(0.95, Math.max(0.62, c.y + vy)); if (vx) c.dir = vx < 0 ? -1 : 1; } }
    if (moving) { this.acc = (this.acc || 0) + dt; if (this.acc > 110) { this.acc = 0; c.step++; } }
    if (moving !== c.moving || moving) { c.moving = moving; this.render(); }
    this.quietCheck();
  }
  quietCheck() { if (this.scene !== 'quiet') return; const near = Math.abs(this.cat.x - 0.5) < 0.08 && this.cat.y < 0.9; if (near && !this.cat.moving) { if (!this.quietT && !this.sat) this.quietT = setTimeout(() => { this.sat = true; this.quietEls.word.textContent = '… 메시가 앉았습니다'; this.passport.found('quiet', '사유의 방에서 잠시 머물렀습니다. 조용한 발견.'); this.render(); }, this.theme.scenes.quiet.sitAfterMs); } else { clearTimeout(this.quietT); this.quietT = null; } }
  // ---- 그리기 ----
  say(t) { this.bubble.textContent = t; this.bubble.classList.add('on'); clearTimeout(this.sayT); this.sayT = setTimeout(() => this.bubble.classList.remove('on'), 1800); }
  render() {
    const W = this.stage.clientWidth, H = this.stage.clientHeight, c = this.cat; let px, py, sc;
    if (this.scene === 'corr') { const q = this.proj.proj(c.t, c.lat); px = q.x * W; py = q.y * H; sc = Math.max(0.28, q.s) * 1.05; this.doorOverlay(); } else { px = c.x * W; py = c.y * H; sc = 1; }
    const size = 46 * sc; Object.assign(this.catEl.style, { width: `${size}px`, height: `${size}px`, left: `${px}px`, top: `${py}px` });
    const pose = (this.scene === 'quiet' && this.sat && !c.moving) ? 'sit' : (c.moving ? 'walk' : 'stand');
    this.sprite.draw(pose, c.step, c.dir, this.passport.collarColor());
    const nc = this.nearCase(); this.hallEls.cases.querySelectorAll('.case').forEach(el => el.classList.toggle('near', !!nc && el.dataset.id === nc.id));
    this.hallEls.exit.classList.toggle('near', this.scene === 'hall' && this.nearExit()); this.quietEls.exit.classList.toggle('near', this.scene === 'quiet' && this.nearExit());
    const s = this.passport.s; this.hud.textContent = `SEEN ${s.stamps.length}/${this.museum.posts.length} · FOUND ${s.found.length} · HALLS ${s.visited.length}/${this.museum.halls.length + (this.museum.quiet ? 1 : 0)}`;
    Object.assign(this.bubble.style, { left: `${px}px`, top: `${py - size - 6}px` });
  }
  doorOverlay() { const nd = this.nearDoor(); let s = ''; if (nd) { const lat = nd.side === 'L' ? 0 : 1, P = this.proj.P; s = `<polygon points="${[P(nd.t, lat, 0), P(nd.t + 0.07, lat, 0), P(nd.t + 0.07, lat, 0.62), P(nd.t, lat, 0.62)].map(p => p.join(',')).join(' ')}" fill="none" stroke="${this.theme.tokens.gold}" stroke-width="4"/>`; } this.corrEls.over.innerHTML = s; this.corrEls.signs.querySelectorAll('.sign').forEach(el => el.classList.toggle('near', !!nd && el.dataset.id === nd.id)); }
}
