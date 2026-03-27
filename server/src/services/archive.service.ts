import archiver from "archiver";
import { Response } from "express";
import { getWorkspace } from "../utils/workspace.js";

export async function streamProjectArchive(projectId: string, res: Response) {
  const workspace = getWorkspace(projectId);

  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${projectId}.zip"`
  );

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (error) => {
    throw error;
  });

  archive.pipe(res);
  archive.directory(workspace, false);
  await archive.finalize();
}
