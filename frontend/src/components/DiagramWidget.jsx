import { useState, useEffect, useRef } from "react";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ── SVG Templates ─────────────────────────────────────────────────
// Each template is a React component that accepts metadata and
// onRegionClick/onRegionHover props

const TEMPLATES = {

  india_map: ({ metadata, onHover, onSelect, selected, hovered }) => {
    // Simplified India map with major states as paths
    // Using approximate SVG paths for major regions
    const regions = [
      { id: "jammu_kashmir",  label: "J&K / Ladakh",   d: "M200,40 L260,35 L280,60 L260,80 L220,85 L195,65 Z",       cx: 235, cy: 60  },
      { id: "himachal",       label: "Himachal Pradesh", d: "M260,60 L300,55 L315,80 L295,95 L265,90 L255,75 Z",     cx: 285, cy: 75  },
      { id: "punjab",         label: "Punjab & Haryana", d: "M240,85 L280,80 L290,110 L265,120 L240,115 Z",          cx: 265, cy: 100 },
      { id: "rajasthan",      label: "Rajasthan",        d: "M195,115 L265,115 L270,190 L230,220 L190,200 L175,160 Z",cx: 225, cy: 165 },
      { id: "uttar_pradesh",  label: "Uttar Pradesh",    d: "M280,110 L355,105 L375,150 L340,170 L275,165 L265,135 Z",cx: 320, cy: 140 },
      { id: "bihar",          label: "Bihar",            d: "M355,130 L405,125 L415,160 L385,175 L355,165 Z",        cx: 385, cy: 150 },
      { id: "west_bengal",    label: "West Bengal",      d: "M405,135 L435,130 L445,190 L420,210 L400,185 L395,160 Z",cx: 420, cy: 170 },
      { id: "assam",          label: "Assam & NE",       d: "M435,120 L500,115 L515,155 L470,165 L440,150 Z",        cx: 475, cy: 140 },
      { id: "gujarat",        label: "Gujarat",          d: "M170,185 L220,180 L230,230 L215,265 L180,255 L160,225 Z",cx: 195, cy: 225 },
      { id: "madhya_pradesh", label: "Madhya Pradesh",   d: "M230,175 L340,170 L355,220 L320,250 L255,255 L225,230 Z",cx: 290, cy: 215 },
      { id: "chhattisgarh",   label: "Chhattisgarh",     d: "M340,175 L395,170 L405,225 L375,245 L340,235 Z",       cx: 370, cy: 210 },
      { id: "odisha",         label: "Odisha",           d: "M390,185 L430,180 L440,235 L415,255 L385,245 Z",        cx: 412, cy: 220 },
      { id: "maharashtra",    label: "Maharashtra",      d: "M215,255 L320,250 L335,305 L295,340 L240,335 L210,300 Z",cx: 272, cy: 295 },
      { id: "telangana",      label: "Telangana",        d: "M320,255 L375,250 L380,300 L345,315 L315,305 Z",        cx: 347, cy: 285 },
      { id: "andhra",         label: "Andhra Pradesh",   d: "M335,305 L395,295 L405,355 L370,375 L330,360 Z",        cx: 367, cy: 335 },
      { id: "karnataka",      label: "Karnataka",        d: "M255,335 L340,330 L355,390 L320,420 L270,415 L245,380 Z",cx: 300, cy: 375 },
      { id: "kerala",         label: "Kerala",           d: "M260,415 L295,410 L300,470 L275,490 L255,465 Z",        cx: 278, cy: 450 },
      { id: "tamil_nadu",     label: "Tamil Nadu",       d: "M295,390 L360,385 L365,455 L330,490 L295,470 Z",        cx: 330, cy: 435 },
    ];

    const getColor = (id) => {
      if (id === selected) return "#2c3fd6";
      if (id === hovered)  return "#5b7fff";
      const region = metadata?.regions?.find(r => r.id === id);
      return region?.color || "#93a8f0";
    };

    return (
      <svg viewBox="0 0 560 530" style={{ width:"100%", maxHeight:420 }}
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.2"/>
          </filter>
        </defs>
        {/* Ocean background */}
        <rect width="560" height="530" fill="#dbeafe" rx="12"/>
        {/* Sri Lanka */}
        <ellipse cx="355" cy="495" rx="12" ry="18" fill="#c4d9f0" stroke="white" strokeWidth="0.5"/>
        {/* States */}
        {regions.map(r => (
          <g key={r.id}
            onMouseEnter={() => onHover(r.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(r.id)}
            style={{ cursor: "pointer" }}>
            <path d={r.d} fill={getColor(r.id)}
              stroke="white" strokeWidth="1.5"
              filter="url(#shadow)"
              style={{ transition: "fill 0.2s" }}
            />
            <text x={r.cx} y={r.cy} textAnchor="middle" fontSize="7"
              fill="white" fontWeight="600" pointerEvents="none"
              style={{ userSelect: "none" }}>
              {r.label.split(" ").map((word, i) => (
                <tspan key={i} x={r.cx} dy={i===0 ? 0 : 9}>{word}</tspan>
              ))}
            </text>
          </g>
        ))}
        {/* Title */}
        <text x="280" y="520" textAnchor="middle" fontSize="11"
          fill="#374151" fontWeight="700">India — Click a state to learn more</text>
      </svg>
    );
  },

  heart: ({ metadata, onHover, onSelect, selected, hovered }) => {
    const parts = [
      { id: "right_atrium",    label: "Right Atrium",    cx: 200, cy: 180, rx: 60, ry: 45, color: "#ef4444" },
      { id: "left_atrium",     label: "Left Atrium",     cx: 330, cy: 175, rx: 60, ry: 45, color: "#dc2626" },
      { id: "right_ventricle", label: "Right Ventricle", cx: 210, cy: 290, rx: 70, ry: 75, color: "#f87171" },
      { id: "left_ventricle",  label: "Left Ventricle",  cx: 330, cy: 285, rx: 70, ry: 80, color: "#b91c1c" },
      { id: "aorta",           label: "Aorta",           cx: 290, cy: 80,  rx: 25, ry: 40, color: "#dc2626" },
      { id: "pulmonary",       label: "Pulmonary Artery", cx: 230, cy: 95, rx: 20, ry: 35, color: "#60a5fa" },
      { id: "vena_cava",       label: "Vena Cava",       cx: 180, cy: 120, rx: 18, ry: 45, color: "#3b82f6" },
      { id: "septum",          label: "Septum",          cx: 270, cy: 250, rx: 10, ry: 80, color: "#7c3aed" },
    ];

    return (
      <svg viewBox="0 0 500 420" style={{ width:"100%", maxHeight:380 }}>
        <rect width="500" height="420" fill="#fef2f2" rx="12"/>
        {/* Pericardium outline */}
        <ellipse cx="265" cy="250" rx="160" ry="190" fill="#fde8e8"
          stroke="#fca5a5" strokeWidth="2" strokeDasharray="6,4"/>
        {parts.map(p => (
          <g key={p.id}
            onMouseEnter={() => onHover(p.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(p.id)}
            style={{ cursor:"pointer" }}>
            <ellipse cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry}
              fill={p.id===selected ? "#1e40af" : p.id===hovered ? "#3b82f6" : p.color}
              stroke="white" strokeWidth="2" opacity="0.9"
              style={{ transition:"fill 0.2s" }}/>
            <text x={p.cx} y={p.cy} textAnchor="middle" fontSize="9"
              fill="white" fontWeight="600" pointerEvents="none" dominantBaseline="middle">
              {p.label.split(" ").map((w,i) => (
                <tspan key={i} x={p.cx} dy={i===0 ? 0 : 11}>{w}</tspan>
              ))}
            </text>
          </g>
        ))}
        <text x="250" y="410" textAnchor="middle" fontSize="11"
          fill="#374151" fontWeight="700">Human Heart — Click a part to learn more</text>
      </svg>
    );
  },

  atom: ({ metadata, onHover, onSelect, selected, hovered }) => {
    const shells = [
      { id:"nucleus",   label:"Nucleus",    r:35,  orbitR:0,   color:"#f59e0b", angle:0 },
      { id:"shell_1",   label:"1st Shell",  r:10,  orbitR:80,  color:"#3b5bdb", angle:0 },
      { id:"shell_2",   label:"2nd Shell",  r:10,  orbitR:130, color:"#22c55e", angle:60 },
      { id:"shell_3",   label:"3rd Shell",  r:10,  orbitR:180, color:"#ef4444", angle:120 },
    ];
    const cx = 250, cy = 220;

    return (
      <svg viewBox="0 0 500 440" style={{ width:"100%", maxHeight:380 }}>
        <rect width="500" height="440" fill="#0f172a" rx="12"/>
        {/* Orbit rings */}
        {[80,130,180].map((r,i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r*0.38}
            fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
        ))}
        {/* Vertical orbit */}
        {[80,130,180].map((r,i) => (
          <ellipse key={`v${i}`} cx={cx} cy={cy} rx={r*0.38} ry={r}
            fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
        ))}
        {/* Nucleus */}
        <g onClick={() => onSelect("nucleus")}
          onMouseEnter={() => onHover("nucleus")}
          onMouseLeave={() => onHover(null)}
          style={{ cursor:"pointer" }}>
          <circle cx={cx} cy={cy} r={35}
            fill={"nucleus"===selected?"#2c3fd6":"nucleus"===hovered?"#5b7fff":"#f59e0b"}
            style={{ transition:"fill 0.2s" }}/>
          <text x={cx} y={cy} textAnchor="middle" fontSize="9"
            fill="white" fontWeight="700" dominantBaseline="middle">Nucleus</text>
          <text x={cx} y={cy+13} textAnchor="middle" fontSize="7"
            fill="rgba(255,255,255,0.8)">(p⁺ + n⁰)</text>
        </g>
        {/* Electrons on shells */}
        {[
          {r:80,  positions:[{x:cx+80, y:cy},{x:cx-80, y:cy}], label:"e⁻ (2)", id:"shell_1", color:"#3b5bdb"},
          {r:130, positions:[{x:cx+130,y:cy},{x:cx-130,y:cy},{x:cx,y:cy-130},{x:cx,y:cy+130}],label:"e⁻ (8)",id:"shell_2",color:"#22c55e"},
          {r:180, positions:[{x:cx+180,y:cy},{x:cx-180,y:cy}],label:"e⁻",id:"shell_3",color:"#ef4444"},
        ].map(shell => (
          <g key={shell.id}
            onMouseEnter={() => onHover(shell.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(shell.id)}
            style={{ cursor:"pointer" }}>
            {shell.positions.map((pos,i) => (
              <circle key={i} cx={pos.x} cy={pos.y} r={10}
                fill={shell.id===selected?"#2c3fd6":shell.id===hovered?"#5b7fff":shell.color}
                stroke="white" strokeWidth="1.5"
                style={{ transition:"fill 0.2s" }}/>
            ))}
          </g>
        ))}
        {/* Labels */}
        <text x="380" y="140" fontSize="9" fill="#93c5fd">1st Shell (K)</text>
        <text x="390" y="100" fontSize="9" fill="#86efac">2nd Shell (L)</text>
        <text x="400" y="70"  fontSize="9" fill="#fca5a5">3rd Shell (M)</text>
        <text x="250" y="430" textAnchor="middle" fontSize="11"
          fill="#e2e8f0" fontWeight="700">Atomic Structure — Click a part to learn more</text>
      </svg>
    );
  },

  solar_system: ({ metadata, onHover, onSelect, selected, hovered }) => {
    const planets = [
      { id:"sun",     label:"Sun",     r:40, orbitR:0,   color:"#fbbf24", cx:250, cy:220 },
      { id:"mercury", label:"Mercury", r:8,  orbitR:70,  color:"#9ca3af", angle:30  },
      { id:"venus",   label:"Venus",   r:11, orbitR:105, color:"#fde68a", angle:80  },
      { id:"earth",   label:"Earth",   r:12, orbitR:145, color:"#3b82f6", angle:150 },
      { id:"mars",    label:"Mars",    r:9,  orbitR:185, color:"#ef4444", angle:220 },
      { id:"jupiter", label:"Jupiter", r:22, orbitR:250, color:"#d97706", angle:280 },
      { id:"saturn",  label:"Saturn",  r:18, orbitR:310, color:"#f59e0b", angle:320 },
    ];
    const cx = 250, cy = 220;

    return (
      <svg viewBox="0 0 500 440" style={{ width:"100%", maxHeight:380 }}>
        <rect width="500" height="440" fill="#030712" rx="12"/>
        {/* Stars */}
        {[...Array(40)].map((_,i) => (
          <circle key={i} cx={Math.sin(i*137.5)*230+250} cy={Math.cos(i*137.5)*210+220}
            r={Math.random()*1.5+0.3} fill="white" opacity={0.4+Math.random()*0.6}/>
        ))}
        {/* Orbits */}
        {planets.filter(p => p.orbitR > 0).map(p => (
          <circle key={`o-${p.id}`} cx={cx} cy={cy} r={p.orbitR}
            fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        ))}
        {/* Sun */}
        <g onClick={() => onSelect("sun")} onMouseEnter={() => onHover("sun")} onMouseLeave={() => onHover(null)} style={{ cursor:"pointer" }}>
          <circle cx={cx} cy={cy} r={40}
            fill={"sun"===selected?"#2c3fd6":"sun"===hovered?"#5b7fff":"#fbbf24"}
            filter="url(#glow)"/>
          <text x={cx} y={cy} textAnchor="middle" fontSize="9" fill="#1c1917"
            fontWeight="700" dominantBaseline="middle">Sun</text>
        </g>
        {/* Planets */}
        {planets.filter(p => p.orbitR > 0).map(p => {
          const rad = (p.angle * Math.PI) / 180;
          const px  = cx + p.orbitR * Math.cos(rad);
          const py  = cy + p.orbitR * Math.sin(rad);
          return (
            <g key={p.id}
              onClick={() => onSelect(p.id)}
              onMouseEnter={() => onHover(p.id)}
              onMouseLeave={() => onHover(null)}
              style={{ cursor:"pointer" }}>
              {/* Saturn rings */}
              {p.id==="saturn" && (
                <ellipse cx={px} cy={py} rx={p.r*2.2} ry={p.r*0.5}
                  fill="none" stroke="#f59e0b" strokeWidth="3" opacity="0.5"/>
              )}
              <circle cx={px} cy={py} r={p.r}
                fill={p.id===selected?"#2c3fd6":p.id===hovered?"#5b7fff":p.color}
                stroke="rgba(255,255,255,0.3)" strokeWidth="1"
                style={{ transition:"fill 0.2s" }}/>
              <text x={px} y={py+p.r+11} textAnchor="middle" fontSize="7.5"
                fill="#e2e8f0" fontWeight="600">{p.label}</text>
            </g>
          );
        })}
        <text x="250" y="432" textAnchor="middle" fontSize="10"
          fill="#94a3b8" fontWeight="700">Solar System — Click a planet to learn more</text>
      </svg>
    );
  },

  water_cycle: ({ metadata, onHover, onSelect, selected, hovered }) => {
    const stages = [
      { id:"evaporation",   label:"Evaporation",   x:80,  y:280, w:120, h:50, color:"#60a5fa" },
      { id:"condensation",  label:"Condensation",  x:250, y:100, w:130, h:50, color:"#818cf8" },
      { id:"precipitation", label:"Precipitation", x:430, y:180, w:120, h:50, color:"#34d399" },
      { id:"runoff",        label:"Surface Runoff", x:370, y:300, w:120, h:50, color:"#22c55e" },
      { id:"infiltration",  label:"Infiltration",  x:200, y:360, w:120, h:50, color:"#a78bfa" },
      { id:"transpiration", label:"Transpiration", x:80,  y:180, w:120, h:50, color:"#4ade80" },
    ];

    return (
      <svg viewBox="0 0 600 440" style={{ width:"100%", maxHeight:380 }}>
        {/* Sky gradient */}
        <defs>
          <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#bfdbfe"/>
            <stop offset="70%" stopColor="#eff6ff"/>
            <stop offset="100%" stopColor="#86efac"/>
          </linearGradient>
          <linearGradient id="water" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6"/>
            <stop offset="100%" stopColor="#1d4ed8"/>
          </linearGradient>
        </defs>
        <rect width="600" height="440" fill="url(#sky)" rx="12"/>
        {/* Ground */}
        <path d="M0,380 Q150,360 300,370 Q450,380 600,370 L600,440 L0,440 Z" fill="#86efac"/>
        {/* Water body */}
        <path d="M0,340 Q100,320 180,330 L180,420 L0,420 Z" fill="url(#water)" opacity="0.8"/>
        {/* Sun */}
        <circle cx="540" cy="60" r="35" fill="#fbbf24" opacity="0.9"/>
        {/* Arrows */}
        <path d="M140,280 Q160,200 200,150 Q230,115 250,120" fill="none"
          stroke="#60a5fa" strokeWidth="2.5" strokeDasharray="8,4" markerEnd="url(#arr)"/>
        <path d="M315,100 Q370,90 410,130 Q440,160 445,175" fill="none"
          stroke="#818cf8" strokeWidth="2.5" strokeDasharray="8,4"/>
        <path d="M445,235 Q450,260 430,295 Q410,320 390,305" fill="none"
          stroke="#34d399" strokeWidth="2.5" strokeDasharray="8,4"/>
        <path d="M370,355 Q320,365 285,360 Q250,355 240,360" fill="none"
          stroke="#22c55e" strokeWidth="2.5" strokeDasharray="8,4"/>
        {/* Stage boxes */}
        {stages.map(s => (
          <g key={s.id}
            onClick={() => onSelect(s.id)}
            onMouseEnter={() => onHover(s.id)}
            onMouseLeave={() => onHover(null)}
            style={{ cursor:"pointer" }}>
            <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="10"
              fill={s.id===selected?"#2c3fd6":s.id===hovered?"#5b7fff":s.color}
              opacity="0.9" style={{ transition:"fill 0.2s" }}/>
            <text x={s.x+s.w/2} y={s.y+s.h/2} textAnchor="middle"
              fontSize="9" fill="white" fontWeight="700" dominantBaseline="middle">
              {s.label}
            </text>
          </g>
        ))}
        <text x="300" y="430" textAnchor="middle" fontSize="10"
          fill="#374151" fontWeight="700">Water Cycle — Click a stage to learn more</text>
      </svg>
    );
  },

  cell: ({ metadata, onHover, onSelect, selected, hovered }) => {
    const organelles = [
      { id:"nucleus",        label:"Nucleus",        cx:250, cy:200, rx:55, ry:48, color:"#7c3aed" },
      { id:"mitochondria",   label:"Mitochondria",   cx:370, cy:150, rx:40, ry:22, color:"#dc2626", angle:-25 },
      { id:"er_rough",       label:"Rough ER",       cx:150, cy:160, rx:42, ry:20, color:"#2563eb", angle:20  },
      { id:"er_smooth",      label:"Smooth ER",      cx:130, cy:240, rx:38, ry:18, color:"#0891b2", angle:-15 },
      { id:"golgi",          label:"Golgi Body",     cx:360, cy:270, rx:45, ry:22, color:"#d97706", angle:10  },
      { id:"ribosome",       label:"Ribosomes",      cx:200, cy:290, rx:18, ry:12, color:"#7c3aed" },
      { id:"lysosome",       label:"Lysosome",       cx:310, cy:330, rx:18, ry:16, color:"#ef4444" },
      { id:"vacuole",        label:"Vacuole",        cx:420, cy:320, rx:32, ry:30, color:"#0284c7" },
      { id:"centriole",      label:"Centriole",      cx:170, cy:330, rx:15, ry:22, color:"#059669" },
    ];

    return (
      <svg viewBox="0 0 550 420" style={{ width:"100%", maxHeight:380 }}>
        <defs>
          <radialGradient id="cellbg" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#fef9c3"/>
            <stop offset="100%" stopColor="#fde68a"/>
          </radialGradient>
        </defs>
        <rect width="550" height="420" fill="#ecfdf5" rx="12"/>
        {/* Cell membrane */}
        <ellipse cx="265" cy="215" rx="235" ry="185"
          fill="url(#cellbg)" stroke="#d97706" strokeWidth="3"/>
        {/* Cytoplasm label */}
        <text x="70" y="380" fontSize="9" fill="#92400e">Cytoplasm</text>
        {/* Organelles */}
        {organelles.map(o => (
          <g key={o.id}
            onClick={() => onSelect(o.id)}
            onMouseEnter={() => onHover(o.id)}
            onMouseLeave={() => onHover(null)}
            transform={o.angle ? `rotate(${o.angle},${o.cx},${o.cy})` : ""}
            style={{ cursor:"pointer" }}>
            <ellipse cx={o.cx} cy={o.cy} rx={o.rx} ry={o.ry}
              fill={o.id===selected?"#1d4ed8":o.id===hovered?"#3b82f6":o.color}
              stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" opacity="0.88"
              style={{ transition:"fill 0.2s" }}/>
            <text x={o.cx} y={o.cy} textAnchor="middle" fontSize="8"
              fill="white" fontWeight="700" dominantBaseline="middle"
              transform={o.angle ? `rotate(${-o.angle},${o.cx},${o.cy})` : ""}>
              {o.label.split(" ").map((w,i) => (
                <tspan key={i} x={o.cx} dy={i===0?0:10}>{w}</tspan>
              ))}
            </text>
          </g>
        ))}
        <text x="275" y="412" textAnchor="middle" fontSize="10"
          fill="#374151" fontWeight="700">Animal Cell — Click an organelle to learn more</text>
      </svg>
    );
  },
};

// ── Info panel shown when a region is clicked ─────────────────────
function InfoPanel({ regionId, metadata, onClose }) {
  if (!regionId || !metadata) return null;

  const region = metadata.regions?.find(r => r.id === regionId);
  if (!region) {
    // Region exists in SVG but not in AI metadata — show placeholder
    return (
      <div style={{
        marginTop: 12, padding: "14px 16px", borderRadius: 14,
        background: "rgba(59,91,219,0.06)", border: "1px solid rgba(59,91,219,0.15)",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontWeight:700, color:"#2c3fd6", fontSize:14 }}>
            {regionId.replace(/_/g," ").replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          <button onClick={onClose} style={{
            background:"none", border:"none", cursor:"pointer",
            color:"#9ca3af", fontSize:18, lineHeight:1,
          }}>×</button>
        </div>
        <p style={{ fontSize:13, color:"#5a6a88", margin:"8px 0 0" }}>
          Loading information...
        </p>
      </div>
    );
  }

  return (
    <div style={{
      marginTop: 12, padding: "14px 16px", borderRadius: 14,
      background: "rgba(59,91,219,0.05)", border: "1px solid rgba(59,91,219,0.15)",
      animation: "fadeIn 0.2s ease",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <span style={{ fontWeight:700, color:"#2c3fd6", fontSize:15 }}>{region.label}</span>
        </div>
        <button onClick={onClose} style={{
          background:"none", border:"none", cursor:"pointer",
          color:"#9ca3af", fontSize:18, lineHeight:1, marginLeft:8, flexShrink:0,
        }}>×</button>
      </div>

      {region.description && (
        <p style={{ fontSize:13, color:"#374151", margin:"8px 0 0", lineHeight:1.6 }}>
          {region.description}
        </p>
      )}

      {region.facts && region.facts.length > 0 && (
        <div style={{ marginTop:10 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#9bb0d8",
            textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>
            Key Facts
          </div>
          <ul style={{ margin:0, paddingLeft:16, display:"flex", flexDirection:"column", gap:4 }}>
            {region.facts.map((fact, i) => (
              <li key={i} style={{ fontSize:12, color:"#374151", lineHeight:1.5 }}>{fact}</li>
            ))}
          </ul>
        </div>
      )}

      {region.importance && (
        <div style={{
          marginTop:10, padding:"8px 12px", borderRadius:10, fontSize:12,
          background:"rgba(59,91,219,0.08)", color:"#2c3fd6", fontWeight:500,
        }}>
          💡 {region.importance}
        </div>
      )}
    </div>
  );
}

// ── Custom SVG renderer (for AI-generated SVGs) ───────────────────
function CustomSVGDiagram({ svgCode, metadata, onHover, onSelect, selected, hovered }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !svgCode) return;
    containerRef.current.innerHTML = svgCode;
    const svg = containerRef.current.querySelector("svg");
    if (!svg) return;

    svg.style.width  = "100%";
    svg.style.maxHeight = "380px";

    // Attach interactions to elements with data-id
    const interactiveEls = svg.querySelectorAll("[data-id]");
    interactiveEls.forEach(el => {
      const id = el.getAttribute("data-id");
      el.style.cursor = "pointer";
      el.style.transition = "opacity 0.2s";
      el.addEventListener("mouseenter", () => {
        onHover(id);
        el.style.opacity = "0.8";
      });
      el.addEventListener("mouseleave", () => {
        onHover(null);
        el.style.opacity = "1";
      });
      el.addEventListener("click", () => onSelect(id));
    });

    return () => {
      interactiveEls.forEach(el => {
        el.replaceWith(el.cloneNode(true));
      });
    };
  }, [svgCode]);

  return <div ref={containerRef} style={{ width:"100%" }}/>;
}

// ── Main DiagramWidget component ──────────────────────────────────
export default function DiagramWidget({ message, diagramType: initialType }) {
  const [state, setState] = useState({
    loading:    true,
    error:      null,
    type:       null,       // "template" | "custom"
    diagramType: null,
    svg:        null,
    metadata:   null,
  });
  const [hovered,  setHovered]  = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!message && !initialType) return;
    fetchDiagram();
  }, [message, initialType]);

  const fetchDiagram = async () => {
    setState(s => ({ ...s, loading:true, error:null }));
    try {
      const res = await fetch(`${API}/diagram`, {
        method:  "POST",
        headers: { "Content-Type":"application/json" },
        body:    JSON.stringify({ message, diagram_type: initialType }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setState({ loading:false, error:null, ...data });
    } catch (err) {
      setState(s => ({ ...s, loading:false, error: err.message }));
    }
  };

  const handleSelect = (id) => {
    setSelected(prev => prev === id ? null : id);
  };

  if (state.loading) {
    return (
      <div style={{
        borderRadius:16, border:"1px solid rgba(59,91,219,0.14)",
        background:"rgba(255,255,255,0.97)",
        boxShadow:"0 4px 24px rgba(59,91,219,0.09)",
        overflow:"hidden", width:"100%", marginTop:6,
      }}>
        <div style={{
          display:"flex", alignItems:"center", gap:8, padding:"11px 18px",
          background:"linear-gradient(135deg,rgba(91,127,255,0.07),rgba(59,91,219,0.11))",
          borderBottom:"1px solid rgba(59,91,219,0.10)",
        }}>
          <span style={{ fontSize:16 }}>🗺️</span>
          <span style={{ fontSize:13, fontWeight:700, color:"#2c3fd6" }}>Generating Diagram...</span>
        </div>
        <div style={{ padding:"32px 18px", display:"flex", justifyContent:"center" }}>
          <div style={{
            width:36, height:36, borderRadius:"50%",
            border:"3px solid rgba(59,91,219,0.15)",
            borderTop:"3px solid #3b5bdb",
            animation:"spin 0.7s linear infinite",
          }}/>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div style={{
        borderRadius:16, border:"1px solid rgba(239,68,68,0.20)",
        background:"rgba(255,255,255,0.97)", padding:"16px 18px", width:"100%", marginTop:6,
      }}>
        <span style={{ color:"#ef4444", fontSize:13 }}>⚠️ Could not generate diagram: {state.error}</span>
      </div>
    );
  }

  const title    = state.metadata?.title || (state.diagramType || "").replace(/_/g," ").replace(/\b\w/g, l => l.toUpperCase());
  const Template = TEMPLATES[state.diagramType];

  return (
    <div style={{
      borderRadius:16, border:"1px solid rgba(59,91,219,0.14)",
      background:"rgba(255,255,255,0.97)",
      boxShadow:"0 4px 24px rgba(59,91,219,0.09)",
      overflow:"hidden", width:"100%", marginTop:6,
    }}>
      {/* Header */}
      <div style={{
        display:"flex", alignItems:"center", gap:8, padding:"11px 18px",
        background:"linear-gradient(135deg,rgba(91,127,255,0.07),rgba(59,91,219,0.11))",
        borderBottom:"1px solid rgba(59,91,219,0.10)",
      }}>
        <span style={{ fontSize:16 }}>🗺️</span>
        <span style={{ fontSize:13, fontWeight:700, color:"#2c3fd6" }}>{title}</span>
        <div style={{
          marginLeft:"auto", fontSize:10, fontWeight:600, color:"#9bb0d8",
          background:"rgba(59,91,219,0.07)", borderRadius:99, padding:"2px 8px",
        }}>interactive diagram</div>
      </div>

      <div style={{ padding:"14px 18px" }}>
        {/* Description */}
        {state.metadata?.description && (
          <p style={{ fontSize:13, color:"#5a6a88", margin:"0 0 12px", lineHeight:1.6 }}>
            {state.metadata.description}
          </p>
        )}

        {/* SVG diagram */}
        {Template ? (
          <Template
            metadata={state.metadata}
            onHover={setHovered}
            onSelect={handleSelect}
            selected={selected}
            hovered={hovered}
          />
        ) : state.svg ? (
          <CustomSVGDiagram
            svgCode={state.svg}
            metadata={state.metadata}
            onHover={setHovered}
            onSelect={handleSelect}
            selected={selected}
            hovered={hovered}
          />
        ) : (
          <div style={{ padding:"20px", textAlign:"center", color:"#9ca3af", fontSize:13 }}>
            No diagram available for this topic yet.
          </div>
        )}

        {/* Hover tooltip */}
        {hovered && !selected && (
          <div style={{
            marginTop:10, padding:"8px 14px", borderRadius:10,
            background:"rgba(59,91,219,0.08)", fontSize:12, color:"#2c3fd6", fontWeight:600,
          }}>
            👆 Click to learn more about: {hovered.replace(/_/g," ").replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        )}

        {/* Selected region info panel */}
        <InfoPanel
          regionId={selected}
          metadata={state.metadata}
          onClose={() => setSelected(null)}
        />

        {/* Region chips (quick navigation) */}
        {state.metadata?.regions && state.metadata.regions.length > 0 && (
          <div style={{ marginTop:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#9bb0d8",
              textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>
              Explore Regions
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {state.metadata.regions.map(r => (
                <button key={r.id}
                  onClick={() => handleSelect(r.id)}
                  style={{
                    padding:"5px 12px", borderRadius:20, fontSize:11, fontWeight:600,
                    border:`1.5px solid ${selected===r.id?"rgba(59,91,219,0.5)":"rgba(59,91,219,0.15)"}`,
                    background: selected===r.id ? "rgba(59,91,219,0.12)" : "rgba(59,91,219,0.04)",
                    color: selected===r.id ? "#2c3fd6" : "#5a6a88",
                    cursor:"pointer", transition:"all 0.15s",
                  }}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}