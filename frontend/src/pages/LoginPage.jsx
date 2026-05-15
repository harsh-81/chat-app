import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";

const LoginPage = () => {
  const { login, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <div
      className="min-h-screen w-full flex"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* ── Left Panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        }}
      >
        {/* Logo */}
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

        {/* Center text */}
        <div>
          <h2
            className="text-4xl font-bold leading-tight mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Good to see <br />
            you{" "}
            <span style={{ color: "var(--accent)" }}>again.</span>
          </h2>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Your conversations are <br /> waiting for you.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-8">
          {[
            { value: "100%", label: "Secure" },
            { value: "Real-time", label: "Messaging" },
            { value: "Free", label: "Forever" },
          ].map((s) => (
            <div key={s.label}>
              <p
                className="text-lg font-bold"
                style={{ color: "var(--accent)" }}
              >
                {s.value}
              </p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md mx-4">

          {/* Mobile logo */}
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

          {/* Card */}
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
                Welcome back
              </h1>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
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

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Your password"
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

              {/* Submit */}
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
                    Signing in...
                  </span>
                ) : (
                  "Sign In →"
                )}
              </button>
            </form>

            <p
              className="text-center text-sm mt-6"
              style={{ color: "var(--text-secondary)" }}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold"
                style={{ color: "var(--accent)" }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;