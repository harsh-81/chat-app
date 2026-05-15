import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";

const RegisterPage = () => {
  const { register, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (avatarFile) data.append("avatar", avatarFile);
    await register(data);
  };

  return (
    <div
      className="min-h-screen w-full flex"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Left Panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: "var(--accent)" }}
          >
            💬
          </div>
          <span
            className="text-xl font-bold tracking-wide"
            style={{ color: "var(--text-primary)" }}
          >
            ChatApp
          </span>
        </div>

        <div>
          <h2
            className="text-4xl font-bold leading-tight mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Connect with <br />
            <span style={{ color: "var(--accent)" }}>people</span> around <br />
            the world.
          </h2>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Real-time messaging, group chats, <br /> and much more — all in one
            place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            "🔒 End-to-end secure",
            "⚡ Real-time",
            "👥 Group chats",
            "📁 File sharing",
          ].map((f) => (
            <span
              key={f}
              className="text-xs px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: "rgba(0,168,132,0.15)",
                color: "var(--accent)",
                border: "1px solid rgba(0,168,132,0.3)",
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md mx-4">
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ backgroundColor: "var(--accent)" }}
            >
              💬
            </div>
            <span
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              ChatApp
            </span>
          </div>

          <div
            className="rounded-2xl shadow-2xl"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              padding: "40px",
            }}
          >
            <div className="mb-6">
              <h1
                className="text-2xl font-bold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                Create your account
              </h1>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden cursor-pointer flex-shrink-0 flex items-center justify-center border-2"
                  style={{
                    borderColor: avatarPreview
                      ? "var(--accent)"
                      : "var(--border)",
                    backgroundColor: "var(--bg-input)",
                  }}
                  onClick={() =>
                    document.getElementById("avatarInput").click()
                  }
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">👤</span>
                  )}
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Profile photo
                  </p>
                  <p
                    className="text-xs cursor-pointer mt-0.5"
                    style={{ color: "var(--accent)" }}
                    onClick={() =>
                      document.getElementById("avatarInput").click()
                    }
                  >
                    {avatarPreview ? "Change photo" : "Upload photo (optional)"}
                  </p>
                </div>
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--accent)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--border)")
                  }
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--accent)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--border)")
                  }
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--accent)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--border)")
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all mt-2"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  opacity: isLoading ? 0.7 : 1,
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "var(--accent-hover)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "var(--accent)")
                }
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Create Account →"
                )}
              </button>
            </form>

            <p
              className="text-center text-sm mt-6"
              style={{ color: "var(--text-secondary)" }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold"
                style={{ color: "var(--accent)" }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;