{/*
import { useState, useRef, useEffect } from "react";

const ACCEPTED = "image/*,.pdf,.txt,.csv,.json,.html,.md";

export default function InputBox({ onSend, loading, heroMode = false }) {
  const [input,  setInput]  = useState("");
  const [files,  setFiles]  = useState([]);
  const textareaRef          = useRef(null);
  const fileInputRef         = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 130) + "px";
  }, [input]);

  const readFile = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const full    = e.target.result;
      const data    = full.split(",")[1];
      const preview = file.type.startsWith("image/") ? full : null;
      resolve({ name: file.name, mimeType: file.type, data, preview });
    };
    reader.readAsDataURL(file);
  });

  const handleFiles = async (fileList) => {
    const r = await Promise.all(Array.from(fileList).map(readFile));
    setFiles((prev) => [...prev, ...r]);
  };

  const removeFile = (i) => setFiles((prev) => prev.filter((_, j) => j !== i));

  const handleSend = () => {
    if ((!input.trim() && files.length === 0) || loading) return;
    onSend(input.trim(), files);
    setInput("");
    setFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const canSend = !loading && (input.trim().length > 0 || files.length > 0);

  return (
    <div
      onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      onDragOver={(e) => e.preventDefault()}
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1.5px solid rgba(59,91,219,0.14)",
        borderRadius: heroMode ? 22 : 18,
        boxShadow: heroMode
          ? "0 8px 48px rgba(59,91,219,0.13), 0 1px 0 rgba(255,255,255,0.9) inset"
          : "0 4px 20px rgba(59,91,219,0.08)",
        overflow: "hidden",
      }}
    >
     
      {files.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 16px 4px" }}>
          {files.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 6,
              borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 500,
              background: "rgba(59,91,219,0.07)", color: "#3b5bdb",
              border: "1px solid rgba(59,91,219,0.15)", maxWidth: 170,
            }}>
              {f.preview
                ? <img src={f.preview} alt={f.name} style={{ width: 20, height: 20, borderRadius: 6, objectFit: "cover", flexShrink: 0 }}/>
                : <span style={{ flexShrink: 0 }}>📎</span>}
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
              <button onClick={() => removeFile(i)} style={{
                marginLeft: 2, fontWeight: 700, background: "none", border: "none",
                cursor: "pointer", color: "inherit", lineHeight: 1, flexShrink: 0,
              }}>×</button>
            </div>
          ))}
        </div>
      )}

     
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: heroMode ? "14px 14px" : "10px 12px",
      }}>
        <textarea
          ref={textareaRef}
          rows={1}
          style={{
            flex: 1, background: "transparent", outline: "none",
            resize: "none", border: "none",
            color: "#1a2240", lineHeight: "1.6", maxHeight: 130,
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: heroMode ? "1rem" : "0.92rem",
            fontWeight: 500,
          }}
          placeholder={heroMode ? "Type your message..." : "Ask me anything..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Attach file"
          style={{
            flexShrink: 0, width: 36, height: 36, borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent", border: "none", cursor: "pointer",
            color: "#9bb0d8", transition: "background 0.15s",
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>
        <input
          ref={fileInputRef} type="file" multiple accept={ACCEPTED}
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />

        
        <button
          onClick={handleSend} disabled={!canSend}
          style={{
            flexShrink: 0,
            width:  heroMode ? 46 : 38,
            height: heroMode ? 46 : 38,
            borderRadius: heroMode ? 15 : 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "none",
            background: canSend
              ? "linear-gradient(135deg,#5b7fff,#3b5bdb)"
              : "rgba(180,195,230,0.4)",
            boxShadow: canSend ? "0 4px 14px rgba(59,91,219,0.30)" : "none",
            cursor: canSend ? "pointer" : "not-allowed",
            transition: "all 0.2s",
          }}
        >
          {loading ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate"
                  from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite"/>
              </path>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke={canSend ? "white" : "#b0c0e0"} strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
  */}

import { useState, useRef, useEffect } from "react";

