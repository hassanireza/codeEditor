<div align="center">

<!-- HERO BANNER -->
<img src=".github/assets/banner.svg" alt="Code Editor Banner" width="100%" />

<br/>

<!-- BADGES ROW 1 -->
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
<img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
<img src="https://img.shields.io/badge/Monaco_Editor-0.55-68217A?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="Monaco" />

<br/><br/>

<!-- BADGES ROW 2 -->
<img src="https://img.shields.io/badge/License-MIT-22C55E?style=flat-square" alt="MIT License" />
<img src="https://img.shields.io/badge/PRs-Welcome-F59E0B?style=flat-square" alt="PRs Welcome" />
<img src="https://img.shields.io/badge/Browser-Chrome%20%7C%20Edge-4285F4?style=flat-square&logo=googlechrome&logoColor=white" alt="Chrome / Edge" />
<img src="https://img.shields.io/badge/Zustand-5-FF4154?style=flat-square" alt="Zustand" />

<br/><br/>

<p align="center">
  <strong>A VS Code–inspired, fully browser-based code editor — zero backend, real file system access, Monaco power.</strong><br/>
  Open folders, edit files, save directly to disk. Works entirely in your browser tab.
</p>

<br/>

[**Get Started**](#-getting-started) · [**Features**](#-features) · [**Browser Support**](#-browser-support) · [**Project Structure**](#-project-structure) · [**Contributing**](#-contributing)

<br/>

---

</div>

<br/>

## ✨ Features

<br/>

<table>
<tr>
<td width="50%" valign="top">

### 🧠 Monaco Editor at the Core
The same engine powering VS Code — bracket colorization, minimap, smooth cursor animations, multi-cursor editing, and IntelliSense-ready architecture. No compromise on editing quality.

</td>
<td width="50%" valign="top">

### 🔍 Auto Language Detection
Drop any file — TypeScript, Python, Rust, SQL, YAML, GraphQL, and 30+ more — and the language mode snaps into place automatically, inferred from the file extension with zero manual setup.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📁 Real Folder Explorer
Open an entire project directory and navigate it in a familiar VS Code–style tree. Directories expand lazily, `node_modules` and `.git` are hidden by default, and the tree refreshes when files change on disk.

</td>
<td width="50%" valign="top">

### 🗂️ Multi-Tab Workflow
Work across multiple files simultaneously. Each tab carries its own independent undo/redo history. Unsaved changes surface as a dot indicator — you'll never accidentally close a dirty file.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 💾 True Save — Back to Disk
`Ctrl+S` writes directly back to the original file on your file system (no download prompt, no copy-paste). **Save As** and single-file **Open** are also supported with full handle management.

</td>
<td width="50%" valign="top">

### 🌗 Dark & Light Theme
Switch between VS Code Dark and Light themes with a single click. Theme preference is applied globally across the editor, sidebar, tabs, and status bar in real time.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔄 Graceful Fallbacks
No File System Access API? No problem. On Firefox and Safari the editor automatically falls back to `<input type="file">` for opening and triggers a download for saving — same editing experience, adapted I/O.

</td>
<td width="50%" valign="top">

### 🔔 Toast Notifications
Non-intrusive feedback for every important action — saved, error, info — with auto-dismiss. No dialog boxes, no interruptions to your flow.

</td>
</tr>
</table>

<br/>

---

<br/>

## 🚀 Getting Started

<br/>

> **Prerequisites:** Node.js 18+ and npm. For full folder access, use **Chrome** or **Edge**.

<br/>

### 1 — Clone

```bash
git clone https://github.com/your-org/code-editor.git
cd code-editor
```

### 2 — Install

```bash
npm install
```

### 3 — Run

```bash
npm run dev
```

Open the printed local URL (typically [`http://localhost:5173`](http://localhost:5173)) in **Chrome or Edge** for the full experience.

<br/>

### Production Build

```bash
npm run build     # TypeScript check + Vite bundle
npm run preview   # Preview the production output locally
```

<br/>

### Lint

```bash
npm run lint      # Runs oxlint — fast Rust-based linter
```

<br/>

---

<br/>

## 🌐 Browser Support

<br/>

<div align="center">

| Browser | Open Folder | In-Place Save | Open File | Save (Download) |
|:-------:|:-----------:|:-------------:|:---------:|:---------------:|
| ![Chrome](https://img.shields.io/badge/Chrome-✓-4285F4?style=flat-square&logo=googlechrome&logoColor=white) | ✅ | ✅ | ✅ | ✅ |
| ![Edge](https://img.shields.io/badge/Edge-✓-0078D4?style=flat-square&logo=microsoftedge&logoColor=white) | ✅ | ✅ | ✅ | ✅ |
| ![Brave](https://img.shields.io/badge/Brave-✓-FB542B?style=flat-square&logo=brave&logoColor=white) | ✅ | ✅ | ✅ | ✅ |
| ![Firefox](https://img.shields.io/badge/Firefox-Partial-FF7139?style=flat-square&logo=firefox&logoColor=white) | ❌ | ❌ | ✅ (upload) | ✅ |
| ![Safari](https://img.shields.io/badge/Safari-Partial-000000?style=flat-square&logo=safari&logoColor=white) | ❌ | ❌ | ✅ (upload) | ✅ |

</div>

<br/>

> **Why the gap?** "Open Folder" and direct "Save" rely on the [**File System Access API**](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API), a Chromium-only capability. The app detects support at runtime and adjusts automatically — Firefox and Safari users get a seamless upload/download flow instead.

<br/>

---

<br/>

## 📁 Project Structure

<br/>

```
code-editor/
├── public/
│   ├── favicon.svg              — App icon
│   └── icons.svg                — SVG sprite sheet
│
├── src/
│   ├── components/
│   │   ├── ActivityBar/         — Left icon strip (explorer toggle, theme toggle)
│   │   │   ├── ActivityBar.tsx
│   │   │   └── ActivityBar.module.css
│   │   │
│   │   ├── Sidebar/             — Folder explorer + lazy file tree
│   │   │   ├── Sidebar.tsx
│   │   │   ├── FileTreeNode.tsx
│   │   │   └── Sidebar.module.css
│   │   │
│   │   ├── Tabs/                — Open-file tab bar with dirty indicators
│   │   │   ├── TabBar.tsx
│   │   │   └── TabBar.module.css
│   │   │
│   │   ├── Editor/              — Monaco wrapper + Ctrl+S save logic
│   │   │   ├── EditorPanel.tsx
│   │   │   └── EditorPanel.module.css
│   │   │
│   │   ├── StatusBar/           — Bottom status bar (language, cursor position)
│   │   │   ├── StatusBar.tsx
│   │   │   └── StatusBar.module.css
│   │   │
│   │   ├── Toast/               — Auto-dismiss notification toasts
│   │   │   ├── Toast.tsx
│   │   │   └── Toast.module.css
│   │   │
│   │   └── TitleBar.tsx         — Top title bar
│   │
│   ├── lib/
│   │   ├── fileSystem.ts        — File System Access API wrapper + fallbacks
│   │   ├── languageDetect.ts    — Extension → Monaco language ID mapping (30+ langs)
│   │   └── monacoSetup.ts       — Monaco initialization & worker config
│   │
│   ├── store/
│   │   └── useEditorStore.ts    — Zustand store: tabs, tree, theme, toasts
│   │
│   ├── types/
│   │   └── index.ts             — Shared TypeScript types + FSAA global augmentations
│   │
│   ├── App.tsx                  — Root layout, theme sync, beforeunload guard
│   ├── main.tsx                 — React 19 entry point
│   └── index.css                — Global CSS reset + design tokens
│
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

<br/>

---

<br/>

## 🧩 Architecture Overview

<br/>

The app follows a **flat Zustand store** pattern — all mutable state (tabs, file tree, theme, toasts) lives in a single `useEditorStore`, with components subscribing only to slices they need. This keeps re-renders minimal and state updates predictable.

<br/>

```
┌──────────────────────────────────────────────────────┐
│                      App.tsx                         │
│  TitleBar ─ ActivityBar ─ Sidebar ─ TabBar ─ Editor  │
│                      StatusBar                       │
└─────────────────────┬────────────────────────────────┘
                      │  reads / dispatches
                      ▼
             ┌─────────────────┐
             │  useEditorStore │  (Zustand)
             │  tabs[]         │
             │  activeTabId    │
             │  rootNode       │
             │  theme          │
             │  toast          │
             └────────┬────────┘
                      │  calls
          ┌───────────┴───────────┐
          ▼                       ▼
   lib/fileSystem.ts     lib/languageDetect.ts
   (FSAA wrapper)        (ext → Monaco lang)
```

<br/>

---

<br/>

## 🗺️ Supported Languages

<br/>

<div align="center">

`JavaScript` · `TypeScript` · `JSX/TSX` · `JSON / JSONC` · `HTML` · `CSS` · `SCSS` · `Less` · `Markdown` · `Python` · `Ruby` · `PHP` · `Java` · `C` · `C++` · `C#` · `Go` · `Rust` · `Swift` · `Kotlin` · `SQL` · `Shell / Bash` · `YAML` · `XML` · `SVG` · `TOML` · `INI` · `Dockerfile` · `GraphQL` · `Vue` · `Lua` · `R`

</div>

<br/>

> Language is detected from the file extension automatically. No manual picker, no configuration.

<br/>

---

<br/>

## 🔑 Keyboard Shortcuts

<br/>

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` / `Cmd + S` | Save file to disk (in-place if opened via handle) |
| `Ctrl + Shift + S` / `Cmd + Shift + S` | Save As — choose a new location |
| `Ctrl + W` / `Cmd + W` | Close active tab |
| `Ctrl + Tab` | Cycle to next tab |
| `Ctrl + \`` | Toggle sidebar (Explorer) |
| All standard Monaco shortcuts | Multi-cursor, find/replace, fold, format, etc. |

<br/>

---

<br/>

## 🛠️ Tech Stack

<br/>

<div align="center">

| Layer | Technology |
|-------|-----------|
| **UI Framework** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 6](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 8](https://vite.dev/) |
| **Editor Engine** | [Monaco Editor 0.55](https://microsoft.github.io/monaco-editor/) via `@monaco-editor/react` |
| **State Management** | [Zustand 5](https://zustand-demo.pmnd.rs/) |
| **Linter** | [oxlint](https://oxc.rs/docs/guide/usage/linter.html) |
| **Styling** | CSS Modules + CSS custom properties |
| **File I/O** | [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) with fallback |

</div>

<br/>

---

<br/>

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/my-feature`
3. **Commit** your changes: `git commit -m 'feat: add my feature'`
4. **Push** to the branch: `git push origin feat/my-feature`
5. **Open** a Pull Request

Please run `npm run lint` before submitting and keep PRs focused on a single concern.

<br/>

---

<br/>

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

<br/>

---

<div align="center">

<br/>

Built with ❤️ using React, Monaco, and the Web Platform.

<br/>

<img src="https://img.shields.io/badge/Made_with-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/Powered_by-Monaco_Editor-68217A?style=for-the-badge&logo=visual-studio-code&logoColor=white" />

</div>
