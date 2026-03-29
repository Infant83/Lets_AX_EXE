---
route: "#ch03-clip02"
chapter: "ch03"
title: "문서 기반 AI 리서치: CIQO와 LG 스타일 브리핑"
source_url: "https://lg.cmdspace.work/axcamp#ch03-clip02"
exported_at: "2026-02-28T01:54:00.678Z"
---

~30분
CH 04
실습

# 문서 기반 AI 리서치: CIQO와 LG 스타일 브리핑

실습용 파일이 필요하신가요?
[참고자료 라이브러리 › 실습용 컨텍스트 파일](#ch08-clip04)

이 섹션은 Gemini Deep Research 결과와 외부 보고서를 NotebookLM에 올려 교차 분석하고, 출처가 붙은 응답을 확인한 다음, LG 스타일 슬라이드로 브리핑을 만드는 흐름을 그대로 따라간다. 핵심 메시지는 CIQO, 즉 좋은 컨텍스트가 좋은 결과를 만든다는 점이다.

## 실습 준비 파일

[NotebookLM 리서치 플레이북 실습 순서와 프롬프트 흐름 정리](/assets/practice/ch03/notebooklm-research-playbook.md)
[WEF Future of Jobs 2025 미래 일자리 보고서](/assets/practice/ch03/wef-future-of-jobs-2025.pdf)
[Deloitte Luxury 2023 이전 산업 구조 비교용](/assets/practice/ch03/deloitte-luxury-2023.pdf)
[Deloitte Luxury 2026 최신 산업 동향 비교용](/assets/practice/ch03/deloitte-luxury-2026.pdf)
[LG 로고 브랜드 스타일 힌트용 이미지](/assets/practice/ch03/lg-logo-red.png)

## CIQO로 이해하는 문서 기반 AI 리서치

| 패러다임 | 무엇이 들어가나 | 어떤 결과가 나오나 |
| --- | --- | --- |
|
**GIGO** |
짧고 모호한 질문만 던짐 |
일반적이고 검증하기 어려운 출력 |

|
**CIQO** |
Deep Research 보고서, 산업 보고서, 브랜드 자산, 후속 질문을 함께 제공 |
출처가 있고 맥락이 풍부한 브리핑 초안 |

### 이 섹션에서 강조할 한 문장

NotebookLM의 품질은 프롬프트 한 줄보다도, 어떤 문서를 먼저 넣고 어떤 맥락으로 다시 묻느냐에 더 크게 좌우된다.

## 실제 NotebookLM 교차 분석 화면

![NotebookLM 교차 분석 실제 화면](/assets/notebooklm/ch03-notebooklm/screens/ciqo-cross-analysis.png)

NotebookLM이 여러 소스를 교차 분석해 경영진 관점의 통찰을 정리하는 실제 화면이다. 파란 출처 번호를 눌러 원문 근거를 확인하고, 같은 문맥으로 후속 질문을 이어갈 수 있다.

- Gemini Deep Research 결과가 있으면 첫 소스로 넣고, 여기에 WEF와 Deloitte 보고서를 추가한다.

- NotebookLM에서 교차 분석 질문을 던지고 출처 번호를 눌러 답변 근거를 검증한다.

- 좋은 답이 나오면 그 흐름을 유지한 채 Studio 패널에서 슬라이드로 전환한다.

## 바로 써볼 프롬프트

교차 분석 질문복사

Gemini Deep Research 결과와 함께 업로드된 WEF 2025, Deloitte 2023, Deloitte 2026을 교차 분석해 주세요. 세 소스가 공통적으로 시사하는 변화 신호 3가지를 먼저 정리하고, 각 신호가 LG 경영진 의사결정에 주는 의미를 표로 요약해 주세요. 모든 핵심 주장에는 출처를 붙여 주세요.

LG 스타일 슬라이드 커스터마이징복사

LG 경영진 대상 6~8장 브리핑 슬라이드로 만들어줘. 업로드된 LG 로고를 참고해 흰 배경, 절제된 빨간 포인트, 간결한 데이터 중심 레이아웃을 사용하고, 교차 분석 결과를 바탕으로 CIQO 메시지와 경영진 액션 아이템을 분명하게 보여줘. 마지막 장에는 So What 한 줄과 다음 액션을 넣어줘.

### 생성 후 꼭 확인할 것

Studio가 만든 슬라이드는 초안이다. 숫자 표현이 과장되거나, 메시지가 너무 넓으면 채팅으로 돌아가 근거 문장을 더 좁혀 달라고 다시 요청하는 식으로 품질을 높인다.

NotebookLM Slide Deck

## CIQO 기반 교차 분석 결과를 LG 스타일 7장 브리핑으로 정리한 실제 deck

WEF, Deloitte 2023/2026, NotebookLM 프롬프트, LG 로고를 같은 노트북에 올린 뒤 Studio 패널에서 생성한 실제 슬라이드.

다운로드
