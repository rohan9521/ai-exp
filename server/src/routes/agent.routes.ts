import { Router, Request, Response } from "express";
import { generatePlan } from "../services/agent.service.js";
import {
  createProjectStructure,
  ensureWorkspaceExists,
  writeFiles
} from "../services/file.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { Plan } from "../schemas/plan.schema.js";
import { runCommands } from "../services/exce.service.js";
import { streamProjectArchive } from "../services/archive.service.js";
import { publishProjectToGitHub } from "../services/github.service.js";
import { startPreview } from "../services/preview.service.js";
import {
  ensureProjectRepo,
  getProjectGitState
} from "../services/project-git.service.js";

const router = Router();

let currentPlan: Plan | null = null;
let projectId: string | null = null;

// Generate Plan
router.post(
  "/generate",
  asyncHandler(async (req: Request, res: Response) => {
    const { prompt } = req.body;

    if (!prompt) {
      throw new AppError("Prompt is required", 400);
    }

    const plan = await generatePlan(prompt);

    currentPlan = plan;
    projectId = "project-" + Date.now();

    res.json({
      ...plan,
      projectId
    });
  })
);

// Confirm & Build
router.post(
  "/confirm",
  asyncHandler(async (_req: Request, res: Response) => {
    if (!currentPlan || !projectId) {
      throw new AppError("No plan generated yet", 400);
    }

    await createProjectStructure(projectId, currentPlan.folders);
    await writeFiles(projectId, currentPlan.files);

    await runCommands(projectId, currentPlan.commands);
    const git = await ensureProjectRepo(projectId);

    res.json({
      status: "created",
      projectId,
      git
    });
  })
);

router.get(
  "/git/:projectId",
  asyncHandler(async (req: Request, res: Response) => {
    const { projectId: requestedProjectId } = req.params;

    await ensureWorkspaceExists(requestedProjectId);

    res.json(await getProjectGitState(requestedProjectId));
  })
);

router.get(
  "/download/:projectId",
  asyncHandler(async (req: Request, res: Response) => {
    const { projectId: requestedProjectId } = req.params;

    await ensureWorkspaceExists(requestedProjectId);
    await streamProjectArchive(requestedProjectId, res);
  })
);

router.post(
  "/preview",
  asyncHandler(async (req: Request, res: Response) => {
    const { projectId: requestedProjectId } = req.body;

    if (!requestedProjectId) {
      throw new AppError("Project ID is required", 400);
    }

    await ensureWorkspaceExists(requestedProjectId);

    const preview = await startPreview(requestedProjectId);

    res.json(preview);
  })
);

router.post(
  "/publish",
  asyncHandler(async (req: Request, res: Response) => {
    const {
      projectId: requestedProjectId,
      username,
      token,
      repoName
    } = req.body;

    if (!requestedProjectId || !username || !token || !repoName) {
      throw new AppError("Project ID, username, token, and repo name are required", 400);
    }

    await ensureWorkspaceExists(requestedProjectId);

    const result = await publishProjectToGitHub({
      projectId: requestedProjectId,
      username,
      token,
      repoName
    });

    res.json({
      status: "published",
      ...result
    });
  })
);

export default router;
