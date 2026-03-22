const http = require("http");
const fsSync = require("fs");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DATA_DIR = path.join(ROOT_DIR, "data");
const DB_FILE = path.join(DATA_DIR, "users.json");

const SOURCE_ROOT_CANDIDATES = [
  path.resolve(ROOT_DIR, "content", "axcamp_repro"),
  path.resolve(ROOT_DIR, "..", "axcamp_repro")
];
const SOURCE_ROOT =
  SOURCE_ROOT_CANDIDATES.find((candidate) =>
    fsSync.existsSync(path.join(candidate, "export-report.json"))
  ) || SOURCE_ROOT_CANDIDATES[0];
const CHAPTERS_DIR = path.join(SOURCE_ROOT, "chapters");
const EXPORT_REPORT_FILE = path.join(SOURCE_ROOT, "export-report.json");
const GENERATED_COURSES_DIR = path.resolve(ROOT_DIR, "content", "generated_courses");
const GENERATED_COURSE_CATALOG_FILE = path.join(GENERATED_COURSES_DIR, "catalog.json");
const DEFAULT_COURSE_CODE = "AXCAMP";
const DEFAULT_COURSE_SLUG = "axcamp_repro";
const PRACTICE_ROOT_REL = "[공유용] LG AX Camp For Leaders 실습자료";
const PRACTICE_FILE_MAP = {
  "all-zip": "practice_zips/LG_AX_Camp_For_Leaders_practice_all.zip",
  "ch04-zip": "practice_zips/CH04_NotebookLM_practice.zip",
  "1iKGcE5A6LldmVDV8evPlreUTT2fcfmGL": `${PRACTICE_ROOT_REL}/CH02-EXAONE_보안AI/03_EXAONE_가상_기밀보고서.md`,
  "1xJtcpem3mt4aWAKx08SfXjR9QxtIPSsO": `${PRACTICE_ROOT_REL}/CH02-EXAONE_보안AI/TB 26-01-03 샤오미 EV 혁신 방정식 - 자동차 산업의 시간과 비용을 재정의하다.pdf`,
  "1h2CfdVLN6Bx4SkUhQW-dL7VZAHfWTnAc": `${PRACTICE_ROOT_REL}/CH02-EXAONE_보안AI/06_EXAONE_3단계_프롬프트.md`,
  "19wD3WR1MXFO8rBrsk0ll9XFg6qF5kSsg": `${PRACTICE_ROOT_REL}/CH03-01-Gemini_회의분석/01_가상회의_오디오파일.wav`,
  "1xFco3cSTZApWXSG5iWY04K50GMmFCO9N": `${PRACTICE_ROOT_REL}/CH03-01-Gemini_회의분석/02_회의_맥락_참고자료.md`,
  "1B-zoWWsqVynVUiRqm7lrLcoW68gWQ-86": `${PRACTICE_ROOT_REL}/CH03-01-Gemini_회의분석/07_Gemini_단일흐름_프롬프트.md`,
  "1SQgCgDVWwXBjK93LwaI3m4vRgOuMQop_": `${PRACTICE_ROOT_REL}/CH03-02-Gems_AI어시스턴트/08_Gems_시스템_인스트럭션.md`,
  "1cFef9M4qSs5lBz-v8tJrOiMRIDsdlMkK": `${PRACTICE_ROOT_REL}/CH04-NotebookLM_멀티소스리서치/WEF_Future_of_Jobs_Report_2025.pdf`,
  "1D2co02HGXX1a-WEgVLjIuIyl3gcNH61_": `${PRACTICE_ROOT_REL}/CH04-NotebookLM_멀티소스리서치/gx-global-powers-of-luxury-goods-2023.pdf`,
  "1rUUUqSBenQZAUnM-53nKHajIX9sA_azI": `${PRACTICE_ROOT_REL}/CH04-NotebookLM_멀티소스리서치/global-powers-of-luxury-goods-2026.pdf`,
  "1MzJFg7xjyU5tiaulI-DyKBUYPxkQMZMA": `${PRACTICE_ROOT_REL}/CH04-NotebookLM_멀티소스리서치/09_NotebookLM_프롬프트.md`,
  "1gvjUkRlvncW_qN2t59e_f83tW9rA2Ddr": `${PRACTICE_ROOT_REL}/CH04-NotebookLM_멀티소스리서치/lg-logo-red.png`,
  "1PH3gO05x64ANRdLktbKBl0GoZJ7XZ_9Q": `${PRACTICE_ROOT_REL}/CH06-바이브코딩_리서치앱/10_바이브코딩_리서치앱_프롬프트.md`,
  "19dEPUVL57KQJaTA8HiTqb-V2QErT--fz": `${PRACTICE_ROOT_REL}/CH07-Antigravity_에이전틱AI/04_가상_조직정보.md`,
  "1AoN6JCsoGFoFm-531R54u5AVFnyHMRXP": `${PRACTICE_ROOT_REL}/CH07-Antigravity_에이전틱AI/05_Antigravity_입력_전략보고서.md`,
  "13ss0C1KvCf8uIe3HUQEpjduTX-715AVw": `${PRACTICE_ROOT_REL}/CH07-Antigravity_에이전틱AI/TB 26-01-01 하이센스의 중국 신규 스마트 팩토리 가동, CAC 산업 지각변동의 신호탄이 될 것인가.pdf`,
  "1QXGAklXpqr1movIgVJl-Eq_47fLbONoJ": `${PRACTICE_ROOT_REL}/CH07-Antigravity_에이전틱AI/11_Antigravity_3종보고서_프롬프트.md`,
  "1Zo0XTTSV2P1IBXelGk823KZLLhyyM1hH": `${PRACTICE_ROOT_REL}/CH07-Antigravity_에이전틱AI/12_Antigravity_HTML_PPT_프롬프트.md`,
  "15H72UwB7f2q11RiBvA9vqavJbA6NA08P": `${PRACTICE_ROOT_REL}/CH07-Antigravity_에이전틱AI/13_Antigravity_스킬_가이드.md`
};

const HOST = "0.0.0.0";
const PORT = Number(process.env.PORT || 4071);
const EXCLUDED_CLIP_KEYS = new Set([
  "ch02-clip01",
  "ch02-clip02",
  "ch02-clip03",
  "ch02-clip04"
]);
const ROOT_ACCOUNT_ID = "root";
const ROOT_DEFAULT_PASSWORD = process.env.AX_ROOT_PASSWORD || "root";

const ACCOUNT_ID_REGEX = /^(?=.{2,32}$)[\p{L}\p{N}][\p{L}\p{N}_.-]*$/u;
const MIME_MAP = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".zip": "application/zip",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

const catalogPromises = new Map();

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

function defaultCourseContext() {
  return {
    courseCode: DEFAULT_COURSE_CODE,
    slug: DEFAULT_COURSE_SLUG,
    courseName: "AX Camp Repro",
    sourceRoot: SOURCE_ROOT,
    launchUrl: `/?course=${encodeURIComponent(DEFAULT_COURSE_CODE)}`
  };
}

function toCourseResponse(course) {
  const safe = course || defaultCourseContext();
  return {
    courseCode: safe.courseCode || DEFAULT_COURSE_CODE,
    slug: safe.slug || DEFAULT_COURSE_SLUG,
    courseName: safe.courseName || safe.slug || DEFAULT_COURSE_SLUG,
    launchUrl: safe.launchUrl || `/?course=${encodeURIComponent(safe.courseCode || DEFAULT_COURSE_CODE)}`
  };
}

