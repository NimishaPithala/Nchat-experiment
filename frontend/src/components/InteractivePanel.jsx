{/*
import { useState } from "react";

// ── Detectors ────────────────────────────────────────────────────
function detectType(content) {
  const lower = content.toLowerCase();

  const hasMathFormula =
    /\$[^$]+\$/.test(content) ||
    /formula|equation|calculate|radius|area|volume|perimeter|circumference|velocity|distance|speed|force|energy|pressure|temperature/i.test(content);
  const hasNumbers = /\d/.test(content);

  if (hasMathFormula && hasNumbers) return "math";

  if (/convert|conversion|celsius|fahrenheit|kilometer|miles|kg|pounds|liters|gallons/i.test(lower)) return "convert";

  if (/\bvs\b|versus|compare|comparison|pros.*cons|advantages.*disadvantages/i.test(lower)) return "compare";

  if (/step\s*\d|^\d+\.\s/m.test(content) && content.split(/step\s*\d|^\d+\.\s/mi).length >= 3) return "steps";

  if (/\ba\)|b\)|c\)|d\)|\ba\.|\bb\.|\bc\.|\bd\./i.test(content) && /\?/.test(content)) return "quiz";

  return null;
}

// ── Extract math formula variables ──────────────────────────────
function extractMathVars(content) {
  const vars = [];

  if (/area.*circle|circle.*area/i.test(content)) {
    vars.push({ name: "radius", label: "Radius (r)", min: 0.1, max: 50, step: 0.1, default: 5, unit: "units" });
    return { type: "circle_area", vars, formula: (r) => Math.PI * r * r, label: "Area = πr²", resultUnit: "units²" };
  }
  if (/circumference/i.test(content)) {
    vars.push({ name: "radius", label: "Radius (r)", min: 0.1, max: 50, step: 0.1, default: 5, unit: "units" });
    return { type: "circumference", vars, formula: (r) => 2 * Math.PI * r, label: "Circumference = 2πr", resultUnit: "units" };
  }
  if (/area.*rectangle|rectangle.*area/i.test(content)) {
    vars.push({ name: "length", label: "Length", min: 0.1, max: 100, step: 0.5, default: 10, unit: "" });
    vars.push({ name: "width",  label: "Width",  min: 0.1, max: 100, step: 0.5, default: 5,  unit: "" });
    return { type: "rect_area", vars, formula: (l, w) => l * w, label: "Area = length × width", resultUnit: "units²" };
  }
  if (/area.*triangle|triangle.*area/i.test(content)) {
    vars.push({ name: "base",   label: "Base",   min: 0.1, max: 100, step: 0.5, default: 8,  unit: "" });
    vars.push({ name: "height", label: "Height", min: 0.1, max: 100, step: 0.5, default: 5,  unit: "" });
    return { type: "tri_area", vars, formula: (b, h) => 0.5 * b * h, label: "Area = ½ × base × height", resultUnit: "units²" };
  }
  if (/volume.*sphere|sphere.*volume/i.test(content)) {
    vars.push({ name: "radius", label: "Radius (r)", min: 0.1, max: 30, step: 0.1, default: 5, unit: "units" });
    return { type: "sphere_vol", vars, formula: (r) => (4/3) * Math.PI * r * r * r, label: "Volume = (4/3)πr³", resultUnit: "units³" };
  }
  if (/volume.*cylinder|cylinder.*volume/i.test(content)) {
    vars.push({ name: "radius", label: "Radius (r)", min: 0.1, max: 30, step: 0.1, default: 5, unit: "" });
    vars.push({ name: "height", label: "Height (h)", min: 0.1, max: 50, step: 0.5, default: 10, unit: "" });
    return { type: "cyl_vol", vars, formula: (r, h) => Math.PI * r * r * h, label: "Volume = πr²h", resultUnit: "units³" };
  }
  if (/pythagor/i.test(content)) {
    vars.push({ name: "a", label: "Side a", min: 0.1, max: 100, step: 0.5, default: 3, unit: "" });
    vars.push({ name: "b", label: "Side b", min: 0.1, max: 100, step: 0.5, default: 4, unit: "" });
    return { type: "pythagoras", vars, formula: (a, b) => Math.sqrt(a*a + b*b), label: "c = √(a² + b²)", resultUnit: "" };
  }
  if (/kinetic.*energy|energy.*kinetic/i.test(content)) {
    vars.push({ name: "mass",     label: "Mass (kg)",      min: 0.1, max: 1000, step: 1,   default: 10, unit: "kg" });
    vars.push({ name: "velocity", label: "Velocity (m/s)", min: 0,   max: 100,  step: 0.5, default: 5,  unit: "m/s" });
    return { type: "kinetic", vars, formula: (m, v) => 0.5 * m * v * v, label: "KE = ½mv²", resultUnit: "Joules" };
  }
  if (/simple interest|interest.*principal/i.test(content)) {
    vars.push({ name: "principal", label: "Principal ($)", min: 100, max: 100000, step: 100, default: 1000, unit: "$" });
    vars.push({ name: "rate",      label: "Rate (%/yr)",   min: 0.1, max: 30,     step: 0.1, default: 5,    unit: "%" });
    vars.push({ name: "time",      label: "Time (years)",  min: 1,   max: 30,     step: 1,   default: 3,    unit: "yr" });
    return { type: "simple_interest", vars, formula: (p, r, t) => p * r/100 * t, label: "SI = P × R × T / 100", resultUnit: "$" };
  }
  if (/compound interest/i.test(content)) {
    vars.push({ name: "principal", label: "Principal ($)", min: 100, max: 100000, step: 100, default: 1000, unit: "$" });
    vars.push({ name: "rate",      label: "Rate (%/yr)",   min: 0.1, max: 30,     step: 0.1, default: 5,    unit: "%" });
    vars.push({ name: "time",      label: "Time (years)",  min: 1,   max: 30,     step: 1,   default: 3,    unit: "yr" });
    return { type: "compound_interest", vars, formula: (p, r, t) => p * Math.pow(1 + r/100, t) - p, label: "CI = P(1 + r/n)ⁿ - P", resultUnit: "$" };
  }
  if (/bmi|body mass index/i.test(content)) {
    vars.push({ name: "weight", label: "Weight (kg)", min: 30,  max: 200, step: 0.5, default: 70, unit: "kg" });
    vars.push({ name: "height", label: "Height (cm)", min: 100, max: 220, step: 1,   default: 170, unit: "cm" });
    return { type: "bmi", vars, formula: (w, h) => w / Math.pow(h/100, 2), label: "BMI = weight / height²", resultUnit: "" };
  }

  return null;
}

// ── Main export ──────────────────────────────────────────────────
export default function InteractivePanel({ content }) {
  const type = detectType(content);
  if (!type) return null;

  const panelStyle = {
    borderRadius: 16,
    border: "1px solid rgba(59,91,219,0.14)",
    background: "rgba(255,255,255,0.97)",
    boxShadow: "0 4px 24px rgba(59,91,219,0.09)",
    overflow: "hidden",
    width: "100%",
    maxWidth: 520,
  };

  if (type === "math")    return <MathWidget    content={content} style={panelStyle} />;
  if (type === "convert") return <ConverterWidget style={panelStyle} />;
  if (type === "compare") return <CompareWidget  content={content} style={panelStyle} />;
  if (type === "steps")   return <StepsWidget    content={content} style={panelStyle} />;
  if (type === "quiz")    return <QuizWidget     content={content} style={panelStyle} />;

  return null;
}

// ────────────────────────────────────────────────────────────────
// MATH SLIDER WIDGET
// ────────────────────────────────────────────────────────────────
function MathWidget({ content, style }) {
  const mathData = extractMathVars(content);
  if (!mathData) return null;

  const initVals = {};
  mathData.vars.forEach(v => { initVals[v.name] = v.default; });
  const [vals, setVals] = useState(initVals);

  const result = mathData.formula(...mathData.vars.map(v => vals[v.name]));
  const fmtResult = isNaN(result) ? "—" : result < 0.001 ? result.toExponential(4) : +result.toFixed(4);

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { label: "Underweight", color: "#3b82f6" };
    if (bmi < 25)   return { label: "Normal",      color: "#22c55e" };
    if (bmi < 30)   return { label: "Overweight",  color: "#f59e0b" };
    return               { label: "Obese",         color: "#ef4444" };
  };

  return (
    <div style={style}>
      <PanelHeader icon="🧮" title="Interactive Calculator" />
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>

        {mathData.vars.map(v => (
          <div key={v.name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{v.label}</label>
              <span style={{
                fontSize: 13, fontWeight: 700, color: "#3b5bdb",
                background: "rgba(59,91,219,0.08)", borderRadius: 8,
                padding: "2px 10px",
              }}>{vals[v.name]}{v.unit ? " " + v.unit : ""}</span>
            </div>
            <input
              type="range"
              min={v.min} max={v.max} step={v.step}
              value={vals[v.name]}
              onChange={e => setVals(prev => ({ ...prev, [v.name]: parseFloat(e.target.value) }))}
              style={{ width: "100%", accentColor: "#3b5bdb", cursor: "pointer", height: 20 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9ca3af", marginTop: 1 }}>
              <span>{v.min}</span>
              <span>{v.max}</span>
            </div>
          </div>
        ))}

        <div style={{
          marginTop: 4, padding: "14px 16px", borderRadius: 14,
          background: "linear-gradient(135deg, rgba(91,127,255,0.08), rgba(59,91,219,0.12))",
          border: "1px solid rgba(59,91,219,0.15)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 11, color: "#5a6a88", fontWeight: 600, marginBottom: 4, letterSpacing: "0.04em" }}>
            {mathData.label}
          </div>
          <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "#2c3fd6", letterSpacing: "-0.02em" }}>
            {fmtResult}
            {mathData.resultUnit && (
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#5a7fe8", marginLeft: 4 }}>
                {mathData.resultUnit}
              </span>
            )}
          </div>
          {mathData.type === "bmi" && !isNaN(result) && (
            <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: getBMICategory(result).color }}>
              {getBMICategory(result).label}
            </div>
          )}
          {(mathData.type === "simple_interest" || mathData.type === "compound_interest") && (
            <div style={{ fontSize: 12, color: "#5a6a88", marginTop: 4 }}>
              Total = ${(vals.principal + result).toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// UNIT CONVERTER WIDGET
// ────────────────────────────────────────────────────────────────
const CONVERSIONS = [
  {
    label: "Temperature", icon: "🌡️",
    units: ["Celsius", "Fahrenheit", "Kelvin"],
    convert: {
      "Celsius→Fahrenheit": v => v * 9/5 + 32,
      "Celsius→Kelvin":     v => v + 273.15,
      "Fahrenheit→Celsius": v => (v - 32) * 5/9,
      "Fahrenheit→Kelvin":  v => (v - 32) * 5/9 + 273.15,
      "Kelvin→Celsius":     v => v - 273.15,
      "Kelvin→Fahrenheit":  v => (v - 273.15) * 9/5 + 32,
    },
  },
  {
    label: "Length", icon: "📏",
    units: ["Meters", "Feet", "Inches", "Kilometers", "Miles"],
    convert: {
      "Meters→Feet": v => v * 3.28084,   "Meters→Inches": v => v * 39.3701,
      "Meters→Kilometers": v => v / 1000, "Meters→Miles": v => v / 1609.34,
      "Feet→Meters": v => v / 3.28084,   "Feet→Inches": v => v * 12,
      "Feet→Kilometers": v => v / 3280.84, "Feet→Miles": v => v / 5280,
      "Inches→Meters": v => v / 39.3701, "Inches→Feet": v => v / 12,
      "Inches→Kilometers": v => v / 39370.1, "Inches→Miles": v => v / 63360,
      "Kilometers→Meters": v => v * 1000, "Kilometers→Feet": v => v * 3280.84,
      "Kilometers→Inches": v => v * 39370.1, "Kilometers→Miles": v => v / 1.60934,
      "Miles→Meters": v => v * 1609.34,  "Miles→Feet": v => v * 5280,
      "Miles→Inches": v => v * 63360,    "Miles→Kilometers": v => v * 1.60934,
    },
  },
  {
    label: "Weight", icon: "⚖️",
    units: ["Kilograms", "Pounds", "Grams", "Ounces"],
    convert: {
      "Kilograms→Pounds": v => v * 2.20462, "Kilograms→Grams": v => v * 1000,
      "Kilograms→Ounces": v => v * 35.274,  "Pounds→Kilograms": v => v / 2.20462,
      "Pounds→Grams": v => v * 453.592,     "Pounds→Ounces": v => v * 16,
      "Grams→Kilograms": v => v / 1000,     "Grams→Pounds": v => v / 453.592,
      "Grams→Ounces": v => v / 28.3495,     "Ounces→Kilograms": v => v / 35.274,
      "Ounces→Pounds": v => v / 16,         "Ounces→Grams": v => v * 28.3495,
    },
  },
];

function ConverterWidget({ style }) {
  const [catIdx, setCatIdx] = useState(0);
  const cat = CONVERSIONS[catIdx];
  const [from,  setFrom]  = useState(cat.units[0]);
  const [to,    setTo]    = useState(cat.units[1]);
  const [value, setValue] = useState("1");

  const switchCat = (idx) => {
    setCatIdx(idx);
    setFrom(CONVERSIONS[idx].units[0]);
    setTo(CONVERSIONS[idx].units[1]);
    setValue("1");
  };

  const key    = `${from}→${to}`;
  const fn     = cat.convert[key];
  const result = fn && value !== "" ? fn(parseFloat(value)) : null;
  const fmtResult = result === null || isNaN(result) ? "—" : +result.toFixed(6);

  const tabStyle = (active) => ({
    padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    cursor: "pointer", border: "none", transition: "all 0.15s",
    background: active ? "linear-gradient(135deg,#5b7fff,#3b5bdb)" : "rgba(59,91,219,0.07)",
    color: active ? "white" : "#5a6a88",
  });

  const selectStyle = {
    width: "100%", padding: "9px 10px", borderRadius: 10, fontSize: 13, fontWeight: 500,
    border: "1.5px solid rgba(59,91,219,0.15)", background: "rgba(59,91,219,0.04)", color: "#1a2240",
    outline: "none", cursor: "pointer",
  };

  return (
    <div style={style}>
      <PanelHeader icon="🔄" title="Unit Converter" />
      <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 14 }}>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CONVERSIONS.map((c, i) => (
            <button key={i} onClick={() => switchCat(i)} style={tabStyle(catIdx === i)}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", display: "block", marginBottom: 4 }}>FROM</label>
            <select value={from} onChange={e => setFrom(e.target.value)} style={selectStyle}>
              {cat.units.filter(u => u !== to).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <button
            onClick={() => { const tmp = from; setFrom(to); setTo(tmp); }}
            style={{ marginTop: 18, padding: "8px", borderRadius: 10, border: "1.5px solid rgba(59,91,219,0.15)", background: "rgba(59,91,219,0.07)", cursor: "pointer", color: "#3b5bdb", fontSize: 16 }}
          >⇌</button>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", display: "block", marginBottom: 4 }}>TO</label>
            <select value={to} onChange={e => setTo(e.target.value)} style={selectStyle}>
              {cat.units.filter(u => u !== from).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="number" value={value} onChange={e => setValue(e.target.value)}
            placeholder="Enter value..."
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 12, fontSize: 15, fontWeight: 600,
              border: "1.5px solid rgba(59,91,219,0.18)", background: "rgba(59,91,219,0.04)", color: "#1a2240", outline: "none",
            }}
          />
          <div style={{
            flex: 1, padding: "10px 14px", borderRadius: 12,
            background: "linear-gradient(135deg, rgba(91,127,255,0.08), rgba(59,91,219,0.12))",
            border: "1px solid rgba(59,91,219,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#2c3fd6" }}>{fmtResult}</span>
          </div>
        </div>
        <div style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: -6 }}>
          {value || "—"} {from} = {fmtResult} {to}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// STEP-BY-STEP WIDGET
// ────────────────────────────────────────────────────────────────
function StepsWidget({ content, style }) {
  const [active, setActive] = useState(0);

  const steps = [];
  const lines = content.split("\n");
  let currentStep = null;
  let currentBody = [];

  for (const line of lines) {
    const stepMatch = line.match(/^(?:step\s*)?(\d+)[.:)]\s*(.+)/i);
    const headMatch = line.match(/^#{1,3}\s+(?:step\s*\d+[.:)]\s*)?(.+)/i);

    if (stepMatch || headMatch) {
      if (currentStep !== null) steps.push({ title: currentStep, body: currentBody.join("\n").trim() });
      currentStep = (stepMatch ? stepMatch[2] : headMatch[1]).replace(/\*+/g, "").trim();
      currentBody = [];
    } else if (currentStep !== null && line.trim()) {
      currentBody.push(line.replace(/\*+/g, "").trim());
    }
  }
  if (currentStep !== null) steps.push({ title: currentStep, body: currentBody.join("\n").trim() });

  if (steps.length < 2) return null;

  const step = steps[active];

  return (
    <div style={style}>
      <PanelHeader icon="📋" title={`Step-by-Step  (${active + 1} / ${steps.length})`} />
      <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 14 }}>

        <div style={{ height: 5, borderRadius: 99, background: "rgba(59,91,219,0.10)", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: "linear-gradient(90deg,#5b7fff,#3b5bdb)",
            width: `${((active + 1) / steps.length) * 100}%`,
            transition: "width 0.3s ease",
          }}/>
        </div>

        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {steps.map((s, i) => (
            <button
              key={i} onClick={() => setActive(i)} title={s.title}
              style={{
                width: 28, height: 28, borderRadius: "50%", fontSize: 11, fontWeight: 700,
                border: "none", cursor: "pointer", transition: "all 0.18s",
                background: i === active ? "linear-gradient(135deg,#5b7fff,#3b5bdb)" : i < active ? "rgba(59,91,219,0.25)" : "rgba(59,91,219,0.07)",
                color: i === active ? "white" : i < active ? "#3b5bdb" : "#9ca3af",
              }}
            >{i + 1}</button>
          ))}
        </div>

        <div style={{
          padding: "14px 16px", borderRadius: 14,
          background: "rgba(59,91,219,0.04)", border: "1px solid rgba(59,91,219,0.12)", minHeight: 80,
        }}>
          <div style={{ fontWeight: 700, color: "#2c3fd6", fontSize: 14, marginBottom: 8 }}>
            Step {active + 1}: {step.title}
          </div>
          {step.body && (
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.65 }}>{step.body}</div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <NavBtn onClick={() => setActive(a => Math.max(0, a - 1))} disabled={active === 0}>← Previous</NavBtn>
          {active < steps.length - 1
            ? <NavBtn primary onClick={() => setActive(a => a + 1)}>Next →</NavBtn>
            : <NavBtn primary onClick={() => setActive(0)}>↺ Restart</NavBtn>
          }
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// COMPARE WIDGET
// ────────────────────────────────────────────────────────────────
function CompareWidget({ content, style }) {
  const [selected, setSelected] = useState(null);

  const vsMatch = content.match(/(\b[\w\s]+)\s+vs\.?\s+([\w\s]+)/i);
  if (!vsMatch) return null;

  const optA = vsMatch[1].trim().split(/\s+/).slice(-3).join(" ");
  const optB = vsMatch[2].trim().split(/\s+/).slice(0, 3).join(" ");

  const colors = {
    A: { bg: "rgba(59,91,219,0.08)", border: "rgba(59,91,219,0.30)", text: "#2c3fd6" },
    B: { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.30)", text: "#065f46" },
  };

  const btnStyle = (key) => ({
    flex: 1, padding: "12px 8px", borderRadius: 14, fontWeight: 700, fontSize: 14,
    cursor: "pointer", border: `2px solid ${selected === key ? colors[key].border : "rgba(59,91,219,0.10)"}`,
    background: selected === key ? colors[key].bg : "rgba(255,255,255,0.7)",
    color: selected === key ? colors[key].text : "#6b7280",
    transition: "all 0.18s",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
  });

  return (
    <div style={style}>
      <PanelHeader icon="⚖️" title="Quick Comparison" />
      <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ fontSize: 13, color: "#5a6a88", margin: 0 }}>Which would you prefer?</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setSelected(selected === "A" ? null : "A")} style={btnStyle("A")}>
            <span style={{ fontSize: 22 }}>🅰</span>
            {optA}
          </button>
          <button onClick={() => setSelected(selected === "B" ? null : "B")} style={btnStyle("B")}>
            <span style={{ fontSize: 22 }}>🅱</span>
            {optB}
          </button>
        </div>
        {selected && (
          <div style={{
            padding: "10px 14px", borderRadius: 12,
            background: selected === "A" ? "rgba(59,91,219,0.07)" : "rgba(16,185,129,0.07)",
            border: `1px solid ${selected === "A" ? "rgba(59,91,219,0.20)" : "rgba(16,185,129,0.20)"}`,
            fontSize: 13, color: "#374151", fontWeight: 500,
            animation: "fadeIn 0.25s ease both",
          }}>
            ✅ You chose <strong style={{ color: selected === "A" ? "#2c3fd6" : "#065f46" }}>
              {selected === "A" ? optA : optB}
            </strong> — see the full comparison above.
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// QUIZ WIDGET
// ────────────────────────────────────────────────────────────────
function QuizWidget({ content, style }) {
  const [answered, setAnswered] = useState(null);

  const questionMatch = content.match(/([^\n.?!]+\?)/);
  if (!questionMatch) return null;
  const question = questionMatch[1].trim();

  const optionMatches = [...content.matchAll(/(?:^|\n)\s*([a-d])[.)]\s*(.+)/gi)];
  if (optionMatches.length < 2) return null;

  const options = optionMatches.slice(0, 4).map(m => ({ key: m[1].toUpperCase(), label: m[2].trim() }));
  const answerMatch = content.match(/(?:answer|correct)[:\s]+([a-d])\b/i);
  const correctKey  = answerMatch ? answerMatch[1].toUpperCase() : null;

  const getColor = (key) => {
    if (!answered) return { bg: "rgba(59,91,219,0.05)", border: "rgba(59,91,219,0.13)", text: "#374151" };
    if (key === answered && key === correctKey) return { bg: "rgba(34,197,94,0.10)", border: "#22c55e", text: "#15803d" };
    if (key === answered && key !== correctKey) return { bg: "rgba(239,68,68,0.08)", border: "#ef4444",  text: "#b91c1c" };
    if (key === correctKey) return { bg: "rgba(34,197,94,0.06)", border: "rgba(34,197,94,0.30)", text: "#374151" };
    return { bg: "rgba(59,91,219,0.03)", border: "rgba(59,91,219,0.08)", text: "#9ca3af" };
  };

  return (
    <div style={style}>
      <PanelHeader icon="🧠" title="Quick Quiz" />
      <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1a2240", margin: 0 }}>{question}</p>
        {options.map(({ key, label }) => {
          const c = getColor(key);
          return (
            <button
              key={key}
              disabled={!!answered}
              onClick={() => setAnswered(key)}
              style={{
                textAlign: "left", padding: "10px 14px", borderRadius: 12, fontSize: 13,
                fontWeight: answered ? (key === answered || key === correctKey ? 600 : 400) : 500,
                border: `1.5px solid ${c.border}`, background: c.bg, color: c.text,
                cursor: answered ? "default" : "pointer", transition: "all 0.18s",
                display: "flex", alignItems: "center", gap: 10,
              }}
            >
              <span style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
                background: answered ? (key === answered || key === correctKey ? c.border : "rgba(59,91,219,0.08)") : "rgba(59,91,219,0.12)",
                color: answered ? (key === answered || key === correctKey ? "white" : "#9ca3af") : "#3b5bdb",
              }}>{key}</span>
              {label}
              {answered && key === correctKey && <span style={{ marginLeft: "auto" }}>✅</span>}
              {answered && key === answered && key !== correctKey && <span style={{ marginLeft: "auto" }}>❌</span>}
            </button>
          );
        })}
        {answered && (
          <div style={{
            padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 500,
            background: answered === correctKey ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.07)",
            color: answered === correctKey ? "#15803d" : "#b91c1c",
            animation: "fadeIn 0.25s ease",
          }}>
            {answered === correctKey
              ? "🎉 Correct! Great job."
              : correctKey
                ? `The correct answer is ${correctKey}. Check the explanation above.`
                : "Check the explanation in the response above."}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Shared helpers ───────────────────────────────────────────────
function PanelHeader({ icon, title }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "11px 18px",
      background: "linear-gradient(135deg, rgba(91,127,255,0.06), rgba(59,91,219,0.10))",
      borderBottom: "1px solid rgba(59,91,219,0.10)",
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#2c3fd6", letterSpacing: "0.01em" }}>{title}</span>
      <div style={{
        marginLeft: "auto", fontSize: 10, fontWeight: 600, color: "#9bb0d8",
        background: "rgba(59,91,219,0.07)", borderRadius: 99, padding: "2px 8px",
      }}>interactive</div>
    </div>
  );
}

function NavBtn({ children, onClick, disabled, primary }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 13, fontWeight: 600,
      border: "none", cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.15s", opacity: disabled ? 0.4 : 1,
      background: primary ? "linear-gradient(135deg,#5b7fff,#3b5bdb)" : "rgba(59,91,219,0.08)",
      color: primary ? "white" : "#3b5bdb",
      boxShadow: primary && !disabled ? "0 3px 12px rgba(59,91,219,0.22)" : "none",
    }}>{children}</button>
  );
}
*/}

