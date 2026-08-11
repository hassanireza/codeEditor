import { useEffect, useState } from "react";
import styles from "./App.module.css";
import TitleBar from "./components/TitleBar";
import ActivityBar from "./components/ActivityBar/ActivityBar";
import Sidebar from "./components/Sidebar/Sidebar";
import TabBar from "./components/Tabs/TabBar";
import EditorPanel from "./components/Editor/EditorPanel";
import StatusBar from "./components/StatusBar/StatusBar";
import Toast from "./components/Toast/Toast";
import { useEditorStore } from "./store/useEditorStore";

export default function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const theme = useEditorStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "dark");
  }, [theme]);

  // Warn before closing the tab if there are unsaved changes.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      const hasDirty = useEditorStore.getState().tabs.some((t) => t.isDirty);
      if (hasDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  return (
    <div className={styles.app}>
      <TitleBar />
      <div className={styles.body}>
        <ActivityBar sidebarVisible={sidebarVisible} onToggleSidebar={() => setSidebarVisible((v) => !v)} />
        {sidebarVisible && <Sidebar />}
        <div className={styles.mainColumn}>
          <TabBar />
          <EditorPanel />
        </div>
      </div>
      <StatusBar />
      <Toast />
    </div>
  );
}
