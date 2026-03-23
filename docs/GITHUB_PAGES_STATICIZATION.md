# GitHub Pages Staticization

## Goal

현재 `AX_Literacy`의 교육 콘텐츠와 화면 구조를 최대한 유지하면서, 읽기 전용 공개 학습 사이트를 `GitHub Pages`에 배포할 수 있는 정적 산출물 흐름을 설계한다.

대상 URL 예시:

- `https://infant83.github.io/Lets_AX_EXE/`

## Current Status

현재 구현은 완료된 상태다.

- build script: `scripts/build-pages.mjs`
- npm command: `npm run build:pages -- --base-path /Lets_AX_EXE`
- GitHub Actions workflow: `.github/workflows/pages.yml`
- output directory: `dist-pages/`

즉, 이 문서는 더 이상 순수 설계안이 아니라 현재 구현된 staticization 구조 설명서다.

## Why This Needs a Separate Build

현재 앱은 정적 파일만으로 동작하지 않는다.

- 프론트는 `/api/*`에 의존한다.
  - `GET /api/chapters`
  - `GET /api/clips/:clipKey`
  - `GET/POST /api/progress`
  - `GET/POST /api/notes`
  - `GET/POST /api/ax-task`
  - `POST /api/login`, `/api/signup`, `/api/account`
  - `GET /api/admin/*`
- 서버는 `content/axcamp_repro/`를 읽어 visible catalog를 런타임에 조립한다.
- 현재 visible chapter 번호는 canonical folder 번호와 다르며, EXAONE 제거 및 재번호화가 서버에서 일어난다.
- `public/index.html`, `public/app.js`는 `/styles.css`, `/app.js`, `/assets/...`처럼 site-root 절대경로를 쓰고 있다.

즉, `Pages`용 공개 사이트는 현재 `authoring/runtime server`와 별도 build target이어야 한다.

## Scope

### Must Keep

- 현재 교육용 페이지의 시각 구조
- 챕터/클립 순서와 hash navigation
- 슬라이드 preview / modal / 다운로드 링크
- 이미지, PDF, 오디오, 동영상, YouTube iframe 같은 본문 자산
- 실습 다운로드 링크
- EXAONE 제거 후 보이는 visible chapter numbering

### Can Be Disabled In Static Site

- 로그인/회원가입
- 계정정보 수정
- 서버 저장형 진도/과제/메모
- root 본문 수정 / 사이드바 수정 / 자산 업로드
- admin users 화면

### Optional Later

- `localStorage` 기반의 개인 진도/메모만 간단히 유지
- 공개 Pages에서는 읽기만 가능하고, 로컬 Node 서버에서는 authoring 가능

## Recommended Architecture

### 1. Authoring Runtime

현재 구조를 유지한다.

- 실행: `node server.js`
- 목적: 강의 편집, root 수정, 자산 업로드, 메타 재생성
- source of truth:
  - `content/axcamp_repro/`
  - `public/`
  - `server.js`

### 2. Static Public Build

새 build step이 visible runtime 결과를 미리 생성한다.

- 출력: `docs/` 또는 `dist-pages/`
- 목적: `GitHub Pages` 공개 학습 사이트
- 특징:
  - 읽기 전용
  - 서버 API 없음
  - 모든 clip payload와 file asset이 정적 파일로 존재

## Deployment Modes

### Recommended

`GitHub Actions`로 source branch에서 static artifact를 빌드하고 Pages에 배포한다.

장점:

- build output을 source tree에 커밋하지 않아도 된다
- custom build process에 자연스럽다
- source와 deploy artifact를 분리할 수 있다

비용 메모:

- `public repository`에서 `standard GitHub-hosted runner`를 쓰는 경우, GitHub 공식 문서 기준으로 `GitHub Actions` 사용은 무료다.
- `GitHub Pages` 자체도 public repo 기준으로 일반적으로 무료 범위에서 운영 가능하다.
- 단, `private repository`, `larger runner`, 과도한 artifact/storage 사용은 별도 과금 대상이 될 수 있다.
- 따라서 이 프로젝트는 `Lets_AX_EXE`를 public으로 유지하고, 기본 `ubuntu-latest` runner만 쓰는 구성이 가장 안전하다.

### Simpler Fallback

