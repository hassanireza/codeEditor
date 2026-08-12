import { useCallback, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import styles from "./EditorPanel.module.css";
import { useEditorStore } from "../../store/useEditorStore";
import { downloadFile, saveFileAs, supportsFileSystemAccess, writeFile } from "../../lib/fileSystem";

/** Tidal Halo mark — large, centered in empty canvas */
function TidalHaloLarge() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity="0.9" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="32" stroke="currentColor" strokeOpacity="0.55" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="18" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.8" />
      <line x1="50" y1="4"  x2="50" y2="30" stroke="currentColor" strokeOpacity="0.75" strokeWidth="0.8" />
      <line x1="42" y1="12" x2="58" y2="12" stroke="currentColor" strokeOpacity="0.75" strokeWidth="0.8" />
      <line x1="50" y1="70" x2="50" y2="92" stroke="currentColor" strokeOpacity="0.6"  strokeWidth="0.8" />
      <circle cx="50" cy="92" r="2.2" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

export default function EditorPanel() {
  const tabs             = useEditorStore((s) => s.tabs);
  const activeTabId      = useEditorStore((s) => s.activeTabId);
  const theme            = useEditorStore((s) => s.theme);
  const updateTabContent = useEditorStore((s) => s.updateTabContent);
  const markTabSaved     = useEditorStore((s) => s.markTabSaved);
  const showToast        = useEditorStore((s) => s.showToast);
  const createUntitledTab = useEditorStore((s) => s.createUntitledTab);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const activeTab = tabs.find((t) => t.id === activeTabId);

  const handleSave = useCallback(async () => {
    const state = useEditorStore.getState();
    const tab   = state.tabs.find((t) => t.id === state.activeTabId);
    if (!tab) return;

    try {
      if (tab.fileHandle) {
        await writeFile(tab.fileHandle, tab.content);
        markTabSaved(tab.id);
        showToast(`Saved ${tab.name}`, "success");
        return;
      }
      if (supportsFileSystemAccess) {
        const handle = await saveFileAs(tab.content, tab.name);
        if (handle) {
          markTabSaved(tab.id, handle, handle.name, handle.name);
          showToast(`Saved ${handle.name}`, "success");
        }
        return;
      }
      downloadFile(tab.content, tab.name === "Untitled" ? "untitled.txt" : tab.name);
      markTabSaved(tab.id);
      showToast(`Downloaded ${tab.name}`, "success");
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        showToast(`Could not save ${tab.name}`, "error");
      }
    }
  }, [markTabSaved, showToast]);

  const handleMount: OnMount = (editorInstance, monaco) => {
    editorRef.current = editorInstance;
    editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });
  };

  /* ── Empty / welcome state ── */
  if (!activeTab) {
    return (
      <div className={styles.emptyEditor}>
        <div className={styles.emptyContent}>
          {/* Tidal Halo — primary mark */}
          <div className={styles.emptyMark}>
            <TidalHaloLarge />
          </div>

          <h1>abyssal liturgy</h1>
          <p>Open a folder or file to begin, or create a new untitled document.</p>

          {/* Keyboard hints */}
          <div className={styles.keyHints}>
            <div className={styles.keyHint}>
              <kbd>⌘ O</kbd>
              <span>Open file</span>
            </div>
            <div className={styles.keyHint}>
              <kbd>⌘ S</kbd>
              <span>Save to disk</span>
            </div>
            <div className={styles.keyHint}>
              <kbd>⌘ ⇧ S</kbd>
              <span>Save as</span>
            </div>
          </div>

          <div className={styles.emptyDivider} />

          <button className={styles.newFileBtn} onClick={createUntitledTab}>
            New file
          </button>
        </div>
      </div>
    );
  }

  /* ── Active editor ── */
  return (
    <div className={styles.editorWrapper}>
      <Editor
        key={activeTab.id}
        height="100%"
        language={activeTab.language}
        theme={theme}
        value={activeTab.content}
        onChange={(value) => updateTabContent(activeTab.id, value ?? "")}
        onMount={handleMount}
        options={{
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', Consolas, monospace",
          fontWeight: "300",
          fontLigatures: true,
          lineHeight: 1.8,
          letterSpacing: 0.2,
          minimap: { enabled: true, scale: 1, renderCharacters: false },
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          cursorStyle: "line",
          cursorWidth: 1,
          renderWhitespace: "selection",
          bracketPairColorization: { enabled: true },
          padding: { top: 20, bottom: 20 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          lineNumbers: "on",
          renderLineHighlight: "gutter",
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
        }}
      />
    </div>
  );
}
