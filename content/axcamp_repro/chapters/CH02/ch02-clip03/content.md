---
route: "#ch02-clip03"
chapter: "ch02"
title: "AI 모델 비교"
source_url: "https://lg.cmdspace.work/axcamp#ch02-clip03"
exported_at: "2026-02-28T01:53:49.343Z"
---
CH 02 참고

# AI 모델 비교

주요 AI 모델들의 특징을 비교하여 용도에 맞는 선택을 도와줍니다. (2026년 2월 기준)

이 페이지에서는

EXAONE**EXAONE**  
LG AI Research가 만든 우리 LG의 자체 AI 모델이에요. 사내 서버에 설치할 수 있어서 기밀 데이터도 안전하게 처리할 수 있는 것이 큰 장점입니다., Gemini**Gemini**  
Google이 만든 AI예요. 텍스트뿐 아니라 이미지, 음성, 영상까지 한꺼번에 이해하고 처리할 수 있습니다. 오늘 실습에서 주로 사용하는 AI예요., GPT, Claude 등 주요 AI 모델의 강점을 비교합니다  
보안, 성능, 특화 영역 기준으로 업무 용도별 최적 모델을 파악합니다  
사내 기밀 데이터 처리 시 EXAONE**EXAONE**  
LG AI Research가 만든 우리 LG의 자체 AI 모델이에요. 사내 서버에 설치할 수 있어서 기밀 데이터도 안전하게 처리할 수 있는 것이 큰 장점입니다.을 선택해야 하는 이유를 이해합니다

주요 AI 모델 비교

<table class="comparison-table"><thead><tr><th>모델</th><th>개발사</th><th>최신 버전</th><th>강점</th><th>보안 특징</th></tr></thead><tbody><tr><td><img class="product-logo-inline" src="https://unpkg.com/@lobehub/icons-static-svg@1.79.0/icons/lg.svg" alt="LG"><strong><span class="glossary-term">EXAONE<span class="glossary-tooltip"><strong>EXAONE</strong><br>LG AI Research가 만든 우리 LG의 자체 AI 모델이에요. 사내 서버에 설치할 수 있어서 기밀 데이터도 안전하게 처리할 수 있는 것이 큰 장점입니다.</span></span></strong></td><td>LG AI Research</td><td>K-<span class="glossary-term">EXAONE<span class="glossary-tooltip"><strong>EXAONE</strong><br>LG AI Research가 만든 우리 LG의 자체 AI 모델이에요. 사내 서버에 설치할 수 있어서 기밀 데이터도 안전하게 처리할 수 있는 것이 큰 장점입니다.</span></span> (236B)<br><span class="glossary-term">EXAONE<span class="glossary-tooltip"><strong>EXAONE</strong><br>LG AI Research가 만든 우리 LG의 자체 AI 모델이에요. 사내 서버에 설치할 수 있어서 기밀 데이터도 안전하게 처리할 수 있는 것이 큰 장점입니다.</span></span> 4.0 (32B)</td><td>한국어 특화, <span class="glossary-term">온프레미스<span class="glossary-tooltip"><strong>온프레미스</strong><br>외부 클라우드가 아닌 회사 내부 서버에 직접 설치하는 방식이에요. 데이터가 회사 밖으로 나가지 않아 보안이 확실합니다. EXAONE이 온프레미스 배포를 지원해요.</span></span> 배포, <span class="glossary-term">하이브리드 추론<span class="glossary-tooltip"><strong>하이브리드 추론</strong><br>EXAONE 4.0의 핵심 기술이에요. 간단한 질문에는 빠르게, 복잡한 문제에는 깊이 생각하는 AI를 결합해서, 속도와 정확성을 동시에 잡습니다.</span></span></td><td>내부 서버 운영 가능</td></tr><tr><td><img class="product-logo-inline" src="https://unpkg.com/@lobehub/icons-static-svg@1.79.0/icons/gemini.svg" alt="Gemini"><strong><span class="glossary-term">Gemini<span class="glossary-tooltip"><strong>Gemini</strong><br>Google이 만든 AI예요. 텍스트뿐 아니라 이미지, 음성, 영상까지 한꺼번에 이해하고 처리할 수 있습니다. 오늘 실습에서 주로 사용하는 AI예요.</span></span></strong></td><td>Google</td><td><span class="glossary-term">Gemini<span class="glossary-tooltip"><strong>Gemini</strong><br>Google이 만든 AI예요. 텍스트뿐 아니라 이미지, 음성, 영상까지 한꺼번에 이해하고 처리할 수 있습니다. 오늘 실습에서 주로 사용하는 AI예요.</span></span> 3.1 Pro<br><span class="glossary-term">Gemini<span class="glossary-tooltip"><strong>Gemini</strong><br>Google이 만든 AI예요. 텍스트뿐 아니라 이미지, 음성, 영상까지 한꺼번에 이해하고 처리할 수 있습니다. 오늘 실습에서 주로 사용하는 AI예요.</span></span> 3 Flash</td><td>LMArena 1위, 추론 최강 (ARC-AGI-2: 77.1%), 1M 토큰</td><td>Google Cloud 보안</td></tr><tr><td><img class="product-logo-inline" src="https://unpkg.com/@lobehub/icons-static-svg@1.79.0/icons/openai.svg" alt="OpenAI"><strong>GPT</strong></td><td>OpenAI</td><td>GPT-5.2<br>o3 / o4-mini</td><td>통합 추론 아키텍처, 할루시네이션 6배 감소</td><td>Enterprise <span class="glossary-term">API<span class="glossary-tooltip"><strong>API</strong><br>프로그램끼리 대화하는 통로예요. 마치 레스토랑의 웨이터처럼, 주문(요청)을 주방(서비스)에 전달하고 요리(결과)를 가져다줍니다.</span></span> 제공</td></tr><tr><td><img class="product-logo-inline" src="https://unpkg.com/@lobehub/icons-static-svg@1.79.0/icons/claude.svg" alt="Claude"><strong>Claude</strong></td><td>Anthropic</td><td>Opus 4.6<br>Sonnet 4.6</td><td>코딩 최강 (SWE-bench 80.8%), 1M 토큰 컨텍스트</td><td>헌법적 AI 원칙 적용</td></tr></tbody></table>

어떤 모델을 선택해야 하나?

**기밀 데이터** 분석이 필요하면 → EXAONE**EXAONE**  
LG AI Research가 만든 우리 LG의 자체 AI 모델이에요. 사내 서버에 설치할 수 있어서 기밀 데이터도 안전하게 처리할 수 있는 것이 큰 장점입니다. (온프레미스**온프레미스**  
외부 클라우드가 아닌 회사 내부 서버에 직접 설치하는 방식이에요. 데이터가 회사 밖으로 나가지 않아 보안이 확실합니다. EXAONE이 온프레미스 배포를 지원해요.). **범용 업무**와 Google 연동 → Gemini**Gemini**  
Google이 만든 AI예요. 텍스트뿐 아니라 이미지, 음성, 영상까지 한꺼번에 이해하고 처리할 수 있습니다. 오늘 실습에서 주로 사용하는 AI예요.. **코딩/에이전트** → Claude 또는 GPT. 실무에서는 용도에 따라 여러 모델을 병행 사용하는 것이 일반적입니다. 2026년 현재 주요 모델 간 성능 격차가 크게 좁혀져, **어떤 모델을 쓰느냐보다 어떤 프롬프트를 쓰느냐**가 더 중요합니다.

[← EXAONE 실습](#ch02-clip02) [실습 시트 →](#ch02-clip04)
