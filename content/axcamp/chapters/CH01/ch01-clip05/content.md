---
route: "#ch01-clip05"
chapter: "ch01"
title: "프롬프트 구조화 하기"
source_url: "https://lg.cmdspace.work/axcamp#ch01-clip05"
---

# 프롬프트 구조화 하기

좋은 프롬프트는 문장 길이보다 구조가 더 중요합니다. Markdown은 빠르고 읽기 쉬운 섹션을 만들고, XML은 역할·맥락·예시의 경계를 엄격하게 나눠줍니다.

## 왜 중요한가

- AWS, Google, Anthropic 공식 가이드는 모두 명확한 섹션 구분과 일관된 포맷을 권장합니다.
- 구조가 잡히면 모델이 역할, 맥락, 작업, 제약을 덜 혼동합니다.
- 긴 문서, 복수 예시, 에이전트 지시문일수록 효과가 커집니다.

## Markdown

- 헤더와 불릿으로 역할, 요청, 출력 형식, 제약을 빠르게 분리
- Gemini 같은 대화형 실습에서 가장 가볍게 쓰기 좋음
- 사람도 읽기 쉽고 수정도 빠름

## XML

- `<instructions>`, `<context>`, `<example>`, `<input>`처럼 태그로 블록을 분리
- 복잡한 분석, 긴 문서, 멀티파트 지시에 적합
- 특히 Claude 계열 문서에서 강하게 권장되는 구조

## 최근 흐름

실무는 Prompt Engineering에서 끝나지 않고, Context Engineering과 Workflow Design으로 확장되고 있습니다. 좋은 한 문장보다 좋은 구조와 좋은 맥락을 반복 가능하게 만드는 방향입니다.
