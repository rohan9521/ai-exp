import ChatPanel from "./components/Chat/ChatPanel";
import FileTree from "./components/FileTree/FileTree";
import CodeEditor from "./components/Editor/CodeEditor";
import Terminal from "./components/Terminal/Terminal";
import { useSocket } from "./hooks/useSocket";
import { useAppStore } from "./store/useAppStore";

export default function App() {
  useSocket();

  const plan = useAppStore((state) => state.plan);
  const previewUrl = useAppStore((state) => state.previewUrl);
  const git = useAppStore((state) => state.git);
  const repoUrl = useAppStore((state) => state.repoUrl);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AI Delivery Workspace</p>
          <h1>Plan, inspect, and ship generated projects</h1>
        </div>

        <div className="topbar__meta">
          <div className="status-pill">
            <span className="status-pill__dot" />
            Ollama workflow
          </div>
          <div className="metric-card">
            <span>Files</span>
            <strong>{plan?.files.length ?? 0}</strong>
          </div>
          <div className="metric-card">
            <span>Commands</span>
            <strong>{plan?.commands.length ?? 0}</strong>
          </div>
          <div className="metric-card">
            <span>Preview</span>
            <strong>{previewUrl ? "Live" : "Idle"}</strong>
          </div>
        </div>
      </header>

      <main className="workspace-grid">
        <section className="panel panel--sidebar">
          <FileTree />
        </section>

        <section className="panel panel--editor">
          <CodeEditor />
        </section>

        <aside className="panel panel--chat">
          <ChatPanel />
        </aside>
      </main>

      <section className="panel panel--terminal">
        <Terminal />
      </section>

      <footer className="statusbar">
        <div className="statusbar__group">
          <span className="statusbar__item statusbar__item--accent">
            branch {git?.branch ?? "no-repo"}
          </span>
          <span className="statusbar__item">
            {git?.isClean ? "clean working tree" : "changes present"}
          </span>
          <span className="statusbar__item">
            +{git?.staged ?? 0} staged
          </span>
          <span className="statusbar__item">
            ~{git?.modified ?? 0} modified
          </span>
        </div>

        <div className="statusbar__group">
          <span className="statusbar__item">{previewUrl ? "preview live" : "preview idle"}</span>
          <span className="statusbar__item">{repoUrl ? "github connected" : "local workspace"}</span>
        </div>
      </footer>
    </div>
  );
}
