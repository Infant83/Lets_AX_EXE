---
route: "#ch07-clip02"
chapter: "ch07"
title: "에이전틱 AI 도구 소개"
source_url: "https://lg.cmdspace.work/axcamp#ch07-clip02"
exported_at: "2026-02-28T01:54:15.955Z"
---
~10분 CH 07 개념

# 에이전틱 AI 도구 소개

현재 주요 에이전틱 AI 도구 4종의 특징을 비교하고, 오늘 시연에서 사용할 도구를 소개합니다.

4가지 주요 에이전틱 AI 도구

2025~2026년 현재, 주요 AI 기업들이 경쟁적으로 에이전틱 AI 도구를 출시하고 있습니다. 핵심 4종을 비교합니다.

<table class="comparison-table"><thead><tr><th>도구</th><th>개발사</th><th>핵심 특징</th><th>AI 모델</th><th>적합한 사용자</th></tr></thead><tbody><tr><td><strong><span class="glossary-term">Antigravity<span class="glossary-tooltip"><strong>Antigravity</strong><br>AI 에이전트 플랫폼이에요. 에디터·터미널·브라우저를 AI가 동시에 조작하여 코드 작성, 파일 생성, 웹 작업을 한꺼번에 자율적으로 처리합니다.</span></span></strong></td><td>Google</td><td>Agent-First IDE, 3-Surface(Editor+Terminal+Browser), Manager View로 멀티에이전트 오케스트레이션</td><td><span class="glossary-term">Gemini<span class="glossary-tooltip"><strong>Gemini</strong><br>Google이 만든 AI예요. 텍스트뿐 아니라 이미지, 음성, 영상까지 한꺼번에 이해하고 처리할 수 있습니다. 오늘 실습에서 주로 사용하는 AI예요.</span></span> 3.1 Pro</td><td>프론트엔드/풀스택 개발, 에이전트 워크플로우</td></tr><tr><td><strong>Claude Code</strong></td><td>Anthropic</td><td><span class="glossary-term">CLI<span class="glossary-tooltip"><strong>CLI</strong><br>마우스 대신 텍스트 명령어로 컴퓨터를 조작하는 방식이에요. 검은 화면에 글자를 타이핑하는 그것! 개발자 도구의 기본이고, Antigravity도 CLI 기반으로 동작합니다.</span></span> 기반, 코드베이스 전체 컨텍스트, <span class="glossary-term">MCP<span class="glossary-tooltip"><strong>MCP</strong><br>AI에게 도구를 쥐어주는 표준 규격이에요. 이 규격 덕분에 AI가 이메일 전송, 캘린더 확인, 데이터 조회 같은 실제 업무 도구를 직접 사용할 수 있게 됩니다.</span></span> 통합, 프로젝트 단위 자율 작업</td><td>Claude Opus 4</td><td>대규모 코드 리팩토링, 복잡한 코드 분석</td></tr><tr><td><strong>Codex</strong></td><td>OpenAI</td><td>클라우드 샌드박스, 비동기 병렬 작업, GitHub 통합</td><td>GPT-4.1 / o3</td><td>CI/CD 연동, 이슈 기반 자동화</td></tr><tr><td><strong><span class="glossary-term">Gemini<span class="glossary-tooltip"><strong>Gemini</strong><br>Google이 만든 AI예요. 텍스트뿐 아니라 이미지, 음성, 영상까지 한꺼번에 이해하고 처리할 수 있습니다. 오늘 실습에서 주로 사용하는 AI예요.</span></span> <span class="glossary-term">CLI<span class="glossary-tooltip"><strong>CLI</strong><br>마우스 대신 텍스트 명령어로 컴퓨터를 조작하는 방식이에요. 검은 화면에 글자를 타이핑하는 그것! 개발자 도구의 기본이고, Antigravity도 CLI 기반으로 동작합니다.</span></span></strong></td><td>Google</td><td>터미널 네이티브, 100만 토큰 컨텍스트, <span class="glossary-term">MCP<span class="glossary-tooltip"><strong>MCP</strong><br>AI에게 도구를 쥐어주는 표준 규격이에요. 이 규격 덕분에 AI가 이메일 전송, 캘린더 확인, 데이터 조회 같은 실제 업무 도구를 직접 사용할 수 있게 됩니다.</span></span> 지원, Google 생태계 연동</td><td><span class="glossary-term">Gemini<span class="glossary-tooltip"><strong>Gemini</strong><br>Google이 만든 AI예요. 텍스트뿐 아니라 이미지, 음성, 영상까지 한꺼번에 이해하고 처리할 수 있습니다. 오늘 실습에서 주로 사용하는 AI예요.</span></span> 3.1 Pro</td><td>터미널 중심 작업, Google Cloud 연동</td></tr></tbody></table>

