{/*

import { useState, useEffect, useRef, useCallback } from "react";

// ── Parse WIDGET_SPEC and QUIZ_DATA from AI response ─────────────
export function parseAIBlocks(content) {
  let cleanText  = content;
  let widgetSpec = null;
  let quizData   = null;

  // Extract QUIZ_DATA
  const quizMatch = content.match(/QUIZ_DATA:(\{[\s\S]*?\})\s*$/m);
  if (quizMatch) {
    try {
      const parsed = JSON.parse(quizMatch[1]);
      if (parsed.questions?.length > 0) {
        quizData  = parsed;
        cleanText = cleanText.replace(/QUIZ_DATA:[\s\S]*$/, "").trim();
      }
    } catch 
  }

  // Extract WIDGET_SPEC
  const widgetMatch = content.match(/WIDGET_SPEC:(\{[^\n]+\})/);
  if (widgetMatch) {
    try {
      widgetSpec = JSON.parse(widgetMatch[1]);
      cleanText  = cleanText.replace(/WIDGET_SPEC:\{[^\n]+\}/, "").trim();
    } catch 
  }

  return { cleanText, widgetSpec, quizData };
}

// ── Shared styles ─────────────────────────────────────────────────
const WIDGET_THEMES = {
  blue:   { bg: "#eef2ff", border: "#c7d2fe", accent: "#3b5bdb", header: "#dde6ff", text: "#1e3a8a" },
  green:  { bg: "#f0fdf4", border: "#bbf7d0", accent: "#16a34a", header: "#dcfce7", text: "#14532d" },
  purple: { bg: "#faf5ff", border: "#e9d5ff", accent: "#7c3aed", header: "#ede9fe", text: "#4c1d95" },
  orange: { bg: "#fff7ed", border: "#fed7aa", accent: "#ea580c", header: "#ffedd5", text: "#7c2d12" },
};

function WidgetShell({ title, icon, theme = "blue", children }) {
  const t = WIDGET_THEMES[theme];
  return (
    <div style={{
      borderRadius: 18, border: `1.5px solid ${t.border}`,
      background: t.bg, overflow: "hidden",
      width: "100%", maxWidth: 520,
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "11px 18px",
        background: t.header,
        borderBottom: `1px solid ${t.border}`,
      }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: t.accent }}>{title}</span>
        <div style={{
          marginLeft: "auto", fontSize: 10, fontWeight: 600,
          color: t.accent, opacity: 0.6,
          background: `${t.accent}18`, borderRadius: 99, padding: "2px 8px",
        }}>interactive</div>
      </div>
      <div style={{ padding: "16px 18px" }}>{children}</div>
    </div>
  );
}

function SliderRow({ label, value, min, max, step, unit, onChange, color = "#3b5bdb" }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</span>
        <span style={{
          fontSize: 13, fontWeight: 700, color,
          background: `${color}15`, borderRadius: 8, padding: "1px 10px",
        }}>{value}{unit ? " " + unit : ""}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: color, cursor: "pointer", height: 20 }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9ca3af", marginTop: 1 }}>
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

function ResultBox({ label, value, unit, color = "#3b5bdb", bg }) {
  return (
    <div style={{
      marginTop: 6, padding: "14px 18px", borderRadius: 14, textAlign: "center",
      background: bg || `linear-gradient(135deg, ${color}15, ${color}22)`,
      border: `1px solid ${color}30`,
    }}>
      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color }}>
        {typeof value === "number" ? (isNaN(value) ? "—" : +value.toFixed(4)) : value}
        {unit && <span style={{ fontSize: 14, fontWeight: 500, color: "#6b7280", marginLeft: 5 }}>{unit}</span>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MATH CALCULATORS
// ══════════════════════════════════════════════════════════════════

function CylinderCalc() {
  const [r, setR] = useState(5);
  const [h, setH] = useState(10);
  const canvasRef = useRef(null);
  const volume = Math.PI * r * r * h;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const maxR = Math.min(W * 0.38, 110);
    const maxH = H * 0.55;
    const displayR = Math.max(20, (r / 30) * maxR);
    const displayH = Math.max(20, (h / 50) * maxH);
    const top    = (H - displayH) / 2;
    const bottom = top + displayH;

    // Shadow
    ctx.beginPath();
    ctx.ellipse(cx, bottom + 6, displayR * 0.85, displayR * 0.22, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(59,91,219,0.08)";
    ctx.fill();

    // Body
    const grad = ctx.createLinearGradient(cx - displayR, 0, cx + displayR, 0);
    grad.addColorStop(0, "#93c5fd");
    grad.addColorStop(0.5, "#3b82f6");
    grad.addColorStop(1, "#1d4ed8");
    ctx.beginPath();
    ctx.moveTo(cx - displayR, top);
    ctx.lineTo(cx - displayR, bottom);
    ctx.ellipse(cx, bottom, displayR, displayR * 0.28, 0, Math.PI, 0, true);
    ctx.lineTo(cx + displayR, top);
    ctx.ellipse(cx, top, displayR, displayR * 0.28, 0, 0, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Top ellipse
    ctx.beginPath();
    ctx.ellipse(cx, top, displayR, displayR * 0.28, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#60a5fa";
    ctx.fill();

    // Labels
    ctx.fillStyle = "white";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`h = ${h}`, cx, (top + bottom) / 2 + 4);
    ctx.fillText(`r = ${r}`, cx, bottom + 24);
  }, [r, h]);

  return (
    <WidgetShell title="Cylinder Volume Calculator" icon="🧮" theme="blue">
      <SliderRow label="Radius (r)" value={r} min={0.5} max={20} step={0.5} unit="units" onChange={setR} />
      <SliderRow label="Height (h)" value={h} min={0.5} max={50} step={0.5} unit="units" onChange={setH} />
      <canvas ref={canvasRef} width={300} height={180}
        style={{ width: "100%", height: "auto", borderRadius: 12, display: "block", margin: "10px 0" }}/>
      <ResultBox label="Volume (V = πr²h)" value={volume} unit="cubic units" />
      <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280", textAlign: "center" }}>
        V = π × {r}² × {h} = {+volume.toFixed(2)} cubic units
      </div>
    </WidgetShell>
  );
}

function SphereCalc() {
  const [r, setR] = useState(5);
  const volume = (4/3) * Math.PI * r * r * r;
  return (
    <WidgetShell title="Sphere Volume Calculator" icon="🔮" theme="purple">
      <SliderRow label="Radius (r)" value={r} min={0.1} max={20} step={0.1} unit="units" onChange={setR} color="#7c3aed" />
      <ResultBox label="Volume (V = ⁴⁄₃πr³)" value={volume} unit="cubic units" color="#7c3aed" />
      <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280", textAlign: "center" }}>
        V = (4/3) × π × {r}³ = {+volume.toFixed(2)} cubic units
      </div>
    </WidgetShell>
  );
}

function CircleCalc() {
  const [r, setR] = useState(5);
  const area = Math.PI * r * r;
  const circ = 2 * Math.PI * r;
  return (
    <WidgetShell title="Circle Calculator" icon="⭕" theme="blue">
      <SliderRow label="Radius (r)" value={r} min={0.1} max={20} step={0.1} unit="units" onChange={setR} />
      <ResultBox label="Area (A = πr²)" value={area} unit="sq units" />
      <ResultBox label="Circumference (C = 2πr)" value={circ} unit="units" />
    </WidgetShell>
  );
}

function RectangleCalc() {
  const [l, setL] = useState(10);
  const [w, setW] = useState(5);
  const area = l * w;
  return (
    <WidgetShell title="Rectangle Area Calculator" icon="▭" theme="blue">
      <SliderRow label="Length" value={l} min={0.1} max={50} step={0.5} unit="" onChange={setL} />
      <SliderRow label="Width" value={w} min={0.1} max={50} step={0.5} unit="" onChange={setW} />
      <ResultBox label="Area = length × width" value={area} unit="sq units" />
    </WidgetShell>
  );
}

function TriangleCalc() {
  const [b, setB] = useState(8);
  const [h, setH] = useState(5);
  const area = 0.5 * b * h;
  return (
    <WidgetShell title="Triangle Area Calculator" icon="△" theme="green">
      <SliderRow label="Base" value={b} min={0.1} max={50} step={0.5} unit="" onChange={setB} color="#16a34a" />
      <SliderRow label="Height" value={h} min={0.1} max={50} step={0.5} unit="" onChange={setH} color="#16a34a" />
      <ResultBox label="Area = ½ × base × height" value={area} unit="sq units" color="#16a34a" />
    </WidgetShell>
  );
}

function PythagorasCalc() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const c = Math.sqrt(a*a + b*b);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const scale  = Math.min((W * 0.55) / Math.max(a, b), 12);
    const px     = W * 0.18;
    const py     = H * 0.82;
    const ax     = px + a * scale;
    const ay     = py;
    const bx     = px;
    const by_    = py - b * scale;

    // Fill triangle
    ctx.beginPath();
    ctx.moveTo(px, py); ctx.lineTo(ax, ay); ctx.lineTo(bx, by_);
    ctx.closePath();
    ctx.fillStyle = "rgba(124,58,237,0.18)";
    ctx.fill();
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Right angle box
    const sq = 10;
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px + sq, py); ctx.lineTo(px + sq, py - sq); ctx.lineTo(px, py - sq);
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#7c3aed";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`a = ${a}`, (px + ax) / 2, py + 18);
    ctx.fillText(`b = ${b}`, px - 20, (py + by_) / 2);
    ctx.fillText(`c = ${+c.toFixed(2)}`, (ax + bx) / 2 + 18, (ay + by_) / 2 - 10);
  }, [a, b]);

  return (
    <WidgetShell title="Pythagorean Theorem Calculator" icon="△" theme="purple">
      <SliderRow label="Side A" value={a} min={0.5} max={20} step={0.5} unit="" onChange={setA} color="#7c3aed" />
      <SliderRow label="Side B" value={b} min={0.5} max={20} step={0.5} unit="" onChange={setB} color="#7c3aed" />
      <canvas ref={canvasRef} width={300} height={160}
        style={{ width: "100%", height: "auto", borderRadius: 12, display: "block", margin: "8px 0" }}/>
      <ResultBox label="Hypotenuse c = √(a² + b²)" value={c} unit="" color="#7c3aed" />
    </WidgetShell>
  );
}

function KineticEnergyCalc() {
  const [m, setM] = useState(10);
  const [v, setV] = useState(5);
  const ke = 0.5 * m * v * v;
  return (
    <WidgetShell title="Kinetic Energy Calculator" icon="⚡" theme="orange">
      <SliderRow label="Mass (m)" value={m} min={0.1} max={200} step={1} unit="kg" onChange={setM} color="#ea580c" />
      <SliderRow label="Velocity (v)" value={v} min={0} max={100} step={0.5} unit="m/s" onChange={setV} color="#ea580c" />
      <ResultBox label="KE = ½mv²" value={ke} unit="Joules" color="#ea580c" />
    </WidgetShell>
  );
}

function SimpleInterestCalc() {
  const [p, setP] = useState(1000);
  const [r, setR] = useState(5);
  const [t, setT] = useState(3);
  const si    = p * r / 100 * t;
  const total = p + si;
  return (
    <WidgetShell title="Simple Interest Calculator" icon="💰" theme="green">
      <SliderRow label="Principal (P)" value={p} min={100} max={100000} step={100} unit="$" onChange={setP} color="#16a34a" />
      <SliderRow label="Rate (r)" value={r} min={0.1} max={30} step={0.1} unit="% /yr" onChange={setR} color="#16a34a" />
      <SliderRow label="Time (t)" value={t} min={1} max={30} step={1} unit="yrs" onChange={setT} color="#16a34a" />
      <ResultBox label="SI = P × R × T / 100" value={si} unit="$" color="#16a34a" />
      <div style={{ marginTop: 8, fontSize: 13, color: "#15803d", textAlign: "center", fontWeight: 600 }}>
        Total Amount = ${+total.toFixed(2)}
      </div>
    </WidgetShell>
  );
}

function CompoundInterestCalc() {
  const [p, setP] = useState(1000);
  const [r, setR] = useState(5);
  const [t, setT] = useState(3);
  const ci    = p * Math.pow(1 + r/100, t) - p;
  const total = p + ci;
  return (
    <WidgetShell title="Compound Interest Calculator" icon="📈" theme="green">
      <SliderRow label="Principal (P)" value={p} min={100} max={100000} step={100} unit="$" onChange={setP} color="#16a34a" />
      <SliderRow label="Rate (r)" value={r} min={0.1} max={30} step={0.1} unit="% /yr" onChange={setR} color="#16a34a" />
      <SliderRow label="Time (t)" value={t} min={1} max={30} step={1} unit="yrs" onChange={setT} color="#16a34a" />
      <ResultBox label="CI = P(1 + r/100)ᵗ - P" value={ci} unit="$" color="#16a34a" />
      <div style={{ marginTop: 8, fontSize: 13, color: "#15803d", textAlign: "center", fontWeight: 600 }}>
        Total Amount = ${+total.toFixed(2)}
      </div>
    </WidgetShell>
  );
}

function BMICalc() {
  const [w, setW] = useState(70);
  const [h, setH] = useState(170);
  const bmi = w / Math.pow(h / 100, 2);
  const cat = bmi < 18.5 ? { label: "Underweight", color: "#3b82f6" }
            : bmi < 25   ? { label: "Normal",       color: "#16a34a" }
            : bmi < 30   ? { label: "Overweight",   color: "#f59e0b" }
            :               { label: "Obese",        color: "#ef4444" };
  return (
    <WidgetShell title="BMI Calculator" icon="⚖️" theme="blue">
      <SliderRow label="Weight" value={w} min={30} max={200} step={0.5} unit="kg" onChange={setW} />
      <SliderRow label="Height" value={h} min={100} max={220} step={1} unit="cm" onChange={setH} />
      <ResultBox label="BMI = weight / height²" value={+bmi.toFixed(1)} unit="" />
      <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: cat.color, textAlign: "center" }}>
        {cat.label}
      </div>
    </WidgetShell>
  );
}

// ── Trig Graph ────────────────────────────────────────────────────
function TrigGraph({ spec }) {
  const canvasRef   = useRef(null);
  const [fn,  setFn]  = useState(spec?.fn || "sin");
  const [amp, setAmp] = useState(1);
  const [freq, setFreq] = useState(1);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const midY = H / 2;
    const scaleY = (H / 2) * 0.78;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#f8faff";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(59,91,219,0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += W/8) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y <= H; y += H/4) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Axes
    ctx.strokeStyle = "rgba(59,91,219,0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0,midY); ctx.lineTo(W,midY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W/2,0); ctx.lineTo(W/2,H); ctx.stroke();

    // Labels
    ctx.fillStyle = "#9bb0d8"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    ["-2π","-π","0","π","2π"].forEach((l,i) => ctx.fillText(l,(i/4)*W, midY+14));

    // Plot
    ctx.strokeStyle = "#3b5bdb"; ctx.lineWidth = 2.5;
    ctx.shadowColor = "rgba(59,91,219,0.3)"; ctx.shadowBlur = 4;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px <= W; px++) {
      const x = (px / W) * 4 * Math.PI - 2 * Math.PI;
      const xp = freq * x + phase;
      let y;
      if (fn === "sin") y = amp * Math.sin(xp);
      else if (fn === "cos") y = amp * Math.cos(xp);
      else {
        const tv = Math.tan(xp);
        if (Math.abs(tv) > 5) { started = false; continue; }
        y = amp * tv;
      }
      const py = midY - y * scaleY;
      if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [fn, amp, freq, phase]);

  return (
    <WidgetShell title="Trigonometric Graph" icon="📈" theme="blue">
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["sin","cos","tan"].map(f => (
          <button key={f} onClick={() => setFn(f)} style={{
            flex:1, padding:"7px 0", borderRadius:10, fontSize:13, fontWeight:700, border:"none", cursor:"pointer",
            background: fn===f ? "linear-gradient(135deg,#5b7fff,#3b5bdb)" : "rgba(59,91,219,0.08)",
            color: fn===f ? "white" : "#3b5bdb",
          }}>{f}(x)</button>
        ))}
      </div>
      <canvas ref={canvasRef} width={460} height={180}
        style={{ width:"100%", height:"auto", borderRadius:12, border:"1px solid rgba(59,91,219,0.10)", display:"block", marginBottom:14 }}/>
      <SliderRow label="Amplitude" value={amp}   min={0.1} max={3}    step={0.1} onChange={setAmp}   />
      <SliderRow label="Frequency" value={freq}  min={0.5} max={4}    step={0.5} onChange={setFreq}  />
      <SliderRow label="Phase"     value={phase} min={-3.14} max={3.14} step={0.1} onChange={setPhase} />
      <div style={{ display:"flex", gap:8, marginTop:4 }}>
        {[
          { label:"Max",    value: fn==="tan" ? "∞"  : `+${amp}` },
          { label:"Min",    value: fn==="tan" ? "-∞" : `-${amp}` },
          { label:"Period", value: fn==="tan" ? `π/${freq}` : `2π/${freq}` },
        ].map(({label,value}) => (
          <div key={label} style={{ flex:1, padding:"8px 10px", borderRadius:10, textAlign:"center", background:"rgba(59,91,219,0.05)", border:"1px solid rgba(59,91,219,0.10)" }}>
            <div style={{ fontSize:10, color:"#9bb0d8", fontWeight:600 }}>{label}</div>
            <div style={{ fontSize:14, fontWeight:800, color:"#2c3fd6" }}>{value}</div>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}

// ── Linear Graph ──────────────────────────────────────────────────
function LinearGraph({ spec }) {
  const canvasRef = useRef(null);
  const [m, setM] = useState(spec?.m ?? 1);
  const [b, setB] = useState(spec?.b ?? 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W/2, cy = H/2, scale = 22;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#f8faff"; ctx.fillRect(0,0,W,H);
    // Grid
    ctx.strokeStyle="rgba(59,91,219,0.08)"; ctx.lineWidth=1;
    for(let x=0;x<=W;x+=scale){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<=H;y+=scale){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    // Axes
    ctx.strokeStyle="rgba(59,91,219,0.3)"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(W,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,H);ctx.stroke();
    // Numbers
    ctx.fillStyle="#9bb0d8"; ctx.font="9px sans-serif"; ctx.textAlign="center";
    for(let i=-8;i<=8;i++){if(i===0)continue; ctx.fillText(i, cx+i*scale, cy+12); ctx.fillText(-i, cx-12, cy-i*scale+3);}
    // Line
    ctx.strokeStyle="#3b5bdb"; ctx.lineWidth=2.5; ctx.shadowColor="rgba(59,91,219,0.3)"; ctx.shadowBlur=4;
    ctx.beginPath();
    for(let px=0;px<=W;px++){
      const x=(px-cx)/scale; const y=m*x+b;
      if(Math.abs(y)>15){continue;}
      const py=cy-y*scale;
      px===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
    }
    ctx.stroke(); ctx.shadowBlur=0;
  },[m,b]);

  return (
    <WidgetShell title="Linear Equation Graph" icon="📊" theme="blue">
      <div style={{textAlign:"center",fontWeight:700,color:"#3b5bdb",background:"rgba(59,91,219,0.06)",borderRadius:10,padding:"6px",marginBottom:14,fontSize:14}}>
        y = {m}x {b>=0?"+":""}{b}
      </div>
      <canvas ref={canvasRef} width={460} height={220}
        style={{width:"100%",height:"auto",borderRadius:12,border:"1px solid rgba(59,91,219,0.10)",display:"block",marginBottom:14}}/>
      <SliderRow label="Slope (m)" value={m} min={-5} max={5} step={0.5} onChange={setM} />
      <SliderRow label="Intercept (b)" value={b} min={-5} max={5} step={0.5} onChange={setB} />
    </WidgetShell>
  );
}

// ── Quadratic Graph ───────────────────────────────────────────────
function QuadraticGraph({ spec }) {
  const canvasRef = useRef(null);
  const [a, setA] = useState(spec?.a ?? 1);
  const [b, setB] = useState(spec?.b ?? 0);
  const [c, setC] = useState(spec?.c ?? 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W/2, cy = H/2, scale = 22;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#f8faff"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="rgba(59,91,219,0.08)"; ctx.lineWidth=1;
    for(let x=0;x<=W;x+=scale){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<=H;y+=scale){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.strokeStyle="rgba(59,91,219,0.3)"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(W,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,H);ctx.stroke();
    ctx.strokeStyle="#3b5bdb"; ctx.lineWidth=2.5; ctx.shadowColor="rgba(59,91,219,0.3)"; ctx.shadowBlur=4;
    ctx.beginPath(); let started=false;
    for(let px=0;px<=W;px++){
      const x=(px-cx)/scale; const y=a*x*x+b*x+c;
      if(Math.abs(y)>15){started=false;continue;}
      const py=cy-y*scale;
      if(!started){ctx.moveTo(px,py);started=true;}else ctx.lineTo(px,py);
    }
    ctx.stroke(); ctx.shadowBlur=0;
  },[a,b,c]);

  return (
    <WidgetShell title="Quadratic Equation Graph" icon="📊" theme="purple">
      <div style={{textAlign:"center",fontWeight:700,color:"#7c3aed",background:"rgba(124,58,237,0.06)",borderRadius:10,padding:"6px",marginBottom:14,fontSize:14}}>
        y = {a}x² {b>=0?"+":""}{b}x {c>=0?"+":""}{c}
      </div>
      <canvas ref={canvasRef} width={460} height={220}
        style={{width:"100%",height:"auto",borderRadius:12,border:"1px solid rgba(124,58,237,0.15)",display:"block",marginBottom:14}}/>
      <SliderRow label="a (x² coefficient)" value={a} min={-3} max={3} step={0.5} onChange={setA} color="#7c3aed" />
      <SliderRow label="b (x coefficient)"  value={b} min={-5} max={5} step={0.5} onChange={setB} color="#7c3aed" />
      <SliderRow label="c (constant)"       value={c} min={-5} max={5} step={0.5} onChange={setC} color="#7c3aed" />
    </WidgetShell>
  );
}

// ── Unit Converters ───────────────────────────────────────────────
function TempConverter() {
  const [c, setC] = useState(25);
  return (
    <WidgetShell title="Temperature Converter" icon="🌡️" theme="orange">
      <SliderRow label="Celsius (°C)" value={c} min={-50} max={150} step={0.5} unit="°C" onChange={setC} color="#ea580c" />
      <div style={{ display:"flex", gap:10, marginTop:10 }}>
        {[
          {label:"Fahrenheit", value: +(c*9/5+32).toFixed(2), unit:"°F"},
          {label:"Kelvin",     value: +(c+273.15).toFixed(2), unit:"K"},
        ].map(({label,value,unit}) => (
          <div key={label} style={{flex:1,textAlign:"center",padding:"10px 8px",background:"rgba(234,88,12,0.08)",borderRadius:12,border:"1px solid rgba(234,88,12,0.20)"}}>
            <div style={{fontSize:11,color:"#9ca3af",marginBottom:4}}>{label}</div>
            <div style={{fontSize:18,fontWeight:800,color:"#ea580c"}}>{value} {unit}</div>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}

function DistanceConverter() {
  const [km, setKm] = useState(10);
  return (
    <WidgetShell title="Distance Converter" icon="📏" theme="blue">
      <SliderRow label="Kilometers (km)" value={km} min={0} max={1000} step={1} unit="km" onChange={setKm} />
      <div style={{ display:"flex", gap:10, marginTop:10, flexWrap:"wrap" }}>
        {[
          {label:"Miles",  value: +(km*0.621371).toFixed(3), unit:"mi"},
          {label:"Meters", value: +(km*1000).toFixed(0),     unit:"m"},
          {label:"Feet",   value: +(km*3280.84).toFixed(0),  unit:"ft"},
        ].map(({label,value,unit}) => (
          <div key={label} style={{flex:1,minWidth:80,textAlign:"center",padding:"8px 6px",background:"rgba(59,91,219,0.06)",borderRadius:12,border:"1px solid rgba(59,91,219,0.15)"}}>
            <div style={{fontSize:11,color:"#9ca3af",marginBottom:3}}>{label}</div>
            <div style={{fontSize:16,fontWeight:800,color:"#3b5bdb"}}>{value} {unit}</div>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}

function WeightConverter() {
  const [kg, setKg] = useState(70);
  return (
    <WidgetShell title="Weight Converter" icon="⚖️" theme="green">
      <SliderRow label="Kilograms (kg)" value={kg} min={0} max={300} step={0.5} unit="kg" onChange={setKg} color="#16a34a" />
      <div style={{ display:"flex", gap:10, marginTop:10 }}>
        {[
          {label:"Pounds", value: +(kg*2.20462).toFixed(2), unit:"lbs"},
          {label:"Grams",  value: +(kg*1000).toFixed(0),    unit:"g"},
          {label:"Ounces", value: +(kg*35.274).toFixed(2),  unit:"oz"},
        ].map(({label,value,unit}) => (
          <div key={label} style={{flex:1,textAlign:"center",padding:"8px 6px",background:"rgba(22,163,74,0.06)",borderRadius:12,border:"1px solid rgba(22,163,74,0.20)"}}>
            <div style={{fontSize:11,color:"#9ca3af",marginBottom:3}}>{label}</div>
            <div style={{fontSize:16,fontWeight:800,color:"#16a34a"}}>{value} {unit}</div>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}

// ── India States Table ────────────────────────────────────────────
const INDIA_STATES = [
  {n:1,  state:"Andhra Pradesh",    capital:"Amaravati",    region:"South",     pop:"49.4M",  area:"162,975 km²"},
  {n:2,  state:"Arunachal Pradesh", capital:"Itanagar",     region:"Northeast", pop:"1.4M",   area:"83,743 km²"},
  {n:3,  state:"Assam",             capital:"Dispur",       region:"Northeast", pop:"31.2M",  area:"78,438 km²"},
  {n:4,  state:"Bihar",             capital:"Patna",        region:"East",      pop:"104M",   area:"94,163 km²"},
  {n:5,  state:"Chhattisgarh",      capital:"Raipur",       region:"Central",   pop:"25.5M",  area:"135,192 km²"},
  {n:6,  state:"Goa",               capital:"Panaji",       region:"West",      pop:"1.5M",   area:"3,702 km²"},
  {n:7,  state:"Gujarat",           capital:"Gandhinagar",  region:"West",      pop:"60.4M",  area:"196,024 km²"},
  {n:8,  state:"Haryana",           capital:"Chandigarh",   region:"North",     pop:"25.4M",  area:"44,212 km²"},
  {n:9,  state:"Himachal Pradesh",  capital:"Shimla",       region:"North",     pop:"6.9M",   area:"55,673 km²"},
  {n:10, state:"Jharkhand",         capital:"Ranchi",       region:"East",      pop:"33M",    area:"79,716 km²"},
  {n:11, state:"Karnataka",         capital:"Bengaluru",    region:"South",     pop:"61.1M",  area:"191,791 km²"},
  {n:12, state:"Kerala",            capital:"Thiruvananthapuram", region:"South", pop:"33.4M", area:"38,852 km²"},
  {n:13, state:"Madhya Pradesh",    capital:"Bhopal",       region:"Central",   pop:"72.6M",  area:"308,252 km²"},
  {n:14, state:"Maharashtra",       capital:"Mumbai",       region:"West",      pop:"112M",   area:"307,713 km²"},
  {n:15, state:"Manipur",           capital:"Imphal",       region:"Northeast", pop:"2.9M",   area:"22,327 km²"},
  {n:16, state:"Meghalaya",         capital:"Shillong",     region:"Northeast", pop:"3M",     area:"22,429 km²"},
  {n:17, state:"Mizoram",           capital:"Aizawl",       region:"Northeast", pop:"1.1M",   area:"21,081 km²"},
  {n:18, state:"Nagaland",          capital:"Kohima",       region:"Northeast", pop:"2M",     area:"16,579 km²"},
  {n:19, state:"Odisha",            capital:"Bhubaneswar",  region:"East",      pop:"41.9M",  area:"155,707 km²"},
  {n:20, state:"Punjab",            capital:"Chandigarh",   region:"North",     pop:"27.7M",  area:"50,362 km²"},
  {n:21, state:"Rajasthan",         capital:"Jaipur",       region:"North",     pop:"68.5M",  area:"342,239 km²"},
  {n:22, state:"Sikkim",            capital:"Gangtok",      region:"Northeast", pop:"0.6M",   area:"7,096 km²"},
  {n:23, state:"Tamil Nadu",        capital:"Chennai",      region:"South",     pop:"72M",    area:"130,058 km²"},
  {n:24, state:"Telangana",         capital:"Hyderabad",    region:"South",     pop:"35M",    area:"112,077 km²"},
  {n:25, state:"Tripura",           capital:"Agartala",     region:"Northeast", pop:"3.7M",   area:"10,486 km²"},
  {n:26, state:"Uttar Pradesh",     capital:"Lucknow",      region:"North",     pop:"200M",   area:"240,928 km²"},
  {n:27, state:"Uttarakhand",       capital:"Dehradun",     region:"North",     pop:"10.1M",  area:"53,483 km²"},
  {n:28, state:"West Bengal",       capital:"Kolkata",      region:"East",      pop:"91.3M",  area:"88,752 km²"},
];

const REGION_COLORS = {
  North:"#dbeafe", South:"#fce7f3", East:"#fef9c3", West:"#dcfce7",
  Central:"#ffedd5", Northeast:"#ede9fe",
};
const REGION_TEXT = {
  North:"#1d4ed8", South:"#9d174d", East:"#854d0e", West:"#15803d",
  Central:"#9a3412", Northeast:"#6d28d9",
};

function IndiaStatesTable() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");

  const regions  = ["All","North","South","East","West","Central","Northeast"];
  const filtered = INDIA_STATES.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch = !q || s.state.toLowerCase().includes(q) || s.capital.toLowerCase().includes(q);
    const matchesRegion = region === "All" || s.region === region;
    return matchesSearch && matchesRegion;
  });

  return (
    <WidgetShell title="Indian States & Union Territories" icon="🗺️" theme="green">
      
      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
        <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, background:"white", borderRadius:12, padding:"8px 12px", border:"1px solid rgba(22,163,74,0.2)" }}>
          <span style={{ color:"#9ca3af" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search states or capitals..."
            style={{ border:"none", outline:"none", flex:1, fontSize:13, background:"transparent", color:"#1a2240" }}
          />
        </div>
        <select value={region} onChange={e=>setRegion(e.target.value)}
          style={{ padding:"8px 12px", borderRadius:12, border:"1px solid rgba(22,163,74,0.2)", fontSize:13, background:"white", color:"#1a2240", cursor:"pointer" }}>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      
      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
        {[
          {label:"States Shown", value:filtered.length},
          {label:"Total States", value:28},
          {label:"Union Territories", value:8},
          {label:"Regions", value:6},
        ].map(({label,value}) => (
          <div key={label} style={{ flex:1, minWidth:60, textAlign:"center", padding:"8px 6px", background:"rgba(22,163,74,0.08)", borderRadius:10, border:"1px solid rgba(22,163,74,0.15)" }}>
            <div style={{ fontSize:16, fontWeight:800, color:"#16a34a" }}>{value}</div>
            <div style={{ fontSize:10, color:"#6b7280", fontWeight:500 }}>{label}</div>
          </div>
        ))}
      </div>

     
      <div style={{ overflowX:"auto", overflowY:"auto", maxHeight:320, borderRadius:12, border:"1px solid rgba(22,163,74,0.2)" }}>
        <table style={{ borderCollapse:"collapse", width:"100%", fontSize:12, minWidth:380 }}>
          <thead style={{ position:"sticky", top:0, zIndex:1 }}>
            <tr style={{ background:"#16a34a" }}>
              {["#","State","Capital","Region","Population","Area"].map(h => (
                <th key={h} style={{ padding:"8px 10px", textAlign:"left", color:"white", fontWeight:700, whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign:"center", padding:20, color:"#9ca3af" }}>No results found</td></tr>
            ) : filtered.map((s, i) => (
              <tr key={s.n} style={{ background: i%2===0 ? "white" : "rgba(22,163,74,0.03)", borderBottom:"1px solid rgba(22,163,74,0.10)" }}>
                <td style={{ padding:"8px 10px", color:"#6b7280", fontWeight:600 }}>{s.n}</td>
                <td style={{ padding:"8px 10px", fontWeight:700, color:"#1a2240", whiteSpace:"nowrap" }}>{s.state}</td>
                <td style={{ padding:"8px 10px", color:"#374151" }}>{s.capital}</td>
                <td style={{ padding:"8px 10px" }}>
                  <span style={{ padding:"2px 8px", borderRadius:99, fontSize:11, fontWeight:600, background: REGION_COLORS[s.region]||"#f3f4f6", color: REGION_TEXT[s.region]||"#374151" }}>
                    {s.region}
                  </span>
                </td>
                <td style={{ padding:"8px 10px", color:"#374151", whiteSpace:"nowrap" }}>{s.pop}</td>
                <td style={{ padding:"8px 10px", color:"#374151", whiteSpace:"nowrap" }}>{s.area}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:11, color:"#9ca3af", textAlign:"center", marginTop:8 }}>
        {filtered.length} of {INDIA_STATES.length} states shown
      </div>
    </WidgetShell>
  );
}

// ── Steps Widget ──────────────────────────────────────────────────
function StepsWidget({ spec }) {
  const [current, setCurrent] = useState(0);
  const steps = spec?.steps || [];
  if (steps.length < 2) return null;
  const total = steps.length;

  return (
    <WidgetShell title="Step-by-Step Guide" icon="📋" theme="blue">
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
        <div style={{ flex:1, height:5, background:"rgba(59,91,219,0.10)", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:99, background:"linear-gradient(90deg,#5b7fff,#3b5bdb)", width:`${((current+1)/total)*100}%`, transition:"width 0.3s ease" }}/>
        </div>
        <span style={{ fontSize:12, color:"#6b7280", fontWeight:600, whiteSpace:"nowrap" }}>{current+1}/{total}</span>
      </div>
      <div style={{ padding:16, borderRadius:14, background:"linear-gradient(135deg,rgba(91,127,255,0.07),rgba(59,91,219,0.10))", border:"1px solid rgba(59,91,219,0.12)", minHeight:60, marginBottom:14 }}>
        <div style={{ fontSize:11, color:"#9bb0d8", fontWeight:700, marginBottom:6 }}>STEP {current+1}</div>
        <div style={{ fontSize:14, color:"#1a2240", lineHeight:1.6, fontWeight:500 }}>{steps[current]}</div>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <button onClick={()=>setCurrent(s=>Math.max(0,s-1))} disabled={current===0}
          style={{ flex:1, padding:"9px 0", borderRadius:12, fontSize:13, fontWeight:600, border:"none", cursor:current===0?"not-allowed":"pointer", opacity:current===0?0.4:1, background:"rgba(59,91,219,0.08)", color:"#3b5bdb" }}>
          ← Previous
        </button>
        <button onClick={()=>setCurrent(s=>Math.min(total-1,s+1))} disabled={current===total-1}
          style={{ flex:1, padding:"9px 0", borderRadius:12, fontSize:13, fontWeight:600, border:"none", cursor:current===total-1?"not-allowed":"pointer", opacity:current===total-1?0.4:1, background:"linear-gradient(135deg,#5b7fff,#3b5bdb)", color:"white" }}>
          Next →
        </button>
      </div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {steps.map((_,i) => (
          <button key={i} onClick={()=>setCurrent(i)} style={{
            width:28, height:28, borderRadius:"50%", fontSize:11, fontWeight:700, border:"none", cursor:"pointer",
            background: i===current ? "linear-gradient(135deg,#5b7fff,#3b5bdb)" : i<current ? "rgba(59,91,219,0.25)" : "rgba(59,91,219,0.07)",
            color: i===current ? "white" : i<current ? "#3b5bdb" : "#9ca3af",
          }}>{i+1}</button>
        ))}
      </div>
    </WidgetShell>
  );
}

// ── Quiz Widget ───────────────────────────────────────────────────
function QuizWidget({ quizData }) {
  const questions = quizData?.questions || [];
  const [currentQ,  setCurrentQ]  = useState(0);
  const [answers,   setAnswers]   = useState({});
  const [showScore, setShowScore] = useState(false);
  if (questions.length === 0) return null;

  const total = questions.length;
  const q     = questions[currentQ];
  const answered = answers[currentQ];

  const getStyle = (key) => {
    if (!answered) return { bg:"rgba(59,91,219,0.05)", border:"rgba(59,91,219,0.13)", color:"#374151" };
    if (key===answered && key===q.answer) return { bg:"rgba(34,197,94,0.10)", border:"#22c55e", color:"#15803d" };
    if (key===answered && key!==q.answer) return { bg:"rgba(239,68,68,0.08)", border:"#ef4444", color:"#b91c1c" };
    if (key===q.answer) return { bg:"rgba(34,197,94,0.06)", border:"rgba(34,197,94,0.30)", color:"#374151" };
    return { bg:"rgba(59,91,219,0.03)", border:"rgba(59,91,219,0.08)", color:"#9ca3af" };
  };

  const score = Object.entries(answers).filter(([i,ans]) => questions[+i]?.answer === ans).length;

  if (showScore) {
    const pct   = Math.round((score/total)*100);
    const color = pct>=80?"#22c55e":pct>=50?"#f59e0b":"#ef4444";
    return (
      <WidgetShell title="Quiz Results" icon="🧠" theme="blue">
        <div style={{ textAlign:"center", padding:"8px 0" }}>
          <div style={{ fontSize:48, fontWeight:800, color }}>{pct}%</div>
          <div style={{ fontSize:16, fontWeight:600, color:"#374151", margin:"8px 0" }}>{score} / {total} correct</div>
          <div style={{ fontSize:13, color:"#5a6a88", padding:"10px 16px", background:"rgba(59,91,219,0.05)", borderRadius:12, margin:"12px 0" }}>
            {pct>=80 ? "🎉 Excellent work!" : pct>=50 ? "👍 Good effort! Review the ones you missed." : "📚 Keep practicing! Review the topic and try again."}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:16 }}>
            {questions.map((qq,i) => {
              const ua = answers[i]; const ok = ua===qq.answer;
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 12px", borderRadius:10, fontSize:12, background:ok?"rgba(34,197,94,0.06)":"rgba(239,68,68,0.05)", border:`1px solid ${ok?"rgba(34,197,94,0.20)":"rgba(239,68,68,0.15)"}` }}>
                  <span>{ok?"✅":"❌"}</span>
                  <span style={{ flex:1, color:"#374151", fontWeight:500 }}>Q{i+1}: {qq.q.slice(0,50)}{qq.q.length>50?"...":""}</span>
                  <span style={{ color:ok?"#15803d":"#b91c1c", fontWeight:600 }}>{ua||"—"}{!ok&&qq.answer?` (${qq.answer})`:""}</span>
                </div>
              );
            })}
          </div>
          <button onClick={()=>{setAnswers({});setCurrentQ(0);setShowScore(false);}} style={{ padding:"10px 24px", borderRadius:12, fontSize:13, fontWeight:700, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#5b7fff,#3b5bdb)", color:"white" }}>
            Try Again
          </button>
        </div>
      </WidgetShell>
    );
  }

  return (
    <WidgetShell title={`Quiz — Question ${currentQ+1} of ${total}`} icon="🧠" theme="blue">
      <div style={{ height:5, background:"rgba(59,91,219,0.10)", borderRadius:99, overflow:"hidden", marginBottom:14 }}>
        <div style={{ height:"100%", borderRadius:99, background:"linear-gradient(90deg,#5b7fff,#3b5bdb)", width:`${((currentQ+1)/total)*100}%`, transition:"width 0.3s" }}/>
      </div>
      <p style={{ fontSize:13, fontWeight:600, color:"#1a2240", margin:"0 0 12px", lineHeight:1.5 }}>{q.q}</p>
      {Object.entries(q.options).map(([key, label]) => {
        const s = getStyle(key);
        return (
          <button key={key} disabled={!!answered} onClick={()=>setAnswers(p=>({...p,[currentQ]:key}))}
            style={{ width:"100%", textAlign:"left", padding:"10px 14px", borderRadius:12, fontSize:13, fontWeight:answered&&(key===answered||key===q.answer)?600:500, border:`1.5px solid ${s.border}`, background:s.bg, color:s.color, cursor:answered?"default":"pointer", transition:"all 0.18s", display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
            <span style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, background:answered&&(key===answered||key===q.answer)?s.border:"rgba(59,91,219,0.12)", color:answered&&(key===answered||key===q.answer)?"white":"#3b5bdb" }}>{key.toUpperCase()}</span>
            {label}
            {answered && key===q.answer && <span style={{ marginLeft:"auto" }}>✅</span>}
            {answered && key===answered && key!==q.answer && <span style={{ marginLeft:"auto" }}>❌</span>}
          </button>
        );
      })}
      {answered && (
        <div style={{ padding:"8px 12px", borderRadius:10, fontSize:12, fontWeight:500, background:answered===q.answer?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.07)", color:answered===q.answer?"#15803d":"#b91c1c", margin:"8px 0" }}>
          {answered===q.answer ? "🎉 Correct!" : `The correct answer is ${q.answer.toUpperCase()}.`}
        </div>
      )}
      <div style={{ display:"flex", gap:8, marginTop:8 }}>
        <button onClick={()=>setCurrentQ(q=>Math.max(0,q-1))} disabled={currentQ===0}
          style={{ flex:1, padding:"9px 0", borderRadius:12, fontSize:13, fontWeight:600, border:"none", cursor:currentQ===0?"not-allowed":"pointer", opacity:currentQ===0?0.4:1, background:"rgba(59,91,219,0.08)", color:"#3b5bdb" }}>← Previous</button>
        {currentQ<total-1 ? (
          <button onClick={()=>setCurrentQ(q=>q+1)} disabled={!answered}
            style={{ flex:1, padding:"9px 0", borderRadius:12, fontSize:13, fontWeight:600, border:"none", cursor:!answered?"not-allowed":"pointer", opacity:!answered?0.5:1, background:"linear-gradient(135deg,#5b7fff,#3b5bdb)", color:"white" }}>Next →</button>
        ) : (
          <button onClick={()=>setShowScore(true)} disabled={!answered}
            style={{ flex:1, padding:"9px 0", borderRadius:12, fontSize:13, fontWeight:700, border:"none", cursor:!answered?"not-allowed":"pointer", opacity:!answered?0.5:1, background:answered?"linear-gradient(135deg,#22c55e,#16a34a)":"rgba(180,195,230,0.4)", color:"white" }}>
            See Results 🎯
          </button>
        )}
      </div>
      <div style={{ display:"flex", gap:6, justifyContent:"center", flexWrap:"wrap", marginTop:10 }}>
        {questions.map((_,i) => (
          <button key={i} onClick={()=>setCurrentQ(i)} style={{
            width:26, height:26, borderRadius:"50%", fontSize:11, fontWeight:700, border:"none", cursor:"pointer",
            background: i===currentQ ? "linear-gradient(135deg,#5b7fff,#3b5bdb)" : answers[i]!==undefined ? answers[i]===questions[i].answer ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.20)" : "rgba(59,91,219,0.08)",
            color: i===currentQ ? "white" : answers[i]!==undefined ? answers[i]===questions[i].answer ? "#15803d" : "#b91c1c" : "#9ca3af",
          }}>{i+1}</button>
        ))}
      </div>
    </WidgetShell>
  );
}

// ── Widget Router ─────────────────────────────────────────────────
const WIDGET_MAP = {
  cylinder_calc:       () => <CylinderCalc />,
  sphere_calc:         () => <SphereCalc />,
  circle_calc:         () => <CircleCalc />,
  rectangle_calc:      () => <RectangleCalc />,
  triangle_calc:       () => <TriangleCalc />,
  pythagoras_calc:     () => <PythagorasCalc />,
  kinetic_energy_calc: () => <KineticEnergyCalc />,
  simple_interest_calc:   () => <SimpleInterestCalc />,
  compound_interest_calc: () => <CompoundInterestCalc />,
  bmi_calc:            () => <BMICalc />,
  trig_graph:          (spec) => <TrigGraph spec={spec} />,
  linear_graph:        (spec) => <LinearGraph spec={spec} />,
  quadratic_graph:     (spec) => <QuadraticGraph spec={spec} />,
  temp_converter:      () => <TempConverter />,
  distance_converter:  () => <DistanceConverter />,
  weight_converter:    () => <WeightConverter />,
  india_states_table:  () => <IndiaStatesTable />,
  steps_widget:        (spec) => <StepsWidget spec={spec} />,
};

export default function DynamicWidget({ widgetSpec, quizData, isStreaming }) {
  if (isStreaming) return null;

  // Render quiz
  if (quizData?.questions?.length > 0) {
    return (
      <div style={{ marginTop: 4, width: "100%", maxWidth: 520 }}>
        <QuizWidget quizData={quizData} />
      </div>
    );
  }

  // Render widget
  if (widgetSpec?.type) {
    const renderer = WIDGET_MAP[widgetSpec.type];
    if (!renderer) return null; // unknown type — render nothing

    return (
      <div style={{ marginTop: 4, width: "100%", maxWidth: 520 }}>
        {renderer(widgetSpec)}
      </div>
    );
  }

  return null;
}
*/}

