// viewer.js — 미리보기 창(D5 b)과 글 읽기 화면. 글을 끝까지 스크롤하면 도장.
import { related, RELATION_LABEL } from './data.js';

export function artCSS(p) {
  if (p.cover) return `background:url("${p.cover}") center/cover no-repeat`;
  const c = p.art; return `background:radial-gradient(circle at 70% 25%,${c[2]} 0 9%,transparent 10%),linear-gradient(180deg,${c[0]} 0 55%,${c[1]} 55% 100%)`;
}

export class Viewer {
  constructor(stage, { museum, passport, onNavigate, onClose, say }) {
    this.museum = museum; this.passport = passport; this.onNavigate = onNavigate; this.onCloseCb = onClose; this.say = say;
    stage.insertAdjacentHTML('beforeend', `
      <div class="viewer" data-viewer role="dialog" aria-modal="true" aria-label="작품 보기">
        <button class="close" data-close aria-label="닫기">×</button>
        <div class="card">
          <div><div class="img"><div data-img></div></div><div class="lab" data-lab></div></div>
          <div><h3 data-title></h3><div class="vm" data-meta></div><p data-summary></p>
            <div class="btns"><button data-prev>◀ 이전</button><button data-next>다음 ▶</button><button class="primary" data-read>글 전체 읽기</button></div>
            <div class="rel"><h4>이어 보기</h4><div class="chips" data-rel></div></div></div>
        </div>
      </div>
      <div class="reader" data-reader role="dialog" aria-modal="true" aria-label="글 읽기">
        <div class="rtop"><span data-crumb></span><button data-back>← 전시실로</button></div>
        <div class="prog"><i data-prog></i></div>
        <div class="body" data-body><h3 data-rtitle></h3><div class="m" data-rmeta></div><div data-rtext></div></div>
        <div class="note"><span data-note></span><span><a data-open target="_self" class="btn-link" hidden>원문 페이지로</a> <button data-rnext>다음 글 ▶</button></span></div>
      </div>`);
    const q = s => stage.querySelector(s);
    this.v = q('[data-viewer]'); this.r = q('[data-reader]'); this.cur = null;
    q('[data-close]').onclick = () => this.close(); q('[data-prev]').onclick = () => this.nav(-1); q('[data-next]').onclick = () => this.nav(1);
    q('[data-read]').onclick = () => this.openReader(this.cur); q('[data-back]').onclick = () => { this.r.classList.remove('on'); this.v.classList.add('on'); };
    q('[data-rnext]').onclick = () => { this.nav(1); this.openReader(this.cur); };
    q('[data-body]').addEventListener('scroll', () => this.checkRead());
    this.q = q;
  }
  isOpen() { return this.v.classList.contains('on') || this.r.classList.contains('on'); }
  open(p) {
    this.cur = p; this.passport.opened(p.id);
    if (p.unlabeled && !this.passport.has('found', p.id)) this.passport.found(p.id, '이름표 없는 진열장을 찾았습니다. 명판이 붙습니다.');
    const q = this.q;
    q('[data-img]').style.cssText = artCSS(p);
    q('[data-lab]').innerHTML = `<b>${esc(p.title)}</b><br>${esc(p.date)} · ${esc(p.place)}<br>${esc(p.material)}`;
    q('[data-title]').textContent = p.title; q('[data-meta]').textContent = `${p.hall.no} ${p.hall.kr} · ${p.hall.en}`; q('[data-summary]').textContent = p.summary;
    const rel = q('[data-rel]'); rel.innerHTML = '';
    const rs = related(this.museum, p).filter(({ q: x }) => !(x.unlabeled && !this.passport.has('found', x.id)));
    if (!rs.length) rel.innerHTML = '<div class="muted">연결된 글이 아직 없습니다.</div>';
    rs.forEach(({ q: x, why }) => { const b = document.createElement('button'); b.innerHTML = `<span>${esc(x.title)}${x.hall !== p.hall ? ` <small>${esc(x.hall.kr)}</small>` : ''}</span><em>${RELATION_LABEL[why]}</em>`; b.onclick = () => this.onNavigate(x); rel.appendChild(b); });
    this.r.classList.remove('on'); this.v.classList.add('on'); q('[data-close]').focus();
    this.say(this.passport.has('stamps', p.id) ? '다시 왔네요' : '여기 보세요');
  }
  close() { this.v.classList.remove('on'); this.r.classList.remove('on'); this.onCloseCb(); }
  nav(d) { const ps = this.cur.hall.posts; const i = ps.findIndex(x => x.id === this.cur.id); this.onNavigate(ps[(i + d + ps.length) % ps.length]); }
  openReader(p) {
    const q = this.q; this.cur = p; this.v.classList.remove('on'); this.r.classList.add('on');
    q('[data-crumb]').textContent = `${p.hall.no} ${p.hall.kr} › 글 읽기`; q('[data-rtitle]').textContent = p.title; q('[data-rmeta]').textContent = `${p.date} · ${p.place}`;
    q('[data-rtext]').innerHTML = p.text.length ? p.text.map(t => `<p>${esc(t)}</p>`).join('') : `<p>${esc(p.summary)}</p><p class="muted">본문은 원문 페이지에 있습니다.</p>`;
    const a = q('[data-open]'); if (p.url) { a.href = p.url; a.hidden = false; } else a.hidden = true;
    q('[data-body]').scrollTop = 0; const done = this.passport.has('stamps', p.id);
    q('[data-prog]').style.width = done ? '100%' : '0%'; q('[data-note]').innerHTML = done ? '이미 도장이 찍힌 글입니다.' : '끝까지 읽으면 도장이 찍힙니다.';
    setTimeout(() => this.checkRead(), 50);
  }
  checkRead() {
    const p = this.cur; if (!p || !this.r.classList.contains('on')) return;
    const b = this.q('[data-body]'); const pct = b.scrollHeight <= b.clientHeight + 2 ? 1 : Math.min(1, (b.scrollTop + b.clientHeight) / b.scrollHeight);
    if (this.passport.has('stamps', p.id)) return;
    this.q('[data-prog]').style.width = `${pct * 100}%`;
    if (pct >= 0.98) { this.passport.stamped(p.id, p.title); this.q('[data-note]').innerHTML = '<b>도장이 찍혔습니다.</b> 다음 글로 가거나 전시실로 돌아가세요.'; }
  }
}
export function esc(s) { return String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
