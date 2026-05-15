import useChatStore from "../../store/useChatStore";
import EmptyState from "./EmptyState";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const { activeConversation } = useChatStore();

  // If no chat selected
  if (!activeConversation) {
    return <EmptyState />;
  }

  return (
    <div
      className="flex-1 flex flex-col h-full"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Header */}
      <ChatHeader />

      {/* Messages */}
      <MessageList />

      {/* Input */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;