import { useState, useRef, useEffect } from "react";

// ── Parse ALL widget specs and quiz data from AI response ─────────
export function parseAIBlocks(content) {
  if (!content) return { cleanText: "", widgetSpecs: [], quizData: null };

  let cleanText = content;
  const widgetSpecs = [];
  let quizData = null;

  // Parse ALL WIDGET_SPEC blocks
  const widgetRegex = /^WIDGET_SPEC:(\{.+\})\s*$/gm;
  let match;
  while ((match = widgetRegex.exec(content)) !== null) {
    try {
      const spec = JSON.parse(match[1]);
      widgetSpecs.push(spec);
      cleanText = cleanText.replace(match[0], "").trim();
    } catch { /* skip malformed */ }
  }

  // Parse QUIZ_DATA
  const quizMatch = content.match(/^QUIZ_DATA:(\{[\s\S]*?\})\s*$/m);
  if (quizMatch) {
    try {
      quizData  = JSON.parse(quizMatch[1]);
      cleanText = cleanText.replace(quizMatch[0], "").trim();
    } catch { /* skip */ }
  }

  cleanText = cleanText.replace(/\n{3,}/g, "\n\n").trim();
  return { cleanText, widgetSpecs, quizData };
}

// ── Shared styles ─────────────────────────────────────────────────
const sliderRow = { display: "flex", justifyContent: "space-between", marginBottom: 6 };
const valBadge  = {
  fontSize: 12, fontWeight: 700, color: "#3b5bdb",
  background: "rgba(59,91,219,0.08)", borderRadius: 8, padding: "1px 8px",
};
const sl = { width: "100%", accentColor: "#3b5bdb", cursor: "pointer", height: 20 };

