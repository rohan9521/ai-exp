import axios from "axios";
import {
  ConfirmResponse,
  GitState,
  Plan,
  PreviewResponse,
  PublishResponse
} from "../types/agent.types";

const API = "http://localhost:3000/agent";

export const generatePlan = async (prompt: string) => {
  const res = await axios.post<Plan>(`${API}/generate`, { prompt });
  return res.data;
};

export const confirmPlan = async () => {
  const res = await axios.post<ConfirmResponse>(`${API}/confirm`);
  return res.data;
};

export const getDownloadUrl = (projectId: string) =>
  `${API}/download/${projectId}`;

export const startPreview = async (projectId: string) => {
  const res = await axios.post<PreviewResponse>(`${API}/preview`, { projectId });
  return res.data;
};

export const publishProject = async (payload: {
  projectId: string;
  username: string;
  token: string;
  repoName: string;
}) => {
  const res = await axios.post<PublishResponse>(`${API}/publish`, payload);
  return res.data;
};

export const getGitState = async (projectId: string) => {
  const res = await axios.get<GitState>(`${API}/git/${projectId}`);
  return res.data;
};
