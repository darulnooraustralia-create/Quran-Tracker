import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";

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

const makeStudent = (id, name, gender="") => ({
  id, name, grade: "", teacher: "", progress: 0, gender,
  summary: { strengths: "", improve: "" },
  quranProgress: EMPTY_PROGRESS(),
  payments: EMPTY_PAYMENTS(),
  messages: [],
  notifications: { admin: [], parent: [] },
});

const STUDENTS = [
  makeStudent(1,"Asiya Islam","female"), makeStudent(2,"Aafiyah Zainab","female"),
  makeStudent(3,"Hafsa Nawed","female"), makeStudent(4,"Husna Nawed","female"),
  makeStudent(5,"Aowaab Yousuf","male"), makeStudent(6,"Hajera Hamda Fatima","female"),
  makeStudent(7,"Anaya Kamal","female"), makeStudent(8,"Hamza Sazzad","male"),
  makeStudent(9,"Maryam Bint Rabi","female"), makeStudent(10,"Eesa Zohaib","male"),
  makeStudent(11,"Yusra Sheikh","female"), makeStudent(12,"Ibraheem Munsi","male"),
  makeStudent(13,"Maryam Munsi","female"), makeStudent(14,"Yusuf Bin Ali","male"),
  makeStudent(15,"Aisha Khanam","female"), makeStudent(16,"Mohammed Ibrahim Faizan","male"),
  makeStudent(17,"Mohammed Idrees","male"), makeStudent(18,"Munazza Fatima","female"),
  makeStudent(19,"Manha Fatima","female"), makeStudent(20,"Azwar Rahman","male"),
  makeStudent(21,"Owais Abdul Aziz","male"), makeStudent(22,"Uzair Abdul Aziz","male"),
  makeStudent(23,"Halima Abdusamed Hassan","female"), makeStudent(24,"Abubakr Siddik","male"),
  makeStudent(25,"Abuobaida Siddik","male"), makeStudent(26,"Abuhuraira Siddik","male"),
  makeStudent(27,"Abrar Farzad","male"), makeStudent(28,"Ali Faraz","male"),
  makeStudent(29,"",""), makeStudent(30,"",""),
  makeStudent(31,"",""), makeStudent(32,"",""), makeStudent(33,"",""),
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

// ── Avatar SVGs — silhouette style, no face ──
function MaleAvatar({ size=52 }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#e8f4e8"/>
      {/* Kufi cap - rounded top with decorative band */}
      <path d="M28 42 Q28 20 50 20 Q72 20 72 42 Z" fill="#555"/>
      <rect x="26" y="40" width="48" height="6" rx="2" fill="#444"/>
      {/* Band pattern dots */}
      <rect x="30" y="41" width="3" height="4" rx="1" fill="#666"/>
      <rect x="37" y="41" width="3" height="4" rx="1" fill="#666"/>
      <rect x="44" y="41" width="3" height="4" rx="1" fill="#666"/>
      <rect x="51" y="41" width="3" height="4" rx="1" fill="#666"/>
      <rect x="58" y="41" width="3" height="4" rx="1" fill="#666"/>
      <rect x="65" y="41" width="3" height="4" rx="1" fill="#666"/>
      {/* Head silhouette - no face features */}
      <path d="M34 46 Q34 38 50 38 Q66 38 66 46 Q66 62 60 66 Q55 69 50 69 Q45 69 40 66 Q34 62 34 46Z" fill="#555"/>
      {/* Neck */}
      <rect x="44" y="67" width="12" height="8" rx="2" fill="#555"/>
      {/* Thobe/body - wide collar */}
      <path d="M20 100 Q18 78 35 74 Q42 72 44 74 L50 76 L56 74 Q58 72 65 74 Q82 78 80 100Z" fill="#555"/>
    </svg>
  );
}

function FemaleAvatar({ size=52 }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#e8eef4"/>
      {/* Hijab outer shape - large flowing */}
      <path d="M20 100 Q16 72 22 58 Q26 46 30 42 Q34 28 50 26 Q66 28 70 42 Q74 46 78 58 Q84 72 80 100Z" fill="#5a5a5a"/>
      {/* Hijab inner oval - face opening (blank, no features) */}
      <ellipse cx="50" cy="52" rx="17" ry="20" fill="#666"/>
      {/* Hijab top dome */}
      <path d="M30 44 Q30 24 50 22 Q70 24 70 44 Q62 36 50 35 Q38 36 30 44Z" fill="#4a4a4a"/>
      {/* Hijab side folds */}
      <path d="M22 58 Q18 68 20 80 Q24 70 28 64Z" fill="#4a4a4a"/>
      <path d="M78 58 Q82 68 80 80 Q76 70 72 64Z" fill="#4a4a4a"/>
      {/* Abaya body */}
      <path d="M20 100 Q20 82 24 76 Q30 70 40 68 Q44 72 50 73 Q56 72 60 68 Q70 70 76 76 Q80 82 80 100Z" fill="#5a5a5a"/>
    </svg>
  );
}

function UnknownAvatar({ size=52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#f0f4f0"/>
      <circle cx="50" cy="50" r="48" fill="none" stroke="#c8dcc8" strokeWidth="2" strokeDasharray="6 4"/>
      <text x="50" y="58" textAnchor="middle" fill="#9ab09a" fontSize="32" fontFamily="Georgia,serif">?</text>
    </svg>
  );
}

