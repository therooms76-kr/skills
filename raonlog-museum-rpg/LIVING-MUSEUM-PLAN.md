# 라온로그 살아있는 박물관 계획안 (2부, v0.2, 토의용)

작성일: 2026-09-06
이어지는 문서: PLAN.md (1부, 고양이 박물관)
함께 있는 파일: `agent/sources.yaml` (문법 출처 목록 + 허용 도메인), `agent/style-library.md` (문법 사전),
`agent/weekly-museum-watch.prompt.md` (루틴 지시문 초안)

**v0.2에서 바로잡은 것**: 박물관 소식은 블로그의 주제가 아니라 교과서다. 에이전트는 박물관 뉴스레터·큐레이터 글에서
"말하는 방식"만 배우고, 라온로그의 가족 콘텐츠(기존 글, 사진)를 그 방식으로 재해석해 새 글을 만든다.
블로그에서는 고양이가 돌아다니며 그 글을 찾아낸다.

---

## 0. 한눈에

- **의견 재조사**: 해외(트립어드바이저, 여행 가이드, 레딧·틱톡 요약 사이트)와 국내(티스토리, 다모앙, 디시, 서브스택,
  서울시 미디어허브)에서 14개 출처, 20여 개 의견. 1부의 7가지 패턴이 그대로 확인됐고 새 패턴 2개가 추가됐다.
  - A. 추천 동선을 거부한다: "추천 동선 따라가면 망한다. 볼 것 3개를 정하고 간다." → '내 코스 만들기'
  - B. 대표작 앞에서 사진 줄: "사유의 방은 사진 줄 때문에 사유가 안 된다." → 사유의 방엔 공유 버튼을 두지 않음
- **매주 배우는 에이전트**: 박물관은 사물 하나를 소개하는 문법(큐레이터 추천, 명판, 특별전 개막문, 보존 처리 이야기,
  수장고 공개, 가족 활동지)을 갖고 있다. 에이전트는 매주 국립중앙박물관과 해외 박물관의 뉴스레터에서 이 문법을 배우고,
  라온로그의 기존 글과 사진을 그 문법으로 다시 쓴다. 라온이의 태권도 띠가 '큐레이터 추천 소장품'이 된다.
- **고양이가 찾아내는 체험**: 재해석 글은 그냥 걸리지 않고 숨겨진다. 이름표 없는 액자, 새로 생긴 문, 수장고의 상자,
  수요일 저녁에만 열리는 도슨트. 고양이를 움직여 찾아내는 것이 놀이이고, 매주 찾을 것이 새로 생긴다.

한계 두 가지:
1. 이 세션은 웹 검색은 되지만 페이지 직접 열기가 전부 차단되어, 의견은 검색 요약과 요약 사이트로 모았다.
2. 같은 이유로 에이전트도 지금 환경으로는 박물관 사이트를 읽을 수 없다. 환경 네트워크를 Custom으로 바꿔야 한다 (E1).

---

## 1. 의견 재조사 (출처 링크는 9장)

