import useAuthStore from "../../store/useAuthStore";

const MessageBubble = ({ message }) => {
  const { user } = useAuthStore();

  const isOwnMessage =
    String(message.senderId) === String(user?._id);

  return (
    <div
      className={`flex ${
        isOwnMessage
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className="max-w-[70%] px-4 py-3 rounded-2xl"
        style={{
          backgroundColor: isOwnMessage
            ? "var(--accent)"
            : "var(--bg-secondary)",
          color: isOwnMessage
            ? "#fff"
            : "var(--text-primary)",
        }}
      >
        {/* Image */}
        {message.image && (
          <img
            src={message.image}
            alt="message"
            className="rounded-xl mb-2 max-h-[300px]"
          />
        )}

        {/* Text */}
        {message.text && (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.text}
          </p>
        )}

        {/* Time */}
        <p
          className="text-[11px] mt-1 text-right opacity-70"
        >
          {new Date(message.createdAt).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;