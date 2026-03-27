import fs from "fs-extra";
import path from "path";
import { getWorkspace } from "../utils/workspace.js";
import { AppError } from "../utils/AppError.js";

export async function createProjectStructure(
  projectId: string,
  folders: string[]
) {
  const base = getWorkspace(projectId);

  await fs.mkdir(base, { recursive: true });

  for (const folder of folders) {
    await fs.mkdir(path.join(base, folder), { recursive: true });
  }
}

export async function writeFiles(
  projectId: string,
  files: { path: string; content: string }[]
) {
  const base = getWorkspace(projectId);

  for (const file of files) {
    await fs.outputFile(path.join(base, file.path), file.content);
  }
}

export async function ensureWorkspaceExists(projectId: string) {
  const base = getWorkspace(projectId);
  const exists = await fs.pathExists(base);

  if (!exists) {
    throw new AppError("Project workspace does not exist", 404);
  }

  return base;
}