// ── Panel shell ───────────────────────────────────────────────────
function Panel({ icon, title, children, color }) {
  const accent = color || "#3b5bdb";
  const bg     = color ? `${color}10` : "rgba(59,91,219,0.05)";
  const border = color ? `${color}25` : "rgba(59,91,219,0.14)";

  return (
    <div style={{
      borderRadius: 16,
      border: `1px solid ${border}`,
      background: "rgba(255,255,255,0.97)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      overflow: "hidden",
      width: "100%",
      marginTop: 6,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "11px 18px",
        background: bg,
        borderBottom: `1px solid ${border}`,
      }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: accent }}>{title}</span>
        <div style={{
          marginLeft: "auto", fontSize: 10, fontWeight: 600,
          color: accent, opacity: 0.6,
          background: `${accent}15`, borderRadius: 99, padding: "2px 8px",
        }}>interactive</div>
      </div>
      <div style={{ padding: "16px 18px" }}>{children}</div>
    </div>
  );
}

function SliderField({ f, val, onChange }) {
  return (
    <div>
      <div style={sliderRow}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{f.label}</label>
        <span style={valBadge}>{val}{f.unit ? ` ${f.unit}` : ""}</span>
      </div>
      <input
        type="range" min={f.min} max={f.max} step={f.step || 0.1}
        value={val}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={sl}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9ca3af", marginTop: 1 }}>
        <span>{f.min}</span><span>{f.max}</span>
      </div>
    </div>
  );
}

