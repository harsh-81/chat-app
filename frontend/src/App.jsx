import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/useAuthStore.js";
import useSocketStore from "./store/useSocketStore.js";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

const App = () => {
  const { user, checkAuth, isCheckingAuth } = useAuthStore();
  const { setupListeners, removeListeners } = useSocketStore();

  // Check if user is logged in on page load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Setup socket listeners when user logs in
  useEffect(() => {
    if (user) {
      setupListeners();
    } else {
      removeListeners();
    }
  }, [user, setupListeners, removeListeners]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 text-white">
      <Toaster position="top-center" />
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
};

export default App;