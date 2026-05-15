import { useEffect, useRef } from "react";
import useChatStore from "../../store/useChatStore";
import MessageBubble from "./MessageBubble";

const MessageList = () => {
  const { messages } = useChatStore();

  const bottomRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-4"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            No messages yet
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
          />
        ))
      )}

      {/* Auto scroll target */}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;