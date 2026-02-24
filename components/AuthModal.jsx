"use client"
import { useState, useEffect } from "react";

export default function AuthModal({ type = "login", onClose }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const url =
      type === "login"
        ? "http://localhost:5000/login"
        : "http://localhost:5000/register";

    const body =
      type === "login"
        ? { email, password }
        : { name, lastName, email, phone, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok && type === "login") {
        localStorage.setItem("user", JSON.stringify(data.user));
        onClose();
      }
    } catch (err) {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetMessage("");

    try {
      const res = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();
      setResetMessage(data.message);
    } catch (err) {
      setResetMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center 
                    bg-black/70 backdrop-blur-sm animate-fadeIn">
     <div className="bg-white dark:bg-gray-800 w-[92%] max-w-md rounded-2xl shadow-2xl p-8 relative 
                text-gray-900 dark:text-gray-100 transform animate-scaleIn transition-all">


        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 
                     hover:text-gray-700 dark:hover:text-white
                     text-xl transition"
        >
          ✕
        </button>

        {!showReset ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {type === "login" ? "Welcome Back" : "Create Account"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {type === "register" && (
                <>
                  <input
                    placeholder="First Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input"
                  />
                  <input
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="input"
                  />
                  <input
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="input"
                  />
                </>
              )}

              <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
              />

              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-blue-600 hover:bg-blue-700 
                           text-white py-2.5 rounded-lg 
                           font-medium transition duration-200
                           disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : type === "login"
                  ? "Login"
                  : "Register"}
              </button>
            </form>

            {type === "login" && (
              <p
                className="mt-4 text-sm text-blue-600 
                           hover:underline cursor-pointer text-center"
                onClick={() => setShowReset(true)}
              >
                Forgot your password?
              </p>
            )}

            {message && (
              <p className="mt-4 text-sm text-center text-red-500">
                {message}
              </p>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Reset Password
            </h2>

            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <input
                placeholder="Enter your email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="input"
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 
                           text-white py-2.5 rounded-lg 
                           font-medium transition duration-200"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            {resetMessage && (
              <p className="mt-4 text-sm text-center text-green-500">
                {resetMessage}
              </p>
            )}

            <p
              className="mt-4 text-sm text-blue-600 
                         hover:underline cursor-pointer text-center"
              onClick={() => setShowReset(false)}
            >
              Back to Login
            </p>
          </>
        )}
      </div>
    </div>
  );
}
