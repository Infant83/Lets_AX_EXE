# AX Camp Reproduction Pack

- Source: `https://lg.cmdspace.work/axcamp`
- Exported source snapshot: `2026-02-28T01:54:59.030Z`
- Canonical source catalog: `10 chapters / 44 clips`
- Current runtime catalog: `9 visible chapters / 40 visible clips`

## 핵심 설명

이 폴더는 원본 export를 보존하는 canonical source tree다.

- `chapters/CH02`의 EXAONE 콘텐츠는 폴더상으로 남아 있다.
- 하지만 현재 웹앱 런타임에서는 `CH02` 클립 4개를 제외한다.
- 그 결과 원래 `CH03` 이후의 챕터가 화면에서는 한 칸씩 앞당겨져 보인다.

즉, 이 폴더의 번호와 실제 웹페이지에 보이는 챕터 번호는 일부 다를 수 있다.

## 현재 매핑

| canonical source | title | visible runtime |
| --- | --- | --- |
| `CH00` | 오늘의 여정 | `CH00` |
| `CH01` | AI 핵심 개념 | `CH01` |
| `CH02` | EXAONE | hidden |
| `CH03` | 구조화된 프롬프팅 | `CH02` |
| `CH04` | NotebookLM | `CH03` |
| `CH05` | 환경 설정 | `CH04` |
| `CH06` | Vibe Coding | `CH05` |
| `CH07` | Agentic AI | `CH06` |
| `CH08` | 참고자료 라이브러리 | `CH07` |
| `CH09` | Key Takeaways & Q/A | `CH08` |

## Structure

- `chapters/CHxx/...`: canonical clip-by-clip exports
- `export-report.json`: canonical chapter catalog
- `[공유용] LG AX Camp For Leaders 실습자료/`: source practice files
- `practice_zips/`: bundled practice archives
- `survey/`: linked survey assets

## Per Clip Files

- `content.md`: markdown snapshot
- `content.html`: runtime source body
- `content.txt`: plain text snapshot
- `metadata.json`: links, images, sections, prompts metadata
- `screenshot.png`: exported representative screenshot

## 제외된 수집 산출물

아래는 export/수집 과정의 부가 산출물이며, 현재 서비스 런타임의 핵심 입력은 아니다.

- `external_links/`
- `padlet/`
- `screenshots/`
- `task_check/`
- `links-manifest.json`
- `verification-report.json`
