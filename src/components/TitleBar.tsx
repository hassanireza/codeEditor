import styles from "./TitleBar.module.css";
import { useEditorStore } from "../store/useEditorStore";

/** Tidal Halo — primary mark from Abyssal Liturgy identity system */
function TidalHaloMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={styles.markIcon}
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity="0.9" strokeWidth="1" />
      <circle cx="50" cy="50" r="32" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1" />
      <circle cx="50" cy="50" r="18" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
      <line x1="50" y1="4"  x2="50" y2="30" stroke="currentColor" strokeOpacity="0.75" strokeWidth="1" />
      <line x1="42" y1="12" x2="58" y2="12" stroke="currentColor" strokeOpacity="0.75" strokeWidth="1" />
      <line x1="50" y1="70" x2="50" y2="92" stroke="currentColor" strokeOpacity="0.6"  strokeWidth="1" />
      <circle cx="50" cy="92" r="2.2" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

export default function TitleBar() {
  const tabs       = useEditorStore((s) => s.tabs);
  const activeTabId = useEditorStore((s) => s.activeTabId);
  const rootNode   = useEditorStore((s) => s.rootNode);
  const activeTab  = tabs.find((t) => t.id === activeTabId);

  const title = activeTab
    ? `${activeTab.isDirty ? "· " : ""}${activeTab.name}${rootNode ? ` / ${rootNode.name}` : ""}`
    : rootNode?.name ?? "abyssal liturgy";

  return (
    <div className={styles.titleBar}>
      {/* OS traffic lights */}
      <div className={styles.dots}>
        <span className={`${styles.dot} ${styles.dotRed}`}    />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`}  />
      </div>

      {/* Identity mark + wordmark */}
      <div className={styles.mark}>
        <TidalHaloMark size={14} />
        <span className={styles.markLabel}>abyssal liturgy</span>
      </div>

      {/* Active file — italic display */}
      <div className={styles.title}>{title}</div>

      {/* Balance spacer */}
      <div style={{ width: 80, flexShrink: 0 }} />
    </div>
  );
}