function decodeHtmlEntities(input) {
  return String(input || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractClipTitleFromHtml(html, fallback = "") {
  const source = String(html || "");
  const match = source.match(
    /<h1[^>]*class=["'][^"']*clip-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i
  );

  if (!match) return normalizeWs(fallback);

  let titleHtml = match[1] || "";
  // Remove glossary tooltip body so the sidebar/title isn't polluted by definitions.
  titleHtml = titleHtml.replace(
    /<span[^>]*class=["'][^"']*glossary-tooltip[^"']*["'][^>]*>[\s\S]*?<\/span>/gi,
    ""
  );

  const text = normalizeWs(
    decodeHtmlEntities(titleHtml.replace(/<[^>]+>/g, " ").trim())
  );
  return text || normalizeWs(fallback);
}

function extractClipTitleFromText(text, fallback = "") {
  const rawLines = String(text || "")
    .split(/\r?\n/)
    .map((line) => normalizeWs(line))
    .filter(Boolean);

  const skipSet = new Set(["개념", "실습", "참고", "개요", "플랫폼", "심화"]);

  for (const line of rawLines) {
    if (/^~?\d+\s*분$/.test(line)) continue;
    if (/^CH\s*\d+/i.test(line)) continue;
    if (skipSet.has(line)) continue;
    if (line.length < 2) continue;
    return line;
  }

  return normalizeWs(fallback);
}

function sanitizeClipTitleCandidate(input) {
  const title = normalizeWs(String(input || "").replace(/^#+\s*/, ""));
  if (!title) return "";
  if (title.length < 2 || title.length > 80) return "";
  if (/(학습 연결|근거 자료|이전 섹션|다음 섹션|이전 챕터 시작|다음 챕터 시작)/.test(title)) return "";
  if (/(유형:\s*|소요시간:\s*|#ch\d{2}-clip\d{2})/i.test(title)) return "";
  if (/\[본인의/.test(title)) return "";
  return title;
}

function deriveClipTitle(metadata, fallback = "") {
  const explicit = sanitizeClipTitleCandidate(metadata?.clipTitle || fallback);
  if (explicit) return explicit;

  const sections = Array.isArray(metadata?.sections) ? metadata.sections : [];
  for (const section of sections) {
    const fromSection = sanitizeClipTitleCandidate(section?.title || "");
    if (fromSection) return fromSection;
  }

  const fromHtml = sanitizeClipTitleCandidate(extractClipTitleFromHtml(metadata?.html || "", ""));
  if (fromHtml) return fromHtml;

  const fromText = sanitizeClipTitleCandidate(extractClipTitleFromText(metadata?.text || "", ""));
  if (fromText) return fromText;

  return normalizeWs(fallback);
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function sendText(res, statusCode, contentType, body) {
  res.writeHead(statusCode, {
    "Content-Type": contentType,
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function cleanAccountId(value) {
  return normalizeWs(value);
}

function cleanTeamName(value) {
  return normalizeWs(value);
}

function generateSessionToken() {
  return crypto.randomBytes(24).toString("hex");
}

function maskPasswordHint(password) {
  const raw = String(password || "");
  if (!raw) return "";
  if (raw.length <= 2) return raw;
  return `${raw.slice(0, 2)}${"*".repeat(raw.length - 2)}`;
}

function makeBuilderId(prefix) {
  return `${prefix}-${crypto.randomBytes(6).toString("hex")}`;
}

function normalizeSectionType(type) {
  const value = normalizeWs(type);
  const allowed = new Set(["개념", "실습", "플랫폼", "설정", "참고", "개요"]);
  return allowed.has(value) ? value : "개념";
}

function normalizeBlockKind(kind) {
  const value = normalizeWs(kind).toLowerCase();
  const allowed = new Set([
    "overview",
    "markdown",
    "prompt",
    "checklist",
    "resource",
    "quiz",
    "note",
    "table"
  ]);
  return allowed.has(value) ? value : "markdown";
}

function defaultBlockTitle(kind) {
  switch (normalizeBlockKind(kind)) {
    case "overview":
      return "섹션 개요";
    case "prompt":
      return "프롬프트";
    case "checklist":
      return "실습 체크리스트";
    case "resource":
      return "참고 자료";
    case "quiz":
      return "퀴즈";
    case "note":
      return "강의 노트";
    case "table":
      return "표";
    default:
      return "콘텐츠";
  }
}

function createDefaultBlock(sectionType) {
  const map = {
    개념: { kind: "overview", content: "이 섹션에서 다룰 핵심 개념을 3줄로 정리하세요." },
    실습: {
      kind: "checklist",
      content: "- 준비물\n- 실습 단계 1\n- 실습 단계 2\n- 결과 확인"
    },
    플랫폼: {
      kind: "resource",
      content: "- 공식 링크: \n- 계정 생성 방법: \n- 핵심 기능:"
    },
    설정: {
      kind: "markdown",
      content: "## 환경 설정\n1. 설치\n2. 로그인\n3. 검증"
    },
    참고: {
      kind: "resource",
      content: "- 문서 링크\n- 영상 링크\n- 샘플 파일"
    },
    개요: {
      kind: "overview",
      content: "학습 목표와 전체 흐름을 간단히 정리하세요."
    }
  };
  const picked = map[normalizeSectionType(sectionType)] || map["개념"];
  return {
    blockId: makeBuilderId("block"),
    kind: picked.kind,
    title: defaultBlockTitle(picked.kind),
    content: picked.content
  };
}

function sanitizeBuilderBlock(block, index = 1) {
  const kind = normalizeBlockKind(block?.kind || "markdown");
  return {
    blockId: normalizeWs(block?.blockId) || makeBuilderId("block"),
    kind,
    title: normalizeWs(block?.title || defaultBlockTitle(kind)) || `블록 ${index}`,
    content: String(block?.content || "").slice(0, 20000)
  };
}

function sanitizeBuilderSection(section, index = 1) {
  const sectionType = normalizeSectionType(section?.type);
  const rawBlocks = Array.isArray(section?.blocks) ? section.blocks : [];
  const blocks = rawBlocks
    .map((item, itemIndex) => sanitizeBuilderBlock(item, itemIndex + 1))
    .slice(0, 80);

  if (!blocks.length) {
    blocks.push(createDefaultBlock(sectionType));
  }

  const rawTags = Array.isArray(section?.tags) ? section.tags : [];
  const tags = rawTags.map((tag) => normalizeWs(tag)).filter(Boolean).slice(0, 20);

  return {
    sectionId: normalizeWs(section?.sectionId) || makeBuilderId("section"),
    title: normalizeWs(section?.title) || `섹션 ${index}`,
    shortTitle: normalizeWs(section?.shortTitle || ""),
    type: sectionType,
    duration: normalizeWs(section?.duration || "~10분"),
    objective: normalizeWs(section?.objective || ""),
    overview: normalizeWs(section?.overview || ""),
    tags,
    blocks
  };
}

function sanitizeBuilderChapter(chapter, index = 1) {
  const chapterIdDefault = `ch${String(index).padStart(2, "0")}`;
  const chapterCodeDefault = `CH${String(index).padStart(2, "0")}`;
  const rawSections = Array.isArray(chapter?.sections) ? chapter.sections : [];
  const sections = rawSections
    .map((item, itemIndex) => sanitizeBuilderSection(item, itemIndex + 1))
    .slice(0, 120);

  if (!sections.length) {
    sections.push(sanitizeBuilderSection({}, 1));
  }

  return {
    chapterId: normalizeWs(chapter?.chapterId || chapterIdDefault).toLowerCase(),
    code: normalizeWs(chapter?.code || chapterCodeDefault).toUpperCase(),
    title: normalizeWs(chapter?.title || `챕터 ${index}`),
    time: normalizeWs(chapter?.time || ""),
    summary: normalizeWs(chapter?.summary || ""),
    sections
  };
}

function sanitizeBuilderProject(project, index = 1, nowIso = new Date().toISOString()) {
  const rawChapters = Array.isArray(project?.chapters) ? project.chapters : [];
  const chapters = rawChapters
    .map((item, chapterIndex) => sanitizeBuilderChapter(item, chapterIndex + 1))
    .slice(0, 120);

  if (!chapters.length) {
    chapters.push(sanitizeBuilderChapter({}, 1));
  }

  return {
    projectId: normalizeWs(project?.projectId) || makeBuilderId("project"),
    name: normalizeWs(project?.name || `새 교육 과정 ${index}`),
    subtitle: normalizeWs(project?.subtitle || ""),
    audience: normalizeWs(project?.audience || ""),
    template: normalizeWs(project?.template || "blank"),
    theme: normalizeWs(project?.theme || "ax-literacy"),
    createdAt: project?.createdAt || nowIso,
    updatedAt: nowIso,
    chapters
  };
}

function ensureBuilderShape(builder, nowIso = new Date().toISOString()) {
  const source = builder && typeof builder === "object" ? builder : {};
  const rawProjects = Array.isArray(source.projects) ? source.projects : [];
  const projects = rawProjects
    .map((project, projectIndex) =>
      sanitizeBuilderProject(project, projectIndex + 1, nowIso)
    )
    .slice(0, 20);
  const requestedActiveId = normalizeWs(source.activeProjectId || "");
  const activeProjectId =
    (requestedActiveId &&
      projects.some((project) => project.projectId === requestedActiveId) &&
      requestedActiveId) ||
    projects[0]?.projectId ||
    "";

  return {
    activeProjectId,
    projects
  };
}

function createProjectFromTemplate(template, customName = "") {
  const normalizedTemplate = normalizeWs(template || "ax-camp").toLowerCase();
  const nowIso = new Date().toISOString();

  const templateMap = {
    blank: [
      { code: "CH00", title: "오리엔테이션", time: "", sectionTitle: "과정 소개", type: "개요" }
    ],
    workshop: [
      { code: "CH01", title: "핵심 개념", time: "10:00", sectionTitle: "핵심 정의", type: "개념" },
      { code: "CH02", title: "플랫폼 실습", time: "10:40", sectionTitle: "플랫폼 핸즈온", type: "플랫폼" },
      { code: "CH03", title: "업무 실습", time: "11:20", sectionTitle: "실습 과제", type: "실습" },
      { code: "CH04", title: "적용 계획", time: "12:00", sectionTitle: "실행 액션", type: "참고" }
    ],
    "ax-camp": [
      { code: "CH00", title: "오늘의 여정", time: "10:00", sectionTitle: "시간표", type: "개요" },
      { code: "CH01", title: "AI 핵심 개념", time: "10:25", sectionTitle: "핵심 개념", type: "개념" },
      { code: "CH02", title: "플랫폼 A", time: "10:35", sectionTitle: "플랫폼 체험", type: "플랫폼" },
      { code: "CH03", title: "플랫폼 B", time: "11:00", sectionTitle: "비즈니스 실습", type: "실습" },
      { code: "CH04", title: "심화 리서치", time: "13:00", sectionTitle: "리서치 워크플로", type: "실습" },
      { code: "CH05", title: "환경 설정", time: "13:45", sectionTitle: "도구 설정", type: "설정" },
      { code: "CH06", title: "바이브 코딩", time: "13:55", sectionTitle: "앱 제작", type: "실습" },
      { code: "CH07", title: "에이전틱 AI", time: "16:00", sectionTitle: "에이전트 설계", type: "개념" },
      { code: "CH08", title: "참고자료 라이브러리", time: "", sectionTitle: "자료 모음", type: "참고" },
      { code: "CH09", title: "Key Takeaways", time: "17:00", sectionTitle: "Q&A", type: "개요" }
    ]
  };

  const blueprint =
    templateMap[normalizedTemplate] ||
    templateMap["ax-camp"];

  const chapters = blueprint.map((item, index) => {
    const chapterNumberMatch = String(item.code || "").match(/(\d{1,2})/);
    const chapterNumber = chapterNumberMatch
      ? Number(chapterNumberMatch[1])
      : index;
    return sanitizeBuilderChapter(
      {
        chapterId: `ch${String(chapterNumber).padStart(2, "0")}`,
        code: item.code,
        title: item.title,
        time: item.time || "",
        summary: "",
        sections: [
          {
            sectionId: makeBuilderId("section"),
            title: item.sectionTitle,
            shortTitle: "",
            type: item.type,
            duration: "~10분",
            objective: "",
            overview: "",
            tags: [],
            blocks: [createDefaultBlock(item.type)]
          }
        ]
      },
      index + 1
    );
  });

  return sanitizeBuilderProject(
    {
      projectId: makeBuilderId("project"),
      name:
        normalizeWs(customName) ||
        (normalizedTemplate === "workshop"
          ? "워크숍형 교육 과정"
          : normalizedTemplate === "blank"
          ? "빈 템플릿 과정"
          : "AX Literacy 신규 과정"),
      subtitle: "",
      audience: "",
      template: normalizedTemplate,
      theme: "ax-literacy",
      createdAt: nowIso,
      updatedAt: nowIso,
      chapters
    },
    1,
    nowIso
  );
}

function buildBuilderExport(project) {
  const chapterEntries = [];
  const fileBlueprint = [];

  project.chapters.forEach((chapter, chapterIndex) => {
    const chapterMatch = String(chapter.code || "").match(/(\d{1,2})/);
    const chapterNum = chapterMatch
      ? Number(chapterMatch[1])
      : chapterIndex;
    const chapterId = `ch${String(chapterNum).padStart(2, "0")}`;
    const chapterNumLabel = `CH ${String(chapterNum).padStart(2, "0")}`;
    const chapterFolder = `CH${String(chapterNum).padStart(2, "0")}`;

    const clips = chapter.sections.map((section, sectionIndex) => {
      const clipIndex = String(sectionIndex + 1).padStart(2, "0");
      const clipKey = `${chapterId}-clip${clipIndex}`;
      const clipFolder = `chapters/${chapterFolder}/${clipKey}`;
      const route = `#${clipKey}`;

      const markdownLines = [
        `---`,
        `route: "${route}"`,
        `chapter: "${chapterId}"`,
        `title: "${section.title}"`,
        `---`,
        ``,
        `# ${section.title}`,
        ``,
        section.overview || "섹션 개요를 입력하세요.",
        ``
      ];

      section.blocks.forEach((block) => {
        markdownLines.push(`## ${block.title}`);
        markdownLines.push("");
        markdownLines.push(String(block.content || "").trim() || "(내용 입력)");
        markdownLines.push("");
      });

      const metadata = {
        route,
        clipTitle: section.title,
        overview: section.overview || "",
        badges: [section.duration || "", chapterNumLabel, section.type].filter(Boolean),
        sections: section.blocks.map((block, blockIdx) => ({
          index: blockIdx + 1,
          title: block.title,
          text: String(block.content || ""),
          html: ""
        })),
        prompts: section.blocks
          .filter((block) => block.kind === "prompt")
          .map((block, promptIndex) => ({
            index: promptIndex + 1,
            label: block.title,
            content: String(block.content || "")
          })),
        links: []
      };

      fileBlueprint.push(
        {
          path: `${clipFolder}/metadata.json`,
          content: JSON.stringify(metadata, null, 2)
        },
        {
          path: `${clipFolder}/content.md`,
          content: markdownLines.join("\n")
        },
        {
          path: `${clipFolder}/content.html`,
          content: `<div class="clip-header"><h1 class="clip-title">${escapeHtml(
            section.title
          )}</h1></div><div class="clip-overview">${escapeHtml(
            section.overview || ""
          )}</div>`
        },
        {
          path: `${clipFolder}/content.txt`,
          content: `${section.title}\n${section.overview || ""}`
        }
      );

      return {
        route,
        title: section.title,
        type: section.type,
        folder: clipFolder
      };
    });

    chapterEntries.push({
      chapterId,
      chapterNum: chapterNumLabel,
      title: chapter.title,
      time: chapter.time || "",
      clips
    });
  });

  return {
    generatedAt: new Date().toISOString(),
    project: {
      projectId: project.projectId,
      name: project.name,
      subtitle: project.subtitle,
      audience: project.audience,
      template: project.template
    },
    exportReport: {
      startedAt: new Date().toISOString(),
      baseUrl: "builder://generated",
      chapters: chapterEntries
    },
    fileBlueprint
  };
}

function ensureUserShape(user, nowIso = new Date().toISOString()) {
  if (!user || typeof user !== "object") return null;

  const accountId = cleanAccountId(user.accountId || user.letsId);
  if (!ACCOUNT_ID_REGEX.test(accountId)) return null;

  user.accountId = accountId;
  user.letsId = cleanAccountId(user.letsId || accountId);
  user.displayName = normalizeWs(user.displayName || accountId);
  user.teamName = cleanTeamName(user.teamName || "미지정");
  user.password = String(user.password || accountId);
  user.createdAt = user.createdAt || nowIso;
  user.lastLoginAt = user.lastLoginAt || user.createdAt;
  user.sessionToken = normalizeWs(user.sessionToken || "");
  user.courseCode = normalizeCourseCode(user.courseCode || DEFAULT_COURSE_CODE);
  user.courseSlug = normalizeWs(user.courseSlug || DEFAULT_COURSE_SLUG).toLowerCase();
  user.isAdmin =
    Boolean(user.isAdmin) ||
    String(accountId).toLowerCase() === ROOT_ACCOUNT_ID.toLowerCase();

  if (!user.progress || !Array.isArray(user.progress.completedClipKeys)) {
    user.progress = { completedClipKeys: [] };
  }
  if (!user.axTasks || typeof user.axTasks !== "object") {
    user.axTasks = {};
  }
  if (user.axTask && !user.axTasks.legacy) {
    user.axTasks.legacy = user.axTask;
  }
  if (!user.notes || typeof user.notes !== "object") {
    user.notes = {};
  }
  user.builder = ensureBuilderShape(user.builder, nowIso);

  return user;
}

function toUserResponse(user) {
  return {
    letsId: user.letsId || user.accountId,
    accountId: user.accountId,
    teamName: user.teamName || "",
    displayName: user.displayName,
    courseCode: user.courseCode || DEFAULT_COURSE_CODE,
    courseSlug: user.courseSlug || DEFAULT_COURSE_SLUG,
    isAdmin: Boolean(user.isAdmin),
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt
  };
}

async function ensureDb() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  if (!(await pathExists(DB_FILE))) {
    const initial = { users: [] };
    await fs.writeFile(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
  }
}

async function readDb() {
  await ensureDb();
  const text = await fs.readFile(DB_FILE, "utf8");
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed.users)) {
    parsed.users = [];
  }

  const nowIso = new Date().toISOString();
  parsed.users = parsed.users
    .map((user) => ensureUserShape(user, nowIso))
    .filter(Boolean);

  return parsed;
}

async function writeDb(db) {
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

async function ensureRootUser() {
  const db = await readDb();
  const now = new Date().toISOString();
  let rootUser =
    db.users.find(
      (user) => String(user.accountId).toLowerCase() === ROOT_ACCOUNT_ID
    ) || null;

  if (!rootUser) {
    rootUser = ensureUserShape(
      {
        accountId: ROOT_ACCOUNT_ID,
        letsId: ROOT_ACCOUNT_ID,
        password: ROOT_DEFAULT_PASSWORD,
        teamName: "ADMIN",
        displayName: "Root Admin",
        isAdmin: true,
        createdAt: now,
        lastLoginAt: now,
        progress: { completedClipKeys: [] },
        axTasks: {},
        notes: {}
      },
      now
    );
    db.users.push(rootUser);
  } else {
    rootUser.isAdmin = true;
    rootUser.teamName = cleanTeamName(rootUser.teamName || "ADMIN");
    if (!rootUser.password) {
      rootUser.password = ROOT_DEFAULT_PASSWORD;
    }
  }

  await writeDb(db);
}

function clipKeyFromRoute(route) {
  return String(route || "").replace(/^#/, "").trim().toLowerCase();
}

function chapterCodeFromId(chapterId) {
  return String(chapterId || "").toUpperCase();
}

function chapterIndexFromId(chapterId) {
  const match = String(chapterId || "")
    .trim()
    .toLowerCase()
    .match(/^ch(\d{2})$/);
  return match ? Number(match[1]) : null;
}

function formatChapterId(index) {
  return `ch${String(Math.max(0, Number(index) || 0)).padStart(2, "0")}`;
}

function formatChapterNum(index) {
  return `CH ${String(Math.max(0, Number(index) || 0)).padStart(2, "0")}`;
}

function clipSuffixFromKey(clipKey) {
  const match = String(clipKey || "").toLowerCase().match(/-clip\d{2}$/);
  return match ? match[0] : "";
}

function toVisibleClipKey(catalog, clipKey) {
  const normalized = normalizeWs(clipKey).toLowerCase();
  if (!normalized) return "";
  return catalog?.visibleClipKeyByCanonicalKey?.get(normalized) || normalized;
}

function toCanonicalClipKey(catalog, clipKey) {
  const normalized = normalizeWs(clipKey).toLowerCase();
  if (!normalized) return "";
  const clip = catalog?.clipsByKey?.get(normalized);
  return clip?.canonicalClipKey || normalized;
}

function toVisibleChapterId(catalog, chapterId) {
  const normalized = normalizeWs(chapterId).toLowerCase();
  if (!normalized) return "";
  return catalog?.visibleChapterIdByCanonicalId?.get(normalized) || normalized;
}

function toCanonicalChapterId(catalog, chapterId) {
  const normalized = normalizeWs(chapterId).toLowerCase();
  if (!normalized) return "";
  return catalog?.canonicalChapterIdByVisibleId?.get(normalized) || normalized;
}

function toVisibleCompletedClipKeys(catalog, clipKeys) {
  const output = [];
  const seen = new Set();

  for (const key of Array.isArray(clipKeys) ? clipKeys : []) {
    const visibleKey = toVisibleClipKey(catalog, key);
    if (!visibleKey || seen.has(visibleKey)) continue;
    seen.add(visibleKey);
    output.push(visibleKey);
  }

  return output;
}

async function readJsonFileSafe(filePath, fallback) {
  try {
    const text = await fs.readFile(filePath, "utf8");
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

async function readFileSafe(filePath, fallback = "") {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return fallback;
  }
}

function rewriteRelativeUrls(html, courseCode, clipKey) {
  if (!html) return "";
  return html.replace(
    /(src|href)=["'](?!https?:|mailto:|tel:|#|data:|\/\/)([^"']+)["']/gi,
    (_match, attr, rawPath) => {
      const raw = String(rawPath || "").trim();
      // Keep absolute/site-root URLs untouched (e.g. /practice-files/..., /api/...).
      if (
        /^(\/|https?:|mailto:|tel:|#|data:|\/\/|javascript:)/i.test(raw)
      ) {
        return `${attr}="${raw}"`;
      }

      const safePath = String(rawPath || "")
        .replace(/\\/g, "/")
        .replace(/^\.\//, "")
        .replace(/^\/+/, "");
      return `${attr}="/course-files/${encodeURIComponent(normalizeCourseCode(courseCode || DEFAULT_COURSE_CODE))}/${encodeURIComponent(clipKey)}/${safePath}"`;
    }
  );
}

function rewritePracticeDriveUrls(html) {
  const source = String(html || "");
  if (!source) return source;

  const fileLikeRe =
    /href=["']https?:\/\/drive\.google\.com\/(?:file\/d|drive\/folders)\/([A-Za-z0-9_-]+)[^"']*["']/gi;
  const openRe =
    /href=["']https?:\/\/drive\.google\.com\/open\?id=([A-Za-z0-9_-]+)[^"']*["']/gi;

  const swap = (_match, id) => {
    const key = normalizeWs(id);
    if (!PRACTICE_FILE_MAP[key]) return _match;
    return `href="/practice-files/${encodeURIComponent(key)}"`;
  };

  return source.replace(fileLikeRe, swap).replace(openRe, swap);
}

function rewriteVisibleReferences(input, catalog) {
  let output = String(input || "");
  if (!output || !catalog) return output;

  output = output.replace(/#(ch\d{2}-clip\d{2})/gi, (_match, rawKey) => {
    const mapped = toVisibleClipKey(catalog, rawKey);
    return mapped ? `#${mapped}` : `#${rawKey}`;
  });

  for (const [canonicalChapterId, visibleChapterId] of catalog.visibleChapterIdByCanonicalId || []) {
    if (!canonicalChapterId || !visibleChapterId || canonicalChapterId === visibleChapterId) {
      continue;
    }

    const canonicalIndex = chapterIndexFromId(canonicalChapterId);
    const visibleIndex = chapterIndexFromId(visibleChapterId);
    if (canonicalIndex == null || visibleIndex == null) continue;

    const canonicalPadded = String(canonicalIndex).padStart(2, "0");
    const visiblePadded = String(visibleIndex).padStart(2, "0");

    output = output.replace(
      new RegExp(`\\bCH\\s+${canonicalPadded}\\b`, "g"),
      `CH ${visiblePadded}`
    );
    output = output.replace(
      new RegExp(`\\bCH${canonicalPadded}\\b`, "g"),
      `CH${visiblePadded}`
    );
  }

  return output;
}

function rewriteMetadataLinks(links, catalog) {
  if (!Array.isArray(links)) return [];

  return links.map((link) => ({
    ...link,
    href: rewriteVisibleReferences(link.href || "", catalog),
    absolute: rewriteVisibleReferences(link.absolute || "", catalog),
    text: rewriteVisibleReferences(link.text || "", catalog)
  }));
}

function escapeHtml(input) {
  return String(input || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function makeAttachmentHeader(fileName) {
  const fallback = String(fileName || "download")
    .replace(/[^\x20-\x7E]/g, "_")
    .replace(/"/g, "");
  const encoded = encodeURIComponent(String(fileName || "download"));
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

async function loadCourseDirectory() {
  const defaultCourse = defaultCourseContext();
  const generated = [];
  const raw = await readJsonFileSafe(GENERATED_COURSE_CATALOG_FILE, []);
  const entries = Array.isArray(raw) ? raw : [];

  for (const item of entries) {
    const slug = normalizeWs(item.slug || "").toLowerCase();
    const courseCode = normalizeCourseCode(item.courseCode || "");
    if (!slug || !courseCode) continue;
    const sourceRoot = path.resolve(GENERATED_COURSES_DIR, slug);
    if (!fsSync.existsSync(path.join(sourceRoot, "export-report.json"))) continue;
    generated.push({
      courseCode,
      slug,
      courseName: normalizeWs(item.courseName || item.name || slug),
      sourceRoot,
      launchUrl: normalizeWs(item.launchUrl || `/?course=${encodeURIComponent(courseCode)}`)
    });
  }

  const courses = [defaultCourse];
  const byCode = new Map([[defaultCourse.courseCode, defaultCourse]]);
  const bySlug = new Map([[defaultCourse.slug, defaultCourse]]);

  for (const course of generated) {
    if (byCode.has(course.courseCode) || bySlug.has(course.slug)) continue;
    byCode.set(course.courseCode, course);
    bySlug.set(course.slug, course);
    courses.push(course);
  }

  return { courses, byCode, bySlug };
}

async function resolveCourseContext(primary, secondary = "") {
  const dir = await loadCourseDirectory();
  const code = normalizeCourseCode(primary || secondary || "");
  if (code && dir.byCode.has(code)) return dir.byCode.get(code);
  const slug = normalizeWs(primary || secondary || "").toLowerCase();
  if (slug && dir.bySlug.has(slug)) return dir.bySlug.get(slug);
  return dir.byCode.get(DEFAULT_COURSE_CODE) || defaultCourseContext();
}

async function buildCatalog(sourceRoot) {
  const reportFile = path.join(sourceRoot, "export-report.json");
  const report = await readJsonFileSafe(reportFile, null);
  if (!report || !Array.isArray(report.chapters)) {
    throw new Error(`Cannot load chapter catalog: ${reportFile}`);
  }

  const chapters = [];
  const clipsByKey = new Map();
  const visibleChapterIdByCanonicalId = new Map();
  const canonicalChapterIdByVisibleId = new Map();
  const visibleClipKeyByCanonicalKey = new Map();

  for (const chapter of report.chapters) {
    const canonicalChapterId = normalizeWs(chapter.chapterId).toLowerCase();
    const chapterObj = {
      chapterId: canonicalChapterId,
      canonicalChapterId,
      chapterCode: chapterCodeFromId(canonicalChapterId),
      chapterNum: normalizeWs(chapter.chapterNum),
      title: normalizeWs(chapter.title),
      time: normalizeWs(chapter.time),
      clips: [],
      clipObjects: []
    };

    for (const clip of chapter.clips || []) {
      const clipKey = clipKeyFromRoute(clip.route);
      if (!clipKey) continue;
      if (EXCLUDED_CLIP_KEYS.has(clipKey)) continue;
      const absoluteClipDir = path.resolve(sourceRoot, clip.folder || "");
      const metadataPath = path.join(absoluteClipDir, "metadata.json");
      const metadata = await readJsonFileSafe(metadataPath, null);

      const cleanTitle = deriveClipTitle(
        metadata,
        metadata?.clipTitle || clip.title || clipKey
      );

      const clipObj = {
        clipKey,
        canonicalClipKey: clipKey,
        route: clip.route,
        canonicalRoute: clip.route,
        title: cleanTitle,
        type: normalizeWs(clip.type),
        chapterId: canonicalChapterId,
        canonicalChapterId,
        chapterCode: chapterCodeFromId(canonicalChapterId),
        chapterNum: normalizeWs(chapter.chapterNum),
        chapterTitle: normalizeWs(chapter.title),
        overview: normalizeWs(metadata?.overview || ""),
        badges: Array.isArray(metadata?.badges) ? metadata.badges : [],
        folderRelative: clip.folder || "",
        folderAbsolute: absoluteClipDir,
        metadataPath,
        screenshotPath: path.join(absoluteClipDir, "screenshot.png")
      };
      chapterObj.clipObjects.push(clipObj);
    }

    if (chapterObj.clipObjects.length) {
      chapters.push(chapterObj);
    }
  }

  chapters.forEach((chapter, chapterIndex) => {
    const visibleChapterId = formatChapterId(chapterIndex);
    const visibleChapterNum = formatChapterNum(chapterIndex);

    visibleChapterIdByCanonicalId.set(chapter.canonicalChapterId, visibleChapterId);
    canonicalChapterIdByVisibleId.set(visibleChapterId, chapter.canonicalChapterId);

    chapter.chapterId = visibleChapterId;
    chapter.chapterCode = chapterCodeFromId(visibleChapterId);
    chapter.chapterNum = visibleChapterNum;
    chapter.clips = chapter.clipObjects.map((clipObj) => {
      const clipSuffix = clipSuffixFromKey(clipObj.canonicalClipKey);
      const visibleClipKey = clipSuffix
        ? `${visibleChapterId}${clipSuffix}`
        : clipObj.canonicalClipKey;

      visibleClipKeyByCanonicalKey.set(clipObj.canonicalClipKey, visibleClipKey);

      clipObj.clipKey = visibleClipKey;
      clipObj.route = `#${visibleClipKey}`;
      clipObj.chapterId = visibleChapterId;
      clipObj.chapterCode = chapter.chapterCode;
      clipObj.chapterNum = visibleChapterNum;

      clipsByKey.set(visibleClipKey, clipObj);
      if (visibleClipKey !== clipObj.canonicalClipKey) {
        clipsByKey.set(clipObj.canonicalClipKey, clipObj);
      }

      return {
        clipKey: clipObj.clipKey,
        canonicalClipKey: clipObj.canonicalClipKey,
        route: clipObj.route,
        title: clipObj.title,
        type: clipObj.type
      };
    });
    delete chapter.clipObjects;
  });

  return {
    chapters,
    clipsByKey,
    visibleChapterIdByCanonicalId,
    canonicalChapterIdByVisibleId,
    visibleClipKeyByCanonicalKey
  };
}

async function readCatalogVersion(sourceRoot) {
  const reportFile = path.join(sourceRoot, "export-report.json");
  try {
    const stat = await fs.stat(reportFile);
    return `${stat.mtimeMs}:${stat.size}`;
  } catch {
    return "missing";
  }
}

async function getCatalog(courseContext) {
  const context = courseContext || defaultCourseContext();
  const key = path.resolve(context.sourceRoot || SOURCE_ROOT);
  const version = await readCatalogVersion(key);
  const cached = catalogPromises.get(key);

  if (!cached || cached.version !== version) {
    let promise = buildCatalog(key);
    promise = promise.catch((error) => {
      const latest = catalogPromises.get(key);
      if (latest && latest.promise === promise) {
        catalogPromises.delete(key);
      }
      throw error;
    });
    catalogPromises.set(key, { version, promise });
  }

  return catalogPromises.get(key).promise;
}

async function resolveUserFromRequest(req, urlObj) {
  const token = normalizeWs(
    req.headers["x-session-token"] || urlObj.searchParams.get("sessionToken")
  );
  const accountId = cleanAccountId(
    req.headers["x-account-id"] || urlObj.searchParams.get("accountId")
  );

  const db = await readDb();

  if (token) {
    const byToken = db.users.find((item) => item.sessionToken === token) || null;
    if (byToken) return byToken;
  }

  if (accountId) {
    return db.users.find((item) => item.accountId === accountId) || null;
  }

  return null;
}

async function resolveActiveCourse(user, urlObj) {
  const requested = normalizeCourseCode(urlObj?.searchParams?.get("course"));
  const primary = requested || normalizeCourseCode(user?.courseCode || "");
  const secondary = normalizeWs(user?.courseSlug || "");
  return resolveCourseContext(primary, secondary);
}

async function readRequestJson(req) {
  const chunks = [];
  let total = 0;

  for await (const chunk of req) {
    total += chunk.length;
    if (total > 1_000_000) {
      throw new Error("Request body too large");
    }
    chunks.push(chunk);
  }

  const text = Buffer.concat(chunks).toString("utf8");
  if (!text.trim()) return {};
  return JSON.parse(text);
}

async function handleSignup(req, res) {
  const payload = await readRequestJson(req);
  const accountId = cleanAccountId(payload.accountId);
  const letsId = cleanAccountId(payload.letsId || accountId);
  const password = String(payload.password || "");
  const teamName = cleanTeamName(payload.teamName);
  const displayName = normalizeWs(payload.displayName || accountId);
  const requestedCourseCode = normalizeCourseCode(payload.courseCode || "");

  if (!ACCOUNT_ID_REGEX.test(accountId)) {
    return sendJson(res, 400, {
      ok: false,
      error:
        "Let's ID는 2~32자, 문자/숫자/._- 조합으로 입력해 주세요. (예: leader01)"
    });
  }

  if (password.length < 2 || password.length > 64) {
    return sendJson(res, 400, {
      ok: false,
      error: "비밀번호는 2~64자로 입력해 주세요."
    });
  }

  if (!teamName) {
    return sendJson(res, 400, {
      ok: false,
      error: "소속 팀명을 입력해 주세요."
    });
  }

  if (!displayName) {
    return sendJson(res, 400, {
      ok: false,
      error: "표시이름을 입력해 주세요."
    });
  }

  const course = await resolveCourseContext(requestedCourseCode || DEFAULT_COURSE_CODE);
  if (requestedCourseCode && course.courseCode !== requestedCourseCode) {
    return sendJson(res, 400, {
      ok: false,
      error: "유효하지 않은 교육과정 코드입니다."
    });
  }

  const db = await readDb();
  const exists = db.users.some((item) => item.accountId === accountId);
  if (exists) {
    return sendJson(res, 409, {
      ok: false,
      error: "이미 존재하는 Let's ID입니다."
    });
  }

  const now = new Date().toISOString();
  const sessionToken = generateSessionToken();
  const user = ensureUserShape({
    accountId,
    letsId,
    password,
    teamName,
    displayName,
    courseCode: course.courseCode,
    courseSlug: course.slug,
    createdAt: now,
    lastLoginAt: now,
    sessionToken,
    progress: { completedClipKeys: [] },
    axTasks: {},
    notes: {}
  });

  db.users.push(user);
  await writeDb(db);

  return sendJson(res, 200, {
    ok: true,
    user: toUserResponse(user),
    course: toCourseResponse(course),
    sessionToken,
    progress: user.progress,
    axTasks: user.axTasks || {},
    notes: user.notes || {}
  });
}

async function handleLogin(req, res) {
  const payload = await readRequestJson(req);
  const accountId = cleanAccountId(payload.accountId);
  const password = String(payload.password || "");
  const requestedCourseCode = normalizeCourseCode(payload.courseCode || "");

  if (!ACCOUNT_ID_REGEX.test(accountId)) {
    return sendJson(res, 400, {
      ok: false,
      error:
        "Let's ID는 2~32자, 문자/숫자/._- 조합으로 입력해 주세요. (예: leader01)"
    });
  }

  if (!password) {
    return sendJson(res, 400, {
      ok: false,
      error: "비밀번호를 입력해 주세요."
    });
  }

  const db = await readDb();
  const user = db.users.find((item) => item.accountId === accountId);

  if (!user) {
    return sendJson(res, 404, {
      ok: false,
      error: "존재하지 않는 Let's ID입니다."
    });
  }

  if (user.password !== password) {
    return sendJson(res, 401, {
      ok: false,
      error: "비밀번호가 올바르지 않습니다."
    });
  }

  const currentCourse = await resolveCourseContext(user.courseCode, user.courseSlug);
  if (requestedCourseCode) {
    const requested = await resolveCourseContext(requestedCourseCode);
    if (requested.courseCode !== requestedCourseCode) {
      return sendJson(res, 400, {
        ok: false,
        error: "유효하지 않은 교육과정 코드입니다."
      });
    }
    user.courseCode = requested.courseCode;
    user.courseSlug = requested.slug;
  } else {
    user.courseCode = currentCourse.courseCode;
    user.courseSlug = currentCourse.slug;
  }
  const activeCourse = await resolveCourseContext(user.courseCode, user.courseSlug);

  user.lastLoginAt = new Date().toISOString();
  user.sessionToken = generateSessionToken();
  await writeDb(db);

  return sendJson(res, 200, {
    ok: true,
    user: toUserResponse(user),
    course: toCourseResponse(activeCourse),
    sessionToken: user.sessionToken,
    progress: user.progress,
    axTasks: user.axTasks || {},
    notes: user.notes || {}
  });
}

async function handleLogout(req, res, urlObj) {
  const user = await resolveUserFromRequest(req, urlObj);
  if (!user) {
    return sendJson(res, 200, { ok: true });
  }

  const db = await readDb();
  const dbUser = db.users.find((item) => item.accountId === user.accountId);
  if (dbUser) {
    dbUser.sessionToken = "";
    await writeDb(db);
  }

  return sendJson(res, 200, { ok: true });
}

async function handlePasswordHint(req, res) {
  const payload = await readRequestJson(req);
  const accountId = cleanAccountId(payload.accountId);

  if (!accountId) {
    return sendJson(res, 400, {
      ok: false,
      error: "Let's ID를 입력해 주세요."
    });
  }

  const db = await readDb();
  const user = db.users.find((item) => item.accountId === accountId);
  if (!user) {
    return sendJson(res, 404, {
      ok: false,
      error: "존재하지 않는 Let's ID입니다."
    });
  }

  return sendJson(res, 200, {
    ok: true,
    letsId: user.letsId || user.accountId,
    hint: maskPasswordHint(user.password)
  });
}

async function handlePasswordRecover(req, res) {
  const payload = await readRequestJson(req);
  const accountId = cleanAccountId(payload.accountId);
  const teamName = cleanTeamName(payload.teamName);

  if (!accountId || !teamName) {
    return sendJson(res, 400, {
      ok: false,
      error: "Let's ID와 소속 팀명을 모두 입력해 주세요."
    });
  }

  const db = await readDb();
  const user = db.users.find((item) => item.accountId === accountId);
  if (!user) {
    return sendJson(res, 404, {
      ok: false,
      error: "존재하지 않는 Let's ID입니다."
    });
  }

  if (cleanTeamName(user.teamName) !== teamName) {
    return sendJson(res, 401, {
      ok: false,
      error: "소속 팀명이 일치하지 않습니다."
    });
  }

  return sendJson(res, 200, {
    ok: true,
    letsId: user.letsId || user.accountId,
    password: user.password
  });
}

async function handleAccountUpdate(req, res, urlObj) {
  const currentUser = await resolveUserFromRequest(req, urlObj);
  if (!currentUser) {
    return sendJson(res, 401, { ok: false, error: "로그인이 필요합니다." });
  }

  const payload = await readRequestJson(req);
  const nextAccountId = cleanAccountId(
    payload.accountId || payload.letsId || currentUser.accountId
  );
  const displayName = normalizeWs(payload.displayName || "");
  const teamName = cleanTeamName(payload.teamName || "");
  const currentPassword = String(payload.currentPassword || "");
  const newPassword = String(payload.newPassword || "");

  if (!currentPassword) {
    return sendJson(res, 400, {
      ok: false,
      error: "현재 비밀번호를 입력해 주세요."
    });
  }

  if (!ACCOUNT_ID_REGEX.test(nextAccountId)) {
    return sendJson(res, 400, {
      ok: false,
      error:
        "Let's ID는 2~32자, 문자/숫자/._- 조합으로 입력해 주세요. (예: leader01)"
    });
  }

  if (!displayName) {
    return sendJson(res, 400, {
      ok: false,
      error: "표시이름을 입력해 주세요."
    });
  }

  if (!teamName) {
    return sendJson(res, 400, {
      ok: false,
      error: "소속 팀명을 입력해 주세요."
    });
  }

  if (newPassword && (newPassword.length < 2 || newPassword.length > 64)) {
    return sendJson(res, 400, {
      ok: false,
      error: "새 비밀번호는 2~64자로 입력해 주세요."
    });
  }

  const db = await readDb();
  const dbUser = db.users.find((item) => item.accountId === currentUser.accountId);
  if (!dbUser) {
    return sendJson(res, 404, { ok: false, error: "사용자를 찾을 수 없습니다." });
  }

  if (dbUser.password !== currentPassword) {
    return sendJson(res, 401, {
      ok: false,
      error: "현재 비밀번호가 올바르지 않습니다."
    });
  }

  if (dbUser.accountId !== nextAccountId) {
    const duplicate = db.users.some((item) => item.accountId === nextAccountId);
    if (duplicate) {
      return sendJson(res, 409, {
        ok: false,
        error: "이미 사용 중인 Let's ID입니다."
      });
    }
  }

  dbUser.accountId = nextAccountId;
  dbUser.letsId = nextAccountId;
  dbUser.displayName = displayName;
  dbUser.teamName = teamName;

  if (newPassword) {
    dbUser.password = newPassword;
  }

  if (String(dbUser.accountId).toLowerCase() === ROOT_ACCOUNT_ID) {
    dbUser.isAdmin = true;
  }

  dbUser.sessionToken = generateSessionToken();
  dbUser.lastLoginAt = new Date().toISOString();

  await writeDb(db);

  return sendJson(res, 200, {
    ok: true,
    user: toUserResponse(dbUser),
    sessionToken: dbUser.sessionToken,
    progress: dbUser.progress || { completedClipKeys: [] },
    axTasks: dbUser.axTasks || {},
    notes: dbUser.notes || {}
  });
}

async function handleGetMe(req, res, urlObj) {
  const user = await resolveUserFromRequest(req, urlObj);
  if (!user) {
    return sendJson(res, 401, { ok: false, error: "로그인이 필요합니다." });
  }
  const course = await resolveActiveCourse(user, urlObj);

  return sendJson(res, 200, {
    ok: true,
    user: toUserResponse(user),
    course: toCourseResponse(course),
    sessionToken: user.sessionToken || "",
    progress: user.progress || { completedClipKeys: [] },
    axTasks: user.axTasks || {},
    notes: user.notes || {}
  });
}

async function handleGetCourses(_req, res) {
  const directory = await loadCourseDirectory();
  return sendJson(res, 200, {
    ok: true,
    courses: directory.courses.map((course) => toCourseResponse(course))
  });
}

async function handleGetChapters(req, res, urlObj) {
  const user = await resolveUserFromRequest(req, urlObj);
  const course = await resolveActiveCourse(user, urlObj);
  const catalog = await getCatalog(course);
  const { chapters } = catalog;
  const completed = new Set(user?.progress?.completedClipKeys || []);

  const enriched = chapters.map((chapter) => ({
    chapterId: chapter.chapterId,
    chapterCode: chapter.chapterCode,
    chapterNum: chapter.chapterNum,
    title: chapter.title,
    time: chapter.time,
    clips: chapter.clips.map((clip) => ({
      clipKey: clip.clipKey,
      route: clip.route,
      title: clip.title,
      type: clip.type,
      completed:
        completed.has(clip.canonicalClipKey) || completed.has(clip.clipKey)
    }))
  }));

  return sendJson(res, 200, {
    ok: true,
    course: toCourseResponse(course),
    chapters: enriched
  });
}

async function resolveClipPayload(clipKey, course) {
  const activeCourse = course || defaultCourseContext();
  const catalog = await getCatalog(activeCourse);
  const normalizedClipKey = normalizeWs(clipKey).toLowerCase();
  const clip = catalog.clipsByKey.get(normalizedClipKey);
  if (!clip) return null;

  const metadata = await readJsonFileSafe(clip.metadataPath, {});
  const htmlPath = path.join(clip.folderAbsolute, "content.html");
  const mdPath = path.join(clip.folderAbsolute, "content.md");
  const txtPath = path.join(clip.folderAbsolute, "content.txt");

  const htmlRaw = await readFileSafe(htmlPath, "");
  const mdRaw = await readFileSafe(mdPath, "");
  const txtRaw = await readFileSafe(txtPath, "");

  const htmlContent = htmlRaw
    ? rewriteVisibleReferences(
        rewritePracticeDriveUrls(
          rewriteRelativeUrls(htmlRaw, activeCourse.courseCode, clip.clipKey)
        ),
        catalog
      )
    : `<pre>${escapeHtml(mdRaw || txtRaw || "콘텐츠가 없습니다.")}</pre>`;
  const baseBadges =
    clip.badges?.length ? clip.badges : Array.isArray(metadata?.badges) ? metadata.badges : [];
  const badges = baseBadges.map((badge) => rewriteVisibleReferences(badge, catalog));

  const screenshotRelative = (await pathExists(clip.screenshotPath))
    ? `/course-files/${encodeURIComponent(activeCourse.courseCode)}/${encodeURIComponent(clip.clipKey)}/screenshot.png`
    : null;

  return {
    clipKey: clip.clipKey,
    canonicalClipKey: clip.canonicalClipKey,
    route: clip.route,
    title: clip.title,
    type: clip.type,
    chapterId: clip.chapterId,
    chapterCode: clip.chapterCode,
    chapterNum: clip.chapterNum,
    chapterTitle: clip.chapterTitle,
    overview: rewriteVisibleReferences(
      clip.overview || normalizeWs(metadata?.overview || ""),
      catalog
    ),
    badges,
    links: rewriteMetadataLinks(metadata?.links, catalog),
    prompts: Array.isArray(metadata?.prompts) ? metadata.prompts : [],
    sections: Array.isArray(metadata?.sections) ? metadata.sections : [],
    screenshot: screenshotRelative,
    contentHtml: htmlContent
  };
}

async function handleGetClip(req, res, urlObj) {
  const pathnameParts = urlObj.pathname.split("/").filter(Boolean);
  const clipKey = pathnameParts[pathnameParts.length - 1];
  const user = await resolveUserFromRequest(req, urlObj);
  const course = await resolveActiveCourse(user, urlObj);
  const payload = await resolveClipPayload(clipKey, course);

  if (!payload) {
    return sendJson(res, 404, { ok: false, error: "클립을 찾을 수 없습니다." });
  }

  const completedSet = new Set(user?.progress?.completedClipKeys || []);

  return sendJson(res, 200, {
    ok: true,
    course: toCourseResponse(course),
    clip: payload,
    completed:
      completedSet.has(payload.canonicalClipKey) ||
      completedSet.has(payload.clipKey)
  });
}

async function handleProgress(req, res, urlObj) {
  const user = await resolveUserFromRequest(req, urlObj);
  if (!user) {
    return sendJson(res, 401, { ok: false, error: "로그인이 필요합니다." });
  }
  const course = await resolveActiveCourse(user, urlObj);
  const catalog = await getCatalog(course);

  if (req.method === "GET") {
    return sendJson(res, 200, {
      ok: true,
      completedClipKeys: toVisibleCompletedClipKeys(
        catalog,
        user.progress?.completedClipKeys || []
      )
    });
  }

  const payload = await readRequestJson(req);
  const clipKey = normalizeWs(payload.clipKey).toLowerCase();
  const completed = Boolean(payload.completed);

  if (!clipKey) {
    return sendJson(res, 400, { ok: false, error: "clipKey가 필요합니다." });
  }

  const clip = catalog.clipsByKey.get(clipKey);
  if (!clip) {
    return sendJson(res, 400, { ok: false, error: "유효하지 않은 clipKey입니다." });
  }

  const db = await readDb();
  const dbUser = db.users.find((item) => item.accountId === user.accountId);
  if (!dbUser) {
    return sendJson(res, 404, { ok: false, error: "사용자를 찾을 수 없습니다." });
  }

  if (!dbUser.progress || !Array.isArray(dbUser.progress.completedClipKeys)) {
    dbUser.progress = { completedClipKeys: [] };
  }

  const set = new Set(dbUser.progress.completedClipKeys);
  const storedClipKey = clip.canonicalClipKey || clip.clipKey;
  if (completed) {
    set.add(storedClipKey);
  } else {
    set.delete(storedClipKey);
    set.delete(clip.clipKey);
  }
  dbUser.progress.completedClipKeys = [...set];

  await writeDb(db);

  return sendJson(res, 200, {
    ok: true,
    completedClipKeys: toVisibleCompletedClipKeys(
      catalog,
      dbUser.progress.completedClipKeys
    )
  });
}

async function handleAxTask(req, res, urlObj) {
  const user = await resolveUserFromRequest(req, urlObj);
  if (!user) {
    return sendJson(res, 401, { ok: false, error: "로그인이 필요합니다." });
  }

  const requestedChapterId = normalizeWs(urlObj.searchParams.get("chapterId")).toLowerCase();
  const course = await resolveActiveCourse(user, urlObj);
  const catalog = await getCatalog(course);
  const { chapters } = catalog;
  const chapterId = toCanonicalChapterId(catalog, requestedChapterId);
  const chapterIds = new Set(chapters.map((item) => String(item.chapterId || "").toLowerCase()));
  const canonicalChapterIds = new Set(
    chapters.map((item) => String(item.canonicalChapterId || "").toLowerCase())
  );

  const getUserTasks = () => {
    if (!user.axTasks || typeof user.axTasks !== "object") {
      return {};
    }
    return user.axTasks;
  };

  if (req.method === "GET") {
    const axTasks = getUserTasks();
    if (!chapterId) {
      return sendJson(res, 200, {
        ok: true,
        axTasks
      });
    }

    if (!canonicalChapterIds.has(chapterId) && !chapterIds.has(requestedChapterId)) {
      return sendJson(res, 400, {
        ok: false,
        error: "유효하지 않은 chapterId입니다."
      });
    }

    const visibleChapterId = toVisibleChapterId(catalog, chapterId);
    const task = axTasks[chapterId] || axTasks[visibleChapterId] || null;

    return sendJson(res, 200, {
      ok: true,
      chapterId: visibleChapterId,
      axTask: task
        ? {
            ...task,
            chapterId: visibleChapterId
          }
        : null
    });
  }

  const payload = await readRequestJson(req);
  const title = normalizeWs(payload.title);
  const reason = normalizeWs(payload.reason);
  const effect = normalizeWs(payload.effect);

  if (!chapterId || !canonicalChapterIds.has(chapterId)) {
    return sendJson(res, 400, {
      ok: false,
      error: "chapterId가 필요하며 유효해야 합니다."
    });
  }

  if (!title || !reason || !effect) {
    return sendJson(res, 400, {
      ok: false,
      error: "과제명/선정 이유/기대효과를 모두 입력해 주세요."
    });
  }

  const db = await readDb();
  const dbUser = db.users.find((item) => item.accountId === user.accountId);
  if (!dbUser) {
    return sendJson(res, 404, { ok: false, error: "사용자를 찾을 수 없습니다." });
  }

  if (!dbUser.axTasks || typeof dbUser.axTasks !== "object") {
    dbUser.axTasks = {};
  }

  const now = new Date().toISOString();
  const previous = dbUser.axTasks[chapterId] || null;
  const hadSubmission = Boolean(previous?.submittedAt);

  dbUser.axTasks[chapterId] = {
    chapterId,
    title,
    reason,
    effect,
    submittedAt: hadSubmission ? previous.submittedAt : now,
    updatedAt: now
  };

  await writeDb(db);

  return sendJson(res, 200, {
    ok: true,
    chapterId: toVisibleChapterId(catalog, chapterId),
    axTask: {
      ...dbUser.axTasks[chapterId],
      chapterId: toVisibleChapterId(catalog, chapterId)
    }
  });
}

async function handleNotes(req, res, urlObj) {
  const user = await resolveUserFromRequest(req, urlObj);
  if (!user) {
    return sendJson(res, 401, { ok: false, error: "로그인이 필요합니다." });
  }
  const course = await resolveActiveCourse(user, urlObj);

  const catalog = await getCatalog(course);
  const clipKey = normalizeWs(urlObj.searchParams.get("clipKey")).toLowerCase();
  if (!clipKey) {
    return sendJson(res, 400, {
      ok: false,
      error: "clipKey가 필요합니다."
    });
  }

  const clip = catalog.clipsByKey.get(clipKey);
  if (!clip) {
    return sendJson(res, 400, {
      ok: false,
      error: "유효하지 않은 clipKey입니다."
    });
  }

  const storedClipKey = clip.canonicalClipKey || clip.clipKey;
  const publicClipKey = clip.clipKey;

  if (req.method === "GET") {
    const note =
      user.notes?.[storedClipKey] ||
      user.notes?.[publicClipKey] || {
        clipKey: publicClipKey,
        content: "",
        updatedAt: null
      };
    return sendJson(res, 200, { ok: true, note });
  }

  const payload = await readRequestJson(req);
  const contentRaw = String(payload.content || "");
  if (contentRaw.length > 20000) {
    return sendJson(res, 400, {
      ok: false,
      error: "노트는 20,000자 이하로 입력해 주세요."
    });
  }

  const db = await readDb();
  const dbUser = db.users.find((item) => item.accountId === user.accountId);
  if (!dbUser) {
    return sendJson(res, 404, { ok: false, error: "사용자를 찾을 수 없습니다." });
  }

  if (!dbUser.notes || typeof dbUser.notes !== "object") {
    dbUser.notes = {};
  }

  dbUser.notes[storedClipKey] = {
    clipKey: storedClipKey,
    content: contentRaw,
    updatedAt: new Date().toISOString()
  };

  await writeDb(db);

  return sendJson(res, 200, {
    ok: true,
    note: {
      ...dbUser.notes[storedClipKey],
      clipKey: publicClipKey
    }
  });
}

async function handleAdminUsers(req, res, urlObj) {
  const currentUser = await resolveUserFromRequest(req, urlObj);
  if (!currentUser) {
    return sendJson(res, 401, { ok: false, error: "로그인이 필요합니다." });
  }

  if (!currentUser.isAdmin) {
    return sendJson(res, 403, { ok: false, error: "관리자 권한이 필요합니다." });
  }

  const db = await readDb();
  const users = db.users
    .map((item) => {
      const completed = item.progress?.completedClipKeys || [];
      const noteCount = Object.keys(item.notes || {}).length;
      const taskCount = Object.keys(item.axTasks || {}).length;
      return {
        letsId: item.letsId || item.accountId,
        accountId: item.accountId,
        displayName: item.displayName,
        teamName: item.teamName,
        password: item.password,
        isAdmin: Boolean(item.isAdmin),
        createdAt: item.createdAt,
        lastLoginAt: item.lastLoginAt,
        completedCount: completed.length,
        taskCount,
        noteCount
      };
    })
    .sort((a, b) => {
      if (a.isAdmin && !b.isAdmin) return -1;
      if (!a.isAdmin && b.isAdmin) return 1;
      return String(a.accountId).localeCompare(String(b.accountId));
    });

  return sendJson(res, 200, {
    ok: true,
    users
  });
}

async function handleBuilderState(req, res, urlObj) {
  const currentUser = await resolveUserFromRequest(req, urlObj);
  if (!currentUser) {
    return sendJson(res, 401, { ok: false, error: "로그인이 필요합니다." });
  }

  const db = await readDb();
  const dbUser = db.users.find((item) => item.accountId === currentUser.accountId);
  if (!dbUser) {
    return sendJson(res, 404, { ok: false, error: "사용자를 찾을 수 없습니다." });
  }

  dbUser.builder = ensureBuilderShape(dbUser.builder);

  if (req.method === "GET") {
    return sendJson(res, 200, {
      ok: true,
      builder: dbUser.builder
    });
  }

  const payload = await readRequestJson(req);
  if (!payload.builder || typeof payload.builder !== "object") {
    return sendJson(res, 400, {
      ok: false,
      error: "builder 데이터가 필요합니다."
    });
  }

  dbUser.builder = ensureBuilderShape(payload.builder);
  await writeDb(db);

  return sendJson(res, 200, {
    ok: true,
    builder: dbUser.builder
  });
}

async function handleBuilderProjectFromTemplate(req, res, urlObj) {
  const currentUser = await resolveUserFromRequest(req, urlObj);
  if (!currentUser) {
    return sendJson(res, 401, { ok: false, error: "로그인이 필요합니다." });
  }

  const payload = await readRequestJson(req);
  const template = normalizeWs(payload.template || "ax-camp");
  const projectName = normalizeWs(payload.name || "");

  const db = await readDb();
  const dbUser = db.users.find((item) => item.accountId === currentUser.accountId);
  if (!dbUser) {
    return sendJson(res, 404, { ok: false, error: "사용자를 찾을 수 없습니다." });
  }

  const builder = ensureBuilderShape(dbUser.builder);
  const project = createProjectFromTemplate(template, projectName);
  builder.projects = [...builder.projects, project].slice(0, 20);
  builder.activeProjectId = project.projectId;
  dbUser.builder = ensureBuilderShape(builder);
  await writeDb(db);

  return sendJson(res, 200, {
    ok: true,
    project,
    builder: dbUser.builder
  });
}

async function handleBuilderExport(req, res, urlObj) {
  const currentUser = await resolveUserFromRequest(req, urlObj);
  if (!currentUser) {
    return sendJson(res, 401, { ok: false, error: "로그인이 필요합니다." });
  }

  const projectId = normalizeWs(urlObj.searchParams.get("projectId"));
  if (!projectId) {
    return sendJson(res, 400, {
      ok: false,
      error: "projectId가 필요합니다."
    });
  }

  const db = await readDb();
  const dbUser = db.users.find((item) => item.accountId === currentUser.accountId);
  if (!dbUser) {
    return sendJson(res, 404, { ok: false, error: "사용자를 찾을 수 없습니다." });
  }

  const builder = ensureBuilderShape(dbUser.builder);
  const project = builder.projects.find((item) => item.projectId === projectId);
  if (!project) {
    return sendJson(res, 404, { ok: false, error: "프로젝트를 찾을 수 없습니다." });
  }

  return sendJson(res, 200, {
    ok: true,
    exportBundle: buildBuilderExport(project)
  });
}

async function handleCourseFile(req, res, urlObj) {
  const parts = urlObj.pathname.split("/").filter(Boolean);
  if (parts.length < 3) {
    return sendJson(res, 404, { ok: false, error: "파일 경로가 올바르지 않습니다." });
  }

  const directory = await loadCourseDirectory();
  const maybeCourseCode = normalizeCourseCode(decodeURIComponent(parts[1] || ""));
  let course = directory.byCode.get(DEFAULT_COURSE_CODE) || defaultCourseContext();
  let clipKey = "";
  let requested = "";

  if (parts.length >= 4 && directory.byCode.has(maybeCourseCode)) {
    course = directory.byCode.get(maybeCourseCode);
    clipKey = decodeURIComponent(parts[2] || "");
    requested = parts.slice(3).join("/");
  } else {
    clipKey = decodeURIComponent(parts[1] || "");
    requested = parts.slice(2).join("/");
  }

  const { clipsByKey } = await getCatalog(course);
  const clip = clipsByKey.get(clipKey);
  if (!clip) {
    return sendJson(res, 404, { ok: false, error: "클립을 찾을 수 없습니다." });
  }

  const targetPath = path.resolve(clip.folderAbsolute, requested);
  if (!targetPath.startsWith(clip.folderAbsolute)) {
    return sendJson(res, 400, { ok: false, error: "유효하지 않은 파일 요청입니다." });
  }

  if (!(await pathExists(targetPath))) {
    return sendJson(res, 404, { ok: false, error: "파일이 없습니다." });
  }

  const ext = path.extname(targetPath).toLowerCase();
  const mime = MIME_MAP[ext] || "application/octet-stream";
  const content = await fs.readFile(targetPath);

  res.writeHead(200, { "Content-Type": mime });
  res.end(content);
}

async function handlePracticeFile(req, res, urlObj) {
  const parts = urlObj.pathname.split("/").filter(Boolean);
  const key = normalizeWs(decodeURIComponent(parts[1] || ""));
  const relativePath = PRACTICE_FILE_MAP[key];

  if (!relativePath) {
    return sendJson(res, 404, {
      ok: false,
      error: "요청한 실습 파일 키를 찾을 수 없습니다."
    });
  }

  const targetPath = path.resolve(SOURCE_ROOT, relativePath);
  if (!targetPath.startsWith(SOURCE_ROOT)) {
    return sendJson(res, 400, {
      ok: false,
      error: "유효하지 않은 파일 요청입니다."
    });
  }

  if (!(await pathExists(targetPath))) {
    return sendJson(res, 404, {
      ok: false,
      error: "실습 파일이 존재하지 않습니다."
    });
  }

  const stat = await fs.stat(targetPath);
  if (stat.isDirectory()) {
    return sendJson(res, 400, {
      ok: false,
      error: "디렉터리는 다운로드할 수 없습니다."
    });
  }

  const ext = path.extname(targetPath).toLowerCase();
  const mime = MIME_MAP[ext] || "application/octet-stream";
  const content = await fs.readFile(targetPath);
  const fileName = path.basename(targetPath);

  res.writeHead(200, {
    "Content-Type": mime,
    "Content-Length": content.length,
    "Content-Disposition": makeAttachmentHeader(fileName)
  });
  res.end(content);
}

async function handleStatic(req, res, urlObj) {
  let requestPath = urlObj.pathname === "/" ? "/index.html" : urlObj.pathname;
  requestPath = requestPath.replace(/^\/+/, "");

  const targetPath = path.resolve(PUBLIC_DIR, requestPath);
  if (!targetPath.startsWith(PUBLIC_DIR)) {
    return sendText(res, 400, "text/plain; charset=utf-8", "Bad request");
  }

  if (!(await pathExists(targetPath))) {
    return sendText(res, 404, "text/plain; charset=utf-8", "Not found");
  }

  const stat = await fs.stat(targetPath);
  if (stat.isDirectory()) {
    return sendText(res, 403, "text/plain; charset=utf-8", "Forbidden");
  }

  const ext = path.extname(targetPath).toLowerCase();
  const mime = MIME_MAP[ext] || "application/octet-stream";
  const content = await fs.readFile(targetPath);

  res.writeHead(200, { "Content-Type": mime });
  res.end(content);
}

async function route(req, res) {
  const urlObj = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && urlObj.pathname === "/api/health") {
    return sendJson(res, 200, { ok: true, service: "ax-literacy" });
  }

  if (req.method === "GET" && urlObj.pathname === "/api/courses") {
    return handleGetCourses(req, res);
  }

  if (req.method === "POST" && urlObj.pathname === "/api/signup") {
    return handleSignup(req, res);
  }

  if (req.method === "POST" && urlObj.pathname === "/api/login") {
    return handleLogin(req, res);
  }

  if (req.method === "POST" && urlObj.pathname === "/api/logout") {
    return handleLogout(req, res, urlObj);
  }

  if (req.method === "POST" && urlObj.pathname === "/api/password-hint") {
    return handlePasswordHint(req, res);
  }

  if (req.method === "POST" && urlObj.pathname === "/api/password-recover") {
    return handlePasswordRecover(req, res);
  }

  if (req.method === "POST" && urlObj.pathname === "/api/account") {
    return handleAccountUpdate(req, res, urlObj);
  }

  if (req.method === "GET" && urlObj.pathname === "/api/me") {
    return handleGetMe(req, res, urlObj);
  }

  if (req.method === "GET" && urlObj.pathname === "/api/chapters") {
    return handleGetChapters(req, res, urlObj);
  }

  if (req.method === "GET" && urlObj.pathname.startsWith("/api/clips/")) {
    return handleGetClip(req, res, urlObj);
  }

  if (
    (req.method === "GET" || req.method === "POST") &&
    urlObj.pathname === "/api/progress"
  ) {
    return handleProgress(req, res, urlObj);
  }

  if (
    (req.method === "GET" || req.method === "POST") &&
    urlObj.pathname === "/api/ax-task"
  ) {
    return handleAxTask(req, res, urlObj);
  }

  if (
    (req.method === "GET" || req.method === "POST") &&
    urlObj.pathname === "/api/notes"
  ) {
    return handleNotes(req, res, urlObj);
  }

  if (req.method === "GET" && urlObj.pathname === "/api/admin/users") {
    return handleAdminUsers(req, res, urlObj);
  }

  if (req.method === "GET" && urlObj.pathname.startsWith("/course-files/")) {
    return handleCourseFile(req, res, urlObj);
  }

  if (req.method === "GET" && urlObj.pathname.startsWith("/practice-files/")) {
    return handlePracticeFile(req, res, urlObj);
  }

  if (req.method === "GET") {
    return handleStatic(req, res, urlObj);
  }

  return sendText(res, 405, "text/plain; charset=utf-8", "Method not allowed");
}

async function start() {
  await ensureDb();
  await ensureRootUser();
  await getCatalog();

  const server = http.createServer(async (req, res) => {
    try {
      await route(req, res);
    } catch (error) {
      console.error("[AX_Literacy] request error:", error);
      sendJson(res, 500, { ok: false, error: "서버 오류가 발생했습니다." });
    }
  });

  server.listen(PORT, HOST, () => {
    console.log(`[AX_Literacy] running on http://${HOST}:${PORT}`);
    console.log(`[AX_Literacy] source chapters: ${CHAPTERS_DIR}`);
  });
}

start().catch((error) => {
  console.error("[AX_Literacy] startup failed:", error);
  process.exit(1);
});