| # | 의견 | 출처 | 패턴 |
|---|---|---|---|
| 1 | 아무 생각 없이 들어가면 체력만 털린다. 체력을 전략적으로 배분해야 하는 공간 | 티스토리 easytraveltip | 1 |
| 2 | 추천 동선 따라가면 망한다. 3시간 걷고 깨달은 현실 관람법, 운동화 필수 | 티스토리 easytraveltip | 새 A |
| 3 | 다음엔 체력 키워서 못 본 전시까지 | 다모앙 | 1 |
| 4 | 경천사탑에서 시작해 사유의 방으로 곧장. 늦을수록 붐빈다 | breezekorea | 3 |
| 5 | 2층은 한산해 좋은데, 사유의 방은 사진 줄 때문에 사유가 안 된다 | 디시 미니갤, wishbeen | 새 B |
| 6 | 사유의 방 개관 1년 만에 반가사유상 인지도 4위→1위, 외국인 역대급 | 뉴시스, 경향, 오마이뉴스 | 3 |
| 7 | 수·토 밤 9시까지. 한산하고 석탑 조명이 운치 있고 여름엔 시원 | breezekorea, 서울시 미디어허브 | 6 |
| 8 | It's huge, prioritize sections. 2~3 hours, fatigue within two hours, free so split visits | airial(레딧·틱톡 요약), Beyond Seoul | 1 |
| 9 | Museum app works as Bluetooth audio guide. Free English tours twice a day | Expedia 요약, Korea.net | 5 |
| 10 | Room of Quiet Contemplation: scent, sloped floor, no case, 360° view. Buy the miniature | Korea.net, Korea Times | 3 |
| 11 | Children's Museum hands-on but reservation required. Weekdays better | Expedia 요약, 육아크루 | 4 |
| 12 | Three floors, one theme per floor. Clean, toilets every floor, good English | airial | 2 |
| 13 | A space to breathe and reflect | La Seoulite (서브스택) | 6 |
| 14 | 박물관 추천 동선: 1층 선사 → 실감영상관 → 신라 금관 → 경천사탑 → 2층 불교회화 → 3층 조각·공예·청자 → 사유의 방 | 서울시 미디어허브 | 2·3 |

정리: 해외와 국내가 같다. "넓다, 지친다, 무료라 또 온다, 사유의 방 하나는 꼭, 아이는 어린이박물관 예약, 수요일 밤이 좋다."

---

## 2. 문법 출처 (정기 발행만. 여기서 가져오는 것은 소식의 내용이 아니라 형식과 말투)

### 국립중앙박물관

| 통로 | 주기 | 내용 | 형태 | 쓰이는 곳 |
|---|---|---|---|---|
| 박물관신문 (webzine.museum.go.kr) | 월 1회 (2026.8 = 660호) | 특별전 해설, 소장품, 교육 소식 | 웹 | 이달의 박물관, 큐레이터 인용 |
| 보도자료 | 주 1~3건 | 개막, 협약, 발간, 통계 | 웹 목록 | 이번 주 새 소식 |
| 특별전 현재·예정 | 수시 (예: 우리들의 밥상 7.1~10.25) | 전시명·기간·장소·유료 | 웹 + 공공데이터 API | 가족 판정 카드 |
| 큐레이터와의 대화 | 매주 수 18시·19시 (9월 20회) | 회차 주제, 장소 | 웹 | 수요일 밤 코스, 야간 개장 연동 |
| 교육플랫폼 모두 | 월 단위, 접수기간 명시 | 유아·초등 가족 프로그램 | 웹 | 가족 달력 |
| 어린이박물관 예약 | 회차별 | 예약 규칙 | 웹 | 예약 열림 알림 (잔여석은 안 읽음) |
| 큐레이터 추천 소장품 | 누적 321건 | 유물 + 해설 | 웹, e뮤지엄 | 이번 주의 유물 |
| 문화행사 | 수시 | 공연, 영화 | 웹 | 주말 카드 |
| 12개 기관 전시정보 API (data.go.kr) | 호출 시 | 20개 기관 전시실·전시소식 | JSON/XML, 키 발급 | 1순위 전시 원천 |
| 유튜브, 제페토 힐링동산, 구글 아츠앤컬처(온라인 전시 22, 전시실 뷰 52) | 수시 | 영상, 메타버스, 360° | 링크 | 집에서 미리 보기 |

### 해외

| 박물관 | 통로 | 키·라이선스 | 한국 관련 | 쓰이는 곳 |
|---|---|---|---|---|
| 메트 (뉴욕) | Collection API, 49만 점 이미지 | 키 없음, CC0 | 한국관 | 두 박물관 한 유물, 대여 전시실 |
| 클리블랜드 | Open Access API 6.8만 점 | 키 없음, CC0 | 한국 도자·불교 | 위와 같음 |
| 시카고 | API 13만 점 + IIIF | 키 없음, CC0 | 일부 | 대여 전시실 |
| 레이크스 | Data Services 80만 점 | 키 필요, 대부분 CC0 | 적음 | 세계 박물관 코너 |
| 스미스소니언 (국립아시아예술박물관) | Open Access API | 키 필요(무료), CC0 | 한국 불교조각 전시 이력 | 비교 글 |
| 영국박물관 | 블로그 RSS | 이미지 CC BY-NC-SA | 한국관 | 소식만 |
| 루브르 | 뉴스레터 | API 없음 | 없음 | 소식만 |
| 유로피아나 | API | 키 필요 | 검색 필요 | 보조 |

