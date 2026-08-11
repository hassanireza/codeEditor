import { create } from "zustand";
import type { EditorTab, FileTreeNode, ThemeMode } from "../types";
import { detectLanguage } from "../lib/languageDetect";
import { loadChildren } from "../lib/fileSystem";

let untitledCounter = 0;

interface EditorState {
  tabs: EditorTab[];
  activeTabId: string | null;
  rootNode: FileTreeNode | null;
  theme: ThemeMode;
  toast: { message: string; kind: "info" | "error" | "success" } | null;
  /** Which directories are expanded, keyed by their (stable) path rather than node id,
   *  since node ids are regenerated every time a directory is re-read from disk. */
  expandedPaths: Record<string, boolean>;
  isRefreshing: boolean;

  openTabFromContent: (params: {
    name: string;
    path: string;
    content: string;
    fileHandle?: FileSystemFileHandle;
    isUntitled?: boolean;
  }) => void;
  createUntitledTab: () => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabContent: (id: string, content: string) => void;
  markTabSaved: (id: string, fileHandle?: FileSystemFileHandle, newName?: string, newPath?: string) => void;
  setRootNode: (node: FileTreeNode | null) => void;
  updateNodeChildren: (nodeId: string, children: FileTreeNode[]) => void;
  setExpanded: (path: string, expanded: boolean) => void;
  refreshTree: () => Promise<void>;
  refreshNode: (node: FileTreeNode) => Promise<void>;
  toggleTheme: () => void;
  showToast: (message: string, kind?: "info" | "error" | "success") => void;
  clearToast: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  tabs: [],
  activeTabId: null,
  rootNode: null,
  theme: "vs-dark",
  toast: null,
  expandedPaths: {},
  isRefreshing: false,

  openTabFromContent: ({ name, path, content, fileHandle, isUntitled }) => {
    const existing = get().tabs.find((t) => t.path === path && !isUntitled);
    if (existing) {
      set({ activeTabId: existing.id });
      return;
    }
    const id = `tab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const tab: EditorTab = {
      id,
      name,
      path,
      language: detectLanguage(name),
      content,
      originalContent: content,
      isDirty: false,
      fileHandle,
      isUntitled: !!isUntitled,
    };
    set((state) => ({ tabs: [...state.tabs, tab], activeTabId: id }));
  },

  createUntitledTab: () => {
    untitledCounter += 1;
    const name = `Untitled-${untitledCounter}`;
    get().openTabFromContent({ name, path: `untitled://${name}`, content: "", isUntitled: true });
  },

  closeTab: (id) => {
    set((state) => {
      const idx = state.tabs.findIndex((t) => t.id === id);
      if (idx === -1) return state;
      const newTabs = state.tabs.filter((t) => t.id !== id);
      let newActive = state.activeTabId;
      if (state.activeTabId === id) {
        const fallback = newTabs[idx] || newTabs[idx - 1];
        newActive = fallback ? fallback.id : null;
      }
      return { tabs: newTabs, activeTabId: newActive };
    });
  },

  setActiveTab: (id) => set({ activeTabId: id }),

  updateTabContent: (id, content) => {
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === id ? { ...t, content, isDirty: content !== t.originalContent } : t
      ),
    }));
  },

  markTabSaved: (id, fileHandle, newName, newPath) => {
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === id
          ? {
              ...t,
              originalContent: t.content,
              isDirty: false,
              fileHandle: fileHandle ?? t.fileHandle,
              name: newName ?? t.name,
              path: newPath ?? t.path,
              isUntitled: false,
              language: newName ? detectLanguage(newName) : t.language,
            }
          : t
      ),
    }));
  },

  setRootNode: (node) => set({ rootNode: node, expandedPaths: {} }),

  updateNodeChildren: (nodeId, children) => {
    const attach = (node: FileTreeNode): FileTreeNode => {
      if (node.id === nodeId) {
        return { ...node, children, childrenLoaded: true };
      }
      if (node.children) {
        return { ...node, children: node.children.map(attach) };
      }
      return node;
    };
    set((state) => ({ rootNode: state.rootNode ? attach(state.rootNode) : null }));
  },

  setExpanded: (path, expanded) => {
    set((state) => ({ expandedPaths: { ...state.expandedPaths, [path]: expanded } }));
  },

  /** Re-reads a single directory's children from disk (used right after creating a file/folder in it). */
  refreshNode: async (node) => {
    if (node.kind !== "directory") return;
    const children = await loadChildren(node);
    get().updateNodeChildren(node.id, children);
  },

  /** Re-reads the whole tree from disk, recursing into every currently-expanded directory.
   *  Node ids are regenerated on every read, so expansion state is tracked by path instead. */
  refreshTree: async () => {
    const { rootNode, expandedPaths } = get();
    if (!rootNode) return;
    set({ isRefreshing: true });
    try {
      const rebuild = async (node: FileTreeNode): Promise<FileTreeNode> => {
        if (node.kind !== "directory") return node;
        const shouldLoad = node.path === rootNode.path || expandedPaths[node.path];
        if (!shouldLoad) return node;
        const freshChildren = await loadChildren(node);
        const rebuiltChildren = await Promise.all(freshChildren.map(rebuild));
        return { ...node, children: rebuiltChildren, childrenLoaded: true };
      };
      const newRoot = await rebuild(rootNode);
      set({ rootNode: newRoot });
    } finally {
      set({ isRefreshing: false });
    }
  },

  toggleTheme: () => set((state) => ({ theme: state.theme === "vs-dark" ? "light" : "vs-dark" })),

  showToast: (message, kind = "info") => set({ toast: { message, kind } }),
  clearToast: () => set({ toast: null }),
}));
