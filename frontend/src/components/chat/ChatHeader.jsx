import useAuthStore from "../../store/useAuthStore";
import useChatStore from "../../store/useChatStore";

const ChatHeader = () => {
  const { user } = useAuthStore();
  const { activeConversation, onlineUsers } = useChatStore();

  if (!activeConversation) return null;

  const otherUser = activeConversation.isGroup
    ? null
    : activeConversation.participants?.find(
        (p) => p._id !== user?._id
      );

  const isOnline = otherUser
    ? onlineUsers.includes(otherUser._id)
    : false;

  return (
    <div
      className="h-20 px-6 border-b flex items-center justify-between"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center gap-4">
        <img
          src={
            activeConversation.isGroup
              ? activeConversation.groupAvatar ||
                "https://placehold.co/100x100"
              : otherUser?.avatar ||
                "https://placehold.co/100x100"
          }
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover"
        />

        <div>
          <h2
            className="font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {activeConversation.isGroup
              ? activeConversation.groupName
              : otherUser?.fullName}
          </h2>

          <p
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {activeConversation.isGroup
              ? `${activeConversation.participants?.length} members`
              : isOnline
              ? "Online"
              : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;