접근성: 이번 세션에서는 위 통로 전부 차단. 환경 네트워크 단계는 Trusted / Custom / Full 세 가지, 지금은 Trusted.

---

## 3. 매주 배우는 에이전트 ("메시 학예사" 루틴)

파이프라인 (매주 월 07:00 KST):
- A 박물관 문법 수집: 뉴스레터·보도자료·큐레이터 글에서 형식과 말투만 뽑아 style-library.md 갱신
- B 가족 아카이브 읽기: 기존 글, 사진 폴더(EXIF), 태그, 이번 주 새 사진 → collection.json (우리 집 소장품 목록)
- C 짝짓기: 문법 1개 × 소장품 1~3개 (예: '큐레이터 추천' × 라온이의 첫 태권도 띠)
- D 재해석 초안: 라온로그 문체, 영어, 명판 + 본문 + 도슨트 대사, 게임 배치 exhibitions.json
- E **사람 검토 (초안 PR)** → F 게시 → G 고양이가 찾아낸다

박물관 소식 자체는 블로그에 실리지 않는다 (문법 출처로 각주만).

### 박물관에서 배우는 전시 문법 12가지 (agent/style-library.md)

| 박물관 문법 | 라온로그에서는 | 재료 |
|---|---|---|
| 큐레이터 추천 소장품 | Curator's Pick: 우리 집 물건 1개, 왜 우리 집 역사에서 중요한지 | 사진 1장 + 사연 |
| 명판 | Object Label: 명칭·시대·재질·출처·소장 경위. 모든 글에 자동 | 프런트매터 |
| 특별전 개막 보도자료 | Special Exhibition: 기존 글을 주제로 다시 묶은 기획전 ("Noodles of 2026") | 글 3~6편 |
| 이달의 유물 | Object of the Month: 사진 한 장의 앞뒤 이야기 | EXIF + 사진 |
| 사유의 방 | Quiet Room: 사진 1장, 50단어 | 사진 1장 |
| 보존 처리 이야기 | Conservation Notes: 뜯긴 소파, 자전거 수리, 전후 사진 | 수리 사진 |
| 신소장품 공개 | New Acquisition: 새 사진 폴더 감지 시 자동 예고, 본문은 가족이 | 새 폴더 |
| 큐레이터와의 대화 | Docent Talk: 글 1편을 라온이 질문 5개로, 수요일 18시 이후만 | 기존 글 |
| 가족 활동지 (메트) | Family Guide: 액자 옆 놀이 카드 | 글 + 사진 |
| 수장고 공개 | From the Vault: 1년 전 이맘때 글 | 날짜 일치 글 |
| 월간 뉴스레터 | This Month at the Raonlog Museum: 우리 박물관 소식지 | 활동 로그 |
| 순회전·대여전 | Related, Elsewhere: 닮은 실제 전시 각주 한 줄, 링크만 | 전시 정보(선택) |

실행 방법: a. Claude Code 루틴(클라우드, **추천**) / b. PC 예약 작업(라온로그가 GitHub에 없으면 이걸로 시작) / c. GitHub Actions(보류)

---

## 4. 콘텐츠 생성 계획

재료는 라온로그의 기존 글과 사진 폴더. HTML 보고서 4장에 실제로 적용해 본 예시 4편:
- Curator's Pick No. 1: A White Belt, Slightly Gray (태권도 띠)
- Now Open: "Three Bowls, Three Seasons" — Noodles of 2026 (칼국수·막국수 글 3편을 묶은 특별전)
- Docent Talk: "A Rainy Saturday at the National Museum of Korea," in Five Questions from Raon
- This Month at the Raonlog Museum: September

