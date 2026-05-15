const EmptyState = () => {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="text-6xl mb-4">💬</div>

      <h2
        className="text-2xl font-bold mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        Welcome to ChatApp
      </h2>

      <p
        className="text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        Select a conversation to start chatting
      </p>
    </div>
  );
};

export default EmptyState;