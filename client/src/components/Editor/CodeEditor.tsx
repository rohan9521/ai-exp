import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";

export default function CodeEditor() {
  const plan = useAppStore((state) => state.plan);
  const selectedFilePath = useAppStore((state) => state.selectedFile);
  const setSelectedFile = useAppStore((state) => state.setSelectedFile);
  const previewUrl = useAppStore((state) => state.previewUrl);
  const editorView = useAppStore((state) => state.editorView);
  const setEditorView = useAppStore((state) => state.setEditorView);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  if (!plan) {
    return (
      <div className="editor-shell editor-shell--empty">
        <div className="panel-header">
          <div>
            <p className="panel-kicker">Preview</p>
            <h2>Code editor</h2>
          </div>
        </div>
        <div className="empty-state">
          <h3>Nothing to preview yet</h3>
          <p>The generated files will appear here with a readable code view.</p>
        </div>
      </div>
    );
  }

  const selected =
    plan.files.find((file) => file.path === selectedFilePath) ?? plan.files[0];
  const language = getLanguageFromFile(selected?.path);
  const isPreviewMode = editorView === "preview";

  useEffect(() => {
    setIframeLoaded(false);
  }, [previewUrl, isPreviewMode]);

  return (
    <div className="editor-shell">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Preview</p>
          <h2>{isPreviewMode ? "Generated app" : "Generated code"}</h2>
        </div>

        <div className="editor-toolbar">
          <div className="view-toggle" role="tablist" aria-label="Editor view">
            <button
              className={`view-toggle__button${!isPreviewMode ? " view-toggle__button--active" : ""}`}
              onClick={() => setEditorView("code")}
            >
              Code
            </button>
            <button
              className={`view-toggle__button${isPreviewMode ? " view-toggle__button--active" : ""}`}
              onClick={() => setEditorView("preview")}
            >
              Preview
            </button>
          </div>

          {!isPreviewMode && (
            <select
              className="file-select"
              value={selected?.path ?? ""}
              onChange={(event) => setSelectedFile(event.target.value)}
            >
              {!selected && <option value="">Select file</option>}
              {plan.files.map((file) => (
                <option key={file.path} value={file.path}>
                  {file.path}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="editor-meta">
        <span>
          {isPreviewMode
            ? previewUrl ?? "Preview not started yet"
            : selected?.path ?? "No file selected"}
        </span>
        <strong>{isPreviewMode ? "live preview" : language}</strong>
      </div>

      {isPreviewMode ? (
        previewUrl ? (
          <div className="preview-shell">
            {!iframeLoaded && (
              <div className="preview-placeholder">
                <h3>Loading preview</h3>
                <p>
                  Starting the generated app in the browser frame. If it takes a few
                  seconds, check the terminal logs below.
                </p>
              </div>
            )}
            <iframe
              key={previewUrl}
              className={`preview-frame${iframeLoaded ? " preview-frame--ready" : ""}`}
              src={previewUrl}
              title="Generated app preview"
              onLoad={() => setIframeLoaded(true)}
            />
          </div>
        ) : (
          <div className="preview-placeholder">
            <h3>Preview is ready when you are</h3>
            <p>
              Use the `Open Preview` action in the Agent Console to launch the generated
              app here, then switch back to `Code` any time.
            </p>
          </div>
        )
      ) : (
        <Editor
          height="100%"
          language={language}
          value={selected?.content ?? ""}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbersMinChars: 3,
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true
          }}
        />
      )}
    </div>
  );
}

function getLanguageFromFile(filePath?: string) {
  if (!filePath) return "plaintext";

  const extension = filePath.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "ts":
    case "tsx":
      return "typescript";
    case "js":
    case "jsx":
      return "javascript";
    case "json":
      return "json";
    case "css":
      return "css";
    case "html":
      return "html";
    case "md":
      return "markdown";
    default:
      return "plaintext";
  }
}
