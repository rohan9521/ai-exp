import { useAppStore } from "../../store/useAppStore";

export default function Terminal() {
  const logs = useAppStore((state) => state.logs);

  return (
    <div className="terminal">
      <div className="panel-header panel-header--compact">
        <div>
          <p className="panel-kicker">Runtime</p>
          <h2>Setup logs</h2>
        </div>
      </div>

      <div className="terminal__body">
        {!logs.length && (
          <div className="terminal__empty">
            Command output will stream here after you create a workspace.
          </div>
        )}

        {logs.map((log, index) => (
          <pre key={index} className="terminal__line">
            {log}
          </pre>
        ))}
      </div>
    </div>
  );
}