function ResultBox({ label, value, unit, color }) {
  const c = color || "#2c3fd6";
  return (
    <div style={{
      borderRadius: 14, padding: "14px 18px", textAlign: "center",
      background: `linear-gradient(135deg,${c}12,${c}1e)`,
      border: `1px solid ${c}25`,
    }}>
      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: c }}>
        {value !== null && value !== undefined ? value : "—"}
        {value !== null && value !== undefined && unit && (
          <span style={{ fontSize: 14, fontWeight: 500, color: "#6b7280", marginLeft: 5 }}>{unit}</span>
        )}
      </div>
    </div>
  );
}

// ── Safe formula evaluator ────────────────────────────────────────
function evalFormula(formula, fields, vals) {
  try {
    const ids    = (fields || []).map(f => f.id);
    const values = (fields || []).map(f => vals[f.id] ?? f.default ?? f.min ?? 0);
    const fn = new Function(...ids, `return (${formula});`);
    const result = fn(...values);
    if (isNaN(result) || !isFinite(result)) return null;
    return +result.toFixed(4);
  } catch {
    return null;
  }
}

// ══════════════════════════════════════════════════════════════════
// CALCULATOR widget — generic slider + formula
// ══════════════════════════════════════════════════════════════════
function CalculatorWidget({ spec }) {
  const initVals = {};
  (spec.fields || []).forEach(f => { initVals[f.id] = f.default ?? f.min ?? 0; });
  const [vals, setVals] = useState(initVals);

  const result = evalFormula(spec.formula, spec.fields, vals);

  return (
    <Panel icon="🧮" title={spec.title || "Calculator"}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {spec.formula_display && (
          <div style={{
            fontSize: 13, fontWeight: 600, color: "#3b5bdb", textAlign: "center",
            background: "rgba(59,91,219,0.06)", borderRadius: 10, padding: "6px 12px",
          }}>{spec.formula_display}</div>
        )}
        {(spec.fields || []).map(f => (
          <SliderField key={f.id} f={f} val={vals[f.id]}
            onChange={v => setVals(p => ({ ...p, [f.id]: v }))} />
        ))}
        <ResultBox label="Result" value={result} unit={spec.result_unit} />
      </div>
    </Panel>
  );
}

