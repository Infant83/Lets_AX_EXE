---
route: "#ch04-clip01"
chapter: "ch04"
title: "NotebookLMNotebookLMGoogle이 만든 AI 리서치 도구예요. 내가 올린 문서만 기반으로 분석하고 답변하기 때문에 할루시네이션이 매우 적어요. 모든 답변에 출처가 표시됩니다. 가이드"
source_url: "https://lg.cmdspace.work/axcamp#ch04-clip01"
exported_at: "2026-02-28T01:53:59.545Z"
---
CH 04 플랫폼

# NotebookLM**NotebookLM**  
Google이 만든 AI 리서치 도구예요. 내가 올린 문서만 기반으로 분석하고 답변하기 때문에 할루시네이션이 매우 적어요. 모든 답변에 출처가 표시됩니다. 가이드

![NotebookLM](https://upload.wikimedia.org/wikipedia/commons/5/57/NotebookLM_logo.svg)

Google NotebookLM**NotebookLM**  
Google이 만든 AI 리서치 도구예요. 내가 올린 문서만 기반으로 분석하고 답변하기 때문에 할루시네이션이 매우 적어요. 모든 답변에 출처가 표시됩니다.

문서 기반 AI 연구 도우미 — 컨텍스트 엔지니어링 플랫폼

[notebooklm.google.com →](https://notebooklm.google.com)

Google NotebookLM**NotebookLM**  
Google이 만든 AI 리서치 도구예요. 내가 올린 문서만 기반으로 분석하고 답변하기 때문에 할루시네이션이 매우 적어요. 모든 답변에 출처가 표시됩니다.의 최신 기능과 활용법을 소개합니다. 컨텍스트 엔지니어링의 대표적인 실습 플랫폼입니다.

이 실습에서는

NotebookLM**NotebookLM**  
Google이 만든 AI 리서치 도구예요. 내가 올린 문서만 기반으로 분석하고 답변하기 때문에 할루시네이션이 매우 적어요. 모든 답변에 출처가 표시됩니다.의 핵심 개념(문서 기반 AI, 출처 인용, 멀티 소스)을 이해합니다  
Studio 패널의 다양한 출력 기능(Audio, Video, Mind Map, Slide, Data Tables, Reports)을 알아봅니다  
Gemini**Gemini**  
Google이 만든 AI예요. 텍스트뿐 아니라 이미지, 음성, 영상까지 한꺼번에 이해하고 처리할 수 있습니다. 오늘 실습에서 주로 사용하는 AI예요.(범용)와 NotebookLM**NotebookLM**  
Google이 만든 AI 리서치 도구예요. 내가 올린 문서만 기반으로 분석하고 답변하기 때문에 할루시네이션이 매우 적어요. 모든 답변에 출처가 표시됩니다.(전용)의 차이와 활용 시나리오를 구분합니다

NotebookLM**NotebookLM**  
Google이 만든 AI 리서치 도구예요. 내가 올린 문서만 기반으로 분석하고 답변하기 때문에 할루시네이션이 매우 적어요. 모든 답변에 출처가 표시됩니다.이란?

-   **문서 기반 AI 연구 도우미:** 업로드한 문서만을 근거로 답변하는 RAG**RAG**  
    AI가 답변하기 전에 관련 자료를 먼저 찾아보는 기술이에요. 마치 시험 볼 때 오픈북처럼, 외부 데이터를 검색해서 더 정확하고 최신 정보로 답변합니다. 기반 서비스
-   **출처 인용:** 모든 답변에 원본 문서의 출처 번호가 표시 — 클릭하면 해당 부분으로 이동
-   **할루시네이션 최소화:** 학습 데이터가 아닌, 내가 제공한 자료만으로 답변하므로 신뢰성이 높음
-   **멀티 소스:** PDF, Google Docs, 웹 URL 등 최대 50개 소스 동시 분석 (이미지, 그래프 포함 PDF도 인식)

Studio 패널 — 다양한 출력 기능

![NotebookLM Studio Panel](https://storage.googleapis.com/gweb-uniblog-publish-prod/images/NotebookLM_SS.width-1300.png)

<table class="comparison-table"><thead><tr><th>기능</th><th>설명</th><th>활용 시나리오</th></tr></thead><tbody><tr><td><strong><span class="glossary-term">Audio Overview<span class="glossary-tooltip"><strong>Audio Overview</strong><br>NotebookLM의 인기 기능이에요. 업로드한 문서를 두 명의 AI 진행자가 팟캐스트처럼 대화로 설명해줍니다. 읽기 어려운 긴 보고서도 들으면서 이해할 수 있어요.</span></span></strong></td><td>두 명의 AI 진행자가 문서를 팟캐스트 형태로 대화</td><td>이동 중 보고서 파악, "듣는 보고서"</td></tr><tr><td><strong>Video Overview</strong></td><td>AI가 내레이션 + 슬라이드 영상을 자동 생성</td><td>팀 공유용 요약 영상, 교육 자료</td></tr><tr><td><strong>Mind Map</strong></td><td>문서 내 개념 간 관계를 시각적 마인드맵으로 표현</td><td>복잡한 주제 구조 파악, 전략 맵핑</td></tr><tr><td><strong>Slide Deck</strong></td><td>문서 내용을 프레젠테이션 슬라이드로 자동 변환</td><td>보고서 → 발표자료 즉시 생성</td></tr><tr><td><strong>Data Tables</strong></td><td>소스 데이터를 구조화된 표로 변환, Google Sheets 내보내기 가능</td><td>데이터 비교·정리, 스프레드시트 연동 (2025.12 추가)</td></tr><tr><td><strong>Reports</strong></td><td>브리핑 문서, 스터디 가이드, FAQ, 타임라인 등 목적별 보고서 자동 생성</td><td>회의 자료, 교육 가이드, 요약 문서 즉시 생성</td></tr></tbody></table>

Studio 패널에서 Audio Overview**Audio Overview**  
NotebookLM의 인기 기능이에요. 업로드한 문서를 두 명의 AI 진행자가 팟캐스트처럼 대화로 설명해줍니다. 읽기 어려운 긴 보고서도 들으면서 이해할 수 있어요.를 들으면서 동시에 Mind Map을 탐색할 수 있습니다.

Studio vs Chat — 두 가지 사용 방식

<table class="comparison-table"><thead><tr><th style="width:20%">구분</th><th>Studio (스튜디오)</th><th>Chat (채팅)</th></tr></thead><tbody><tr><td><strong>성격</strong></td><td><strong>구조화된 산출물(Curated Output)</strong> — AI가 소스를 분석하여 정리된 결과물을 생성</td><td><strong>실시간 대화(Live Conversation)</strong> — 실시간 질의응답으로 원하는 정보를 탐색</td></tr><tr><td><strong>결과물</strong></td><td><span class="glossary-term">Audio Overview<span class="glossary-tooltip"><strong>Audio Overview</strong><br>NotebookLM의 인기 기능이에요. 업로드한 문서를 두 명의 AI 진행자가 팟캐스트처럼 대화로 설명해줍니다. 읽기 어려운 긴 보고서도 들으면서 이해할 수 있어요.</span></span>, 슬라이드, 마인드맵, 보고서, 데이터 표 등</td><td>텍스트 답변 + 출처 각주 (클릭하면 원문 확인)</td></tr><tr><td><strong>용도</strong></td><td>정리된 산출물이 필요할 때 (공유, 프레젠테이션, 요약)</td><td>자료를 깊이 탐색하거나 특정 질문에 답을 찾을 때</td></tr></tbody></table>

접속 및 시작

-   웹: [notebooklm.google.com](https://notebooklm.google.com) 접속

![NotebookLM 홈 화면](https://i.imghippo.com/files/BkF6788yU.png)

NotebookLM**NotebookLM**  
Google이 만든 AI 리서치 도구예요. 내가 올린 문서만 기반으로 분석하고 답변하기 때문에 할루시네이션이 매우 적어요. 모든 답변에 출처가 표시됩니다. 홈 — 기존 노트북 목록이 표시됩니다. 우측 상단의 '+ 새로 만들기'를 클릭하여 새 노트북을 생성합니다

![NotebookLM 소스 추가 화면](https://i.imghippo.com/files/CcOD6218RM.png)

소스 추가 화면 — 파일 업로드, 웹사이트 URL, Google Drive, 복사된 텍스트 중 원하는 방식으로 소스를 추가합니다

-   "새 노트북" 클릭 → 소스 추가 (PDF, Docs, URL 등)
-   **패스트 리서치(Fast Research**Fast Research**  
    NotebookLM이 30~45초 만에 관련 웹 자료를 자동으로 찾아서 추가하는 기능이에요. 직접 검색할 필요 없이 AI가 좋은 참고자료를 골라줍니다.):** AI가 주제에 맞는 웹 소스를 자동으로 찾아서 노트북에 추가
-   소스 업로드 후 바로 질문 시작 가능

Fast Research**Fast Research**  
NotebookLM이 30~45초 만에 관련 웹 자료를 자동으로 찾아서 추가하는 기능이에요. 직접 검색할 필요 없이 AI가 좋은 참고자료를 골라줍니다. vs Deep Research**Deep Research**  
AI가 알아서 여러 자료를 찾아보고 종합 보고서를 써주는 기능이에요. 사람이 리서치하면 몇 시간 걸릴 작업을 AI가 2~5분 만에 해냅니다. Gemini와 NotebookLM에서 사용할 수 있어요.

NotebookLM**NotebookLM**  
Google이 만든 AI 리서치 도구예요. 내가 올린 문서만 기반으로 분석하고 답변하기 때문에 할루시네이션이 매우 적어요. 모든 답변에 출처가 표시됩니다.은 **Fast Research**Fast Research**  
NotebookLM이 30~45초 만에 관련 웹 자료를 자동으로 찾아서 추가하는 기능이에요. 직접 검색할 필요 없이 AI가 좋은 참고자료를 골라줍니다.**(30~45초, 빠른 소스 수집)와 **Deep Research**Deep Research**  
AI가 알아서 여러 자료를 찾아보고 종합 보고서를 써주는 기능이에요. 사람이 리서치하면 몇 시간 걸릴 작업을 AI가 2~5분 만에 해냅니다. Gemini와 NotebookLM에서 사용할 수 있어요.**(3~5분, 최대 50개 소스 심층 분석) 두 가지 리서치 모드를 제공합니다. 빠른 개요가 필요하면 Fast Research**Fast Research**  
NotebookLM이 30~45초 만에 관련 웹 자료를 자동으로 찾아서 추가하는 기능이에요. 직접 검색할 필요 없이 AI가 좋은 참고자료를 골라줍니다.를, 보다 깊이 있는 조사가 필요하면 Deep Research**Deep Research**  
AI가 알아서 여러 자료를 찾아보고 종합 보고서를 써주는 기능이에요. 사람이 리서치하면 몇 시간 걸릴 작업을 AI가 2~5분 만에 해냅니다. Gemini와 NotebookLM에서 사용할 수 있어요.를 활용하세요.

Gemini**Gemini**  
Google이 만든 AI예요. 텍스트뿐 아니라 이미지, 음성, 영상까지 한꺼번에 이해하고 처리할 수 있습니다. 오늘 실습에서 주로 사용하는 AI예요. vs NotebookLM**NotebookLM**  
Google이 만든 AI 리서치 도구예요. 내가 올린 문서만 기반으로 분석하고 답변하기 때문에 할루시네이션이 매우 적어요. 모든 답변에 출처가 표시됩니다.

**Gemini**Gemini**  
Google이 만든 AI예요. 텍스트뿐 아니라 이미지, 음성, 영상까지 한꺼번에 이해하고 처리할 수 있습니다. 오늘 실습에서 주로 사용하는 AI예요.**는 AI가 학습한 전체 지식을 활용하여 답변합니다 (범용). **NotebookLM**NotebookLM**  
Google이 만든 AI 리서치 도구예요. 내가 올린 문서만 기반으로 분석하고 답변하기 때문에 할루시네이션이 매우 적어요. 모든 답변에 출처가 표시됩니다.**은 내가 업로드한 문서만을 근거로 답변합니다 (전용). 신뢰성이 중요한 의사결정 지원에는 NotebookLM**NotebookLM**  
Google이 만든 AI 리서치 도구예요. 내가 올린 문서만 기반으로 분석하고 답변하기 때문에 할루시네이션이 매우 적어요. 모든 답변에 출처가 표시됩니다.이 더 적합합니다.

NotebookLM**NotebookLM**  
Google이 만든 AI 리서치 도구예요. 내가 올린 문서만 기반으로 분석하고 답변하기 때문에 할루시네이션이 매우 적어요. 모든 답변에 출처가 표시됩니다. Plus & Enterprise

Google Workspace Business/Enterprise 고객에게는 **NotebookLM**NotebookLM**  
Google이 만든 AI 리서치 도구예요. 내가 올린 문서만 기반으로 분석하고 답변하기 때문에 할루시네이션이 매우 적어요. 모든 답변에 출처가 표시됩니다. Plus**가 핵심 서비스로 포함됩니다. 5배 더 많은 Audio/Video Overview, 팀 공유 노트북, 응답 스타일/길이 커스터마이징, 사용 분석 등 기업급 기능을 제공합니다.

컨텍스트 엔지니어링이란?

NotebookLM**NotebookLM**  
Google이 만든 AI 리서치 도구예요. 내가 올린 문서만 기반으로 분석하고 답변하기 때문에 할루시네이션이 매우 적어요. 모든 답변에 출처가 표시됩니다.의 핵심 가치는 **컨텍스트 엔지니어링**에 있습니다.

<table class="comparison-table"><thead><tr><th>패러다임</th><th>GIGO</th><th><span class="glossary-term">CIQO<span class="glossary-tooltip"><strong>CIQO</strong><br>Context In, Quality Out의 약자예요. "좋은 맥락을 넣으면 좋은 결과가 나온다"는 뜻으로, 기존의 GIGO(쓰레기 입력 = 쓰레기 출력)에서 진화한 AI 시대의 원칙입니다.</span></span></th></tr></thead><tbody><tr><td><strong>의미</strong></td><td>Garbage In, Garbage Out</td><td>Context In, Quality Out</td></tr><tr><td><strong>핵심</strong></td><td>잘못된 입력 → 잘못된 출력</td><td>풍부한 맥락 → 고품질 출력</td></tr><tr><td><strong>방법</strong></td><td>프롬프트만으로 질문</td><td>문서·데이터를 AI에 제공한 후 질문</td></tr><tr><td><strong><span class="glossary-term">NotebookLM<span class="glossary-tooltip"><strong>NotebookLM</strong><br>Google이 만든 AI 리서치 도구예요. 내가 올린 문서만 기반으로 분석하고 답변하기 때문에 할루시네이션이 매우 적어요. 모든 답변에 출처가 표시됩니다.</span></span> 역할</strong></td><td>—</td><td>소스(문서) 업로드 → 노트(분석) → 소스화(재활용)</td></tr></tbody></table>

Note-to-Source 변환

NotebookLM**NotebookLM**  
Google이 만든 AI 리서치 도구예요. 내가 올린 문서만 기반으로 분석하고 답변하기 때문에 할루시네이션이 매우 적어요. 모든 답변에 출처가 표시됩니다.에서 AI가 분석한 노트를 다시 소스로 변환하면, AI가 자기 분석을 기반으로 더 깊은 인사이트를 생성합니다. 이것이 **CIQO**CIQO**  
Context In, Quality Out의 약자예요. "좋은 맥락을 넣으면 좋은 결과가 나온다"는 뜻으로, 기존의 GIGO(쓰레기 입력 = 쓰레기 출력)에서 진화한 AI 시대의 원칙입니다.(Context In, Quality Out)**의 핵심 기법입니다.

[← 실습 시트](#ch03-clip07) [문서 기반 AI 리서치 →](#ch04-clip02)