function Avatar({ student, size=52 }) {
  if (!student.name) return <UnknownAvatar size={size}/>;
  if (student.gender==="male") return <MaleAvatar size={size}/>;
  if (student.gender==="female") return <FemaleAvatar size={size}/>;
  // Unknown gender — show initial
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#e8f0e8"/>
      <text x="50" y="65" textAnchor="middle" fill="#2d6a2d" fontSize="40" fontWeight="bold" fontFamily="Georgia,serif">{student.name.charAt(0).toUpperCase()}</text>
    </svg>
  );
}

// ── Styles ──
const C = {
  bg: "#f0f4f0", card: "#ffffff", border: "#d4e4d4",
  primary: "#2d6a2d", gold: "#8b6914", goldLight: "#c8a96e",
  text: "#1a2a1a", textMid: "#4a6a4a", textLight: "#7a9a7a",
  danger: "#c0392b", success: "#27ae60",
};

const S = {
  input: { width:"100%", background:"#f8faf8", border:`1px solid ${C.border}`, borderRadius:8, padding:"11px 14px", color:C.text, fontSize:15, outline:"none", boxSizing:"border-box", fontFamily:"Georgia,serif" },
  inputSm: { background:"#f8faf8", border:`1px solid ${C.border}`, borderRadius:6, padding:"8px 11px", color:C.text, fontSize:14, outline:"none", fontFamily:"Georgia,serif" },
  btnPrimary: { background:C.primary, border:"none", borderRadius:8, padding:"11px 22px", color:"#fff", fontSize:14, fontWeight:"bold", cursor:"pointer", fontFamily:"Georgia,serif", letterSpacing:0.5 },
  btnGold: { background:C.gold, border:"none", borderRadius:8, padding:"11px 22px", color:"#fff", fontSize:14, fontWeight:"bold", cursor:"pointer", fontFamily:"Georgia,serif" },
  btnGhost: { background:"transparent", border:`1.5px solid ${C.primary}`, borderRadius:8, padding:"9px 18px", color:C.primary, fontSize:14, cursor:"pointer", fontFamily:"Georgia,serif", fontWeight:"bold" },
  btnDanger: { background:"transparent", border:`1.5px solid ${C.danger}`, borderRadius:8, padding:"9px 18px", color:C.danger, fontSize:14, cursor:"pointer", fontFamily:"Georgia,serif" },
  tab: (a) => ({ padding:"9px 20px", borderRadius:20, border:`1.5px solid ${a?C.primary:C.border}`, background:a?"#e8f4e8":"transparent", color:a?C.primary:C.textMid, fontSize:14, cursor:"pointer", fontFamily:"Georgia,serif", fontWeight:a?"bold":"normal" }),
  card: { background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:20 },
};