로컬에서 `npm run build:pages`를 실행해 `docs/`를 만든 뒤, `main/docs`를 Pages publishing source로 사용한다.

장점:

- 설정이 단순하다
- GitHub UI에서 branch publish로 바로 연결 가능하다

단점:

- build output도 repo에 같이 커밋해야 한다

## Static Output Layout

권장 출력 구조:

```text
docs/
├─ .nojekyll
├─ index.html
├─ 404.html
├─ app.js
├─ styles.css
├─ assets/
│  └─ ...
├─ data/
│  ├─ runtime-config.json
│  ├─ chapters.json
│  └─ clips/
│     ├─ ch00-clip01.json
│     ├─ ch00-clip02.json
│     └─ ...
├─ course-files/
│  └─ {clipKey}/...
└─ practice-files/
   └─ ...
```

## Build Pipeline

### Phase A. Visible Catalog Freeze

build script는 서버가 currently 수행하는 visible mapping을 그대로 재현해야 한다.

- `EXCLUDED_CLIP_KEYS`
- canonical -> visible chapter mapping
- canonical -> visible clipKey mapping
- 본문 내 `#ch..-clip..` 링크 재작성

중요 원칙:

- static build는 canonical export를 직접 publish하지 않는다
- 반드시 visible runtime 기준 결과를 publish한다

### Phase B. Static API Snapshot

현재 `/api/chapters`, `/api/clips/:clipKey` 응답과 같은 정보를 정적 JSON으로 생성한다.

- `data/chapters.json`
- `data/clips/{clipKey}.json`

각 clip JSON은 최소한 아래를 포함한다.

- `clipKey`
- `route`
- `title`
- `chapterId`
- `chapterNum`
- `chapterTitle`
- `overview`
- `badges`
- `html`
- `text`
- `links`
- `sections`
- `images`
- `iframes`
- `audios`
- `videos`

### Phase C. Public Asset Copy

다음을 `docs/`로 복사한다.

- `public/assets/**`
- clip별 `assets/**`
- `screenshot.png`
- `practice-files` 대상 파일들

정책:

- Pages용은 읽기 전용 복사본만 가진다
- authoring용 폴더 구조는 그대로 보존한다

### Phase D. Base Path Rewrite

project site는 repository path prefix를 가진다.

예시:

- root site: `https://infant83.github.io/`
- project site: `https://infant83.github.io/Lets_AX_EXE/`

따라서 정적 런타임은 `BASE_PATH=/Lets_AX_EXE`를 알아야 한다.

필수 대응:

- `index.html`의 `/styles.css`, `/app.js`
- `app.js` 내부의 `/assets/...`
- `fetch("/api/...")` 대체 경로
- 본문 내 `/practice-files/...`, `/course-files/...`

권장 방식:

- build 시 `runtime-config.json`에 `basePath`를 넣는다
- 프론트에서 `withBase(path)` helper를 통해 모든 정적 경로를 생성한다

## Frontend Runtime Strategy

### Public Static Mode

정적 배포본은 아래 플래그로 동작한다.

```js
window.__AX_STATIC_CONFIG__ = {
  mode: "static",
  basePath: "/Lets_AX_EXE",
  dataPath: "/Lets_AX_EXE/data"
};
```

static mode에서는:

- `loadChaptersAndDefaultClip()`가 `/api/chapters` 대신 `data/chapters.json`을 읽는다
- `loadClip()`이 `/api/clips/:key` 대신 `data/clips/{key}.json`을 읽는다
- 로그인/과제/메모/admin 편집 UI는 숨긴다

### Authoring Mode

현재 runtime을 유지한다.

- `window.__AX_STATIC_CONFIG__`가 없으면 server mode
- `/api/*`와 server persistence 사용

## Feature Matrix

| feature | authoring server | GitHub Pages static |
| --- | --- | --- |
| chapter browse | yes | yes |
| hash routing | yes | yes |
| slide modal | yes | yes |
| asset preview in content | yes | yes |
| practice file download | yes | yes |
| login/signup | yes | no |
| progress save | yes | no or localStorage later |
| notes save | yes | no or localStorage later |
| AX task save | yes | no |
| root content edit | yes | no |
| asset upload/delete | yes | no |
| admin user list | yes | no |

