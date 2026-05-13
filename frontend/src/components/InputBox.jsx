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


import { useState, useRef, useEffect, useCallback } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

// ── Device detection ─────────────────────────────────────────────
const isMobile = () => {
  if (typeof window === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent)
    || window.innerWidth < 768;
};

const isIOS = () => {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

// ── Audio helpers ────────────────────────────────────────────────
function getBestAudioMime() {
  const types = [
    "audio/webm;codecs=opus", "audio/webm", "audio/mp4",
    "audio/mpeg", "audio/ogg;codecs=opus", "audio/ogg",
  ];
  for (const t of types) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) return t;
  }
  return "";
}

function mimeToExt(mime) {
  if (mime.includes("mp4"))  return ".mp4";
  if (mime.includes("mpeg")) return ".mp3";
  if (mime.includes("ogg"))  return ".ogg";
  return ".webm";
}

// ── Image compression (client-side) ─────────────────────────────
async function compressImage(file, maxKB = 800) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      const MAX_DIM = 1200;
      if (width > MAX_DIM || height > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
        width  = Math.round(width  * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width  = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      let quality = 0.85;
      const tryCompress = () => {
        canvas.toBlob((blob) => {
          if (!blob) { resolve(file); return; }
          if (blob.size / 1024 <= maxKB || quality <= 0.2) {
            resolve(blob);
          } else {
            quality -= 0.15;
            tryCompress();
          }
        }, "image/jpeg", quality);
      };
      tryCompress();
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

// ── CropperJS Modal ───────────────────────────────────────────────
// Shows after camera capture. User crops to document edges, then confirms.
function CropperModal({ imageSrc, onConfirm, onCancel }) {
  const imgRef     = useRef(null);
  const cropperRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!imgRef.current) return;

    // Small delay ensures the image element is painted before Cropper initialises
    const timer = setTimeout(() => {
      cropperRef.current = new Cropper(imgRef.current, {
        // dragMode: "crop" means the user drags to create/move the crop box
        dragMode:      "move",
        // aspectRatio: NaN means free aspect ratio — good for documents of any size
        aspectRatio:   NaN,
        // guides: show the rule-of-thirds lines inside the crop box
        guides:        true,
        // highlight: dim the area outside the crop box
        highlight:     true,
        // cropBoxMovable/Resizable: user can adjust the box
        cropBoxMovable:   true,
        cropBoxResizable: true,
        // autoCropArea: what fraction of the image is selected by default (0.9 = 90%)
        autoCropArea:  0.92,
        // viewMode 1: crop box cannot go outside the image boundary
        viewMode:      1,
        ready() { setReady(true); },
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
    };
  }, [imageSrc]);

  const handleConfirm = () => {
    if (!cropperRef.current) return;
    // getCroppedCanvas returns only the selected area as a canvas element
    const canvas = cropperRef.current.getCroppedCanvas({
      maxWidth:  1600,
      maxHeight: 1600,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });
    canvas.toBlob((blob) => {
      if (blob) onConfirm(blob);
    }, "image/jpeg", 0.92);
  };

  const rotate = (deg) => cropperRef.current?.rotate(deg);
  const reset  = ()    => cropperRef.current?.reset();

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(8,12,35,0.96)",
      display: "flex", flexDirection: "column",
      alignItems: "center",
    }}>
      {/* Header */}
      <div style={{
        width: "100%", maxWidth: 600, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px",
      }}>
        <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>
          ✂️ Crop Document
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <CropBtn onClick={() => rotate(-90)} title="Rotate left">↺</CropBtn>
          <CropBtn onClick={() => rotate(90)}  title="Rotate right">↻</CropBtn>
          <CropBtn onClick={reset} title="Reset">⟲</CropBtn>
          <CropBtn onClick={onCancel} title="Cancel" danger>✕</CropBtn>
        </div>
      </div>

      {/* Instruction */}
      <p style={{
        color: "rgba(180,200,255,0.75)", fontSize: 12, margin: "0 0 10px",
        textAlign: "center", padding: "0 16px",
      }}>
        Drag the corners to crop to the document edges, then tap Use Photo
      </p>

      {/* Cropper image container */}
      <div style={{
        flex: 1, width: "100%", maxWidth: 600,
        overflow: "hidden", position: "relative",
      }}>
        {/* CropperJS needs the img to be directly in the DOM */}
        <img
          ref={imgRef}
          src={imageSrc}
          alt="scan"
          style={{
            display: "block",
            maxWidth: "100%",
            // CropperJS hides this and shows its own canvas
          }}
        />
      </div>

      {/* Confirm button */}
      <div style={{
        width: "100%", maxWidth: 600, padding: "14px 16px",
        paddingBottom: "max(14px, env(safe-area-inset-bottom))",
        flexShrink: 0,
      }}>
        <button
          onClick={handleConfirm}
          disabled={!ready}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 16,
            background: ready
              ? "linear-gradient(135deg,#5b7fff,#3b5bdb)"
              : "rgba(91,127,255,0.3)",
            color: "white", fontWeight: 700, fontSize: 15,
            border: "none", cursor: ready ? "pointer" : "not-allowed",
            boxShadow: ready ? "0 4px 20px rgba(59,91,219,0.40)" : "none",
            transition: "all 0.2s",
          }}
        >
          {ready ? "✅ Use Photo" : "Loading..."}
        </button>
      </div>
    </div>
  );
}

