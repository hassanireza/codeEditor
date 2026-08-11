/**
 * Maps file extensions (and a few special-cased filenames) to Monaco language IDs.
 * This is what lets the editor auto-detect language instead of requiring a manual picker.
 */
const EXTENSION_MAP: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  ts: "typescript",
  tsx: "typescript",
  json: "json",
  jsonc: "jsonc",
  html: "html",
  htm: "html",
  css: "css",
  scss: "scss",
  less: "less",
  md: "markdown",
  markdown: "markdown",
  py: "python",
  rb: "ruby",
  php: "php",
  java: "java",
  c: "c",
  h: "c",
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  hpp: "cpp",
  cs: "csharp",
  go: "go",
  rs: "rust",
  swift: "swift",
  kt: "kotlin",
  kts: "kotlin",
  sql: "sql",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  yml: "yaml",
  yaml: "yaml",
  xml: "xml",
  svg: "xml",
  toml: "ini",
  ini: "ini",
  dockerfile: "dockerfile",
  graphql: "graphql",
  gql: "graphql",
  vue: "html",
  lua: "lua",
  r: "r",
  txt: "plaintext",
};

const SPECIAL_FILENAMES: Record<string, string> = {
  dockerfile: "dockerfile",
  makefile: "makefile",
  ".gitignore": "plaintext",
  ".env": "plaintext",
};

export function detectLanguage(filename: string): string {
  const lower = filename.toLowerCase();

  if (SPECIAL_FILENAMES[lower]) {
    return SPECIAL_FILENAMES[lower];
  }

  const dotIndex = lower.lastIndexOf(".");
  if (dotIndex === -1) return "plaintext";

  const ext = lower.slice(dotIndex + 1);
  return EXTENSION_MAP[ext] ?? "plaintext";
}

/** Simple icon glyph per language/extension, used in the file tree + tabs. */
export function iconForFile(filename: string, kind: "file" | "directory", expanded?: boolean): string {
  if (kind === "directory") return expanded ? "📂" : "📁";

  const lang = detectLanguage(filename);
  const iconMap: Record<string, string> = {
    javascript: "🟨",
    typescript: "🔷",
    json: "🟫",
    html: "🟧",
    css: "🟦",
    scss: "🟦",
    markdown: "📝",
    python: "🐍",
    java: "☕",
    cpp: "🔵",
    c: "🔵",
    csharp: "🟣",
    go: "🐹",
    rust: "🦀",
    shell: "💲",
    yaml: "⚙️",
    xml: "📄",
    sql: "🗄️",
  };
  return iconMap[lang] ?? "📄";
}