발행 리듬:

| 형식 | 주기 | 사람이 하는 일 | 게임 속 위치 |
|---|---|---|---|
| Curator's Pick | 주 1편 | 사연 확인, 명판 수정 | 해당 방 벽, 처음엔 이름표 없이 |
| 돌아가며 1편 (Special Exhibition·Docent Talk·From the Vault·Conservation Notes·Quiet Room) | 주 1편 | (ask Dad) 채우기 | 특별전시실 또는 액자 앞 |
| New Acquisition 예고 | 새 폴더가 생길 때 | 본문은 가족이 씀 | 수장고 앞 "입고 중" 상자 |
| Object Label | 모든 글 자동 | 재질·출처 손보기 | 액자 아래 |
| Family Guide | 월 1~2편 | 라온이와 실제로 해 보기 | 액자 옆 카드 |
| This Month at the Raonlog Museum | 월 1편 | 검토만 | 로비 게시판 |

양의 원칙: 재해석 글은 주 2편을 넘기지 않는다. 가족이 직접 쓴 글이 본체다.

문체 규칙 추가분: 박물관의 형식을 빌리되 말투는 라온로그. 사실은 가족 아카이브에 있는 것만, 없으면 "(ask Dad)".
라온이의 실제 말 인용. 글 끝에 "Format borrowed from …, content from …" 각주. 실제 박물관 소식은 "Related, elsewhere" 한 줄까지만.

---

## 5. 고양이가 찾아내는 체험 (난이도 순)

- F1 이름표 없는 액자 (쉬움, 핵심): 새 Curator's Pick은 명판 없이. 고양이가 2초 냄새 맡으면 명판이 나타남
- F2 새 문이 생긴다 (쉬움): 특별전이 열리면 벽에 문. 끝나면 사라짐
- F3 수장고 상자 (쉬움): From the Vault는 상자 안. "입고 중" 상자는 새 사진 예고
- F4 수요일 저녁 도슨트 (쉬움): Docent Talk는 수요일 18시 이후에만, 조명 낮아짐
- F5 메시의 냄새 추적 (보통): 새 콘텐츠 방향으로 고개, 가까우면 꼬리 빨라짐
- F6 Family Guide 카드 뒤집기 (보통) · F7 관람 도장 (보통) · F8 보존실 창문 (보통)
- F9 사유의 방의 침묵 (쉬움): 명판도 공유 버튼도 없음. 10초 머물면 메시가 앉음
- F10 메시의 안내 음성 (어려움)

F1~F4·F9는 루틴이 만드는 exhibitions.json 하나로 구현된다.

---

## 6. 규칙

- 이미지: 재해석 글의 이미지는 가족 사진만. 박물관 이미지는 쓰지 않는다(각주에 링크만).
- 형식 빌리기: 박물관 글의 구조와 말투만. 문장·사실·유물 이야기는 가져오지 않는다. "Format borrowed from …" 한 줄로 밝힌다.
- 수집 예절: 주 1회, 페이지당 1회, robots.txt 존중, 예약 잔여석·개인정보 안 읽음, API 우선.
- 사연 창작 금지: 가족 아카이브에 없는 사연은 쓰지 않는다. "(ask Dad)"가 남으면 게시 불가.
- 자동 생성 표시("curated by Messi, checked by Dad"), 어린이 사진 규칙 유지.

---

## 7. 결정 지점 E1~E7

