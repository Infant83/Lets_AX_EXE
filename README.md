# AX_Literacy

AX Literacy 학습 포털 웹앱이다.

- 현재 GitHub 저장소 기준 웹앱 루트는 `AX_Literacy/`
- 서버는 `server.js`
- 프론트는 `public/`
- 강의 콘텐츠 원본은 `content/axcamp_repro/`

## 실행

```bash
cd AX_Literacy
npm install
node server.js
```

브라우저: `http://localhost:4071/`

## 현재 보이는 챕터 구조

학습 화면에는 아래 9개 챕터가 보인다.

1. `CH00` 오늘의 여정
2. `CH01` AI 핵심 개념
3. `CH02` 구조화된 프롬프팅
4. `CH03` NotebookLM
5. `CH04` 환경 설정
6. `CH05` Vibe Coding
7. `CH06` Agentic AI
8. `CH07` 참고자료 라이브러리
9. `CH08` Key Takeaways & Q/A

## 왜 `chapters/CH02` EXAONE 폴더가 남아 있나

`content/axcamp_repro/chapters/CH02/`는 원본 export 구조를 보존하기 위해 물리적으로는 남겨둔 상태다.

현재 앱은 소스 폴더를 직접 삭제한 것이 아니라, 런타임에서 EXAONE 클립 4개를 제외하고 뒤 챕터를 한 칸씩 당겨서 보여준다.

- canonical source: `CH02 = EXAONE`
- visible runtime: `CH02`는 숨김
- visible runtime: 원래 `CH03`이 화면에서는 `CH02`로 보임

즉, 현재 구조는 "원본 콘텐츠는 보존, 서비스 레이어에서 제외 및 재번호화" 방식이다.

## canonical 폴더와 visible 챕터 매핑

| source folder | source title | visible title |
| --- | --- | --- |
| `CH00` | 오늘의 여정 | `CH00` 오늘의 여정 |
| `CH01` | AI 핵심 개념 | `CH01` AI 핵심 개념 |
| `CH02` | EXAONE | 숨김 |
| `CH03` | 구조화된 프롬프팅 | `CH02` 구조화된 프롬프팅 |
| `CH04` | NotebookLM | `CH03` NotebookLM |
| `CH05` | 환경 설정 | `CH04` 환경 설정 |
| `CH06` | Vibe Coding | `CH05` Vibe Coding |
| `CH07` | Agentic AI | `CH06` Agentic AI |
| `CH08` | 참고자료 라이브러리 | `CH07` 참고자료 라이브러리 |
| `CH09` | Key Takeaways & Q/A | `CH08` Key Takeaways & Q/A |

## 폴더 구조

```text
AX_Literacy/
├─ server.js
├─ package.json
├─ public/
│  ├─ index.html
│  ├─ app.js
│  └─ styles.css
├─ data/
│  └─ users.json
├─ content/
│  └─ axcamp_repro/
│     ├─ export-report.json
│     ├─ chapters/
│     ├─ [공유용] LG AX Camp For Leaders 실습자료/
│     ├─ practice_zips/
│     └─ survey/
└─ README.md
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

## 배포 관련 메모

현재 앱은 `server.js`와 `/api/*`에 의존한다.

- 로컬 Node 서버: 가능
- GitHub Pages 정적 배포: 추가 정적화 작업 필요
