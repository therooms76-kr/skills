# exhibitions.json 형식

주간 루틴(메시 학예사)이 매주 갱신하고, 박물관 앱(`app/data/exhibitions.json`)이 읽는 파일. 없어도 박물관은 동작한다.
루틴은 이 파일을 **덮어쓰지 말고** 기존 항목을 유지한 채 새 항목을 더하고, 기간이 지난 특별전은 그대로 둔다 (앱이 날짜로 거른다).

```json
{
  "generatedAt": "2026-10-06T07:00:00Z",
  "generatedBy": "messi-curator-routine",
  "special": [
    {
      "id": "three-bowls",                       // 영문 소문자·하이픈. 복도 문 id는 sp-<id>
      "title": "Three Bowls, Three Seasons",     // 현수막에 적히는 제목
      "subtitle": "SPECIAL EXHIBITION · NOODLES OF 2026",
      "from": "2026-10-01", "to": "2026-12-31",  // 이 기간에만 복도에 문이 생긴다
      "side": "R", "t": 0.70,                    // 복도 벽(L/R)과 깊이(0 입구 .. 1 끝). 생략하면 자동
      "statement": "기획 의도 두세 문장. 전시실 벽에 적힌다.",
      "posts": ["kalguksu-after-the-museum", "..."]   // museum.json의 글 id. 기존 글을 다시 묶는다
    }
  ],
  "docent": [
    {
      "postId": "a-rainy-saturday-at-the-national-museum-of-korea",
      "when": { "weekday": 3, "from": "18:00", "to": "21:00" },   // 0 일요일 .. 6 토요일. 방문자 브라우저 시각 기준
      "questions": [ { "q": "라온이의 실제 질문", "a": "메시의 답. 모르면 (ask Dad)" } ]
    }
  ]
}
```

## 앱이 하는 일

- `special`: 기간 안이면 복도 오른쪽(또는 지정한 벽)에 붉은 현수막이 달린 문이 생긴다. 들어가면 지정한 글들이 진열장에 걸리고,
  벽에 기획 의도가 적힌다. 처음 들어가면 발견 점수(+25). 기간이 끝나면 문이 사라지고 글은 원래 전시실에 그대로 있다.
- `docent`: 해당 글의 진열장 위에 "수요일 18:00 도슨트" 표가 붙는다. 그 시간에 열면 미리보기 창에 질문·답 패널이 나오고 발견 점수(+25).
  시간 밖이면 "그때 다시 오세요" 안내만.
- 수장고 상자(From the Vault)는 이 파일이 아니라 글의 프런트매터 `vault: true`로 정한다. 루틴이 1년 전 글에 이 표시를 제안할 수 있다.

## 루틴이 지켜야 할 것

- 특별전은 동시에 2개까지. 기간은 4~12주.
- `posts`의 id는 museum.json에 있어야 한다. 없는 id는 앱이 조용히 건너뛴다.
- 도슨트 질문은 가족 아카이브에 실제로 적힌 라온이의 말만. 답을 모르면 `(ask Dad)`.
- 사람이 PR을 승인하기 전에는 이 파일을 main에 올리지 않는다 (E2).