function LoginScreen({ onLogin }) {
  const [login, setLogin] = useState(() => { try { return localStorage.getItem("dn_login")||""; } catch { return ""; } });
  const [password, setPassword] = useState(() => { try { return localStorage.getItem("dn_pass")||""; } catch { return ""; } });
  const [remember, setRemember] = useState(() => { try { return !!localStorage.getItem("dn_login"); } catch { return false; } });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    const acc = ACCOUNTS.find(a => a.login===login.trim().toLowerCase() && a.password.toLowerCase()===password.trim().toLowerCase());
    if (acc) {
      if (remember) { try { localStorage.setItem("dn_login",login.trim().toLowerCase()); localStorage.setItem("dn_pass",password.trim()); } catch {} }
      else { try { localStorage.removeItem("dn_login"); localStorage.removeItem("dn_pass"); } catch {} }
      onLogin(acc);
    } else setError("Incorrect login or password. Please try again.");
  };

  return (
    <div style={{minHeight:"100vh", background:`linear-gradient(160deg,#e8f4e8,#f0f8f0,#e0f0e8)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif"}}>
      <div style={{width:"100%", maxWidth:420, padding:"0 24px"}}>
        <div style={{textAlign:"center", marginBottom:32}}>
          <div style={{width:110, height:110, borderRadius:"50%", background:"#fff", border:`3px solid ${C.goldLight}`, boxShadow:"0 4px 24px rgba(139,105,20,0.15)", margin:"0 auto 18px", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column"}}>
            <div style={{color:C.gold, fontSize:30, fontWeight:"bold", lineHeight:1}}>DN</div>
            <div style={{color:C.goldLight, fontSize:9, letterSpacing:2, marginTop:4}}>دار النور</div>
          </div>
          <h1 style={{color:C.primary, fontSize:26, fontWeight:"bold", letterSpacing:2, margin:"0 0 4px"}}>DARUL NOOR</h1>
          <p style={{color:C.textMid, fontSize:13, letterSpacing:3, margin:0}}>EDUCATION HUB</p>
          <div style={{width:50, height:2, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, margin:"10px auto"}}/>
          <p style={{color:C.textLight, fontSize:12, letterSpacing:2, margin:0}}>QUR'AN TRACKER</p>
        </div>

        <div style={{background:"#fff", border:`1px solid ${C.border}`, borderRadius:16, padding:32, boxShadow:"0 4px 24px rgba(0,0,0,0.06)"}}>
          <div style={{marginBottom:16}}>
            <label style={{color:C.textMid, fontSize:13, display:"block", marginBottom:7, fontWeight:"bold"}}>Login ID</label>
            <input value={login} onChange={e=>setLogin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              style={S.input} placeholder="Enter your login ID"
              onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{color:C.textMid, fontSize:13, display:"block", marginBottom:7, fontWeight:"bold"}}>Password</label>
            <div style={{position:"relative"}}>
              <input type={showPwd?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                style={{...S.input, paddingRight:44}} placeholder="Enter your password"
                onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}/>
              <button onClick={()=>setShowPwd(p=>!p)} style={{position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:C.textLight, fontSize:18, padding:2}}>{showPwd?"🙈":"👁️"}</button>
            </div>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:9, marginBottom:18, cursor:"pointer"}} onClick={()=>setRemember(r=>!r)}>
            <div style={{width:18, height:18, borderRadius:4, border:`2px solid ${C.primary}`, background:remember?C.primary:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
              {remember && <span style={{color:"#fff", fontSize:12, lineHeight:1}}>✓</span>}
            </div>
            <span style={{color:C.textMid, fontSize:14, userSelect:"none"}}>Remember me</span>
          </div>
          {error && <div style={{background:"#fdf0f0", border:"1px solid #f0c0c0", borderRadius:8, padding:"10px 14px", marginBottom:14}}><p style={{color:C.danger, fontSize:13, margin:0}}>⚠ {error}</p></div>}
          <button onClick={handleLogin} style={{...S.btnPrimary, width:"100%", padding:"13px", fontSize:16}}>Sign In</button>
        </div>
        <p style={{color:C.textLight, fontSize:13, textAlign:"center", marginTop:16}}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
      </div>
    </div>
  );
}

function ProgressArc({ pct }) {
  const r=26,cx=34,cy=34,stroke=5,circ=2*Math.PI*r,dash=(pct/100)*circ;
  return (
    <svg width="68" height="68">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e0e8e0" strokeWidth={stroke}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.primary} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ/4} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}/>
      <text x={cx} y={cy+5} textAnchor="middle" fill={C.primary} fontSize="13" fontWeight="bold">{pct}%</text>
    </svg>
  );
}

function WeekTable({ weekData, editing, onCellChange, onFeedbackChange }) {
  return (
    <div style={{border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden"}}>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%", borderCollapse:"collapse", fontSize:14}}>
          <thead>
            <tr style={{background:"#f0f8f0"}}>
              <th style={{padding:"10px 14px", textAlign:"left", color:C.textMid, fontWeight:"bold", fontSize:12, letterSpacing:1, borderBottom:`1px solid ${C.border}`, minWidth:120}}>CATEGORY</th>
              {DAYS.map(d=><th key={d} style={{padding:"10px 14px", textAlign:"left", color:C.primary, fontWeight:"bold", fontSize:12, letterSpacing:1, borderBottom:`1px solid ${C.border}`, minWidth:140}}>{d.toUpperCase()}</th>)}
            </tr>
          </thead>
          <tbody>
            {["sabq","manzil","notes"].map((field,fi)=>(
              <tr key={field} style={{background:fi%2===0?"#fafcfa":"#fff"}}>
                <td style={{padding:"10px 14px", color:C.text, fontSize:13, fontWeight:"bold", borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap"}}>
                  {field==="sabq"?"📖 Sabq":field==="manzil"?"🔁 Manzil":"📝 Notes"}
                </td>
                {weekData.days.map((day,di)=>(
                  <td key={di} style={{padding:"7px 10px", borderBottom:`1px solid ${C.border}`}}>
                    {editing
                      ? <input value={day[field]||""} onChange={e=>onCellChange(di,field,e.target.value)}
                          style={{...S.inputSm, width:"100%", boxSizing:"border-box"}} placeholder="—"/>
                      : <span style={{color:day[field]?C.text:C.textLight, fontSize:14}}>{day[field]||"—"}</span>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{padding:"14px 16px", background:"#f8fcf8", borderTop:`1px solid ${C.border}`}}>
        <p style={{color:C.primary, fontSize:12, fontWeight:"bold", letterSpacing:1, margin:"0 0 8px"}}>✍️ TEACHER WEEKLY FEEDBACK</p>
        {editing
          ? <textarea value={weekData.teacherFeedback||""} onChange={e=>onFeedbackChange(e.target.value)} placeholder="Enter weekly feedback for this student..."
              style={{...S.inputSm, width:"100%", boxSizing:"border-box", resize:"vertical", minHeight:70, lineHeight:1.6}}/>
          : <p style={{color:weekData.teacherFeedback?C.text:C.textLight, fontSize:14, margin:0, lineHeight:1.6, fontStyle:weekData.teacherFeedback?"normal":"italic"}}>
              {weekData.teacherFeedback||"No feedback entered yet."}
            </p>
        }
      </div>
    </div>
  );
}

function MessageSection({ student, isAdmin, onSave }) {
  const [selYear, setSelYear] = useState(2026);
  const [selMonth, setSelMonth] = useState(MONTHS[new Date().getMonth()]);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const messages = student.messages || [];
  const monthMessages = messages.filter(m => m.year===selYear && m.month===selMonth);

  const sendMessage = async () => {
    if (!draft.trim()) return;
    setSaving(true);
    const newMsg = {
      text: draft.trim(),
      from: isAdmin ? "teacher" : "parent",
      year: selYear,
      month: selMonth,
      time: new Date().toLocaleString("en-AU"),
      read: false,
    };
    const updated = { ...student, messages: [...messages, newMsg] };
    // Add notification for the other party
    if (!isAdmin) {
      if (!updated.notifications) updated.notifications = { admin: [], parent: [] };
      updated.notifications.admin = [...(updated.notifications.admin||[]), { text:`New message from parent of ${student.name}`, time: newMsg.time, read:false }];
    } else {
      if (!updated.notifications) updated.notifications = { admin: [], parent: [] };
      updated.notifications.parent = [...(updated.notifications.parent||[]), { text:`New message from teacher for ${student.name}`, time: newMsg.time, read:false }];
    }
    await onSave(updated);
    setDraft("");
    setSaving(false);
  };

  return (
    <div style={S.card}>
      <p style={{color:C.primary, fontSize:13, fontWeight:"bold", letterSpacing:1, margin:"0 0 14px"}}>💬 MESSAGE TO TEACHER</p>
      <div style={{display:"flex", gap:10, marginBottom:16, flexWrap:"wrap"}}>
        <div>
          <label style={{color:C.textMid, fontSize:12, display:"block", marginBottom:5, fontWeight:"bold"}}>YEAR</label>
          <select value={selYear} onChange={e=>setSelYear(Number(e.target.value))} style={{...S.inputSm, cursor:"pointer"}}>
            {YEARS.map(y=><option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label style={{color:C.textMid, fontSize:12, display:"block", marginBottom:5, fontWeight:"bold"}}>MONTH</label>
          <select value={selMonth} onChange={e=>setSelMonth(e.target.value)} style={{...S.inputSm, cursor:"pointer"}}>
            {MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Message history */}
      <div style={{background:"#f8fcf8", border:`1px solid ${C.border}`, borderRadius:10, padding:14, marginBottom:14, minHeight:120, maxHeight:280, overflowY:"auto", display:"flex", flexDirection:"column", gap:10}}>
        {monthMessages.length===0
          ? <p style={{color:C.textLight, fontSize:14, margin:"auto", textAlign:"center", fontStyle:"italic"}}>No messages for {selMonth} {selYear}</p>
          : monthMessages.map((m,i)=>(
            <div key={i} style={{
              alignSelf: m.from==="parent"?"flex-end":"flex-start",
              background: m.from==="parent"?"#e8f4e8":"#fff8e8",
              border:`1px solid ${m.from==="parent"?C.border:"#e0d0a0"}`,
              borderRadius:10, padding:"10px 14px", maxWidth:"80%"
            }}>
              <p style={{color:C.text, fontSize:14, margin:"0 0 4px", lineHeight:1.5}}>{m.text}</p>
              <p style={{color:C.textLight, fontSize:11, margin:0}}>{m.from==="parent"?"👨‍👩‍👧 Parent":"👩‍🏫 Teacher"} · {m.time}</p>
            </div>
          ))
        }
      </div>

      {/* Compose */}
      <div>
        <label style={{color:C.textMid, fontSize:12, fontWeight:"bold", display:"block", marginBottom:7}}>
          {isAdmin ? "Reply to Parent" : "Message to Teacher"}
        </label>
        <textarea value={draft} onChange={e=>setDraft(e.target.value)}
          placeholder={isAdmin?"Write a reply to the parent...":"Write your message to the teacher..."}
          style={{...S.inputSm, width:"100%", boxSizing:"border-box", resize:"vertical", minHeight:80, lineHeight:1.6, marginBottom:10}}/>
        <button onClick={sendMessage} disabled={saving||!draft.trim()} style={{...S.btnPrimary, opacity:(!draft.trim()||saving)?0.5:1}}>
          {saving?"Sending...":"📤 Send Message"}
        </button>
      </div>
    </div>
  );
}

function PaymentSection({ student, onSave, canEdit }) {
  const [selYear, setSelYear] = useState(2026);
  const [selMonth, setSelMonth] = useState(MONTHS[new Date().getMonth()]);
  const [saving, setSaving] = useState(false);
  const payments = student.payments || EMPTY_PAYMENTS();
  const entry = payments?.[selYear]?.[selMonth] || { paid:null };

  const upd = async (field, val) => {
    setSaving(true);
    const u = JSON.parse(JSON.stringify(payments));
    u[selYear][selMonth][field] = val;
    await onSave({ ...student, payments: u });
    setSaving(false);
  };

  const paidColor = entry.paid===true?C.success:entry.paid===false?C.danger:C.textLight;

  return (
    <div style={S.card}>
      <p style={{color:C.primary, fontSize:13, fontWeight:"bold", letterSpacing:1, margin:"0 0 14px"}}>💳 PAYMENT STATUS</p>
      <div style={{display:"flex", gap:10, marginBottom:16, flexWrap:"wrap"}}>
        <div>
          <label style={{color:C.textMid, fontSize:12, display:"block", marginBottom:5, fontWeight:"bold"}}>YEAR</label>
          <select value={selYear} onChange={e=>setSelYear(Number(e.target.value))} style={{...S.inputSm, cursor:"pointer"}}>
            {YEARS.map(y=><option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label style={{color:C.textMid, fontSize:12, display:"block", marginBottom:5, fontWeight:"bold"}}>MONTH</label>
          <select value={selMonth} onChange={e=>setSelMonth(e.target.value)} style={{...S.inputSm, cursor:"pointer"}}>
            {MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:16, flexWrap:"wrap"}}>
        <div style={{background:entry.paid===true?"#e8f8e8":entry.paid===false?"#fdf0f0":"#f8f8f8", border:`1px solid ${paidColor}44`, borderRadius:10, padding:"10px 18px", display:"flex", alignItems:"center", gap:8}}>
          <span style={{fontSize:18}}>{entry.paid===true?"✅":entry.paid===false?"❌":"⏳"}</span>
          <span style={{color:paidColor, fontSize:15, fontWeight:"bold"}}>{entry.paid===true?"PAID":entry.paid===false?"NOT PAID":"NOT SET"}</span>
        </div>
        {canEdit && (
          <div style={{display:"flex", gap:8}}>
            <button onClick={()=>upd("paid",true)} style={{...S.btnGhost, borderColor:C.success, color:C.success, fontWeight:entry.paid===true?"bold":"normal", padding:"9px 16px"}} disabled={saving}>✓ Paid</button>
            <button onClick={()=>upd("paid",false)} style={{...S.btnDanger, fontWeight:entry.paid===false?"bold":"normal", padding:"9px 16px"}} disabled={saving}>✗ Not Paid</button>
          </div>
        )}
      </div>

      {/* Month overview */}
      <p style={{color:C.textMid, fontSize:12, fontWeight:"bold", margin:"0 0 8px"}}>{selYear} OVERVIEW</p>
      <div style={{display:"flex", flexWrap:"wrap", gap:5, marginBottom:14}}>
        {MONTHS.map(m=>{
          const p=payments?.[selYear]?.[m]?.paid;
          return <div key={m} onClick={()=>setSelMonth(m)} title={m} style={{width:30,height:30,borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:"bold",
            background:p===true?"#e8f8e8":p===false?"#fdf0f0":"#f0f4f0",
            border:`2px solid ${m===selMonth?C.primary:p===true?C.success:p===false?C.danger:C.border}`,
            color:p===true?C.success:p===false?C.danger:C.textLight}}>
            {m.slice(0,1)}
          </div>;
        })}
      </div>
      {saving && <p style={{color:C.textMid, fontSize:12, margin:0}}>Saving...</p>}
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

  // Sync local when student prop updates from Firebase
  useEffect(() => { setLocal(JSON.parse(JSON.stringify(student))); }, [student]);

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
    // Auto notify parent
    if(!u.notifications) u.notifications={admin:[],parent:[]};
    u.notifications.parent=[...(u.notifications.parent||[]),{text:`Teacher added feedback for ${selMonth} Week ${activeWeek+1}`,time:new Date().toLocaleString("en-AU"),read:false}];
    setLocal(u);
  };
  const fieldChange = (f,v) => setLocal(p=>({...p,[f]:v}));
  const summaryChange = (k,v) => setLocal(p=>({...p,summary:{...p.summary,[k]:v}}));

  const save = async () => {
    setSaving(true);
    await onSave(local);
    setSaving(false);
    setEditing(false);
  };
  const cancel = () => { setLocal(JSON.parse(JSON.stringify(student))); setEditing(false); };

  // Count unread notifications for current user
  const myNotifs = isAdmin
    ? (local.notifications?.admin||[]).filter(n=>!n.read)
    : (local.notifications?.parent||[]).filter(n=>!n.read);

  const clearNotifs = async () => {
    const u=JSON.parse(JSON.stringify(local));
    if(!u.notifications) u.notifications={admin:[],parent:[]};
    if(isAdmin) u.notifications.admin=(u.notifications.admin||[]).map(n=>({...n,read:true}));
    else u.notifications.parent=(u.notifications.parent||[]).map(n=>({...n,read:true}));
    setLocal(u);
    await onSave(u);
  };

  return (
    <div>
      <button onClick={onBack} style={{...S.btnGhost, marginBottom:16, border:"none", padding:"4px 0", display:"flex", alignItems:"center", gap:6, fontSize:15}}>← Back</button>

      {/* Notifications banner */}
      {myNotifs.length>0 && (
        <div style={{background:"#fff8e8", border:`1px solid #e0c060`, borderRadius:10, padding:"12px 16px", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <p style={{color:"#7a5a00", fontSize:14, margin:0}}>🔔 {myNotifs.length} new notification{myNotifs.length>1?"s":""}: {myNotifs[0].text}</p>
          <button onClick={clearNotifs} style={{background:"none", border:"none", color:"#7a5a00", cursor:"pointer", fontSize:13}}>Mark read</button>
        </div>
      )}

      {/* Header */}
      <div style={{display:"flex", alignItems:"center", gap:16, marginBottom:20, flexWrap:"wrap", background:"#fff", borderRadius:14, padding:18, border:`1px solid ${C.border}`, boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
        <Avatar student={local} size={60}/>
        <div style={{flex:1}}>
          {isAdmin&&editing ? (
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              <input value={local.name} onChange={e=>fieldChange("name",e.target.value)} placeholder="Student Name" style={{...S.inputSm, fontSize:16, fontWeight:"bold"}}/>
              <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
                <input value={local.grade} onChange={e=>fieldChange("grade",e.target.value)} placeholder="Grade / Class" style={{...S.inputSm, flex:1}}/>
                <input value={local.teacher} onChange={e=>fieldChange("teacher",e.target.value)} placeholder="Teacher Name" style={{...S.inputSm, flex:1}}/>
                <input type="number" min="0" max="100" value={local.progress} onChange={e=>fieldChange("progress",Number(e.target.value))} placeholder="%" style={{...S.inputSm, width:65}}/>
              </div>
              <div style={{display:"flex", gap:10}}>
                <label style={{color:C.textMid, fontSize:13, display:"flex", alignItems:"center", gap:6, cursor:"pointer"}}>
                  <input type="radio" checked={local.gender==="male"} onChange={()=>fieldChange("gender","male")}/> Male
                </label>
                <label style={{color:C.textMid, fontSize:13, display:"flex", alignItems:"center", gap:6, cursor:"pointer"}}>
                  <input type="radio" checked={local.gender==="female"} onChange={()=>fieldChange("gender","female")}/> Female
                </label>
              </div>
            </div>
          ) : (
            <>
              <h2 style={{color:C.text, margin:0, fontSize:22, fontWeight:"bold"}}>{local.name||"No name"}</h2>
              <p style={{color:C.textMid, margin:"4px 0 0", fontSize:14}}>{local.grade||"—"} · {local.teacher||"—"}</p>
            </>
          )}
        </div>
        <ProgressArc pct={local.progress}/>
      </div>

      {/* Edit button — always visible */}
      {isAdmin && (
        <div style={{marginBottom:16, display:"flex", gap:10}}>
          {editing
            ? <>
                <button onClick={save} style={{...S.btnPrimary, fontSize:15}} disabled={saving}>{saving?"Saving...":"✅ Save Changes"}</button>
                <button onClick={cancel} style={{...S.btnGhost, fontSize:15}}>Cancel</button>
              </>
            : <button onClick={()=>setEditing(true)} style={{...S.btnGold, fontSize:15, display:"flex", alignItems:"center", gap:8}}>✏️ Edit Student Data</button>
          }
        </div>
      )}

      {/* Tabs */}
      <div style={{display:"flex", gap:8, marginBottom:18, flexWrap:"wrap"}}>
        <button style={S.tab(tab==="progress")} onClick={()=>setTab("progress")}>📖 Qur'an Progress</button>
        <button style={S.tab(tab==="messages")} onClick={()=>setTab("messages")}>
          💬 Message to Teacher
          {(local.notifications?.admin||[]).filter(n=>!n.read).length>0 && isAdmin &&
            <span style={{background:C.danger, color:"#fff", borderRadius:"50%", fontSize:11, padding:"1px 6px", marginLeft:6}}>{(local.notifications.admin||[]).filter(n=>!n.read).length}</span>
          }
        </button>
        <button style={S.tab(tab==="payment")} onClick={()=>setTab("payment")}>💳 Payment</button>
      </div>

      {tab==="progress" && (
        <>
          <div style={{display:"flex", gap:10, marginBottom:14, flexWrap:"wrap", alignItems:"flex-end"}}>
            <div>
              <label style={{color:C.textMid, fontSize:12, fontWeight:"bold", display:"block", marginBottom:5}}>YEAR</label>
              <select value={selYear} onChange={e=>{setSelYear(Number(e.target.value));setActiveWeek(0);}} style={{...S.inputSm, cursor:"pointer", color:C.primary, fontWeight:"bold"}}>
                {YEARS.map(y=><option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label style={{color:C.textMid, fontSize:12, fontWeight:"bold", display:"block", marginBottom:5}}>MONTH</label>
              <select value={selMonth} onChange={e=>{setSelMonth(e.target.value);setActiveWeek(0);}} style={{...S.inputSm, cursor:"pointer"}}>
                {MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:12}}>
            <div style={{height:2, flex:1, background:`linear-gradient(90deg,transparent,${C.border})`}}/>
            <span style={{color:C.primary, fontSize:13, fontWeight:"bold", letterSpacing:1}}>{selMonth.toUpperCase()} {selYear}</span>
            <div style={{height:2, flex:1, background:`linear-gradient(90deg,${C.border},transparent)`}}/>
          </div>

          <div style={{display:"flex", gap:8, marginBottom:14, flexWrap:"wrap"}}>
            {getWeeks().map((w,i)=>(
              <button key={i} onClick={()=>setActiveWeek(i)} style={{padding:"8px 18px", borderRadius:20, border:`1.5px solid ${activeWeek===i?C.primary:C.border}`, background:activeWeek===i?"#e8f4e8":"#fff", color:activeWeek===i?C.primary:C.textMid, fontSize:14, cursor:"pointer", fontFamily:"Georgia,serif", fontWeight:activeWeek===i?"bold":"normal"}}>
                Week {w.week}
              </button>
            ))}
          </div>

          <div style={{marginBottom:18}}>
            <WeekTable weekData={getWeeks()[activeWeek]} editing={isAdmin&&editing} onCellChange={cellChange} onFeedbackChange={feedbackChange}/>
          </div>

          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14}}>
            <div style={{...S.card, borderLeft:`4px solid ${C.success}`}}>
              <p style={{color:C.success, fontSize:12, fontWeight:"bold", letterSpacing:1, margin:"0 0 8px"}}>✦ STRENGTHS</p>
              {isAdmin&&editing
                ? <textarea value={local.summary.strengths} onChange={e=>summaryChange("strengths",e.target.value)} placeholder="Enter strengths..." style={{...S.inputSm, width:"100%", boxSizing:"border-box", resize:"vertical", minHeight:65}}/>
                : <p style={{color:local.summary.strengths?C.text:C.textLight, fontSize:14, margin:0, lineHeight:1.6}}>{local.summary.strengths||"Not filled yet"}</p>
              }
            </div>
            <div style={{...S.card, borderLeft:"4px solid #e0a030"}}>
              <p style={{color:"#b07020", fontSize:12, fontWeight:"bold", letterSpacing:1, margin:"0 0 8px"}}>✦ TO IMPROVE</p>
              {isAdmin&&editing
                ? <textarea value={local.summary.improve} onChange={e=>summaryChange("improve",e.target.value)} placeholder="Areas to improve..." style={{...S.inputSm, width:"100%", boxSizing:"border-box", resize:"vertical", minHeight:65}}/>
                : <p style={{color:local.summary.improve?C.text:C.textLight, fontSize:14, margin:0, lineHeight:1.6}}>{local.summary.improve||"Not filled yet"}</p>
              }
            </div>
          </div>
        </>
      )}

      {tab==="messages" && <MessageSection student={local} isAdmin={isAdmin} onSave={onSave}/>}
      {tab==="payment" && <PaymentSection student={local} onSave={onSave} canEdit={isParent||isAdmin}/>}
    </div>
  );
}

