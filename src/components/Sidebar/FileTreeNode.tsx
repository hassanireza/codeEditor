import { useState, type MouseEvent } from "react";
import styles from "./Sidebar.module.css";
import type { FileTreeNode } from "../../types";
import { iconForFile } from "../../lib/languageDetect";
import { loadChildren, readFile, createFile, createFolder } from "../../lib/fileSystem";
import { useEditorStore } from "../../store/useEditorStore";

interface Props {
  node: FileTreeNode;
  depth: number;
  selectedPath: string | null;
  onSelect: (path: string) => void;
}

export default function FileTreeNodeView({ node, depth, selectedPath, onSelect }: Props) {
  const expanded = useEditorStore((s) => !!s.expandedPaths[node.path]);
  const setExpanded = useEditorStore((s) => s.setExpanded);
  const [loading, setLoading] = useState(false);
  const updateNodeChildren = useEditorStore((s) => s.updateNodeChildren);
  const openTabFromContent = useEditorStore((s) => s.openTabFromContent);
  const showToast = useEditorStore((s) => s.showToast);

  const loadFreshChildren = async () => {
    setLoading(true);
    try {
      const children = await loadChildren(node);
      updateNodeChildren(node.id, children);
    } catch (err) {
      showToast("Could not read folder contents", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    if (node.kind === "directory") {
      if (!expanded) {
        // Always re-read from disk on expand so newly added/removed files show up
        // without needing a full page refresh.
        await loadFreshChildren();
      }
      setExpanded(node.path, !expanded);
    } else {
      onSelect(node.path);
      try {
        const content = await readFile(node.handle as FileSystemFileHandle);
        openTabFromContent({
          name: node.name,
          path: node.path,
          content,
          fileHandle: node.handle as FileSystemFileHandle,
        });
      } catch (err) {
        showToast(`Could not open ${node.name}`, "error");
      }
    }
  };

  const handleRefresh = async (e: MouseEvent) => {
    e.stopPropagation();
    await loadFreshChildren();
    if (!expanded) setExpanded(node.path, true);
  };

  const handleNewFile = async (e: MouseEvent) => {
    e.stopPropagation();
    const name = window.prompt("New file name:");
    if (!name) return;
    try {
      await createFile(node.handle as FileSystemDirectoryHandle, name);
      await loadFreshChildren();
      setExpanded(node.path, true);
      showToast(`Created "${name}"`, "success");
    } catch (err) {
      showToast((err as Error).message || "Could not create file", "error");
    }
  };

  const handleNewFolder = async (e: MouseEvent) => {
    e.stopPropagation();
    const name = window.prompt("New folder name:");
    if (!name) return;
    try {
      await createFolder(node.handle as FileSystemDirectoryHandle, name);
      await loadFreshChildren();
      setExpanded(node.path, true);
      showToast(`Created "${name}"`, "success");
    } catch (err) {
      showToast((err as Error).message || "Could not create folder", "error");
    }
  };

  const isSelected = selectedPath === node.path;

  return (
    <div>
      <div
        className={`${styles.node} ${isSelected ? styles.selected : ""}`}
        style={{ paddingLeft: 8 + depth * 14 }}
        onClick={handleClick}
        title={node.path}
      >
        {node.kind === "directory" ? (
          <span className={`${styles.chevron} ${expanded ? styles.expanded : ""}`}>▶</span>
        ) : (
          <span className={styles.chevron} />
        )}
        <span className={styles.nodeIcon}>
          {loading ? "⏳" : iconForFile(node.name, node.kind, expanded)}
        </span>
        <span className={styles.nodeName}>{node.name}</span>
        {node.kind === "directory" && (
          <span className={styles.nodeActions}>
            <button title="New File" onClick={handleNewFile}>📄</button>
            <button title="New Folder" onClick={handleNewFolder}>📁</button>
            <button title="Refresh" onClick={handleRefresh}>🔄</button>
          </span>
        )}
      </div>
      {node.kind === "directory" && expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNodeView
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
