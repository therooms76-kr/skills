# 라온로그 살아있는 박물관 계획안 (2부, v0.1, 토의용)

작성일: 2026-09-06
이어지는 문서: PLAN.md (1부, 고양이 박물관)
함께 있는 파일: `agent/sources.yaml` (수집 통로 목록 + 허용 도메인), `agent/weekly-museum-watch.prompt.md` (루틴 지시문 초안)

---

## 0. 한눈에

- **의견 재조사**: 해외(트립어드바이저, 여행 가이드, 레딧·틱톡 요약 사이트)와 국내(티스토리, 다모앙, 디시, 서브스택,
  서울시 미디어허브)에서 14개 출처, 20여 개 의견. 1부의 7가지 패턴이 그대로 확인됐고 새 패턴 2개가 추가됐다.
  - A. 추천 동선을 거부한다: "추천 동선 따라가면 망한다. 볼 것 3개를 정하고 간다." → '내 코스 만들기'
  - B. 대표작 앞에서 사진 줄: "사유의 방은 사진 줄 때문에 사유가 안 된다." → 사유의 방엔 공유 버튼을 두지 않음
- **매주 수집 에이전트**: 국립중앙박물관은 월간 박물관신문, 보도자료, 매주 수요일 큐레이터와의 대화, 특별전 일정,
  교육플랫폼 '모두'를 정기적으로 낸다. 해외는 메트·클리블랜드·시카고·레이크스·스미스소니언이 공개 API를 연다.
  이를 매주 월요일 Claude Code 루틴으로 읽어 "이번 주 박물관" 초안을 PR로 올린다.
- **살아있는 체험**: 자동 글이 게임 속 '이번 주 전시실'에 새 액자로 걸리고, 수·토 밤에는 야간 개장 조명,
  해외 박물관에서 '대여 온 유물'이 걸린다.

한계 두 가지:
1. 이 세션은 웹 검색은 되지만 페이지 직접 열기가 전부 차단되어, 의견은 검색 요약과 요약 사이트로 모았다.
2. 같은 이유로 에이전트도 지금 환경으로는 돌 수 없다. 환경 네트워크를 Custom/Full로 바꿔야 한다 (E1).

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

## 2. 소식 통로 (정기 발행만)

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

## 3. 매주 수집 에이전트 ("메시 도슨트" 루틴)

파이프라인 (매주 월 07:00 KST):
1. 수집 (sources.yaml 통로 12곳) → 2. 새것만 (seen.json 비교) → 3. 가족 점수 0~5 (무료, 7세 적합, 예약, 임박, 야간)
→ 4. 초안 3종 작성 (라온로그 문체, 영어) → 5. **사람 검토 (초안 PR)** → 6. 게시 → 7. 게임 속 '이번 주 전시실' 갱신

실행 방법 비교:
- a. Claude Code 루틴 (클라우드): 노트북 불필요, 주 1회 예약, 세션 기록, 초안 PR 자동. 네트워크 Custom/Full 필요. **추천**
- b. GitHub Actions: 수집만 맡기는 하이브리드로 2단계에 검토
- c. 내 PC 예약 작업: PC가 켜져 있어야 함. 보류

지시문 초안: `agent/weekly-museum-watch.prompt.md`. 통로 목록: `agent/sources.yaml`.

---

## 4. 콘텐츠 생성 계획

박물관 소식지의 세 문법(새로 열린 것 / 이달의 유물 / 가족 프로그램)을 빌리고, 문장은 라온로그 문체로.

| 형식 | 주기 | 재료 | 게임 속 위치 |
|---|---|---|---|
| This Week at the Museum | 주 1편 (월) | 보도자료, 특별전, 큐레이터와의 대화, 행사 | 이번 주 전시실 첫 액자 |
| Object of the Week | 주 1편 (목) | 큐레이터 추천 소장품 + 해외 CC0 유물 1점 | 사유의 방 옆 벽 |
| Family Museum Calendar | 월 1편 | 모두 프로그램, 어린이박물관 예약 오픈 | 카페 게시판 |
| Two Museums, One Object | 월 1~2편 | 국립중앙박물관 ↔ 메트·클리블랜드·스미스소니언 | 대여 전시실, 털실 연결 |
| We Went (실제 방문기) | 다녀올 때 | 기존 raonlog-blog-writer 워크플로 | 카테고리 방 + 예고 글과 연결 |

