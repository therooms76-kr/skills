// viewer.js — 미리보기 창(D5 b)과 글 읽기 화면. 글을 끝까지 스크롤하면 도장.
import { related, RELATION_LABEL } from './data.js';

export function artCSS(p) {
  if (p.cover) return `background:url("${p.cover}") center/cover no-repeat`;
  const c = p.art; return `background:radial-gradient(circle at 70% 25%,${c[2]} 0 9%,transparent 10%),linear-gradient(180deg,${c[0]} 0 55%,${c[1]} 55% 100%)`;
}

export class Viewer {
  constructor(stage, { museum, passport, onNavigate, onClose, say, currentHall, docentFor }) {
    this.museum = museum; this.passport = passport; this.onNavigate = onNavigate; this.onCloseCb = onClose; this.say = say; this.currentHall = currentHall || (() => this.cur && this.cur.hall); this.docentFor = docentFor || (() => null);
    stage.insertAdjacentHTML('beforeend', `
      <div class="viewer" data-viewer role="dialog" aria-modal="true" aria-label="작품 보기">
        <button class="close" data-close aria-label="닫기">×</button>
        <div class="card">
          <div><div class="img"><div data-img></div></div><div class="lab" data-lab></div></div>
          <div><h3 data-title></h3><div class="vm" data-meta></div><p data-summary></p>
            <div class="btns"><button data-prev>◀ 이전</button><button data-next>다음 ▶</button><button class="primary" data-read>글 전체 읽기</button><button data-course>코스에 담기</button></div>
            <div class="docent" data-docent hidden><h4>DOCENT TALK · 메시가 답합니다</h4><div data-docent-body></div></div>
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
    // 창 안의 클릭은 무대(걸어가기)로 새지 않는다
    this.v.addEventListener('click', e => e.stopPropagation()); this.r.addEventListener('click', e => e.stopPropagation());
    q('[data-close]').onclick = () => this.close(); q('[data-prev]').onclick = () => this.nav(-1); q('[data-next]').onclick = () => this.nav(1);
    q('[data-read]').onclick = () => this.openReader(this.cur); q('[data-back]').onclick = () => { this.r.classList.remove('on'); this.v.classList.add('on'); };
    q('[data-rnext]').onclick = () => { this.nav(1); this.openReader(this.cur); };
    q('[data-course]').onclick = () => { if (this.passport.toggleCourse(this.cur.id)) this.say(this.passport.inCourse(this.cur.id) ? '코스에 담았어요' : '코스에서 뺐어요'); this.refreshCourseBtn(); };
    q('[data-body]').addEventListener('scroll', () => this.checkRead());
    this.q = q;
  }
  isOpen() { return this.v.classList.contains('on') || this.r.classList.contains('on'); }
  open(p, opts = {}) {
    this.cur = p; this.passport.opened(p.id);
    if (p.unlabeled && !this.passport.has('found', p.id)) this.passport.found(p.id, '이름표 없는 진열장을 찾았습니다. 명판이 붙습니다.');
    const q = this.q;
    q('[data-img]').style.cssText = artCSS(p);
    q('[data-lab]').innerHTML = `<b>${esc(p.title)}</b><br>${esc(p.date)} · ${esc(p.place)}<br>${esc(p.material)}`;
    q('[data-title]').textContent = p.title; q('[data-meta]').textContent = (opts.fromVault ? 'FROM THE VAULT · ' : '') + `${p.hall.no} ${p.hall.kr} · ${p.hall.en}`; q('[data-summary]').textContent = p.summary;
    const dc = this.docentFor(p.id); const dEl = q('[data-docent]'); dEl.hidden = !dc;
    if (dc) { const body = q('[data-docent-body]'); body.innerHTML = dc.active ? dc.questions.map(x => `<div class="qa"><b>“${esc(x.q)}”</b><span>${esc(x.a)}</span></div>`).join('') : `<p class="muted">${esc(dc.label)}에만 열립니다. 그때 다시 오면 메시가 라온이의 질문에 답해 줍니다.</p>`; if (dc.active && !this.passport.has('found', 'docent-' + p.id)) this.passport.found('docent-' + p.id, '수요일 저녁 도슨트를 들었습니다.'); }
    const rel = q('[data-rel]'); rel.innerHTML = '';
    const rs = related(this.museum, p).filter(({ q: x }) => !(x.unlabeled && !this.passport.has('found', x.id)));
    if (!rs.length) rel.innerHTML = '<div class="muted">연결된 글이 아직 없습니다.</div>';
    rs.forEach(({ q: x, why }) => { const b = document.createElement('button'); b.innerHTML = `<span>${esc(x.title)}${x.hall !== p.hall ? ` <small>${esc(x.hall.kr)}</small>` : ''}</span><em>${RELATION_LABEL[why]}</em>`; b.onclick = () => this.onNavigate(x); rel.appendChild(b); });
    this.refreshCourseBtn();
    this.r.classList.remove('on'); this.v.classList.add('on'); q('[data-close]').focus();
    this.say(opts.guided ? `코스 ${opts.guided.i + 1}/${opts.guided.n} · 여기예요` : (this.passport.has('stamps', p.id) ? '다시 왔네요' : '여기 보세요'));
  }
  refreshCourseBtn() { const b = this.q('[data-course]'); if (!this.cur) return; const on = this.passport.inCourse(this.cur.id); b.textContent = on ? '코스에서 빼기' : '코스에 담기'; b.classList.toggle('on', on); }
  close() { this.v.classList.remove('on'); this.r.classList.remove('on'); this.onCloseCb(); }
  nav(d) { const h = this.currentHall() || this.cur.hall; const ps = h.posts.includes(this.cur) ? h.posts : (h.vault && h.vault.includes(this.cur) ? h.vault : this.cur.hall.posts); if (!ps.length) return; const i = ps.findIndex(x => x.id === this.cur.id); this.onNavigate(ps[(i + d + ps.length) % ps.length]); }
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
