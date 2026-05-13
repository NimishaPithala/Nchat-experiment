import ReactMarkdown from "react-markdown";
import remarkGfm     from "remark-gfm";
import remarkMath    from "remark-math";
import rehypeKatex   from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { useState } from "react";

// Code block with language label + copy button
function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span>{language || "code"}</span>
        <button className="code-copy-btn" onClick={handleCopy}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre>
        <code className={language ? `language-${language}` : ""}>
          {children}
        </code>
      </pre>
    </div>
  );
}

// Custom components passed to ReactMarkdown
const markdownComponents = {
  // Override code rendering — detect if it's a block or inline
  code({ node, inline, className, children, ...props }) {
    const language = /language-(\w+)/.exec(className || "")?.[1];

    if (!inline && (language || String(children).includes("\n"))) {
      return (
        <CodeBlock language={language}>
          {String(children).replace(/\n$/, "")}
        </CodeBlock>
      );
    }

    // Inline code
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  // Open links in new tab
  a({ href, children }) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },

  // Responsive tables
  table({ children }) {
    return (
      <div style={{ overflowX: "auto", margin: "0.6em 0" }}>
        <table>{children}</table>
      </div>
    );
  },
};

// ── Main export ──────────────────────────────────────────────────
export default function MarkdownRenderer({ content, isUser = false, isStreaming = false }) {
  return (
    <div className={`${isUser ? "prose-user" : "prose-nchat"} ${isStreaming ? "streaming-cursor" : ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={markdownComponents}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  );
}