- **E1 네트워크**: a. Custom 허용 목록(sources.yaml allowlist) / b. Full. **추천 a.** 확인: 환경 설정을 직접 바꿀 수 있는가?
- **E2 게시 방식**: a. 전부 초안 PR / b. 형식별 차등 / c. 전부 자동. **추천 a로 시작, 두 달 뒤 b.**
- **E3 문법을 배워 올 박물관**: a. 국립중앙박물관만 / b. + 메트(Family Guide)·영국박물관(보존 이야기) / c. + 레이크스·스미스소니언. **추천 b.** API·CC0 이미지는 이제 불필요.
- **E4 양과 첫 형식**: **추천 주 2편(Curator's Pick 고정 + 돌아가며 1편) + 월 1편.** 첫 두 달은 Curator's Pick과 Special Exhibition만. 확인: 기존 글 수, 사진 폴더 수?
- **E5 가족 아카이브 접근**: a. 라온로그를 GitHub(비공개)에 올림 / b. PC 예약 작업으로 시작. **추천 a.**
- **E6 성공 지표**: a. 발견률(방문자 한 명이 찾아낸 액자 수) / b. 가족 글 대비 재해석 글 조회 비율 / c. (ask Dad) 잔존율. **추천 a 북극성, c 안전장치.**
  확인: 방문 통계 도구가 붙어 있는가?
- **E7 언어**: **추천 영어 본문 + 한국어 고유명사 병기.**

---

## 8. 로드맵 (B트랙)

| 단계 | 기간 | 내용 |
|---|---|---|
| B0 | 이번 주 | E1~E7 확정, Custom 환경 생성(뉴스레터 도메인만), 라온로그 저장소 연결 또는 PC 예약 작업 결정 |
| B1 | 1주 | 문법 사전 v1 + 소장품 목록(collection.json) + 모든 글에 Object Label 초안 PR (글은 아직 안 씀) |
| B2 | 1주 | 첫 재해석 초안 PR: Curator's Pick 1편 + Special Exhibition 1편 |
| B3 | 1주 | 주간 루틴 가동 + exhibitions.json |
| B4 | A트랙 2단계 합류 | 발견 장치 F1~F4, F9 |
| B5 | 이후 | F5~F8, F10 |

---

## 9. 근거 (링크)

- 박물관신문 월간, 660호: https://webzine.museum.go.kr/sub_news/news_list.html
- 큐레이터와의 대화 매주 수 18·19시, 9월 20회: https://view.asiae.co.kr/article/2026083115410122773
- 특별전 우리들의 밥상 7.1~10.25, 상설전시실 일부 휴실 7.6~27.1.28: https://www.museum.go.kr/MUSEUM/contents/M0202010000.do?menuId=current
- 교육플랫폼 모두: https://modu.museum.go.kr/learn
- 12개 기관 전시정보 API: https://www.data.go.kr/data/15105037/openapi.do
- 메트 Open Access / API: https://www.metmuseum.org/hubs/open-access , https://metmuseum.github.io/
- 클리블랜드·시카고·스미스소니언·레이크스 API 개요: https://nordicapis.com/how-museums-are-using-apis-to-inspire-art-lovers-worldwide/ , https://data.rijksmuseum.nl/
- 박물관 RSS 목록: https://rss.feedspot.com/museum_rss_feeds/
- 구글 아츠앤컬처 국립중앙박물관: https://artsandculture.google.com/partner/national-museum-of-korea
- 사유의 방 인지도 1위·외국인 역대급: https://www.newsis.com/view/NISX20240717_0002814284
- 티스토리 후기(추천 동선 따라가면 망한다): easytraveltip.com (9장 HTML 보고서에 전체 링크)
- 다모앙 후기: https://damoang.net/free/4617623
- 디시 미니갤 후기: https://m.dcinside.com/mini/critique/2
- 해외 요약(airial): https://airial.travel/attractions/south-korea/national-museum-of-korea-rb35SxHz
- Korea.net: https://www.korea.net/NewsFocus/Culture/view?articleId=245366
- 박물관 피로 (Bitgood 2009): https://onlinelibrary.wiley.com/doi/abs/10.1111/j.2151-6952.2009.tb00344.x
- Claude Code 루틴 / 환경 문서: https://code.claude.com/docs/en/routines , https://code.claude.com/docs/en/cloud-environments

레딧 원문은 검색 엔진이 돌려주지 않았다. E1로 네트워크를 연 뒤 첫 루틴 실행 때 r/korea, r/koreatravel, r/seoul을 읽도록 지시문에 넣을 수 있다.
