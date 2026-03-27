import { spawn } from "child_process";
import { getWorkspace } from "../utils/workspace.js";
import { io } from "../index.js";

export async function runCommands(projectId: string, commands: string[]) {
  const cwd = getWorkspace(projectId);

  for (const command of commands) {
    io.emit("log", `\n$ ${command}\n`);
    await runSingleCommand(command, cwd);
  }
}

function runSingleCommand(command: string, cwd: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, {
      cwd,
      shell: true,
      env: process.env
    });

    child.stdout.on("data", (data) => {
      io.emit("log", data.toString());
    });

    child.stderr.on("data", (data) => {
      io.emit("log", data.toString());
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed: ${command}`));
    });

    child.on("error", reject);
  });
}