function CropBtn({ children, onClick, title, danger }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: 34, height: 34, borderRadius: 10,
      background: danger ? "rgba(239,68,68,0.20)" : "rgba(255,255,255,0.12)",
      border: "none", color: danger ? "#ff6b6b" : "white",
      fontSize: 16, cursor: "pointer", fontWeight: 700,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>{children}</button>
  );
}

// ── Main InputBox ─────────────────────────────────────────────────
export default function InputBox({ onSend, loading, heroMode }) {
  const [text,         setText]         = useState("");
  const [attachments,  setAttachments]  = useState([]);
  const [recording,    setRecording]    = useState(false);
  const [mobile,       setMobile]       = useState(false);
  const [recSeconds,   setRecSeconds]   = useState(0);
  const [cropperSrc,   setCropperSrc]   = useState(null);   // image URL for cropper modal
  const [compressing,  setCompressing]  = useState(false);

  const textareaRef  = useRef(null);
  const fileInputRef = useRef(null);
  const scanInputRef = useRef(null);
  const mediaRecRef  = useRef(null);
  const chunksRef    = useRef([]);
  const timerRef     = useRef(null);
  const cropRawUrl   = useRef(null);  // URL to revoke after cropper is done

  const disabled = loading || compressing;

  useEffect(() => {
    setMobile(isMobile());
    const onResize = () => setMobile(isMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }, [text]);

  // ── File → base64 ────────────────────────────────────────────────
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const getFileCategory = (file) => {
    const mime = file.type.toLowerCase();
    const name = (file.name || "").toLowerCase();
    if (mime.startsWith("image/")) return "image";
    if (mime === "application/pdf" || name.endsWith(".pdf")) return "pdf";
    if (
      mime.includes("spreadsheet") || mime.includes("excel") ||
      name.endsWith(".xlsx") || name.endsWith(".xls")
    ) return "excel";
    if (mime === "text/plain" || name.endsWith(".txt")) return "txt";
    if (mime.includes("word") || name.endsWith(".doc") || name.endsWith(".docx")) return "doc";
    return "other";
  };

  // ── Process any files (attach button) ────────────────────────────
  const handleFiles = useCallback(async (files) => {
    setCompressing(true);
    const next = [];
    for (const file of Array.from(files)) {
      const category = getFileCategory(file);
      let processed  = file;

      if (category === "image") {
        processed = await compressImage(file, 800);
      }

      const b64     = await fileToBase64(processed);
      const preview = category === "image" ? URL.createObjectURL(processed) : null;

      next.push({
        name:     file.name || "file",
        file:     processed,
        preview,
        b64,
        mime:     category === "image" ? "image/jpeg" : (file.type || "application/octet-stream"),
        category,
      });
    }
    setAttachments(prev => [...prev, ...next]);
    setCompressing(false);
  }, []);

  // ── Camera capture → open CropperModal ──────────────────────────
  const handleScanCapture = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    // Revoke any previous raw URL
    if (cropRawUrl.current) URL.revokeObjectURL(cropRawUrl.current);
    const url = URL.createObjectURL(file);
    cropRawUrl.current = url;
    setCropperSrc(url);
  };

  // ── After user confirms crop in CropperModal ─────────────────────
  const handleCropConfirm = async (croppedBlob) => {
    // Clean up the raw capture URL
    if (cropRawUrl.current) {
      URL.revokeObjectURL(cropRawUrl.current);
      cropRawUrl.current = null;
    }
    setCropperSrc(null);
    setCompressing(true);

    const compressed = await compressImage(croppedBlob, 800);
    const b64        = await fileToBase64(compressed);
    const preview    = URL.createObjectURL(compressed);

    setAttachments(prev => [...prev, {
      name:     "scanned_document.jpg",
      file:     compressed,
      preview,
      b64,
      mime:     "image/jpeg",
      category: "image",
    }]);
    setCompressing(false);
  };

  const handleCropCancel = () => {
    if (cropRawUrl.current) {
      URL.revokeObjectURL(cropRawUrl.current);
      cropRawUrl.current = null;
    }
    setCropperSrc(null);
  };

  const removeAttachment = (idx) => {
    setAttachments(prev => {
      const updated = [...prev];
      if (updated[idx].preview) URL.revokeObjectURL(updated[idx].preview);
      updated.splice(idx, 1);
      return updated;
    });
  };

  const fileIcon = (cat) => {
    if (cat === "pdf")   return "📄";
    if (cat === "excel") return "📊";
    if (cat === "txt")   return "📝";
    if (cat === "doc")   return "📃";
    return "📎";
  };

  // ── Send ──────────────────────────────────────────────────────────
  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;
    if (disabled) return;

    const imageAtt = attachments.find(a => a.category === "image");
    const fileAtt  = attachments.find(a => a.category !== "image");

    onSend({
      text:        trimmed,
      attachments: attachments.map(a => ({ name: a.name, preview: a.preview, category: a.category })),
      image_b64:   imageAtt?.b64  || null,
      image_mime:  imageAtt?.mime || null,
      file_b64:    fileAtt?.b64   || null,
      file_name:   fileAtt?.name  || null,
      file_mime:   fileAtt?.mime  || null,
    });

    setText("");
    setAttachments([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Voice recording ───────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream   = await navigator.mediaDevices.getUserMedia({ audio: true });
      const bestMime = getBestAudioMime();
      const mr       = new MediaRecorder(stream, bestMime ? { mimeType: bestMime } : {});

      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data?.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        const usedMime = mr.mimeType || bestMime || "audio/webm";
        const blob     = new Blob(chunksRef.current, { type: usedMime });
        stream.getTracks().forEach(t => t.stop());
        clearInterval(timerRef.current);
        setRecSeconds(0);
        await transcribeAudio(blob, usedMime);
      };

      mr.start(250);
      mediaRecRef.current = mr;
      setRecording(true);
      setRecSeconds(0);
      timerRef.current = setInterval(() => setRecSeconds(s => s + 1), 1000);

    } catch {
      if (isIOS()) {
        alert("Microphone access needed.\nSettings → Safari → Microphone → Allow.\nRequires HTTPS.");
      } else {
        alert("Microphone access denied. Please allow mic access and try again.");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecRef.current && recording) {
      mediaRecRef.current.stop();
      setRecording(false);
    }
  };

  const transcribeAudio = async (blob, usedMime) => {
    try {
      const ext = mimeToExt(usedMime);
      const fd  = new FormData();
      fd.append("audio", blob, `recording${ext}`);
      const res  = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/transcribe`,
        { method: "POST", body: fd }
      );
      const data = await res.json();
      if (data.transcript) setText(p => p ? p + " " + data.transcript : data.transcript);
    } catch (err) {
      console.error("Transcription failed:", err);
    }
  };

  const canSend = (text.trim() || attachments.length > 0) && !disabled;

  return (
    <>
      {/* CropperJS modal — shown after camera capture */}
      {cropperSrc && (
        <CropperModal
          imageSrc={cropperSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

      <div style={{
        padding: heroMode ? "0" : "clamp(8px,2vw,14px)",
        background: heroMode ? "transparent" : "rgba(255,255,255,0.85)",
        backdropFilter: heroMode ? "none" : "blur(16px)",
        WebkitBackdropFilter: heroMode ? "none" : "blur(16px)",
        borderTop: heroMode ? "none" : "1px solid rgba(59,91,219,0.08)",
      }}>

        {/* Attachment thumbnails */}
        {attachments.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            {attachments.map((a, i) => (
              <div key={i} style={{ position: "relative" }}>
                {a.preview ? (
                  <img src={a.preview} alt={a.name} style={{
                    width: 64, height: 64, borderRadius: 12, objectFit: "cover",
                    border: "1.5px solid rgba(59,91,219,0.18)",
                  }}/>
                ) : (
                  <div style={{
                    width: 72, height: 64, borderRadius: 12,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    background: "rgba(59,91,219,0.07)",
                    border: "1.5px solid rgba(59,91,219,0.15)",
                    fontSize: 11, color: "#5a7fe8", fontWeight: 500,
                    padding: 4, textAlign: "center", gap: 2,
                  }}>
                    <span style={{ fontSize: 22 }}>{fileIcon(a.category)}</span>
                    <span style={{
                      overflow: "hidden", textOverflow: "ellipsis",
                      whiteSpace: "nowrap", maxWidth: 62, fontSize: 10,
                    }}>{a.name}</span>
                  </div>
                )}
                <button onClick={() => removeAttachment(i)} style={{
                  position: "absolute", top: -6, right: -6,
                  width: 18, height: 18, borderRadius: "50%",
                  background: "#ef4444", border: "none", color: "white",
                  fontSize: 10, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>×</button>
              </div>
            ))}
          </div>
        )}

        {compressing && (
          <div style={{ fontSize: 11, color: "#5a7fe8", fontWeight: 600, marginBottom: 8 }}>
            ⏳ Processing image...
          </div>
        )}

        {/* Input row */}
        <div style={{
          display: "flex", alignItems: "flex-end", gap: 6,
          background: "rgba(255,255,255,0.97)",
          borderRadius: 22,
          border: "1.5px solid rgba(59,91,219,0.16)",
          padding: "8px 8px 8px 14px",
          boxShadow: "0 2px 16px rgba(59,91,219,0.08)",
        }}>

          {/* Hidden inputs */}
          <input
            ref={fileInputRef} type="file" multiple
            accept="image/*,.pdf,.txt,.xlsx,.xls,.doc,.docx"
            style={{ display: "none" }}
            onChange={e => { handleFiles(e.target.files); e.target.value = ""; }}
          />
          {/* Camera — rear facing, image only */}
          <input
            ref={scanInputRef} type="file"
            accept="image/*" capture="environment"
            style={{ display: "none" }}
            onChange={handleScanCapture}
          />

          {/* Attach */}
          <IconBtn title="Attach file" onClick={() => fileInputRef.current?.click()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
            </svg>
          </IconBtn>

          {/* Scan — mobile only */}
          {mobile && (
            <IconBtn title="Scan document" onClick={() => scanInputRef.current?.click()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </IconBtn>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              compressing ? "Processing image..." :
              recording   ? `Recording... ${recSeconds}s` :
              mobile      ? "Message Nchat..." :
                            "Message Nchat... (Shift+Enter for new line)"
            }
            rows={1}
            style={{
              flex: 1, resize: "none", border: "none", outline: "none",
              background: "transparent", fontSize: 15, lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: "#1a2240", maxHeight: 140, overflowY: "auto",
              padding: "2px 0", WebkitTextSizeAdjust: "100%",
            }}
          />

          {/* Voice */}
          <IconBtn
            title={recording ? "Stop" : "Voice input"}
            onClick={recording ? stopRecording : startRecording}
            active={recording} danger={recording}
          >
            {recording ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            )}
          </IconBtn>

          {/* Send */}
          <button
            onClick={handleSend} disabled={!canSend}
            style={{
              width: 38, height: 38, borderRadius: 14, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "none", cursor: canSend ? "pointer" : "not-allowed",
              background: canSend ? "linear-gradient(135deg,#5b7fff,#3b5bdb)" : "rgba(59,91,219,0.10)",
              boxShadow: canSend ? "0 3px 14px rgba(59,91,219,0.30)" : "none",
              transition: "all 0.18s",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={canSend ? "white" : "#b0bcd4"} strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

        {mobile && !heroMode && (
          <p style={{
            textAlign: "center", fontSize: 11, color: "#b8c4d8",
            margin: "6px 0 0", fontWeight: 500,
          }}>
            📎 Attach &nbsp;·&nbsp; 📷 Scan &nbsp;·&nbsp; 🎤 Voice
          </p>
        )}
      </div>
    </>
  );
}

function IconBtn({ children, onClick, title, active, danger }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: 36, height: 36, borderRadius: 12, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      border: "none", cursor: "pointer", transition: "all 0.18s",
      background: danger ? "rgba(239,68,68,0.12)" : active ? "rgba(59,91,219,0.14)" : "rgba(59,91,219,0.07)",
      color: danger ? "#ef4444" : "#5a7fe8",
      WebkitTapHighlightColor: "transparent",
      touchAction: "manipulation",
    }}>
      {children}
    </button>
  );
}
