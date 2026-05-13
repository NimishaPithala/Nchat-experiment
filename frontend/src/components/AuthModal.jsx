import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthModal({ onClose }) {
  const [mode,     setMode]     = useState("login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [error,    setError]    = useState("");
  const [msg,      setMsg]      = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMsg(""); setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      });
      if (error) setError(error.message);
      else setMsg("✅ Check your email to confirm your account!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else onClose();
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(20,30,70,0.35)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Card */}
      <div
        className="w-full relative"
        style={{
          maxWidth: 400,
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(24px)",
          borderRadius: 24,
          border: "1.5px solid rgba(59,91,219,0.14)",
          boxShadow: "0 20px 70px rgba(59,91,219,0.18)",
          padding: "clamp(24px,5vw,40px)",
          animation: "fadeUp 0.3s ease both",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            width: 30, height: 30, borderRadius: 10,
            background: "rgba(59,91,219,0.07)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#9ca3af", fontSize: 18, lineHeight: 1,
          }}
        >×</button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: "linear-gradient(135deg,#5b7fff,#3b5bdb)",
            boxShadow: "0 6px 24px rgba(59,91,219,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 800, fontSize: 22, marginBottom: 10,
          }}>N</div>
          <h1 style={{ color: "#2c3fd6", fontWeight: 800, fontSize: 22 }}>Nchat</h1>
          <p style={{ color: "#7a8fb0", fontSize: 13, marginTop: 4 }}>
            {mode === "login" ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, padding: "12px 0", borderRadius: 16, fontWeight: 600, fontSize: 14,
            background: "white", border: "1.5px solid rgba(59,91,219,0.15)",
            color: "#374151", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            cursor: "pointer", marginBottom: 16, transition: "box-shadow 0.2s",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(59,91,219,0.10)" }}/>
          <span style={{ color: "#b0bcd4", fontSize: 12, fontWeight: 500 }}>or</span>
          <div style={{ flex: 1, height: 1, background: "rgba(59,91,219,0.10)" }}/>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mode === "signup" && (
            <input
              type="text" placeholder="Your name" value={name}
              onChange={(e) => setName(e.target.value)} required
              style={{
                width: "100%", outline: "none", borderRadius: 12,
                padding: "12px 16px", fontSize: 14, fontWeight: 500,
                background: "rgba(59,91,219,0.05)",
                border: "1.5px solid rgba(59,91,219,0.12)", color: "#1a2240",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
              }}
            />
          )}
          <input
            type="email" placeholder="Email address" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            style={{
              width: "100%", outline: "none", borderRadius: 12,
              padding: "12px 16px", fontSize: 14, fontWeight: 500,
              background: "rgba(59,91,219,0.05)",
              border: "1.5px solid rgba(59,91,219,0.12)", color: "#1a2240",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required minLength={6}
            style={{
              width: "100%", outline: "none", borderRadius: 12,
              padding: "12px 16px", fontSize: 14, fontWeight: 500,
              background: "rgba(59,91,219,0.05)",
              border: "1.5px solid rgba(59,91,219,0.12)", color: "#1a2240",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}
          />

          {error && <p style={{ color: "#ef4444", fontSize: 12, fontWeight: 500, padding: "0 4px" }}>{error}</p>}
          {msg   && <p style={{ color: "#22c55e", fontSize: 12, fontWeight: 500, padding: "0 4px" }}>{msg}</p>}

          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "13px 0", borderRadius: 16,
              fontWeight: 700, fontSize: 14, color: "white", border: "none",
              background: "linear-gradient(135deg,#5b7fff,#3b5bdb)",
              boxShadow: "0 4px 18px rgba(59,91,219,0.30)",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: 4,
            }}
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, marginTop: 16, color: "#7a8fb0" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMsg(""); }}
            style={{ color: "#3b5bdb", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}