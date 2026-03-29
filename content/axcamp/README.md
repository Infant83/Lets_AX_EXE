# AXCAMP Content Pack

- Source: `https://lg.cmdspace.work/axcamp`
- Active course content: `8 visible chapters / 21 clips`
- Content root: `content/axcamp`

## 핵심 설명

이 폴더는 현재 AX Camp for Leaders 수업에 실제로 쓰는 콘텐츠만 남긴 정리본이다.

- `chapters/` 아래에는 현재 수업에 쓰는 `CH00`~`CH07` 폴더만 있다.
- 예전 과정에서 사용하던 숨김 챕터, 수집 산출물, 실험용 폴더는 제외했다.
- 대신 기존 링크 rewrite와 root 편집기 저장 호환을 위해 `export-report.json`과 각 `chapter.json`에는 일부 canonical route id를 유지한다.

즉, 물리 폴더는 현재 수업 기준으로 단순화했고, route 호환성은 메타 파일에서 유지하는 구조다.

## Structure

- `chapters/CHxx/...`: 현재 수업용 클립 폴더
- `export-report.json`: canonical route 호환을 포함한 카탈로그
- `visible-catalog-overrides.json`: 화면 노출용 제목/시간/유형 오버라이드
- `[공유용] LG AX Camp For Leaders 실습자료/`: 원본 실습 자료
- `practice_zips/`: 배포용 실습 압축본
- `survey/`: 설문 링크 자산

## Per Clip Files

- `content.md`: markdown snapshot
- `content.html`: runtime source body
- `content.txt`: plain text snapshot
- `metadata.json`: 링크, 이미지, 섹션, 프롬프트 메타데이터
- `assets/`: root 편집기에서 업로드한 클립 전용 자산
- `screenshot.png`: 대표 스크린샷

## 챕터 메타 파일

각 `chapters/CHxx/` 폴더에는 `chapter.json`이 있다.

- root의 `사이드바 수정`은 이 파일과 `export-report.json`, `visible-catalog-overrides.json`, 개별 `metadata.json`을 함께 갱신한다.
- 이 구조 덕분에 `npm start`와 `npm run build:pages -- --base-path /Lets_AX_EXE` 모두 같은 내용을 사용한다.

## 현재 물리 챕터

- `CH00` 오늘의 여정
- `CH01` AI 핵심 개념
- `CH02` Gemini & ChatGPT
- `CH03` NotebookLM
- `CH04` Google AI Studio & Vibe Coding
- `CH05` Hi-D Code
- `CH06` Key Takeaways & Q/A
- `CH07` 참고자료 라이브러리
