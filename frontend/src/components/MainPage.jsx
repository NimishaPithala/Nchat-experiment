
import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";
import InputBox      from "./InputBox";
import MessageBubble from "./MessageBubble";
import Sidebar       from "./Sidebar";
import AuthModal     from "./AuthModal";

function makeId() { return Math.random().toString(36).slice(2, 10); }

function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const BG = "linear-gradient(160deg,#dde8f8 0%,#e8eef8 25%,#eef0fb 55%,#e8e8f5 100%)";

export default function MainPage({ user }) {
  const [messages,      setMessages]      = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [sessions,      setSessions]      = useState([]);
  const [activeId,      setActiveId]      = useState(null);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const bottomRef   = useRef(null);
  const activeIdRef = useRef(null);
  const isEmpty     = messages.length === 0;

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const h = (e) => {
      if (!e.target.closest("#nc-sidebar") && !e.target.closest("#nc-menu-btn"))
        setSidebarOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [sidebarOpen]);

  useEffect(() => {
    if (!user) { setSessions([]); return; }
    loadSessionsFromDB();
  }, [user]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/ping`)
      .catch(() => {});
  }, []);

  const loadSessionsFromDB = async () => {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("id, title, created_at, messages")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) { console.error("Load sessions error:", error); return; }
    const mapped = (data || []).map((row) => ({
      id:       row.id,
      title:    row.title,
      messages: row.messages || [],
      ts:       new Date(row.created_at).getTime(),
    }));
    setSessions(mapped);
  };

  const saveSessionToDB = async (sessionId, title, msgs) => {
    if (!user) return;
    await supabase
      .from("chat_sessions")
      .upsert({
        id:         sessionId,
        user_id:    user.id,
        title:      title,
        messages:   msgs,
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" });
  };

  const loadSession = useCallback((id) => {
    const s = sessions.find((x) => x.id === id);
    if (s) { setMessages(s.messages); setActiveId(id); setSidebarOpen(false); }
  }, [sessions]);

  const startNewChat = useCallback(() => {
    setMessages([]); setActiveId(null); setSidebarOpen(false);
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setMessages([]);
    setSessions([]);
    setActiveId(null);
    setSidebarOpen(false);
  };

  const sendMessage = async (text, attachments = []) => {
    if (loading) return;

    const userMsg = {
      role: "user",
      content: text,
      attachments: attachments.map(({ name, mimeType, preview }) => ({
        name, mimeType, preview,
      })),
    };

    const nextMessages        = [...messages, userMsg];
    const placeholderMessages = [...nextMessages, { role: "assistant", content: "" }];

    let sid            = activeIdRef.current;
    let sessionTitle   = text.length > 44 ? text.slice(0, 44) + "..." : text;
    const isNewSession = !sid;

    if (isNewSession) sid = makeId();

    const fetchPromise = fetch(
      `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/chat`,
      {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:     text,
          history:     nextMessages,
          attachments: attachments.map(({ name, mimeType, data }) => ({
            name, mimeType, data,
          })),
        }),
      }
    );

    setMessages(placeholderMessages);
    setLoading(true);
    setActiveId(sid);

    if (isNewSession) {
      setSessions((prev) => [{
        id:       sid,
        title:    sessionTitle,
        messages: nextMessages,
        ts:       Date.now(),
      }, ...prev]);
    }

    try {
      const res = await fetchPromise;
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder("utf-8", { fatal: false });
      let acc    = "";
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          const raw = line.slice(5).trim();
          if (raw === "[DONE]") continue;

          try {
            const parsed = JSON.parse(raw);
            if (parsed.error) {
              acc += `⚠️ ${parsed.error}`;
            } else if (parsed.t) {
              acc += parsed.t;
            }
            setMessages((prev) => {
              const u = [...prev];
              u[u.length - 1] = { role: "assistant", content: acc };
              return u;
            });
          } catch {
            // skip malformed chunks
          }
        }
      }

      const final = [...nextMessages, { role: "assistant", content: acc }];
      setSessions((prev) =>
        prev.map((s) => s.id === sid ? { ...s, messages: final } : s)
      );
      if (user) await saveSessionToDB(sid, sessionTitle, final);

    } catch (err) {
      setMessages((prev) => {
        const u = [...prev];
        u[u.length - 1] = {
          role:    "assistant",
          content: "⚠️ Could not reach the backend. Please try again.",
        };
        return u;
      });
    } finally {
      setLoading(false);
    }
  };

  const fmtSessions = sessions.map((s) => ({ ...s, timeAgo: timeAgo(s.ts) }));
  const displayName = user
    ? (user.user_metadata?.full_name || user.email?.split("@")[0] || "User")
    : null;

  return (
    <div style={{
      height: "100svh", width: "100%", display: "flex",
      flexDirection: "column", overflow: "hidden",
      background: BG, position: "relative",
    }}>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {sidebarOpen && user && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 20,
            background: "rgba(30,40,80,0.18)", backdropFilter: "blur(3px)",
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {user && (
        <div id="nc-sidebar" style={{
          position: "fixed", top: 0, left: 0, height: "100%", zIndex: 30,
          width: "min(290px, 85vw)",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: sidebarOpen ? "6px 0 32px rgba(59,91,219,0.10)" : "none",
        }}>
          <Sidebar
            user={{ name: displayName, email: user.email }}
            sessions={fmtSessions}
            activeId={activeId}
            onSelect={loadSession}
            onNewChat={startNewChat}
            onClose={() => setSidebarOpen(false)}
            onSignOut={signOut}
          />
        </div>
      )}

      {/* ══════════════════════════
          HERO / EMPTY STATE
      ══════════════════════════ */}
      {isEmpty && (
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          overflow: "hidden", position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 20px",
          }}>
            {user ? (
              <button
                id="nc-menu-btn"
                onClick={() => setSidebarOpen((v) => !v)}
                style={{
                  width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)",
                  border: "1px solid rgba(59,91,219,0.14)",
                  boxShadow: "0 2px 12px rgba(59,91,219,0.08)",
                  cursor: "pointer",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="#3b5bdb" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="3" y1="6"  x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            ) : <div />}

            {!user && (
              <button
                onClick={() => setShowAuthModal(true)}
                style={{
                  padding: "8px 20px", borderRadius: 12,
                  background: "linear-gradient(135deg,#5b7fff,#3b5bdb)",
                  color: "white", fontWeight: 600, fontSize: 14,
                  border: "none", cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(59,91,219,0.28)",
                  transition: "opacity 0.2s",
                }}
              >
                Sign In
              </button>
            )}
          </div>

          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "0 16px",
            paddingBottom: "clamp(120px,22vw,180px)",
          }}>
            <div style={{ animation: "fadeUp 0.55s ease both", textAlign: "center" }}>
              <h1 style={{
                fontSize: "clamp(3.2rem,11vw,5.5rem)",
                color: "#2c3fd6", fontWeight: 800,
                letterSpacing: "-0.025em", lineHeight: 1.0, margin: 0,
              }}>Nchat</h1>
              <p style={{
                fontSize: "clamp(0.9rem,2.5vw,1.1rem)",
                color: "#5a6a88", fontWeight: 500, marginTop: 12,
              }}>How can I help you today?</p>
            </div>
          </div>

          <div style={{
            position: "absolute", left: 0, right: 0,
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "0 16px",
            top: "50%", transform: "translateY(40px)",
            animation: "fadeUp 0.65s 0.08s ease both",
          }}>
            <div style={{ width: "100%", maxWidth: 660 }}>
              <InputBox onSend={sendMessage} loading={loading} heroMode />
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════
          CHAT STATE
      ══════════════════════════ */}
      {!isEmpty && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          <header style={{
            flexShrink: 0, display: "flex", alignItems: "center", gap: 12,
            padding: "10px 16px", minHeight: 56,
            background: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(59,91,219,0.10)",
          }}>
            {user && (
              <button
                id="nc-menu-btn"
                onClick={() => setSidebarOpen((v) => !v)}
                style={{
                  width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(135deg,#5b7fff,#3b5bdb)",
                  boxShadow: "0 3px 12px rgba(59,91,219,0.28)",
                  border: "none", cursor: "pointer",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="2.4" strokeLinecap="round">
                  <line x1="3" y1="6"  x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg,#5b7fff,#3b5bdb)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 700, fontSize: 14,
              }}>N</div>
              <span style={{ fontWeight: 700, fontSize: 18, color: "#2c3fd6" }}>Nchat</span>
            </div>

            <div style={{ flex: 1 }} />

            {!user && (
              <button
                onClick={() => setShowAuthModal(true)}
                style={{
                  padding: "7px 18px", borderRadius: 12,
                  background: "linear-gradient(135deg,#5b7fff,#3b5bdb)",
                  color: "white", fontWeight: 600, fontSize: 13,
                  border: "none", cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(59,91,219,0.28)",
                }}
              >Sign In</button>
            )}
          </header>

          {/* Messages area */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "20px 12px",
            WebkitOverflowScrolling: "touch",
          }}>
            <div style={{
              maxWidth: 768, margin: "0 auto",
              display: "flex", flexDirection: "column", gap: 16,
            }}>
              {messages.map((msg, i) => {
                const isLastMsg   = i === messages.length - 1;
                const isStreaming = loading && isLastMsg && msg.role === "assistant";
                // Find the user message that preceded this assistant message
                const prevUserMsg = msg.role === "assistant"
                  ? messages[i-1]?.content || ""
                  : "";
                return (
                  <MessageBubble
                    key={i}
                    {...msg}
                    isStreaming={isStreaming}
                  />
                );
              })}

              {/* Typing dots */}
              {loading && messages[messages.length - 1]?.content === "" && (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "linear-gradient(135deg,#5b7fff,#3b5bdb)",
                    color: "white", fontWeight: 700, fontSize: 12,
                  }}>N</div>
                  <div style={{
                    display: "flex", gap: 6, padding: "12px 16px", borderRadius: 18,
                    background: "rgba(255,255,255,0.88)",
                    border: "1px solid rgba(59,91,219,0.10)",
                  }}>
                    {[0, 1, 2].map((dot) => (
                      <span key={dot} style={{
                        width: 8, height: 8, borderRadius: "50%",
                        display: "inline-block", background: "#93a8f0",
                        animation: "bounceTyping 1.2s infinite",
                        animationDelay: `${dot * 0.18}s`,
                      }}/>
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input bar */}
          <div style={{
            flexShrink: 0, padding: "10px 12px 12px",
            background: "rgba(220,228,248,0.55)",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(59,91,219,0.08)",
          }}>
            <div style={{ maxWidth: 768, margin: "0 auto" }}>
              <InputBox onSend={sendMessage} loading={loading} />
              <p style={{
                textAlign: "center", fontSize: 11, marginTop: 6,
                color: "#8a9bbf", fontWeight: 500,
              }}>
                Nchat can make mistakes. Always verify important information.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
