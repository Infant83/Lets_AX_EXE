# AX_Literacy

AX Literacy 학습 포털 웹앱이다.

- 앱 루트: `AX_Literacy/`
- 저작/운영 서버: `server.js`
- 프론트엔드: `public/`
- 강의 콘텐츠 원본: `content/axcamp_repro/`
- GitHub Pages 정적 빌드 스크립트: `scripts/build-pages.mjs`

## 로컬 실행

```bash
npm install
npm start
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

`content/axcamp_repro/chapters/CH02/`는 원본 export 구조를 보존하기 위해 물리적으로 남겨둔 canonical source다.

런타임에서는 EXAONE 클립 4개를 제외하고 뒤 챕터를 한 칸씩 당겨서 보여준다.

- canonical source: `CH02 = EXAONE`
- visible runtime: `CH02`는 숨김
- visible runtime: 원래 `CH03`이 화면에서는 `CH02`로 보임

즉, 현재 구조는 원본 콘텐츠를 보존하면서 서비스 레이어에서 제외 및 재번호화하는 방식이다.

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

## GitHub Pages 빌드

이 저장소는 저작용 로컬 서버와 공개용 정적 배포본을 분리한다.

- 로컬 서버: 로그인, root 수정, 자산 업로드, 메타 재생성 지원
- GitHub Pages: 읽기 전용 공개 학습 사이트

정적 산출물 생성:

```bash
npm run build:pages -- --base-path /Lets_AX_EXE
```

생성 결과:

- 출력 폴더: `dist-pages/`
- 엔트리 파일: `dist-pages/index.html`, `dist-pages/404.html`
- 정적 데이터: `dist-pages/data/chapters.json`, `dist-pages/data/clips/*.json`
- 복사 자산: `dist-pages/assets/`, `dist-pages/course-files/`, `dist-pages/practice-files/`

정적 배포본에서는 다음이 유지된다.

- 챕터/클립 구조와 hash navigation
- 슬라이드 preview / modal / 다운로드
- 이미지, PDF, 오디오, 동영상, YouTube iframe
- 실습 자료 다운로드와 미리보기

정적 배포본에서는 다음이 비활성화된다.

- 로그인/회원가입
- root 본문 수정 / 사이드바 수정 / 자산 업로드
- 서버 저장형 과제/관리 기능

개인용 진도/메모는 공개 정적 사이트에서 `localStorage` 기반으로만 유지된다.

## GitHub Pages Publish

workflow 파일:

- `.github/workflows/pages.yml`

동작 방식:

1. `main` 브랜치 push 또는 수동 실행
2. `npm install`
3. `npm run build:pages -- --base-path "/${repoName}"`
4. `dist-pages/`를 Pages artifact로 업로드
5. GitHub Pages에 배포

배포 대상 예시:

- `https://infant83.github.io/Lets_AX_EXE/`

설정 시 GitHub 저장소에서 아래만 확인하면 된다.

1. `Settings -> Pages`
2. `Build and deployment`를 `GitHub Actions`로 선택
3. `main` 브랜치에 workflow 파일이 올라간 상태로 push

## 폴더 구조

```text
AX_Literacy/
├─ .github/workflows/pages.yml
├─ docs/GITHUB_PAGES_STATICIZATION.md
├─ scripts/build-pages.mjs
├─ server.js
├─ package.json
├─ public/
│  ├─ index.html
│  ├─ app.js
│  └─ styles.css
├─ content/
│  └─ axcamp_repro/
│     ├─ export-report.json
│     ├─ chapters/
│     ├─ [공유용] LG AX Camp For Leaders 실습자료/
│     ├─ practice_zips/
│     └─ survey/
└─ README.md
```

## 참고 문서

- [content/axcamp_repro/README.md](content/axcamp_repro/README.md)
- [docs/GITHUB_PAGES_STATICIZATION.md](docs/GITHUB_PAGES_STATICIZATION.md)
