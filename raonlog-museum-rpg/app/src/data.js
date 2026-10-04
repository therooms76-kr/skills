// data.js — data/museum.json을 읽는다. 블로그 글이 전시로 바뀐 결과물이다.
// 형식은 tools/build-manifest.js가 만든다. 사람이 손으로 고쳐도 된다.

export async function loadMuseum(url = './data/museum.json') {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`museum.json을 읽지 못했습니다 (${res.status})`);
  const m = await res.json();
  return normalize(m);
}

export function normalize(m) {
  const halls = (m.halls || []).map((h, i) => ({
    id: h.id, no: h.no || String(201 + i), kr: h.kr || h.id, en: h.en || '',
    side: h.side || (i % 2 === 0 ? 'L' : 'R'), t: typeof h.t === 'number' ? h.t : 0.12 + i * 0.13,
    posts: (h.posts || []).map(p => ({
      id: p.id, title: p.title, date: p.date || '', place: p.place || '', material: p.material || '',
      summary: p.summary || '', url: p.url || null, cover: p.cover || null, art: p.art || ['#8E8A81', '#5B5852', '#F2D28A'],
      people: p.people || [], tags: p.tags || [], trip: p.trip || null, unlabeled: !!p.unlabeled,
      text: Array.isArray(p.text) ? p.text : (p.text ? String(p.text).split(/\n\n+/) : []),
      vault: !!p.vault,
    })),
  }));
  // vault: true 인 글은 진열장이 아니라 수장고 상자 안에 들어간다.
  halls.forEach(h => { h.vault = h.posts.filter(p => p.vault); h.posts = h.posts.filter(p => !p.vault); });
  const posts = []; halls.forEach(h => { h.posts.forEach(p => { p.hall = h; posts.push(p); }); h.vault.forEach(p => { p.hall = h; posts.push(p); }); });
  const quiet = m.quiet ? { id: m.quiet.id || 'quiet', title: m.quiet.title, summary: m.quiet.summary || '', cover: m.quiet.cover || null, art: m.quiet.art || ['#1A1613', '#070606', '#D9B663'], url: m.quiet.url || null } : null;
  const byId = Object.fromEntries(posts.map(p => [p.id, p]));
  return { title: m.title || 'Raonlog Museum', listUrl: m.listUrl || null, halls, posts, byId, quiet, generatedAt: m.generatedAt || null, exhibitions: { special: [], docent: [] } };
}

// 연결 규칙(2부 4장): 같은 나들이 > 같은 장소 > 같은 등장인물+태그
export function related(museum, p, max = 3) {
  const out = [];
  for (const q of museum.posts) {
    if (q.id === p.id) continue;
    let why = null;
    if (p.trip && q.trip === p.trip) why = 'trip';
    else if (p.place && q.place === p.place) why = 'place';
    else if (q.people.some(x => p.people.includes(x)) && q.tags.some(x => p.tags.includes(x))) why = 'tags';
    if (why) out.push({ q, why });
  }
  const order = { trip: 0, place: 1, tags: 2 };
  return out.sort((a, b) => order[a.why] - order[b.why]).slice(0, max);
}
export const RELATION_LABEL = { trip: '같은 나들이', place: '같은 장소', tags: '같은 주제' };

// ---- 전시 배치 파일 (2부의 주간 루틴이 만든다). 없어도 박물관은 동작한다. ----
// 형식은 agent/EXHIBITIONS-SCHEMA.md 참고.
export async function loadExhibitions(museum, url = './data/exhibitions.json', now = new Date()) {
  let ex = { special: [], docent: [] };
  try { const res = await fetch(url, { cache: 'no-cache' }); if (res.ok) ex = { ...ex, ...(await res.json()) }; } catch (e) { /* 없으면 빈 상태 */ }
  const today = ymd(now);
  const special = (ex.special || []).filter(x => (!x.from || x.from <= today) && (!x.to || today <= x.to)).map((x, i) => ({
    id: `sp-${x.id}`, special: true, no: x.no || `S${i + 1}`, kr: x.title, en: x.subtitle || 'SPECIAL EXHIBITION', side: x.side || 'R', t: typeof x.t === 'number' ? x.t : 0.70 + i * 0.05,
    from: x.from || null, to: x.to || null, statement: x.statement || '', posts: (x.posts || []).map(id => museum.byId[id]).filter(Boolean), vault: [],
  }));
  const docent = (ex.docent || []).map(d => ({ postId: d.postId, questions: d.questions || [], when: { weekday: d.when?.weekday ?? 3, from: d.when?.from || '18:00', to: d.when?.to || '21:00' } }));
  museum.exhibitions = { special, docent, now };
  return museum.exhibitions;
}
export function docentFor(museum, postId, now = museum.exhibitions.now || new Date()) {
  const d = museum.exhibitions.docent.find(x => x.postId === postId); if (!d) return null;
  const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const active = now.getDay() === d.when.weekday && hhmm >= d.when.from && hhmm <= d.when.to;
  return { ...d, active, label: `${['일', '월', '화', '수', '목', '금', '토'][d.when.weekday]}요일 ${d.when.from} 도슨트` };
}
function ymd(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
