import { useState, useEffect, type DragEvent } from "react";
import styles from "./Sidebar.module.css";
import FileTreeNodeView from "./FileTreeNode";
import { useEditorStore } from "../../store/useEditorStore";
import {
  buildDirectoryNode,
  createFile,
  createFolder,
  openDirectory,
  openSingleFile,
  readFile,
  readFileFromInput,
  supportsFileSystemAccess,
} from "../../lib/fileSystem";

export default function Sidebar() {
  const rootNode = useEditorStore((s) => s.rootNode);
  const setRootNode = useEditorStore((s) => s.setRootNode);
  const setExpanded = useEditorStore((s) => s.setExpanded);
  const refreshTree = useEditorStore((s) => s.refreshTree);
  const refreshNode = useEditorStore((s) => s.refreshNode);
  const isRefreshing = useEditorStore((s) => s.isRefreshing);
  const openTabFromContent = useEditorStore((s) => s.openTabFromContent);
  const showToast = useEditorStore((s) => s.showToast);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Auto-refresh the tree whenever the tab/window regains focus (e.g. after
  // creating/editing files in an external editor or terminal) so the sidebar
  // stays in sync without the user needing to reload the page.
  useEffect(() => {
    if (!rootNode) return;
    const onFocus = () => {
      refreshTree();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") refreshTree();
    });
    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, [rootNode, refreshTree]);

  const handleOpenFolder = async () => {
    try {
      const node = await openDirectory();
      if (node) {
        setRootNode(node);
        showToast(`Opened folder "${node.name}"`, "success");
      }
    } catch (err) {
      // AbortError happens when the user cancels the picker; ignore silently.
      if ((err as Error).name !== "AbortError") {
        showToast("Could not open folder", "error");
      }
    }
  };

  const handleOpenFile = async () => {
    try {
      const result = await openSingleFile();
      if (result) {
        openTabFromContent({ name: result.name, path: `file://${result.name}-${Date.now()}`, content: result.content, fileHandle: result.handle });
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        showToast("Could not open file", "error");
      }
    }
  };

  const handleNewRootFile = async () => {
    if (!rootNode) return;
    const name = window.prompt("New file name:");
    if (!name) return;
    try {
      await createFile(rootNode.handle as FileSystemDirectoryHandle, name);
      await refreshNode(rootNode);
      setExpanded(rootNode.path, true);
      showToast(`Created "${name}"`, "success");
    } catch (err) {
      showToast((err as Error).message || "Could not create file", "error");
    }
  };

  const handleNewRootFolder = async () => {
    if (!rootNode) return;
    const name = window.prompt("New folder name:");
    if (!name) return;
    try {
      await createFolder(rootNode.handle as FileSystemDirectoryHandle, name);
      await refreshNode(rootNode);
      setExpanded(rootNode.path, true);
      showToast(`Created "${name}"`, "success");
    } catch (err) {
      showToast((err as Error).message || "Could not create folder", "error");
    }
  };

  const handleRefreshRoot = async () => {
    await refreshTree();
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    // Only clear when leaving the sidebar itself, not when moving between children.
    if (e.currentTarget === e.target) setIsDragOver(false);
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const items = e.dataTransfer.items;

    // Preferred path: Chromium supports resolving dropped items straight to
    // real FileSystemHandles, so a dropped folder gets full read/write access
    // just like "Open Folder" does.
    if (items && items.length > 0 && items[0].getAsFileSystemHandle) {
      try {
        const handles = await Promise.all(
          Array.from(items).map((item) => item.getAsFileSystemHandle?.())
        );

        const firstDir = handles.find(
          (h): h is FileSystemDirectoryHandle => !!h && h.kind === "directory"
        );

        if (firstDir) {
          const node = await buildDirectoryNode(firstDir, firstDir.name);
          setRootNode(node);
          showToast(`Opened folder "${firstDir.name}"`, "success");
          return;
        }

        // No directory dropped — treat every dropped item as a file to open in a tab.
        for (const handle of handles) {
          if (handle && handle.kind === "file") {
            const fileHandle = handle as FileSystemFileHandle;
            const content = await readFile(fileHandle);
            openTabFromContent({
              name: fileHandle.name,
              path: `file://${fileHandle.name}-${Date.now()}`,
              content,
              fileHandle,
            });
          }
        }
        return;
      } catch (err) {
        showToast("Could not read dropped item", "error");
        return;
      }
    }

    // Fallback for browsers without getAsFileSystemHandle (Firefox/Safari):
    // open dropped files as read-only-until-saved-as buffers.
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      try {
        const content = await readFileFromInput(file);
        openTabFromContent({
          name: file.name,
          path: `file://${file.name}-${Date.now()}`,
          content,
        });
      } catch (err) {
        showToast(`Could not read ${file.name}`, "error");
      }
    }
  };

  return (
    <div
      className={`${styles.sidebar} ${isDragOver ? styles.dragOver : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={styles.header}>
        <span>Explorer</span>
        {rootNode && (
          <div className={styles.headerActions}>
            <button title="New File" onClick={handleNewRootFile}>📄+</button>
            <button title="New Folder" onClick={handleNewRootFolder}>📁+</button>
            <button title="Refresh Explorer" onClick={handleRefreshRoot} disabled={isRefreshing}>
              {isRefreshing ? "⏳" : "🔄"}
            </button>
            <button title="Open Folder" onClick={handleOpenFolder}>📂</button>
            <button title="Open File" onClick={handleOpenFile}>📄</button>
          </div>
        )}
      </div>

      {!rootNode ? (
        <div className={styles.emptyState}>
          <p>
            {supportsFileSystemAccess
              ? "Open a project folder to browse and edit its files, like Visual Studio Code. You can also drag and drop a folder or files here."
              : "Your browser doesn't support folder access. You can still open or drag in individual files."}
          </p>
          {supportsFileSystemAccess && (
            <button className={styles.primaryButton} onClick={handleOpenFolder}>
              Open Folder
            </button>
          )}
          <button className={styles.primaryButton} onClick={handleOpenFile}>
            Open File
          </button>
        </div>
      ) : (
        <>
          <div className={styles.rootLabel}>{rootNode.name}</div>
          <div className={styles.tree}>
            <FileTreeNodeView
              node={rootNode}
              depth={0}
              selectedPath={selectedPath}
              onSelect={setSelectedPath}
            />
          </div>
        </>
      )}
    </div>
  );
}
