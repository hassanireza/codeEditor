import type { FileTreeNode } from "../types";

/** Whether the browser supports the real File System Access API (Chrome/Edge). */
export const supportsFileSystemAccess =
  typeof window !== "undefined" && "showDirectoryPicker" in window;

let idCounter = 0;
const nextId = () => `node-${++idCounter}-${Date.now()}`;

/** Opens a folder picker and returns the root tree node (top-level children pre-loaded). */
export async function openDirectory(): Promise<FileTreeNode | null> {
  if (!window.showDirectoryPicker) return null;
  const handle = await window.showDirectoryPicker({ mode: "readwrite" });
  return buildDirectoryNode(handle, handle.name);
}

export async function buildDirectoryNode(
  handle: FileSystemDirectoryHandle,
  path: string
): Promise<FileTreeNode> {
  const node: FileTreeNode = {
    id: nextId(),
    name: handle.name,
    kind: "directory",
    handle,
    path,
    children: [],
    childrenLoaded: false,
  };
  return node;
}

/** Lazily loads one level of children for a directory node (called on expand). */
export async function loadChildren(node: FileTreeNode): Promise<FileTreeNode[]> {
  if (node.kind !== "directory") return [];
  const dirHandle = node.handle as FileSystemDirectoryHandle;
  const entries: FileTreeNode[] = [];

  for await (const [name, childHandle] of (dirHandle as any).entries()) {
    // Skip common noise directories to keep the tree usable.
    if (name === "node_modules" || name === ".git" || name === "dist" || name === "build") continue;

    const childPath = `${node.path}/${name}`;
    if (childHandle.kind === "directory") {
      entries.push({
        id: nextId(),
        name,
        kind: "directory",
        handle: childHandle,
        path: childPath,
        children: [],
        childrenLoaded: false,
      });
    } else {
      entries.push({
        id: nextId(),
        name,
        kind: "file",
        handle: childHandle,
        path: childPath,
      });
    }
  }

  // Directories first, then alphabetical.
  entries.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "directory" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return entries;
}

/** Creates a new empty file inside a directory. Throws if a file/folder with that name already exists. */
export async function createFile(
  dirHandle: FileSystemDirectoryHandle,
  name: string
): Promise<FileSystemFileHandle> {
  const anyHandle = dirHandle as any;
  try {
    // getFileHandle without create throws NotFoundError if it doesn't exist yet.
    await anyHandle.getFileHandle(name);
    throw new Error(`"${name}" already exists`);
  } catch (err) {
    if ((err as Error).name !== "NotFoundError") throw err;
  }
  return anyHandle.getFileHandle(name, { create: true });
}

/** Creates a new (empty) subfolder inside a directory. Throws if a file/folder with that name already exists. */
export async function createFolder(
  dirHandle: FileSystemDirectoryHandle,
  name: string
): Promise<FileSystemDirectoryHandle> {
  const anyHandle = dirHandle as any;
  try {
    await anyHandle.getDirectoryHandle(name);
    throw new Error(`"${name}" already exists`);
  } catch (err) {
    if ((err as Error).name !== "NotFoundError") throw err;
  }
  return anyHandle.getDirectoryHandle(name, { create: true });
}

/** Opens a single-file picker (used for "Open File" outside of a project folder). */
export async function openSingleFile(): Promise<{ handle: FileSystemFileHandle; content: string; name: string } | null> {
  if (!window.showOpenFilePicker) return null;
  const [handle] = await window.showOpenFilePicker({ multiple: false });
  const file = await handle.getFile();
  const content = await file.text();
  return { handle, content, name: handle.name };
}

/** Reads the text content of a file handle. */
export async function readFile(handle: FileSystemFileHandle): Promise<string> {
  const file = await handle.getFile();
  return file.text();
}

/** Writes text content to an existing file handle. */
export async function writeFile(handle: FileSystemFileHandle, content: string): Promise<void> {
  const writable = await (handle as any).createWritable();
  await writable.write(content);
  await writable.close();
}

/** Opens a save-as picker and writes content, returning the new handle. */
export async function saveFileAs(
  content: string,
  suggestedName: string
): Promise<FileSystemFileHandle | null> {
  if (!window.showSaveFilePicker) return null;
  const handle = await window.showSaveFilePicker({ suggestedName });
  await writeFile(handle, content);
  return handle;
}

/** Fallback for browsers without the File System Access API: triggers a browser download. */
export function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Fallback for browsers without the File System Access API: reads a <input type=file>. */
export function readFileFromInput(file: File): Promise<string> {
  return file.text();
}
