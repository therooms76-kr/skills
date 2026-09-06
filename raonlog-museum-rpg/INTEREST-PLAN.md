# 사람들이 정말 흥미를 느낄까? (3부, v0.1, 토의용)

작성일: 2026-09-06
앞선 문서: PLAN.md (1부 고양이 박물관), LIVING-MUSEUM-PLAN.md (2부 살아있는 박물관)
함께 있는 파일: `interest-report.html` (이 문서의 HTML판 + 관람 여권 점수 루프 데모)

---

## 0. 답부터

**첫 방문의 흥미는 거의 확실, 두 번째 방문은 조건부.**

흥미를 끈다는 증거:
- 게임형 개인 사이트는 화제가 된다 (Robby Leonardi 마리오식 이력서, Bruno Simon 3D 자동차 포트폴리오, 국제 웹 어워드 다수).
- Neal.fun: 방문 약 960만, 평균 체류 5분 23초, 방문당 5.77페이지.
- Wordle 공유 격자: 2022년 1월 초 2주에 격자 트윗 120만 개.
- 박물관에서도 통한다: 얌틀리 시간여행 여권, 국가유산 방문자 여권(인기 코스 조기 소진), 스미스소니언 ARG(3개월 6,000명),
  Occupy White Walls × 버밍엄(3주에 작품 2만 회 수집).
- 퀴즈는 일반 페이지 대비 참여 약 3배, 월 30회 재방문 사례.

식는다는 증거:
- 신기함 효과: 게임화 연구 24편 리뷰는 "효과 있으나 맥락 의존, 시간 따라 감소". 장기 추적 연구도 효과 크기 감소.
- 배지의 함정: 스택오버플로에서 배지 직전 활동 증가, 직후 원상복귀 (Anderson 외 2013).
- 게임이 글을 가린다: Bruno Simon조차 "비게이머는 점프 키를 못 찾았다". 평론은 "일부러 불친절".
- 박물관 피로: 30~45분 후 집중 저하.
- 빈자리: 가족 블로그를 RPG + 점수로 운영하는 직접 사례는 못 찾음. 기회이자 선례 없음.

결론: 흥미는 두 층. 첫 방문은 "고양이가 걷는 박물관" 장면 하나로 생긴다. 두 번째 방문은 세 조건이 필요하다.
① 게임이 읽기를 절대 막지 않는다 ② 매주 새로 찾을 것이 있다(2부) ③ 점수가 가볍고 공유할 수 있다.

설계 원칙 3초·30초·3분: 3초 안에 글 / 30초 안에 첫 도장 / 3분 안에 공유 카드.

---

## 1. 증거 요약 (링크는 7장)

| 출처 | 결과 | 우리에게 |
|---|---|---|
| Hamari 외 리뷰, 장기 추적 연구 | 효과 있으나 감소 | 점수만으론 부족, 매주 새 발견물 |
| Anderson 외, 배지 | 배지 직전 증가, 직후 복귀 | 등급 문턱을 촘촘히 |
| Neal.fun | 체류 5분 23초, 5.77페이지 | 설명 없는 명확한 한 가지 |
| Wordle / NYT Games | 격자 트윗 120만, 다중 게임 구독자 유지율↑ | 공유 카드, 교차 유입 |
| Duolingo | 월 이탈률 47%→28%, 스트릭 유지자 3배 | 단 매일 알림은 과함, 주 단위 |
| 퀴즈 보고서 2025 | 참여 3.02배, 6~10문항 최적 | 액자당 1문항, 주간 6문항 |
| 얌틀리·국가유산 여권 | 저비용 성공, 조기 소진 | 관람 여권이 뼈대 |
| 스미스소니언 ARG, OWW | 6,000명 / 3주 2만 회 | 이야기 퀘스트, '내 전시' 후보 |
| Bruno Simon 사례연구 | 비게이머 조작 실패 | 탭만으로, 목록 보기 한 클릭 |

---

## 2. 해외 사례 14곳

A. 캐릭터가 돌아다니는 개인 사이트: Robby Leonardi(스크롤=걷기), Bruno Simon(장면 하나의 힘, 조작 문제),
Henry Heffernan(익숙한 UI 차용), Jesse's Ramen(가게 안 사물=콘텐츠), Daniel Sternlicht(2D RPG, 방=섹션, 우리와 가장 가까움),
Chase Naidoo / atilio-ts(Kaboom.js 탑다운, 오픈소스), mewmew(접근성까지 잡은 레트로 포트폴리오).
B. 점수·습관형: Wordle/NYT Games, Duolingo, Stack Overflow 배지, Neal.fun, Bloomberg 'Pointed'(주간 퀴즈).
C. 박물관 게임화: 얌틀리 여권, 국가유산 방문자 여권, Occupy White Walls, The Museum of the World(연결선 탐색).
D. 읽기 중심: The Pudding(스크롤이 재미면 게임이 필요 없다는 반례).

결론 셋: ① 화제가 된 게임형 사이트는 '장면 하나'는 강했고 '다시 올 이유'는 약했다 → 2부 주간 발견물로 보완.
② 다시 오게 한 서비스는 전부 '가벼운 반복 + 공유' → 여권 도장과 공유 카드. ③ 접근성·조작이 공통 약점 → '3초 안에 글'.

---

## 3. 점수 설계: 관람 여권

