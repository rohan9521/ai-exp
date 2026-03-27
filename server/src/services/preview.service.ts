import fs from "fs-extra";
import { ChildProcess, spawn } from "child_process";
import { getWorkspace } from "../utils/workspace.js";
import { io } from "../index.js";

interface PreviewSession {
  port: number;
  url: string;
  process: ChildProcess;
}

const previewSessions = new Map<string, PreviewSession>();
let nextPort = 4173;

export async function startPreview(projectId: string) {
  const existingSession = previewSessions.get(projectId);

  if (existingSession && !existingSession.process.killed) {
    return {
      previewUrl: existingSession.url
    };
  }

  const workspace = getWorkspace(projectId);
  const packageJsonExists = await fs.pathExists(`${workspace}/package.json`);

  if (!packageJsonExists) {
    throw new Error("No package.json found for preview.");
  }

  const port = nextPort++;
  const url = `http://127.0.0.1:${port}`;

  const child = spawn(
    "npm",
    ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port)],
    {
      cwd: workspace,
      env: { ...process.env, BROWSER: "none" }
    }
  );

  previewSessions.set(projectId, {
    port,
    url,
    process: child
  });

  child.stdout.on("data", (data) => {
    io.emit("log", data.toString());
  });

  child.stderr.on("data", (data) => {
    io.emit("log", data.toString());
  });

  child.on("exit", () => {
    previewSessions.delete(projectId);
  });

  await waitForPreviewReady(url);

  return {
    previewUrl: url
  };
}

async function waitForPreviewReady(url: string) {
  const maxAttempts = 30;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw new Error("Preview server did not become ready in time.");
}
