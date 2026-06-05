"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import { DarkModeContext } from "../ClientProviders";
import { pageBg, primaryText } from "../../lib/styles";

export default function ResetPasswordPage() {
  const { darkMode } = useContext(DarkModeContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) router.replace("/");
  }, [token]);

  const inputClass = `w-full px-4 py-2.5 rounded-lg border-2 outline-none transition-all duration-200 ${
    darkMode
      ? "bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-[#65F0CD]"
      : "bg-white border-[#1E3D2A]/20 text-[#1E3D2A] placeholder-[#1E3D2A]/40 focus:border-[#1E3D2A]"
  }`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Something went wrong.");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.replace("/"), 3000);
    } catch {
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-screen flex flex-col ${pageBg(darkMode)}`}>
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 pt-24 pb-10">
        <div className="w-full max-w-sm">
          {success ? (
            <div className="text-center">
              <h1 className={`font-caveat text-[clamp(2rem,4vw,3rem)] mb-3 ${primaryText(darkMode)}`}>
                Password updated!
              </h1>
              <p className={`text-sm opacity-60 ${primaryText(darkMode)}`}>
                Redirecting you to the home page...
              </p>
            </div>
          ) : (
            <>
              <h1 className={`font-caveat text-[clamp(2rem,4vw,3rem)] mb-2 ${primaryText(darkMode)}`}>
                Set new password
              </h1>
              <p className={`text-sm mb-8 opacity-60 ${primaryText(darkMode)}`}>
                Choose a strong password for your account.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
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

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  className={inputClass}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-2 w-full py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode
                      ? "bg-[#65F0CD] text-[#210E4A] hover:bg-[#4FD4B3]"
                      : "bg-[#1E3D2A] text-white hover:bg-[#2D5A3D]"
                  }`}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>

              {message && (
                <p className="mt-4 text-sm text-center text-red-400">{message}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
