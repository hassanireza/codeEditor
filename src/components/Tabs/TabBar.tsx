import styles from "./TabBar.module.css";
import { useEditorStore } from "../../store/useEditorStore";
import { iconForFile } from "../../lib/languageDetect";

export default function TabBar() {
  const tabs = useEditorStore((s) => s.tabs);
  const activeTabId = useEditorStore((s) => s.activeTabId);
  const setActiveTab = useEditorStore((s) => s.setActiveTab);
  const closeTab = useEditorStore((s) => s.closeTab);
  const createUntitledTab = useEditorStore((s) => s.createUntitledTab);

  return (
    <div className={styles.tabBar}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`${styles.tab} ${tab.id === activeTabId ? styles.active : ""} ${tab.isDirty ? styles.dirty : ""}`}
          onClick={() => setActiveTab(tab.id)}
          title={tab.path}
        >
          <span className={styles.tabIcon}>{iconForFile(tab.name, "file")}</span>
          <span className={styles.tabName}>{tab.name}</span>
          {tab.isDirty ? (
            <button
              className={styles.closeBtn}
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              title="Unsaved changes — click to close"
            >
              <span className={styles.dirtyDot} />
            </button>
          ) : (
            <button
              className={styles.closeBtn}
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              title="Close"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button className={styles.newTabBtn} onClick={createUntitledTab} title="New File">
        +
      </button>
    </div>
  );
}