function StudentCard({ student, onSelect, unreadCount=0 }) {
  return (
    <button onClick={()=>onSelect(student)} style={{background:"#fff", border:`1px solid ${C.border}`, borderRadius:14, padding:18, cursor:"pointer", textAlign:"left", fontFamily:"Georgia,serif", display:"flex", alignItems:"center", gap:14, width:"100%", transition:"all 0.15s", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", position:"relative"}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.primary;e.currentTarget.style.boxShadow="0 4px 16px rgba(45,106,45,0.12)";}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.04)";}}>
      {unreadCount>0 && (
        <div style={{position:"absolute", top:10, right:10, background:C.danger, color:"#fff", borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:"bold"}}>
          {unreadCount}
        </div>
      )}
      <Avatar student={student} size={52}/>
      <div style={{flex:1}}>
        <p style={{color:student.name?C.text:"#aaa", fontSize:15, margin:"0 0 3px", fontWeight:"bold"}}>{student.name||"Empty Slot"}</p>
        <p style={{color:C.textMid, fontSize:13, margin:"0 0 8px"}}>{student.grade||"—"} · {student.teacher||"—"}</p>
        <div style={{background:"#e8f0e8", borderRadius:4, height:6, overflow:"hidden"}}>
          <div style={{width:`${student.progress}%`, height:"100%", background:`linear-gradient(90deg,${C.primary},#5a9a5a)`, borderRadius:4}}/>
        </div>
        <p style={{color:student.progress>0?C.primary:C.textLight, fontSize:12, margin:"4px 0 0"}}>{student.progress>0?`${student.progress}% completed`:"Not started"}</p>
      </div>
    </button>
  );
}

