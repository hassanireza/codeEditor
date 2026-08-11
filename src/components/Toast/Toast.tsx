import { useEffect } from "react";
import styles from "./Toast.module.css";
import { useEditorStore } from "../../store/useEditorStore";

export default function Toast() {
  const toast = useEditorStore((s) => s.toast);
  const clearToast = useEditorStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => clearToast(), 3000);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <div className={`${styles.toast} ${styles[toast.kind]}`}>
      {toast.message}
    </div>
  );
}
