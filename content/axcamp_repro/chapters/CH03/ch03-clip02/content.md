---
route: "#ch03-clip02"
chapter: "ch03"
title: "프롬프팅 기초"
source_url: "https://lg.cmdspace.work/axcamp#ch03-clip02"
exported_at: "2026-02-28T01:53:52.740Z"
---
~10분 CH 03 개념

# 프롬프팅 기초

AI에게 효과적으로 지시하는 핵심 프레임워크와 프롬프트 작성 기법을 배웁니다.

AI에게 효과적으로 지시하는 7가지 요소 (Delegation Canvas)

좋은 프롬프트의 본질은 **"AI에게 업무를 위임하는 지시서"**를 잘 작성하는 것입니다.

<table class="comparison-table"><thead><tr><th>#</th><th>요소</th><th>프롬프트 예시</th><th>CEO 예시</th></tr></thead><tbody><tr><td>1</td><td><strong>Role (역할)</strong></td><td>"당신은 어떤 역할인가?"</td><td>전략 참모 / 재무 분석가 / 보고서 작성자</td></tr><tr><td>2</td><td><strong>Goal (목표)</strong></td><td>"무엇을 해달라는 것인가?"</td><td>분석 / 비교 / 요약 / 작성 / 번역</td></tr><tr><td>3</td><td><strong>Context (맥락)</strong></td><td>"배경 상황은 무엇인가?"</td><td>LG그룹 계열사 사업 맥락 / 이사회 안건 / 경쟁사 대응</td></tr><tr><td>4</td><td><strong>Constraints (제약)</strong></td><td>"반드시 지켜야 할 조건은?"</td><td>기밀 제외 / 2페이지 이내 / 격식체</td></tr><tr><td>5</td><td><strong>Output (형식)</strong></td><td>"어떤 형태로 제시할 것인가?"</td><td>표 + 매트릭스 / 1페이지 요약 / 옵션 3개</td></tr><tr><td>6</td><td><strong>Evaluation (평가)</strong></td><td>"좋은 결과의 기준은 무엇인가?"</td><td>ROI 포함 / 리스크 분석 / 경쟁사 비교</td></tr><tr><td>7</td><td><strong>Questions (선제 질문)</strong></td><td>"더 나은 결과를 위해 먼저 물어볼 것"</td><td>예산 범위? 우선순위? 타겟 시장?</td></tr></tbody></table>

CEO 실전 팁

7가지를 모두 포함할 필요는 없습니다. 처음엔 **Role + Goal + Output** 3개만 넣어도 답변 품질이 눈에 띄게 향상됩니다. 익숙해지면 Context와 Constraints를 추가하세요.

프롬프트 엔지니어링 4원칙

Delegation Canvas를 실전에 적용할 때, 특히 중요한 4가지 원칙입니다.

<table class="comparison-table"><thead><tr><th>원칙</th><th>설명</th><th>CEO 활용 예시</th></tr></thead><tbody><tr><td><strong>Format (형식)</strong></td><td>출력 형태를 구체적으로 지정하면 AI가 즉시 활용 가능한 결과를 생성합니다</td><td>"표 형태로", "A4 1장 분량으로", "불릿 포인트로"</td></tr><tr><td><strong>Role (역할)</strong></td><td>AI에게 전문가 역할을 부여하면 관점과 깊이가 달라집니다</td><td>"전략 참모로서", "재무 분석가로서", "비서관으로서"</td></tr><tr><td><strong>Context (맥락)</strong></td><td>파일 첨부로 풍부한 배경 정보를 제공하면 정확도가 크게 향상됩니다</td><td>회의록 첨부, 보고서 첨부, 전략 문서 첨부</td></tr><tr><td><strong>Step (단계)</strong></td><td>하나의 긴 프롬프트보다, 대화를 이어가며 단계적으로 깊이를 더합니다</td><td>요약 → 이슈 추출 → 전략 제안 → 시나리오 분석</td></tr></tbody></table>

4원칙 적용 순서

**Format → Role → Context → Step** 순서로 프롬프트를 구성하면 자연스럽게 좋은 결과를 얻을 수 있습니다. 처음엔 Format과 Role만 적용해도 답변 품질이 크게 달라집니다.

컨텍스트 엔지니어링 연결

프롬프트 엔지니어링 4원칙은 **컨텍스트 엔지니어링의 실천 도구**입니다. 역할·맥락·형식·단계적 사고를 통해 AI에게 더 풍부한 컨텍스트를 제공하는 것이 곧 더 좋은 결과로 이어집니다.

Before & After: 프롬프트의 힘

Before (비효율적)

AI 트렌드 알려줘

After (효과적)

당신은 글로벌 전략 컨설팅 펌의 시니어 파트너입니다. 산업: 가전, 화학, 배터리, 통신, IT서비스 등 분석 관점: CEO 의사결정 지원용 2025~2026년 AI 산업의 주요 트렌드 Top 5를 다음 형식으로 정리해 주세요: - 각 트렌드별: 트렌드명 / 현황 / 우리 사업에 미치는 영향 / 대응 시급도(상/중/하) - 표 형태로 정리 - CEO가 이사회에서 언급할 수 있는 수준의 인사이트 포함

[← Gemini 플랫폼 가이드](#ch03-clip01) [비즈니스 프롬프트 연습 →](#ch03-clip03)