{/* 
import { useState } from "react";

// ── Strict detector — only returns a type when VERY confident ────
function detectType(content) {
  const lower = content.toLowerCase();

  // Block any content with iframes or external links — never show widget
  if (/iframe|<embed|nchat\.ai|calculators\//i.test(content)) return null;

  // MATH — must have a known formula keyword AND actual numbers
  const mathTopics = [
    /volume\s+of\s+(a\s+)?cylinder/i,
    /cylinder.*volume/i,
    /volume\s+of\s+(a\s+)?sphere/i,
    /sphere.*volume/i,
    /area\s+of\s+(a\s+)?circle/i,
    /circle.*area/i,
    /area\s+of\s+(a\s+)?rectangle/i,
    /rectangle.*area/i,
    /area\s+of\s+(a\s+)?triangle/i,
    /triangle.*area/i,
    /pythagor/i,
    /kinetic\s+energy/i,
    /simple\s+interest/i,
    /compound\s+interest/i,
    /body\s+mass\s+index|bmi/i,
    /circumference/i,
  ];

  for (const pattern of mathTopics) {
    if (pattern.test(content)) return "math";
  }

  // CONVERTER — must have specific conversion keywords
  if (/\b(celsius|fahrenheit|convert.*temperature|temperature.*convert)\b/i.test(lower)) return "convert";
  if (/\b(kilometer|kilometre|miles|km\s+to\s+miles|miles\s+to\s+km)\b/i.test(lower)) return "convert";
  if (/\b(kilogram|pounds|kg\s+to|to\s+kg)\b/i.test(lower)) return "convert";

  // QUIZ — must have at least 2 options in exact a) b) format AND a question mark
  const quizOptions = content.match(/^\s*[a-d][.)]\s+.+/gim);
  if (quizOptions && quizOptions.length >= 2 && /\?/.test(content)) return "quiz";

  // STEPS — must have at least 3 numbered steps
  const steps = content.match(/^\s*\d+[.)]\s+.+/gm);
  if (steps && steps.length >= 3 && /step|process|procedure|how to/i.test(lower)) return "steps";

  // COMPARE — must explicitly say "vs" or "versus" with two clear items
  if (/\b(\w[\w\s]+)\s+vs\.?\s+(\w[\w\s]+)/i.test(content) &&
      /compare|comparison|difference|versus/i.test(lower)) return "compare";

  return null;
}

// ── Extract math formula config ──────────────────────────────────
function extractMathVars(content) {
  if (/circumference/i.test(content)) {
    return {
      vars: [{ name: "radius", label: "Radius (r)", min: 0.1, max: 50, step: 0.1, default: 5, unit: "units" }],
      formula: (r) => 2 * Math.PI * r,
      label: "Circumference = 2πr",
      resultUnit: "units",
    };
  }
  if (/area\s+of\s+(a\s+)?circle|circle.*area/i.test(content)) {
    return {
      vars: [{ name: "radius", label: "Radius (r)", min: 0.1, max: 50, step: 0.1, default: 5, unit: "units" }],
      formula: (r) => Math.PI * r * r,
      label: "Area = πr²",
      resultUnit: "units²",
    };
  }
  if (/area\s+of\s+(a\s+)?rectangle|rectangle.*area/i.test(content)) {
    return {
      vars: [
        { name: "length", label: "Length", min: 0.1, max: 100, step: 0.5, default: 10, unit: "" },
        { name: "width",  label: "Width",  min: 0.1, max: 100, step: 0.5, default: 5,  unit: "" },
      ],
      formula: (l, w) => l * w,
      label: "Area = length × width",
      resultUnit: "units²",
    };
  }
  if (/area\s+of\s+(a\s+)?triangle|triangle.*area/i.test(content)) {
    return {
      vars: [
        { name: "base",   label: "Base",   min: 0.1, max: 100, step: 0.5, default: 8, unit: "" },
        { name: "height", label: "Height", min: 0.1, max: 100, step: 0.5, default: 5, unit: "" },
      ],
      formula: (b, h) => 0.5 * b * h,
      label: "Area = ½ × base × height",
      resultUnit: "units²",
    };
  }
  if (/volume\s+of\s+(a\s+)?sphere|sphere.*volume/i.test(content)) {
    return {
      vars: [{ name: "radius", label: "Radius (r)", min: 0.1, max: 30, step: 0.1, default: 5, unit: "units" }],
      formula: (r) => (4 / 3) * Math.PI * r * r * r,
      label: "Volume = (4/3)πr³",
      resultUnit: "units³",
    };
  }
  if (/volume\s+of\s+(a\s+)?cylinder|cylinder.*volume/i.test(content)) {
    return {
      vars: [
        { name: "radius", label: "Radius (r)", min: 0.1, max: 30, step: 0.1, default: 5,  unit: "" },
        { name: "height", label: "Height (h)", min: 0.1, max: 50, step: 0.5, default: 10, unit: "" },
      ],
      formula: (r, h) => Math.PI * r * r * h,
      label: "Volume = πr²h",
      resultUnit: "units³",
    };
  }
  if (/pythagor/i.test(content)) {
    return {
      vars: [
        { name: "a", label: "Side a", min: 0.1, max: 100, step: 0.5, default: 3, unit: "" },
        { name: "b", label: "Side b", min: 0.1, max: 100, step: 0.5, default: 4, unit: "" },
      ],
      formula: (a, b) => Math.sqrt(a * a + b * b),
      label: "c = √(a² + b²)",
      resultUnit: "",
    };
  }
  if (/kinetic\s+energy/i.test(content)) {
    return {
      vars: [
        { name: "mass",     label: "Mass (kg)",      min: 0.1, max: 1000, step: 1,   default: 10, unit: "kg"  },
        { name: "velocity", label: "Velocity (m/s)", min: 0,   max: 100,  step: 0.5, default: 5,  unit: "m/s" },
      ],
      formula: (m, v) => 0.5 * m * v * v,
      label: "KE = ½mv²",
      resultUnit: "Joules",
    };
  }
  if (/simple\s+interest/i.test(content)) {
    return {
      vars: [
        { name: "principal", label: "Principal ($)", min: 100, max: 100000, step: 100, default: 1000, unit: "$" },
        { name: "rate",      label: "Rate (%/yr)",   min: 0.1, max: 30,     step: 0.1, default: 5,    unit: "%" },
        { name: "time",      label: "Time (years)",  min: 1,   max: 30,     step: 1,   default: 3,    unit: "yr" },
      ],
      formula: (p, r, t) => p * (r / 100) * t,
      label: "SI = P × R × T / 100",
      resultUnit: "$",
    };
  }
  if (/compound\s+interest/i.test(content)) {
    return {
      vars: [
        { name: "principal", label: "Principal ($)", min: 100, max: 100000, step: 100, default: 1000, unit: "$" },
        { name: "rate",      label: "Rate (%/yr)",   min: 0.1, max: 30,     step: 0.1, default: 5,    unit: "%" },
        { name: "time",      label: "Time (years)",  min: 1,   max: 30,     step: 1,   default: 3,    unit: "yr" },
      ],
      formula: (p, r, t) => p * Math.pow(1 + r / 100, t) - p,
      label: "CI = P(1 + r/n)ⁿ - P",
      resultUnit: "$",
    };
  }
  if (/body\s+mass\s+index|bmi/i.test(content)) {
    return {
      vars: [
        { name: "weight", label: "Weight (kg)", min: 30,  max: 200, step: 0.5, default: 70,  unit: "kg" },
        { name: "height", label: "Height (cm)", min: 100, max: 220, step: 1,   default: 170, unit: "cm" },
      ],
      formula: (w, h) => w / Math.pow(h / 100, 2),
      label: "BMI = weight / height²",
      resultUnit: "",
    };
  }
  return null;
}

// ── Shared PanelHeader ───────────────────────────────────────────
function PanelHeader({ icon, title }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "11px 18px",
      background: "linear-gradient(135deg, rgba(91,127,255,0.07), rgba(59,91,219,0.11))",
      borderBottom: "1px solid rgba(59,91,219,0.10)",
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#2c3fd6" }}>{title}</span>
      <div style={{
        marginLeft: "auto", fontSize: 10, fontWeight: 600, color: "#9bb0d8",
        background: "rgba(59,91,219,0.07)", borderRadius: 99, padding: "2px 8px",
      }}>interactive</div>
    </div>
  );
}

// ── MATH SLIDER WIDGET ───────────────────────────────────────────
function MathWidget({ content }) {
  const mathData = extractMathVars(content);
  if (!mathData) return null;

  const initVals = {};
  mathData.vars.forEach(v => { initVals[v.name] = v.default; });
  const [vals, setVals] = useState(initVals);

  const result    = mathData.formula(...mathData.vars.map(v => vals[v.name]));
  const fmtResult = isNaN(result) ? "—" : +result.toFixed(4);

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { label: "Underweight", color: "#3b82f6" };
    if (bmi < 25)   return { label: "Normal",      color: "#22c55e" };
    if (bmi < 30)   return { label: "Overweight",  color: "#f59e0b" };
    return               { label: "Obese",         color: "#ef4444" };
  };

  const isBMI = /bmi/i.test(mathData.label);
  const bmiCat = isBMI ? getBMICategory(result) : null;

  return (
    <div style={{
      borderRadius: 16, border: "1px solid rgba(59,91,219,0.14)",
      background: "rgba(255,255,255,0.97)",
      boxShadow: "0 4px 24px rgba(59,91,219,0.09)",
      overflow: "hidden", width: "100%",
    }}>
      <PanelHeader icon="🧮" title="Interactive Calculator" />
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>

       
        <div style={{
          fontSize: 13, fontWeight: 600, color: "#3b5bdb",
          background: "rgba(59,91,219,0.06)", borderRadius: 10,
          padding: "6px 12px", textAlign: "center",
        }}>
          {mathData.label}
        </div>

        
        {mathData.vars.map(v => (
          <div key={v.name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{v.label}</label>
              <span style={{
                fontSize: 13, fontWeight: 700, color: "#3b5bdb",
                background: "rgba(59,91,219,0.08)", borderRadius: 8, padding: "2px 10px",
              }}>{vals[v.name]}{v.unit ? " " + v.unit : ""}</span>
            </div>
            <input
              type="range"
              min={v.min} max={v.max} step={v.step}
              value={vals[v.name]}
              onChange={e => setVals(prev => ({ ...prev, [v.name]: parseFloat(e.target.value) }))}
              style={{ width: "100%", accentColor: "#3b5bdb", cursor: "pointer", height: 20 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9ca3af", marginTop: 1 }}>
              <span>{v.min}</span>
              <span>{v.max}</span>
            </div>
          </div>
        ))}

        
        <div style={{
          borderRadius: 14, padding: "14px 18px", textAlign: "center",
          background: isBMI
            ? `rgba(${bmiCat?.color === "#22c55e" ? "34,197,94" : bmiCat?.color === "#f59e0b" ? "245,158,11" : bmiCat?.color === "#3b82f6" ? "59,130,246" : "239,68,68"},0.08)`
            : "linear-gradient(135deg,rgba(91,127,255,0.08),rgba(59,91,219,0.12))",
          border: "1px solid rgba(59,91,219,0.12)",
        }}>
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4, fontWeight: 500 }}>Result</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: isBMI ? bmiCat?.color : "#2c3fd6" }}>
            {fmtResult} <span style={{ fontSize: 14, fontWeight: 500, color: "#6b7280" }}>{mathData.resultUnit}</span>
          </div>
          {isBMI && bmiCat && (
            <div style={{ fontSize: 13, fontWeight: 600, color: bmiCat.color, marginTop: 4 }}>
              {bmiCat.label}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ── CONVERTER WIDGET ─────────────────────────────────────────────
function ConverterWidget({ content }) {
  // Detect which converter to show
  const isTemp = /celsius|fahrenheit|temperature/i.test(content);
  const isDist = /kilometer|kilometre|miles/i.test(content);
  const isWeight = /kilogram|pounds|kg/i.test(content);

  const configs = [];

  if (isTemp) configs.push({
    label: "Temperature",
    fromLabel: "°Celsius", toLabel: "°Fahrenheit",
    convert: (v) => (v * 9/5) + 32,
    reverseConvert: (v) => (v - 32) * 5/9,
    min: -50, max: 150, step: 0.5, default: 25,
    icon: "🌡️",
  });

  if (isDist) configs.push({
    label: "Distance",
    fromLabel: "Kilometers", toLabel: "Miles",
    convert: (v) => v * 0.621371,
    reverseConvert: (v) => v / 0.621371,
    min: 0, max: 1000, step: 1, default: 10,
    icon: "📏",
  });

  if (isWeight) configs.push({
    label: "Weight",
    fromLabel: "Kilograms", toLabel: "Pounds",
    convert: (v) => v * 2.20462,
    reverseConvert: (v) => v / 2.20462,
    min: 0, max: 300, step: 0.5, default: 70,
    icon: "⚖️",
  });

  // Default to temperature if nothing matched
  if (configs.length === 0) configs.push({
    label: "Temperature",
    fromLabel: "°Celsius", toLabel: "°Fahrenheit",
    convert: (v) => (v * 9/5) + 32,
    reverseConvert: (v) => (v - 32) * 5/9,
    min: -50, max: 150, step: 0.5, default: 25,
    icon: "🌡️",
  });

  const cfg = configs[0];
  const [val, setVal] = useState(cfg.default);
  const converted = +cfg.convert(val).toFixed(3);

  return (
    <div style={{
      borderRadius: 16, border: "1px solid rgba(59,91,219,0.14)",
      background: "rgba(255,255,255,0.97)",
      boxShadow: "0 4px 24px rgba(59,91,219,0.09)",
      overflow: "hidden", width: "100%",
    }}>
      <PanelHeader icon={cfg.icon} title={`${cfg.label} Converter`} />
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
            {cfg.fromLabel}
          </label>
          <span style={{
            fontSize: 13, fontWeight: 700, color: "#3b5bdb",
            background: "rgba(59,91,219,0.08)", borderRadius: 8, padding: "2px 10px",
          }}>{val}</span>
        </div>
        <input
          type="range"
          min={cfg.min} max={cfg.max} step={cfg.step}
          value={val}
          onChange={e => setVal(parseFloat(e.target.value))}
          style={{ width: "100%", accentColor: "#3b5bdb", cursor: "pointer", height: 20 }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9ca3af" }}>
          <span>{cfg.min}</span><span>{cfg.max}</span>
        </div>

        
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            flex: 1, textAlign: "center", padding: "10px",
            background: "rgba(59,91,219,0.05)", borderRadius: 12,
            fontSize: 15, fontWeight: 700, color: "#1a2240",
          }}>
            {val} {cfg.fromLabel}
          </div>
          <div style={{ fontSize: 20, color: "#3b5bdb" }}>→</div>
          <div style={{
            flex: 1, textAlign: "center", padding: "10px",
            background: "linear-gradient(135deg,rgba(91,127,255,0.10),rgba(59,91,219,0.14))",
            borderRadius: 12, fontSize: 15, fontWeight: 800, color: "#2c3fd6",
            border: "1px solid rgba(59,91,219,0.15)",
          }}>
            {converted} {cfg.toLabel}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── STEPS WIDGET ─────────────────────────────────────────────────
function StepsWidget({ content }) {
  const [currentStep, setCurrentStep] = useState(0);

  const stepMatches = [...content.matchAll(/^\s*(\d+)[.)]\s+(.+)/gm)];
  if (stepMatches.length < 2) return null;

  const steps = stepMatches.map(m => m[2].trim()).slice(0, 8);
  const total = steps.length;

  return (
    <div style={{
      borderRadius: 16, border: "1px solid rgba(59,91,219,0.14)",
      background: "rgba(255,255,255,0.97)",
      boxShadow: "0 4px 24px rgba(59,91,219,0.09)",
      overflow: "hidden", width: "100%",
    }}>
      <PanelHeader icon="📋" title="Step-by-Step Guide" />
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>

        
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            flex: 1, height: 6, background: "rgba(59,91,219,0.10)", borderRadius: 99, overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 99,
              background: "linear-gradient(90deg,#5b7fff,#3b5bdb)",
              width: `${((currentStep + 1) / total) * 100}%`,
              transition: "width 0.3s ease",
            }}/>
          </div>
          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, whiteSpace: "nowrap" }}>
            {currentStep + 1} / {total}
          </span>
        </div>

        
        <div style={{
          padding: "16px", borderRadius: 14,
          background: "linear-gradient(135deg,rgba(91,127,255,0.07),rgba(59,91,219,0.10))",
          border: "1px solid rgba(59,91,219,0.12)",
          minHeight: 60,
        }}>
          <div style={{ fontSize: 11, color: "#9bb0d8", fontWeight: 700, marginBottom: 6 }}>
            STEP {currentStep + 1}
          </div>
          <div style={{ fontSize: 14, color: "#1a2240", lineHeight: 1.6, fontWeight: 500 }}>
            {steps[currentStep]}
          </div>
        </div>

        
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 13, fontWeight: 600,
              border: "none", cursor: currentStep === 0 ? "not-allowed" : "pointer",
              opacity: currentStep === 0 ? 0.4 : 1,
              background: "rgba(59,91,219,0.08)", color: "#3b5bdb",
            }}
          >← Previous</button>
          <button
            onClick={() => setCurrentStep(s => Math.min(total - 1, s + 1))}
            disabled={currentStep === total - 1}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 13, fontWeight: 600,
              border: "none", cursor: currentStep === total - 1 ? "not-allowed" : "pointer",
              opacity: currentStep === total - 1 ? 0.4 : 1,
              background: "linear-gradient(135deg,#5b7fff,#3b5bdb)", color: "white",
              boxShadow: currentStep < total - 1 ? "0 3px 12px rgba(59,91,219,0.22)" : "none",
            }}
          >Next →</button>
        </div>

        
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              style={{
                width: 28, height: 28, borderRadius: "50%", fontSize: 12, fontWeight: 700,
                border: "none", cursor: "pointer",
                background: i === currentStep
                  ? "linear-gradient(135deg,#5b7fff,#3b5bdb)"
                  : i < currentStep
                    ? "rgba(59,91,219,0.15)"
                    : "rgba(59,91,219,0.06)",
                color: i === currentStep ? "white" : i < currentStep ? "#3b5bdb" : "#9ca3af",
              }}
            >{i + 1}</button>
          ))}
        </div>

      </div>
    </div>
  );
}

// ── COMPARE WIDGET ───────────────────────────────────────────────
function CompareWidget({ content }) {
  const [selected, setSelected] = useState(null);

  const vsMatch = content.match(/\b([\w\s]+?)\s+vs\.?\s+([\w\s]+)/i);
  if (!vsMatch) return null;

  const optA = vsMatch[1].trim().split(/\s+/).slice(-2).join(" ");
  const optB = vsMatch[2].trim().split(/\s+/).slice(0, 2).join(" ");

  return (
    <div style={{
      borderRadius: 16, border: "1px solid rgba(59,91,219,0.14)",
      background: "rgba(255,255,255,0.97)",
      boxShadow: "0 4px 24px rgba(59,91,219,0.09)",
      overflow: "hidden", width: "100%",
    }}>
      <PanelHeader icon="⚖️" title="Quick Comparison" />
      <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ fontSize: 13, color: "#5a6a88", margin: 0 }}>Which do you prefer?</p>
        <div style={{ display: "flex", gap: 10 }}>
          {[{ key: "A", label: optA, color: "#2c3fd6", bg: "rgba(59,91,219,0.08)", border: "rgba(59,91,219,0.30)" },
            { key: "B", label: optB, color: "#065f46", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.30)" }
          ].map(({ key, label, color, bg, border }) => (
            <button
              key={key}
              onClick={() => setSelected(selected === key ? null : key)}
              style={{
                flex: 1, padding: "14px 8px", borderRadius: 14, fontWeight: 700, fontSize: 14,
                cursor: "pointer",
                border: `2px solid ${selected === key ? border : "rgba(59,91,219,0.10)"}`,
                background: selected === key ? bg : "rgba(255,255,255,0.7)",
                color: selected === key ? color : "#6b7280",
                transition: "all 0.18s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}
            >
              <span style={{ fontSize: 22 }}>{key === "A" ? "🅰" : "🅱"}</span>
              {label}
            </button>
          ))}
        </div>
        {selected && (
          <div style={{
            padding: "10px 14px", borderRadius: 12, fontSize: 13, fontWeight: 500,
            background: selected === "A" ? "rgba(59,91,219,0.07)" : "rgba(16,185,129,0.07)",
            border: `1px solid ${selected === "A" ? "rgba(59,91,219,0.20)" : "rgba(16,185,129,0.20)"}`,
            color: "#374151", animation: "fadeIn 0.25s ease both",
          }}>
            ✅ You chose <strong style={{ color: selected === "A" ? "#2c3fd6" : "#065f46" }}>
              {selected === "A" ? optA : optB}
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}

// ── QUIZ WIDGET ──────────────────────────────────────────────────
function QuizWidget({ content }) {
  const [answered, setAnswered] = useState(null);

  const questionMatch = content.match(/([^\n.!]+\?)/);
  if (!questionMatch) return null;
  const question = questionMatch[1].trim();

  // Match options in format: a) text OR a. text
  const optionMatches = [...content.matchAll(/^\s*([a-d])[.)]\s+(.+)/gim)];
  if (optionMatches.length < 2) return null;

  const options = optionMatches.slice(0, 4).map(m => ({
    key: m[1].toUpperCase(),
    label: m[2].trim(),
  }));

  // Match "Answer: a" or "Answer: a)" format
  const answerMatch = content.match(/answer[:\s]+([a-d])[).]?\s/i);
  const correctKey  = answerMatch ? answerMatch[1].toUpperCase() : null;

  const getStyle = (key) => {
    if (!answered) return { bg: "rgba(59,91,219,0.05)", border: "rgba(59,91,219,0.13)", color: "#374151" };
    if (key === answered && key === correctKey) return { bg: "rgba(34,197,94,0.10)", border: "#22c55e", color: "#15803d" };
    if (key === answered && key !== correctKey) return { bg: "rgba(239,68,68,0.08)",  border: "#ef4444", color: "#b91c1c" };
    if (key === correctKey) return { bg: "rgba(34,197,94,0.06)", border: "rgba(34,197,94,0.30)", color: "#374151" };
    return { bg: "rgba(59,91,219,0.03)", border: "rgba(59,91,219,0.08)", color: "#9ca3af" };
  };

  return (
    <div style={{
      borderRadius: 16, border: "1px solid rgba(59,91,219,0.14)",
      background: "rgba(255,255,255,0.97)",
      boxShadow: "0 4px 24px rgba(59,91,219,0.09)",
      overflow: "hidden", width: "100%",
    }}>
      <PanelHeader icon="🧠" title="Quick Quiz" />
      <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>

        <p style={{ fontSize: 13, fontWeight: 600, color: "#1a2240", margin: 0 }}>
          {question}
        </p>

        {options.map(({ key, label }) => {
          const s = getStyle(key);
          return (
            <button
              key={key}
              disabled={!!answered}
              onClick={() => setAnswered(key)}
              style={{
                textAlign: "left", padding: "10px 14px", borderRadius: 12,
                fontSize: 13, fontWeight: answered && (key === answered || key === correctKey) ? 600 : 500,
                border: `1.5px solid ${s.border}`, background: s.bg, color: s.color,
                cursor: answered ? "default" : "pointer", transition: "all 0.18s",
                display: "flex", alignItems: "center", gap: 10,
              }}
            >
              <span style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
                background: answered && (key === answered || key === correctKey)
                  ? s.border : "rgba(59,91,219,0.12)",
                color: answered && (key === answered || key === correctKey) ? "white" : "#3b5bdb",
              }}>{key}</span>
              {label}
              {answered && key === correctKey && <span style={{ marginLeft: "auto" }}>✅</span>}
              {answered && key === answered && key !== correctKey && <span style={{ marginLeft: "auto" }}>❌</span>}
            </button>
          );
        })}

        {answered && (
          <div style={{
            padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 500,
            background: answered === correctKey ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.07)",
            color: answered === correctKey ? "#15803d" : "#b91c1c",
            animation: "fadeIn 0.25s ease",
          }}>
            {answered === correctKey
              ? "🎉 Correct! Great job."
              : correctKey
                ? `The correct answer is ${correctKey}. Review the explanation above.`
                : "Check the explanation above."}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN EXPORT ──────────────────────────────────────────────────
export default function InteractivePanel({ content }) {
  if (!content || content.length < 20) return null;

  // Hard block — if AI generated fake iframes, show nothing
  if (/iframe|<embed|nchat\.ai/i.test(content)) return null;

  const type = detectType(content);
  if (!type) return null;

  if (type === "math")    return <MathWidget    content={content} />;
  if (type === "convert") return <ConverterWidget content={content} />;
  if (type === "steps")   return <StepsWidget   content={content} />;
  if (type === "compare") return <CompareWidget  content={content} />;
  if (type === "quiz")    return <QuizWidget     content={content} />;

  return null;
}
*/}

