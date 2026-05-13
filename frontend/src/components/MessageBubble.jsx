import ReactMarkdown  from "react-markdown";
import remarkMath     from "remark-math";
import rehypeKatex    from "rehype-katex";
import remarkGfm      from "remark-gfm";
import DynamicWidget, { parseAIBlocks } from "./DynamicWidget";
import DiagramWidget from "./DiagramWidget";

// Detect if the message is asking for a diagram
const DIAGRAM_TRIGGERS = [
  "india map","states of india","indian states",
  "human heart","heart anatomy","heart diagram",
  "atomic structure","atom structure","bohr model",
  "solar system","planets orbit",
  "water cycle","hydrological cycle",
  "animal cell","plant cell","cell structure",
  "show me","draw me","diagram of","map of",
  "anatomy of","structure of","visualize",
];

function detectDiagramRequest(content) {
  if (!content) return false;
  const lower = content.toLowerCase();
  return DIAGRAM_TRIGGERS.some(t => lower.includes(t));
}

export default function MessageBubble({ role, content, attachments = [], isStreaming = false, userMessage = "" }) {
  const isUser = role === "user";

  const { cleanText, widgetSpecs, quizData } = isUser
    ? { cleanText: content, widgetSpecs: [], quizData: null }
    : parseAIBlocks(content || "");

  // Show diagram widget if user asked for one and AI response is complete
  const showDiagram = !isUser && !isStreaming && detectDiagramRequest(userMessage);

  return (
    <div style={{
      display:"flex", alignItems:"flex-end", gap:8,
      flexDirection: isUser ? "row-reverse" : "row",
      animation:"msgIn 0.28s ease both",
    }}>

      <div style={{
        width:32, height:32, borderRadius:"50%", flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontWeight:700, userSelect:"none",
        fontSize: isUser ? "0.65rem" : "0.75rem",
        background: isUser ? "#1c2340" : "linear-gradient(135deg,#5b7fff,#3b5bdb)",
        color:"white",
      }}>
        {isUser ? "You" : "N"}
      </div>

      <div style={{
        display:"flex", flexDirection:"column", gap:8,
        alignItems: isUser ? "flex-end" : "flex-start",
        maxWidth:"min(78%, 680px)",
      }}>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:8,
            justifyContent: isUser ? "flex-end" : "flex-start" }}>
            {attachments.map((a, i) =>
              a.preview ? (
                <img key={i} src={a.preview} alt={a.name} style={{
                  maxWidth:"min(200px,60vw)", maxHeight:160,
                  borderRadius:16, objectFit:"cover",
                  boxShadow:"0 4px 16px rgba(59,91,219,0.14)",
                }}/>
              ) : (
                <div key={i} style={{
                  display:"flex", alignItems:"center", gap:6, borderRadius:12,
                  padding:"6px 12px", fontSize:12, fontWeight:500,
                  background:"rgba(59,91,219,0.08)", color:"#3b5bdb",
                  border:"1px solid rgba(59,91,219,0.16)",
                }}>
                  <span>📎</span>
                  <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:130 }}>{a.name}</span>
                </div>
              )
            )}
          </div>
        )}

        {/* Text bubble */}
        {(cleanText || isStreaming) && (
          <div style={{
            padding:"12px 16px",
            borderRadius: isUser ? "22px 22px 6px 22px" : "22px 22px 22px 6px",
            fontSize:"clamp(0.82rem,2.2vw,0.92rem)",
            lineHeight:1.75, wordBreak:"break-word", maxWidth:"100%",
            ...(isUser ? {
              background:"linear-gradient(135deg,#3b5bdb,#5b7fff)", color:"white",
              boxShadow:"0 4px 18px rgba(59,91,219,0.24)",
            } : {
              background:"rgba(255,255,255,0.92)", color:"#1a2240",
              border:"1px solid rgba(59,91,219,0.10)",
              boxShadow:"0 2px 12px rgba(59,91,219,0.06)",
              backdropFilter:"blur(8px)",
            }),
          }}>
            {!cleanText && isStreaming ? (
              <span style={{ opacity:0.3 }}>▌</span>
            ) : isUser ? (
              <span style={{ color:"white", whiteSpace:"pre-wrap" }}>{cleanText}</span>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p({ children }) { return <p style={{ margin:"0 0 0.6em", color:"#1a2240", lineHeight:1.75 }}>{children}</p>; },
                  strong({ children }) { return <strong style={{ fontWeight:700, color:"#1a2240" }}>{children}</strong>; },
                  em({ children }) { return <em style={{ fontStyle:"italic", color:"#1a2240" }}>{children}</em>; },
                  code({ inline, className, children }) {
                    const isBlock = !inline && (String(children).includes("\n") || className);
                    if (isBlock) return (
                      <pre style={{ background:"rgba(0,0,0,0.055)", borderRadius:10, padding:"12px 14px", overflowX:"auto", fontSize:"0.82em", margin:"8px 0", border:"1px solid rgba(59,91,219,0.08)" }}>
                        <code style={{ background:"transparent", color:"#1a2240", fontFamily:"monospace" }}>{children}</code>
                      </pre>
                    );
                    return <code style={{ background:"rgba(59,91,219,0.09)", padding:"2px 6px", borderRadius:5, fontSize:"0.83em", color:"#3b5bdb", fontFamily:"monospace" }}>{children}</code>;
                  },
                  ul({ children }) { return <ul style={{ margin:"6px 0", paddingLeft:22, listStyleType:"disc", color:"#1a2240" }}>{children}</ul>; },
                  ol({ children }) { return <ol style={{ margin:"6px 0", paddingLeft:22, listStyleType:"decimal", color:"#1a2240" }}>{children}</ol>; },
                  li({ children }) { return <li style={{ margin:"3px 0", color:"#1a2240", lineHeight:1.65 }}>{children}</li>; },
                  h1({ children }) { return <h1 style={{ fontSize:"1.35em", fontWeight:800, margin:"14px 0 6px", color:"#1a2240", borderBottom:"1px solid rgba(59,91,219,0.12)", paddingBottom:4 }}>{children}</h1>; },
                  h2({ children }) { return <h2 style={{ fontSize:"1.18em", fontWeight:700, margin:"12px 0 5px", color:"#1a2240" }}>{children}</h2>; },
                  h3({ children }) { return <h3 style={{ fontSize:"1.05em", fontWeight:700, margin:"10px 0 4px", color:"#1a2240" }}>{children}</h3>; },
                  blockquote({ children }) { return <blockquote style={{ borderLeft:"3px solid rgba(59,91,219,0.35)", paddingLeft:12, margin:"8px 0", color:"#5a6a88", fontStyle:"italic", background:"rgba(59,91,219,0.03)", borderRadius:"0 8px 8px 0" }}>{children}</blockquote>; },
                  a({ href, children }) { return <a href={href} target="_blank" rel="noopener noreferrer" style={{ color:"#3b5bdb", textDecoration:"underline" }}>{children}</a>; },
                  table({ children }) { return <div style={{ overflowX:"auto", margin:"10px 0" }}><table style={{ borderCollapse:"collapse", width:"100%", fontSize:"0.88em" }}>{children}</table></div>; },
                  th({ children }) { return <th style={{ padding:"7px 12px", textAlign:"left", border:"1px solid rgba(59,91,219,0.15)", fontWeight:600, color:"#1a2240", background:"rgba(59,91,219,0.07)" }}>{children}</th>; },
                  td({ children }) { return <td style={{ padding:"7px 12px", border:"1px solid rgba(59,91,219,0.10)", color:"#1a2240" }}>{children}</td>; },
                }}
              >
                {cleanText}
              </ReactMarkdown>
            )}
          </div>
        )}

        {/* Dynamic calculator/graph/physics widgets */}
        {!isUser && (
          <DynamicWidget
            widgetSpecs={widgetSpecs}
            quizData={quizData}
            isStreaming={isStreaming}
          />
        )}

        {/* Interactive diagram widget */}
        {showDiagram && (
          <DiagramWidget message={userMessage} />
        )}

      </div>
    </div>
  );
}