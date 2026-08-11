import { useCallback, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import styles from "./EditorPanel.module.css";
import { useEditorStore } from "../../store/useEditorStore";
import { downloadFile, saveFileAs, supportsFileSystemAccess, writeFile } from "../../lib/fileSystem";

export default function EditorPanel() {
  const tabs = useEditorStore((s) => s.tabs);
  const activeTabId = useEditorStore((s) => s.activeTabId);
  const theme = useEditorStore((s) => s.theme);
  const updateTabContent = useEditorStore((s) => s.updateTabContent);
  const markTabSaved = useEditorStore((s) => s.markTabSaved);
  const showToast = useEditorStore((s) => s.showToast);
  const createUntitledTab = useEditorStore((s) => s.createUntitledTab);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const activeTab = tabs.find((t) => t.id === activeTabId);

  const handleSave = useCallback(async () => {
    const state = useEditorStore.getState();
    const tab = state.tabs.find((t) => t.id === state.activeTabId);
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

      // Fallback: trigger a browser download.
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

  if (!activeTab) {
    return (
      <div className={styles.emptyEditor}>
        <div className={styles.emptyContent}>
          <h1>Code Editor</h1>
          <p>Open a folder or file to start editing, or create a new file.</p>
          <button className={styles.newFileBtn} onClick={createUntitledTab}>
            New File
          </button>
        </div>
      </div>
    );
  }

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
          fontSize: 14,
          fontFamily: "SF Mono, Monaco, Cascadia Code, Fira Code, Consolas, monospace",
          fontLigatures: true,
          minimap: { enabled: true },
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          renderWhitespace: "selection",
          bracketPairColorization: { enabled: true },
          padding: { top: 12 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
