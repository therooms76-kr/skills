# 라온로그 박물관 개발 계획 (app/)

시작일: 2026-10-03
원칙: **로직과 디자인을 분리한다.** 디자인(고양이 그림, 배경, 사진, 색, 글꼴)은 `theme/` 폴더의 파일 교체만으로 바뀐다.
코드는 `src/`에 있고, 디자인이 바뀌어도 코드는 건드리지 않는다.

## 폴더 구조

```
app/
  index.html               박물관 페이지 (어떤 정적 블로그에도 그대로 복사해 쓸 수 있음)
  styles/museum.css        화면 스타일. 색·글꼴은 theme.json의 토큰을 받아 씀
  src/
    main.js                시작점. 테마·데이터를 읽고 엔진을 띄움
    engine.js              이동·입력·장면 전환·렌더 루프
    projection.js          복도 원근 계산 (소실점)
    scenes.js              복도·전시실·사유의 방 그리기
    sprite.js              고양이 그리기 (스프라이트 시트가 있으면 그것, 없으면 임시 픽셀)
    viewer.js              미리보기 창과 글 읽기 화면
    passport.js            관람 여권 (도장·발견·등급·퀘스트·공유 카드). localStorage 저장
    data.js                data/museum.json 읽기
    theme.js               theme/<name>/theme.json 읽기 → CSS 토큰·이미지 경로
  theme/
    default/theme.json     지금의 그림 배경 + 임시 고양이. 디자인 교체의 첫 대상
  data/
    museum.json            전시 배치. tools/build-manifest.js가 글에서 생성
  sample-content/posts/    예시 글 6편 (프런트매터 형식의 본보기)
  tools/
    build-manifest.js      글 폴더를 읽어 museum.json 생성 (Node)
    smoke.js               Playwright 자동 점검 (복도 → 전시실 → 글 읽기 → 도장)
```

## 마일스톤

| 단계 | 내용 | 완료 기준 |
|---|---|---|
| M1 엔진 | v2 프로토타입을 모듈로 분리. 데이터·테마 외부화. 여권 저장. 자동 점검 | `node tools/smoke.js` 통과 · **완료 2026-10-03** |
| M2 디자인 팩 v1 | 고양이 스프라이트 시트 + 가족 사진 3장 + 색 토큰을 `theme/raonlog-v1/`로. 코드 수정 없이 교체 | theme.json 경로만 바꿔 동작 |
| M3 블로그 연결 | 라온로그 글 폴더로 `build-manifest.js` 실행 → 진짜 글이 걸림. '글 전체 읽기'가 실제 글 URL로 이동 | 실제 글 6편으로 복도·전시실 동작 |
| M4 발견 장치 | 이름표 없는 액자, 수장고 상자, 특별전 문(exhibitions.json 읽기), 수요일 도슨트 | 2부 F1~F4·F9 · **완료 2026-10-04** (사유의 방 침묵 F9는 M1에 포함) |
| M5 라온로그 통합 | Next.js의 `/museum` 경로에 mount. 글 목록 페이지에 '박물관으로' 버튼 | 배포 |

## 디자인 요소 중간 업데이트 계획

디자인은 M1이 끝난 뒤 언제든, 아래 교체 지점에서 바꾼다. 각 지점은 코드가 아니라 theme.json 한 줄이다.

| 교체 지점 | theme.json 키 | 지금(default) | 업데이트 때 |
|---|---|---|---|
| 고양이 | `sprites.cat` | null → 임시 픽셀 고양이 | 스프라이트 시트 PNG + 프레임 표(걷기 좌/우, 서기, 앉기, 목걸이 레이어) |
| 복도 배경 | `scenes.corridor.photo` | null → SVG로 그린 원근 복도 | 가족 사진(정면) + 소실점 `vx, vy` |
| 전시실 배경 | `scenes.hall.photo` | null → CSS 벽·바닥 | 가족 사진(전시실 벽) |
| 사유의 방 배경 | `scenes.quiet.photo` | null → 검은 방·별 | 선택 |
| 진열장 모양 | `scenes.hall.caseStyle` | `vitrine` | `frame`(액자만) / `vitrine-dark` |
| 색 | `tokens.*` | 화강암·어두운 벽·금색 조명 | 사진 톤에 맞춰 조정 |
| 글꼴 | `fonts.display / body` | Gowun Batang / IBM Plex Sans KR | 변경 가능 |
| 명판 | `labels.style` | 흰 종이 명판 | 검은 명판 등 |

