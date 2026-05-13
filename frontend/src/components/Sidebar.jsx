export default function Sidebar({ user, sessions, activeId, onSelect, onNewChat, onClose, onSignOut }) {
    return (
      <div style={{
        height: "100%", display: "flex", flexDirection: "column",
        background: "rgba(255,255,255,0.97)",
        borderRight: "1px solid rgba(59,91,219,0.10)",
      }}>
        {/* User profile */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 16px 12px",
          borderBottom: "1px solid rgba(59,91,219,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 14, flexShrink: 0,
              background: "linear-gradient(135deg,#5b7fff,#3b5bdb)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: "#1a2240",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name}
              </p>
              <p style={{ fontSize: 12, color: "#9ca3af",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginLeft: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer", color: "#9ca3af",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
  
        {/* New Chat */}
        <div style={{ padding: "12px 16px" }}>
          <button onClick={onNewChat} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, padding: "10px 0", borderRadius: 16,
            fontWeight: 700, color: "white", fontSize: 14, border: "none",
            background: "linear-gradient(135deg,#5b7fff,#3b5bdb)",
            boxShadow: "0 4px 16px rgba(59,91,219,0.28)", cursor: "pointer",
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Chat
          </button>
        </div>
  
        {/* Sessions list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px",
          WebkitOverflowScrolling: "touch" }}>
          {sessions.length === 0 ? (
            <p style={{ fontSize: 12, textAlign: "center", marginTop: 32, color: "#b8c4d8" }}>
              No previous chats yet
            </p>
          ) : (
            <>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", marginBottom: 8, color: "#b8c4d8",
              }}>Previous Chats</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {sessions.map((s) => {
                  const active = s.id === activeId;
                  return (
                    <button key={s.id} onClick={() => onSelect(s.id)} style={{
                      width: "100%", textAlign: "left",
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "10px 12px", borderRadius: 12,
                      background: active ? "rgba(59,91,219,0.07)" : "transparent",
                      border: active ? "1px solid rgba(59,91,219,0.18)" : "1px solid transparent",
                      cursor: "pointer", transition: "background 0.15s",
                    }}>
                      <svg style={{ flexShrink: 0, marginTop: 2 }} width="13" height="13"
                        viewBox="0 0 24 24" fill="none"
                        stroke={active ? "#3b5bdb" : "#b8c4d8"}
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          fontSize: 13, fontWeight: 500,
                          color: active ? "#3b5bdb" : "#374151",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>{s.title}</p>
                        <p style={{ fontSize: 11, marginTop: 2, color: "#9ca3af" }}>{s.timeAgo}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
  
        {/* Sign out */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(59,91,219,0.08)" }}>
          <button onClick={onSignOut} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 8,
            padding: "8px 12px", borderRadius: 12, fontSize: 13, fontWeight: 500,
            color: "#ef4444", background: "none", border: "none", cursor: "pointer",
            transition: "background 0.15s",
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>
      </div>
    );
  }