## Recommended Refactor Boundary

정적화 구현 시에도, 아래를 한 번에 뒤엎지 않는다.

- `content.html` canonical source 구조
- `server.js` authoring/save logic
- root 편집기 메타 재생성 체인

대신 아래만 추가한다.

1. shared content build helper 분리
2. static build script 추가
3. `app.js`에 runtime adapter 추가
4. `index.html`에서 static mode일 때 숨길 UI 제어 추가

즉, 현재 구조를 재사용하는 확장 방식으로 간다.

## Suggested Implementation Order

### Step 1. Shared Builder Extraction

`server.js`에 있는 아래 계열 로직을 build script가 재사용할 수 있게 분리한다.

- catalog build
- visible reference rewrite
- clip payload assembly
- metadata normalization

후보 파일:

- `lib/content-runtime.js`
- `scripts/build-pages.mjs`

### Step 2. Static Output Builder

`npm run build:pages`

역할:

- `docs/` 정리
- visible catalog 생성
- clip JSON 생성
- `public/` 복사
- `course-files/`, `practice-files/` 복사
- `.nojekyll`, `404.html`, `runtime-config.json` 생성

### Step 3. Frontend Static Runtime

`app.js`에 runtime abstraction을 넣는다.

- `isStaticMode()`
- `withBase(path)`
- `fetchChapters()`
- `fetchClip(clipKey)`

### Step 4. Public UI Pruning

static mode에서는 아래를 숨긴다.

- 로그인 뷰
- 메모/과제 서버 저장 UI
- root 편집 버튼
- admin 관련 영역

### Step 5. Verification

검증 기준:

- `http://localhost:4071/#...`와 `docs/index.html#...`가 동일한 visible catalog를 보여야 한다
- CH00~CH08 visible routing이 같아야 한다
- 슬라이드/다운로드 링크가 살아 있어야 한다
- `course-files`와 `practice-files`가 깨지지 않아야 한다
- base path `/Lets_AX_EXE/` 아래에서 정상 동작해야 한다

## Risks

### 1. Absolute Path Leakage

`/assets/...`, `/course-files/...` 절대경로가 남으면 Pages project site에서 깨진다.

### 2. Runtime Drift

정적 builder와 `server.js`가 각각 따로 visible mapping을 구현하면 언젠가 어긋난다.

대응:

- shared helper 재사용

### 3. Feature Expectation Mismatch

공개 Pages에서 로그인/저장이 안 되는 것을 사용자들이 버그로 오해할 수 있다.

대응:

- 공개판은 읽기 전용임을 명시

### 4. Large Repository Size

PDF, PNG, JPG, practice files를 모두 복사하면 `docs/` 용량이 커질 수 있다.

대응:

- build manifest로 실제 참조 자산만 우선 복사
- 이후 필요 시 대용량 practice file은 release asset이나 외부 스토리지 분리 검토

## Publish Flow

### Local Build

```bash
npm run build:pages -- --base-path /Lets_AX_EXE
```

이 명령은 내부적으로 로컬 `server.js`를 임시 포트로 띄운 다음, visible runtime 결과를 정적으로 스냅샷한다.

생성 결과:

- `dist-pages/index.html`
- `dist-pages/404.html`
- `dist-pages/static-config.js`
- `dist-pages/data/chapters.json`
- `dist-pages/data/clips/*.json`
- `dist-pages/assets/**`
- `dist-pages/course-files/**`
- `dist-pages/practice-files/**`

### GitHub Actions Deploy

workflow:

- `.github/workflows/pages.yml`

동작:

1. `main` push 또는 수동 실행
2. Node 20 설치
3. `npm install`
4. `npm run build:pages -- --base-path "/${repoName}"`
5. `dist-pages/`를 Pages artifact로 업로드
6. GitHub Pages에 배포

### GitHub Repository Setting

GitHub 저장소에서 한 번만 아래를 확인하면 된다.

1. `Settings -> Pages`
2. Source를 `GitHub Actions`로 설정
3. `main` 브랜치에 workflow push

## References

- GitHub Pages is a static site hosting service:
  - https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Publishing source options for Pages:
  - https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- `.nojekyll` guidance:
  - https://docs.github.com/articles/using-jekyll-with-pages
