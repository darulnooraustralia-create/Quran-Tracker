import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdriAdMX7C763wro60zYFGfXfXQE27q-g",
  authDomain: "darul-noor-education-hub.firebaseapp.com",
  projectId: "darul-noor-education-hub",
  storageBucket: "darul-noor-education-hub.firebasestorage.app",
  messagingSenderId: "706880553337",
  appId: "1:706880553337:web:5fb2eee4d75f2c7cab2fa8"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Monday","Tuesday","Wednesday","Thursday"];
const YEARS = [2026,2027,2028];

const EMPTY_WEEKS = () => [1,2,3,4].map(w => ({
  week: w,
  days: DAYS.map(d => ({ day: d, sabq: "", manzil: "", notes: "" })),
  teacherFeedback: ""
}));

const EMPTY_PROGRESS = () => {
  const r = {};
  YEARS.forEach(y => { r[y] = {}; MONTHS.forEach(m => { r[y][m] = EMPTY_WEEKS(); }); });
  return r;
};

const EMPTY_PAYMENTS = () => {
  const r = {};
  YEARS.forEach(y => { r[y] = {}; MONTHS.forEach(m => { r[y][m] = { paid: null, comment: "" }; }); });
  return r;
};

const makeStudent = (id, name) => ({
  id, name, grade: "", teacher: "", progress: 0,
  summary: { strengths: "", improve: "" },
  quranProgress: EMPTY_PROGRESS(),
  payments: EMPTY_PAYMENTS(),
});

const STUDENTS = [
  makeStudent(1,"Asiya Islam"), makeStudent(2,"Aafiyah Zainab"),
  makeStudent(3,"Hafsa Nawed"), makeStudent(4,"Husna Nawed"),
  makeStudent(5,"Aowaab Yousuf"), makeStudent(6,"Hajera Hamda Fatima"),
  makeStudent(7,"Anaya Kamal"), makeStudent(8,"Hamza Sazzad"),
  makeStudent(9,"Maryam Bint Rabi"), makeStudent(10,"Eesa Zohaib"),
  makeStudent(11,"Yusra Sheikh"), makeStudent(12,"Ibraheem Munsi"),
  makeStudent(13,"Maryam Munsi"), makeStudent(14,"Yusuf Bin Ali"),
  makeStudent(15,"Aisha Khanam"), makeStudent(16,"Mohammed Ibrahim Faizan"),
  makeStudent(17,"Mohammed Idrees"), makeStudent(18,"Munazza Fatima"),
  makeStudent(19,"Manha Fatima"), makeStudent(20,"Azwar Rahman"),
  makeStudent(21,"Owais Abdul Aziz"), makeStudent(22,"Uzair Abdul Aziz"),
  makeStudent(23,"Halima Abdusamed Hassan"), makeStudent(24,"Abubakr Siddik"),
  makeStudent(25,"Abuobaida Siddik"), makeStudent(26,"Abuhuraira Siddik"),
  makeStudent(27,"Abrar Farzad"), makeStudent(28,"Ali Faraz"),
];

const ACCOUNTS = [
  { login:"admin@darulnoor", password:"darulnoor", role:"admin", studentIds:STUDENTS.map(s=>s.id) },
  { login:"asiya.i@darulnoor", password:"islam123", role:"parent", studentIds:[1] },
  { login:"aafiyah.z@darulnoor", password:"zainab123", role:"parent", studentIds:[2] },
  { login:"family.nawed@darulnoor", password:"nawed123", role:"parent", studentIds:[3,4] },
  { login:"aowaab.y@darulnoor", password:"yousuf123", role:"parent", studentIds:[5] },
  { login:"hajera.h@darulnoor", password:"hamda123", role:"parent", studentIds:[6] },
  { login:"anaya.k@darulnoor", password:"kamal123", role:"parent", studentIds:[7] },
  { login:"hamza.s@darulnoor", password:"sazzad123", role:"parent", studentIds:[8] },
  { login:"maryam.b@darulnoor", password:"rabi123", role:"parent", studentIds:[9] },
  { login:"eesa.z@darulnoor", password:"zohaib123", role:"parent", studentIds:[10] },
  { login:"yusra.s@darulnoor", password:"sheikh123", role:"parent", studentIds:[11] },
  { login:"family.munsi@darulnoor", password:"munsi123", role:"parent", studentIds:[12,13] },
  { login:"yusuf.aisha@darulnoor", password:"family123", role:"parent", studentIds:[14,15] },
  { login:"muhammad.fatima@darulnoor", password:"family123", role:"parent", studentIds:[16,17,18,19] },
  { login:"azwar.r@darulnoor", password:"rahman123", role:"parent", studentIds:[20] },
  { login:"family.abdulaziz@darulnoor", password:"abdulaziz123", role:"parent", studentIds:[21,22] },
  { login:"halima.a@darulnoor", password:"hassan123", role:"parent", studentIds:[23] },
  { login:"family.siddik@darulnoor", password:"siddik123", role:"parent", studentIds:[24,25,26] },
  { login:"abrar.f@darulnoor", password:"farzad123", role:"parent", studentIds:[27] },
  { login:"ali.f@darulnoor", password:"faraz123", role:"parent", studentIds:[28] },
];

