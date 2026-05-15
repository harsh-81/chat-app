import Sidebar from "../components/chat/Sidebar";
import ChatContainer from "../components/chat/ChatContainer";

const HomePage = () => {
  return (
    <div
      className="h-screen flex"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Chat Area */}
      <ChatContainer />
    </div>
  );
};

export default HomePage;