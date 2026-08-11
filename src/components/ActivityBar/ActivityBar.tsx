import styles from "./ActivityBar.module.css";
import { useEditorStore } from "../../store/useEditorStore";

interface Props {
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
}

export default function ActivityBar({ sidebarVisible, onToggleSidebar }: Props) {
  const toggleTheme = useEditorStore((s) => s.toggleTheme);
  const theme = useEditorStore((s) => s.theme);

  return (
    <div className={styles.bar}>
      <button
        className={`${styles.iconButton} ${sidebarVisible ? styles.active : ""}`}
        title="Explorer"
        onClick={onToggleSidebar}
      >
        📁
      </button>
      <div className={styles.spacer} />
      <button
        className={styles.iconButton}
        title={theme === "vs-dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
        onClick={toggleTheme}
      >
        {theme === "vs-dark" ? "🌙" : "☀️"}
      </button>
    </div>
  );
}
