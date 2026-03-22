const STORAGE_SESSION_KEY = "ax_literacy_session_token";
const STORAGE_LAST_ID_KEY = "ax_literacy_last_lets_id";
const STORAGE_COURSE_CODE_KEY = "ax_literacy_course_code";

const state = {
  accountId: "",
  sessionToken: "",
  isAdmin: false,
  user: null,
  chapters: [],
  clipMap: new Map(),
  completedSet: new Set(),
  currentClipKey: "",
  currentChapterId: "",
  currentChapterNum: "",
  currentChapterTitle: "",
  expandedChapters: new Set(),
  activeSlideDeck: null,
  activeSlideIndex: 0,
  taskPanelOpen: false,
  notePanelOpen: false,
  courses: [],
  currentCourse: null,
  mermaidReady: false
};

const el = {
  loginView: document.getElementById("loginView"),
  appView: document.getElementById("appView"),
  layout: document.getElementById("appLayout"),
  showLoginModeBtn: document.getElementById("showLoginModeBtn"),
  showSignupModeBtn: document.getElementById("showSignupModeBtn"),
  loginForm: document.getElementById("loginForm"),
  loginCourseCode: document.getElementById("loginCourseCode"),
  loginAccountId: document.getElementById("loginAccountId"),
  loginPassword: document.getElementById("loginPassword"),
  loginError: document.getElementById("loginError"),
  signupForm: document.getElementById("signupForm"),
  signupCourseCode: document.getElementById("signupCourseCode"),
  signupAccountId: document.getElementById("signupAccountId"),
  signupPassword: document.getElementById("signupPassword"),
  signupTeamName: document.getElementById("signupTeamName"),
  signupDisplayName: document.getElementById("signupDisplayName"),
  signupError: document.getElementById("signupError"),
  courseCodeList: document.getElementById("courseCodeList"),
  showPasswordHelpBtn: document.getElementById("showPasswordHelpBtn"),
  passwordHelpPanel: document.getElementById("passwordHelpPanel"),
  closePasswordHelpBtn: document.getElementById("closePasswordHelpBtn"),
  helpAccountId: document.getElementById("helpAccountId"),
  passwordHintBtn: document.getElementById("passwordHintBtn"),
  passwordHintResult: document.getElementById("passwordHintResult"),
  helpTeamName: document.getElementById("helpTeamName"),
  passwordRecoverBtn: document.getElementById("passwordRecoverBtn"),
  passwordRecoverResult: document.getElementById("passwordRecoverResult"),
  currentUser: document.getElementById("currentUser"),
  currentCourseBadge: document.getElementById("currentCourseBadge"),
  accountSettingsBtn: document.getElementById("accountSettingsBtn"),
  accountModal: document.getElementById("accountModal"),
  closeAccountModalBtn: document.getElementById("closeAccountModalBtn"),
  accountForm: document.getElementById("accountForm"),
  accountEditId: document.getElementById("accountEditId"),
  accountEditTeamName: document.getElementById("accountEditTeamName"),
  accountEditDisplayName: document.getElementById("accountEditDisplayName"),
  accountCurrentPassword: document.getElementById("accountCurrentPassword"),
  accountNewPassword: document.getElementById("accountNewPassword"),
  accountStatus: document.getElementById("accountStatus"),
  slideDeckModal: document.getElementById("slideDeckModal"),
  slideDeckKicker: document.getElementById("slideDeckKicker"),
  slideDeckTitle: document.getElementById("slideDeckTitle"),
  slideDeckCounter: document.getElementById("slideDeckCounter"),
  downloadSlideDeckBtn: document.getElementById("downloadSlideDeckBtn"),
  slideDeckStage: document.getElementById("slideDeckStage"),
  slideDeckDots: document.getElementById("slideDeckDots"),
  closeSlideDeckBtn: document.getElementById("closeSlideDeckBtn"),
  slidePrevBtn: document.getElementById("slidePrevBtn"),
  slideNextBtn: document.getElementById("slideNextBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
  chapterList: document.getElementById("chapterList"),
  clipTitle: document.getElementById("clipTitle"),
  clipOverview: document.getElementById("clipOverview"),
  clipBadges: document.getElementById("clipBadges"),
  clipBody: document.getElementById("clipBody"),
  markCompleteBtn: document.getElementById("markCompleteBtn"),
  progressBadge: document.getElementById("progressBadge"),
  toggleTaskBtn: document.getElementById("toggleTaskBtn"),
  toggleNoteBtn: document.getElementById("toggleNoteBtn"),
  taskPanel: document.getElementById("taskPanel"),
  taskForm: document.getElementById("taskForm"),
  taskChapterContext: document.getElementById("taskChapterContext"),
  taskTitle: document.getElementById("taskTitle"),
  taskReason: document.getElementById("taskReason"),
  taskEffect: document.getElementById("taskEffect"),
  taskStatus: document.getElementById("taskStatus"),
  notePanel: document.getElementById("notePanel"),
  noteClipContext: document.getElementById("noteClipContext"),
  noteText: document.getElementById("noteText"),
  notePreview: document.getElementById("notePreview"),
  saveNoteBtn: document.getElementById("saveNoteBtn"),
  copyNoteBtn: document.getElementById("copyNoteBtn"),
  noteStatus: document.getElementById("noteStatus"),
  adminSection: document.getElementById("adminSection"),
  refreshUsersBtn: document.getElementById("refreshUsersBtn"),
  adminUsersTbody: document.getElementById("adminUsersTbody"),
  adminStatus: document.getElementById("adminStatus")
};

const PROMPT_PREVIEW_MAX_LINES = 30;
const COPY_FEEDBACK_MS = 1200;
let copyToastTimer = null;

function normalizeWs(input) {
  return String(input || "").replace(/\s+/g, " ").trim();
}

function normalizeCourseCode(input) {
  return String(input || "")
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

function normalizeClipKey(input) {
  const key = normalizeWs(input).replace(/^#/, "");
  if (!key) return "";
  return key;
}

function showLogin() {
  el.loginView.classList.remove("hidden");
  el.appView.classList.add("hidden");
}

function showApp() {
  el.loginView.classList.add("hidden");
  el.appView.classList.remove("hidden");
}

async function api(path, options = {}) {
  const headers = {
    ...(options.headers || {})
  };

  if (state.sessionToken) {
    headers["x-session-token"] = state.sessionToken;
  }

  if (state.accountId) {
    headers["x-account-id"] = state.accountId;
  }

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(path, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const msg = data.error || `요청 실패 (${response.status})`;
    throw new Error(msg);
  }

  return data;
}

function setLoginError(message) {
  el.loginError.textContent = message || "";
}

function setSignupError(message) {
  el.signupError.textContent = message || "";
}

function setTaskStatus(message, isError = false) {
  el.taskStatus.textContent = message || "";
  el.taskStatus.style.color = isError ? "#b42318" : "";
}

function setNoteStatus(message, isError = false) {
  el.noteStatus.textContent = message || "";
  el.noteStatus.style.color = isError ? "#b42318" : "";
}

function setAdminStatus(message, isError = false) {
  el.adminStatus.textContent = message || "";
  el.adminStatus.style.color = isError ? "#b42318" : "";
}

function setAccountStatus(message, isError = false) {
  el.accountStatus.textContent = message || "";
  el.accountStatus.style.color = isError ? "#b42318" : "#138246";
}

function openAccountModal() {
  if (!state.user) return;
  el.accountEditId.value = state.user.accountId || "";
  el.accountEditTeamName.value = state.user.teamName || "";
  el.accountEditDisplayName.value = state.user.displayName || "";
  el.accountCurrentPassword.value = "";
  el.accountNewPassword.value = "";
  setAccountStatus("");
  el.accountModal.classList.remove("hidden");
}

function closeAccountModal() {
  el.accountModal.classList.add("hidden");
  setAccountStatus("");
}

function showLoginMode() {
  el.loginForm.classList.remove("hidden");
  el.signupForm.classList.add("hidden");
  el.passwordHelpPanel.classList.add("hidden");
  el.showLoginModeBtn.classList.add("active");
  el.showSignupModeBtn.classList.remove("active");
  setLoginError("");
  setSignupError("");
}

function showSignupMode() {
  el.signupForm.classList.remove("hidden");
  el.loginForm.classList.add("hidden");
  el.passwordHelpPanel.classList.add("hidden");
  el.showSignupModeBtn.classList.add("active");
  el.showLoginModeBtn.classList.remove("active");
  setLoginError("");
  setSignupError("");
}

function showPasswordHelpMode() {
  el.passwordHelpPanel.classList.remove("hidden");
  el.loginForm.classList.add("hidden");
  el.signupForm.classList.add("hidden");
  el.showLoginModeBtn.classList.remove("active");
  el.showSignupModeBtn.classList.remove("active");
  el.passwordHintResult.textContent = "";
  el.passwordRecoverResult.textContent = "";
}

function updateSidePanelUI() {
  const open = state.taskPanelOpen || state.notePanelOpen;
  el.layout.classList.toggle("with-task-panel", open);
  el.layout.classList.toggle("no-task-panel", !open);

  el.taskPanel.classList.toggle("collapsed", !state.taskPanelOpen);
  el.notePanel.classList.toggle("collapsed", !state.notePanelOpen);

  el.toggleTaskBtn.textContent = state.taskPanelOpen ? "AX 과제 닫기" : "AX 과제 펼치기";
  el.toggleNoteBtn.textContent = state.notePanelOpen ? "메모 닫기" : "메모 펼치기";
}

function getAllClips() {
  return state.chapters.flatMap((chapter) => chapter.clips);
}

function updateProgressBadge() {
  const all = getAllClips();
  const total = all.length;
  const done = all.filter((clip) => state.completedSet.has(clip.clipKey)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  el.progressBadge.textContent = `진도 ${pct}% (${done}/${total})`;
}

function updateMarkCompleteButton() {
  const done = state.completedSet.has(state.currentClipKey);
  el.markCompleteBtn.textContent = done ? "완료 해제" : "학습 완료";
  el.markCompleteBtn.style.background = done ? "#138246" : "";
  el.markCompleteBtn.style.borderColor = done ? "#138246" : "";
}

function clipTypeLabel(clip, chapter) {
  const base = normalizeWs(clip.type);
  const text = `${normalizeWs(clip.title)} ${normalizeWs(chapter.title)}`;
  if (/설정|setup/i.test(text)) return "설정";
  if (base === "개념") return "개념";
  if (base === "실습") return "실습";
  if (base === "플랫폼") return "플랫폼";
  if (base === "개요") return "개요";
  if (base === "참고") return "참고";
  return base || "기타";
}

function clipTypeClass(label) {
  const normalized = normalizeWs(label);
  if (normalized === "개념") return "cat-concept";
  if (normalized === "실습") return "cat-practice";
  if (normalized === "플랫폼") return "cat-platform";
  if (normalized === "설정") return "cat-setup";
  if (normalized === "개요") return "cat-overview";
  if (normalized === "참고") return "cat-reference";
  return "cat-default";
}

function compactPart(part) {
  let text = normalizeWs(part);
  text = text.replace(/(AI Assistant)\s*\1/gi, "$1");
  text = text.replace(/(Agentic AI)\s*\1/gi, "$1");
  text = text.replace(/(EXAONE)\s*\1/gi, "$1");
  text = text.replace(/["'“”].*$/, "");
  text = text.split(/[.!?]/)[0];

  const englishPrefix = text.match(/^[A-Za-z0-9&+\- ]{2,40}/);
  if (englishPrefix && englishPrefix[0].trim()) {
    text = englishPrefix[0].trim();
  }

  text = normalizeWs(text);
  if (!text) return "";

  const words = text.split(/\s+/);
  if (words.length > 5) {
    text = words.slice(0, 5).join(" ");
  }

  if (text.length > 24) {
    text = `${text.slice(0, 23)}…`;
  }
  return text;
}

function shortClipTitle(input) {
  let text = normalizeWs(input);
  if (!text) return "섹션";

  if (text.includes("→")) {
    const parts = text.split("→").map(compactPart).filter(Boolean);
    if (parts.length >= 2) {
      const merged = parts.join(" → ");
      if (merged.length <= 46) return merged;
    }
  }

  if (text.length > 30) {
    return `${text.slice(0, 29)}…`;
  }
  return text;
}

function escapeHtml(input) {
  return String(input || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const INDUSTRY_LANDSCAPE_SOURCE_MAP = {
  meta: {
    label: "Digiday · 2025.01",
    url: "https://digiday.com/media/meta-enters-ai-licensing-fray-striking-deals-with-people-inc-usa-today-co-and-more/"
  },
  base44: {
    label: "TechCrunch · 2025.06",
    url: "https://techcrunch.com/2025/06/18/6-month-old-solo-owned-vibe-coder-base44-sells-to-wix-for-80m-cash/"
  },
  gartner: {
    label: "Gartner · 2025.08",
    url: "https://www.gartner.com/en/newsroom/press-releases/2025-08-26-gartner-predicts-40-percent-of-enterprise-apps-will-feature-task-specific-ai-agents-by-2026-up-from-less-than-5-percent-in-2025"
  },
  vibeCoding: {
    label: "TechCrunch · 2025.03",
    url: "https://techcrunch.com/2025/03/06/a-quarter-of-startups-in-ycs-current-cohort-have-codebases-that-are-almost-entirely-ai-generated/"
  },
  menlo: {
    label: "Menlo Ventures · 2025.10",
    url: "https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/"
  },
  euAct: {
    label: "EU Commission · 2025.08",
    url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai"
  },
  exaone: {
    label: "Korea Herald · 2025.11",
    url: "https://www.koreaherald.com/article/10652980"
  },
  gemini: {
    label: "Google · 2026.02",
    url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/"
  },
  mckinsey: {
    label: "McKinsey · 2025.03",
    url: "https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier"
  },
  healthcare: {
    label: "Healthcare Dive · 2025.12",
    url: "https://www.healthcaredive.com/news/digital-health-funding-2025-boosted-ai-rock-health/809449/"
  },
  lgB2B: {
    label: "Digital Commerce 360 · 2026.01",
    url: "https://www.digitalcommerce360.com/2026/01/08/lg-electronics-b2b-ai-growth-2026/"
  },
  cli: {
    label: "Builder.io · 2026.01",
    url: "https://www.builder.io/blog/cursor-vs-claude-code"
  },
  openai: {
    label: "OpenAI · 2025.09",
    url: "https://openai.com/index/the-state-of-enterprise-ai-2025-report/"
  }
};

const SLIDE_DECK_BUILDERS = {
  "industry-landscape": buildIndustryLandscapeDeck,
  "assistant-agentic-spectrum": buildAssistantAgenticSpectrumDeck,
  "prompt-context-workflow": buildPromptContextWorkflowDeck,
  "tech-utilization-roadmap": buildTechUtilizationRoadmapDeck,
  "concept-foundation-guide": buildConceptFoundationGuideDeck,
  "gemini-access-roadshow": buildGeminiAccessRoadshowDeck,
  "business-prompting-workshop": buildBusinessPromptingWorkshopDeck,
  "gemini-gems-roadshow": buildGeminiGemsRoadshowDeck,
  "ciqo-executive-briefing": buildCiqoExecutiveBriefingDeck,
  "enterprise-research-workflow": buildEnterpriseResearchWorkflowDeck
};

function collectIndustryLandscapeStats() {
  const cards = Array.from(el.clipBody.querySelectorAll(".news-card"));
  const counts = cards.reduce(
    (acc, card) => {
      const category = normalizeWs(card.dataset.cat || "");
      if (category === "business" || category === "technology" || category === "policy") {
        acc[category] += 1;
      }
      return acc;
    },
    { business: 0, technology: 0, policy: 0 }
  );

  return {
    total: cards.length,
    counts
  };
}

function buildIndustryLandscapeDeck() {
  const basePath = "/assets/notebooklm/industry-briefing";

  return {
    id: "industry-landscape",
    kicker: "NotebookLM PDF",
    title: "2026 LG AX Strategic Briefing",
    subtitle: "NotebookLM에서 생성한 슬라이드 PDF 다운로드본",
    downloadUrl: "/assets/notebooklm/2026-lg-ax-strategic-briefing.pdf",
    downloadFilename: "2026-lg-ax-strategic-briefing.pdf",
    downloadLabel: "다운로드",
    slides: [
      {
        eyebrow: "00 / Cover",
        title: "2026 엔터프라이즈 AI 산업동향 및 LG AX 전략 브리핑",
        imageSrc: `${basePath}/slide-1.jpg`,
        imageAlt: "NotebookLM 슬라이드 표지"
      },
      {
        eyebrow: "01 / Executive Thesis",
        title: "Executive Thesis",
        imageSrc: `${basePath}/slide-2.jpg`,
        imageAlt: "Executive Thesis 슬라이드"
      },
      {
        eyebrow: "02 / ROI Gap",
        title: "ROI Gap",
        imageSrc: `${basePath}/slide-3.jpg`,
        imageAlt: "ROI Gap 슬라이드"
      },
      {
        eyebrow: "03 / Business Reset",
        title: "Business Reset",
        imageSrc: `${basePath}/slide-4.jpg`,
        imageAlt: "Business Reset 슬라이드"
      },
      {
        eyebrow: "04 / Agent/Vibe Coding Shift",
        title: "Agent/Vibe Coding Shift",
        imageSrc: `${basePath}/slide-5.jpg`,
        imageAlt: "Agent and Vibe Coding Shift 슬라이드"
      },
      {
        eyebrow: "05 / Model Race",
        title: "Model Race",
        imageSrc: `${basePath}/slide-6.jpg`,
        imageAlt: "Model Race 슬라이드"
      },
      {
        eyebrow: "06 / Governance & AI Literacy",
        title: "Governance & AI Literacy",
        imageSrc: `${basePath}/slide-7.jpg`,
        imageAlt: "Governance and AI Literacy 슬라이드"
      },
      {
        eyebrow: "07 / Next 90 Days",
        title: "Next 90 Days",
        imageSrc: `${basePath}/slide-8.jpg`,
        imageAlt: "Next 90 Days 슬라이드"
      }
    ]
  };
}

function buildAssistantAgenticSpectrumDeck() {
  const imagePath = "/assets/notebooklm/assistant-agentic/ai-utilization-evolution-roadmap.png";

  return {
    id: "assistant-agentic-spectrum",
    previewStyle: "immersive",
    kicker: "NotebookLM Infographic",
    title: "AI 활용의 진화 로드맵",
    subtitle: "현재 페이지와 공식 자료 8건을 바탕으로 만든 1장 concept map",
    downloadUrl: imagePath,
    downloadFilename: "ai-utilization-evolution-roadmap.png",
    downloadLabel: "다운로드",
    slides: [
      {
        eyebrow: "01 / Infographic",
        title: "AI 활용의 진화 로드맵",
        imageSrc: imagePath,
        imageAlt: "AI가 비서형에서 대리인형을 거쳐 자율 협업형으로 진화하는 세 단계를 비교한 인포그래픽 로드맵"
      }
    ]
  };
}

function buildPromptContextWorkflowDeck() {
  const imagePath = "/assets/notebooklm/prompt-context/prompt-context-workflow-strategy.png";

  return {
    id: "prompt-context-workflow",
    previewStyle: "immersive",
    kicker: "NotebookLM Infographic",
    title: "프롬프트 엔지니어링에서 컨텍스트 엔지니어링으로",
    subtitle: "현재 페이지와 공식 자료 6건을 바탕으로 만든 1장 concept map",
    downloadUrl: imagePath,
    downloadFilename: "prompt-context-workflow-strategy.png",
    downloadLabel: "다운로드",
    slides: [
      {
        eyebrow: "01 / Infographic",
        title: "AI 성과를 결정짓는 3단계 진화 전략",
        imageSrc: imagePath,
        imageAlt: "프롬프트 엔지니어링에서 컨텍스트 기반 워크플로우로 진화하는 AI 성과 창출 전략의 3단계를 설명하는 인포그래픽"
      }
    ]
  };
}

function buildTechUtilizationRoadmapDeck() {
  const basePath = "/assets/notebooklm/tech-roadmap";

  return {
    id: "tech-utilization-roadmap",
    kicker: "NotebookLM Slide Deck",
    title: "Enterprise AI Roadmap",
    subtitle: "NotebookLM Studio에서 내려받은 실제 3장 슬라이드",
    downloadUrl: `${basePath}/enterprise-ai-roadmap-2.pdf`,
    downloadFilename: "enterprise-ai-roadmap-2.pdf",
    downloadLabel: "다운로드",
    slides: [
      {
        eyebrow: "01 / Chat UI",
        title: "질문-리서치-초안-수정의 협업 루프",
        imageSrc: `${basePath}/slide-1.png`,
        imageAlt: "Enterprise AI Roadmap 슬라이드 1장. Chat UI 단계에서 질문, 리서치, 초안 작성, 수정 요청을 반복하는 흐름을 설명한다."
      },
      {
        eyebrow: "02 / API / Build",
        title: "AI가 개발을 돕고 앱이 다시 AI를 호출하는 구조",
        imageSrc: `${basePath}/slide-2.png`,
        imageAlt: "Enterprise AI Roadmap 슬라이드 2장. AI Studio Build와 API를 활용해 앱을 만들고 서비스가 다시 AI를 호출하는 구조를 설명한다."
      },
      {
        eyebrow: "03 / CLI / Agent",
        title: "Codex와 Cline으로 시연하는 에이전틱 워크플로우",
        imageSrc: `${basePath}/slide-3.png`,
        imageAlt: "Enterprise AI Roadmap 슬라이드 3장. Codex와 Cline을 통해 계획, 도구 호출, 실행, 검증을 잇는 CLI Agent 단계를 설명한다."
      }
    ]
  };
}

function buildConceptFoundationGuideDeck() {
  const imagePath = "/assets/notebooklm/concept-foundation/expert-ai-core-concepts-guide2.png";

  return {
    id: "concept-foundation-guide",
    previewStyle: "immersive",
    kicker: "NotebookLM Infographic",
    title: "전문가용 AI 핵심 개념 가이드",
    subtitle: "NotebookLM에서 내려받은 세로형 개념 인포그래픽",
    downloadUrl: imagePath,
    downloadFilename: "expert-ai-core-concepts-guide2.png",
    downloadLabel: "다운로드",
    slides: [
      {
        eyebrow: "01 / Infographic",
        title: "오늘 수업을 관통하는 AI 핵심 용어 지도",
        imageSrc: imagePath,
        imageAlt: "전문가용 AI 핵심 개념 가이드 세로 인포그래픽. 멀티모달, 컨텍스트 엔지니어링, RAG, MCP, Agentic AI 등 핵심 개념을 한 장으로 정리한다."
      }
    ]
  };
}

function buildGeminiAccessRoadshowDeck() {
  const basePath = "/assets/notebooklm/ch02-structured-prompting/gemini-business-engine";

  return {
    id: "gemini-access-roadshow",
    kicker: "NotebookLM Slide Deck",
    title: "Gemini Business Engine",
    subtitle: "Gemini를 단순 채팅이 아니라 멀티모달 비즈니스 엔진으로 쓰는 흐름",
    downloadUrl: `${basePath}/Gemini-Business-Engine.pdf`,
    downloadFilename: "Gemini-Business-Engine.pdf",
    downloadLabel: "다운로드",
    slides: [
      {
        eyebrow: "01 / Orientation",
        title: "Gemini 실습 오리엔테이션",
        imageSrc: `${basePath}/slide-01.png`,
        imageAlt: "단순한 챗봇을 넘어선 멀티모달 비즈니스 분석 엔진을 주제로 한 LG 임원진 대상 Gemini 실습 오리엔테이션 슬라이드입니다."
      },
      {
        eyebrow: "02 / Multimodal",
        title: "텍스트·이미지·PDF·음성을 한 대화창에서",
        imageSrc: `${basePath}/slide-02.png`,
        imageAlt: "텍스트, 이미지, PDF, 음성 등 다양한 데이터를 하나의 대화창에서 처리하여 업무 혁신을 이루는 Gemini의 멀티모달 기능을 설명합니다."
      },
      {
        eyebrow: "03 / Executive Use",
        title: "임원 의사결정을 돕는 세 가지 핵심 요소",
        imageSrc: `${basePath}/slide-03.png`,
        imageAlt: "임원진의 의사결정을 돕는 세 가지 핵심 요소로 직관적 접근, 실무적 확장, 연속적 심화를 제시합니다."
      },
      {
        eyebrow: "04 / Onboarding",
        title: "접속부터 후속 질문까지 6단계 시작법",
        imageSrc: `${basePath}/slide-04.png`,
        imageAlt: "gemini.google.com 접속부터 후속 질문까지 Gemini 사용을 시작하는 6단계 과정을 설명하는 타임라인입니다."
      },
      {
        eyebrow: "05 / Interface",
        title: "표 구조화, 요약, 초안 작성까지 한 화면에서",
        imageSrc: `${basePath}/slide-05.png`,
        imageAlt: "표 구조화, 핵심 요약, 초안 작성 등 모든 분석 작업이 하나의 직관적인 인터페이스에서 가능함을 보여줍니다."
      }
    ]
  };
}

function buildBusinessPromptingWorkshopDeck() {
  const imagePath =
    "/assets/notebooklm/ch02-structured-prompting/business-prompting-workshop-infographic.png";

  return {
    id: "business-prompting-workshop",
    previewStyle: "immersive",
    kicker: "NotebookLM Infographic",
    title: "비즈니스 프롬프트 업무 위임 가이드",
    subtitle: "비즈니스 프롬프트 4종과 회의 분석 흐름을 한 장에 압축한 실습용 인포그래픽",
    downloadUrl: imagePath,
    downloadFilename: "business-prompting-workshop-infographic.png",
    downloadLabel: "다운로드",
    slides: [
      {
        eyebrow: "01 / Infographic",
        title: "비즈니스 프롬프트를 실무 업무로 바꾸는 구조",
        imageSrc: imagePath,
        imageAlt: "비즈니스 프롬프트의 세 가지 활용 사례와 데이터 기반 워크플로우 및 작성 원칙을 요약한 인포그래픽입니다."
      }
    ]
  };
}

function buildGeminiGemsRoadshowDeck() {
  const basePath = "/assets/notebooklm/ch02-structured-prompting/gemini-business-engine";

  return {
    id: "gemini-gems-roadshow",
    kicker: "NotebookLM Slide Deck",
    title: "Gemini 확장 기능: Deep Research와 Gems",
    subtitle: "멀티턴 분석에서 맞춤형 AI 비서 만들기로 넘어가는 후반부 슬라이드",
    downloadUrl: `${basePath}/Gemini-Business-Engine.pdf`,
    downloadFilename: "Gemini-Business-Engine.pdf",
    downloadLabel: "다운로드",
    slides: [
      {
        eyebrow: "09 / Extensions",
        title: "Deep Research와 Gems로 역할 확장",
        imageSrc: `${basePath}/slide-09.png`,
        imageAlt: "광범위한 리서치를 돕는 Deep Research와 맞춤형 AI 파트너인 Gems 기능을 소개합니다."
      },
      {
        eyebrow: "10 / Blueprint",
        title: "질문에서 문서 분석, Gems 활용까지의 청사진",
        imageSrc: `${basePath}/slide-10.png`,
        imageAlt: "질문 입력에서 시작해 문서 분석과 멀티턴 대화를 거쳐 맞춤형 비서 활용까지 이어지는 실습 전체 과정의 청사진입니다."
      },
      {
        eyebrow: "11 / Start",
        title: "직접 구조화된 프롬프팅을 시작하는 단계",
        imageSrc: `${basePath}/slide-11.png`,
        imageAlt: "구조화된 프롬프팅을 통해 직접 비즈니스 분석을 시작하도록 독려하는 실습 시작 안내 슬라이드입니다."
      }
    ]
  };
}

function buildCiqoExecutiveBriefingDeck() {
  const basePath = "/assets/notebooklm/ch03-notebooklm/ciqo-lg-executive-briefing";

  return {
    id: "ciqo-executive-briefing",
    kicker: "NotebookLM Slide Deck",
    title: "Global Talent and Luxury Strategy",
    subtitle: "CIQO 기반 교차 분석을 LG 스타일로 재구성한 7장 브리핑",
    downloadUrl: "/assets/notebooklm/ch03-notebooklm/ciqo-lg-executive-briefing.pdf",
    downloadFilename: "ciqo-lg-executive-briefing.pdf",
    downloadLabel: "다운로드",
    slides: [
      {
        eyebrow: "01 / Cover",
        title: "경영진 브리핑의 시작점",
        imageSrc: `${basePath}/slide-1.png`,
        imageAlt: "LG 스타일 경영진 브리핑 표지 슬라이드"
      },
      {
        eyebrow: "02 / Context",
        title: "노동과 소비 지형을 동시에 읽는 문제 정의",
        imageSrc: `${basePath}/slide-2.png`,
        imageAlt: "업로드한 보고서들의 문제 정의와 핵심 배경을 설명하는 슬라이드"
      },
      {
        eyebrow: "03 / Signals",
        title: "WEF와 Deloitte가 교차로 보여주는 변화 신호",
        imageSrc: `${basePath}/slide-3.png`,
        imageAlt: "WEF와 Deloitte 소스의 핵심 신호를 교차 분석한 슬라이드"
      },
      {
        eyebrow: "04 / CIQO",
        title: "좋은 컨텍스트가 브리핑 품질을 끌어올리는 구조",
        imageSrc: `${basePath}/slide-4.png`,
        imageAlt: "CIQO 관점에서 문서 기반 리서치 품질을 설명하는 슬라이드"
      },
      {
        eyebrow: "05 / LG Lens",
        title: "LG 관점에서 다시 읽은 시사점",
        imageSrc: `${basePath}/slide-5.png`,
        imageAlt: "LG 경영진 관점으로 재해석한 전략 시사점 슬라이드"
      },
      {
        eyebrow: "06 / Action",
        title: "경영진 액션 아이템",
        imageSrc: `${basePath}/slide-6.png`,
        imageAlt: "다음 실행 항목과 우선순위를 요약한 슬라이드"
      },
      {
        eyebrow: "07 / So What",
        title: "So What과 다음 액션",
        imageSrc: `${basePath}/slide-7.png`,
        imageAlt: "최종 요약과 다음 액션을 정리한 마무리 슬라이드"
      }
    ]
  };
}

function buildEnterpriseResearchWorkflowDeck() {
  const imagePath = "/assets/notebooklm/ch03-notebooklm/enterprise-research-workflow.png";

  return {
    id: "enterprise-research-workflow",
    previewStyle: "immersive",
    kicker: "NotebookLM Infographic",
    title: "AI 기반 기업 분석 워크플로",
    subtitle: "Gems에서 NotebookLM과 슬라이드 산출물까지 잇는 실습 흐름도",
    downloadUrl: imagePath,
    downloadFilename: "enterprise-research-workflow.png",
    downloadLabel: "다운로드",
    slides: [
      {
        eyebrow: "01 / Workflow",
        title: "기업 분석 코스를 한 장에 정리한 인포그래픽",
        imageSrc: imagePath,
        imageAlt:
          "Gems로 자료 수집 기준을 만들고 NotebookLM으로 다중 소스를 분석한 뒤 슬라이드와 인포그래픽을 만드는 기업 분석 실습 워크플로 인포그래픽"
      }
    ]
  };
}

function populateSlideDeckDownloadLinks() {
  el.clipBody.querySelectorAll("[data-slide-deck-download]").forEach((anchor) => {
    const deckId = normalizeWs(anchor.dataset.slideDeckDownload || "");
    const deck = getSlideDeck(deckId);
    if (!deck || !deck.downloadUrl) {
      anchor.classList.add("hidden");
      anchor.removeAttribute("href");
      anchor.removeAttribute("download");
      anchor.removeAttribute("aria-label");
      return;
    }

    anchor.classList.remove("hidden");
    anchor.href = deck.downloadUrl;
    anchor.textContent = anchor.dataset.downloadLabel || deck.downloadLabel || "다운로드";
    anchor.setAttribute("aria-label", `${deck.title || "슬라이드"} 다운로드`);
    if (deck.downloadFilename) {
      anchor.setAttribute("download", deck.downloadFilename);
    } else {
      anchor.setAttribute("download", "");
    }
  });
}

function getSlideDeck(deckId) {
  const builder = SLIDE_DECK_BUILDERS[normalizeWs(deckId)];
  if (!builder) return null;
  const deck = builder();
  if (!deck || !Array.isArray(deck.slides) || !deck.slides.length) return null;
  return deck;
}

function renderSlideSources(sources) {
  return sources
    .map((source) => {
      const label = escapeHtml(source.label || "출처");
      const href = escapeHtml(source.url || "#");
      return `<a class="slide-source-link" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    })
    .join("");
}

function renderSlideDeckPreviews() {
  el.clipBody.querySelectorAll("[data-slide-deck-preview]").forEach((container) => {
    const deckId = normalizeWs(container.dataset.slideDeckPreview || "");
    const deck = getSlideDeck(deckId);
    if (!deck) {
      container.classList.remove("single-slide");
      container.classList.remove("immersive-preview");
      container.innerHTML = "";
      return;
    }

    const isSingleSlide = deck.slides.length === 1;
    const isImmersivePreview = isSingleSlide && deck.previewStyle === "immersive";

    container.classList.toggle("single-slide", isSingleSlide);
    container.classList.toggle("immersive-preview", isImmersivePreview);

    container.innerHTML = deck.slides
      .map((slide, index) => {
        if (isImmersivePreview) {
          return `
            <button
              type="button"
              class="slide-preview-card slide-preview-card-wide slide-preview-card-immersive"
              data-slide-deck-card="${escapeHtml(deckId)}"
              data-slide-index="${index}"
              aria-label="${escapeHtml(slide.title || `슬라이드 ${index + 1}`)} 크게 보기"
            >
              <span class="slide-preview-page">${index + 1}</span>
              <div class="slide-preview-image-frame">
                <img
                  class="slide-preview-image"
                  src="${escapeHtml(slide.imageSrc || "")}"
                  alt="${escapeHtml(slide.imageAlt || slide.title || `슬라이드 ${index + 1}`)}"
                  loading="lazy"
                />
              </div>
              <span class="slide-preview-floating-cta">클릭해서 확대</span>
            </button>
          `;
        }

        return `
          <button
            type="button"
            class="slide-preview-card${isSingleSlide ? " slide-preview-card-wide" : ""}"
            data-slide-deck-card="${escapeHtml(deckId)}"
            data-slide-index="${index}"
            aria-label="${escapeHtml(slide.title || `슬라이드 ${index + 1}`)} 크게 보기"
          >
            <span class="slide-preview-page">${index + 1}</span>
            <div class="slide-preview-image-frame">
              <img
                class="slide-preview-image"
                src="${escapeHtml(slide.imageSrc || "")}"
                alt="${escapeHtml(slide.imageAlt || slide.title || `슬라이드 ${index + 1}`)}"
                loading="lazy"
              />
            </div>
            <div class="slide-preview-meta">
              <span class="slide-preview-eyebrow">${escapeHtml(slide.eyebrow || `Slide ${index + 1}`)}</span>
              <strong class="slide-preview-title">${escapeHtml(slide.title || "")}</strong>
              <span class="slide-preview-cta">클릭해서 확대</span>
            </div>
          </button>
        `;
      })
      .join("");
  });
}

function renderSlideDeckDots(deck) {
  if (!el.slideDeckDots) return;
  el.slideDeckDots.innerHTML = "";
  deck.slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slides-dot";
    dot.textContent = `${index + 1}`;
    dot.setAttribute("aria-label", `${slide.title} 슬라이드로 이동`);
    if (index === state.activeSlideIndex) {
      dot.classList.add("active");
    }
    dot.addEventListener("click", () => {
      state.activeSlideIndex = index;
      renderActiveSlideDeck();
    });
    el.slideDeckDots.appendChild(dot);
  });
}

function renderActiveSlideDeck() {
  const deck = state.activeSlideDeck;
  if (!deck) return;

  const slides = deck.slides;
  const currentIndex = Math.max(0, Math.min(state.activeSlideIndex, slides.length - 1));
  state.activeSlideIndex = currentIndex;
  const slide = slides[currentIndex];

  el.slideDeckKicker.textContent = deck.kicker || "슬라이드";
  el.slideDeckTitle.textContent = deck.title || "슬라이드";
  el.slideDeckCounter.textContent = `${currentIndex + 1} / ${slides.length}`;
  if (el.downloadSlideDeckBtn) {
    if (deck.downloadUrl) {
      el.downloadSlideDeckBtn.classList.remove("hidden");
      el.downloadSlideDeckBtn.href = deck.downloadUrl;
      el.downloadSlideDeckBtn.textContent = deck.downloadLabel || "다운로드";
      el.downloadSlideDeckBtn.setAttribute("aria-label", `${deck.title || "슬라이드"} 다운로드`);
      if (deck.downloadFilename) {
        el.downloadSlideDeckBtn.setAttribute("download", deck.downloadFilename);
      } else {
        el.downloadSlideDeckBtn.setAttribute("download", "");
      }
    } else {
      el.downloadSlideDeckBtn.classList.add("hidden");
      el.downloadSlideDeckBtn.removeAttribute("href");
      el.downloadSlideDeckBtn.removeAttribute("download");
      el.downloadSlideDeckBtn.removeAttribute("aria-label");
    }
  }
  el.slidePrevBtn.disabled = currentIndex === 0;
  el.slideNextBtn.disabled = currentIndex === slides.length - 1;
  if (slide.imageSrc) {
    el.slideDeckStage.innerHTML = `
      <article class="slide-image-sheet">
        <button
          type="button"
          class="slide-hitbox prev${currentIndex === 0 ? " disabled" : ""}"
          aria-label="이전 슬라이드"
          ${currentIndex === 0 ? "disabled" : ""}
        ></button>
        <button
          type="button"
          class="slide-hitbox next${currentIndex === slides.length - 1 ? " disabled" : ""}"
          aria-label="다음 슬라이드"
          ${currentIndex === slides.length - 1 ? "disabled" : ""}
        ></button>
        <div class="slide-image-meta">
          <span class="slide-kicker">${escapeHtml(slide.eyebrow || `Slide ${currentIndex + 1}`)}</span>
          <span class="slide-source-summary">${escapeHtml(deck.subtitle || "")}</span>
        </div>
        <div class="slide-image-wrap">
          <img
            class="slide-stage-image"
            src="${escapeHtml(slide.imageSrc)}"
            alt="${escapeHtml(slide.imageAlt || slide.title || `슬라이드 ${currentIndex + 1}`)}"
          />
        </div>
        <div class="slide-sheet-foot">
          <span>${escapeHtml(slide.title || "")}</span>
          <span>좌우 가장자리 클릭 또는 하단 버튼으로 이동</span>
        </div>
      </article>
    `;
  } else {
    el.slideDeckStage.innerHTML = `
      <article
        class="slide-sheet"
        style="--slide-accent:${slide.accent || "#245fca"};--slide-accent-soft:${slide.accentSoft || "rgba(58, 126, 242, 0.22)"}"
      >
        <button
          type="button"
          class="slide-hitbox prev${currentIndex === 0 ? " disabled" : ""}"
          aria-label="이전 슬라이드"
          ${currentIndex === 0 ? "disabled" : ""}
        ></button>
        <button
          type="button"
          class="slide-hitbox next${currentIndex === slides.length - 1 ? " disabled" : ""}"
          aria-label="다음 슬라이드"
          ${currentIndex === slides.length - 1 ? "disabled" : ""}
        ></button>
        <div class="slide-sheet-top">
          <span class="slide-kicker">${escapeHtml(slide.eyebrow || `Slide ${currentIndex + 1}`)}</span>
          <span class="slide-source-summary">${escapeHtml(deck.subtitle || "")}</span>
        </div>
        <div class="slide-sheet-grid">
          <section class="slide-main-panel">
            <h4 class="slide-headline">${escapeHtml(slide.title || "")}</h4>
            <p class="slide-summary">${escapeHtml(slide.summary || "")}</p>
            <ul class="slide-bullet-list">
              ${(slide.bullets || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </section>
          <aside class="slide-side-panel">
            <div class="slide-side-block">
              <div class="slide-side-title">핵심 시그널</div>
              <div class="slide-signal-list">
                ${(slide.signals || []).map((item) => `<span class="slide-signal-chip">${escapeHtml(item)}</span>`).join("")}
              </div>
            </div>
            <div class="slide-side-block">
              <div class="slide-side-title">출처</div>
              <div class="slide-source-list">${renderSlideSources(slide.sources || [])}</div>
            </div>
          </aside>
        </div>
        <div class="slide-sheet-foot">
          <span>좌측 가장자리 클릭: 이전</span>
          <span>우측 가장자리 클릭: 다음</span>
        </div>
      </article>
    `;
  }

  el.slideDeckStage.querySelector(".slide-hitbox.prev")?.addEventListener("click", () => {
    if (state.activeSlideIndex <= 0) return;
    state.activeSlideIndex -= 1;
    renderActiveSlideDeck();
  });

  el.slideDeckStage.querySelector(".slide-hitbox.next")?.addEventListener("click", () => {
    if (state.activeSlideIndex >= slides.length - 1) return;
    state.activeSlideIndex += 1;
    renderActiveSlideDeck();
  });

  renderSlideDeckDots(deck);
}

function openSlideDeck(deckId, initialIndex = 0) {
  const deck = getSlideDeck(deckId);
  if (!deck) {
    showCopyToast("슬라이드 데이터를 찾지 못했습니다", true);
    return;
  }

  state.activeSlideDeck = deck;
  state.activeSlideIndex = Math.max(0, Math.min(Number(initialIndex) || 0, deck.slides.length - 1));
  document.body.classList.add("modal-open");
  el.slideDeckModal.classList.remove("hidden");
  el.slideDeckModal.setAttribute("aria-hidden", "false");
  renderActiveSlideDeck();
}

function closeSlideDeck() {
  state.activeSlideDeck = null;
  state.activeSlideIndex = 0;
  document.body.classList.remove("modal-open");
  el.slideDeckModal.classList.add("hidden");
  el.slideDeckModal.setAttribute("aria-hidden", "true");
  if (el.downloadSlideDeckBtn) {
    el.downloadSlideDeckBtn.classList.add("hidden");
    el.downloadSlideDeckBtn.removeAttribute("href");
    el.downloadSlideDeckBtn.removeAttribute("download");
    el.downloadSlideDeckBtn.removeAttribute("aria-label");
  }
  el.slideDeckStage.innerHTML = "";
  el.slideDeckDots.innerHTML = "";
}

function renderInlineMarkdown(text) {
  let html = escapeHtml(text);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/⟦([^⟧]+)⟧/g, '<span class="prompt-fill">[$1]</span>');
  return html;
}

function normalizePromptFillLabel(input) {
  let label = normalizeWs(input || "");
  if (label.startsWith("[") && label.endsWith("]")) {
    label = normalizeWs(label.slice(1, -1));
  }
  return label;
}

function extractPromptMarkdownVariants(sourceElement) {
  if (!sourceElement) {
    return { rawMarkdown: "", previewMarkdown: "" };
  }

  const rawClone = sourceElement.cloneNode(true);
  const previewClone = sourceElement.cloneNode(true);

  rawClone.querySelectorAll(".prompt-fill").forEach((node) => {
    const label = normalizePromptFillLabel(node.textContent || "");
    node.replaceWith(document.createTextNode(`[${label}]`));
  });

  previewClone.querySelectorAll(".prompt-fill").forEach((node) => {
    const label = normalizePromptFillLabel(node.textContent || "");
    node.replaceWith(document.createTextNode(`⟦${label}⟧`));
  });

  const normalize = (value) => String(value || "").replace(/\r/g, "").trimEnd();
  const rawMarkdown = normalize(rawClone.textContent || "");
  const previewMarkdown = normalize(previewClone.textContent || "");

  return {
    rawMarkdown,
    previewMarkdown: previewMarkdown || rawMarkdown
  };
}

function renderSimpleMarkdown(markdownText) {
  const lines = String(markdownText || "").replace(/\r/g, "").split("\n");
  const parts = [];
  let listDepth = 0;

  const closeListsTo = (targetDepth) => {
    while (listDepth > targetDepth) {
      parts.push("</ul>");
      listDepth -= 1;
    }
  };

  for (const lineRaw of lines) {
    const line = lineRaw || "";
    const trimmed = line.trim();

    if (!trimmed) {
      closeListsTo(0);
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      closeListsTo(0);
      const level = headingMatch[1].length;
      parts.push(
        `<h${level}>${renderInlineMarkdown(headingMatch[2])}</h${level}>`
      );
      continue;
    }

    const listMatch = line.match(/^(\s*)-\s+(.+)$/);
    if (listMatch) {
      const indent = listMatch[1].replace(/\t/g, "  ").length;
      const nextDepth = Math.floor(indent / 2) + 1;

      while (listDepth < nextDepth) {
        parts.push("<ul>");
        listDepth += 1;
      }
      closeListsTo(nextDepth);

      parts.push(`<li>${renderInlineMarkdown(listMatch[2].trim())}</li>`);
      continue;
    }

    closeListsTo(0);
    parts.push(`<p>${renderInlineMarkdown(trimmed)}</p>`);
  }

  closeListsTo(0);
  return parts.join("");
}

function renderNotePreview() {
  if (!el.notePreview) return;
  const markdown = String(el.noteText?.value || "");
  if (!normalizeWs(markdown)) {
    el.notePreview.innerHTML =
      "<p class=\"muted\">여기에 Markdown 미리보기가 표시됩니다.</p>";
    return;
  }
  el.notePreview.innerHTML = renderSimpleMarkdown(markdown);
}

function getOrCreateCopyToast() {
  let toast = document.getElementById("copyToast");
  if (toast) return toast;

  toast = document.createElement("div");
  toast.id = "copyToast";
  toast.className = "copy-toast";
  document.body.appendChild(toast);
  return toast;
}

function filenameFromContentDisposition(headerValue) {
  const header = String(headerValue || "");
  if (!header) return "";

  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match && utf8Match[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const asciiMatch = header.match(/filename="([^"]+)"/i);
  if (asciiMatch && asciiMatch[1]) {
    return asciiMatch[1];
  }

  return "";
}

function filenameFromUrl(url) {
  try {
    const parsed = new URL(url, window.location.origin);
    const last = parsed.pathname.split("/").filter(Boolean).pop() || "";
    return decodeURIComponent(last);
  } catch {
    return "";
  }
}

function showCopyToast(message, isError = false) {
  const toast = getOrCreateCopyToast();
  toast.textContent = message;
  toast.classList.toggle("error", Boolean(isError));
  toast.classList.add("show");

  if (copyToastTimer) {
    clearTimeout(copyToastTimer);
  }
  copyToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1000);
}

function showCopyButtonState(button, copied, label) {
  if (!button) return;

  if (!button.dataset.defaultLabel) {
    button.dataset.defaultLabel = normalizeWs(button.textContent) || "복사";
  }

  button.textContent = label || button.dataset.defaultLabel;
  button.classList.toggle("copied", Boolean(copied));
  button.classList.toggle("failed", !copied && Boolean(label));

  if (!label) return;

  setTimeout(() => {
    button.textContent = button.dataset.defaultLabel || "복사";
    button.classList.remove("copied");
    button.classList.remove("failed");
  }, COPY_FEEDBACK_MS);
}

async function copyTextWithUiFeedback(button, text) {
  const payload = String(text || "");
  if (!payload) return false;

  try {
    await navigator.clipboard.writeText(payload);
    showCopyButtonState(button, true, "복사됨");
    showCopyToast("클립보드에 복사되었습니다");
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = payload;
    area.setAttribute("readonly", "readonly");
    area.style.position = "fixed";
    area.style.opacity = "0";
    area.style.pointerEvents = "none";
    document.body.appendChild(area);
    area.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    } finally {
      area.remove();
    }

    if (copied) {
      showCopyButtonState(button, true, "복사됨");
      showCopyToast("클립보드에 복사되었습니다");
      return true;
    }

    showCopyButtonState(button, false, "복사 실패");
    showCopyToast("복사에 실패했습니다", true);
    return false;
  }
}

function setupPromptMarkdownPreview(block) {
  const source = block.querySelector(".prompt-inline-content, .prompt-content");
  if (!source || source.dataset.previewBound === "1") return;

  source.dataset.previewBound = "1";
  const { rawMarkdown, previewMarkdown } = extractPromptMarkdownVariants(source);
  source.dataset.mdRaw = rawMarkdown;
  source.hidden = true;

  const lines = previewMarkdown.split("\n");
  const hasMore = lines.length > PROMPT_PREVIEW_MAX_LINES;
  let expanded = false;

  const preview = document.createElement("div");
  preview.className = "prompt-md-preview";
  block.appendChild(preview);

  let toggleBtn = null;
  if (hasMore) {
    const header = block.querySelector(".prompt-inline-header, .prompt-header");
    toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "prompt-expand-toggle";
    header?.appendChild(toggleBtn);
  }

  const render = () => {
    const visibleMarkdown =
      !hasMore || expanded
        ? previewMarkdown
        : lines.slice(0, PROMPT_PREVIEW_MAX_LINES).join("\n");
    preview.innerHTML = renderSimpleMarkdown(visibleMarkdown);
    preview.classList.toggle("collapsed", hasMore && !expanded);

    if (toggleBtn) {
      toggleBtn.textContent = expanded ? "접기" : "모두 펼치기";
    }
  };

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      expanded = !expanded;
      render();
    });
  }

  render();
}

function enhancePromptMarkdownBlocks() {
  el.clipBody
    .querySelectorAll(".prompt-inline-block, .prompt-block")
    .forEach((block) => setupPromptMarkdownPreview(block));
}

function wireMarkdownLiveEditors() {
  el.clipBody.querySelectorAll(".md-live-editor").forEach((editor) => {
    const input = editor.querySelector(".md-editor-input");
    const preview = editor.querySelector(".md-editor-preview");
    if (!input || !preview) return;

    const render = () => {
      preview.innerHTML = renderSimpleMarkdown(input.value || "");
    };

    input.addEventListener("input", render);
    render();
  });
}

function renderSidebar() {
  el.chapterList.innerHTML = "";
  const fragment = document.createDocumentFragment();

  for (const chapter of state.chapters) {
    const chapterCard = document.createElement("section");
    chapterCard.className = "chapter-card";
    const expanded = state.expandedChapters.has(chapter.chapterId);
    chapterCard.classList.toggle("expanded", expanded);

    const header = document.createElement("button");
    header.type = "button";
    header.className = "chapter-header";
    header.innerHTML = `
      <span class="chapter-header-left">
        <span class="chapter-code">${chapter.chapterNum.replace(/\s+/g, "")}</span>
        <span class="chapter-label">${chapter.title}</span>
      </span>
      <span class="chapter-header-right">
        <span class="chapter-time">${chapter.time || ""}</span>
        <span class="chapter-chevron">${expanded ? "▾" : "▸"}</span>
      </span>
    `;

    header.addEventListener("click", () => {
      if (state.expandedChapters.has(chapter.chapterId)) {
        state.expandedChapters.delete(chapter.chapterId);
      } else {
        state.expandedChapters.add(chapter.chapterId);
      }
      renderSidebar();
    });

    const clipList = document.createElement("div");
    clipList.className = "clip-list";
    clipList.classList.toggle("collapsed", !expanded);

    for (const clip of chapter.clips) {
      state.clipMap.set(clip.clipKey, {
        ...clip,
        chapterId: chapter.chapterId,
        chapterNum: chapter.chapterNum,
        chapterTitle: chapter.title
      });

      const label = clipTypeLabel(clip, chapter);
      const btn = document.createElement("button");
      btn.className = "clip-btn";
      btn.dataset.clipKey = clip.clipKey;

      if (state.completedSet.has(clip.clipKey) || clip.completed) {
        btn.classList.add("completed");
      }
      if (clip.clipKey === state.currentClipKey) {
        btn.classList.add("active");
      }

      btn.innerHTML = `
        <span class="clip-main">
          <span class="clip-dot"></span>
          <span class="clip-title">${shortClipTitle(clip.title)}</span>
        </span>
        <span class="clip-type-badge ${clipTypeClass(label)}">${label}</span>
      `;
      btn.addEventListener("click", () => openClip(clip.clipKey, true));
      clipList.appendChild(btn);
    }

    chapterCard.appendChild(header);
    chapterCard.appendChild(clipList);
    fragment.appendChild(chapterCard);
  }

  el.chapterList.appendChild(fragment);
  updateProgressBadge();
}

function renderClipHeader(clip) {
  el.clipTitle.textContent = clip.title || clip.clipKey;
  el.clipOverview.textContent = clip.overview || "";
  el.clipBadges.innerHTML = "";

  const chapterBadgePattern = /^CH\s?\d{2}$/i;
  const sourceBadges = Array.isArray(clip.badges) ? clip.badges : [];
  const badges = [];
  let hasChapterBadge = false;

  for (const badge of sourceBadges) {
    if (chapterBadgePattern.test(String(badge || ""))) {
      if (!hasChapterBadge && clip.chapterNum) {
        badges.push(clip.chapterNum);
      }
      hasChapterBadge = true;
      continue;
    }
    badges.push(badge);
  }

  if (!hasChapterBadge && clip.chapterNum) {
    badges.unshift(clip.chapterNum);
  }

  for (const badge of badges) {
    const span = document.createElement("span");
    span.className = "clip-badge";
    span.textContent = badge;
    el.clipBadges.appendChild(span);
  }
}

function enhanceChartBlocks() {
  if (!window.Chart) return;
  el.clipBody.querySelectorAll(".chart-shell").forEach((shell) => {
    if (shell.dataset.bound === "1") return;
    shell.dataset.bound = "1";
    const source = shell.querySelector(".chart-json");
    const raw = String(source?.textContent || "").trim();
    if (!raw) return;
    let config = null;
    try {
      config = JSON.parse(raw);
    } catch {
      config = null;
    }
    if (!config) return;
    const canvas = document.createElement("canvas");
    canvas.className = "chart-canvas";
    shell.innerHTML = "";
    shell.appendChild(canvas);
    try {
      // eslint-disable-next-line no-new
      new window.Chart(canvas, config);
    } catch {
      const fallback = document.createElement("pre");
      fallback.className = "chart-json";
      fallback.textContent = raw;
      shell.appendChild(fallback);
    }
  });
}

function enhanceMermaidBlocks() {
  if (!window.mermaid) return;
  if (!state.mermaidReady) {
    window.mermaid.initialize({ startOnLoad: false, securityLevel: "loose", theme: "default" });
    state.mermaidReady = true;
  }
  const nodes = Array.from(el.clipBody.querySelectorAll(".mermaid"));
  if (!nodes.length) return;
  window.mermaid.run({ nodes }).catch(() => {});
}

function enhanceClipBody() {
  el.clipBody.classList.add("course-content");

  el.clipBody.querySelectorAll(".clip-section").forEach((section, index) => {
    section.classList.add("surface-card");
    section.style.setProperty("--stagger", `${Math.min(index * 35, 280)}ms`);
  });

  el.clipBody.querySelectorAll(".news-card").forEach((card, index) => {
    card.style.setProperty("--stagger", `${Math.min(index * 30, 340)}ms`);
  });

  el.clipBody.querySelectorAll(".concept-card").forEach((card) => {
    if (card.dataset.enhanced === "1") return;
    card.dataset.enhanced = "1";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "카드를 뒤집어 상세 설명 보기");
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.classList.toggle("flipped");
      }
    });
  });

  renderSlideDeckPreviews();
  populateSlideDeckDownloadLinks();
  wireMarkdownLiveEditors();
  enhancePromptMarkdownBlocks();
  enhanceChartBlocks();
  enhanceMermaidBlocks();
}

function wireClipInteractions() {
  el.clipBody.querySelectorAll("a[href^='/practice-files/']").forEach((anchor) => {
    if (anchor.dataset.downloadBound === "1") return;
    anchor.dataset.downloadBound = "1";
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href) return;
      window.downloadFile(href, "", event);
    });
  });

  el.clipBody.querySelectorAll("a[href^='#']").forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      const target = normalizeWs(href).replace(/^#/, "");
      if (!target) return;
      event.preventDefault();
      openClip(target, true).catch((error) => alert(error.message));
    });
  });

  el.clipBody.querySelectorAll("[data-slide-deck]").forEach((button) => {
    if (button.dataset.slideDeckBound === "1") return;
    button.dataset.slideDeckBound = "1";
    button.addEventListener("click", () => {
      const deckId = normalizeWs(button.dataset.slideDeck || "");
      if (!deckId) return;
      openSlideDeck(deckId);
    });
  });

  el.clipBody.querySelectorAll("[data-slide-deck-card]").forEach((button) => {
    if (button.dataset.slideDeckCardBound === "1") return;
    button.dataset.slideDeckCardBound = "1";
    button.addEventListener("click", () => {
      const deckId = normalizeWs(button.dataset.slideDeckCard || "");
      const slideIndex = Number(button.dataset.slideIndex || "0");
      if (!deckId) return;
      openSlideDeck(deckId, slideIndex);
    });
  });
}

async function openClip(clipKey, updateHash = false) {
  const normalized = normalizeClipKey(clipKey);
  if (!normalized) return;
  closeSlideDeck();

  const data = await api(`/api/clips/${encodeURIComponent(normalized)}`);
  const clip = data.clip;

  state.currentClipKey = clip.clipKey;
  state.currentChapterId = clip.chapterId || "";
  state.currentChapterNum = clip.chapterNum || "";
  state.currentChapterTitle = clip.chapterTitle || "";
  if (state.currentChapterId) {
    state.expandedChapters.add(state.currentChapterId);
  }

  if (data.completed) {
    state.completedSet.add(clip.clipKey);
  } else {
    state.completedSet.delete(clip.clipKey);
  }

  renderClipHeader(clip);
  el.clipBody.innerHTML = clip.contentHtml || "<p>콘텐츠가 없습니다.</p>";
  enhanceClipBody();
  wireClipInteractions();
  updateMarkCompleteButton();
  renderSidebar();

  if (state.taskPanelOpen) {
    await loadTaskForCurrentChapter();
  }
  await loadNoteForCurrentClip();

  if (updateHash || window.location.hash !== `#${clip.clipKey}`) {
    window.location.hash = `#${clip.clipKey}`;
  }
}

async function loadChaptersAndDefaultClip() {
  const data = await api("/api/chapters");
  state.chapters = data.chapters || [];
  state.clipMap = new Map();
  state.completedSet = new Set();

  const knownClipKeys = new Set();
  for (const chapter of state.chapters) {
    for (const clip of chapter.clips) {
      knownClipKeys.add(clip.clipKey);
      if (clip.completed) {
        state.completedSet.add(clip.clipKey);
      }
    }
  }

  const firstClip = state.chapters[0]?.clips[0]?.clipKey || "";
  const hashClip = normalizeClipKey(window.location.hash.replace(/^#/, ""));
  const targetClip = knownClipKeys.has(hashClip) ? hashClip : firstClip;

  const targetChapter =
    state.chapters.find((chapter) =>
      chapter.clips.some((clip) => clip.clipKey === targetClip)
    ) || state.chapters[0];
  state.expandedChapters = new Set(targetChapter ? [targetChapter.chapterId] : []);

  renderSidebar();
  if (targetClip) {
    await openClip(targetClip);
  }
}

async function loadTaskForCurrentChapter() {
  if (!state.currentChapterId) {
    el.taskChapterContext.textContent = "현재 챕터를 선택해 주세요.";
    el.taskTitle.value = "";
    el.taskReason.value = "";
    el.taskEffect.value = "";
    setTaskStatus("");
    return;
  }

  el.taskChapterContext.textContent = `${state.currentChapterNum} ${state.currentChapterTitle} 과제 제출`;

  try {
    const data = await api(
      `/api/ax-task?chapterId=${encodeURIComponent(state.currentChapterId)}`
    );
    const task = data.axTask || {};
    el.taskTitle.value = task.title || "";
    el.taskReason.value = task.reason || "";
    el.taskEffect.value = task.effect || "";

    if (task.updatedAt) {
      setTaskStatus(`최근 저장: ${new Date(task.updatedAt).toLocaleString()}`);
    } else {
      setTaskStatus("");
    }
  } catch (error) {
    setTaskStatus(error.message, true);
  }
}

function setAuthStorage(user, sessionToken, course) {
  if (user?.accountId) {
    localStorage.setItem(STORAGE_LAST_ID_KEY, user.accountId);
    localStorage.setItem("ax_literacy_account_id", user.accountId);
  }
  if (sessionToken) {
    localStorage.setItem(STORAGE_SESSION_KEY, sessionToken);
  }
  const code = normalizeCourseCode(course?.courseCode || user?.courseCode || "");
  if (code) {
    localStorage.setItem(STORAGE_COURSE_CODE_KEY, code);
  }
}

function clearAuthStorage() {
  localStorage.removeItem(STORAGE_SESSION_KEY);
  localStorage.removeItem("ax_literacy_account_id");
  localStorage.removeItem(STORAGE_COURSE_CODE_KEY);
}

function renderCourseOptions() {
  if (!el.courseCodeList) return;
  const options = (state.courses || [])
    .map(
      (course) =>
        `<option value="${escapeHtml(course.courseCode)}">${escapeHtml(
          course.courseName || course.courseCode
        )}</option>`
    )
    .join("");
  el.courseCodeList.innerHTML = options;
}

async function loadCourseDirectory() {
  try {
    const data = await api("/api/courses");
    state.courses = Array.isArray(data.courses) ? data.courses : [];
    renderCourseOptions();
    const queryCourse = normalizeCourseCode(new URLSearchParams(window.location.search).get("course"));
    const preferred =
      queryCourse ||
      normalizeCourseCode(localStorage.getItem(STORAGE_COURSE_CODE_KEY)) ||
      normalizeCourseCode(state.courses[0]?.courseCode || "AXCAMP");
    if (el.loginCourseCode && !normalizeCourseCode(el.loginCourseCode.value)) {
      el.loginCourseCode.value = preferred;
    }
    if (el.signupCourseCode && !normalizeCourseCode(el.signupCourseCode.value)) {
      el.signupCourseCode.value = preferred;
    }
  } catch {
    state.courses = [];
    renderCourseOptions();
  }
}

function renderCurrentCourse() {
  if (!el.currentCourseBadge) return;
  const code = normalizeCourseCode(state.currentCourse?.courseCode || state.user?.courseCode || "");
  const name = normalizeWs(state.currentCourse?.courseName || "");
  if (!code) {
    el.currentCourseBadge.textContent = "코스 -";
    return;
  }
  el.currentCourseBadge.textContent = name ? `코스 ${code} · ${name}` : `코스 ${code}`;
}

function renderCurrentUser() {
  if (!state.user) {
    el.currentUser.textContent = "-";
    renderCurrentCourse();
    return;
  }
  const team = state.user.teamName ? ` / ${state.user.teamName}` : "";
  el.currentUser.textContent = `${state.user.displayName} (${state.user.accountId}${team})`;
  renderCurrentCourse();
}

function updateAdminVisibility() {
  if (state.isAdmin) {
    el.adminSection.classList.remove("hidden");
  } else {
    el.adminSection.classList.add("hidden");
  }
}

async function loadAdminUsers() {
  if (!state.isAdmin) return;
  setAdminStatus("");
  try {
    const data = await api("/api/admin/users");
    const users = Array.isArray(data.users) ? data.users : [];
    el.adminUsersTbody.innerHTML = "";

    for (const user of users) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(user.letsId || user.accountId)}</td>
        <td>${escapeHtml(user.displayName || "")}</td>
        <td>${escapeHtml(user.teamName || "")}</td>
        <td><code>${escapeHtml(user.password || "")}</code></td>
        <td>${Number(user.completedCount || 0)}</td>
        <td>${Number(user.taskCount || 0)}</td>
        <td>${Number(user.noteCount || 0)}</td>
      `;
      el.adminUsersTbody.appendChild(tr);
    }
    setAdminStatus(`사용자 ${users.length}명`);
  } catch (error) {
    setAdminStatus(error.message, true);
  }
}

async function loadNoteForCurrentClip() {
  if (!state.currentClipKey) {
    el.noteText.value = "";
    renderNotePreview();
    setNoteStatus("");
    return;
  }

  el.noteClipContext.textContent = `${state.currentChapterNum} ${state.currentChapterTitle} / ${state.currentClipKey}`;

  try {
    const data = await api(
      `/api/notes?clipKey=${encodeURIComponent(state.currentClipKey)}`
    );
    const note = data.note || {};
    el.noteText.value = note.content || "";
    renderNotePreview();
    if (note.updatedAt) {
      setNoteStatus(`최근 저장: ${new Date(note.updatedAt).toLocaleString()}`);
    } else {
      setNoteStatus("");
    }
  } catch (error) {
    renderNotePreview();
    setNoteStatus(error.message, true);
  }
}

async function saveCurrentClipNote() {
  if (!state.currentClipKey) return;
  setNoteStatus("");
  try {
    const data = await api(
      `/api/notes?clipKey=${encodeURIComponent(state.currentClipKey)}`,
      {
        method: "POST",
        body: {
          content: el.noteText.value || ""
        }
      }
    );
    const updatedAt = data.note?.updatedAt;
    if (updatedAt) {
      setNoteStatus(`저장 완료: ${new Date(updatedAt).toLocaleString()}`);
    } else {
      setNoteStatus("저장 완료");
    }
  } catch (error) {
    setNoteStatus(error.message, true);
  }
}

function hydrateSession(result) {
  state.user = result.user || null;
  state.accountId = result.user?.accountId || "";
  state.sessionToken = normalizeWs(result.sessionToken || state.sessionToken);
  state.isAdmin = Boolean(result.user?.isAdmin);
  state.currentCourse = result.course || state.currentCourse || null;
  const activeCourseCode = normalizeCourseCode(
    result.course?.courseCode || result.user?.courseCode || ""
  );
  if (activeCourseCode) {
    if (el.loginCourseCode) el.loginCourseCode.value = activeCourseCode;
    if (el.signupCourseCode) el.signupCourseCode.value = activeCourseCode;
  }
  renderCurrentUser();
  updateAdminVisibility();
  setAuthStorage(result.user, state.sessionToken, result.course);
  if (state.isAdmin) {
    loadAdminUsers().catch((error) => setAdminStatus(error.message, true));
  }
}

async function onLoginSubmit(event) {
  event.preventDefault();
  setLoginError("");

  const accountId = normalizeWs(el.loginAccountId.value);
  const password = String(el.loginPassword.value || "");
  const courseCode = normalizeCourseCode(el.loginCourseCode?.value || "");

  try {
    const result = await api("/api/login", {
      method: "POST",
      body: { accountId, password, courseCode }
    });

    hydrateSession(result);
    showApp();
    await loadChaptersAndDefaultClip();
    if (state.taskPanelOpen) {
      await loadTaskForCurrentChapter();
    }
  } catch (error) {
    setLoginError(error.message);
  }
}

async function onSignupSubmit(event) {
  event.preventDefault();
  setSignupError("");

  const accountId = normalizeWs(el.signupAccountId.value);
  const password = String(el.signupPassword.value || "");
  const teamName = normalizeWs(el.signupTeamName.value);
  const displayName = normalizeWs(el.signupDisplayName.value);
  const courseCode = normalizeCourseCode(el.signupCourseCode?.value || "");

  try {
    const result = await api("/api/signup", {
      method: "POST",
      body: {
        letsId: accountId,
        accountId,
        password,
        teamName,
        displayName,
        courseCode
      }
    });
    hydrateSession(result);
    showApp();
    await loadChaptersAndDefaultClip();
    if (state.taskPanelOpen) {
      await loadTaskForCurrentChapter();
    }
  } catch (error) {
    setSignupError(error.message);
  }
}

async function onPasswordHint() {
  const accountId = normalizeWs(el.helpAccountId.value || el.loginAccountId.value);
  el.passwordHintResult.textContent = "";

  try {
    const result = await api("/api/password-hint", {
      method: "POST",
      body: { accountId }
    });
    el.passwordHintResult.textContent = `힌트: ${result.hint}`;
  } catch (error) {
    el.passwordHintResult.textContent = error.message;
  }
}

async function onPasswordRecover() {
  const accountId = normalizeWs(el.helpAccountId.value || el.loginAccountId.value);
  const teamName = normalizeWs(el.helpTeamName.value);
  el.passwordRecoverResult.textContent = "";

  try {
    const result = await api("/api/password-recover", {
      method: "POST",
      body: { accountId, teamName }
    });
    el.passwordRecoverResult.textContent = `비밀번호: ${result.password}`;
  } catch (error) {
    el.passwordRecoverResult.textContent = error.message;
  }
}

async function onAccountSubmit(event) {
  event.preventDefault();
  setAccountStatus("");

  const accountId = normalizeWs(el.accountEditId.value);
  const displayName = normalizeWs(el.accountEditDisplayName.value);
  const teamName = normalizeWs(el.accountEditTeamName.value);
  const currentPassword = String(el.accountCurrentPassword.value || "");
  const newPassword = String(el.accountNewPassword.value || "");

  try {
    const result = await api("/api/account", {
      method: "POST",
      body: {
        letsId: accountId,
        accountId,
        displayName,
        teamName,
        currentPassword,
        newPassword
      }
    });

    hydrateSession(result);
    el.loginAccountId.value = result.user.accountId || "";
    el.helpAccountId.value = result.user.accountId || "";
    el.accountCurrentPassword.value = "";
    el.accountNewPassword.value = "";
    closeAccountModal();
    showCopyToast("계정 정보가 변경되었습니다");
  } catch (error) {
    setAccountStatus(error.message, true);
  }
}

async function tryAutoLogin() {
  const savedToken = normalizeWs(localStorage.getItem(STORAGE_SESSION_KEY));
  const savedId =
    normalizeWs(localStorage.getItem(STORAGE_LAST_ID_KEY)) ||
    normalizeWs(localStorage.getItem("ax_literacy_account_id"));
  const savedCourseCode = normalizeCourseCode(localStorage.getItem(STORAGE_COURSE_CODE_KEY));
  if (savedId) {
    el.loginAccountId.value = savedId;
    el.helpAccountId.value = savedId;
  }
  if (savedCourseCode) {
    if (el.loginCourseCode) el.loginCourseCode.value = savedCourseCode;
    if (el.signupCourseCode) el.signupCourseCode.value = savedCourseCode;
  }

  if (!savedToken) {
    showLogin();
    showLoginMode();
    return;
  }

  try {
    state.sessionToken = savedToken;
    const courseQuery = normalizeCourseCode(el.loginCourseCode?.value || "");
    const path = courseQuery
      ? `/api/me?course=${encodeURIComponent(courseQuery)}`
      : "/api/me";
    const result = await api(path);
    hydrateSession(result);
    showApp();
    await loadChaptersAndDefaultClip();
    if (state.taskPanelOpen) {
      await loadTaskForCurrentChapter();
    }
  } catch {
    clearAuthStorage();
    state.accountId = "";
    state.sessionToken = "";
    state.user = null;
    state.isAdmin = false;
    showLogin();
    showLoginMode();
  }
}

async function onToggleComplete() {
  if (!state.currentClipKey) return;
  const nextValue = !state.completedSet.has(state.currentClipKey);

  try {
    const result = await api("/api/progress", {
      method: "POST",
      body: {
        clipKey: state.currentClipKey,
        completed: nextValue
      }
    });
    state.completedSet = new Set(result.completedClipKeys || []);
    updateMarkCompleteButton();
    renderSidebar();
  } catch (error) {
    alert(error.message);
  }
}

function onToggleTaskPanel() {
  const willOpen = !state.taskPanelOpen;
  state.taskPanelOpen = willOpen;
  if (willOpen) {
    state.notePanelOpen = false;
  }
  updateSidePanelUI();
  if (state.taskPanelOpen) {
    loadTaskForCurrentChapter().catch((error) => setTaskStatus(error.message, true));
    if (state.isAdmin) {
      loadAdminUsers().catch((error) => setAdminStatus(error.message, true));
    }
  }
}

function onToggleNotePanel() {
  const willOpen = !state.notePanelOpen;
  state.notePanelOpen = willOpen;
  if (willOpen) {
    state.taskPanelOpen = false;
  }
  updateSidePanelUI();
  if (state.notePanelOpen) {
    loadNoteForCurrentClip().catch((error) => setNoteStatus(error.message, true));
  }
}

async function onCopyNote() {
  await copyTextWithUiFeedback(el.copyNoteBtn, el.noteText.value || "");
}

async function onTaskSubmit(event) {
  event.preventDefault();
  setTaskStatus("");

  if (!state.currentChapterId) {
    setTaskStatus("현재 챕터를 찾을 수 없습니다.", true);
    return;
  }

  try {
    const result = await api(
      `/api/ax-task?chapterId=${encodeURIComponent(state.currentChapterId)}`,
      {
        method: "POST",
        body: {
          title: el.taskTitle.value,
          reason: el.taskReason.value,
          effect: el.taskEffect.value
        }
      }
    );
    setTaskStatus(
      `${state.currentChapterNum} 저장 완료: ${new Date(
        result.axTask.updatedAt
      ).toLocaleString()}`
    );
  } catch (error) {
    setTaskStatus(error.message, true);
  }
}

async function onLogout() {
  try {
    await api("/api/logout", { method: "POST" });
  } catch {
    // ignore
  }
  clearAuthStorage();
  state.accountId = "";
  state.sessionToken = "";
  state.isAdmin = false;
  state.user = null;
  state.currentCourse = null;
  state.chapters = [];
  state.clipMap = new Map();
  state.completedSet = new Set();
  state.currentClipKey = "";
  state.currentChapterId = "";
  state.currentChapterNum = "";
  state.currentChapterTitle = "";
  state.expandedChapters = new Set();
  closeSlideDeck();
  state.taskPanelOpen = false;
  state.notePanelOpen = false;
  el.adminUsersTbody.innerHTML = "";
  el.noteText.value = "";
  renderNotePreview();
  el.noteClipContext.textContent = "현재 클립";
  closeAccountModal();
  setNoteStatus("");
  setAdminStatus("");

  window.location.hash = "";
  showLogin();
  showLoginMode();
  renderCurrentUser();
}

function bindEvents() {
  el.loginForm.addEventListener("submit", onLoginSubmit);
  el.signupForm.addEventListener("submit", onSignupSubmit);
  el.markCompleteBtn.addEventListener("click", onToggleComplete);
  el.taskForm.addEventListener("submit", onTaskSubmit);
  el.toggleTaskBtn.addEventListener("click", onToggleTaskPanel);
  el.toggleNoteBtn.addEventListener("click", onToggleNotePanel);
  el.saveNoteBtn.addEventListener("click", () => {
    saveCurrentClipNote().catch((error) => setNoteStatus(error.message, true));
  });
  el.noteText.addEventListener("input", renderNotePreview);
  el.copyNoteBtn.addEventListener("click", () => {
    onCopyNote().catch((error) => setNoteStatus(error.message, true));
  });
  el.showLoginModeBtn.addEventListener("click", showLoginMode);
  el.showSignupModeBtn.addEventListener("click", showSignupMode);
  el.showPasswordHelpBtn.addEventListener("click", showPasswordHelpMode);
  el.closePasswordHelpBtn.addEventListener("click", showLoginMode);
  el.passwordHintBtn.addEventListener("click", () => {
    onPasswordHint().catch((error) => {
      el.passwordHintResult.textContent = error.message;
    });
  });
  el.passwordRecoverBtn.addEventListener("click", () => {
    onPasswordRecover().catch((error) => {
      el.passwordRecoverResult.textContent = error.message;
    });
  });
  el.accountSettingsBtn.addEventListener("click", openAccountModal);
  el.closeAccountModalBtn.addEventListener("click", closeAccountModal);
  el.accountForm.addEventListener("submit", onAccountSubmit);
  el.refreshUsersBtn?.addEventListener("click", () => {
    loadAdminUsers().catch((error) => setAdminStatus(error.message, true));
  });
  el.logoutBtn.addEventListener("click", onLogout);

  el.accountModal.addEventListener("click", (event) => {
    if (event.target === el.accountModal) {
      closeAccountModal();
    }
  });

  el.slideDeckModal.addEventListener("click", (event) => {
    if (event.target === el.slideDeckModal) {
      closeSlideDeck();
    }
  });

  el.closeSlideDeckBtn.addEventListener("click", closeSlideDeck);
  el.slidePrevBtn.addEventListener("click", () => {
    if (!state.activeSlideDeck || state.activeSlideIndex <= 0) return;
    state.activeSlideIndex -= 1;
    renderActiveSlideDeck();
  });
  el.slideNextBtn.addEventListener("click", () => {
    if (!state.activeSlideDeck) return;
    const lastIndex = state.activeSlideDeck.slides.length - 1;
    if (state.activeSlideIndex >= lastIndex) return;
    state.activeSlideIndex += 1;
    renderActiveSlideDeck();
  });

  window.addEventListener("hashchange", () => {
    const target = normalizeClipKey(window.location.hash.replace(/^#/, ""));
    if (target && target !== state.currentClipKey) {
      openClip(target).catch((error) => alert(error.message));
    }
  });

  state.taskPanelOpen = false;
  state.notePanelOpen = false;
  updateSidePanelUI();
  renderNotePreview();

  let wasDesktop = window.innerWidth > 1380;
  window.addEventListener("resize", () => {
    const isDesktop = window.innerWidth > 1380;
    if (!isDesktop && wasDesktop) {
      state.taskPanelOpen = false;
      state.notePanelOpen = false;
      updateSidePanelUI();
    }
    wasDesktop = isDesktop;
  });

  window.addEventListener("keydown", (event) => {
    if (state.activeSlideDeck) {
      if (event.key === "Escape") {
        closeSlideDeck();
        return;
      }
      if (event.key === "ArrowLeft" && state.activeSlideIndex > 0) {
        state.activeSlideIndex -= 1;
        renderActiveSlideDeck();
        return;
      }
      if (
        event.key === "ArrowRight" &&
        state.activeSlideIndex < state.activeSlideDeck.slides.length - 1
      ) {
        state.activeSlideIndex += 1;
        renderActiveSlideDeck();
        return;
      }
    }

    if (event.key === "Escape" && !el.accountModal.classList.contains("hidden")) {
      closeAccountModal();
    }
  });
}

window.copyPrompt = async function copyPrompt(button, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  await copyTextWithUiFeedback(button, target.textContent || "");
};

window.copyInlinePrompt = async function copyInlinePrompt(button) {
  const block = button?.closest(".prompt-inline-block, .prompt-block");
  if (!block) return;

  const source = block.querySelector(".prompt-inline-content, .prompt-content");
  const markdown = source?.dataset?.mdRaw || source?.textContent || "";
  await copyTextWithUiFeedback(button, markdown);
};

window.downloadFile = async function downloadFile(url, filename, event) {
  if (event && typeof event.preventDefault === "function") {
    event.preventDefault();
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`download failed (${response.status})`);
    }

    const blob = await response.blob();
    const resolvedName =
      normalizeWs(filename) ||
      filenameFromContentDisposition(response.headers.get("content-disposition")) ||
      filenameFromUrl(url) ||
      "download";
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = resolvedName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

window.filterNews = function filterNews(category, button) {
  const targetCategory = normalizeWs(category || "all");
  const cards = el.clipBody.querySelectorAll(".news-card");
  const filterButtons = el.clipBody.querySelectorAll(".news-filter-btn");

  cards.forEach((card) => {
    const cardCategory = normalizeWs(card.dataset.cat || "");
    const visible = targetCategory === "all" || targetCategory === cardCategory;
    card.classList.toggle("hidden-by-filter", !visible);
  });

  filterButtons.forEach((btn) => btn.classList.remove("active"));
  if (button) {
    button.classList.add("active");
  }
};

bindEvents();
loadCourseDirectory()
  .catch(() => {})
  .finally(() => {
    tryAutoLogin().catch(() => {});
  });