| 층 | 무엇 | 점수 |
|---|---|---|
| L1 관람 도장 | 글을 끝까지 읽으면 자동 도장. 방을 다 채우면 방 배지 | +10 |
| L2 발견 점수 | 이름표 없는 액자, 수장고 상자, 특별전 문, 메시 특별 동작. 매주 새로 | +25 |
| L3 도슨트 퀴즈 | 글마다 1문항 + 금요일 '어느 방일까?' 6문항, 색 격자 공유 | +15 |
| 주간 퀘스트 | 도장 3 · 발견 1 · 퀴즈 1 | +50, 3주 연속이면 스트릭 리본 |

등급(보상은 전부 꾸미기, 콘텐츠 해금 없음): Visitor 0 → Regular 50(목걸이 색) → Friend of the Museum 120(모자, 잉크 색)
→ Patron 250(후원자의 벽 닉네임) → Honorary Curator 500(내 코스를 로비에).

리듬은 주 단위: 월요일 새 발견물, 금요일 주간 퀴즈. 매일 알림 없음.

지키는 선: 콘텐츠 해금 없음 / 수장고(목록) 한 클릭 / 알림 없음 / 점수는 브라우저 저장, 닉네임 정하면 서버 / 탭만으로, 퀴즈 2지선다.

---

## 4. 데모 (interest-report.html 4장)

점수 루프만 떼어 낸 관람 여권: 액자 클릭 → 글 끝까지 스크롤 → 도장(+10) → 퀴즈(+15) / 이름표 없는 액자·수장고 상자(+25)
→ 등급 바 → 주간 퀘스트 → 도장 3개부터 Wordle식 공유 카드.

확인해 볼 것: 도장이 기분 좋은가 / '찾았다' 느낌이 나는가 / 공유 카드를 붙여 넣고 싶은가 / 점수가 읽기를 방해하는 순간이 있는가.

---

## 5. 검증 계획 (만들기 전에)

| 테스트 | 무엇 | 대상·기간 | 합격선 |
|---|---|---|---|
| T1 첫인상 | 1부 프로토타입 + 여권 합친 한 방짜리 페이지 | 지인 20명, 1주 | 액자 3개 이상 연 사람 60%↑, "다시 오고 싶다" 3.5/5↑, 공유 카드 만든 사람 30%↑ |
| T2 신기함 소멸 | 매주 월요일 "새 발견물 2개" 한 줄 소식 | 같은 20명, 4주 | 4주째 재방문 40%↑ (20% 아래면 발견물만으론 부족) |
| T3 입구 비교 | 홈을 반은 박물관, 반은 목록으로 | 실제 방문자, 4주 | 박물관 쪽 방문당 읽은 글 수가 높을 것 |

순서: T1(2주) → 통과 시 T2 + 1부 A트랙 1단계 → T3는 방 5개 완성 후. T1에서 3점 아래면 게임을 줄이고 2부 재해석 글에 집중.

---

## 6. 결정 지점 G1~G6

- G1 점수의 무게: a. 도장만 / b. 도장+발견+등급 / c. 세 층 전부+공유. **추천 b로 시작, T1 결과로 c 결정.**
- G2 공유 카드: a. Wordle식 글자 격자 / b. 여권 이미지. **추천 a.**
- G3 리더보드: **추천 없음. Patron부터 '후원자의 벽'(순위 없는 닉네임).** 확인: 닉네임 수집에 대한 생각?
- G4 등급 보상: **꾸미기만. 콘텐츠 해금 절대 없음.** 확인: 고양이 액세서리 덧그림 가능?
- G5 주간 퀴즈 형식(c일 때): a. 어느 방일까?(입구 역할) / b. 글 세부(보상 역할). **추천 a.**
- G6 검증 순서: **T1(2주)을 A트랙 1단계보다 먼저.** 확인: 링크 보낼 지인 20명?

---

## 7. 근거 링크

- 게임화 장기 연구: https://www.sciencedirect.com/science/article/abs/pii/S074756322030145X ,
  https://www.researchgate.net/publication/358614501
- 배지: https://www.cs.cornell.edu/home/kleinber/www13-badges.pdf , https://arxiv.org/pdf/2008.06125
- Neal.fun: https://www.similarweb.com/website/neal.fun/
- Wordle: https://hackernoon.com/wordle-how-the-latest-internet-sensation-went-viral
- NYT Games: https://digiday.com/media/the-next-level-for-us-the-new-york-times-eyes-longer-play-sessions-for-games-in-subscription-drive/
- Duolingo: https://vmobify.com/blog/how-duolingo-grew
- 퀴즈 보고서: https://www.riddle.com/blog/news-reviews/2025-quiz-marketing-report/
- 박물관 게임화 12사례: https://octalysisgroup.com/2020/04/12-gamification-examples-transforming-the-visitor-experience-in-museums/
- 국가유산 방문자 여권: https://www.kh.or.kr/visit/kor/content.do?key=2407110055
- 스미스소니언 ARG: https://mith.umd.edu/dialogues/ghosts-of-a-chance-a-museum-based-alternate-reality-game/
- Occupy White Walls: https://blooloop.com/museum/in-depth/occupy-white-walls-birmingham-museums/
- Bruno Simon 사례: https://medium.com/@bruno_simon/bruno-simon-portfolio-case-study-960402cc259b
- 게임형 사이트 목록: https://www.hongkiat.com/blog/pixel-based-websites/ , https://github.com/ChaseNaidoo/Pixel_art_portfolio ,
  https://dev.to/mewmewdevart/i-built-a-retro-gamified-portfolio-yes-with-pixel-art-games-windows-95-vibes-589k
- Bloomberg Pointed: https://newsmachines.substack.com/p/how-news-publishers-use-quizzes

페이지 직접 열기는 차단되어 검색 요약 기반. 숫자는 링크에서 확인 필요.
