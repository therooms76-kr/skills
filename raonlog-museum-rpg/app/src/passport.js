// passport.js — 관람 여권. 도장(끝까지 읽음) · 발견 · 등급 · 주간 퀘스트 · 공유 카드.
// 저장은 localStorage(이 브라우저만). 3부 G1~G4 확정안: 보상은 꾸미기만, 콘텐츠 해금 없음, 리더보드 없음.

export const PTS = { stamp: 10, find: 25, quest: 50 };
export const RANKS = [['Visitor', 0], ['Regular', 50], ['Friend of the Museum', 120], ['Patron', 250], ['Honorary Curator', 500]];
const KEY = 'raonlog-museum-passport-v1';

export class Passport {
  constructor(el, { museum, theme, onChange }) {
    this.el = el; this.museum = museum; this.theme = theme; this.onChange = onChange || (() => {});
    this.s = { pts: 0, stamps: [], found: [], opened: [], visited: [], quests: [], collar: 0, shared: false, week: weekKey() };
    this.load(); this.render();
  }
  load() { try { const raw = localStorage.getItem(KEY); if (raw) { const s = JSON.parse(raw); if (s.week !== weekKey()) { s.quests = []; s.week = weekKey(); } this.s = { ...this.s, ...s }; } } catch (e) { /* 저장소 없음 */ } }
  save() { try { localStorage.setItem(KEY, JSON.stringify(this.s)); } catch (e) { /* 무시 */ } }
  rankIndex() { let ri = 0; RANKS.forEach((r, i) => { if (this.s.pts >= r[1]) ri = i; }); return ri; }
  rank() { return RANKS[this.rankIndex()][0]; }
  collarColor() { return this.rankIndex() >= 1 ? this.theme.sprites.collarColors[this.s.collar] : null; }
  has(list, id) { return this.s[list].includes(id); }
  add(list, id) { if (!this.has(list, id)) { this.s[list].push(id); return true; } return false; }
  log(msg) { this.lastLog = msg; }
  award(n, why) { this.s.pts += n; this.log(`<b>+${n}</b> ${why}`); this.checkQuests(); this.save(); this.render(); this.onChange(this.s); }

  // 이벤트 — 엔진이 부른다
  opened(id) { if (this.add('opened', id)) { this.save(); this.render(); } }
  stamped(id, title) { if (this.add('stamps', id)) this.award(PTS.stamp, `“${title}” 끝까지 읽음. 도장!`); }
  found(id, why) { if (this.add('found', id)) this.award(PTS.find, why); }
  visited(id) { if (this.add('visited', id)) { this.checkQuests(); this.save(); this.render(); } }

  questState() { return [['q1', '글 3편 끝까지 읽기', this.s.stamps.length >= 3], ['q2', '숨겨진 것 1개 찾기', this.s.found.length >= 1], ['q3', '전시실 3곳 들어가기', this.s.visited.length >= 3]]; }
  checkQuests() { for (const [k, , ok] of this.questState()) if (ok && this.add('quests', k) && this.s.quests.length === 3) { this.s.pts += PTS.quest; this.log(`<b>+${PTS.quest}</b> 이번 주 퀘스트 완료.`); } }

  shareCard() {
    const line = this.museum.halls.map(h => h.posts.some(p => this.has('stamps', p.id)) ? '🟩' : '⬜').join('') + (this.has('found', 'quiet') ? '⬛' : '⬜');
    this.s.shared = true; this.save();
    return `Raonlog Museum · Path to History\n${line}\nHalls ${this.s.visited.length}/${this.museum.halls.length + 1} · Stamps ${this.s.stamps.length} · Found ${this.s.found.length}\n${this.rank()} · ${this.s.pts} pts`;
  }
  reset() { this.s = { pts: 0, stamps: [], found: [], opened: [], visited: [], quests: [], collar: 0, shared: false, week: weekKey() }; this.lastLog = '여권이 발급되었습니다.'; this.save(); this.render(); this.onChange(this.s); }

  render() {
    const s = this.s, ri = this.rankIndex(), nx = RANKS[ri + 1];
    const stamps = this.museum.posts.slice(0, 12).map(p => `<div class="${this.has('stamps', p.id) ? 'on' : ''}">${this.has('stamps', p.id) ? 'SEEN' : p.hall.no.slice(-1)}</div>`).join('');
    const collars = this.theme.sprites.collarColors.map((c, i) => `<button data-collar="${i}" class="${i === s.collar ? 'on' : ''}" style="background:${c}" ${ri < 1 ? 'disabled' : ''} aria-label="목걸이 색 ${i + 1}"></button>`).join('');
    const quests = this.questState().map(([k, label, ok]) => `<li class="${ok ? 'done' : ''}">${label}</li>`).join('');
    this.el.innerHTML = `
      <h4>VISITOR PASSPORT</h4>
      <div class="stamps">${stamps}</div>
      <div class="score"><span class="pts">${s.pts}</span><span class="rank">${this.rank()}</span></div>
      <div class="rankbar"><i style="width:${nx ? Math.min(100, (s.pts - RANKS[ri][1]) / (nx[1] - RANKS[ri][1]) * 100) : 100}%"></i></div>
      <div class="rankline">${nx ? `${nx[0]}까지 ${nx[1] - s.pts}점` : '최고 등급'}</div>
      <div class="collar"><span>목걸이 색</span><span>${collars}</span>${ri < 1 ? '<span class="muted">· Regular부터</span>' : ''}</div>
      <h4>THIS WEEK’S QUESTS</h4>
      <ul class="quests">${quests}</ul>
      <div class="log">${this.lastLog || '여권이 발급되었습니다. 복도를 따라 걸어 보세요.'}</div>
      <div class="share"><button data-share ${s.stamps.length < 3 ? 'disabled' : ''}>${s.stamps.length < 3 ? '공유 카드 만들기 (도장 3개부터)' : '공유 카드 만들기'}</button><textarea data-sharebox readonly placeholder="도장 3개를 모으면 여기 공유 카드가 생깁니다."></textarea></div>
      <button data-reset class="link">여권 초기화</button>`;
    this.el.querySelectorAll('[data-collar]').forEach(b => b.onclick = () => { s.collar = +b.dataset.collar; this.save(); this.render(); this.onChange(s); });
    this.el.querySelector('[data-share]').onclick = () => { this.el.querySelector('[data-sharebox]').value = this.shareCard(); this.log('공유 카드가 만들어졌습니다. 복사해 어디든 붙여 넣을 수 있어요.'); };
    this.el.querySelector('[data-reset]').onclick = () => { if (confirm('여권을 초기화할까요? 도장과 점수가 지워집니다.')) this.reset(); };
  }
}
function weekKey() { const d = new Date(); const onejan = new Date(d.getFullYear(), 0, 1); return `${d.getFullYear()}-W${Math.ceil(((d - onejan) / 86400000 + onejan.getDay() + 1) / 7)}`; }
