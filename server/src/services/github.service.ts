import simpleGit from "simple-git";
import { getWorkspace } from "../utils/workspace.js";
import { ensureProjectRepo, getProjectGitState } from "./project-git.service.js";

interface PublishOptions {
  projectId: string;
  username: string;
  token: string;
  repoName: string;
}

export async function publishProjectToGitHub({
  projectId,
  username,
  token,
  repoName
}: PublishOptions) {
  const owner = await getGitHubLogin(token);
  const remoteUrl = await createGitHubRepository({ token, repoName, owner });
  const workspace = getWorkspace(projectId);
  const git = simpleGit(workspace);

  await ensureProjectRepo(projectId);

  await git.addConfig("user.name", username || owner);
  await git.addConfig(
    "user.email",
    `${owner}@users.noreply.github.com`
  );

  await git.add(".");

  const status = await git.status();

  if (status.files.length > 0) {
    await git.commit("Generated project by AI Agent");
  }

  const branchSummary = await git.branchLocal();

  if (!branchSummary.all.includes("main")) {
    await git.checkoutLocalBranch("main");
  } else {
    await git.checkout("main");
  }

  const remotes = await git.getRemotes(true);
  const origin = remotes.find((remote) => remote.name === "origin");

  if (origin) {
    await git.remote(["set-url", "origin", remoteUrl]);
  } else {
    await git.addRemote("origin", remoteUrl);
  }

  const authenticatedUrl = `https://x-access-token:${encodeURIComponent(
    token
  )}@github.com/${owner}/${repoName}.git`;

  await git.raw(["push", "--set-upstream", authenticatedUrl, "main"]);

  return {
    repoUrl: remoteUrl,
    git: await getProjectGitState(projectId)
  };
}

async function createGitHubRepository({
  token,
  repoName,
  owner
}: {
  token: string;
  repoName: string;
  owner: string;
}) {
  const response = await fetch("https://api.github.com/user/repos", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "ai-agent"
    },
    body: JSON.stringify({
      name: repoName,
      private: false,
      auto_init: false
    })
  });

  if (!response.ok && response.status !== 422) {
    const errorText = await response.text();
    throw new Error(`GitHub repo creation failed: ${errorText}`);
  }

  return `https://github.com/${owner}/${repoName}.git`;
}

async function getGitHubLogin(token: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "ai-agent"
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub authentication failed: ${errorText}`);
  }

  const data = (await response.json()) as { login: string };
  return data.login;
}
