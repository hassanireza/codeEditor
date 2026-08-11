// Extend the global scope with the (still experimental) File System Access API types
// that TypeScript's lib.dom.d.ts does not fully cover yet.
export {};

declare global {
  interface Window {
    showDirectoryPicker?: (options?: { mode?: "read" | "readwrite" }) => Promise<FileSystemDirectoryHandle>;
    showOpenFilePicker?: (options?: OpenFilePickerOptions) => Promise<FileSystemFileHandle[]>;
    showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
  }

  interface OpenFilePickerOptions {
    multiple?: boolean;
    excludeAcceptAllOption?: boolean;
    types?: { description?: string; accept: Record<string, string[]> }[];
  }

  interface SaveFilePickerOptions {
    suggestedName?: string;
    excludeAcceptAllOption?: boolean;
    types?: { description?: string; accept: Record<string, string[]> }[];
  }

  interface DataTransferItem {
    /** Chromium-only: resolves a dropped item directly to a FileSystemHandle. */
    getAsFileSystemHandle?: () => Promise<FileSystemHandle | null>;
  }
}

/** A node in the in-memory file tree, mirroring a directory on disk. */
export interface FileTreeNode {
  id: string;
  name: string;
  kind: "file" | "directory";
  handle: FileSystemFileHandle | FileSystemDirectoryHandle;
  path: string;
  children?: FileTreeNode[];
  childrenLoaded?: boolean;
}

/** An open editor tab. Tracks its own Monaco model contents + dirty state. */
export interface EditorTab {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
  originalContent: string;
  isDirty: boolean;
  /** Present only for files opened via a real handle (folder browse or single-file open). */
  fileHandle?: FileSystemFileHandle;
  /** True for "Untitled" buffers that have never been saved. */
  isUntitled: boolean;
  viewState?: unknown;
}

export type ThemeMode = "vs-dark" | "light";
