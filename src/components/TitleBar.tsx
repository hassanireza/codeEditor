import styles from "./TitleBar.module.css";
import { useEditorStore } from "../store/useEditorStore";

export default function TitleBar() {
  const tabs = useEditorStore((s) => s.tabs);
  const activeTabId = useEditorStore((s) => s.activeTabId);
  const rootNode = useEditorStore((s) => s.rootNode);
  const activeTab = tabs.find((t) => t.id === activeTabId);

  const title = activeTab
    ? `${activeTab.isDirty ? "● " : ""}${activeTab.name}${rootNode ? ` — ${rootNode.name}` : ""}`
    : rootNode?.name ?? "Code Editor";

  return (
    <div className={styles.titleBar}>
      <div className={styles.dots}>
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
      </div>
      <div className={styles.title}>{title}</div>
      <div style={{ width: 47 }} />
    </div>
  );
}