가장 중요한 연결: 자동 글(예고)과 실제 방문기(후기)가 짝을 이룬다. 두 액자가 실로 이어지고, 이것이 성공 지표가 된다.

자동 글 문체 규칙 추가분: 출처 링크 필수, 라온이 시선 한 줄, "Should we go?" 판정, 머리에 "drafted by Messi the docent,
checked by Dad", 확인 못 한 사실은 "(to verify)".

예시 2편(HTML 보고서 4장): "This Week at the National Museum of Korea (Sept 8–14): Our Table, and a Wednesday Night Plan",
"Object of the Week: A Pensive Bodhisattva in Seoul, and Its Cousin in New York". 사실은 검색 요약 기반, 발행 전 확인 필요.

---

## 5. 살아있는 체험 (난이도 순)

- L1 이번 주 전시실 (쉬움) · L2 야간 개장 조명, 수·토 18시 이후 (쉬움) · L3 대여 전시실 On Loan (보통, API)
- L4 메시의 오늘 한마디 (쉬움) · L5 내 코스 만들기 + 발자국 (보통) · L6 계절과 날씨 (보통, 날씨 API)
- L7 방명록 벽과 질문 상자 (보통) · L8 음성 도슨트 (어려움) · L9 실감영상관 방 (어려움) · L10 세계 박물관 순회 (어려움)

모두 3장의 주간 루틴이 만든 데이터 파일을 쓴다. 루틴이 먼저, 체험은 그 위에.

---

## 6. 규칙

- 이미지: 해외 CC0만 직접 게시. 국립중앙박물관은 공공누리 확인 전까지 링크만. 영국박물관은 소식만.
- 글: 사실만 가져오고 문장은 새로. 출처 링크 필수.
- 수집 예절: 주 1회, 페이지당 1회, robots.txt 존중, 예약 잔여석·개인정보 안 읽음, API 우선.
- 자동 생성 표시, "(to verify)" 남으면 게시 불가, 어린이 사진 규칙 유지.

---

## 7. 결정 지점 E1~E7

- **E1 네트워크**: a. Custom 허용 목록(sources.yaml allowlist) / b. Full. **추천 a.** 확인: 환경 설정을 직접 바꿀 수 있는가?
- **E2 게시 방식**: a. 전부 초안 PR / b. 형식별 차등 / c. 전부 자동. **추천 a로 시작, 두 달 뒤 b.**
- **E3 해외 범위**: a. 0곳 / b. 메트·클리블랜드·시카고 / c. + 레이크스·스미스소니언·영국박물관. **추천 b, 3개월 뒤 c.**
- **E4 양**: **추천 주 2편 + 월 1편.**
- **E5 이미지**: **추천 CC0만 저장, 나머지 링크.** 국립중앙박물관 공공누리 유형 확인 요청.
- **E6 성공 지표**: a. 예고→방문 전환(월 1회) / b. 방문자당 읽은 글 수 / c. 자동 글 오류율. **추천 a 북극성, c 안전장치.**
  확인: 가족의 박물관·전시 방문 빈도?
- **E7 언어**: **추천 영어 본문 + 한국어 고유명사 병기.**

---

## 8. 로드맵 (B트랙)

| 단계 | 기간 | 내용 |
|---|---|---|
| B0 | 이번 주 | E1~E7 확정, Custom 환경 생성, data.go.kr API 키, 메트·클리블랜드 호출 확인 |
| B1 | 1주 | 수집기 MVP: 국립중앙박물관 5개 통로, seen.json, 보고서 PR (글은 아직 안 씀) |
| B2 | 1주 | 생성기 + 초안 PR: This Week 1편, 둘째 주부터 Object 추가 |
| B3 | 1주 | 해외 3곳 + 두 박물관 한 유물 |
| B4 | A트랙 2단계 합류 | 게임 속 이번 주 전시실, 야간 개장, 대여 전시실 (L1~L4) |
| B5 | 이후 | L5~L10 |

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
