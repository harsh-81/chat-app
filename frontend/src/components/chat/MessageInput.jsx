import { useState } from "react";
import useChatStore from "../../store/useChatStore";

const MessageInput = () => {
  const {
    activeConversation,
    sendMessage,
  } = useChatStore();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim() && !image) return;

    const formData = new FormData();

    formData.append("text", text);

    if (image) {
      formData.append("image", image);
    }

    const receiverId =
      activeConversation.participants?.find(
        (p) =>
          p._id !==
          activeConversation.currentUserId
      )?._id;

    await sendMessage(receiverId, formData);

    setText("");
    setImage(null);
  };

  return (
    <form
      onSubmit={handleSend}
      className="p-4 border-t flex items-center gap-3"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      {/* Image Upload */}
      <label
        className="cursor-pointer text-xl"
        style={{ color: "var(--text-secondary)" }}
      >
        📎
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </label>

      {/* Input */}
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        className="flex-1 px-4 py-3 rounded-xl outline-none"
        style={{
          backgroundColor: "var(--bg-input)",
          color: "var(--text-primary)",
        }}
      />

      {/* Send Button */}
      <button
        type="submit"
        className="px-5 py-3 rounded-xl font-semibold"
        style={{
          backgroundColor: "var(--accent)",
          color: "#fff",
        }}
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;