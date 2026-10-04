#!/usr/bin/env node
// build-manifest.js — 블로그 글 폴더를 읽어 data/museum.json을 만든다.
// 사용: node tools/build-manifest.js --posts <글 폴더> [--images <이미지 폴더>] [--out data/museum.json] [--site-url https://raonlog.example] [--list-url /posts]
// 글은 마크다운. 맨 위 프런트매터(--- ... ---)에서 title, date, category, cover, place, people, tags, trip, material, summary, unlabeled, vault 를 읽는다.
// vault: true 는 진열장 대신 수장고 상자에 들어간다 (From the Vault).
// category는 5개 방 중 하나: parenting | adventure | food | health | messi (영문 카테고리명도 받는다).

const fs = require('fs'); const path = require('path');
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => { if (x.startsWith('--')) a.push([x.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]); return a; }, []));
if (!args.posts) { console.error('사용: node tools/build-manifest.js --posts <글 폴더> [--out data/museum.json]'); process.exit(1); }

const HALLS = [
  { id: 'parenting', no: '201', kr: '라온이의 방', en: 'KOREAN PARENTING', side: 'L', t: 0.12, match: /parent|육아|라온/i },
  { id: 'adventure', no: '202', kr: '나들이 방', en: 'FAMILY ADVENTURES IN SEOUL', side: 'R', t: 0.22, match: /adventure|travel|outing|나들이/i },
  { id: 'food', no: '203', kr: '맛집 방', en: 'FOOD & DINING', side: 'L', t: 0.36, match: /food|dining|맛집|음식/i },
  { id: 'health', no: '204', kr: '건강 방', en: 'HEALTH & WELLNESS', side: 'R', t: 0.50, match: /health|wellness|건강/i },
  { id: 'messi', no: '205', kr: '메시의 방', en: 'LIFE WITH MESSI', side: 'L', t: 0.64, match: /messi|cat|메시|고양이/i },
];
const PALETTE = { parenting: ['#8EC5E8', '#5F9ED1', '#F2E6B8'], adventure: ['#8FC7A9', '#3E8B6B', '#A9D6EA'], food: ['#E6D2A8', '#B5883F', '#F5F0E4'], health: ['#B7D7B0', '#5F8F5A', '#F2F1EC'], messi: ['#E8D5B5', '#8A6A3B', '#F5F0E4'] };

function parseFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/); if (!m) return { fm: {}, body: src };
  const fm = {}; let curKey = null;
  for (const raw of m[1].split(/\r?\n/)) {
    const li = raw.match(/^\s+-\s+(.*)$/); if (li && curKey) { (fm[curKey] = Array.isArray(fm[curKey]) ? fm[curKey] : []).push(unq(li[1])); continue; }
    const kv = raw.match(/^([A-Za-z_][\w-]*):\s*(.*)$/); if (!kv) continue; curKey = kv[1]; const v = kv[2].trim();
    if (v === '') fm[curKey] = []; else if (/^\[.*\]$/.test(v)) fm[curKey] = v.slice(1, -1).split(',').map(s => unq(s.trim())).filter(Boolean); else fm[curKey] = v === 'true' ? true : v === 'false' ? false : unq(v);
  }
  return { fm, body: m[2] };
}
function unq(s) { return s.replace(/^["']|["']$/g, ''); }
function slug(s) { return s.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-|-$/g, ''); }
function paragraphs(body) { return body.replace(/^#.*$/gm, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').split(/\n\s*\n/).map(s => s.replace(/\s+/g, ' ').trim()).filter(s => s.length > 20); }
function firstImage(body) { const m = body.match(/!\[[^\]]*\]\(([^)]+)\)/); return m ? m[1] : null; }

const dir = args.posts; const files = fs.readdirSync(dir).filter(f => /\.(md|mdx|markdown)$/i.test(f)).sort();
const halls = HALLS.map(h => ({ ...h, posts: [] }));
let quiet = null;
for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8'); const { fm, body } = parseFrontmatter(src);
  const title = fm.title || f.replace(/\.(md|mdx|markdown)$/i, ''); const id = fm.id || slug(title);
  const cat = String(fm.category || fm.room || ''); const hall = halls.find(h => h.id === cat || h.match.test(cat)) || (fm.quiet ? null : halls[1]);
  const paras = paragraphs(body);
  const post = {
    id, title, date: String(fm.date || '').slice(0, 10), place: fm.place || '', material: fm.material || '', summary: fm.summary || (paras[0] ? paras[0].slice(0, 120) : ''),
    cover: fm.cover || firstImage(body) || null, people: fm.people || [], tags: fm.tags || [], trip: fm.trip || null, unlabeled: !!fm.unlabeled, vault: !!fm.vault,
    url: fm.url || (args['site-url'] ? `${String(args['site-url']).replace(/\/$/, '')}/posts/${id}` : null),
    text: paras, art: PALETTE[hall ? hall.id : 'adventure'],
  };
  if (fm.quiet) { quiet = { id: 'quiet', title: post.title, summary: post.summary, cover: post.cover, url: post.url }; continue; }
  hall.posts.push(post);
}
halls.forEach(h => h.posts.sort((a, b) => (b.date || '').localeCompare(a.date || '')));
const out = { title: args.title || 'Raonlog Museum', listUrl: args['list-url'] || null, generatedAt: new Date().toISOString(), halls: halls.filter(h => h.posts.length).map(({ match, ...h }) => h), quiet };
const outPath = args.out || path.join(__dirname, '..', 'data', 'museum.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true }); fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`museum.json: 전시실 ${out.halls.length}곳, 글 ${out.halls.reduce((a, h) => a + h.posts.length, 0)}편${quiet ? ', 사유의 방 1편' : ''} → ${outPath}`);
