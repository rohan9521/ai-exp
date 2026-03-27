import { Message as MessageType } from "../../types/agent.types";

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  return (
    <article className={`message-card message-card--${message.role}`}>
      <div className="message-card__meta">
        <span>{message.role === "user" ? "You" : "Agent"}</span>
      </div>
      <p>{message.content}</p>
    </article>
  );
}