교체 순서 제안: ① 고양이 스프라이트(가장 눈에 띔) → ② 복도 사진(첫 장면) → ③ 색 토큰 맞추기 → ④ 전시실 사진 → ⑤ 진열장 변형.
각 교체 뒤에는 `node tools/smoke.js`로 동작을 확인하고, T1 집계표의 '쉬움' 점수가 떨어지지 않는지 본다.

## 라온로그에 붙이는 방법 (M5)

1. `app/` 폴더를 라온로그의 `public/museum/`으로 복사한다. 정적 파일이라 그대로 열린다 (`/museum/index.html`).
2. `tools/build-manifest.js --posts <글 폴더> --images <이미지 폴더> --out public/museum/data/museum.json`을 빌드 스크립트에 넣는다.
   글의 프런트매터에서 title, date, category, cover, place, people, tags, trip을 읽는다.
3. 글 목록 페이지에 '박물관으로 들어가기' 버튼, 박물관의 '수장고' 버튼은 글 목록 페이지로.
4. '글 전체 읽기'는 museum.json의 `url`로 이동한다 (같은 창).

## M4에서 추가된 것 (2026-10-04)

- `data/exhibitions.json`: 특별전(기간·벽·글 묶음·기획 의도)과 도슨트(요일·시간·문답). 형식은 `../agent/EXHIBITIONS-SCHEMA.md`.
  기간 안에만 복도에 붉은 현수막 문이 생기고, 들어가면 발견 점수. 기간이 지나면 문이 사라진다.
- 수장고 상자: 프런트매터 `vault: true`인 글은 진열장 대신 전시실 오른쪽 상자에 들어간다. 열면 발견 점수, 미리보기에 FROM THE VAULT 표시.
- 수요일 도슨트: 진열장 위에 "수요일 18:00 도슨트" 표. 그 시간에 열면 라온이 질문 5개와 메시의 답. 발견 점수.
- `?now=2026-10-07T18:30:00` 로 시간을 바꿔 점검한다. 자동 점검이 특별전 문 생성·소멸과 도슨트까지 확인한다.

## M4 뒤에 더한 것 (2026-10-04)

- 내 코스 만들기 (3부 패턴 A, F5): 미리보기 창의 '코스에 담기'로 진열장 최대 3개를 고르면 여권에 순서가 쌓인다.
  '안내 시작'을 누르면 고양이가 방을 옮겨 가며 순서대로 걸어가 열어 준다. 창을 닫으면 다음으로.
  '코스 링크 복사'는 `?course=id1,id2,id3` 주소를 만든다. 링크를 받은 사람은 같은 순서로 안내받는다.
- 모바일 세로 화면: 640px 이하에서 무대 4:3, 조작 버튼 44px, 여권은 아래로. 가로 넘침 없음을 자동 점검.
- 고친 버그: 창 안의 클릭이 무대로 새어 '그 자리로 걸어가기'가 되던 문제, 닿을 수 없는 목표(벽 위)로 걷다 멈추지 않던 문제.

## 지금 할 수 있는 것 / 기다리는 것

- 지금: M1 전체, M3의 build-manifest(예시 글로), M4의 데이터 형식.
- 기다리는 것: 고양이 스프라이트(M2), 가족 사진 3장(M2), 라온로그 저장소 또는 글 폴더 구조(M3·M5).
