import simpleGit from "simple-git";
import { getWorkspace } from "../utils/workspace.js";

export interface ProjectGitState {
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

export async function ensureProjectRepo(projectId: string) {
  const workspace = getWorkspace(projectId);
  const git = simpleGit(workspace);
  const isRepo = await git.checkIsRepo();

  if (!isRepo) {
    await git.init();
    await git.addConfig("user.name", "AI Agent");
    await git.addConfig("user.email", "ai-agent@local.dev");
    await git.checkoutLocalBranch("main");
  }

  await git.add(".");

  const status = await git.status();

  if (status.files.length > 0) {
    await git.commit("Initial generated project");
  }

  return getProjectGitState(projectId);
}

export async function getProjectGitState(
  projectId: string
): Promise<ProjectGitState> {
  const workspace = getWorkspace(projectId);
  const git = simpleGit(workspace);
  const hasRepo = await git.checkIsRepo();

  if (!hasRepo) {
    return {
      branch: "no-repo",
      hasRepo: false,
      ahead: 0,
      behind: 0,
      modified: 0,
      staged: 0,
      created: 0,
      deleted: 0,
      isClean: true
    };
  }

  const branchSummary = await git.branchLocal();
  const status = await git.status();

  return {
    branch: branchSummary.current || "detached",
    hasRepo: true,
    ahead: status.ahead,
    behind: status.behind,
    modified: status.modified.length,
    staged: status.staged.length,
    created: status.created.length,
    deleted: status.deleted.length,
    isClean: status.isClean()
  };
}
