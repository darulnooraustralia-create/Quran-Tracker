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
        : <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(200,169,110,0.1)", borderRadius:8,
