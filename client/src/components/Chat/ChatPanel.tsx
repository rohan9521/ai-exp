import { useState } from "react";
import {
  confirmPlan,
  generatePlan,
  getGitState,
  getDownloadUrl,
  publishProject,
  startPreview
} from "../../api/agent.api";
import { useAppStore } from "../../store/useAppStore";
import Message from "./Message";

export default function ChatPanel() {
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isStartingPreview, setIsStartingPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [githubUsername, setGithubUsername] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [repoName, setRepoName] = useState("");

  const {
    messages,
    addMessage,
    setPlan,
    plan,
    projectId,
    previewUrl,
    repoUrl,
    setPreviewUrl,
    setEditorView,
    setRepoUrl,
    setProjectId,
    setGit
  } = useAppStore();

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    setError(null);
    addMessage({ role: "user", content: input });
    setIsGenerating(true);

    try {
      const nextPlan = await generatePlan(input);

      setPlan(nextPlan);
      setProjectId(nextPlan.projectId);
      setRepoName(nextPlan.repo);
      addMessage({
        role: "assistant",
        content: `Generated a plan for ${nextPlan.repo} with ${nextPlan.files.length} files and ${nextPlan.commands.length} setup commands. Review it, then create the workspace when it looks right.`
      });
      setInput("");
    } catch {
      setError("Could not generate a plan. Make sure the backend and Ollama are both running.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirm = async () => {
    if (!plan || isConfirming) return;

    setError(null);
    setIsConfirming(true);

    try {
      const response = await confirmPlan();
      setProjectId(response.projectId);
      setGit(response.git);
      addMessage({
        role: "assistant",
        content: `Workspace ${response.projectId} is ready as its own git repository on branch ${response.git.branch}. Live setup logs are in the terminal below.`
      });
    } catch {
      setError("Project creation failed. Check the server logs for the exact error.");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleStartPreview = async () => {
    if (!projectId || isStartingPreview) return;

    setError(null);
    setIsStartingPreview(true);

    try {
      const response = await startPreview(projectId);
      setPreviewUrl(response.previewUrl);
      setEditorView("preview");
      addMessage({
        role: "assistant",
        content: `Live preview started at ${response.previewUrl}. The editor panel has switched to the running app.`
      });
    } catch {
      setError("Preview could not be started. Make sure the project dependencies finished installing.");
    } finally {
      setIsStartingPreview(false);
    }
  };

  const handlePublish = async () => {
    if (!projectId || !repoName.trim() || !githubUsername.trim() || !githubToken.trim()) {
      setError("Enter your GitHub username, personal access token, and repository name.");
      return;
    }

    setError(null);
    setIsPublishing(true);

    try {
      const response = await publishProject({
        projectId,
        username: githubUsername.trim(),
        token: githubToken.trim(),
        repoName: repoName.trim()
      });

      setRepoUrl(response.repoUrl);
      setGit(response.git);
      addMessage({
        role: "assistant",
        content: `Project published to ${response.repoUrl}.`
      });
    } catch {
      setError("GitHub publish failed. Check that your token has repo permissions.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRefreshGit = async () => {
    if (!projectId) return;

    try {
      const gitState = await getGitState(projectId);
      setGit(gitState);
    } catch {
      setError("Could not refresh project git state.");
    }
  };

  const canUseProjectActions = Boolean(projectId);

  return (
    <div className="chat-panel">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Agent Console</p>
          <h2>Project brief</h2>
        </div>
      </div>

      <div className="chat-panel__body">
        <div className="chat-thread">
          {!messages.length && (
            <div className="empty-state">
              <h3>Start with a strong brief</h3>
              <p>
                Describe the product, stack, user flows, and any non-negotiable
                requirements. The agent will propose the structure before it writes code.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </div>

        {plan && (
          <div className="plan-card">
            <div className="plan-card__header">
              <div>
                <p className="panel-kicker">Current Plan</p>
                <h3>{plan.repo}</h3>
              </div>
              <button
                className="button button--primary"
                onClick={handleConfirm}
                disabled={isConfirming}
              >
                {isConfirming ? "Creating..." : "Create Workspace"}
              </button>
            </div>

            <div className="plan-stats">
              <div>
                <span>Folders</span>
                <strong>{plan.folders.length}</strong>
              </div>
              <div>
                <span>Files</span>
                <strong>{plan.files.length}</strong>
              </div>
              <div>
                <span>Commands</span>
                <strong>{plan.commands.length}</strong>
              </div>
            </div>

            <div className="action-grid">
              <button
                className="button button--secondary"
                onClick={handleRefreshGit}
                disabled={!canUseProjectActions}
              >
                Refresh Git
              </button>

              <button
                className="button button--secondary"
                onClick={handleStartPreview}
                disabled={!canUseProjectActions || isStartingPreview}
              >
                {isStartingPreview ? "Starting Preview..." : previewUrl ? "Restart Preview" : "Open Preview"}
              </button>

              <a
                className={`button button--secondary${canUseProjectActions ? "" : " button--disabled"}`}
                href={projectId ? getDownloadUrl(projectId) : undefined}
                download
                aria-disabled={!canUseProjectActions}
                onClick={(event) => {
                  if (!canUseProjectActions) {
                    event.preventDefault();
                  }
                }}
              >
                Download ZIP
              </a>
            </div>
          </div>
        )}

        {error && <p className="feedback feedback--error">{error}</p>}

        {canUseProjectActions && (
          <div className="github-card">
            <div className="panel-header panel-header--compact">
              <div>
                <p className="panel-kicker">GitHub</p>
                <h2>Publish project</h2>
              </div>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>GitHub username</span>
                <input
                  className="field__input"
                  value={githubUsername}
                  onChange={(event) => setGithubUsername(event.target.value)}
                  placeholder="your-username"
                />
              </label>

              <label className="field">
                <span>Personal access token</span>
                <input
                  className="field__input"
                  type="password"
                  value={githubToken}
                  onChange={(event) => setGithubToken(event.target.value)}
                  placeholder="GitHub token with repo access"
                />
              </label>

              <label className="field">
                <span>Repository name</span>
                <input
                  className="field__input"
                  value={repoName}
                  onChange={(event) => setRepoName(event.target.value)}
                  placeholder="my-react-app"
                />
              </label>
            </div>

            <button
              className="button button--primary button--block"
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? "Publishing..." : "Commit And Push To GitHub"}
            </button>

            {repoUrl && (
              <p className="feedback">
                Published repository:{" "}
                <a href={repoUrl} target="_blank" rel="noreferrer">
                  {repoUrl}
                </a>
              </p>
            )}
          </div>
        )}

        <div className="composer">
          <label className="composer__label" htmlFor="prompt">
            Prompt
          </label>
          <textarea
            id="prompt"
            className="composer__input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Build a full React project for tracking customer support tickets with authentication, charts, and a clean admin workflow."
          />
          <button
            className="button button--primary button--block"
            onClick={handleSend}
            disabled={isGenerating || !input.trim()}
          >
            {isGenerating ? "Generating Plan..." : "Generate Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}