import { useState, useEffect, useRef } from "react";

// ── TYPE DETECTOR ─────────────────────────────────────────────────
function detectType(content) {
  if (!content || content.length < 20) return null;

  // Hard block fake iframes
  if (/iframe|<embed|nchat\.ai/i.test(content)) return null;

  // GRAPH — check first, before steps, so sin graph doesn't become steps
  if (/\b(sin|cos|tan|sine|cosine|tangent)\s*(graph|function|wave|curve)/i.test(content)) return "graph_trig";
  if (/\b(linear|quadratic|parabola)\s*(equation|graph|function)/i.test(content)) return "graph_math";
  if (/(plot|graph|visuali[sz]e)\s+(the\s+)?(function|equation|data)/i.test(content)) return "graph_math";
  if (/exponential\s+(growth|decay|function)/i.test(content)) return "graph_math";

  // QUIZ — must have Q: format (our new format)
  if (/^Q:/m.test(content)) return "quiz";

  // MATH CALCULATOR
  const mathTopics = [
    /volume\s+of\s+(a\s+)?cylinder|cylinder.*volume/i,
    /volume\s+of\s+(a\s+)?sphere|sphere.*volume/i,
    /area\s+of\s+(a\s+)?circle|circle.*area/i,
    /area\s+of\s+(a\s+)?rectangle|rectangle.*area/i,
    /area\s+of\s+(a\s+)?triangle|triangle.*area/i,
    /pythagor/i,
    /kinetic\s+energy/i,
    /simple\s+interest/i,
    /compound\s+interest/i,
    /body\s+mass\s+index|\bbmi\b/i,
    /circumference/i,
  ];
  for (const p of mathTopics) {
    if (p.test(content)) return "math";
  }

  // CONVERTER
  if (/\b(celsius|fahrenheit|convert.*temp|temp.*convert)\b/i.test(content)) return "convert";
  if (/\b(kilometer|kilometre|miles|km\s+to\s+miles|miles\s+to\s+km)\b/i.test(content)) return "convert";
  if (/\b(kilogram|pounds|kg\s+to|to\s+kg)\b/i.test(content)) return "convert";

  // STEPS — numbered steps + process keyword, but NOT if it's a graph topic
  const steps = content.match(/^\s*\d+[.)]\s+.+/gm);
  if (
    steps && steps.length >= 3 &&
    /step|process|procedure|how\s+to/i.test(content) &&
    !/sin|cos|tan|graph|function|wave/i.test(content)
  ) return "steps";

  // COMPARE
  if (
    /\b([\w\s]+?)\s+vs\.?\s+([\w\s]+)/i.test(content) &&
    /compare|comparison|difference|versus/i.test(content)
  ) return "compare";

  return null;
}