MCP**MCP**  
AI에게 도구를 쥐어주는 표준 규격이에요. 이 규격 덕분에 AI가 이메일 전송, 캘린더 확인, 데이터 조회 같은 실제 업무 도구를 직접 사용할 수 있게 됩니다. (Model Context Protocol)

위 도구들이 공통적으로 지원하는 핵심 표준이 있습니다. **MCP**MCP**  
AI에게 도구를 쥐어주는 표준 규격이에요. 이 규격 덕분에 AI가 이메일 전송, 캘린더 확인, 데이터 조회 같은 실제 업무 도구를 직접 사용할 수 있게 됩니다.**는 AI 도구들이 외부 데이터와 서비스에 표준화된 방식으로 연결되는 프로토콜입니다.

AI 도구

Antigravity**Antigravity**  
AI 에이전트 플랫폼이에요. 에디터·터미널·브라우저를 AI가 동시에 조작하여 코드 작성, 파일 생성, 웹 작업을 한꺼번에 자율적으로 처리합니다., Claude Code 등

←

MCP**MCP**  
AI에게 도구를 쥐어주는 표준 규격이에요. 이 규격 덕분에 AI가 이메일 전송, 캘린더 확인, 데이터 조회 같은 실제 업무 도구를 직접 사용할 수 있게 됩니다.

표준 연결 프로토콜

→

외부 서비스

Slack, DB, 파일, 브라우저

USB 포트가 어떤 기기든 연결할 수 있듯, MCP**MCP**  
AI에게 도구를 쥐어주는 표준 규격이에요. 이 규격 덕분에 AI가 이메일 전송, 캘린더 확인, 데이터 조회 같은 실제 업무 도구를 직접 사용할 수 있게 됩니다.는 어떤 AI 도구든 외부 시스템과 연결할 수 있게 합니다. 2024년 11월 출시 후 6개월 만에 다운로드 80배 성장을 기록했습니다.

오늘 시연에서 사용할 도구 — Antigravity**Antigravity**  
AI 에이전트 플랫폼이에요. 에디터·터미널·브라우저를 AI가 동시에 조작하여 코드 작성, 파일 생성, 웹 작업을 한꺼번에 자율적으로 처리합니다.

4가지 도구 중 오늘 시연에서는 **Google Antigravity**Antigravity**  
AI 에이전트 플랫폼이에요. 에디터·터미널·브라우저를 AI가 동시에 조작하여 코드 작성, 파일 생성, 웹 작업을 한꺼번에 자율적으로 처리합니다.**를 사용합니다.

선택 이유

-   시각적 인터페이스로 과정 관찰이 쉬움
-   Manager View에서 멀티에이전트 진행 상황을 실시간 확인 가능
-   파일 생성(HTML, PPT) 결과를 즉시 미리보기 가능
-   에이전트 루프의 Plan-Execute-Check 과정이 화면에 표시됨

핵심 기능

-   **3-Surface:** Editor + Terminal + Browser 동시 조작
-   **Manager View:** 다중 에이전트 실시간 현황판
-   **스킬:** 워크플로우 저장 및 재사용
-   **Gemini**Gemini**  
    Google이 만든 AI예요. 텍스트뿐 아니라 이미지, 음성, 영상까지 한꺼번에 이해하고 처리할 수 있습니다. 오늘 실습에서 주로 사용하는 AI예요. 3.1 Pro:** 최신 AI 모델 탑재

핵심 메시지

**"도구가 달라도 원리는 같습니다."**  
  
Antigravity**Antigravity**  
AI 에이전트 플랫폼이에요. 에디터·터미널·브라우저를 AI가 동시에 조작하여 코드 작성, 파일 생성, 웹 작업을 한꺼번에 자율적으로 처리합니다., Claude Code, Codex, Gemini**Gemini**  
Google이 만든 AI예요. 텍스트뿐 아니라 이미지, 음성, 영상까지 한꺼번에 이해하고 처리할 수 있습니다. 오늘 실습에서 주로 사용하는 AI예요. CLI**CLI**  
마우스 대신 텍스트 명령어로 컴퓨터를 조작하는 방식이에요. 검은 화면에 글자를 타이핑하는 그것! 개발자 도구의 기본이고, Antigravity도 CLI 기반으로 동작합니다. — 도구의 인터페이스는 다르지만, 에이전틱 AI의 핵심 원리는 동일합니다: **목표 설정, 컨텍스트 제공, 결과 검증**. 오늘 시연에서 이 원리를 체험하면, 어떤 도구를 사용하든 적용할 수 있습니다.

[← 에이전틱 AI란](#ch07-clip01) [시연: 3종 보고서 → 대시보드 →](#ch07-clip03)
