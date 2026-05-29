"use client";
import { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../app/ClientProviders";
import { USER_KEY } from "../lib/constants";
import { primaryButton } from "../lib/styles";

export default function AuthModal({ type = "login", onClose, reason }) {
  const { darkMode } = useContext(DarkModeContext);

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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const base = process.env.NEXT_PUBLIC_API_URL;
    const url = type === "login" ? `${base}/login` : `${base}/register`;
    const body = type === "login"
      ? { email, password }
      : { firstName: name, lastName, email, phone, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong.");
        return;
      }

      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      onClose();
    } catch {
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();
      setResetMessage(data.message);
    } catch {
      setResetMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-2.5 rounded-lg border-2 outline-none transition-all duration-200 ${
    darkMode
      ? "bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-[#65F0CD]"
      : "bg-white border-[#1E3D2A]/20 text-[#1E3D2A] placeholder-[#1E3D2A]/40 focus:border-[#1E3D2A]"
  }`;

  const buttonClass = `w-full py-2.5 rounded-lg font-semibold transition-all duration-200 border-2 ${primaryButton(darkMode)}`;

  const linkClass = `mt-4 text-sm cursor-pointer text-center ${
    darkMode ? "text-[#65F0CD] hover:text-white" : "text-[#1E3D2A] hover:text-[#0f2116]"
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className={`w-[92%] max-w-md rounded-2xl shadow-2xl p-8 relative ${
        darkMode ? "bg-[#210E4A] text-white" : "bg-white text-[#1E3D2A]"
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-xl transition hover:scale-110 ${
            darkMode ? "text-white/50 hover:text-white" : "text-[#1E3D2A]/40 hover:text-[#1E3D2A]"
          }`}
        >
          ✕
        </button>

        {!showReset ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center font-caveat">
              {type === "login" ? "Welcome Back" : "Create Account"}
            </h2>

            {type === "register" && reason === "badge" && (
              <div className={`mb-4 px-4 py-3 rounded-xl text-sm text-center font-comic ${
                darkMode
                  ? "bg-[#65F0CD]/10 text-[#65F0CD] border border-[#65F0CD]/20"
                  : "bg-[#2D6A4F]/8 text-[#2D6A4F] border border-[#2D6A4F]/20"
              }`}>
                🏆 Create your free account to earn your plant badge and save your results!
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {type === "register" && (
                <>
                  <input placeholder="First Name" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
                  <input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required className={inputClass} />
                  <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className={inputClass} />
                </>
              )}
              <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
              <div className="relative w-full">
                <input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#18FFC9] hover:opacity-80"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>

              <button type="submit" disabled={loading} className={`mt-2 ${buttonClass} disabled:opacity-60`}>
                {loading ? "Please wait..." : type === "login" ? "Login" : "Register"}
              </button>
            </form>

            {type === "login" && (
              <p className={linkClass} onClick={() => setShowReset(true)}>
                Forgot your password?
              </p>
            )}

            {message && <p className="mt-4 text-sm text-center text-red-400">{message}</p>}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center font-caveat">Reset Password</h2>

            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <input placeholder="Enter your email" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required className={inputClass} />
              <button type="submit" disabled={loading} className={buttonClass}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            {resetMessage && <p className="mt-4 text-sm text-center text-green-400">{resetMessage}</p>}

            <p className={linkClass} onClick={() => setShowReset(false)}>
              Back to Login
            </p>
          </>
        )}
      </div>
    </div>
  );
}
