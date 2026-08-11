import styles from "./StatusBar.module.css";
import { useEditorStore } from "../../store/useEditorStore";
import { supportsFileSystemAccess } from "../../lib/fileSystem";

export default function StatusBar() {
  const tabs = useEditorStore((s) => s.tabs);
  const activeTabId = useEditorStore((s) => s.activeTabId);
  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div className={styles.statusBar}>
      <div className={styles.left}>
        {activeTab && (
          <>
            <span className={styles.item}>{activeTab.isDirty ? "● Unsaved changes" : "✓ Saved"}</span>
            <span className={styles.item}>{activeTab.language}</span>
          </>
        )}
      </div>
      <div className={styles.right}>
        {!supportsFileSystemAccess && (
          <span className={styles.item} title="Full folder access requires Chrome or Edge">
            Limited file support in this browser
          </span>
        )}
        <span className={styles.item}>UTF-8</span>
        <span className={styles.item}>Ctrl+S to Save</span>
      </div>
    </div>
  );
}