const ACCEPTED = "image/*,.pdf,.txt,.csv,.json,.html,.md";

export default function InputBox({ onSend, onTranscribe, loading, heroMode = false }) {
  const [input,       setInput]       = useState("");
  const [files,       setFiles]       = useState([]);
  const [recording,   setRecording]   = useState(false);
  const [transcribing,setTranscribing]= useState(false);
  const textareaRef    = useRef(null);
  const fileInputRef   = useRef(null);
  const mediaRecorder  = useRef(null);
  const audioChunks    = useRef([]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 130) + "px";
  }, [input]);

  const readFile = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const full    = e.target.result;
      const data    = full.split(",")[1];
      const preview = file.type.startsWith("image/") ? full : null;
      resolve({ name: file.name, mimeType: file.type, data, preview });
    };
    reader.readAsDataURL(file);
  });

  const handleFiles = async (fileList) => {
    const r = await Promise.all(Array.from(fileList).map(readFile));
    setFiles((prev) => [...prev, ...r]);
  };

  const removeFile = (i) => setFiles((prev) => prev.filter((_, j) => j !== i));

  const handleSend = () => {
    if ((!input.trim() && files.length === 0) || loading) return;
    onSend(input.trim(), files);
    setInput("");
    setFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── Voice recording ──────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Use webm format — widely supported and Groq accepts it
      const options = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? { mimeType: "audio/webm;codecs=opus" }
        : { mimeType: "audio/webm" };

      mediaRecorder.current  = new MediaRecorder(stream, options);
      audioChunks.current    = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        // Stop all tracks to release microphone
        stream.getTracks().forEach((t) => t.stop());

        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });

        // Send to backend for transcription
        setTranscribing(true);
        try {
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");

          const res = await fetch(
            `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/transcribe`,
            { method: "POST", body: formData }
          );

          if (!res.ok) throw new Error("Transcription failed");

          const { transcript } = await res.json();

          if (transcript && transcript.trim()) {
            // Put transcript in input box so user can see/edit before sending
            setInput(transcript.trim());
            // Auto focus textarea
            setTimeout(() => textareaRef.current?.focus(), 100);
          }
        } catch (err) {
          console.error("Transcription error:", err);
        } finally {
          setTranscribing(false);
        }
      };

      // Collect data every 250ms for faster processing
      mediaRecorder.current.start(250);
      setRecording(true);

    } catch (err) {
      console.error("Microphone error:", err);
      alert("Could not access microphone. Please allow microphone permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && recording) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  const toggleRecording = () => {
    if (recording) stopRecording();
    else startRecording();
  };
  // ─────────────────────────────────────────────────

  const canSend = !loading && !transcribing && (input.trim().length > 0 || files.length > 0);

  return (
    <div
      onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      onDragOver={(e) => e.preventDefault()}
      style={{
        background:          "rgba(255,255,255,0.92)",
        backdropFilter:      "blur(20px)",
        WebkitBackdropFilter:"blur(20px)",
        border:              "1.5px solid rgba(59,91,219,0.14)",
        borderRadius:        heroMode ? 22 : 18,
        boxShadow: heroMode
          ? "0 8px 48px rgba(59,91,219,0.13), 0 1px 0 rgba(255,255,255,0.9) inset"
          : "0 4px 20px rgba(59,91,219,0.08)",
        overflow: "hidden",
        // Red glow when recording
        ...(recording && {
          border:    "1.5px solid rgba(239,68,68,0.5)",
          boxShadow: "0 0 0 3px rgba(239,68,68,0.12)",
        }),
      }}
    >
      {/* File chips */}
      {files.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 16px 4px" }}>
          {files.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 6,
              borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 500,
              background: "rgba(59,91,219,0.07)", color: "#3b5bdb",
              border: "1px solid rgba(59,91,219,0.15)", maxWidth: 170,
            }}>
              {f.preview
                ? <img src={f.preview} alt={f.name} style={{
                    width: 20, height: 20, borderRadius: 6,
                    objectFit: "cover", flexShrink: 0,
                  }}/>
                : <span style={{ flexShrink: 0 }}>📎</span>}
              <span style={{
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{f.name}</span>
              <button onClick={() => removeFile(i)} style={{
                marginLeft: 2, fontWeight: 700, background: "none",
                border: "none", cursor: "pointer", color: "inherit",
                lineHeight: 1, flexShrink: 0,
              }}>×</button>
            </div>
          ))}
        </div>
      )}

      {/* Recording indicator */}
      {recording && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 16px 0",
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#ef4444",
            animation: "bounceTyping 1s infinite",
          }}/>
          <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>
            Recording... tap mic to stop
          </span>
        </div>
      )}

      {/* Transcribing indicator */}
      {transcribing && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 16px 0",
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#3b5bdb",
            animation: "bounceTyping 1s infinite",
          }}/>
          <span style={{ fontSize: 12, color: "#3b5bdb", fontWeight: 600 }}>
            Converting speech to text...
          </span>
        </div>
      )}

      {/* Input row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: heroMode ? "14px 14px" : "10px 12px",
      }}>
        <textarea
          ref={textareaRef}
          rows={1}
          style={{
            flex: 1, background: "transparent", outline: "none",
            resize: "none", border: "none",
            color: "#1a2240", lineHeight: "1.6", maxHeight: 130,
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: heroMode ? "1rem" : "0.92rem",
            fontWeight: 500,
          }}
          placeholder={
            recording    ? "🎙 Listening..." :
            transcribing ? "Converting speech..." :
            heroMode     ? "Type your message..." :
                           "Ask me anything..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={recording || transcribing}
        />

        {/* Attach button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Attach file"
          style={{
            flexShrink: 0, width: 36, height: 36, borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent", border: "none", cursor: "pointer",
            color: "#9bb0d8", transition: "background 0.15s",
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>
        <input
          ref={fileInputRef} type="file" multiple accept={ACCEPTED}
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Mic button */}
        <button
          onClick={toggleRecording}
          disabled={loading || transcribing}
          title={recording ? "Stop recording" : "Start voice input"}
          style={{
            flexShrink: 0,
            width:        heroMode ? 46 : 38,
            height:       heroMode ? 46 : 38,
            borderRadius: heroMode ? 15 : 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "none",
            cursor: (loading || transcribing) ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            // Red when recording, grey when transcribing, blue outline when idle
            background: recording
              ? "linear-gradient(135deg,#ef4444,#dc2626)"
              : transcribing
                ? "rgba(180,195,230,0.4)"
                : "rgba(59,91,219,0.08)",
            boxShadow: recording
              ? "0 4px 14px rgba(239,68,68,0.40)"
              : "none",
            border: recording
              ? "none"
              : "1.5px solid rgba(59,91,219,0.20)",
          }}
        >
          {transcribing ? (
            /* Spinner when processing */
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="#3b5bdb" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate"
                  from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite"/>
              </path>
            </svg>
          ) : recording ? (
            /* Stop icon when recording */
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
              <rect x="4" y="4" width="16" height="16" rx="2"/>
            </svg>
          ) : (
            /* Mic icon when idle */
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="#3b5bdb" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8"  y1="23" x2="16" y2="23"/>
            </svg>
          )}
        </button>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          style={{
            flexShrink: 0,
            width:        heroMode ? 46 : 38,
            height:       heroMode ? 46 : 38,
            borderRadius: heroMode ? 15 : 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "none",
            background: canSend
              ? "linear-gradient(135deg,#5b7fff,#3b5bdb)"
              : "rgba(180,195,230,0.4)",
            boxShadow: canSend ? "0 4px 14px rgba(59,91,219,0.30)" : "none",
            cursor: canSend ? "pointer" : "not-allowed",
            transition: "all 0.2s",
          }}
        >
          {loading ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate"
                  from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite"/>
              </path>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke={canSend ? "white" : "#b0c0e0"} strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
