# Raonlog Museum (app)

고양이가 돌아다니는 박물관형 블로그 입구. 정적 파일만으로 동작한다 (빌드 도구 없음, 게임 엔진 없음).

## 실행

```
cd app
node tools/build-manifest.js --posts sample-content/posts --out data/museum.json   # 글 → 전시 데이터
python3 -m http.server 8080                                                        # 또는 아무 정적 서버
# http://localhost:8080/index.html
```
`file://`로 직접 열면 fetch가 막혀 데이터를 못 읽는다. 꼭 로컬 서버로 연다.

## 점검

```
node tools/smoke.js   # Playwright + Chromium 필요. 복도 → 전시실 → 진열장 → 글 읽기 → 도장 → 저장 확인
```

## 바꾸는 곳

- 디자인: `theme/<이름>/theme.json` (고양이 스프라이트, 배경 사진, 색, 글꼴, 진열장 모양). `?theme=이름`으로 미리 보기.
- 전시 데이터: `data/museum.json` (글 폴더에서 `tools/build-manifest.js`로 생성).
- 코드: `src/`. 디자인 교체 때는 건드리지 않는다.

자세한 계획은 `DEV-PLAN.md`.
