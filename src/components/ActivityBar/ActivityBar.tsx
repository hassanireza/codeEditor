import styles from "./ActivityBar.module.css";
import { useEditorStore } from "../../store/useEditorStore";

interface Props {
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
}

/** Hairline SVG icon — Explorer / Files */
function IconFiles() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h4.086a1.5 1.5 0 0 1 1.06.44l3.915 3.914A1.5 1.5 0 0 1 13 7.414V13.5A1.5 1.5 0 0 1 11.5 15h-8A1.5 1.5 0 0 1 2 13.5V3.5Z" />
      <path d="M8 2v4.5a.5.5 0 0 0 .5.5H13" />
    </svg>
  );
}

/** Hairline SVG icon — Moon / Dark */
function IconMoon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.5 9.5A6 6 0 0 1 6.5 3.5a6 6 0 0 0 6 6Z" />
    </svg>
  );
}

/** Hairline SVG icon — Sun / Light */
function IconSun() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="3" />
      <line x1="8"  y1="1"    x2="8"  y2="3"    />
      <line x1="8"  y1="13"   x2="8"  y2="15"   />
      <line x1="1"  y1="8"    x2="3"  y2="8"    />
      <line x1="13" y1="8"    x2="15" y2="8"    />
      <line x1="3.2" y1="3.2" x2="4.6" y2="4.6" />
      <line x1="11.4" y1="11.4" x2="12.8" y2="12.8" />
      <line x1="11.4" y1="4.6" x2="12.8" y2="3.2" />
      <line x1="3.2"  y1="12.8" x2="4.6" y2="11.4" />
    </svg>
  );
}

export default function ActivityBar({ sidebarVisible, onToggleSidebar }: Props) {
  const toggleTheme = useEditorStore((s) => s.toggleTheme);
  const theme       = useEditorStore((s) => s.theme);

  const isDark = theme === "vs-dark";

  return (
    <div className={styles.bar}>
      <button
        className={`${styles.iconButton} ${sidebarVisible ? styles.active : ""}`}
        title="Explorer"
        aria-label="Toggle Explorer"
        onClick={onToggleSidebar}
      >
        <IconFiles />
      </button>

      <div className={styles.spacer} />

      <button
        className={styles.iconButton}
        title={isDark ? "Light theme" : "Dark theme"}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        onClick={toggleTheme}
      >
        {isDark ? <IconMoon /> : <IconSun />}
      </button>
    </div>
  );
}
