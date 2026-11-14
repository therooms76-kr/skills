# 로봇 경험 공유 플랫폼 — 조사 격자 (facts.json 요약)

> **사본 안내**: Google Drive 원본 「로봇경험공유플랫폼조사격자.md」(https://docs.google.com/document/d/1L94_ZqbBrsT6gq6M6aoFzeDkhCA5Ha4bmZ1EFMvtOq0)를 구축 인계용으로 옮겼습니다. 기호만 정리했고 내용은 그대로입니다 (원문 끝의 "출처 목록" 절은 표 안 링크와 같아 생략).
> **구축에 직접 필요한 문서는 아닙니다** — 사업계획서의 숫자가 어디서 왔는지 확인할 때만 보면 됩니다.

**기준일**: 2026-08-31 | 검산 스크립트 결과: 실패 0건, 경고 5건(회사 공식 블로그 경로 — 허용)

## 영상 주장 검증 + 조사 사실

| № | 대상 | 항목 | 값 | 기준시점 | 등급·확실성 | 영상 주장 | 판정 | 출처 |
|---|---|---|---|---|---|---|---|---|
| V1 | Microduck | 기본가 399달러, 예약 개시일 | $399, 2026-08-27 | 2026-08-27 | P1·확정 | 399달러, 어제 판매 시작 | 일치 | [C-1](https://pollen-robotics.com/microduck/) |
| V2 | Microduck | 24시간 주문액 | $2.6M+ (6시간 $1M) | 2026-08-28 | P2·추정 | 6시간 100만$, 24시간 260만$ | 일치(공동창업자 Thomas Wolf X 게시글, 감사 아님) | [C-2](https://tech.yahoo.com/ai/meta-ai/articles/hugging-face-says-roller-skating-164314293.html) |
| V3 | Microduck | 판매 목표·기존 최다판매 로봇 기준 | 5만 대 성공 기준, 기존 최다 약 2만 대 | 2026-08-27 | P2·추정 | CEO가 2만대 기록 넘길 것, 목표 5만대 | 일치(Delangue 발언, Axios 인터뷰) | [C-3](https://www.axios.com/2026/08/27/hugging-face-debuts-microduck-a-399-robot) |
| V4 | Microduck | 모터 수 | 15개 | 2026-08 | P1·확정 | 총 15개 서보/모터 | 일치 | [C-4](https://github.com/pollen-robotics/microduck) |
| V5 | Microduck | 액추에이터 = 로보티즈 Dynamixel XL330 | XL330 (14개 관절) | 2026-08 | P1·확정 | 사진 확대해 XL330-M288-T 추정, 14개 | 일치(학습 코드 README에 Dynamixel XL330 명시; M288-T 세부 모델명은 미확인) | [C-5](https://github.com/pollen-robotics/microduck_rl) |
| ★V6 | Microduck | 온보드 추론(내장 칩) | Rockchip RK3566, 50Hz 온보드 정책 루프, ONNX | 2026-08 | P1·확정 | (영상 언급 없음, 사용자 가설) | 사용자 가설 지지 | [C-4](https://github.com/pollen-robotics/microduck) |
| V7 | Nvidia–Hugging Face | 인수 보도 | $12.9B 합의 보도, 양사 미확인 | 2026-08-27 | P2·추정 | 디 인포메이션 129억$ 보도, 공식 발표 없음 | 일치(보도 단계; BI는 미서명 가능성 언급) | [C-6](https://techcrunch.com/2026/08/26/nvidia-closes-in-on-hugging-face-acquisition/) |
| V8 | Pollen Robotics | 허깅페이스 인수 시점 | 2025-04 | 2025-04-14 | P2·확정 | 2025년 4월 인수 | 일치 | [C-7](https://techcrunch.com/2025/04/14/hugging-face-buys-a-humanoid-robotics-startup) |
| V9 | Sony aibo | 연구 플랫폼 확대 | 2026-07-17 도쿄대·UC버클리에 연구용 시작기 대여 | 2026-07-17 | P2·확정 | 소니도 아이보를 피지컬 AI 연구 플랫폼으로 확대 | 일치(단, 마이크로덕 때문이 아니라 2026-06 국내판매 종료 후 자체 결정) | [C-8](https://www.watch.impress.co.jp/docs/news/2126022.html) |
| V10 | Sony aibo | 판매 중단·폐쇄 플랫폼 | 2026-06-25 일본 판매 종료(재고 소진 시), 서비스 유지 | 2026-06-25 | P1·확정 | 가격 높고 폐쇄적이어서 판매 이어지지 않음 | 부분 일치(판매 종료는 사실; '폐쇄적'은 해석) | [C-9](https://info.aibo.sony.jp/info/2026/06/20260625-01.html) |
| V11 | LeRobot | 서드파티 로봇 플러그인 | v0.4.0(2025-10) 플러그인, v0.5.0(2026-03) 정책 패키지 | 2026-03-09 | P1·확정 | 플러그인 방식으로 제3자 로봇 연결 | 일치 | [C-10](https://huggingface.co/blog/lerobot-release-v050) |
| ★V12 | Hugging Face | Reachy Mini 설치 기반·앱 수 | 약 1만 대, 앱 200+, 제작자 150+ | 2026-05-06 | P1·확정 | (영상 언급 없음) | 사용자 아이디어의 선행 사례 | [C-11](https://huggingface.co/blog/clem/reachymini-appstore) |
| ★V13 | Pollen | 행동 공유 의도 | 물리적 행동을 모델처럼 공유 | 2026-08-27 | P1·확정 | (영상 언급 없음) | 사용자 아이디어를 플랫폼사가 이미 선언 | [C-12](https://pollen-robotics.com/microduck/blog/introducing-microduck/) |
| V14 | Unitree | 휴머노이드 모션 앱스토어 | 2025-12 베타, 2026-05 UniStore | 2026-05-11 | P2·확정 | (영상 언급 없음) | 경쟁 선행 사례 | [C-13](https://www.digitimes.com/news/a20260511PD210/unitree-humanoid-robot-app-store.html) |
| V15 | Google DeepMind | 온디바이스 로봇 모델 | Gemini Robotics On-Device (2025-06), On-Device 2 (2026) | 2025-06-24 | P1·확정 | (사용자 가설) | 사용자 가설 지지 | [C-14](https://deepmind.google/discover/blog/gemini-robotics-on-device-brings-ai-to-local-robotic-devices/) |
| V16 | 1X | NEO 온보드 모델 | Redwood 160M 파라미터, 온보드 GPU 5Hz | 2025 | P1·확정 | (사용자 가설) | 사용자 가설 지지 | [C-15](https://www.1x.tech/discover/redwood-ai) |
| V17 | Anki | 클라우드 의존 실패 사례 | 150만 대 판매 후 2019 폐업, 서버 인수로 회생 | 2019-04 | P2·확정 | (영상 언급 없음) | 온디바이스 필요성 근거 | [C-16](https://venturebeat.com/technology/digital-dream-labs-will-revive-shuttered-startup-ankis-vector-robot) |
| V18 | 한국 정부 | 피지컬 AI 예산 | 휴머노이드 2.3조+피지컬AI 2.8조(~2030) | 2026-08-27 | P2·확정 | (영상 언급 없음) | 국내 시장 맥락 | [C-17](https://biz.heraldcorp.com/article/10854151) |
| V19 | 로보티즈 | 2025 실적 | 매출 389억(+29.6%), 영업이익 33억 흑자전환 | 2025 회계연도 | P3·추정 | 로봇은 액추에이터가 돈 버는 구조 | 참고(증권사 보고서; DART 확인 필요) | [C-18](https://kbthink.com/securities-view.html?docId=20260403144524187K) |
| V20 | IDC | 휴머노이드 출하 | 2025 1.8만 대 → 2030 51만 대 | 2026-04-23 | P3·추정 | (영상 언급 없음) | 시장 규모 참고 | [C-19](https://www.idc.com/resource-center/blog/humanoid-robotics-commercialization-2026/) |

## 파생값

| id | 설명 | 식 | 값 |
|---|---|---|---|
| D1 | 24시간 주문 환산 대수 | 2600000/399 | 6,516 |
| D2 | 5만 대 판매 시 액추에이터 수 | 50000*15 | 750,000 |

## 추가 조사 사실 (계획서 본문 인용분)

- Reachy Mini: $299/$449, 2025-07 출시, 5일 만에 $1M 주문(TechCrunch P2), 2026-08 누적 1만 대+(Pollen P1)
- 유니트리 2025: 매출 17억 위안, 4족 23,037대, 휴머노이드 5,215대(36Kr, 상장신청서 인용 P2); 휴머노이드 74% 연구·교육(분석가 P3)
- 1X NEO: $20,000 / 월 $499, 첫해 1만 대 5일 완판 주장(회사 보도자료 P1), 2026-04 시점 고객 인도 0
- Figure Helix 온보드 VLA(Figure P1, 2025-02), Gemini Robotics On-Device 2(DeepMind P1, 2026)
- OpenMind 앱스토어 앱 5개·개발자 1,000+(2차 P3), AgiBot LinkCraft 공유 기능(보도자료 P1)
- 소니 aibo 개발자 프로그램 2019(P1), 기본플랜 3년 99,000엔(P1), 벡터·아이보 리뷰 불만(TechRadar·Tom's Guide·Gizmodo P2)
- HF Hub: 모델 200만+, 데이터셋 50만+(HF P1, 2025-10); LeRobot 데이터셋 5.8만(IEEE Spectrum P2, 2026-05)
- 한국: 65세+ 20.7%, 1인가구 36.6%(국가데이터처 P1, 2026-07); 정부 K-피지컬AI 풀스택 전략(2026-06), 휴머노이드 2.3조+피지컬AI 2.8조(2026-08-27 P2); LG 클로이드 2027 홈로봇(경향 P2); 삼성 RX 사업부(서울경제 P2)
- 2026-08-31 직접 확인: HF Spaces Reachy Mini 앱 카드에 후기·별점·검증 배지·한국어 없음; 마이크로덕 신규 주문 4~6개월 대기(공식 스토어)
