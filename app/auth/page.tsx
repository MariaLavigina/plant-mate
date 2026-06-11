"use client";
import { useState, useContext, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DarkModeContext } from "../ClientProviders";
import { USER_KEY, QUIZ_RESULTS_KEY } from "../../lib/constants";
import Link from "next/link";

function AuthForm() {
  const { darkMode } = useContext(DarkModeContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") === "register" ? "register" : "login";
  const redirect = searchParams.get("redirect") || "/";

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
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!email || !password) { setMessage("Please fill in all fields."); setLoading(false); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setMessage("Please enter a valid email address."); setLoading(false); return; }

    const base = process.env.NEXT_PUBLIC_API_URL;
    const url = type === "login" ? `${base}/login` : `${base}/register`;
    const body = type === "login"
      ? { email, password }
      : { firstName: name, lastName, email, phone, password };

    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setMessage(data.error || "Something went wrong."); return; }

      sessionStorage.setItem(USER_KEY, JSON.stringify({ ...data.user, token: data.token }));
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(QUIZ_RESULTS_KEY);
      sessionStorage.setItem("plant-mate-just-authed", type);
      window.dispatchEvent(new Event("plant-mate-login"));
      setSuccess(true);
      router.push(redirect);
    } catch {
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResetMessage("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      setResetMessage(data.message || "Check your email for a reset link.");
    } catch { setResetMessage("Server error. Please try again."); }
    finally { setLoading(false); }
  };

  const bg = darkMode
    ? "linear-gradient(160deg, #210E4A 0%, #5A1B27 100%)"
    : "linear-gradient(160deg, #F4E5FB 0%, #A75B2B 100%)";

  const inputClass = `w-full px-4 py-3 rounded-lg border-2 outline-none transition-all duration-200 ${
    darkMode
      ? "bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-[#65F0CD]"
      : "bg-white/30 border-white/40 text-[#210E4A] placeholder-[#210E4A]/40 focus:border-[#210E4A]"
  }`;

  const buttonClass = `w-full py-3 rounded-full font-semibold transition-all duration-200 border-2 ${
    darkMode
      ? "bg-[#65F0CD] border-[#65F0CD] text-[#210E4A] hover:bg-[#4FD4B3]"
      : "bg-[#210E4A] border-[#210E4A] text-white hover:bg-[#2D1260]"
  }`;

  const linkClass = `mt-4 text-sm cursor-pointer text-center block ${
    darkMode ? "text-[#65F0CD]/70 hover:text-[#65F0CD]" : "text-[#210E4A]/60 hover:text-[#210E4A]"
  }`;

  if (success) {
    return <div className="min-h-screen" style={{ background: bg }} />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: bg }}>
      {/* Back button */}
      <div className="p-4">
        <button onClick={() => router.back()} className={`text-sm flex items-center gap-1.5 ${darkMode ? "text-white/50 hover:text-white" : "text-[#210E4A]/50 hover:text-[#210E4A]"}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md">
          {!showReset ? (
            <>
              <h1 className={`font-caveat text-4xl font-bold mb-8 text-center ${darkMode ? "text-[#65F0CD]" : "text-[#210E4A]"}`}>
                {type === "login" ? "Welcome Back" : "Create Account"}
              </h1>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                {type === "register" && (
                  <>
                    <input placeholder="First Name" value={name} onChange={e => setName(e.target.value)} required className={inputClass} />
                    <input placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required className={inputClass} />
                    <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} required className={inputClass} />
                  </>
                )}
                <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} />
                <div className="relative">
                  <input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className={`${inputClass} pr-10`}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-[#65F0CD]" : "text-[#210E4A]/50"}`}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <span className={linkClass} onClick={() => setShowReset(true)}>Forgot your password?</span>
              )}

              <div className="mt-6 text-center">
                {type === "login" ? (
                  <Link href="/auth?type=register" className={linkClass}>Don't have an account? Register</Link>
                ) : (
                  <Link href="/auth?type=login" className={linkClass}>Already have an account? Login</Link>
                )}
              </div>

              {message && <p className="mt-4 text-sm text-center text-red-400">{message}</p>}
            </>
          ) : (
            <>
              <h1 className={`font-caveat text-4xl font-bold mb-8 text-center ${darkMode ? "text-[#65F0CD]" : "text-[#210E4A]"}`}>Reset Password</h1>
              <form onSubmit={handleReset} noValidate className="flex flex-col gap-4">
                <input placeholder="Enter your email" type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required className={inputClass} />
                <button type="submit" disabled={loading} className={buttonClass}>{loading ? "Sending..." : "Send Reset Link"}</button>
              </form>
              {resetMessage && <p className="mt-4 text-sm text-center text-green-400">{resetMessage}</p>}
              <span className={linkClass} onClick={() => setShowReset(false)}>Back to Login</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
