import useAuthStore from "../../store/useAuthStore";
import useChatStore from "../../store/useChatStore";

const ConversationItem = ({ conversation }) => {
  const { user } = useAuthStore();

  const {
    activeConversation,
    setActiveConversation,
    onlineUsers,
    getMessages,
  } = useChatStore();

  // Find other user in personal chat
  const otherUser = conversation.isGroup
    ? null
    : conversation.participants?.find(
        (p) => p._id !== user?._id
      );

  const isOnline = otherUser
    ? onlineUsers.includes(otherUser._id)
    : false;

  const isActive =
    activeConversation?._id === conversation._id;

  const handleSelect = async () => {
    setActiveConversation(conversation);

    if (!conversation.isGroup && otherUser) {
      await getMessages(otherUser._id);
    }
  };

  return (
    <div
      onClick={handleSelect}
      className="flex items-center gap-3 p-4 cursor-pointer transition-all"
      style={{
        backgroundColor: isActive
          ? "var(--bg-input)"
          : "transparent",
      }}
    >
      {/* Avatar */}
      <div className="relative">
        <img
          src={
            conversation.isGroup
              ? conversation.groupAvatar ||
                "https://placehold.co/100x100"
              : otherUser?.avatar ||
                "https://placehold.co/100x100"
          }
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover"
        />

        {/* Online Dot */}
        {!conversation.isGroup && isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-semibold truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {conversation.isGroup
            ? conversation.groupName
            : otherUser?.fullName}
        </h3>

        <p
          className="text-sm truncate"
          style={{ color: "var(--text-secondary)" }}
        >
          {conversation.lastMessage?.text || "No messages yet"}
        </p>
      </div>

      {/* Unread Count */}
      {conversation.unreadCount > 0 && (
        <div className="min-w-[22px] h-[22px] rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
          {conversation.unreadCount}
        </div>
      )}
    </div>
  );
};

export default ConversationItem;