// ══════════════════════════════════════════════════════════════════
// SHAPE widget — SVG visual + calculator
// ══════════════════════════════════════════════════════════════════
function ShapeWidget({ spec }) {
  const initVals = {};
  (spec.fields || []).forEach(f => { initVals[f.id] = f.default ?? f.min ?? 0; });
  const [vals, setVals] = useState(initVals);

  const result = evalFormula(spec.formula, spec.fields, vals);
  const sub    = spec.subtype || "circle";
  const SVG    = 200;
  const cx = SVG / 2, cy = SVG / 2;

  // Helper: get value by id or common aliases
  const get = (...ids) => {
    for (const id of ids) if (vals[id] !== undefined) return vals[id];
    return 5;
  };

  const renderShape = () => {
    if (sub === "circle") {
      const r    = get("r", "radius");
      const maxF = (spec.fields || []).find(f => f.id === "r" || f.id === "radius");
      const maxV = maxF?.max || 30;
      const dr   = Math.max(15, Math.min(85, (r / maxV) * 85));
      return (
        <svg width={SVG} height={SVG} viewBox={`0 0 ${SVG} ${SVG}`}>
          <defs>
            <radialGradient id="cg1" cx="38%" cy="35%">
              <stop offset="0%" stopColor="rgba(91,127,255,0.35)"/>
              <stop offset="100%" stopColor="rgba(59,91,219,0.14)"/>
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={dr} fill="url(#cg1)" stroke="#3b5bdb" strokeWidth="2"/>
          <line x1={cx} y1={cy} x2={cx + dr} y2={cy} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3"/>
          <text x={cx + dr/2} y={cy - 7} fontSize="10" fill="#ef4444" textAnchor="middle" fontWeight="700">r = {r}</text>
          <circle cx={cx} cy={cy} r={3} fill="#1c2340"/>
        </svg>
      );
    }

    if (sub === "rectangle") {
      const w = get("w", "width", "a"); const h = get("h", "height", "b");
      const wF = (spec.fields||[]).find(f=>["w","width","a"].includes(f.id));
      const hF = (spec.fields||[]).find(f=>["h","height","b"].includes(f.id));
      const dw = Math.max(30, Math.min(150, (w/(wF?.max||50))*150));
      const dh = Math.max(20, Math.min(110, (h/(hF?.max||50))*110));
      const rx = cx - dw/2, ry = cy - dh/2;
      return (
        <svg width={SVG} height={SVG} viewBox={`0 0 ${SVG} ${SVG}`}>
          <defs>
            <linearGradient id="rg1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(91,127,255,0.28)"/>
              <stop offset="100%" stopColor="rgba(59,91,219,0.10)"/>
            </linearGradient>
          </defs>
          <rect x={rx} y={ry} width={dw} height={dh} fill="url(#rg1)" stroke="#3b5bdb" strokeWidth="2"/>
          <text x={cx} y={ry+dh+16} fontSize="10" fill="#ef4444" textAnchor="middle" fontWeight="700">w = {w}</text>
          <text x={rx+dw+14} y={cy+4} fontSize="10" fill="#22c55e" textAnchor="middle" fontWeight="700">h = {h}</text>
        </svg>
      );
    }

    if (sub === "triangle") {
      const b = get("b","base","a"); const h = get("h","height","b");
      const bF = (spec.fields||[]).find(f=>["b","base","a"].includes(f.id));
      const hF = (spec.fields||[]).find(f=>["h","height"].includes(f.id));
      const db = Math.max(40, Math.min(150, (b/(bF?.max||50))*150));
      const dh = Math.max(30, Math.min(120, (h/(hF?.max||50))*120));
      const bx1 = cx - db/2, by1 = cy + dh/2;
      return (
        <svg width={SVG} height={SVG} viewBox={`0 0 ${SVG} ${SVG}`}>
          <defs>
            <linearGradient id="tg1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(91,127,255,0.28)"/>
              <stop offset="100%" stopColor="rgba(59,91,219,0.10)"/>
            </linearGradient>
          </defs>
          <polygon points={`${cx},${by1-dh} ${bx1},${by1} ${bx1+db},${by1}`}
            fill="url(#tg1)" stroke="#3b5bdb" strokeWidth="2"/>
          <line x1={cx} y1={by1-dh} x2={cx} y2={by1} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3"/>
          <text x={cx+10} y={cy} fontSize="10" fill="#ef4444" fontWeight="700">h={h}</text>
          <text x={cx} y={by1+15} fontSize="10" fill="#22c55e" textAnchor="middle" fontWeight="700">b={b}</text>
        </svg>
      );
    }

    if (sub === "sphere") {
      const r = get("r","radius");
      const maxV = (spec.fields||[]).find(f=>f.id==="r"||f.id==="radius")?.max || 20;
      const dr = Math.max(20, Math.min(80, (r/maxV)*80));
      return (
        <svg width={SVG} height={SVG} viewBox={`0 0 ${SVG} ${SVG}`}>
          <defs>
            <radialGradient id="sg1" cx="35%" cy="30%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.55)"/>
              <stop offset="40%" stopColor="rgba(91,127,255,0.38)"/>
              <stop offset="100%" stopColor="rgba(59,91,219,0.22)"/>
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={dr} fill="url(#sg1)" stroke="#3b5bdb" strokeWidth="2"/>
          <ellipse cx={cx} cy={cy} rx={dr} ry={dr*0.28} fill="none"
            stroke="rgba(59,91,219,0.35)" strokeWidth="1.5" strokeDasharray="5,4"/>
          <line x1={cx} y1={cy} x2={cx+dr} y2={cy} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3"/>
          <text x={cx+dr/2} y={cy-7} fontSize="10" fill="#ef4444" textAnchor="middle" fontWeight="700">r={r}</text>
        </svg>
      );
    }

    if (sub === "cylinder") {
      const r = get("r","radius"); const h = get("h","height");
      const rF = (spec.fields||[]).find(f=>f.id==="r"||f.id==="radius");
      const hF = (spec.fields||[]).find(f=>f.id==="h"||f.id==="height");
      const dr = Math.max(20, Math.min(65, (r/(rF?.max||20))*65));
      const dh = Math.max(30, Math.min(110, (h/(hF?.max||50))*110));
      return (
        <svg width={SVG} height={SVG} viewBox={`0 0 ${SVG} ${SVG}`}>
          <defs>
            <linearGradient id="cyg1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="rgba(59,91,219,0.22)"/>
              <stop offset="50%"  stopColor="rgba(91,127,255,0.35)"/>
              <stop offset="100%" stopColor="rgba(59,91,219,0.18)"/>
            </linearGradient>
          </defs>
          {/* Body */}
          <rect x={cx-dr} y={cy-dh/2} width={dr*2} height={dh} fill="url(#cyg1)" stroke="#3b5bdb" strokeWidth="2"/>
          {/* Top ellipse */}
          <ellipse cx={cx} cy={cy-dh/2} rx={dr} ry={dr*0.32} fill="rgba(91,127,255,0.32)" stroke="#3b5bdb" strokeWidth="2"/>
          {/* Bottom ellipse */}
          <ellipse cx={cx} cy={cy+dh/2} rx={dr} ry={dr*0.32} fill="rgba(59,91,219,0.12)" stroke="#3b5bdb" strokeWidth="1.5"/>
          {/* Radius label */}
          <line x1={cx} y1={cy-dh/2} x2={cx+dr} y2={cy-dh/2} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3"/>
          <text x={cx+dr/2} y={cy-dh/2-7} fontSize="10" fill="#ef4444" textAnchor="middle" fontWeight="700">r={r}</text>
          {/* Height label */}
          <line x1={cx+dr+10} y1={cy-dh/2} x2={cx+dr+10} y2={cy+dh/2} stroke="#22c55e" strokeWidth="1.5"/>
          <text x={cx+dr+22} y={cy+4} fontSize="10" fill="#22c55e" textAnchor="middle" fontWeight="700">h={h}</text>
          {/* Labels inside */}
          <text x={cx} y={cy+4} fontSize="11" fill="rgba(30,50,120,0.7)" textAnchor="middle" fontWeight="600">h = {h}</text>
          <text x={cx} y={cy+dh/2+16} fontSize="10" fill="#374151" textAnchor="middle">r = {r}</text>
        </svg>
      );
    }

    return null;
  };

  return (
    <Panel icon="📐" title={spec.title || "Interactive Shape"}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {spec.formula_display && (
          <div style={{
            fontSize: 13, fontWeight: 600, color: "#3b5bdb", textAlign: "center",
            background: "rgba(59,91,219,0.06)", borderRadius: 10, padding: "6px 12px",
          }}>{spec.formula_display}</div>
        )}
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          background: "rgba(248,250,255,0.8)", borderRadius: 14, padding: 8,
          border: "1px solid rgba(59,91,219,0.08)",
        }}>
          {renderShape()}
        </div>
        {(spec.fields || []).map(f => (
          <SliderField key={f.id} f={f} val={vals[f.id]}
            onChange={v => setVals(p => ({ ...p, [f.id]: v }))} />
        ))}
        <ResultBox label={spec.formula_display || "Result"} value={result} unit={spec.result_unit} />
        {result !== null && (
          <div style={{ fontSize: 12, color: "#6b7280", textAlign: "center" }}>
            {spec.formula_display?.replace(/[A-Z]\s*=/i,"").trim()} = {result} {spec.result_unit || ""}
          </div>
        )}
      </div>
    </Panel>
  );
}

