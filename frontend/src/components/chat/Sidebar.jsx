import { useEffect } from "react";
import useChatStore from "../../store/useChatStore";
import ConversationItem from "./ConversationItem";

const Sidebar = () => {
  const {
    conversations,
    getConversations,
    isLoadingConversations,
  } = useChatStore();

  useEffect(() => {
    getConversations();
  }, []);

  return (
    <div
      className="w-[350px] h-full border-r flex flex-col"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      {/* Header */}
      <div
        className="p-5 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Chats
        </h1>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {isLoadingConversations ? (
          <p
            className="p-4 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Loading conversations...
          </p>
        ) : conversations.length === 0 ? (
          <p
            className="p-4 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            No conversations yet
          </p>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation._id}
              conversation={conversation}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;