// ── PARSE ALL QUIZ QUESTIONS ──────────────────────────────────────
function parseAllQuestions(content) {
  // Split on "Q:" to get each question block
  const blocks = content.split(/(?=^Q:)/m).filter(b => /^Q:/m.test(b));

  return blocks.map(block => {
    const lines = block.trim().split("\n").map(l => l.trim()).filter(Boolean);

    const questionLine = lines.find(l => l.startsWith("Q:"));
    const question = questionLine ? questionLine.replace(/^Q:\s*/, "").trim() : "";

    const optionLines = lines.filter(l => /^[a-d][.)]\s+/i.test(l));
    const options = optionLines.map(l => {
      const match = l.match(/^([a-d])[.)]\s+(.+)/i);
      return match ? { key: match[1].toUpperCase(), label: match[2].trim() } : null;
    }).filter(Boolean);

    const answerLine = lines.find(l => /^answer:/i.test(l));
    const correctKey = answerLine
      ? answerLine.replace(/^answer:\s*/i, "").trim().toUpperCase().charAt(0)
      : null;

    return { question, options, correctKey };
  }).filter(q => q.question && q.options.length >= 2);
}

// ── MATH VARS EXTRACTOR ───────────────────────────────────────────
function extractMathVars(content) {
  if (/circumference/i.test(content)) return {
    vars: [{ name: "radius", label: "Radius (r)", min: 0.1, max: 50, step: 0.1, default: 5, unit: "units" }],
    formula: (r) => 2 * Math.PI * r, label: "Circumference = 2πr", resultUnit: "units",
  };
  if (/area\s+of\s+(a\s+)?circle|circle.*area/i.test(content)) return {
    vars: [{ name: "radius", label: "Radius (r)", min: 0.1, max: 50, step: 0.1, default: 5, unit: "units" }],
    formula: (r) => Math.PI * r * r, label: "Area = πr²", resultUnit: "units²",
  };
  if (/area\s+of\s+(a\s+)?rectangle|rectangle.*area/i.test(content)) return {
    vars: [
      { name: "length", label: "Length", min: 0.1, max: 100, step: 0.5, default: 10, unit: "" },
      { name: "width",  label: "Width",  min: 0.1, max: 100, step: 0.5, default: 5,  unit: "" },
    ],
    formula: (l, w) => l * w, label: "Area = length × width", resultUnit: "units²",
  };
  if (/area\s+of\s+(a\s+)?triangle|triangle.*area/i.test(content)) return {
    vars: [
      { name: "base",   label: "Base",   min: 0.1, max: 100, step: 0.5, default: 8, unit: "" },
      { name: "height", label: "Height", min: 0.1, max: 100, step: 0.5, default: 5, unit: "" },
    ],
    formula: (b, h) => 0.5 * b * h, label: "Area = ½ × base × height", resultUnit: "units²",
  };
  if (/volume\s+of\s+(a\s+)?sphere|sphere.*volume/i.test(content)) return {
    vars: [{ name: "radius", label: "Radius (r)", min: 0.1, max: 30, step: 0.1, default: 5, unit: "units" }],
    formula: (r) => (4/3) * Math.PI * r * r * r, label: "Volume = (4/3)πr³", resultUnit: "units³",
  };
  if (/volume\s+of\s+(a\s+)?cylinder|cylinder.*volume/i.test(content)) return {
    vars: [
      { name: "radius", label: "Radius (r)", min: 0.1, max: 30, step: 0.1, default: 5,  unit: "" },
      { name: "height", label: "Height (h)", min: 0.1, max: 50, step: 0.5, default: 10, unit: "" },
    ],
    formula: (r, h) => Math.PI * r * r * h, label: "Volume = πr²h", resultUnit: "units³",
  };
  if (/pythagor/i.test(content)) return {
    vars: [
      { name: "a", label: "Side a", min: 0.1, max: 100, step: 0.5, default: 3, unit: "" },
      { name: "b", label: "Side b", min: 0.1, max: 100, step: 0.5, default: 4, unit: "" },
    ],
    formula: (a, b) => Math.sqrt(a*a + b*b), label: "c = √(a² + b²)", resultUnit: "",
  };
  if (/kinetic\s+energy/i.test(content)) return {
    vars: [
      { name: "mass",     label: "Mass (kg)",      min: 0.1, max: 1000, step: 1,   default: 10, unit: "kg"  },
      { name: "velocity", label: "Velocity (m/s)", min: 0,   max: 100,  step: 0.5, default: 5,  unit: "m/s" },
    ],
    formula: (m, v) => 0.5 * m * v * v, label: "KE = ½mv²", resultUnit: "Joules",
  };
  if (/simple\s+interest/i.test(content)) return {
    vars: [
      { name: "principal", label: "Principal ($)", min: 100, max: 100000, step: 100, default: 1000, unit: "$" },
      { name: "rate",      label: "Rate (%/yr)",   min: 0.1, max: 30,     step: 0.1, default: 5,   unit: "%" },
      { name: "time",      label: "Time (years)",  min: 1,   max: 30,     step: 1,   default: 3,   unit: "yr" },
    ],
    formula: (p, r, t) => p * (r/100) * t, label: "SI = P × R × T / 100", resultUnit: "$",
  };
  if (/compound\s+interest/i.test(content)) return {
    vars: [
      { name: "principal", label: "Principal ($)", min: 100, max: 100000, step: 100, default: 1000, unit: "$" },
      { name: "rate",      label: "Rate (%/yr)",   min: 0.1, max: 30,     step: 0.1, default: 5,   unit: "%" },
      { name: "time",      label: "Time (years)",  min: 1,   max: 30,     step: 1,   default: 3,   unit: "yr" },
    ],
    formula: (p, r, t) => p * Math.pow(1 + r/100, t) - p, label: "CI = P(1+r/n)ⁿ - P", resultUnit: "$",
  };
  if (/body\s+mass\s+index|\bbmi\b/i.test(content)) return {
    vars: [
      { name: "weight", label: "Weight (kg)", min: 30,  max: 200, step: 0.5, default: 70,  unit: "kg" },
      { name: "height", label: "Height (cm)", min: 100, max: 220, step: 1,   default: 170, unit: "cm" },
    ],
    formula: (w, h) => w / Math.pow(h/100, 2), label: "BMI = weight / height²", resultUnit: "",
  };
  return null;
}