// ══════════════════════════════════════════════════════════════════
// GRAPH widget
// ══════════════════════════════════════════════════════════════════
function GraphWidget({ spec }) {
  const canvasRef   = useRef(null);
  const [fnType,    setFnType]    = useState(spec.subtype || "sin");
  const [amplitude, setAmplitude] = useState(1);
  const [frequency, setFrequency] = useState(1);
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);

  const isTrig = ["sin", "cos", "tan"].includes(fnType);

  useEffect(() => { drawGraph(); }, [fnType, amplitude, frequency, a, b, c]);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const midX = W/2, midY = H/2;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#f8faff";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(59,91,219,0.08)"; ctx.lineWidth = 1;
    const gx = isTrig ? W/8 : 30;
    for (let x = 0; x <= W; x += gx) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 30)  { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Axes
    ctx.strokeStyle = "rgba(59,91,219,0.35)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0,midY); ctx.lineTo(W,midY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(midX,0); ctx.lineTo(midX,H); ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#9bb0d8"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    if (isTrig) {
      ["-2π","-π","0","π","2π"].forEach((l,i) => ctx.fillText(l,(i/4)*W, midY+14));
    } else {
      for (let i=-5;i<=5;i++) { if(i!==0) ctx.fillText(i, midX+i*30, midY+14); }
    }

    // Plot
    ctx.strokeStyle = "#3b5bdb"; ctx.lineWidth = 2.5;
    ctx.shadowColor = "rgba(59,91,219,0.25)"; ctx.shadowBlur = 4;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px <= W; px++) {
      let y;
      if (isTrig) {
        const x  = (px/W)*4*Math.PI - 2*Math.PI;
        const xp = frequency * x;
        if (fnType === "sin")      y = amplitude * Math.sin(xp);
        else if (fnType === "cos") y = amplitude * Math.cos(xp);
        else {
          const t = Math.tan(xp);
          if (Math.abs(t) > 5) { started = false; continue; }
          y = amplitude * t;
        }
        const py = midY - y * (H/2) * 0.75;
        if (!started) { ctx.moveTo(px,py); started=true; } else ctx.lineTo(px,py);
      } else {
        const x = (px - midX) / 30;
        if      (fnType==="linear")      y = a*x + b;
        else if (fnType==="quadratic")   y = a*x*x + b*x + c;
        else if (fnType==="exponential") y = a*Math.pow(b||Math.E, x) + c;
        else                             y = a*x + b;
        if (Math.abs(y) > 10) { started=false; continue; }
        const py = midY - y*30;
        if (!started) { ctx.moveTo(px,py); started=true; } else ctx.lineTo(px,py);
      }
    }
    ctx.stroke(); ctx.shadowBlur = 0;
  };

  const fnLabel = isTrig
    ? `y = ${amplitude}·${fnType}(${frequency}x)`
    : fnType==="linear"      ? `y = ${a}x + ${b}`
    : fnType==="quadratic"   ? `y = ${a}x² + ${b}x + ${c}`
    : fnType==="exponential" ? `y = ${a}·${(b||Math.E).toFixed(1)}^x + ${c}`
    : "y = f(x)";

  return (
    <Panel icon="📈" title={spec.title || "Interactive Graph"}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Function type selector */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["sin","cos","tan","linear","quadratic","exponential"].map(fn => (
            <button key={fn} onClick={() => setFnType(fn)} style={{
              padding: "5px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              border: "none", cursor: "pointer",
              background: fnType===fn ? "linear-gradient(135deg,#5b7fff,#3b5bdb)" : "rgba(59,91,219,0.08)",
              color: fnType===fn ? "white" : "#3b5bdb",
            }}>{fn}</button>
          ))}
        </div>

        <div style={{
          fontSize: 13, fontWeight: 700, color: "#3b5bdb", textAlign: "center",
          background: "rgba(59,91,219,0.06)", borderRadius: 10, padding: 6,
        }}>{fnLabel}</div>

        <canvas ref={canvasRef} width={460} height={220} style={{
          width: "100%", height: "auto", borderRadius: 12,
          border: "1px solid rgba(59,91,219,0.10)",
        }}/>

        {isTrig && (
          <>
            <div>
              <div style={sliderRow}>
                <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>Amplitude</span>
                <span style={valBadge}>{amplitude}</span>
              </div>
              <input type="range" min={0.1} max={3} step={0.1} value={amplitude}
                onChange={e => setAmplitude(parseFloat(e.target.value))} style={sl}/>
            </div>
            <div>
              <div style={sliderRow}>
                <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>Frequency</span>
                <span style={valBadge}>{frequency}x</span>
              </div>
              <input type="range" min={0.5} max={4} step={0.5} value={frequency}
                onChange={e => setFrequency(parseFloat(e.target.value))} style={sl}/>
            </div>
          </>
        )}

        {!isTrig && (
          <>
            <div>
              <div style={sliderRow}>
                <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>
                  {fnType==="quadratic"?"a (x²)":fnType==="exponential"?"Multiplier (a)":"Slope (a)"}
                </span>
                <span style={valBadge}>{a}</span>
              </div>
              <input type="range" min={-5} max={5} step={0.5} value={a}
                onChange={e => setA(parseFloat(e.target.value))} style={sl}/>
            </div>
            <div>
              <div style={sliderRow}>
                <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>
                  {fnType==="exponential"?"Base (b)":fnType==="quadratic"?"b (x coeff)":"Intercept (b)"}
                </span>
                <span style={valBadge}>{b}</span>
              </div>
              <input type="range" min={fnType==="exponential"?0.5:-5} max={5} step={0.5} value={b}
                onChange={e => setB(parseFloat(e.target.value))} style={sl}/>
            </div>
            {(fnType==="quadratic"||fnType==="exponential") && (
              <div>
                <div style={sliderRow}>
                  <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>Constant (c)</span>
                  <span style={valBadge}>{c}</span>
                </div>
                <input type="range" min={-5} max={5} step={0.5} value={c}
                  onChange={e => setC(parseFloat(e.target.value))} style={sl}/>
              </div>
            )}
          </>
        )}

        {isTrig && (
          <div style={{ display:"flex", gap:8 }}>
            {[
              { label:"Max",    value: fnType==="tan"?"∞":`+${amplitude}` },
              { label:"Min",    value: fnType==="tan"?"-∞":`-${amplitude}` },
              { label:"Period", value: fnType==="tan"?`π/${frequency}`:`2π/${frequency}` },
            ].map(({label,value}) => (
              <div key={label} style={{ flex:1, padding:"8px 6px", borderRadius:10, textAlign:"center", background:"rgba(59,91,219,0.05)", border:"1px solid rgba(59,91,219,0.10)" }}>
                <div style={{ fontSize:10, color:"#9bb0d8", fontWeight:600 }}>{label}</div>
                <div style={{ fontSize:14, fontWeight:800, color:"#2c3fd6" }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}

// ══════════════════════════════════════════════════════════════════
// CONVERTER widget
// ══════════════════════════════════════════════════════════════════
function ConverterWidget({ spec }) {
  const fields  = spec.fields || [];
  const [val, setVal] = useState(fields[0]?.default ?? 0);

  let converted = null;
  try {
    const fn = new Function(fields[0]?.id || "x", `return (${spec.formula});`);
    converted = +fn(val).toFixed(4);
  } catch { converted = null; }

  return (
    <Panel icon="🔄" title={spec.title || "Converter"}>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {fields[0] && (
          <>
            <div style={sliderRow}>
              <label style={{ fontSize:13, fontWeight:600, color:"#374151" }}>{fields[0].label}</label>
              <span style={valBadge}>{val} {fields[0].unit||""}</span>
            </div>
            <input type="range" min={fields[0].min} max={fields[0].max} step={fields[0].step||1}
              value={val} onChange={e => setVal(parseFloat(e.target.value))} style={sl}/>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ flex:1, textAlign:"center", padding:10, background:"rgba(59,91,219,0.05)", borderRadius:12, fontSize:14, fontWeight:700, color:"#1a2240" }}>
                {val} {fields[0].unit}
              </div>
              <span style={{ fontSize:20, color:"#3b5bdb" }}>→</span>
              <div style={{ flex:1, textAlign:"center", padding:10, background:"linear-gradient(135deg,rgba(91,127,255,0.10),rgba(59,91,219,0.14))", borderRadius:12, fontSize:14, fontWeight:800, color:"#2c3fd6", border:"1px solid rgba(59,91,219,0.15)" }}>
                {converted ?? "—"} {fields[1]?.unit || spec.result_unit || ""}
              </div>
            </div>
            {spec.formula_display && (
              <div style={{ fontSize:12, color:"#9ca3af", textAlign:"center" }}>{spec.formula_display}</div>
            )}
          </>
        )}
      </div>
    </Panel>
  );
}

// ══════════════════════════════════════════════════════════════════
// STEPS widget
// ══════════════════════════════════════════════════════════════════
function StepsWidget({ spec }) {
  const [cur, setCur] = useState(0);
  const steps = spec.steps || [];
  if (steps.length < 2) return null;

  return (
    <Panel icon="📋" title={spec.title || "Step-by-Step"}>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ height:5, background:"rgba(59,91,219,0.10)", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:99, background:"linear-gradient(90deg,#5b7fff,#3b5bdb)", width:`${((cur+1)/steps.length)*100}%`, transition:"width 0.3s" }}/>
        </div>
        <div style={{ padding:14, borderRadius:14, background:"linear-gradient(135deg,rgba(91,127,255,0.07),rgba(59,91,219,0.10))", border:"1px solid rgba(59,91,219,0.12)", minHeight:60 }}>
          <div style={{ fontSize:10, color:"#9bb0d8", fontWeight:700, marginBottom:4 }}>STEP {cur+1} OF {steps.length}</div>
          <div style={{ fontSize:14, color:"#1a2240", lineHeight:1.6, fontWeight:500 }}>{steps[cur]}</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setCur(s=>Math.max(0,s-1))} disabled={cur===0}
            style={{ flex:1, padding:"9px 0", borderRadius:12, fontSize:13, fontWeight:600, border:"none", cursor:cur===0?"not-allowed":"pointer", opacity:cur===0?0.4:1, background:"rgba(59,91,219,0.08)", color:"#3b5bdb" }}>
            ← Prev
          </button>
          <button onClick={()=>setCur(s=>Math.min(steps.length-1,s+1))} disabled={cur===steps.length-1}
            style={{ flex:1, padding:"9px 0", borderRadius:12, fontSize:13, fontWeight:600, border:"none", cursor:cur===steps.length-1?"not-allowed":"pointer", opacity:cur===steps.length-1?0.4:1, background:"linear-gradient(135deg,#5b7fff,#3b5bdb)", color:"white" }}>
            Next →
          </button>
        </div>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {steps.map((_,i) => (
            <button key={i} onClick={()=>setCur(i)} style={{
              width:26, height:26, borderRadius:"50%", fontSize:11, fontWeight:700, border:"none", cursor:"pointer",
              background: i===cur?"linear-gradient(135deg,#5b7fff,#3b5bdb)":i<cur?"rgba(59,91,219,0.22)":"rgba(59,91,219,0.07)",
              color: i===cur?"white":i<cur?"#3b5bdb":"#9ca3af",
            }}>{i+1}</button>
          ))}
        </div>
      </div>
    </Panel>
  );
}

