export interface FileItem {
  path: string;
  content: string;
}

export interface Plan {
  projectId: string;
  repo: string;
  folders: string[];
  files: FileItem[];
  commands: string[];
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ConfirmResponse {
  status: string;
  projectId: string;
  git: GitState;
}

export interface PreviewResponse {
  previewUrl: string;
}

export interface PublishResponse {
  status: string;
  repoUrl: string;
  git: GitState;
}

export interface GitState {
  branch: string;
  hasRepo: boolean;
  ahead: number;
  behind: number;
  modified: number;
  staged: number;
  created: number;
  deleted: number;
  isClean: boolean;
}