function NewStudentSlot({ id, onSetup }) {
  const [type, setType] = useState(null);
  return (
    <div style={{background:"#fafcfa", border:`1.5px dashed ${C.border}`, borderRadius:14, padding:18, textAlign:"center"}}>
      <div style={{width:52, height:52, borderRadius:"50%", background:"#f0f4f0", border:`2px dashed ${C.border}`, margin:"0 auto 10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, color:C.textLight}}>+</div>
      <p style={{color:C.textLight, fontSize:13, margin:"0 0 12px"}}>Future Student Slot #{id}</p>
      {!type ? (
        <div style={{display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap"}}>
          <button onClick={()=>onSetup(id,"individual")} style={{...S.btnGhost, fontSize:12, padding:"7px 14px"}}>🧑 Individual</button>
          <button onClick={()=>onSetup(id,"family")} style={{...S.btnGhost, fontSize:12, padding:"7px 14px"}}>👨‍👩‍👧‍👦 Family</button>
        </div>
      ) : (
        <p style={{color:C.primary, fontSize:12}}>Setting up as {type}...</p>
      )}
    </div>
  );
}

function AdminView({ students, onSelect, onSetupSlot }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const familyIds = FAMILY_GROUPS.flatMap(g=>g.ids);
  const activeStudents = students.filter(s=>s.name);
  const emptySlots = students.filter(s=>!s.name);
  const individual = activeStudents.filter(s=>!familyIds.includes(s.id)).sort((a,b)=>a.name.localeCompare(b.name));

  const getUnread = (s) => (s.notifications?.admin||[]).filter(n=>!n.read).length;

  const filtered = search.trim()
    ? activeStudents.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>a.name.localeCompare(b.name))
    : null;

  const divider = (label) => (
    <div style={{display:"flex", alignItems:"center", gap:10, margin:"20px 0 12px"}}>
      <div style={{height:2, flex:1, background:`linear-gradient(90deg,${C.border},transparent)`}}/>
      <span style={{color:C.primary, fontSize:12, fontWeight:"bold", letterSpacing:2, background:"#f0f4f0", padding:"4px 12px", borderRadius:20, border:`1px solid ${C.border}`}}>{label}</span>
      <div style={{height:2, flex:1, background:`linear-gradient(90deg,transparent,${C.border})`}}/>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex", gap:10, marginBottom:18, flexWrap:"wrap"}}>
        <div style={{position:"relative", flex:1, minWidth:180}}>
          <span style={{position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.textLight, fontSize:15}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search student name..."
            style={{...S.input, paddingLeft:38, fontSize:14}}/>
          {search && <button onClick={()=>setSearch("")} style={{position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:C.textLight, cursor:"pointer", fontSize:16}}>✕</button>}
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{...S.inputSm, cursor:"pointer", color:C.primary, fontWeight:"bold"}}>
          <option value="all">👥 All Students</option>
          <option value="individual">🧑 Individual</option>
          <option value="families">👨‍👩‍👧‍👦 Families</option>
        </select>
      </div>

      {filtered ? (
        filtered.length===0
          ? <p style={{color:C.textLight, fontStyle:"italic", fontSize:14}}>No students found.</p>
          : <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12}}>
              {filtered.map(s=><StudentCard key={s.id} student={s} onSelect={onSelect} unreadCount={getUnread(s)}/>)}
            </div>
      ) : (
        <>
          {(filter==="all"||filter==="individual") && (
            <>
              {divider(`INDIVIDUAL STUDENTS (${individual.length})`)}
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12}}>
                {individual.map(s=><StudentCard key={s.id} student={s} onSelect={onSelect} unreadCount={getUnread(s)}/>)}
              </div>
            </>
          )}
          {(filter==="all"||filter==="families") && (
            <>
              {divider(`FAMILY GROUPS (${FAMILY_GROUPS.length})`)}
              <div style={{display:"flex", flexDirection:"column", gap:14}}>
                {FAMILY_GROUPS.map(group=>{
                  const gs=group.ids.map(id=>students.find(s=>s.id===id)).filter(Boolean).sort((a,b)=>a.name.localeCompare(b.name));
                  if(!gs.length) return null;
                  return (
                    <div key={group.label} style={{background:"#f8fcf8", border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 14px 12px"}}>
                      <p style={{color:C.primary, fontSize:13, fontWeight:"bold", margin:"0 0 12px"}}>👨‍👩‍👧‍👦 {group.label.toUpperCase()} · {gs.length} students</p>
                      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:10}}>
                        {gs.map(s=><StudentCard key={s.id} student={s} onSelect={onSelect} unreadCount={getUnread(s)}/>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {filter==="all" && emptySlots.length>0 && (
            <>
              {divider(`FUTURE STUDENTS — ${emptySlots.length} SLOTS`)}
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12}}>
                {emptySlots.map(s=><NewStudentSlot key={s.id} id={s.id} onSetup={onSetupSlot}/>)}
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
  const [selected, setSelected] = useState(null);
  const isAdmin = account.role==="admin";
  const isParent = account.role==="parent";
  const visibleStudents = students.filter(s=>isAdmin?true:account.studentIds.includes(s.id));

  // Total unread notifications for admin badge
  const totalUnread = isAdmin
    ? students.reduce((sum,s)=>sum+((s.notifications?.admin||[]).filter(n=>!n.read).length),0)
    : 0;

  useEffect(() => {
    const unsubs = STUDENTS.map(s => {
      const ref = doc(db,"students",String(s.id));
      return onSnapshot(ref, snap => {
        if(snap.exists()) {
          const data=snap.data();
          setStudents(prev=>prev.map(p=>p.id===s.id?{...p,...data}:p));
          setSelected(prev=>prev&&prev.id===s.id?{...prev,...data}:prev);
        }
      });
    });
    return ()=>unsubs.forEach(u=>u());
  }, []);

  const handleSave = async (updated) => {
    try { await setDoc(doc(db,"students",String(updated.id)), updated); } catch(e) { console.error(e); }
    setStudents(prev=>prev.map(s=>s.id===updated.id?updated:s));
    setSelected(updated);
  };

  const handleSetupSlot = (id, type) => {
    const s = students.find(st=>st.id===id);
    if(s) setSelected({...s, _setupType:type});
  };

  // Parent notifications across all their students
  const parentUnread = isParent
    ? visibleStudents.reduce((sum,s)=>sum+((s.notifications?.parent||[]).filter(n=>!n.read).length),0)
    : 0;

  return (
    <div style={{minHeight:"100vh", background:C.bg, fontFamily:"Georgia,serif"}}>
      <div style={{maxWidth:920, margin:"0 auto", padding:"20px 18px"}}>
        {/* Header */}
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, background:"#fff", borderRadius:14, padding:"16px 20px", border:`1px solid ${C.border}`, boxShadow:"0 2px 8px rgba(0,0,0,0.04)", flexWrap:"wrap", gap:10}}>
          <div style={{display:"flex", alignItems:"center", gap:14}}>
            <div style={{width:46, height:46, borderRadius:"50%", background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:C.goldLight, fontWeight:"bold", border:`2px solid ${C.goldLight}`, flexShrink:0}}>DN</div>
            <div>
              <h1 style={{color:C.primary, fontSize:18, margin:0, fontWeight:"bold", letterSpacing:1}}>Darul Noor Education Hub</h1>
              <p style={{color:C.textMid, fontSize:12, margin:"2px 0 0"}}>
                {isAdmin?"Admin Dashboard":"Parent Portal"} · Qur'an Tracker
                <span style={{color:C.success, marginLeft:8, fontSize:11}}>● Live</span>
              </p>
            </div>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            {(totalUnread>0||parentUnread>0) && (
              <div style={{background:"#fff8e8", border:"1px solid #e0c060", borderRadius:20, padding:"6px 14px", display:"flex", alignItems:"center", gap:6}}>
                <span style={{fontSize:16}}>🔔</span>
                <span style={{color:"#7a5a00", fontSize:13, fontWeight:"bold"}}>{isAdmin?totalUnread:parentUnread} new</span>
              </div>
            )}
            <button onClick={onLogout} style={{...S.btnGhost, padding:"8px 16px", fontSize:13}}>Sign Out</button>
          </div>
        </div>

        {selected ? (
          <StudentDetail student={selected} onBack={()=>setSelected(null)} isAdmin={isAdmin} isParent={isParent} onSave={handleSave}/>
        ) : (
          <>
            <p style={{color:C.textMid, fontSize:14, marginBottom:16}}>
              {isAdmin?`${visibleStudents.filter(s=>s.name).length} students`:visibleStudents.length>1?`${visibleStudents.length} children`:"Your child's progress"}
            </p>
            {isAdmin
              ? <AdminView students={visibleStudents} onSelect={setSelected} onSetupSlot={handleSetupSlot}/>
              : <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14}}>
                  {visibleStudents.map(s=>{
                    const unread=(s.notifications?.parent||[]).filter(n=>!n.read).length;
                    return <StudentCard key={s.id} student={s} onSelect={setSelected} unreadCount={unread}/>;
                  })}
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