// ══════════════════════════════════════════════════════════════════
// TABLE widget
// ══════════════════════════════════════════════════════════════════
function TableWidget({ spec }) {
  const [search,  setSearch]  = useState("");
  const [sortCol, setSortCol] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  const cols = spec.columns || [];
  let rows   = spec.rows    || [];

  if (search) {
    rows = rows.filter(r =>
      Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
    );
  }
  if (sortCol) {
    rows = [...rows].sort((a,b) => {
      const va = a[sortCol] ?? "", vb = b[sortCol] ?? "";
      return sortAsc ? (va<vb?-1:va>vb?1:0) : (va<vb?1:va>vb?-1:0);
    });
  }

  return (
    <Panel icon="📊" title={spec.title || "Data Table"}>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <input type="text" placeholder="Search..." value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{ width:"100%", padding:"8px 12px", borderRadius:10, fontSize:13, border:"1.5px solid rgba(59,91,219,0.15)", outline:"none", background:"rgba(59,91,219,0.04)", color:"#1a2240" }}/>
        <div style={{ overflowX:"auto", maxHeight:320 }}>
          <table style={{ borderCollapse:"collapse", width:"100%", fontSize:13 }}>
            <thead>
              <tr style={{ background:"rgba(59,91,219,0.07)" }}>
                {cols.map(col => (
                  <th key={col.id}
                    onClick={()=>{ if(sortCol===col.id)setSortAsc(a=>!a); else{setSortCol(col.id);setSortAsc(true);} }}
                    style={{ padding:"8px 12px", textAlign:"left", cursor:"pointer", border:"1px solid rgba(59,91,219,0.12)", fontWeight:700, color:"#2c3fd6", userSelect:"none", whiteSpace:"nowrap" }}>
                    {col.label} {sortCol===col.id?(sortAsc?"↑":"↓"):""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={cols.length} style={{ textAlign:"center", padding:16, color:"#9ca3af" }}>No results found</td></tr>
              ) : rows.map((row,i) => (
                <tr key={i} style={{ background:i%2===0?"white":"rgba(59,91,219,0.02)" }}>
                  {cols.map(col => (
                    <td key={col.id} style={{ padding:"7px 12px", border:"1px solid rgba(59,91,219,0.08)", color:"#374151" }}>{row[col.id]??""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize:11, color:"#9ca3af", textAlign:"right" }}>{rows.length} rows</div>
      </div>
    </Panel>
  );
}

// ══════════════════════════════════════════════════════════════════
// INDIA STATES widget — hardcoded, always complete
// ══════════════════════════════════════════════════════════════════
const INDIA_STATES = [
  {n:1,  state:"Andhra Pradesh",    capital:"Amaravati",           region:"South",     pop:"49.4M",  area:"162,975 km²"},
  {n:2,  state:"Arunachal Pradesh", capital:"Itanagar",            region:"Northeast", pop:"1.4M",   area:"83,743 km²"},
  {n:3,  state:"Assam",             capital:"Dispur",              region:"Northeast", pop:"31.2M",  area:"78,438 km²"},
  {n:4,  state:"Bihar",             capital:"Patna",               region:"East",      pop:"104M",   area:"94,163 km²"},
  {n:5,  state:"Chhattisgarh",      capital:"Raipur",              region:"Central",   pop:"25.5M",  area:"135,192 km²"},
  {n:6,  state:"Goa",               capital:"Panaji",              region:"West",      pop:"1.5M",   area:"3,702 km²"},
  {n:7,  state:"Gujarat",           capital:"Gandhinagar",         region:"West",      pop:"60.4M",  area:"196,024 km²"},
  {n:8,  state:"Haryana",           capital:"Chandigarh",          region:"North",     pop:"25.4M",  area:"44,212 km²"},
  {n:9,  state:"Himachal Pradesh",  capital:"Shimla",              region:"North",     pop:"6.9M",   area:"55,673 km²"},
  {n:10, state:"Jharkhand",         capital:"Ranchi",              region:"East",      pop:"33M",    area:"79,716 km²"},
  {n:11, state:"Karnataka",         capital:"Bengaluru",           region:"South",     pop:"61.1M",  area:"191,791 km²"},
  {n:12, state:"Kerala",            capital:"Thiruvananthapuram",  region:"South",     pop:"33.4M",  area:"38,852 km²"},
  {n:13, state:"Madhya Pradesh",    capital:"Bhopal",              region:"Central",   pop:"72.6M",  area:"308,252 km²"},
  {n:14, state:"Maharashtra",       capital:"Mumbai",              region:"West",      pop:"112M",   area:"307,713 km²"},
  {n:15, state:"Manipur",           capital:"Imphal",              region:"Northeast", pop:"2.9M",   area:"22,327 km²"},
  {n:16, state:"Meghalaya",         capital:"Shillong",            region:"Northeast", pop:"3M",     area:"22,429 km²"},
  {n:17, state:"Mizoram",           capital:"Aizawl",              region:"Northeast", pop:"1.1M",   area:"21,081 km²"},
  {n:18, state:"Nagaland",          capital:"Kohima",              region:"Northeast", pop:"2M",     area:"16,579 km²"},
  {n:19, state:"Odisha",            capital:"Bhubaneswar",         region:"East",      pop:"41.9M",  area:"155,707 km²"},
  {n:20, state:"Punjab",            capital:"Chandigarh",          region:"North",     pop:"27.7M",  area:"50,362 km²"},
  {n:21, state:"Rajasthan",         capital:"Jaipur",              region:"North",     pop:"68.5M",  area:"342,239 km²"},
  {n:22, state:"Sikkim",            capital:"Gangtok",             region:"Northeast", pop:"0.6M",   area:"7,096 km²"},
  {n:23, state:"Tamil Nadu",        capital:"Chennai",             region:"South",     pop:"72M",    area:"130,058 km²"},
  {n:24, state:"Telangana",         capital:"Hyderabad",           region:"South",     pop:"35M",    area:"112,077 km²"},
  {n:25, state:"Tripura",           capital:"Agartala",            region:"Northeast", pop:"3.7M",   area:"10,486 km²"},
  {n:26, state:"Uttar Pradesh",     capital:"Lucknow",             region:"North",     pop:"200M",   area:"240,928 km²"},
  {n:27, state:"Uttarakhand",       capital:"Dehradun",            region:"North",     pop:"10.1M",  area:"53,483 km²"},
  {n:28, state:"West Bengal",       capital:"Kolkata",             region:"East",      pop:"91.3M",  area:"88,752 km²"},
];

const REGION_COLORS = {
  North:"#dbeafe",South:"#fce7f3",East:"#fef9c3",West:"#dcfce7",Central:"#ffedd5",Northeast:"#ede9fe"
};
const REGION_TEXT = {
  North:"#1d4ed8",South:"#9d174d",East:"#854d0e",West:"#15803d",Central:"#9a3412",Northeast:"#6d28d9"
};

function IndiaStatesWidget() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");

  const regions  = ["All","North","South","East","West","Central","Northeast"];
  const filtered = INDIA_STATES.filter(s => {
    const q   = search.toLowerCase();
    const mQ  = !q || s.state.toLowerCase().includes(q) || s.capital.toLowerCase().includes(q);
    const mR  = region === "All" || s.region === region;
    return mQ && mR;
  });

  return (
    <Panel icon="🗺️" title="Indian States & Union Territories" color="#16a34a">
      {/* Search + filter */}
      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
        <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, background:"white", borderRadius:12, padding:"8px 12px", border:"1px solid rgba(22,163,74,0.2)" }}>
          <span style={{ color:"#9ca3af" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search states or capitals..."
            style={{ border:"none", outline:"none", flex:1, fontSize:13, background:"transparent", color:"#1a2240" }}/>
        </div>
        <select value={region} onChange={e=>setRegion(e.target.value)}
          style={{ padding:"8px 12px", borderRadius:12, border:"1px solid rgba(22,163,74,0.2)", fontSize:13, background:"white", color:"#1a2240", cursor:"pointer" }}>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Stats row */}
      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
        {[
          {label:"Shown",  value:filtered.length},
          {label:"States", value:28},
          {label:"UTs",    value:8},
          {label:"Regions",value:6},
        ].map(({label,value}) => (
          <div key={label} style={{ flex:1, minWidth:55, textAlign:"center", padding:"7px 4px", background:"rgba(22,163,74,0.08)", borderRadius:10, border:"1px solid rgba(22,163,74,0.15)" }}>
            <div style={{ fontSize:16, fontWeight:800, color:"#16a34a" }}>{value}</div>
            <div style={{ fontSize:10, color:"#6b7280", fontWeight:500 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX:"auto", overflowY:"auto", maxHeight:320, borderRadius:12, border:"1px solid rgba(22,163,74,0.2)" }}>
        <table style={{ borderCollapse:"collapse", width:"100%", fontSize:12, minWidth:380 }}>
          <thead style={{ position:"sticky", top:0, zIndex:1 }}>
            <tr style={{ background:"#16a34a" }}>
              {["#","State","Capital","Region","Population","Area"].map(h => (
                <th key={h} style={{ padding:"8px 10px", textAlign:"left", color:"white", fontWeight:700, whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign:"center", padding:20, color:"#9ca3af" }}>No results found</td></tr>
            ) : filtered.map((s,i) => (
              <tr key={s.n} style={{ background:i%2===0?"white":"rgba(22,163,74,0.03)", borderBottom:"1px solid rgba(22,163,74,0.10)" }}>
                <td style={{ padding:"7px 10px", color:"#6b7280", fontWeight:600 }}>{s.n}</td>
                <td style={{ padding:"7px 10px", fontWeight:700, color:"#1a2240", whiteSpace:"nowrap" }}>{s.state}</td>
                <td style={{ padding:"7px 10px", color:"#374151" }}>{s.capital}</td>
                <td style={{ padding:"7px 10px" }}>
                  <span style={{ padding:"2px 8px", borderRadius:99, fontSize:11, fontWeight:600, background:REGION_COLORS[s.region]||"#f3f4f6", color:REGION_TEXT[s.region]||"#374151" }}>
                    {s.region}
                  </span>
                </td>
                <td style={{ padding:"7px 10px", color:"#374151", whiteSpace:"nowrap" }}>{s.pop}</td>
                <td style={{ padding:"7px 10px", color:"#374151", whiteSpace:"nowrap" }}>{s.area}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:11, color:"#9ca3af", textAlign:"center", marginTop:8 }}>
        {filtered.length} of {INDIA_STATES.length} states shown
      </div>
    </Panel>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMPARE widget
// ══════════════════════════════════════════════════════════════════
function CompareWidget({ spec }) {
  const [sel, setSel] = useState(null);
  const items = spec.items || [];

  return (
    <Panel icon="⚖️" title={spec.title || "Comparison"}>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {spec.prompt && <p style={{ fontSize:13, color:"#5a6a88", margin:0 }}>{spec.prompt}</p>}
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {items.map((item,i) => (
            <button key={i} onClick={()=>setSel(sel===i?null:i)} style={{
              flex:1, minWidth:100, padding:"12px 8px", borderRadius:14, fontWeight:700, fontSize:14,
              cursor:"pointer",
              border:`2px solid ${sel===i?"rgba(59,91,219,0.45)":"rgba(59,91,219,0.10)"}`,
              background:sel===i?"rgba(59,91,219,0.08)":"rgba(255,255,255,0.7)",
              color:sel===i?"#2c3fd6":"#6b7280",
              transition:"all 0.18s",
              display:"flex", flexDirection:"column", alignItems:"center", gap:4,
            }}>
              {item.icon && <span style={{ fontSize:22 }}>{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        {sel !== null && items[sel]?.description && (
          <div style={{ padding:"10px 14px", borderRadius:12, fontSize:13, fontWeight:500, background:"rgba(59,91,219,0.06)", border:"1px solid rgba(59,91,219,0.15)", color:"#374151" }}>
            {items[sel].description}
          </div>
        )}
      </div>
    </Panel>
  );
}

// ══════════════════════════════════════════════════════════════════
// PHYSICS widgets
// ══════════════════════════════════════════════════════════════════
function PhysicsWidget({ spec }) {
  const sub = spec.subtype || "energy_bar";
  if (sub === "energy_bar") return <EnergyBarWidget spec={spec} />;
  if (sub === "projectile")  return <ProjectileWidget spec={spec} />;
  if (sub === "pendulum")    return <PendulumWidget spec={spec} />;
  if (sub === "wave")        return <WaveWidget spec={spec} />;
  return null;
}

function EnergyBarWidget({ spec }) {
  const concepts = spec.params?.concepts || ["Kinetic Energy","Potential Energy"];
  const formulas = spec.params?.formulas  || ["½mv²","mgh"];
  const [m, setM] = useState(10);
  const [v, setV] = useState(5);
  const [h, setH] = useState(5);
  const g=9.8, ke=0.5*m*v*v, pe=m*g*h, te=ke+pe;
  const max = Math.max(ke, pe, te, 1);
  const colors = ["#3b5bdb","#22c55e","#f59e0b"];
  const values = [ke, pe, te];
  const labels = [...concepts, "Total Energy"];

  return (
    <Panel icon="⚡" title={spec.title || "Energy Comparison"}>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {[
          {label:"Mass (m)", val:m, set:setM, min:0.5, max:50, step:0.5, unit:"kg"},
          {label:"Velocity (v)", val:v, set:setV, min:0, max:30, step:0.5, unit:"m/s"},
          {label:"Height (h)", val:h, set:setH, min:0, max:30, step:0.5, unit:"m"},
        ].map(({label,val,set,min,max,step,unit}) => (
          <div key={label}>
            <div style={sliderRow}>
              <label style={{ fontSize:13, fontWeight:600, color:"#374151" }}>{label}</label>
              <span style={valBadge}>{val} {unit}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={e=>set(parseFloat(e.target.value))} style={sl}/>
          </div>
        ))}
        {values.map((val,i) => (
          <div key={i}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:12 }}>
              <span style={{ fontWeight:600, color:"#374151" }}>
                {labels[i]} {formulas[i] && <span style={{ color:"#9ca3af", fontWeight:400 }}>({formulas[i]})</span>}
              </span>
              <span style={{ fontWeight:700, color:colors[i] }}>{val.toFixed(1)} J</span>
            </div>
            <div style={{ height:22, background:"rgba(59,91,219,0.08)", borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:99, background:colors[i], width:`${(val/max)*100}%`, transition:"width 0.3s" }}/>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ProjectileWidget({ spec }) {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(45);
  const [speed, setSpeed] = useState(20);
  const g = 9.8;

  useEffect(() => {
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext("2d");
    const W=canvas.width, H=canvas.height;
    const rad=(angle*Math.PI)/180, vx=speed*Math.cos(rad), vy=speed*Math.sin(rad);
    const tMax=(2*vy)/g, xMax=vx*tMax, yMax=(vy*vy)/(2*g);
    const scX=(W-40)/Math.max(xMax,1), scY=(H-40)/Math.max(yMax,1);
    ctx.clearRect(0,0,W,H); ctx.fillStyle="#f8faff"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="rgba(59,91,219,0.25)"; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(20,H-20); ctx.lineTo(W-20,H-20); ctx.stroke();
    ctx.strokeStyle="#3b5bdb"; ctx.lineWidth=2.5;
    ctx.beginPath();
    for(let t=0;t<=tMax;t+=tMax/200){
      const x=20+vx*t*scX, y=H-20-(vy*t-0.5*g*t*t)*scY;
      t===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.stroke();
    const peakX=20+vx*(vy/g)*scX, peakY=H-20-yMax*scY;
    ctx.fillStyle="#ef4444"; ctx.beginPath(); ctx.arc(peakX,peakY,5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#374151"; ctx.font="10px sans-serif";
    ctx.fillText(`H: ${yMax.toFixed(1)}m`, peakX+6, peakY-4);
    ctx.fillText(`R: ${xMax.toFixed(1)}m`, W-60, H-6);
  }, [angle, speed]);

  const vy=speed*Math.sin(angle*Math.PI/180), vx=speed*Math.cos(angle*Math.PI/180);
  return (
    <Panel icon="🎯" title="Projectile Motion">
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <canvas ref={canvasRef} width={420} height={200} style={{ width:"100%", height:"auto", borderRadius:12, border:"1px solid rgba(59,91,219,0.10)" }}/>
        {[
          {label:`Angle: ${angle}°`, val:angle, set:setAngle, min:5, max:85, step:1},
          {label:`Speed: ${speed} m/s`, val:speed, set:setSpeed, min:1, max:50, step:1},
        ].map(({label,val,set,min,max,step}) => (
          <div key={label}>
            <div style={sliderRow}><span style={{ fontSize:13, fontWeight:600, color:"#374151" }}>{label}</span></div>
            <input type="range" min={min} max={max} step={step} value={val} onChange={e=>set(parseFloat(e.target.value))} style={sl}/>
          </div>
        ))}
        <div style={{ display:"flex", gap:8 }}>
          {[
            {label:"Range",   value:`${((speed*speed*Math.sin(2*angle*Math.PI/180))/g).toFixed(1)} m`},
            {label:"Max H",   value:`${(vy*vy/(2*g)).toFixed(1)} m`},
            {label:"Time",    value:`${(2*vy/g).toFixed(1)} s`},
          ].map(({label,value}) => (
            <div key={label} style={{ flex:1, padding:"8px 6px", borderRadius:10, textAlign:"center", background:"rgba(59,91,219,0.05)", border:"1px solid rgba(59,91,219,0.10)" }}>
              <div style={{ fontSize:10, color:"#9bb0d8", fontWeight:600 }}>{label}</div>
              <div style={{ fontSize:14, fontWeight:800, color:"#2c3fd6" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function PendulumWidget({ spec }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const stateRef  = useRef({ theta: Math.PI/4, omega: 0 });
  const [length, setLength] = useState(1.0);
  const [playing, setPlaying] = useState(false);
  const g = 9.8;

  useEffect(() => {
    if (!playing) {
      stateRef.current = { theta: Math.PI/4, omega: 0 };
      drawPendulum(Math.PI/4, length);
      return;
    }
    const dt = 0.016;
    const animate = () => {
      const s = stateRef.current;
      s.omega += (-g/length)*Math.sin(s.theta)*dt;
      s.theta += s.omega*dt;
      drawPendulum(s.theta, length);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [playing, length]);

  const drawPendulum = (theta, L) => {
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext("2d");
    const W=canvas.width, H=canvas.height;
    const px=W/2, py=30, scale=Math.min(120,(H-60)/Math.max(L,0.1));
    const bx=px+Math.sin(theta)*L*scale, by=py+Math.cos(theta)*L*scale;
    ctx.clearRect(0,0,W,H); ctx.fillStyle="#f8faff"; ctx.fillRect(0,0,W,H);
    ctx.fillStyle="#374151"; ctx.beginPath(); ctx.arc(px,py,5,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle="#3b5bdb"; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(bx,by); ctx.stroke();
    ctx.fillStyle="#3b5bdb"; ctx.shadowColor="rgba(59,91,219,0.4)"; ctx.shadowBlur=10;
    ctx.beginPath(); ctx.arc(bx,by,14,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
    const T=2*Math.PI*Math.sqrt(L/g);
    ctx.fillStyle="#374151"; ctx.font="11px sans-serif"; ctx.textAlign="center";
    ctx.fillText(`T = ${T.toFixed(2)} s`, W/2, H-8);
  };

  return (
    <Panel icon="🕰️" title="Pendulum Simulation">
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <canvas ref={canvasRef} width={280} height={220} style={{ width:"100%", height:"auto", borderRadius:12, border:"1px solid rgba(59,91,219,0.10)" }}/>
        <div>
          <div style={sliderRow}>
            <span style={{ fontSize:13, fontWeight:600, color:"#374151" }}>Length (L)</span>
            <span style={valBadge}>{length} m</span>
          </div>
          <input type="range" min={0.2} max={3} step={0.1} value={length}
            onChange={e=>{setLength(parseFloat(e.target.value));setPlaying(false);}} style={sl}/>
        </div>
        <button onClick={()=>setPlaying(p=>!p)} style={{
          padding:"10px 0", borderRadius:12, fontSize:13, fontWeight:700, border:"none", cursor:"pointer",
          background:playing?"rgba(239,68,68,0.12)":"linear-gradient(135deg,#5b7fff,#3b5bdb)",
          color:playing?"#ef4444":"white",
        }}>
          {playing?"⏹ Stop":"▶ Start"}
        </button>
      </div>
    </Panel>
  );
}

function WaveWidget({ spec }) {
  const canvasRef = useRef(null);
  const [amplitude, setAmplitude] = useState(1);
  const [frequency, setFrequency] = useState(1);
  const [wavelength, setWavelength] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext("2d");
    const W=canvas.width, H=canvas.height, mid=H/2;
    ctx.clearRect(0,0,W,H); ctx.fillStyle="#f8faff"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="rgba(59,91,219,0.08)"; ctx.lineWidth=1;
    for(let x=0;x<=W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<=H;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.strokeStyle="rgba(59,91,219,0.3)"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,mid);ctx.lineTo(W,mid);ctx.stroke();
    ctx.strokeStyle="#3b5bdb"; ctx.lineWidth=2.5; ctx.shadowColor="rgba(59,91,219,0.3)"; ctx.shadowBlur=4;
    ctx.beginPath();
    for(let px=0;px<=W;px++){
      const x=(px/W)*4*Math.PI;
      const y=mid-amplitude*(H/2-10)*0.85*Math.sin(frequency*x);
      px===0?ctx.moveTo(px,y):ctx.lineTo(px,y);
    }
    ctx.stroke(); ctx.shadowBlur=0;
  }, [amplitude, frequency, wavelength]);

  return (
    <Panel icon="〰️" title="Wave Simulation">
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <canvas ref={canvasRef} width={420} height={160} style={{ width:"100%", height:"auto", borderRadius:12, border:"1px solid rgba(59,91,219,0.10)" }}/>
        {[
          {label:"Amplitude (A)", val:amplitude, set:setAmplitude, min:0.1, max:1, step:0.05},
          {label:"Frequency (f)", val:frequency, set:setFrequency, min:0.5, max:4, step:0.5},
          {label:"Wavelength (λ)", val:wavelength, set:setWavelength, min:0.5, max:5, step:0.5},
        ].map(({label,val,set,min,max,step}) => (
          <div key={label}>
            <div style={sliderRow}><span style={{ fontSize:13, fontWeight:600, color:"#374151" }}>{label}</span><span style={valBadge}>{val}</span></div>
            <input type="range" min={min} max={max} step={step} value={val} onChange={e=>set(parseFloat(e.target.value))} style={sl}/>
          </div>
        ))}
        <div style={{ display:"flex", gap:8 }}>
          {[
            {label:"Speed", value:`${(frequency*wavelength).toFixed(1)} m/s`},
            {label:"Period", value:`${(1/frequency).toFixed(2)} s`},
          ].map(({label,value}) => (
            <div key={label} style={{ flex:1, padding:"8px", borderRadius:10, textAlign:"center", background:"rgba(59,91,219,0.05)", border:"1px solid rgba(59,91,219,0.10)" }}>
              <div style={{ fontSize:10, color:"#9bb0d8", fontWeight:600 }}>{label}</div>
              <div style={{ fontSize:14, fontWeight:800, color:"#2c3fd6" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

// ══════════════════════════════════════════════════════════════════
// QUIZ widget
// ══════════════════════════════════════════════════════════════════
function QuizWidget({ quizData }) {
  const questions = quizData?.questions || [];
  const [cur, setCur]       = useState(0);
  const [answers, setAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);
  if (questions.length === 0) return null;

  const q        = questions[cur];
  const total    = questions.length;
  const answered = answers[cur];

  const optStyle = (key) => {
    if (!answered) return { bg:"rgba(59,91,219,0.05)", border:"rgba(59,91,219,0.13)", color:"#374151" };
    if (key===answered && key===q.answer) return { bg:"rgba(34,197,94,0.10)", border:"#22c55e", color:"#15803d" };
    if (key===answered && key!==q.answer) return { bg:"rgba(239,68,68,0.08)", border:"#ef4444", color:"#b91c1c" };
    if (key===q.answer) return { bg:"rgba(34,197,94,0.06)", border:"rgba(34,197,94,0.30)", color:"#374151" };
    return { bg:"rgba(59,91,219,0.03)", border:"rgba(59,91,219,0.08)", color:"#9ca3af" };
  };

  const score = Object.entries(answers).filter(([i,ans]) => questions[parseInt(i)]?.answer===ans).length;

  if (showScore) {
    const pct=Math.round((score/total)*100);
    const color=pct>=80?"#22c55e":pct>=50?"#f59e0b":"#ef4444";
    return (
      <Panel icon="🧠" title="Quiz Results">
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
          <div style={{ fontSize:48, fontWeight:800, color }}>{pct}%</div>
          <div style={{ fontSize:16, fontWeight:600, color:"#374151" }}>{score} / {total} correct</div>
          <div style={{ fontSize:13, color:"#5a6a88", textAlign:"center", padding:"10px 16px", background:"rgba(59,91,219,0.05)", borderRadius:12 }}>
            {pct>=80?"🎉 Excellent! You're ready for the exam.":pct>=50?"👍 Good effort! Review the missed topics.":"📚 Keep practising!"}
          </div>
          <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:6 }}>
            {questions.map((qq,i) => {
              const ua=answers[i]; const ic=ua===qq.answer;
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", borderRadius:10, fontSize:12, background:ic?"rgba(34,197,94,0.06)":"rgba(239,68,68,0.05)", border:`1px solid ${ic?"rgba(34,197,94,0.20)":"rgba(239,68,68,0.15)"}` }}>
                  <span>{ic?"✅":"❌"}</span>
                  <span style={{ flex:1, color:"#374151", fontWeight:500 }}>Q{i+1}: {qq.q.slice(0,50)}{qq.q.length>50?"...":""}</span>
                  <span style={{ color:ic?"#15803d":"#b91c1c", fontWeight:600 }}>{ua||"—"}{!ic&&qq.answer?` (${qq.answer})`:""}</span>
                </div>
              );
            })}
          </div>
          <button onClick={()=>{setAnswers({});setCur(0);setShowScore(false);}} style={{ padding:"10px 24px", borderRadius:12, fontSize:13, fontWeight:700, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#5b7fff,#3b5bdb)", color:"white" }}>Try Again</button>
        </div>
      </Panel>
    );
  }

  return (
    <Panel icon="🧠" title={`Quiz — Q${cur+1} of ${total}`}>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ height:5, background:"rgba(59,91,219,0.10)", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:99, background:"linear-gradient(90deg,#5b7fff,#3b5bdb)", width:`${((cur+1)/total)*100}%`, transition:"width 0.3s" }}/>
        </div>
        <p style={{ fontSize:13, fontWeight:600, color:"#1a2240", margin:0 }}>{q.q}</p>
        {Object.entries(q.options||{}).map(([key,label]) => {
          const s=optStyle(key);
          return (
            <button key={key} disabled={!!answered} onClick={()=>setAnswers(p=>({...p,[cur]:key}))}
              style={{ textAlign:"left", padding:"10px 14px", borderRadius:12, fontSize:13, fontWeight:answered&&(key===answered||key===q.answer)?600:500, border:`1.5px solid ${s.border}`, background:s.bg, color:s.color, cursor:answered?"default":"pointer", transition:"all 0.18s", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, background:"rgba(59,91,219,0.12)", color:"#3b5bdb" }}>{key.toUpperCase()}</span>
              {label}
              {answered&&key===q.answer&&<span style={{ marginLeft:"auto" }}>✅</span>}
              {answered&&key===answered&&key!==q.answer&&<span style={{ marginLeft:"auto" }}>❌</span>}
            </button>
          );
        })}
        {answered && (
          <div style={{ padding:"8px 12px", borderRadius:10, fontSize:12, fontWeight:500, background:answered===q.answer?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.07)", color:answered===q.answer?"#15803d":"#b91c1c" }}>
            {answered===q.answer?"🎉 Correct!":q.answer?`Correct: ${q.answer.toUpperCase()} — ${q.options?.[q.answer]||""}`:""} 
          </div>
        )}
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setCur(s=>Math.max(0,s-1))} disabled={cur===0}
            style={{ flex:1, padding:"9px 0", borderRadius:12, fontSize:13, fontWeight:600, border:"none", cursor:cur===0?"not-allowed":"pointer", opacity:cur===0?0.4:1, background:"rgba(59,91,219,0.08)", color:"#3b5bdb" }}>
            ← Prev
          </button>
          {cur<total-1 ? (
            <button onClick={()=>setCur(s=>s+1)} disabled={!answered}
              style={{ flex:1, padding:"9px 0", borderRadius:12, fontSize:13, fontWeight:600, border:"none", cursor:!answered?"not-allowed":"pointer", opacity:!answered?0.5:1, background:"linear-gradient(135deg,#5b7fff,#3b5bdb)", color:"white" }}>
              Next →
            </button>
          ) : (
            <button onClick={()=>setShowScore(true)} disabled={!answered}
              style={{ flex:1, padding:"9px 0", borderRadius:12, fontSize:13, fontWeight:700, border:"none", cursor:!answered?"not-allowed":"pointer", opacity:!answered?0.5:1, background:answered?"linear-gradient(135deg,#22c55e,#16a34a)":"rgba(180,195,230,0.4)", color:"white" }}>
              Results 🎯
            </button>
          )}
        </div>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {questions.map((_,i) => (
            <button key={i} onClick={()=>setCur(i)} style={{
              width:26, height:26, borderRadius:"50%", fontSize:11, fontWeight:700, border:"none", cursor:"pointer",
              background: i===cur?"linear-gradient(135deg,#5b7fff,#3b5bdb)":answers[i]!==undefined?(answers[i]===questions[i].answer?"rgba(34,197,94,0.25)":"rgba(239,68,68,0.20)"):"rgba(59,91,219,0.08)",
              color: i===cur?"white":answers[i]!==undefined?(answers[i]===questions[i].answer?"#15803d":"#b91c1c"):"#9ca3af",
            }}>{i+1}</button>
          ))}
        </div>
      </div>
    </Panel>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN EXPORT — routes widget type to component
// ══════════════════════════════════════════════════════════════════
export default function DynamicWidget({ widgetSpecs = [], quizData, isStreaming }) {
  if (isStreaming) return null;

  const hasWidgets = widgetSpecs.length > 0;
  const hasQuiz    = !!quizData;
  if (!hasWidgets && !hasQuiz) return null;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10, width:"100%" }}>
      {widgetSpecs.map((spec, i) => {
        const t = spec.type;

        // Route to correct component
        if (t === "shape")                      return <ShapeWidget      key={i} spec={spec} />;
        if (t === "calculator")                 return <CalculatorWidget key={i} spec={spec} />;
        if (t === "graph")                      return <GraphWidget      key={i} spec={spec} />;
        if (t === "converter")                  return <ConverterWidget  key={i} spec={spec} />;
        if (t === "steps")                      return <StepsWidget      key={i} spec={spec} />;
        if (t === "physics")                    return <PhysicsWidget    key={i} spec={spec} />;
        if (t === "compare")                    return <CompareWidget    key={i} spec={spec} />;
        if (t === "table")                      return <TableWidget      key={i} spec={spec} />;
        // India states — always use the hardcoded component regardless of spec data
        if (t === "map_table" && spec.subtype === "india_states") return <IndiaStatesWidget key={i} />;
        if (t === "map_table")                  return <IndiaStatesWidget key={i} />;

        return null; // unknown type — render nothing silently
      })}

      {hasQuiz && <QuizWidget quizData={quizData} />}
    </div>
  );
}