const FAMILY_GROUPS = [
  { label:"Nawed Family", ids:[3,4] },
  { label:"Munsi Family", ids:[12,13] },
  { label:"Yusuf & Aisha Family", ids:[14,15] },
  { label:"Muhammad & Fatima Family", ids:[16,17,18,19] },
  { label:"Abdul Aziz Family", ids:[21,22] },
  { label:"Siddik Family", ids:[24,25,26] },
];

const inp = {
  base: { width:"100%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(200,169,110,0.3)", borderRadius:8, padding:"10px 12px", color:"#e8dcc8", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" },
  small: { background:"rgba(255,255,255,0.08)", border:"1px solid rgba(200,169,110,0.2)", borderRadius:6, padding:"6px 10px", color:"#e8dcc8", fontSize:13, outline:"none", fontFamily:"inherit" }
};

const btn = {
  primary: { background:"linear-gradient(135deg,#2d6a2d,#1a4a1a)", border:"1px solid rgba(200,169,110,0.4)", borderRadius:8, padding:"10px 20px", color:"#c8a96e", fontSize:13, fontWeight:"bold", cursor:"pointer", fontFamily:"inherit", letterSpacing:1 },
  ghost: { background:"none", border:"1px solid rgba(200,169,110,0.25)", borderRadius:8, padding:"8px 16px", color:"#c8a96e", fontSize:12, cursor:"pointer", fontFamily:"inherit" },
  danger: { background:"none", border:"1px solid rgba(220,80,80,0.3)", borderRadius:8, padding:"8px 16px", color:"#e07c7c", fontSize:12, cursor:"pointer", fontFamily:"inherit" },
  tab: (active) => ({ padding:"8px 18px", borderRadius:20, border:`1px solid ${active?"#c8a96e":"rgba(200,169,110,0.2)"}`, background:active?"rgba(200,169,110,0.15)":"transparent", color:active?"#c8a96e":"#6b7f8e", fontSize:13, cursor:"pointer", fontFamily:"inherit" }),
  week: (active) => ({ padding:"7px 18px", borderRadius:16, border:`1px solid ${active?"#c8a96e":"rgba(200,169,110,0.2)"}`, background:active?"rgba(200,169,110,0.12)":"transparent", color:active?"#c8a96e":"#6b7f8e", fontSize:12, cursor:"pointer", fontFamily:"inherit" }),
};

function LoginScreen({ onLogin }) {
  const [login, setLogin] = useState(() => { try { return localStorage.getItem("dn_login")||""; } catch { return ""; } });
  const [password, setPassword] = useState(() => { try { return localStorage.getItem("dn_pass")||""; } catch { return ""; } });
  const [remember, setRemember] = useState(() => { try { return !!localStorage.getItem("dn_login"); } catch { return false; } });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    const acc = ACCOUNTS.find(a => a.login === login.trim().toLowerCase() && a.password.toLowerCase() === password.trim().toLowerCase());
    if (acc) {
      if (remember) { try { localStorage.setItem("dn_login", login.trim().toLowerCase()); localStorage.setItem("dn_pass", password.trim()); } catch {} }
      else { try { localStorage.removeItem("dn_login"); localStorage.removeItem("dn_pass"); } catch {} }
      onLogin(acc);
    } else setError("Incorrect login or password.");
  };

  return (
    <div style={{minHeight:"100vh", background:"linear-gradient(160deg,#0a1f0a,#0f1f0f,#1a1200)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif"}}>
      <div style={{width:"100%", maxWidth:420, padding:"0 24px"}}>
        {/* Watermark logo area */}
        <div style={{textAlign:"center", marginBottom:32}}>
          <div style={{width:120, height:120, borderRadius:"50%", background:"rgba(200,169,110,0.08)", border:"2px solid rgba(200,169,110,0.3)", margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column"}}>
            <div style={{color:"#c8a96e", fontSize:28, fontWeight:"bold", lineHeight:1}}>DN</div>
            <div style={{color:"rgba(200,169,110,0.5)", fontSize:8, letterSpacing:1, marginTop:4}}>دار النور</div>
          </div>
          <h1 style={{color:"#c8a96e", fontSize:22, fontWeight:"bold", letterSpacing:3, margin:"0 0 4px"}}>DARUL NOOR</h1>
          <p style={{color:"#5a8a5a", fontSize:11, letterSpacing:2, margin:0}}>EDUCATION HUB</p>
          <div style={{width:50, height:1, background:"linear-gradient(90deg,transparent,#c8a96e,transparent)", margin:"10px auto"}}/>
          <p style={{color:"#3a5a3a", fontSize:11, letterSpacing:2, margin:0}}>QUR'AN TRACKER</p>
        </div>

        <div style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(200,169,110,0.2)", borderRadius:16, padding:28}}>
          <div style={{marginBottom:14}}>
            <label style={{color:"#8fa3b3", fontSize:11, letterSpacing:1, display:"block", marginBottom:6}}>LOGIN ID</label>
            <input value={login} onChange={e=>setLogin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              style={{...inp.base}} placeholder="Enter your login ID"
              onFocus={e=>e.target.style.borderColor="rgba(200,169,110,0.7)"} onBlur={e=>e.target.style.borderColor="rgba(200,169,110,0.3)"}/>
          </div>
          <div style={{marginBottom:18}}>
            <label style={{color:"#8fa3b3", fontSize:11, letterSpacing:1, display:"block", marginBottom:6}}>PASSWORD</label>
            <div style={{position:"relative"}}>
              <input type={showPwd?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                style={{...inp.base, paddingRight:42}} placeholder="Enter your password"
                onFocus={e=>e.target.style.borderColor="rgba(200,169,110,0.7)"} onBlur={e=>e.target.style.borderColor="rgba(200,169,110,0.3)"}/>
              <button onClick={()=>setShowPwd(p=>!p)} style={{position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#8fa3b3", fontSize:16, padding:2}}>
                {showPwd?"🙈":"👁️"}
              </button>
            </div>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:16, cursor:"pointer"}} onClick={()=>setRemember(r=>!r)}>
            <div style={{width:16, height:16, borderRadius:3, border:"1px solid rgba(200,169,110,0.4)", background:remember?"rgba(200,169,110,0.2)":"transparent", display:"flex", alignItems:"center", justifyContent:"center"}}>
              {remember && <span style={{color:"#c8a96e", fontSize:11}}>✓</span>}
            </div>
            <span style={{color:"#6b7f8e", fontSize:12, userSelect:"none"}}>Remember me</span>
          </div>
          {error && <p style={{color:"#e07c7c", fontSize:12, margin:"0 0 12px", textAlign:"center"}}>⚠ {error}</p>}
          <button onClick={handleLogin} style={{...btn.primary, width:"100%", padding:"12px", fontSize:14, letterSpacing:2}}>SIGN IN</button>
        </div>
        <p style={{color:"#1a2a1a", fontSize:13, textAlign:"center", marginTop:16}}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
      </div>
    </div>
  );
}

function ProgressArc({ pct }) {
  const r=26,cx=34,cy=34,stroke=5,circ=2*Math.PI*r,dash=(pct/100)*circ;
  return (
    <svg width="68" height="68">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(200,169,110,0.15)" strokeWidth={stroke}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#c8a96e" strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ/4} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}/>
      <text x={cx} y={cy+5} textAnchor="middle" fill="#c8a96e" fontSize="12" fontWeight="bold">{pct}%</text>
    </svg>
  );
}

function WeekTable({ weekData, editing, onCellChange, onFeedbackChange }) {
  return (
    <div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%", borderCollapse:"collapse", fontSize:13}}>
          <thead>
            <tr>
              <th style={{padding:"9px 12px", textAlign:"left", color:"#8fa3b3", fontWeight:"normal", fontSize:11, letterSpacing:1, borderBottom:"1px solid rgba(200,169,110,0.12)", minWidth:130}}>CATEGORY</th>
              {DAYS.map(d=><th key={d} style={{padding:"9px 12px", textAlign:"left", color:"#c8a96e", fontWeight:"normal", fontSize:11, letterSpacing:1, borderBottom:"1px solid rgba(200,169,110,0.12)", minWidth:140}}>{d.toUpperCase()}</th>)}
            </tr>
          </thead>
          <tbody>
            {["sabq","manzil","notes"].map((field,fi)=>(
              <tr key={field} style={{background:fi%2===0?"rgba(255,255,255,0.02)":"transparent"}}>
                <td style={{padding:"9px 12px", color:"#e8dcc8", fontSize:12, borderBottom:"1px solid rgba(255,255,255,0.04)", whiteSpace:"nowrap"}}>
                  {field==="sabq"?"📖 Sabq":field==="manzil"?"🔁 Manzil":"📝 Notes"}
                </td>
                {weekData.days.map((day,di)=>(
                  <td key={di} style={{padding:"5px 8px", borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    {editing
                      ? <input value={day[field]||""} onChange={e=>onCellChange(di,field,e.target.value)}
                          style={{...inp.small, width:"100%", boxSizing:"border-box"}} placeholder="—"/>
                      : <span style={{color:day[field]?(field==="notes"?"#8fa3b3":"#d4c4a8"):"#2d3f4f"}}>{day[field]||"—"}</span>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{padding:"12px 14px", borderTop:"1px solid rgba(200,169,110,0.1)", background:"rgba(200,169,110,0.02)"}}>
        <p style={{color:"#c8a96e", fontSize:10, letterSpacing:1, margin:"0 0 7px"}}>✍️ TEACHER WEEKLY FEEDBACK</p>
        {editing
          ? <textarea value={weekData.teacherFeedback||""} onChange={e=>onFeedbackChange(e.target.value)} placeholder="Enter weekly feedback..."
              style={{...inp.small, width:"100%", boxSizing:"border-box", resize:"vertical", minHeight:60, lineHeight:1.5}}/>
          : <p style={{color:weekData.teacherFeedback?"#d4c4a8":"#2d3f4f", fontSize:13, margin:0, lineHeight:1.5, fontStyle:weekData.teacherFeedback?"normal":"italic"}}>
              {weekData.teacherFeedback||"No feedback yet."}
            </p>
        }
      </div>
    </div>
  );
}

function PaymentSection({ payments, onUpdate, canEdit }) {
  const [selYear, setSelYear] = useState(2026);
  const [selMonth, setSelMonth] = useState(MONTHS[new Date().getMonth()]);
  const entry = payments?.[selYear]?.[selMonth] || { paid:null, comment:"" };
  const upd = (field, val) => { const u=JSON.parse(JSON.stringify(payments)); u[selYear][selMonth][field]=val; onUpdate(u); };
  const paidColor = entry.paid===true?"#7dcf9e":entry.paid===false?"#e07c7c":"#6b7f8e";

  return (
    <div style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(200,169,110,0.12)", borderRadius:12, padding:18}}>
      <p style={{color:"#c8a96e", fontSize:11, letterSpacing:1.5, margin:"0 0 14px"}}>💳 PAYMENT STATUS</p>
      <div style={{display:"flex", gap:10, marginBottom:14, flexWrap:"wrap"}}>
        <select value={selYear} onChange={e=>setSelYear(Number(e.target.value))} style={{...inp.small, cursor:"pointer"}}>
          {YEARS.map(y=><option key={y} value={y} style={{background:"#0a1a0a"}}>{y}</option>)}
        </select>
        <select value={selMonth} onChange={e=>setSelMonth(e.target.value)} style={{...inp.small, cursor:"pointer"}}>
          {MONTHS.map(m=><option key={m} value={m} style={{background:"#0a1a0a"}}>{m}</option>)}
        </select>
      </div>
      <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap"}}>
        <div style={{background:entry.paid===true?"rgba(100,200,100,0.12)":entry.paid===false?"rgba(220,80,80,0.1)":"rgba(255,255,255,0.04)", border:`1px solid ${paidColor==="6b7f8e"?"rgba(255,255,255,0.1)":paidColor+"44"}`, borderRadius:8, padding:"8px 14px", display:"flex", alignItems:"center", gap:6}}>
          <span>{entry.paid===true?"✅":entry.paid===false?"❌":"⏳"}</span>
          <span style={{color:paidColor, fontSize:13, fontWeight:"bold"}}>{entry.paid===true?"PAID":entry.paid===false?"NOT PAID":"NOT SET"}</span>
        </div>
        {canEdit && (
          <div style={{display:"flex", gap:6}}>
            <button onClick={()=>upd("paid",true)} style={{...btn.ghost, borderColor:"rgba(100,200,100,0.4)", color:"#7dcf9e", padding:"7px 14px", fontWeight:entry.paid===true?"bold":"normal"}}>✓ Paid</button>
            <button onClick={()=>upd("paid",false)} style={{...btn.danger, padding:"7px 14px", fontWeight:entry.paid===false?"bold":"normal"}}>✗ Not Paid</button>
          </div>
        )}
      </div>
      {/* Month overview */}
      <div style={{display:"flex", flexWrap:"wrap", gap:4, marginBottom:14}}>
        {MONTHS.map(m=>{
          const p=payments?.[selYear]?.[m]?.paid;
          return <div key={m} onClick={()=>setSelMonth(m)} title={m} style={{width:26,height:26,borderRadius:5,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:"bold",
            background:p===true?"rgba(100,200,100,0.2)":p===false?"rgba(220,80,80,0.15)":"rgba(255,255,255,0.04)",
            border:`1px solid ${m===selMonth?"#c8a96e":p===true?"rgba(100,200,100,0.4)":p===false?"rgba(220,80,80,0.3)":"rgba(255,255,255,0.08)"}`,
            color:p===true?"#7dcf9e":p===false?"#e07c7c":"#4a5a6a"}}>
            {m.slice(0,1)}
          </div>;
        })}
      </div>
      <div>
        <label style={{color:"#8fa3b3", fontSize:10, letterSpacing:1, display:"block", marginBottom:6}}>💬 PARENT COMMENT</label>
        {canEdit
          ? <textarea value={entry.comment||""} onChange={e=>upd("comment",e.target.value)} placeholder="Add a comment..."
              style={{...inp.small, width:"100%", boxSizing:"border-box", resize:"vertical", minHeight:60, lineHeight:1.5}}/>
          : <p style={{color:entry.comment?"#d4c4a8":"#2d3f4f", fontSize:13, margin:0, fontStyle:entry.comment?"normal":"italic"}}>{entry.comment||"No comment."}</p>
        }
      </div>
    </div>
  );
}

function FeedbackSection({ payments, onUpdate, canEdit }) {
  const [selYear, setSelYear] = useState(2026);
  const [selMonth, setSelMonth] = useState(MONTHS[new Date().getMonth()]);
  const entry = payments?.[selYear]?.[selMonth] || { paid:null, comment:"" };
  const upd = (val) => { const u=JSON.parse(JSON.stringify(payments)); u[selYear][selMonth].comment=val; onUpdate(u); };

  return (
    <div style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(200,169,110,0.12)", borderRadius:12, padding:18}}>
      <p style={{color:"#c8a96e", fontSize:11, letterSpacing:1.5, margin:"0 0 14px"}}>💬 PARENT FEEDBACK</p>
      <div style={{display:"flex", gap:10, marginBottom:16, flexWrap:"wrap"}}>
        <select value={selYear} onChange={e=>setSelYear(Number(e.target.value))} style={{...inp.small, cursor:"pointer"}}>
          {YEARS.map(y=><option key={y} value={y} style={{background:"#0a1a0a"}}>{y}</option>)}
        </select>
        <select value={selMonth} onChange={e=>setSelMonth(e.target.value)} style={{...inp.small, cursor:"pointer"}}>
          {MONTHS.map(m=><option key={m} value={m} style={{background:"#0a1a0a"}}>{m}</option>)}
        </select>
      </div>
      <label style={{color:"#8fa3b3", fontSize:10, letterSpacing:1, display:"block", marginBottom:8}}>{selMonth.toUpperCase()} {selYear}</label>
      {canEdit
        ? <textarea value={entry.comment||""} onChange={e=>upd(e.target.value)} placeholder="Write your feedback here..."
            style={{...inp.small, width:"100%", boxSizing:"border-box", resize:"vertical", minHeight:100, lineHeight:1.6, marginBottom:14}}/>
        : <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(200,169,110,0.1)", borderRadius:8, padding:12, minHeight:60, marginBottom:14}}>
            <p style={{color:entry.comment?"#d4c4a8":"#2d3f4f", fontSize:13, margin:0, fontStyle:entry.comment?"normal":"italic"}}>{entry.comment||"No feedback yet."}</p>
          </div>
      }
      <p style={{color:"#6b7f8e", fontSize:10, margin:"0 0 8px", letterSpacing:1}}>PREVIOUS FEEDBACK — {selYear}</p>
      <div style={{display:"flex", flexDirection:"column", gap:6, maxHeight:200, overflowY:"auto"}}>
        {MONTHS.filter(m=>payments?.[selYear]?.[m]?.comment).map(m=>(
          <div key={m} onClick={()=>setSelMonth(m)} style={{background:"rgba(255,255,255,0.03)", border:`1px solid ${m===selMonth?"rgba(200,169,110,0.4)":"rgba(255,255,255,0.06)"}`, borderRadius:8, padding:"9px 12px", cursor:"pointer"}}>
            <p style={{color:"#c8a96e", fontSize:10, margin:"0 0 3px", letterSpacing:1}}>{m.toUpperCase()}</p>
            <p style={{color:"#d4c4a8", fontSize:12, margin:0}}>{payments[selYear][m].comment}</p>
          </div>
        ))}
        {!MONTHS.some(m=>payments?.[selYear]?.[m]?.comment) && <p style={{color:"#2d3f4f", fontSize:12, margin:0, fontStyle:"italic"}}>No feedback for {selYear} yet.</p>}
      </div>
    </div>
  );
}

function StudentDetail({ student, onBack, isAdmin, isParent, onSave }) {
  const [tab, setTab] = useState("progress");
  const [activeWeek, setActiveWeek] = useState(0);
  const [selYear, setSelYear] = useState(2026);
  const [selMonth, setSelMonth] = useState(MONTHS[new Date().getMonth()]);
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(JSON.parse(JSON.stringify(student)));
  const [saving, setSaving] = useState(false);

  const getWeeks = () => local.quranProgress?.[selYear]?.[selMonth] || EMPTY_WEEKS();

  const cellChange = (di,field,val) => {
    const u=JSON.parse(JSON.stringify(local));
    if(!u.quranProgress) u.quranProgress=EMPTY_PROGRESS();
    u.quranProgress[selYear][selMonth][activeWeek].days[di][field]=val;
    setLocal(u);
  };
  const feedbackChange = (val) => {
    const u=JSON.parse(JSON.stringify(local));
    if(!u.quranProgress) u.quranProgress=EMPTY_PROGRESS();
    u.quranProgress[selYear][selMonth][activeWeek].teacherFeedback=val;
    setLocal(u);
  };
  const fieldChange = (f,v) => setLocal(p=>({...p,[f]:v}));
  const summaryChange = (k,v) => setLocal(p=>({...p,summary:{...p.summary,[k]:v}}));
  const paymentUpdate = (updated) => {
    const u={...local,payments:updated};
    setLocal(u);
    onSave(u);
  };
  const save = async () => {
    setSaving(true);
    await onSave(local);
    setSaving(false);
    setEditing(false);
  };
  const cancel = () => { setLocal(JSON.parse(JSON.stringify(student))); setEditing(false); };

  return (
    <div>
      <button onClick={onBack} style={{...btn.ghost, marginBottom:16, display:"flex", alignItems:"center", gap:6, border:"none", color:"#c8a96e", padding:"0 0 4px"}}>← Back</button>

      {/* Header */}
      <div style={{display:"flex", alignItems:"center", gap:16, marginBottom:18, flexWrap:"wrap"}}>
        <div style={{width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#c8a96e,#8b6914)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"#0f1923",fontWeight:"bold",flexShrink:0}}>
          {local.name?local.name.charAt(0).toUpperCase():"?"}
        </div>
        <div style={{flex:1}}>
          {isAdmin&&editing ? (
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <input value={local.name} onChange={e=>fieldChange("name",e.target.value)} placeholder="Student Name" style={{...inp.small, fontSize:16}}/>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <input value={local.grade} onChange={e=>fieldChange("grade",e.target.value)} placeholder="Grade" style={{...inp.small, flex:1}}/>
                <input value={local.teacher} onChange={e=>fieldChange("teacher",e.target.value)} placeholder="Teacher" style={{...inp.small, flex:1}}/>
                <input type="number" min="0" max="100" value={local.progress} onChange={e=>fieldChange("progress",Number(e.target.value))} placeholder="%" style={{...inp.small, width:60}}/>
              </div>
            </div>
          ) : (
            <>
              <h2 style={{color:"#e8dcc8",margin:0,fontSize:20,fontWeight:"normal"}}>{local.name||"No name"}</h2>
              <p style={{color:"#6b7f8e",margin:"3px 0 0",fontSize:13}}>{local.grade||"—"} · {local.teacher||"—"}</p>
            </>
          )}
        </div>
        <ProgressArc pct={local.progress}/>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        <button style={btn.tab(tab==="progress")} onClick={()=>setTab("progress")}>📖 Progress</button>
        <button style={btn.tab(tab==="feedback")} onClick={()=>setTab("feedback")}>💬 Feedback</button>
        <button style={btn.tab(tab==="payment")} onClick={()=>setTab("payment")}>💳 Payment</button>
      </div>

      {tab==="progress" && (
        <>
          <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap",alignItems:"flex-end"}}>
            <div>
              <label style={{color:"#8fa3b3",fontSize:10,letterSpacing:1,display:"block",marginBottom:5}}>YEAR</label>
              <select value={selYear} onChange={e=>{setSelYear(Number(e.target.value));setActiveWeek(0);}} style={{...inp.small,cursor:"pointer",color:"#c8a96e",fontWeight:"bold"}}>
                {YEARS.map(y=><option key={y} value={y} style={{background:"#0a1a0a"}}>{y}</option>)}
              </select>
            </div>
            <div>
              <label style={{color:"#8fa3b3",fontSize:10,letterSpacing:1,display:"block",marginBottom:5}}>MONTH</label>
              <select value={selMonth} onChange={e=>{setSelMonth(e.target.value);setActiveWeek(0);}} style={{...inp.small,cursor:"pointer"}}>
                {MONTHS.map(m=><option key={m} value={m} style={{background:"#0a1a0a"}}>{m}</option>)}
              </select>
            </div>
            {isAdmin && (
              <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                {editing
                  ? <><button onClick={save} style={{...btn.primary,padding:"7px 16px"}}>{saving?"Saving...":"✓ Save"}</button>
                      <button onClick={cancel} style={{...btn.ghost,padding:"7px 14px"}}>Cancel</button></>
                  : <button onClick={()=>setEditing(true)} style={{...btn.ghost}}>✎ Edit</button>
                }
              </div>
            )}
          </div>

          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <div style={{height:1,flex:1,background:"rgba(200,169,110,0.1)"}}/>
            <span style={{color:"#c8a96e",fontSize:11,letterSpacing:2}}>{selMonth.toUpperCase()} {selYear}</span>
            <div style={{height:1,flex:1,background:"rgba(200,169,110,0.1)"}}/>
          </div>

          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
            {getWeeks().map((w,i)=>(
              <button key={i} onClick={()=>setActiveWeek(i)} style={btn.week(activeWeek===i)}>Week {w.week}</button>
            ))}
          </div>

          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(200,169,110,0.12)",borderRadius:12,overflow:"hidden",marginBottom:16}}>
            <WeekTable weekData={getWeeks()[activeWeek]} editing={isAdmin&&editing} onCellChange={cellChange} onFeedbackChange={feedbackChange}/>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={{background:"rgba(100,200,100,0.04)",border:"1px solid rgba(100,200,100,0.15)",borderRadius:10,padding:16}}>
              <p style={{color:"#7dcf9e",fontSize:10,letterSpacing:1,margin:"0 0 8px"}}>✦ STRENGTHS</p>
              {isAdmin&&editing
                ? <textarea value={local.summary.strengths} onChange={e=>summaryChange("strengths",e.target.value)} placeholder="Enter strengths..." style={{...inp.small,width:"100%",boxSizing:"border-box",resize:"vertical",minHeight:60}}/>
                : <p style={{color:local.summary.strengths?"#c8dcc0":"#2d3f4f",fontSize:12,margin:0,lineHeight:1.5}}>{local.summary.strengths||"Not filled yet"}</p>
              }
            </div>
            <div style={{background:"rgba(200,150,100,0.04)",border:"1px solid rgba(200,150,100,0.15)",borderRadius:10,padding:16}}>
              <p style={{color:"#e0a87c",fontSize:10,letterSpacing:1,margin:"0 0 8px"}}>✦ TO IMPROVE</p>
              {isAdmin&&editing
                ? <textarea value={local.summary.improve} onChange={e=>summaryChange("improve",e.target.value)} placeholder="Areas to improve..." style={{...inp.small,width:"100%",boxSizing:"border-box",resize:"vertical",minHeight:60}}/>
                : <p style={{color:local.summary.improve?"#dcc8b0":"#2d3f4f",fontSize:12,margin:0,lineHeight:1.5}}>{local.summary.improve||"Not filled yet"}</p>
              }
            </div>
          </div>
        </>
      )}

      {tab==="feedback" && <FeedbackSection payments={local.payments} onUpdate={paymentUpdate} canEdit={isParent||isAdmin}/>}
      {tab==="payment" && <PaymentSection payments={local.payments} onUpdate={paymentUpdate} canEdit={isParent||isAdmin}/>}
    </div>
  );
}

function StudentCard({ student, onClick }) {
  return (
    <button onClick={onClick} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(200,169,110,0.12)",borderRadius:12,padding:18,cursor:"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",alignItems:"center",gap:14,width:"100%",transition:"border-color 0.2s"}}
      onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(200,169,110,0.45)"}
      onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(200,169,110,0.12)"}>
      <div style={{width:46,height:46,borderRadius:"50%",background:student.name?"linear-gradient(135deg,#c8a96e,#8b6914)":"rgba(200,169,110,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:student.name?"#0f1923":"#3d5166",fontWeight:"bold",flexShrink:0}}>
        {student.name?student.name.charAt(0).toUpperCase():"?"}
      </div>
      <div style={{flex:1}}>
        <p style={{color:student.name?"#e8dcc8":"#3d5166",fontSize:14,margin:"0 0 3px",fontWeight:"normal"}}>{student.name||"Empty"}</p>
        <p style={{color:"#6b7f8e",fontSize:11,margin:"0 0 8px"}}>{student.grade||"—"} · {student.teacher||"—"}</p>
        <div style={{background:"rgba(200,169,110,0.1)",borderRadius:3,height:4,overflow:"hidden"}}>
          <div style={{width:`${student.progress}%`,height:"100%",background:"linear-gradient(90deg,#c8a96e,#e8c882)",borderRadius:3}}/>
        </div>
        <p style={{color:student.progress>0?"#c8a96e":"#3d5166",fontSize:10,margin:"4px 0 0"}}>{student.progress>0?`${student.progress}% completed`:"Not started"}</p>
      </div>
    </button>
  );
}

function AdminView({ students, onSelect, accounts, onAssignLogin }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showLoginForm, setShowLoginForm] = useState(null);
  const [newLogin, setNewLogin] = useState("");
  const [newPass, setNewPass] = useState("");
  const [loginErr, setLoginErr] = useState("");

  const familyIds = FAMILY_GROUPS.flatMap(g=>g.ids);
  const hasLogin = (id) => accounts.find(a=>a.role==="parent"&&a.studentIds.includes(id));

  const filtered = search.trim()
    ? students.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>a.name.localeCompare(b.name))
    : null;

  const individual = students.filter(s=>s.name&&!familyIds.includes(s.id)).sort((a,b)=>a.name.localeCompare(b.name));

  const divider = (label) => (
    <div style={{display:"flex",alignItems:"center",gap:10,margin:"20px 0 12px"}}>
      <div style={{height:1,flex:1,background:"rgba(200,169,110,0.1)"}}/>
      <span style={{color:"#c8a96e",fontSize:10,letterSpacing:2}}>{label}</span>
      <div style={{height:1,flex:1,background:"rgba(200,169,110,0.1)"}}/>
    </div>
  );

  return (
    <div>
      {/* Search + filter */}
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:1,minWidth:180}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#6b7f8e",fontSize:13}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search student..."
            style={{...inp.base,paddingLeft:32,fontSize:13}}/>
          {search && <button onClick={()=>setSearch("")} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#6b7f8e",cursor:"pointer",fontSize:14}}>✕</button>}
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{...inp.small,cursor:"pointer",color:"#c8a96e"}}>
          <option value="all" style={{background:"#0a1a0a"}}>👥 All</option>
          <option value="individual" style={{background:"#0a1a0a"}}>🧑 Individual</option>
          <option value="families" style={{background:"#0a1a0a"}}>👨‍👩‍👧‍👦 Families</option>
        </select>
      </div>

      {/* Search results */}
      {filtered ? (
        filtered.length===0
          ? <p style={{color:"#3d5166",fontStyle:"italic",fontSize:13}}>No students found.</p>
          : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
              {filtered.map(s=><StudentCard key={s.id} student={s} onClick={()=>onSelect(s)}/>)}
            </div>
      ) : (
        <>
          {(filter==="all"||filter==="individual") && (
            <>
              {divider(`INDIVIDUAL STUDENTS (${individual.length})`)}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
                {individual.map(s=><StudentCard key={s.id} student={s} onClick={()=>onSelect(s)}/>)}
              </div>
            </>
          )}
          {(filter==="all"||filter==="families") && (
            <>
              {divider(`FAMILY GROUPS (${FAMILY_GROUPS.length})`)}
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {FAMILY_GROUPS.map(group=>{
                  const gs=group.ids.map(id=>students.find(s=>s.id===id)).filter(Boolean).sort((a,b)=>a.name.localeCompare(b.name));
                  if(!gs.length) return null;
                  return (
                    <div key={group.label} style={{background:"rgba(200,169,110,0.03)",border:"1px solid rgba(200,169,110,0.1)",borderRadius:12,padding:"14px 14px 10px"}}>
                      <p style={{color:"#c8a96e",fontSize:11,letterSpacing:1,margin:"0 0 10px"}}>👨‍👩‍👧‍👦 {group.label.toUpperCase()} · {gs.length} students</p>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:8}}>
                        {gs.map(s=><StudentCard key={s.id} student={s} onClick={()=>onSelect(s)}/>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function Dashboard({ account, onLogout }) {
  const [students, setStudents] = useState(STUDENTS);
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const [selected, setSelected] = useState(null);
  const isAdmin = account.role==="admin";
  const isParent = account.role==="parent";
  const visibleStudents = students.filter(s=>isAdmin?true:account.studentIds.includes(s.id));

  useEffect(() => {
    const unsubs = STUDENTS.map(s => {
      const ref = doc(db, "students", String(s.id));
      return onSnapshot(ref, snap => {
        if(snap.exists()) {
          const data = snap.data();
          setStudents(prev => prev.map(p => p.id===s.id ? {...p,...data} : p));
          setSelected(prev => prev&&prev.id===s.id ? {...prev,...data} : prev);
        }
      });
    });
    return () => unsubs.forEach(u=>u());
  }, []);

  const handleSave = async (updated) => {
    try { await setDoc(doc(db,"students",String(updated.id)), updated); } catch(e) { console.error(e); }
    setStudents(prev=>prev.map(s=>s.id===updated.id?updated:s));
    setSelected(updated);
  };

  return (
    <div style={{minHeight:"100vh",background:"#0a1a0a",fontFamily:"Georgia,serif"}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"24px 20px"}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28,flexWrap:"wrap",gap:10}}>
          <div>
            <h1 style={{color:"#c8a96e",fontSize:18,margin:0,fontWeight:"bold",letterSpacing:1}}>Darul Noor Education Hub</h1>
            <p style={{color:"#2d5a2d",fontSize:11,margin:"3px 0 0",letterSpacing:1}}>
              {isAdmin?"ADMIN":"PARENT"} · QUR'AN TRACKER
<span style={{color:"#2d7a2d",marginLeft:8}}>● Live</span>
            </p>
          </div>
          <button onClick={onLogout} style={{...btn.ghost,fontSize:11,padding:"6px 14px"}}>Sign Out</button>
        </div>

        {selected ? (
          <StudentDetail student={selected} onBack={()=>setSelected(null)} isAdmin={isAdmin} isParent={isParent} onSave={handleSave}/>
        ) : (
          <>
            <p style={{color:"#6b7f8e",fontSize:13,marginBottom:16}}>
              {isAdmin?`${visibleStudents.length} students`:visibleStudents.length>1?`${visibleStudents.length} children`:"Your child's progress"}
            </p>
            {isAdmin
              ? <AdminView students={visibleStudents} onSelect={setSelected} accounts={accounts} onAssignLogin={()=>{}}/>
              : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
                  {visibleStudents.map(s=><StudentCard key={s.id} student={s} onClick={()=>setSelected(s)}/>)}
                </div>
            }
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [account, setAccount] = useState(null);
  return account ? <Dashboard account={account} onLogout={()=>setAccount(null)}/> : <LoginScreen onLogin={setAccount}/>;
}
