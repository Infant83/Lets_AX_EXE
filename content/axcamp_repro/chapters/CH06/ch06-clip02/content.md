---
route: "#ch06-clip02"
chapter: "ch06"
title: "AI Studio 파라미터 이해"
source_url: "https://lg.cmdspace.work/axcamp#ch06-clip02"
exported_at: "2026-02-28T01:54:10.306Z"
---
CH 06 개념

# AI Studio 파라미터 이해

![AI Studio Build](https://upload.wikimedia.org/wikipedia/commons/c/c5/Google_AI_Studio_icon_%28July_2025%29.svg)

AI Studio Build

자연어로 웹앱을 생성하는 빌더

[aistudio.google.com →](https://aistudio.google.com)

AI Studio의 핵심 파라미터인 Temperature**Temperature**  
AI 답변의 창의성 조절 다이얼이에요. 낮추면(0.2) 정확하고 일관된 답, 높이면(1.5+) 창의적이고 다양한 답이 나옵니다. 업무 보고는 낮게, 아이디어 회의는 높게!와 Top-P의 개념을 이해합니다.

핵심 3가지만 기억하세요

**1\. 모델 선택** — 어떤 AI 엔진을 사용할지 (Gemini**Gemini**  
Google이 만든 AI예요. 텍스트뿐 아니라 이미지, 음성, 영상까지 한꺼번에 이해하고 처리할 수 있습니다. 오늘 실습에서 주로 사용하는 AI예요. 3.1 Pro 등)  
**2\. 시스템 지침** — Gems**Gems**  
Gemini 안에서 만드는 나만의 맞춤형 AI 비서예요. "당신은 경영 전략 컨설턴트입니다" 같은 역할과 규칙을 미리 저장해두면, 매번 지시하지 않아도 그 역할대로 동작해요.에서 배운 것과 같은 개념! AI의 역할과 규칙을 설정합니다  
**3\. Temperature**Temperature**  
AI 답변의 창의성 조절 다이얼이에요. 낮추면(0.2) 정확하고 일관된 답, 높이면(1.5+) 창의적이고 다양한 답이 나옵니다. 업무 보고는 낮게, 아이디어 회의는 높게!** — 낮으면 정확, 높으면 창의적. 업무 보고는 낮게(0.2~0.5), 아이디어는 높게(0.8~1.2)

이 클립에서는

• Temperature**Temperature**  
AI 답변의 창의성 조절 다이얼이에요. 낮추면(0.2) 정확하고 일관된 답, 높이면(1.5+) 창의적이고 다양한 답이 나옵니다. 업무 보고는 낮게, 아이디어 회의는 높게!와 Top-P 파라미터가 AI 응답에 미치는 영향을 이해합니다  
• 파라미터 조절로 창의적 답변 vs 정확한 답변을 제어하는 원리를 배웁니다  
• 업무 상황별 적절한 파라미터 설정 기준을 파악합니다

Temperature**Temperature**  
AI 답변의 창의성 조절 다이얼이에요. 낮추면(0.2) 정확하고 일관된 답, 높이면(1.5+) 창의적이고 다양한 답이 나옵니다. 업무 보고는 낮게, 아이디어 회의는 높게! & Top-P 비교

<table class="comparison-table" style="margin-top:8px"><thead><tr><th>파라미터</th><th>낮은 값</th><th>높은 값</th></tr></thead><tbody><tr><td><strong><span class="glossary-term">Temperature<span class="glossary-tooltip"><strong>Temperature</strong><br>AI 답변의 창의성 조절 다이얼이에요. 낮추면(0.2) 정확하고 일관된 답, 높이면(1.5+) 창의적이고 다양한 답이 나옵니다. 업무 보고는 낮게, 아이디어 회의는 높게!</span></span></strong></td><td>정확하고 일관된 응답 (보고서, 데이터 분석)</td><td>창의적이고 다양한 응답 (브레인스토밍, 카피라이팅)</td></tr><tr><td><strong>Top-P</strong></td><td>확률 상위 소수 단어만 선택 (안정적, 예측 가능)</td><td>더 넓은 범위의 단어를 고려 (다양하고 자연스러운 표현)</td></tr></tbody></table>

파라미터 활용 포인트

같은 질문인데도 Temperature**Temperature**  
AI 답변의 창의성 조절 다이얼이에요. 낮추면(0.2) 정확하고 일관된 답, 높이면(1.5+) 창의적이고 다양한 답이 나옵니다. 업무 보고는 낮게, 아이디어 회의는 높게!에 따라 전혀 다른 스타일의 답변이 나옵니다. **업무 보고용은 Temperature**Temperature**  
AI 답변의 창의성 조절 다이얼이에요. 낮추면(0.2) 정확하고 일관된 답, 높이면(1.5+) 창의적이고 다양한 답이 나옵니다. 업무 보고는 낮게, 아이디어 회의는 높게!를 낮게, 아이디어 발산은 높게** 설정하는 것이 핵심입니다. 이 원리를 이해하면, 이후 Build 실습에서 AI를 더 효과적으로 활용할 수 있습니다.

토큰과 컨텍스트 윈도우

AI가 처리하는 텍스트의 최소 단위를 **토큰**이라 합니다. Gemini**Gemini**  
Google이 만든 AI예요. 텍스트뿐 아니라 이미지, 음성, 영상까지 한꺼번에 이해하고 처리할 수 있습니다. 오늘 실습에서 주로 사용하는 AI예요. 3.1 Pro는 **100만 토큰**까지 처리할 수 있어서, 일반적인 보고서 수백 페이지를 한 번에 분석할 수 있습니다. 이 거대한 컨텍스트 윈도우가 오전에 배운 **컨텍스트 엔지니어링**을 가능하게 하는 기술적 기반입니다.

[← 바이브 코딩이란](#ch06-clip01) [파라미터 직접 체험 →](#ch06-clip03)
