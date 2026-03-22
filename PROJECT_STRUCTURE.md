# AX_Literacy Structure

## 1) 루트 구조

```text
AX_Camp/
├─ AX_Literacy/          # 학습 포털
├─ AX_Builder/           # 교육과정 제작 캔버스
└─ AX_Literacy_archive/  # 과거 수집/도구/백업 자산
```

## 2) AX_Literacy 내부 구조

```text
AX_Literacy/
├─ server.js
├─ package.json
├─ README.md
├─ PROJECT_STRUCTURE.md
├─ public/
│  ├─ index.html
│  ├─ app.js
│  └─ styles.css
├─ data/
│  └─ users.json
├─ preview/
└─ content/
   └─ axcamp_repro/
      ├─ export-report.json
      ├─ chapters/
      │  └─ CHxx/chxx-clipyy/
      │     ├─ metadata.json
      │     ├─ content.html
      │     ├─ content.md
      │     ├─ content.txt
      │     └─ screenshot.png (optional)
      ├─ [공유용] LG AX Camp For Leaders 실습자료/
      ├─ practice_zips/
      ├─ survey/
      ├─ padlet/
      ├─ external_links/
      ├─ screenshots/
      └─ task_check/
```

## 3) 서버 로딩 규칙

- 콘텐츠 루트 탐색 우선순위
  1. `AX_Literacy/content/axcamp_repro`
  2. `../axcamp_repro` (fallback)
- 챕터 카탈로그는 `export-report.json` 기준
- 클립 렌더링은 `content.html` 우선, 없으면 `content.md`/`content.txt` fallback

## 4) 정적/다운로드 라우트

- `/course-files/{clipKey}/...` -> 각 클립 폴더 내부 리소스
- `/practice-files/{key}` -> `PRACTICE_FILE_MAP`에 정의된 실습파일/zip

## 5) 역할 분리

- `AX_Literacy`: 학습 소비(학습/진도/과제/노트)
- `AX_Builder`: 과정 제작(챕터/섹션 설계, 내보내기, 발행)
