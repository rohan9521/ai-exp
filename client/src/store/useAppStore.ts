import { create } from "zustand";
import { GitState, Plan, Message } from "../types/agent.types";

interface AppState {
  messages: Message[];
  plan: Plan | null;
  logs: string[];
  selectedFile: string | null;
  projectId: string | null;
  previewUrl: string | null;
  editorView: "code" | "preview";
  repoUrl: string | null;
  git: GitState | null;

  addMessage: (msg: Message) => void;
  setPlan: (plan: Plan | null) => void;
  addLog: (log: string) => void;
  setSelectedFile: (path: string) => void;
  setProjectId: (projectId: string | null) => void;
  setPreviewUrl: (previewUrl: string | null) => void;
  setEditorView: (editorView: "code" | "preview") => void;
  setRepoUrl: (repoUrl: string | null) => void;
  setGit: (git: GitState | null) => void;
  resetLogs: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  messages: [],
  plan: null,
  logs: [],
  selectedFile: null,
  projectId: null,
  previewUrl: null,
  editorView: "code",
  repoUrl: null,
  git: null,

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg]
    })),

  setPlan: (plan) =>
    set({
      plan,
      selectedFile: plan?.files[0]?.path ?? null,
      projectId: plan?.projectId ?? null,
      previewUrl: null,
      editorView: "code",
      repoUrl: null,
      git: null,
      logs: []
    }),

  addLog: (log) =>
    set((state) => ({
      logs: [...state.logs, log]
    })),

  setSelectedFile: (selectedFile) => set({ selectedFile }),

  setProjectId: (projectId) => set({ projectId }),

  setPreviewUrl: (previewUrl) => set({ previewUrl }),

  setEditorView: (editorView) => set({ editorView }),

  setRepoUrl: (repoUrl) => set({ repoUrl }),

  setGit: (git) => set({ git }),

  resetLogs: () => set({ logs: [] })
}));