// ── SHARED HEADER ─────────────────────────────────────────────────
function PanelHeader({ icon, title }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, padding: "11px 18px",
      background: "linear-gradient(135deg,rgba(91,127,255,0.07),rgba(59,91,219,0.11))",
      borderBottom: "1px solid rgba(59,91,219,0.10)",
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#2c3fd6" }}>{title}</span>
      <div style={{
        marginLeft: "auto", fontSize: 10, fontWeight: 600, color: "#9bb0d8",
        background: "rgba(59,91,219,0.07)", borderRadius: 99, padding: "2px 8px",
      }}>interactive</div>
    </div>
  );
}

const panelStyle = {
  borderRadius: 16, border: "1px solid rgba(59,91,219,0.14)",
  background: "rgba(255,255,255,0.97)",
  boxShadow: "0 4px 24px rgba(59,91,219,0.09)",
  overflow: "hidden", width: "100%",
};

// ── TRIG GRAPH WIDGET ─────────────────────────────────────────────
function TrigGraphWidget({ content }) {
  const canvasRef = useRef(null);
  const [fnType,     setFnType]     = useState("sin");
  const [amplitude,  setAmplitude]  = useState(1);
  const [frequency,  setFrequency]  = useState(1);
  const [phaseShift, setPhaseShift] = useState(0);

  // Auto-detect which function to show based on content
  useEffect(() => {
    if (/\bcos(ine)?\b/i.test(content) && !/\bsin(e)?\b/i.test(content)) setFnType("cos");
    else if (/\btan(gent)?\b/i.test(content) && !/\bsin(e)?\b/i.test(content)) setFnType("tan");
    else setFnType("sin");
  }, [content]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const midY = H / 2;
    const scaleX = W / (4 * Math.PI);
    const scaleY = (H / 2) * 0.8;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#f8faff";
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "rgba(59,91,219,0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += W / 8) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += H / 4) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // X axis
    ctx.strokeStyle = "rgba(59,91,219,0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke();

    // Y axis
    ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#9bb0d8";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    const labels = ["-2π", "-π", "0", "π", "2π"];
    labels.forEach((label, i) => {
      ctx.fillText(label, (i / 4) * W, midY + 14);
    });

    // Draw the function
    ctx.strokeStyle = "#3b5bdb";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "rgba(59,91,219,0.25)";
    ctx.shadowBlur = 4;
    ctx.beginPath();

    let started = false;
    for (let px = 0; px <= W; px++) {
      const x = (px / W) * 4 * Math.PI - 2 * Math.PI;
      const xWithPhase = frequency * x + phaseShift;
      let y;

      if (fnType === "sin")      y = amplitude * Math.sin(xWithPhase);
      else if (fnType === "cos") y = amplitude * Math.cos(xWithPhase);
      else {
        // Tan — clip extreme values
        const tanVal = Math.tan(xWithPhase);
        if (Math.abs(tanVal) > 5) { started = false; continue; }
        y = amplitude * tanVal;
      }

      const py = midY - y * scaleY;
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Current value indicator at x=0
    let yAtZero;
    if (fnType === "sin")      yAtZero = amplitude * Math.sin(phaseShift);
    else if (fnType === "cos") yAtZero = amplitude * Math.cos(phaseShift);
    else                       yAtZero = Math.abs(Math.tan(phaseShift)) < 5 ? amplitude * Math.tan(phaseShift) : 0;

    const dotX = W / 2;
    const dotY = midY - yAtZero * scaleY;
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
    ctx.fill();

  }, [fnType, amplitude, frequency, phaseShift]);

  const sliderStyle = { width: "100%", accentColor: "#3b5bdb", cursor: "pointer", height: 18 };
  const labelStyle  = { fontSize: 12, fontWeight: 600, color: "#374151" };
  const valueStyle  = {
    fontSize: 12, fontWeight: 700, color: "#3b5bdb",
    background: "rgba(59,91,219,0.08)", borderRadius: 8, padding: "1px 8px",
  };

  return (
    <div style={panelStyle}>
      <PanelHeader icon="📈" title="Interactive Graph" />
      <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Function selector */}
        <div style={{ display: "flex", gap: 8 }}>
          {["sin", "cos", "tan"].map(fn => (
            <button key={fn} onClick={() => setFnType(fn)} style={{
              flex: 1, padding: "7px 0", borderRadius: 10, fontSize: 13, fontWeight: 700,
              border: "none", cursor: "pointer", transition: "all 0.15s",
              background: fnType === fn
                ? "linear-gradient(135deg,#5b7fff,#3b5bdb)"
                : "rgba(59,91,219,0.08)",
              color: fnType === fn ? "white" : "#3b5bdb",
              boxShadow: fnType === fn ? "0 3px 10px rgba(59,91,219,0.25)" : "none",
            }}>{fn}(x)</button>
          ))}
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={460}
          height={200}
          style={{
            width: "100%", height: "auto", borderRadius: 12,
            border: "1px solid rgba(59,91,219,0.10)",
          }}
        />

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={labelStyle}>Amplitude</span>
              <span style={valueStyle}>{amplitude}</span>
            </div>
            <input type="range" min={0.1} max={3} step={0.1} value={amplitude}
              onChange={e => setAmplitude(parseFloat(e.target.value))} style={sliderStyle} />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={labelStyle}>Frequency</span>
              <span style={valueStyle}>{frequency}x</span>
            </div>
            <input type="range" min={0.5} max={4} step={0.5} value={frequency}
              onChange={e => setFrequency(parseFloat(e.target.value))} style={sliderStyle} />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={labelStyle}>Phase Shift</span>
              <span style={valueStyle}>{phaseShift.toFixed(1)}</span>
            </div>
            <input type="range" min={-3.14} max={3.14} step={0.1} value={phaseShift}
              onChange={e => setPhaseShift(parseFloat(e.target.value))} style={sliderStyle} />
          </div>

        </div>

        {/* Info row */}
        <div style={{
          display: "flex", gap: 8, flexWrap: "wrap",
        }}>
          {[
            { label: "Max value", value: fnType === "tan" ? "∞" : `+${amplitude}` },
            { label: "Min value", value: fnType === "tan" ? "-∞" : `-${amplitude}` },
            { label: "Period",    value: fnType === "tan" ? `π/${frequency}` : `2π/${frequency}` },
          ].map(({ label, value }) => (
            <div key={label} style={{
              flex: 1, minWidth: 80, padding: "8px 10px", borderRadius: 10, textAlign: "center",
              background: "rgba(59,91,219,0.05)", border: "1px solid rgba(59,91,219,0.10)",
            }}>
              <div style={{ fontSize: 10, color: "#9bb0d8", fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#2c3fd6" }}>{value}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ── MATH GRAPH WIDGET (linear, quadratic, exponential) ────────────
function MathGraphWidget({ content }) {
  const canvasRef = useRef(null);

  const isQuadratic    = /quadratic|parabola/i.test(content);
  const isExponential  = /exponential/i.test(content);

  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const midX = W / 2;
    const midY = H / 2;
    const scale = 30;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#f8faff";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(59,91,219,0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "rgba(59,91,219,0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(midX, 0); ctx.lineTo(midX, H); ctx.stroke();

    // Axis numbers
    ctx.fillStyle = "#9bb0d8";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    for (let i = -7; i <= 7; i++) {
      if (i === 0) continue;
      ctx.fillText(i, midX + i * scale, midY + 14);
      ctx.fillText(i, midX - 14, midY - i * scale + 3);
    }

    // Plot function
    ctx.strokeStyle = "#3b5bdb";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "rgba(59,91,219,0.25)";
    ctx.shadowBlur = 4;
    ctx.beginPath();

    let started = false;
    for (let px = 0; px <= W; px++) {
      const x = (px - midX) / scale;
      let y;
      if (isExponential)   y = a * Math.pow(b || Math.E, x) + c;
      else if (isQuadratic) y = a * x * x + b * x + c;
      else                  y = a * x + b; // linear

      if (Math.abs(y) > 20) { started = false; continue; }
      const py = midY - y * scale;
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

  }, [a, b, c, isQuadratic, isExponential]);

  const sliderStyle = { width: "100%", accentColor: "#3b5bdb", cursor: "pointer", height: 18 };

  const controls = isExponential
    ? [
        { label: "Multiplier (a)", val: a, set: setA, min: -3, max: 3, step: 0.5 },
        { label: "Base (b)",        val: b, set: setB, min: 0.5, max: 5, step: 0.5 },
        { label: "Vertical shift (c)", val: c, set: setC, min: -5, max: 5, step: 0.5 },
      ]
    : isQuadratic
      ? [
          { label: "a (x² coefficient)", val: a, set: setA, min: -3, max: 3, step: 0.5 },
          { label: "b (x coefficient)",  val: b, set: setB, min: -5, max: 5, step: 0.5 },
          { label: "c (constant)",        val: c, set: setC, min: -5, max: 5, step: 0.5 },
        ]
      : [
          { label: "Slope (m)",     val: a, set: setA, min: -5, max: 5, step: 0.5 },
          { label: "Intercept (b)", val: b, set: setB, min: -5, max: 5, step: 0.5 },
        ];

  const functionLabel = isExponential
    ? `y = ${a} × ${(b || Math.E).toFixed(1)}^x + ${c}`
    : isQuadratic
      ? `y = ${a}x² + ${b}x + ${c}`
      : `y = ${a}x + ${b}`;

  return (
    <div style={panelStyle}>
      <PanelHeader icon="📊" title="Interactive Graph" />
      <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Function label */}
        <div style={{
          fontSize: 13, fontWeight: 700, color: "#3b5bdb", textAlign: "center",
          background: "rgba(59,91,219,0.06)", borderRadius: 10, padding: "6px 12px",
        }}>
          {functionLabel}
        </div>

        <canvas ref={canvasRef} width={460} height={240} style={{
          width: "100%", height: "auto", borderRadius: 12,
          border: "1px solid rgba(59,91,219,0.10)",
        }}/>

        {controls.map(({ label, val, set, min, max, step }) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{label}</span>
              <span style={{
                fontSize: 12, fontWeight: 700, color: "#3b5bdb",
                background: "rgba(59,91,219,0.08)", borderRadius: 8, padding: "1px 8px",
              }}>{val}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={e => set(parseFloat(e.target.value))} style={sliderStyle} />
          </div>
        ))}

      </div>
    </div>
  );
}

// ── MULTI-QUESTION QUIZ WIDGET ────────────────────────────────────
function QuizWidget({ content }) {
  const questions = parseAllQuestions(content);
  const [currentQ,  setCurrentQ]  = useState(0);
  const [answers,   setAnswers]   = useState({});
  const [showScore, setShowScore] = useState(false);

  if (questions.length === 0) return null;

  const total   = questions.length;
  const q       = questions[currentQ];
  const answered = answers[currentQ];

  const getStyle = (key) => {
    if (!answered) return { bg: "rgba(59,91,219,0.05)", border: "rgba(59,91,219,0.13)", color: "#374151" };
    if (key === answered && key === q.correctKey) return { bg: "rgba(34,197,94,0.10)", border: "#22c55e",  color: "#15803d" };
    if (key === answered && key !== q.correctKey) return { bg: "rgba(239,68,68,0.08)",  border: "#ef4444",  color: "#b91c1c" };
    if (key === q.correctKey)                     return { bg: "rgba(34,197,94,0.06)", border: "rgba(34,197,94,0.30)", color: "#374151" };
    return { bg: "rgba(59,91,219,0.03)", border: "rgba(59,91,219,0.08)", color: "#9ca3af" };
  };

  const score = Object.entries(answers).filter(([i, ans]) =>
    questions[parseInt(i)]?.correctKey === ans
  ).length;

  if (showScore) {
    const pct = Math.round((score / total) * 100);
    const color = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
    return (
      <div style={panelStyle}>
        <PanelHeader icon="🧠" title="Quiz Results" />
        <div style={{ padding: "24px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 48, fontWeight: 800, color }}>{pct}%</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>
            {score} / {total} correct
          </div>
          <div style={{
            fontSize: 14, color: "#5a6a88", textAlign: "center",
            padding: "10px 16px", background: "rgba(59,91,219,0.05)",
            borderRadius: 12, border: "1px solid rgba(59,91,219,0.10)",
          }}>
            {pct >= 80 ? "🎉 Excellent work! You really know this topic."
              : pct >= 50 ? "👍 Good effort! Review the ones you missed."
              : "📚 Keep practicing! Review the topic and try again."}
          </div>
          {/* Answer review */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
            {questions.map((qq, i) => {
              const userAns   = answers[i];
              const isCorrect = userAns === qq.correctKey;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                  borderRadius: 10, fontSize: 12,
                  background: isCorrect ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.05)",
                  border: `1px solid ${isCorrect ? "rgba(34,197,94,0.20)" : "rgba(239,68,68,0.15)"}`,
                }}>
                  <span>{isCorrect ? "✅" : "❌"}</span>
                  <span style={{ flex: 1, color: "#374151", fontWeight: 500 }}>
                    Q{i+1}: {qq.question.slice(0, 50)}{qq.question.length > 50 ? "..." : ""}
                  </span>
                  <span style={{ color: isCorrect ? "#15803d" : "#b91c1c", fontWeight: 600 }}>
                    {userAns || "—"} {!isCorrect && qq.correctKey ? `(${qq.correctKey})` : ""}
                  </span>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => { setAnswers({}); setCurrentQ(0); setShowScore(false); }}
            style={{
              padding: "10px 24px", borderRadius: 12, fontSize: 13, fontWeight: 700,
              border: "none", cursor: "pointer",
              background: "linear-gradient(135deg,#5b7fff,#3b5bdb)",
              color: "white", boxShadow: "0 3px 12px rgba(59,91,219,0.25)",
            }}
          >Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div style={panelStyle}>
      <PanelHeader icon="🧠" title={`Quiz — Question ${currentQ + 1} of ${total}`} />
      <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Progress bar */}
        <div style={{ height: 5, background: "rgba(59,91,219,0.10)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: "linear-gradient(90deg,#5b7fff,#3b5bdb)",
            width: `${((currentQ + 1) / total) * 100}%`,
            transition: "width 0.3s ease",
          }}/>
        </div>

        {/* Question */}
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1a2240", margin: 0, lineHeight: 1.5 }}>
          {q.question}
        </p>

        {/* Options */}
        {q.options.map(({ key, label }) => {
          const s = getStyle(key);
          return (
            <button
              key={key}
              disabled={!!answered}
              onClick={() => setAnswers(prev => ({ ...prev, [currentQ]: key }))}
              style={{
                textAlign: "left", padding: "10px 14px", borderRadius: 12,
                fontSize: 13, fontWeight: answered && (key === answered || key === q.correctKey) ? 600 : 500,
                border: `1.5px solid ${s.border}`, background: s.bg, color: s.color,
                cursor: answered ? "default" : "pointer", transition: "all 0.18s",
                display: "flex", alignItems: "center", gap: 10,
              }}
            >
              <span style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
                background: answered && (key === answered || key === q.correctKey)
                  ? s.border : "rgba(59,91,219,0.12)",
                color: answered && (key === answered || key === q.correctKey) ? "white" : "#3b5bdb",
              }}>{key}</span>
              {label}
              {answered && key === q.correctKey  && <span style={{ marginLeft: "auto" }}>✅</span>}
              {answered && key === answered && key !== q.correctKey && <span style={{ marginLeft: "auto" }}>❌</span>}
            </button>
          );
        })}

        {/* Feedback */}
        {answered && (
          <div style={{
            padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 500,
            background: answered === q.correctKey ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.07)",
            color: answered === q.correctKey ? "#15803d" : "#b91c1c",
            animation: "fadeIn 0.25s ease",
          }}>
            {answered === q.correctKey
              ? "🎉 Correct!"
              : q.correctKey
                ? `The correct answer is ${q.correctKey}.`
                : "Check the explanation above."}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <button
            onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
            disabled={currentQ === 0}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 13, fontWeight: 600,
              border: "none", cursor: currentQ === 0 ? "not-allowed" : "pointer",
              opacity: currentQ === 0 ? 0.4 : 1,
              background: "rgba(59,91,219,0.08)", color: "#3b5bdb",
            }}
          >← Previous</button>

          {currentQ < total - 1 ? (
            <button
              onClick={() => setCurrentQ(q => q + 1)}
              disabled={!answered}
              style={{
                flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 13, fontWeight: 600,
                border: "none", cursor: !answered ? "not-allowed" : "pointer",
                opacity: !answered ? 0.5 : 1,
                background: "linear-gradient(135deg,#5b7fff,#3b5bdb)", color: "white",
                boxShadow: answered ? "0 3px 12px rgba(59,91,219,0.22)" : "none",
              }}
            >Next →</button>
          ) : (
            <button
              onClick={() => setShowScore(true)}
              disabled={!answered}
              style={{
                flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 13, fontWeight: 700,
                border: "none", cursor: !answered ? "not-allowed" : "pointer",
                opacity: !answered ? 0.5 : 1,
                background: answered
                  ? "linear-gradient(135deg,#22c55e,#16a34a)"
                  : "rgba(180,195,230,0.4)",
                color: "white",
                boxShadow: answered ? "0 3px 12px rgba(34,197,94,0.30)" : "none",
              }}
            >See Results 🎯</button>
          )}
        </div>

        {/* Question dots */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              style={{
                width: 26, height: 26, borderRadius: "50%", fontSize: 11, fontWeight: 700,
                border: "none", cursor: "pointer",
                background: i === currentQ
                  ? "linear-gradient(135deg,#5b7fff,#3b5bdb)"
                  : answers[i] !== undefined
                    ? answers[i] === questions[i].correctKey
                      ? "rgba(34,197,94,0.25)"
                      : "rgba(239,68,68,0.20)"
                    : "rgba(59,91,219,0.08)",
                color: i === currentQ ? "white"
                  : answers[i] !== undefined
                    ? answers[i] === questions[i].correctKey ? "#15803d" : "#b91c1c"
                    : "#9ca3af",
              }}
            >{i + 1}</button>
          ))}
        </div>

      </div>
    </div>
  );
}

// ── MATH SLIDER WIDGET ────────────────────────────────────────────
function MathWidget({ content }) {
  const mathData = extractMathVars(content);
  if (!mathData) return null;

  const initVals = {};
  mathData.vars.forEach(v => { initVals[v.name] = v.default; });
  const [vals, setVals] = useState(initVals);

  const result    = mathData.formula(...mathData.vars.map(v => vals[v.name]));
  const fmtResult = isNaN(result) ? "—" : +result.toFixed(4);

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { label: "Underweight", color: "#3b82f6" };
    if (bmi < 25)   return { label: "Normal",      color: "#22c55e" };
    if (bmi < 30)   return { label: "Overweight",  color: "#f59e0b" };
    return               { label: "Obese",         color: "#ef4444" };
  };

  const isBMI  = /bmi/i.test(mathData.label);
  const bmiCat = isBMI ? getBMICategory(result) : null;

  return (
    <div style={panelStyle}>
      <PanelHeader icon="🧮" title="Interactive Calculator" />
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>

        <div style={{
          fontSize: 13, fontWeight: 600, color: "#3b5bdb",
          background: "rgba(59,91,219,0.06)", borderRadius: 10,
          padding: "6px 12px", textAlign: "center",
        }}>{mathData.label}</div>

        {mathData.vars.map(v => (
          <div key={v.name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{v.label}</label>
              <span style={{
                fontSize: 13, fontWeight: 700, color: "#3b5bdb",
                background: "rgba(59,91,219,0.08)", borderRadius: 8, padding: "2px 10px",
              }}>{vals[v.name]}{v.unit ? " " + v.unit : ""}</span>
            </div>
            <input
              type="range" min={v.min} max={v.max} step={v.step} value={vals[v.name]}
              onChange={e => setVals(prev => ({ ...prev, [v.name]: parseFloat(e.target.value) }))}
              style={{ width: "100%", accentColor: "#3b5bdb", cursor: "pointer", height: 20 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9ca3af", marginTop: 1 }}>
              <span>{v.min}</span><span>{v.max}</span>
            </div>
          </div>
        ))}

        <div style={{
          borderRadius: 14, padding: "14px 18px", textAlign: "center",
          background: isBMI
            ? "rgba(59,91,219,0.06)"
            : "linear-gradient(135deg,rgba(91,127,255,0.08),rgba(59,91,219,0.12))",
          border: "1px solid rgba(59,91,219,0.12)",
        }}>
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4, fontWeight: 500 }}>Result</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: isBMI ? bmiCat?.color : "#2c3fd6" }}>
            {fmtResult} <span style={{ fontSize: 14, fontWeight: 500, color: "#6b7280" }}>{mathData.resultUnit}</span>
          </div>
          {isBMI && bmiCat && (
            <div style={{ fontSize: 13, fontWeight: 600, color: bmiCat.color, marginTop: 4 }}>
              {bmiCat.label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CONVERTER WIDGET ──────────────────────────────────────────────
function ConverterWidget({ content }) {
  const isTemp   = /celsius|fahrenheit|temperature/i.test(content);
  const isDist   = /kilometer|kilometre|miles/i.test(content);
  const isWeight = /kilogram|pounds|kg/i.test(content);

  const cfg = isTemp ? {
    label: "Temperature", fromLabel: "°Celsius", toLabel: "°Fahrenheit",
    convert: (v) => (v * 9/5) + 32, min: -50, max: 150, step: 0.5, default: 25, icon: "🌡️",
  } : isDist ? {
    label: "Distance", fromLabel: "Kilometers", toLabel: "Miles",
    convert: (v) => v * 0.621371, min: 0, max: 1000, step: 1, default: 10, icon: "📏",
  } : isWeight ? {
    label: "Weight", fromLabel: "Kilograms", toLabel: "Pounds",
    convert: (v) => v * 2.20462, min: 0, max: 300, step: 0.5, default: 70, icon: "⚖️",
  } : {
    label: "Temperature", fromLabel: "°Celsius", toLabel: "°Fahrenheit",
    convert: (v) => (v * 9/5) + 32, min: -50, max: 150, step: 0.5, default: 25, icon: "🌡️",
  };

  const [val, setVal] = useState(cfg.default);
  const converted = +cfg.convert(val).toFixed(3);

  return (
    <div style={panelStyle}>
      <PanelHeader icon={cfg.icon} title={`${cfg.label} Converter`} />
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{cfg.fromLabel}</label>
          <span style={{
            fontSize: 13, fontWeight: 700, color: "#3b5bdb",
            background: "rgba(59,91,219,0.08)", borderRadius: 8, padding: "2px 10px",
          }}>{val}</span>
        </div>
        <input type="range" min={cfg.min} max={cfg.max} step={cfg.step} value={val}
          onChange={e => setVal(parseFloat(e.target.value))}
          style={{ width: "100%", accentColor: "#3b5bdb", cursor: "pointer", height: 20 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9ca3af" }}>
          <span>{cfg.min}</span><span>{cfg.max}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            flex: 1, textAlign: "center", padding: "10px",
            background: "rgba(59,91,219,0.05)", borderRadius: 12,
            fontSize: 15, fontWeight: 700, color: "#1a2240",
          }}>{val} {cfg.fromLabel}</div>
          <div style={{ fontSize: 20, color: "#3b5bdb" }}>→</div>
          <div style={{
            flex: 1, textAlign: "center", padding: "10px",
            background: "linear-gradient(135deg,rgba(91,127,255,0.10),rgba(59,91,219,0.14))",
            borderRadius: 12, fontSize: 15, fontWeight: 800, color: "#2c3fd6",
            border: "1px solid rgba(59,91,219,0.15)",
          }}>{converted} {cfg.toLabel}</div>
        </div>
      </div>
    </div>
  );
}

// ── STEPS WIDGET ──────────────────────────────────────────────────
function StepsWidget({ content }) {
  const [currentStep, setCurrentStep] = useState(0);

  const stepMatches = [...content.matchAll(/^\s*(\d+)[.)]\s+(.+)/gm)];
  if (stepMatches.length < 2) return null;
  const steps = stepMatches.map(m => m[2].trim()).slice(0, 8);
  const total = steps.length;

  return (
    <div style={panelStyle}>
      <PanelHeader icon="📋" title="Step-by-Step Guide" />
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 6, background: "rgba(59,91,219,0.10)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 99,
              background: "linear-gradient(90deg,#5b7fff,#3b5bdb)",
              width: `${((currentStep + 1) / total) * 100}%`,
              transition: "width 0.3s ease",
            }}/>
          </div>
          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, whiteSpace: "nowrap" }}>
            {currentStep + 1} / {total}
          </span>
        </div>
        <div style={{
          padding: "16px", borderRadius: 14,
          background: "linear-gradient(135deg,rgba(91,127,255,0.07),rgba(59,91,219,0.10))",
          border: "1px solid rgba(59,91,219,0.12)", minHeight: 60,
        }}>
          <div style={{ fontSize: 11, color: "#9bb0d8", fontWeight: 700, marginBottom: 6 }}>
            STEP {currentStep + 1}
          </div>
          <div style={{ fontSize: 14, color: "#1a2240", lineHeight: 1.6, fontWeight: 500 }}>
            {steps[currentStep]}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 13, fontWeight: 600,
              border: "none", cursor: currentStep === 0 ? "not-allowed" : "pointer",
              opacity: currentStep === 0 ? 0.4 : 1,
              background: "rgba(59,91,219,0.08)", color: "#3b5bdb",
            }}
          >← Previous</button>
          <button
            onClick={() => setCurrentStep(s => Math.min(total - 1, s + 1))}
            disabled={currentStep === total - 1}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 13, fontWeight: 600,
              border: "none", cursor: currentStep === total - 1 ? "not-allowed" : "pointer",
              opacity: currentStep === total - 1 ? 0.4 : 1,
              background: "linear-gradient(135deg,#5b7fff,#3b5bdb)", color: "white",
              boxShadow: currentStep < total - 1 ? "0 3px 12px rgba(59,91,219,0.22)" : "none",
            }}
          >Next →</button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {steps.map((_, i) => (
            <button key={i} onClick={() => setCurrentStep(i)} style={{
              width: 28, height: 28, borderRadius: "50%", fontSize: 12, fontWeight: 700,
              border: "none", cursor: "pointer",
              background: i === currentStep
                ? "linear-gradient(135deg,#5b7fff,#3b5bdb)"
                : i < currentStep ? "rgba(59,91,219,0.15)" : "rgba(59,91,219,0.06)",
              color: i === currentStep ? "white" : i < currentStep ? "#3b5bdb" : "#9ca3af",
            }}>{i + 1}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── COMPARE WIDGET ────────────────────────────────────────────────
function CompareWidget({ content }) {
  const [selected, setSelected] = useState(null);
  const vsMatch = content.match(/\b([\w\s]+?)\s+vs\.?\s+([\w\s]+)/i);
  if (!vsMatch) return null;
  const optA = vsMatch[1].trim().split(/\s+/).slice(-2).join(" ");
  const optB = vsMatch[2].trim().split(/\s+/).slice(0, 2).join(" ");

  return (
    <div style={panelStyle}>
      <PanelHeader icon="⚖️" title="Quick Comparison" />
      <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ fontSize: 13, color: "#5a6a88", margin: 0 }}>Which do you prefer?</p>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { key: "A", label: optA, color: "#2c3fd6", bg: "rgba(59,91,219,0.08)", border: "rgba(59,91,219,0.30)" },
            { key: "B", label: optB, color: "#065f46", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.30)" },
          ].map(({ key, label, color, bg, border }) => (
            <button key={key} onClick={() => setSelected(selected === key ? null : key)} style={{
              flex: 1, padding: "14px 8px", borderRadius: 14, fontWeight: 700, fontSize: 14,
              cursor: "pointer",
              border: `2px solid ${selected === key ? border : "rgba(59,91,219,0.10)"}`,
              background: selected === key ? bg : "rgba(255,255,255,0.7)",
              color: selected === key ? color : "#6b7280",
              transition: "all 0.18s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            }}>
              <span style={{ fontSize: 22 }}>{key === "A" ? "🅰" : "🅱"}</span>
              {label}
            </button>
          ))}
        </div>
        {selected && (
          <div style={{
            padding: "10px 14px", borderRadius: 12, fontSize: 13, fontWeight: 500,
            background: selected === "A" ? "rgba(59,91,219,0.07)" : "rgba(16,185,129,0.07)",
            border: `1px solid ${selected === "A" ? "rgba(59,91,219,0.20)" : "rgba(16,185,129,0.20)"}`,
            color: "#374151", animation: "fadeIn 0.25s ease both",
          }}>
            ✅ You chose <strong style={{ color: selected === "A" ? "#2c3fd6" : "#065f46" }}>
              {selected === "A" ? optA : optB}
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────
export default function InteractivePanel({ content }) {
  if (!content || content.length < 20) return null;
  if (/iframe|<embed|nchat\.ai/i.test(content)) return null;

  const type = detectType(content);
  if (!type) return null;

  if (type === "graph_trig")  return <TrigGraphWidget  content={content} />;
  if (type === "graph_math")  return <MathGraphWidget  content={content} />;
  if (type === "quiz")        return <QuizWidget        content={content} />;
  if (type === "math")        return <MathWidget        content={content} />;
  if (type === "convert")     return <ConverterWidget   content={content} />;
  if (type === "steps")       return <StepsWidget       content={content} />;
  if (type === "compare")     return <CompareWidget     content={content} />;

  return null;
}
