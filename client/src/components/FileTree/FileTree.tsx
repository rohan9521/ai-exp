import { useAppStore } from "../../store/useAppStore";

export default function FileTree() {
  const plan = useAppStore((state) => state.plan);
  const selectedFile = useAppStore((state) => state.selectedFile);
  const setSelectedFile = useAppStore((state) => state.setSelectedFile);

  if (!plan) {
    return (
      <div className="file-tree file-tree--empty">
        <div className="panel-header">
          <div>
            <p className="panel-kicker">Navigator</p>
            <h2>Files</h2>
          </div>
        </div>
        <div className="empty-state">
          <h3>No files yet</h3>
          <p>Generate a plan to browse the proposed project structure here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="file-tree">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Navigator</p>
          <h2>Project files</h2>
        </div>
      </div>

      <div className="tree-meta">
        <span>{plan.repo}</span>
        <strong>{plan.files.length} items</strong>
      </div>

      <div className="tree-list">
        {plan.files.map((file) => (
          <button
            key={file.path}
            className={`tree-item${selectedFile === file.path ? " tree-item--active" : ""}`}
            onClick={() => setSelectedFile(file.path)}
          >
            <span className="tree-item__icon">{"</>"}</span>
            <span className="tree-item__label">{file.path}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
