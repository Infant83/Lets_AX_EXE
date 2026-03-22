# AX_Literacy

AX Literacy 학습 포털입니다.

- CH00~CH09 콘텐츠를 학습하고
- 계정별 진도/과제/노트를 저장합니다.

교육과정 제작은 별도 앱 `AX_Builder`에서 관리합니다.

## 실행

```bash
cd AX_Literacy
node server.js
```

브라우저: `http://localhost:4070/`

## 폴더 구조 (핵심)

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
      ├─ [공유용] LG AX Camp For Leaders 실습자료/
      ├─ practice_zips/
      ├─ survey/
      ├─ padlet/
      ├─ external_links/
      ├─ screenshots/
      └─ task_check/
```

## 주요 API

- `POST /api/signup`
- `POST /api/login`
- `POST /api/logout`
- `POST /api/account`
- `POST /api/password-hint`
- `POST /api/password-recover`
- `GET /api/me`
- `GET /api/chapters`
- `GET /api/clips/:clipKey`
- `GET/POST /api/progress`
- `GET/POST /api/ax-task`
- `GET/POST /api/notes`
- `GET /course-files/...`
- `GET /practice-files/...`

## 워크스페이스

```text
AX_Camp/
├─ AX_Literacy/
├─ AX_Builder/
└─ AX_Literacy_archive/
```
