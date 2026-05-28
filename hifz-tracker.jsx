import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, collection, addDoc, query, orderBy } from "firebase/firestore";

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
  week: w, days: DAYS.map(d => ({ day: d, sabq: "", manzil: "", notes: "" })), teacherFeedback: ""
}));
const EMPTY_PROGRESS = () => {
  const r = {}; YEARS.forEach(y => { r[y] = {}; MONTHS.forEach(m => { r[y][m] = EMPTY_WEEKS(); }); }); return r;
};
const EMPTY_PAYMENTS = () => {
  const r = {}; YEARS.forEach(y => { r[y] = {}; MONTHS.forEach(m => { r[y][m] = { paid: null }; }); }); return r;
};
const makeStudent = (id, name, gender="") => ({
  id, name, grade: "", teacher: "", progress: 0, gender,
  summary: { strengths: "", improve: "" },
  quranProgress: EMPTY_PROGRESS(),
  payments: EMPTY_PAYMENTS(),
  messages: [],
  adminNotifs: [],
  parentNotifs: [],
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
  makeStudent(29,"",""), makeStudent(30,"",""), makeStudent(31,"",""),
  makeStudent(32,"",""), makeStudent(33,"",""),
  makeStudent(34,"Muhammad Aayan Ali","male"), makeStudent(35,"Aaisha Ali","female"),
  makeStudent(36,"Qemr D","female"), makeStudent(37,"Nihili D","female"), makeStudent(38,"Fatima D","female"),
  makeStudent(39,"",""), makeStudent(40,"",""), makeStudent(41,"",""),
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
  { login:"family.ali@darulnoor", password:"ali123", role:"parent", studentIds:[34,35] },
  { login:"family.d@darulnoor", password:"dfamily123", role:"parent", studentIds:[36,37,38] },
];

const FAMILY_GROUPS = [
  { label:"Nawed Family", ids:[3,4] },
  { label:"Munsi Family", ids:[12,13] },
  { label:"Yusuf & Aisha Family", ids:[14,15] },
  { label:"Muhammad & Fatima Family", ids:[16,17,18,19] },
  { label:"Abdul Aziz Family", ids:[21,22] },
  { label:"Siddik Family", ids:[24,25,26] },
  { label:"Ali Family", ids:[34,35] },
  { label:"D Family", ids:[36,37,38] },
];

const FUTURE_FAMILY_SLOTS = [
  { label:"Future Family A", ids:[39] },
  { label:"Future Family B", ids:[40] },
  { label:"Future Family C", ids:[41] },
];

// ── Avatars matching reference images exactly ──
function MaleAvatar({ size=64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="260" fill="#e8ebe8" rx="8"/>
      {/* Kufi cap top dome */}
      <path d="M55 90 Q55 30 100 28 Q145 30 145 90 Z" fill="#4a4a4a"/>
      {/* Kufi decorative band */}
      <rect x="48" y="85" width="104" height="22" rx="3" fill="#3a3a3a"/>
      {/* Band pattern - zigzag lines */}
      <path d="M52 90 L58 96 L64 90 L70 96 L76 90 L82 96 L88 90 L94 96 L100 90 L106 96 L112 90 L118 96 L124 90 L130 96 L136 90 L142 96 L148 90" fill="none" stroke="#888" strokeWidth="1.5"/>
      <path d="M52 98 L58 92 L64 98 L70 92 L76 98 L82 92 L88 98 L94 92 L100 98 L106 92 L112 98 L118 92 L124 98 L130 92 L136 98 L142 92 L148 98" fill="none" stroke="#888" strokeWidth="1.5"/>
      {/* Head silhouette - no face */}
      <path d="M58 104 Q56 90 100 88 Q144 90 142 104 Q144 140 136 155 Q122 168 100 170 Q78 168 64 155 Q56 140 58 104Z" fill="#4a4a4a"/>
      {/* Ear left */}
      <ellipse cx="57" cy="130" rx="8" ry="12" fill="#4a4a4a"/>
      {/* Ear right */}
      <ellipse cx="143" cy="130" rx="8" ry="12" fill="#4a4a4a"/>
      {/* Neck */}
      <rect x="86" y="168" width="28" height="22" rx="4" fill="#484848"/>
      {/* Thobe collar/body */}
      <path d="M20 260 Q18 210 45 196 Q65 188 82 186 L86 190 L100 195 L114 190 L118 186 Q135 188 155 196 Q182 210 180 260Z" fill="#4a4a4a"/>
      {/* Collar center line */}
      <path d="M95 190 L95 210 M105 190 L105 210" stroke="#5a5a5a" strokeWidth="2"/>
      <rect x="94" y="188" width="12" height="6" rx="2" fill="#3a3a3a"/>
    </svg>
  );
}

function FemaleAvatar({ size=64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="260" fill="#eaeae6" rx="8"/>
      {/* Hijab outer - large flowing shape */}
      <path d="M18 260 Q14 190 22 160 Q28 138 36 122 Q40 90 100 72 Q160 90 164 122 Q172 138 178 160 Q186 190 182 260Z" fill="#5a5a5a"/>
      {/* Hijab top dome */}
      <path d="M36 120 Q36 68 100 65 Q164 68 164 120 Q150 100 100 97 Q50 100 36 120Z" fill="#4a4a4a"/>
      {/* Face opening - dark oval, no features */}
      <ellipse cx="100" cy="138" rx="46" ry="52" fill="#3a3a3a"/>
      {/* Hijab side fold left */}
      <path d="M18 180 Q14 210 18 240 Q24 220 32 200 Q28 192 24 180Z" fill="#4a4a4a"/>
      {/* Hijab side fold right */}
      <path d="M182 180 Q186 210 182 240 Q176 220 168 200 Q172 192 176 180Z" fill="#4a4a4a"/>
      {/* Hijab inner fold curves */}
      <path d="M40 175 Q60 195 100 198 Q140 195 160 175" fill="none" stroke="#6a6a6a" strokeWidth="3"/>
      <path d="M30 210 Q60 235 100 238 Q140 235 170 210" fill="none" stroke="#6a6a6a" strokeWidth="2.5"/>
      {/* Abaya body */}
      <path d="M18 260 Q20 230 28 218 Q40 205 60 200 Q75 205 100 208 Q125 205 140 200 Q160 205 172 218 Q180 230 182 260Z" fill="#525252"/>
    </svg>
  );
}

function UnknownAvatar({ size=64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#f0f4f0"/>
      <circle cx="50" cy="50" r="47" fill="none" stroke="#c0d4c0" strokeWidth="2" strokeDasharray="6 4"/>
      <text x="50" y="60" textAnchor="middle" fill="#90a890" fontSize="36" fontFamily="Georgia,serif">?</text>
    </svg>
  );
}

function Avatar({ student, size=64 }) {
  if (!student.name) return <UnknownAvatar size={size}/>;
  if (student.gender==="male") return <MaleAvatar size={size}/>;
  if (student.gender==="female") return <FemaleAvatar size={size}/>;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#e0eee0"/>
      <text x="50" y="66" textAnchor="middle" fill="#2d6a2d" fontSize="42" fontWeight="bold" fontFamily="Georgia,serif">{student.name.charAt(0).toUpperCase()}</text>
    </svg>
  );
}

// ── Design System ──
const FONT = "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif";
const C = {
  bg:"#F5F7F5", bgSubtle:"#EDF4ED", card:"#FFFFFF", cardHover:"#F8FBF8",
  primary:"#1B5E20", primaryMid:"#2E7D32", primaryLight:"#4CAF50", primaryBg:"#E8F5E9",
  gold:"#9E6C00", goldLight:"#F9A825", goldBg:"#FFFDE7",
  border:"#C8E6C9", borderMid:"#A5D6A7",
  text:"#1A1A1A", textBody:"#2D3A2D", textMid:"#4E6B4E", textLight:"#7A977A", textMuted:"#AAC0AA",
  success:"#2E7D32", successBg:"#E8F5E9",
  danger:"#C62828", dangerBg:"#FFEBEE",
  warning:"#E65100", warningBg:"#FFF3E0",
  notif:"#D32F2F", announce:"#E65100",
};
const T = { xs:12, sm:14, base:16, lg:18, xl:22, xxl:28 };
const SH = {
  sm:"0 1px 4px rgba(0,0,0,0.06)",
  md:"0 3px 12px rgba(0,0,0,0.08)",
  lg:"0 6px 24px rgba(0,0,0,0.10)",
  xl:"0 10px 40px rgba(0,0,0,0.12)",
};
const S = {
  input:{ width:"100%", background:"#FAFFFE", border:"1.5px solid #C8E6C9", borderRadius:10, padding:"13px 16px", color:"#1A1A1A", fontSize:16, outline:"none", boxSizing:"border-box", fontFamily:"'Inter','Segoe UI',sans-serif" },
  inputSm:{ background:"#FAFFFE", border:"1.5px solid #C8E6C9", borderRadius:8, padding:"9px 13px", color:"#1A1A1A", fontSize:14, outline:"none", fontFamily:"'Inter','Segoe UI',sans-serif" },
  btnPrimary:{ background:"linear-gradient(135deg,#2E7D32,#1B5E20)", border:"none", borderRadius:10, padding:"12px 24px", color:"#fff", fontSize:16, fontWeight:"700", cursor:"pointer", fontFamily:"'Inter','Segoe UI',sans-serif", boxShadow:"0 2px 8px rgba(27,94,32,0.3)" },
  btnGold:{ background:"linear-gradient(135deg,#F9A825,#9E6C00)", border:"none", borderRadius:10, padding:"12px 24px", color:"#fff", fontSize:16, fontWeight:"700", cursor:"pointer", fontFamily:"'Inter','Segoe UI',sans-serif", boxShadow:"0 2px 8px rgba(158,108,0,0.25)" },
  btnGhost:{ background:"transparent", border:"2px solid #2E7D32", borderRadius:10, padding:"10px 22px", color:"#2E7D32", fontSize:16, cursor:"pointer", fontFamily:"'Inter','Segoe UI',sans-serif", fontWeight:"600" },
  btnDanger:{ background:"transparent", border:"2px solid #C62828", borderRadius:10, padding:"10px 22px", color:"#C62828", fontSize:16, cursor:"pointer", fontFamily:"'Inter','Segoe UI',sans-serif" },
  btnSuccess:{ background:"linear-gradient(135deg,#4CAF50,#2E7D32)", border:"none", borderRadius:10, padding:"10px 22px", color:"#fff", fontSize:16, fontWeight:"700", cursor:"pointer", fontFamily:"'Inter','Segoe UI',sans-serif" },
  tab:(a)=>({ padding:"10px 22px", borderRadius:24, border:a?"2px solid #2E7D32":"2px solid #C8E6C9", background:a?"#E8F5E9":"#fff", color:a?"#1B5E20":"#4E6B4E", fontSize:14, cursor:"pointer", fontFamily:"'Inter','Segoe UI',sans-serif", fontWeight:a?"700":"400" }),
  card:{ background:"#fff", border:"1px solid #C8E6C9", borderRadius:16, padding:24, boxShadow:"0 2px 10px rgba(0,0,0,0.05)" },
};


// ── Announcement Badge ──
function AnnouncementBadge({ announcements, isAdmin, onAdd, onDelete }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const unread = announcements.filter(a => !a.read).length;

  const handleAdd = async () => {
    if (!title.trim() || !draft.trim()) return;
    setSaving(true);
    await onAdd({ title: title.trim(), text: draft.trim(), time: new Date().toLocaleString("en-AU"), read: false });
    setTitle(""); setDraft(""); setSaving(false);
  };

  return (
    <div style={{position:"relative"}}>
      <button onClick={()=>setOpen(p=>!p)} style={{background:unread>0?"#fff8e8":"#f8f8f8", border:`1.5px solid ${unread>0?"#e0c060":C.border}`, borderRadius:12, padding:"10px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:8, fontSize:22, position:"relative"}}>
        📢
        {unread>0 && <span style={{position:"absolute", top:-8, right:-8, background:"#e67e22", color:"#fff", borderRadius:"50%", minWidth:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:"bold", fontFamily:"'Inter','Segoe UI',sans-serif", padding:"0 4px"}}>{unread}</span>}
      </button>

      {open && (
        <div style={{position:"absolute", top:60, right:0, width:360, background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:16, boxShadow:"0 8px 32px rgba(0,0,0,0.12)", zIndex:1000, overflow:"hidden"}}>
          {/* Header */}
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px", borderBottom:`1px solid ${C.border}`, background:"#FFF3E0"}}>
            <p style={{color:"#E65100", fontSize:16, fontWeight:"bold", margin:0}}>📢 Announcements</p>
            <button onClick={()=>setOpen(false)} style={{background:"none", border:"none", color:C.textLight, cursor:"pointer", fontSize:20}}>✕</button>
          </div>

          {/* Admin: compose new announcement */}
          {isAdmin && (
            <div style={{padding:"14px 18px", borderBottom:`1px solid ${C.border}`, background:"#fffdf8"}}>
              <p style={{color:C.textMid, fontSize:13, fontWeight:"bold", margin:"0 0 8px"}}>NEW ANNOUNCEMENT</p>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title (e.g. Holiday Notice)"
                style={{...S.inputSm, width:"100%", boxSizing:"border-box", marginBottom:8, fontSize:14}}/>
              <textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Write your announcement here..."
                style={{...S.inputSm, width:"100%", boxSizing:"border-box", resize:"vertical", minHeight:70, lineHeight:1.5, marginBottom:10}}/>
              <button onClick={handleAdd} disabled={saving||!title.trim()||!draft.trim()}
                style={{...S.btnGold, fontSize:14, padding:"9px 18px", opacity:(saving||!title.trim()||!draft.trim())?0.5:1}}>
                {saving?"Posting...":"📤 Post Announcement"}
              </button>
            </div>
          )}

          {/* Announcement list */}
          <div style={{maxHeight:320, overflowY:"auto"}}>
            {announcements.length===0
              ? <p style={{color:C.textLight, fontSize:14, margin:"20px", textAlign:"center", fontStyle:"italic"}}>No announcements yet.</p>
              : [...announcements].reverse().map((a,i)=>(
                <div key={i} style={{padding:"14px 18px", borderBottom:`1px solid ${C.border}`, background:a.read?"#fff":"#fffbf0"}}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8}}>
                    <div style={{flex:1}}>
                      <p style={{color:C.text, fontSize:15, fontWeight:"bold", margin:"0 0 5px"}}>{a.title}</p>
                      <p style={{color:C.text, fontSize:14, margin:"0 0 6px", lineHeight:1.5}}>{a.text}</p>
                      <p style={{color:C.textLight, fontSize:12, margin:0}}>📅 {a.time}</p>
                    </div>
                    {isAdmin && (
                      <button onClick={()=>onDelete(announcements.length-1-i)} style={{background:"none", border:"none", color:C.danger, cursor:"pointer", fontSize:16, flexShrink:0, padding:"2px 6px"}}>🗑️</button>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ── Announcement Board ──
function AnnouncementBoard({announcements,isAdmin,onMarkAllRead,onDelete}){
  const [collapsed,setCollapsed]=useState(false);
  const unread=announcements.filter(a=>!a.read).length;
  const sorted=[...announcements].reverse();
  if(!sorted.length&&!isAdmin)return null;
  const al=unread>0;
  return(
    <div style={{marginBottom:22,borderRadius:16,overflow:"hidden",border:`2px solid ${al?"#EF9A9A":"#A5D6A7"}`,boxShadow:al?"0 4px 20px rgba(183,28,28,0.12)":"0 2px 10px rgba(27,94,32,0.08)"}}>
      <div style={{background:al?"linear-gradient(135deg,#B71C1C,#D32F2F)":"linear-gradient(135deg,#2E7D32,#1B5E20)",padding:"13px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}} onClick={()=>setCollapsed(p=>!p)}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:22}}>📋</span>
          <span style={{color:"#fff",fontSize:16,fontWeight:"800",letterSpacing:1}}>NOTICE BOARD</span>
          {al?<span style={{background:"#fff",color:"#B71C1C",fontSize:13,fontWeight:"bold",borderRadius:20,padding:"2px 12px"}}>{unread} NEW</span>
             :<span style={{color:"rgba(255,255,255,0.75)",fontSize:13}}>All up to date</span>}
        </div>
        <span style={{color:"#fff",fontSize:18,transform:collapsed?"rotate(-90deg)":"rotate(0deg)",transition:"transform 0.2s"}}>▾</span>
      </div>
      {!collapsed&&(
        <div style={{background:al?"#FFF8F8":"#F8FFF8",padding:"16px 18px",display:"flex",flexDirection:"column",gap:12}}>
          {!sorted.length&&<p style={{color:C.textLight,fontSize:14,textAlign:"center",fontStyle:"italic",margin:"8px 0"}}>No announcements yet.</p>}
          {sorted.map((a,i)=>(
            <div key={i} style={{background:a.read?"#fff":al?"#fff5f5":"#f0fff0",border:`2px solid ${a.read?C.border:al?"#EF9A9A":"#81C784"}`,borderLeft:`6px solid ${a.read?C.borderMid:al?"#D32F2F":"#2E7D32"}`,borderRadius:12,padding:"14px 16px",position:"relative"}}>
              {!a.read&&<span style={{position:"absolute",top:10,right:12,background:al?"#D32F2F":C.primary,color:"#fff",fontSize:11,fontWeight:"bold",borderRadius:10,padding:"2px 9px",letterSpacing:1}}>NEW</span>}
              <p style={{color:a.read?C.textMid:"#B71C1C",fontSize:16,fontWeight:"800",margin:"0 0 6px",paddingRight:50,lineHeight:1.3}}>{a.title}</p>
              <p style={{color:a.read?C.textBody:C.text,fontSize:15,margin:"0 0 8px",lineHeight:1.6,fontWeight:a.read?"normal":"500"}}>{a.text}</p>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
                <p style={{color:C.textLight,fontSize:12,margin:0}}>📅 {a.time}</p>
                {isAdmin&&<button onClick={()=>onDelete(announcements.length-1-i)} style={{background:"none",border:`1px solid ${C.danger}`,borderRadius:8,padding:"4px 12px",color:C.danger,cursor:"pointer",fontSize:13,fontFamily:FONT}}>🗑 Delete</button>}
              </div>
            </div>
          ))}
          {!isAdmin&&unread>0&&<button onClick={onMarkAllRead} style={{...S.btnGhost,alignSelf:"flex-end",fontSize:14,padding:"8px 18px",borderColor:"#B71C1C",color:"#B71C1C"}}>✓ Mark all as read</button>}
        </div>
      )}
    </div>
  );
}

// ── Login Screen ──
function LoginScreen({ onLogin }) {
  const [login, setLogin] = useState(()=>{ try{return localStorage.getItem("dn_login")||"";}catch{return "";} });
  const [password, setPassword] = useState(()=>{ try{return localStorage.getItem("dn_pass")||"";}catch{return "";} });
  const [remember, setRemember] = useState(()=>{ try{return !!localStorage.getItem("dn_login");}catch{return false;} });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    const acc = ACCOUNTS.find(a=>a.login===login.trim().toLowerCase()&&a.password.toLowerCase()===password.trim().toLowerCase());
    if(acc){ if(remember){try{localStorage.setItem("dn_login",login.trim().toLowerCase());localStorage.setItem("dn_pass",password.trim());}catch{}} else{try{localStorage.removeItem("dn_login");localStorage.removeItem("dn_pass");}catch{}} onLogin(acc); }
    else setError("Incorrect login or password. Please try again.");
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#EDF4ED 0%,#F5F7F5 50%,#E8F5E9 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <div style={{width:"100%",maxWidth:440,padding:"0 24px"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:120,height:120,borderRadius:"50%",background:"#fff",border:`3px solid ${C.goldLight}`,boxShadow:"0 6px 28px rgba(139,105,20,0.18)",margin:"0 auto 18px",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
            <div style={{color:C.gold,fontSize:32,fontWeight:"bold",lineHeight:1}}>DN</div>
            <div style={{color:C.goldLight,fontSize:10,letterSpacing:2,marginTop:5}}>دار النور</div>
          </div>
          <h1 style={{color:C.primary,fontSize:28,fontWeight:"bold",letterSpacing:2,margin:"0 0 4px"}}>DARUL NOOR</h1>
          <p style={{color:C.textMid,fontSize:14,letterSpacing:3,margin:0}}>EDUCATION HUB</p>
          <div style={{width:60,height:2,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,margin:"12px auto"}}/>
          <p style={{color:C.textLight,fontSize:13,letterSpacing:2,margin:0}}>QUR'AN TRACKER</p>
        </div>
        <div style={{background:"#fff",border:"1.5px solid #C8E6C9",borderRadius:20,padding:36,boxShadow:"0 10px 40px rgba(0,0,0,0.10)"}}>
          <div style={{marginBottom:18}}>
            <label style={{color:C.textMid,fontSize:15,display:"block",marginBottom:8,fontWeight:"bold"}}>Login ID</label>
            <input value={login} onChange={e=>setLogin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={S.input} placeholder="Enter your login ID" onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}/>
          </div>
          <div style={{marginBottom:22}}>
            <label style={{color:C.textMid,fontSize:15,display:"block",marginBottom:8,fontWeight:"bold"}}>Password</label>
            <div style={{position:"relative"}}>
              <input type={showPwd?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{...S.input,paddingRight:48}} placeholder="Enter your password" onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}/>
              <button onClick={()=>setShowPwd(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.textLight,fontSize:20,padding:2}}>{showPwd?"🙈":"👁️"}</button>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,cursor:"pointer"}} onClick={()=>setRemember(r=>!r)}>
            <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${C.primary}`,background:remember?C.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {remember&&<span style={{color:"#fff",fontSize:14,lineHeight:1}}>✓</span>}
            </div>
            <span style={{color:C.textMid,fontSize:15,userSelect:"none"}}>Remember me</span>
          </div>
          {error&&<div style={{background:"#fdf0f0",border:"1px solid #f0c0c0",borderRadius:10,padding:"12px 16px",marginBottom:16}}><p style={{color:C.danger,fontSize:15,margin:0}}>⚠ {error}</p></div>}
          <button onClick={handleLogin} style={{...S.btnPrimary,width:"100%",padding:"14px",fontSize:17}}>Sign In</button>
        </div>
        <p style={{color:C.textLight,fontSize:14,textAlign:"center",marginTop:18}}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
      </div>
    </div>
  );
}

// ── Progress Arc ──
function ProgressArc({ pct }) {
  const r=28,cx=36,cy=36,stroke=6,circ=2*Math.PI*r,dash=(pct/100)*circ;
  return (
    <svg width="72" height="72">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ddeedd" strokeWidth={stroke}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.primary} strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ/4} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}/>
      <text x={cx} y={cy+6} textAnchor="middle" fill={C.primary} fontSize="14" fontWeight="bold">{pct}%</text>
    </svg>
  );
}

// ── Week Table ──
function WeekTable({ weekData, editing, onCellChange, onFeedbackChange }) {
  return (
    <div style={{border:`1.5px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:15}}>
          <thead>
            <tr style={{background:"#E8F5E9"}}>
              <th style={{padding:"11px 14px",textAlign:"left",color:C.textMid,fontWeight:"bold",fontSize:13,letterSpacing:1,borderBottom:`1px solid ${C.border}`,minWidth:120}}>CATEGORY</th>
              {DAYS.map(d=><th key={d} style={{padding:"11px 14px",textAlign:"left",color:C.primary,fontWeight:"bold",fontSize:13,letterSpacing:1,borderBottom:`1px solid ${C.border}`,minWidth:150}}>{d.toUpperCase()}</th>)}
            </tr>
          </thead>
          <tbody>
            {["sabq","manzil","notes"].map((field,fi)=>(
              <tr key={field} style={{background:fi%2===0?"#fafcfa":"#fff"}}>
                <td style={{padding:"10px 14px",color:C.text,fontSize:14,fontWeight:"bold",borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap"}}>
                  {field==="sabq"?"📖 Sabq":field==="manzil"?"🔁 Manzil":"📝 Notes"}
                </td>
                {weekData.days.map((day,di)=>(
                  <td key={di} style={{padding:"7px 10px",borderBottom:`1px solid ${C.border}`}}>
                    {editing
                      ?<input value={day[field]||""} onChange={e=>onCellChange(di,field,e.target.value)} style={{...S.inputSm,width:"100%",boxSizing:"border-box"}} placeholder="—"/>
                      :<span style={{color:day[field]?C.text:C.textLight,fontSize:15}}>{day[field]||"—"}</span>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{padding:"14px 18px",background:"#f8fcf8",borderTop:`1px solid ${C.border}`}}>
        <p style={{color:C.primary,fontSize:13,fontWeight:"bold",letterSpacing:1,margin:"0 0 8px"}}>✍️ TEACHER WEEKLY FEEDBACK</p>
        {editing
          ?<textarea value={weekData.teacherFeedback||""} onChange={e=>onFeedbackChange(e.target.value)} placeholder="Enter weekly feedback..." style={{...S.inputSm,width:"100%",boxSizing:"border-box",resize:"vertical",minHeight:75,lineHeight:1.6}}/>
          :<p style={{color:weekData.teacherFeedback?C.text:C.textLight,fontSize:15,margin:0,lineHeight:1.6,fontStyle:weekData.teacherFeedback?"normal":"italic"}}>{weekData.teacherFeedback||"No feedback yet."}</p>
        }
      </div>
    </div>
  );
}

// ── Message Section ──
function MessageSection({ student, isAdmin, onSave }) {
  const [selYear,setSelYear] = useState(2026);
  const [selMonth,setSelMonth] = useState(MONTHS[new Date().getMonth()]);
  const [draft,setDraft] = useState("");
  const [saving,setSaving] = useState(false);
  const messages = student.messages||[];
  const monthMsgs = messages.filter(m=>m.year===selYear&&m.month===selMonth);

  const send = async () => {
    if(!draft.trim()) return;
    setSaving(true);
    const ts = new Date().toLocaleString("en-AU");
    const newMsg = { text:draft.trim(), from:isAdmin?"teacher":"parent", year:selYear, month:selMonth, time:ts };
    const updated = { ...student, messages:[...messages,newMsg] };
    if(!isAdmin) {
      updated.adminNotifs = [...(student.adminNotifs||[]), { text:`📩 Message from parent of ${student.name}`, time:ts, read:false, studentId:student.id }];
    } else {
      updated.parentNotifs = [...(student.parentNotifs||[]), { text:`📩 Message from teacher about ${student.name}`, time:ts, read:false }];
    }
    await onSave(updated);
    setDraft(""); setSaving(false);
  };

  return (
    <div style={S.card}>
      <p style={{color:C.primary,fontSize:15,fontWeight:"bold",letterSpacing:1,margin:"0 0 16px"}}>{isAdmin?"💬 MESSAGE TO PARENTS":"💬 MESSAGE TO TEACHER"}</p>
      <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
        <div><label style={{color:C.textMid,fontSize:13,fontWeight:"bold",display:"block",marginBottom:6}}>YEAR</label>
          <select value={selYear} onChange={e=>setSelYear(Number(e.target.value))} style={{...S.inputSm,cursor:"pointer"}}>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</select></div>
        <div><label style={{color:C.textMid,fontSize:13,fontWeight:"bold",display:"block",marginBottom:6}}>MONTH</label>
          <select value={selMonth} onChange={e=>setSelMonth(e.target.value)} style={{...S.inputSm,cursor:"pointer"}}>{MONTHS.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
      </div>
      <div style={{background:"#f8fcf8",border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:16,minHeight:130,maxHeight:300,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
        {monthMsgs.length===0
          ?<p style={{color:C.textLight,fontSize:15,margin:"auto",textAlign:"center",fontStyle:"italic"}}>No messages for {selMonth} {selYear}</p>
          :monthMsgs.map((m,i)=>(
            <div key={i} style={{alignSelf:m.from==="parent"?"flex-end":"flex-start",background:m.from==="parent"?"#e0f0e0":"#fff8e8",border:`1px solid ${m.from==="parent"?C.border:"#e0d090"}`,borderRadius:12,padding:"11px 16px",maxWidth:"80%"}}>
              <p style={{color:C.text,fontSize:15,margin:"0 0 5px",lineHeight:1.5}}>{m.text}</p>
              <p style={{color:C.textLight,fontSize:12,margin:0}}>{m.from==="parent"?"👨‍👩‍👧 Parent":"👩‍🏫 Teacher"} · {m.time}</p>
            </div>
          ))
        }
      </div>
      <label style={{color:C.textMid,fontSize:14,fontWeight:"bold",display:"block",marginBottom:8}}>{isAdmin?"Reply to Parent:":"Your message:"}</label>
      <textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder={isAdmin?"Write a message to parent...":"Write your message to the teacher..."} style={{...S.inputSm,width:"100%",boxSizing:"border-box",resize:"vertical",minHeight:85,lineHeight:1.6,marginBottom:12}}/>
      <button onClick={send} disabled={saving||!draft.trim()} style={{...S.btnPrimary,opacity:(!draft.trim()||saving)?0.5:1,fontSize:16}}>{saving?"Sending...":"📤 Send Message"}</button>
    </div>
  );
}

// ── Payment Section ──
function PaymentSection({ student, onSave, isAdmin }) {
  const [selYear,setSelYear] = useState(2026);
  const [saving,setSaving] = useState(false);
  const payments = student.payments||EMPTY_PAYMENTS();

  const toggle = async (month, val) => {
    setSaving(true);
    const u=JSON.parse(JSON.stringify(payments));
    u[selYear][month].paid=val;
    await onSave({...student,payments:u});
    setSaving(false);
  };
  const reset = async (month) => { await toggle(month, null); };

  return (
    <div style={S.card}>
      <p style={{color:C.primary,fontSize:15,fontWeight:"bold",letterSpacing:1,margin:"0 0 16px"}}>💳 PAYMENT STATUS</p>
      <div style={{display:"flex",gap:10,marginBottom:20,alignItems:"flex-end",flexWrap:"wrap"}}>
        <div><label style={{color:C.textMid,fontSize:13,fontWeight:"bold",display:"block",marginBottom:6}}>YEAR</label>
          <select value={selYear} onChange={e=>setSelYear(Number(e.target.value))} style={{...S.inputSm,cursor:"pointer",color:C.primary,fontWeight:"bold"}}>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</select></div>
        {saving&&<p style={{color:C.textMid,fontSize:14,margin:0}}>Saving...</p>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {MONTHS.map(m=>{
          const paid=payments?.[selYear]?.[m]?.paid;
          return (
            <div key={m} style={{display:"flex",alignItems:"center",gap:12,background:paid===true?"#edf8ed":paid===false?"#fdf0f0":"#f8f8f8",border:`1.5px solid ${paid===true?C.success:paid===false?C.danger:C.border}`,borderRadius:10,padding:"10px 16px",flexWrap:"wrap"}}>
              <span style={{color:C.text,fontSize:15,fontWeight:"bold",minWidth:90}}>{m}</span>
              <span style={{fontSize:18}}>{paid===true?"✅":paid===false?"❌":"⏳"}</span>
              <span style={{color:paid===true?C.success:paid===false?C.danger:C.textLight,fontSize:15,fontWeight:"bold",flex:1}}>{paid===true?"PAID":paid===false?"NOT PAID":"NOT SET"}</span>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <button onClick={()=>toggle(m,true)} style={{...S.btnSuccess,padding:"6px 14px",fontSize:14,opacity:paid===true?0.5:1}} disabled={paid===true}>✓ Paid</button>
                <button onClick={()=>toggle(m,false)} style={{...S.btnDanger,padding:"6px 14px",fontSize:14,opacity:paid===false?0.5:1}} disabled={paid===false}>✗ Not Paid</button>
                <button onClick={()=>reset(m)} style={{background:"#f0f0f0",border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px",fontSize:13,color:C.textMid,cursor:"pointer",fontFamily:"'Inter','Segoe UI',sans-serif"}} disabled={paid===null}>↺ Reset</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Notification Panel ──
function NotifPanel({ notifs, onClear, onClose }) {
  return (
    <div style={{position:"absolute",top:60,right:0,width:340,background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,boxShadow:"0 8px 32px rgba(0,0,0,0.12)",zIndex:1000,overflow:"hidden"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",borderBottom:`1px solid ${C.border}`,background:"#E8F5E9"}}>
        <p style={{color:C.primary,fontSize:15,fontWeight:"bold",margin:0}}>🔔 Notifications</p>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClear} style={{background:"none",border:"none",color:C.textMid,cursor:"pointer",fontSize:13,fontFamily:"'Inter','Segoe UI',sans-serif"}}>Mark all read</button>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.textLight,cursor:"pointer",fontSize:18}}>✕</button>
        </div>
      </div>
      <div style={{maxHeight:360,overflowY:"auto"}}>
        {notifs.length===0
          ?<p style={{color:C.textLight,fontSize:15,margin:"20px",textAlign:"center",fontStyle:"italic"}}>No notifications</p>
          :notifs.map((n,i)=>(
            <div key={i} style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,background:n.read?"#fff":"#f0f8f0"}}>
              <p style={{color:C.text,fontSize:15,margin:"0 0 4px",lineHeight:1.4}}>{n.text}</p>
              <p style={{color:C.textLight,fontSize:12,margin:0}}>{n.time}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ── Student Detail ──
function StudentDetail({ student, onBack, isAdmin, isParent, onSave }) {
  const [tab,setTab] = useState("progress");
  const [activeWeek,setActiveWeek] = useState(0);
  const [selYear,setSelYear] = useState(2026);
  const [selMonth,setSelMonth] = useState(MONTHS[new Date().getMonth()]);
  const [editing,setEditing] = useState(false);
  const [local,setLocal] = useState(JSON.parse(JSON.stringify(student)));
  const [saving,setSaving] = useState(false);

  useEffect(()=>{ setLocal(JSON.parse(JSON.stringify(student))); },[student]);

  const getWeeks = () => local.quranProgress?.[selYear]?.[selMonth]||EMPTY_WEEKS();
  const cellChange = (di,field,val)=>{ const u=JSON.parse(JSON.stringify(local)); if(!u.quranProgress) u.quranProgress=EMPTY_PROGRESS(); u.quranProgress[selYear][selMonth][activeWeek].days[di][field]=val; setLocal(u); };
  const feedbackChange = (val)=>{
    const u=JSON.parse(JSON.stringify(local)); if(!u.quranProgress) u.quranProgress=EMPTY_PROGRESS();
    u.quranProgress[selYear][selMonth][activeWeek].teacherFeedback=val;
    const ts=new Date().toLocaleString("en-AU");
    u.parentNotifs=[...(u.parentNotifs||[]),{text:`📝 Teacher added feedback — ${local.name} ${selMonth} Week ${activeWeek+1}`,time:ts,read:false}];
    setLocal(u);
  };
  const fieldChange=(f,v)=>setLocal(p=>({...p,[f]:v}));
  const summaryChange=(k,v)=>setLocal(p=>({...p,summary:{...p.summary,[k]:v}}));
  const save=async()=>{ setSaving(true); await onSave(local); setSaving(false); setEditing(false); };
  const cancel=()=>{ setLocal(JSON.parse(JSON.stringify(student))); setEditing(false); };

  // Unread counts
  const adminUnread=(local.adminNotifs||[]).filter(n=>!n.read).length;
  const parentUnread=(local.parentNotifs||[]).filter(n=>!n.read).length;

  return (
    <div>
      <button onClick={onBack} style={{...S.btnGhost,border:"none",padding:"4px 0",marginBottom:18,fontSize:17,display:"flex",alignItems:"center",gap:6}}>← Back</button>

      {/* Student header card */}
      <div style={{...S.card,display:"flex",alignItems:"center",gap:20,marginBottom:20,flexWrap:"wrap"}}>
        <div style={{flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Avatar student={local} size={80}/>
        </div>
        <div style={{flex:1,minWidth:180}}>
          {isAdmin&&editing?(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <input value={local.name} onChange={e=>fieldChange("name",e.target.value)} placeholder="Student Name" style={{...S.inputSm,fontSize:17,fontWeight:"bold"}}/>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <input value={local.grade} onChange={e=>fieldChange("grade",e.target.value)} placeholder="Grade" style={{...S.inputSm,flex:1}}/>
                <input value={local.teacher} onChange={e=>fieldChange("teacher",e.target.value)} placeholder="Teacher" style={{...S.inputSm,flex:1}}/>
                <input type="number" min="0" max="100" value={local.progress} onChange={e=>fieldChange("progress",Number(e.target.value))} placeholder="%" style={{...S.inputSm,width:70}}/>
              </div>
              <div style={{display:"flex",gap:16}}>
                {["male","female"].map(g=>(
                  <label key={g} style={{color:C.textMid,fontSize:15,display:"flex",alignItems:"center",gap:7,cursor:"pointer"}}>
                    <input type="radio" name="gender" checked={local.gender===g} onChange={()=>fieldChange("gender",g)} style={{width:17,height:17}}/> {g.charAt(0).toUpperCase()+g.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          ):(
            <>
              <h2 style={{color:C.text,margin:0,fontSize:24,fontWeight:"bold"}}>{local.name||"No name"}</h2>
              <p style={{color:C.textMid,margin:"5px 0 0",fontSize:16}}>{local.grade||"—"} · {local.teacher||"—"}</p>
            </>
          )}
        </div>
        <ProgressArc pct={local.progress}/>
      </div>

      {/* Edit button */}
      {isAdmin&&(
        <div style={{marginBottom:18,display:"flex",gap:10}}>
          {editing
            ?<><button onClick={save} style={{...S.btnPrimary,fontSize:16}} disabled={saving}>{saving?"Saving...":"✅ Save Changes"}</button>
               <button onClick={cancel} style={{...S.btnGhost,fontSize:16}}>Cancel</button></>
            :<button onClick={()=>setEditing(true)} style={{...S.btnGold,fontSize:16,display:"flex",alignItems:"center",gap:8}}>✏️ Edit Student Data</button>
          }
        </div>
      )}

      {/* Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        <button style={S.tab(tab==="progress")} onClick={()=>setTab("progress")}>📖 Qur'an Progress</button>
        <button style={S.tab(tab==="messages")} onClick={()=>setTab("messages")}>
          {isAdmin?"💬 Message to Parents":"💬 Message to Teacher"}
          {isAdmin&&adminUnread>0&&<span style={{background:C.notif,color:"#fff",borderRadius:"50%",fontSize:12,padding:"2px 7px",marginLeft:7,fontWeight:"bold"}}>{adminUnread}</span>}
          {isParent&&parentUnread>0&&<span style={{background:C.notif,color:"#fff",borderRadius:"50%",fontSize:12,padding:"2px 7px",marginLeft:7,fontWeight:"bold"}}>{parentUnread}</span>}
        </button>
        <button style={S.tab(tab==="payment")} onClick={()=>setTab("payment")}>💳 Payment</button>
      </div>

      {tab==="progress"&&(
        <>
          <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap",alignItems:"flex-end"}}>
            <div><label style={{color:C.textMid,fontSize:13,fontWeight:"bold",display:"block",marginBottom:6}}>YEAR</label>
              <select value={selYear} onChange={e=>{setSelYear(Number(e.target.value));setActiveWeek(0);}} style={{...S.inputSm,cursor:"pointer",color:C.primary,fontWeight:"bold"}}>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</select></div>
            <div><label style={{color:C.textMid,fontSize:13,fontWeight:"bold",display:"block",marginBottom:6}}>MONTH</label>
              <select value={selMonth} onChange={e=>{setSelMonth(e.target.value);setActiveWeek(0);}} style={{...S.inputSm,cursor:"pointer"}}>{MONTHS.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{height:2,flex:1,background:`linear-gradient(90deg,${C.border},transparent)`}}/>
            <span style={{color:C.primary,fontSize:14,fontWeight:"bold",letterSpacing:1}}>{selMonth.toUpperCase()} {selYear}</span>
            <div style={{height:2,flex:1,background:`linear-gradient(90deg,transparent,${C.border})`}}/>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            {getWeeks().map((w,i)=>(
              <button key={i} onClick={()=>setActiveWeek(i)} style={{padding:"9px 20px",borderRadius:22,border:activeWeek===i?"2px solid #2E7D32":"2px solid #C8E6C9",background:activeWeek===i?"#E8F5E9":"#fff",color:activeWeek===i?"#1B5E20":"#4E6B4E",fontSize:15,cursor:"pointer",fontFamily:"'Inter','Segoe UI',sans-serif",fontWeight:activeWeek===i?"bold":"normal"}}>Week {w.week}</button>
            ))}
          </div>
          <div style={{marginBottom:20}}>
            <WeekTable weekData={getWeeks()[activeWeek]} editing={isAdmin&&editing} onCellChange={cellChange} onFeedbackChange={feedbackChange}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{...S.card,borderLeft:`4px solid ${C.success}`}}>
              <p style={{color:C.success,fontSize:13,fontWeight:"bold",letterSpacing:1,margin:"0 0 9px"}}>✦ STRENGTHS</p>
              {isAdmin&&editing?<textarea value={local.summary.strengths} onChange={e=>summaryChange("strengths",e.target.value)} placeholder="Enter strengths..." style={{...S.inputSm,width:"100%",boxSizing:"border-box",resize:"vertical",minHeight:70}}/>
                :<p style={{color:local.summary.strengths?C.text:C.textLight,fontSize:15,margin:0,lineHeight:1.6}}>{local.summary.strengths||"Not filled yet"}</p>}
            </div>
            <div style={{...S.card,borderLeft:"4px solid #e0a030"}}>
              <p style={{color:"#b07020",fontSize:13,fontWeight:"bold",letterSpacing:1,margin:"0 0 9px"}}>✦ TO IMPROVE</p>
              {isAdmin&&editing?<textarea value={local.summary.improve} onChange={e=>summaryChange("improve",e.target.value)} placeholder="Areas to improve..." style={{...S.inputSm,width:"100%",boxSizing:"border-box",resize:"vertical",minHeight:70}}/>
                :<p style={{color:local.summary.improve?C.text:C.textLight,fontSize:15,margin:0,lineHeight:1.6}}>{local.summary.improve||"Not filled yet"}</p>}
            </div>
          </div>
        </>
      )}
      {tab==="messages"&&<MessageSection student={local} isAdmin={isAdmin} onSave={onSave}/>}
      {tab==="payment"&&<PaymentSection student={local} onSave={onSave} isAdmin={isAdmin}/>}
    </div>
  );
}

// ── Student Card ──
function StudentCard({ student, onSelect, unreadCount=0 }) {
  return (
    <button onClick={()=>onSelect(student)} style={{background:"#fff",border:"1.5px solid #C8E6C9",borderRadius:16,padding:20,cursor:"pointer",textAlign:"left",fontFamily:"'Inter','Segoe UI',sans-serif",display:"flex",alignItems:"center",gap:16,width:"100%",boxShadow:"0 2px 10px rgba(0,0,0,0.05)",position:"relative",transition:"all 0.15s"}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor="#2E7D32";e.currentTarget.style.boxShadow="0 6px 24px rgba(27,94,32,0.12)";e.currentTarget.style.transform="translateY(-2px)";}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor="#C8E6C9";e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,0.05)";e.currentTarget.style.transform="translateY(0)";}}>
      {unreadCount>0&&<div style={{position:"absolute",top:12,right:12,background:C.notif,color:"#fff",borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:"bold"}}>{unreadCount}</div>}
      <div style={{flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Avatar student={student} size={64}/>
      </div>
      <div style={{flex:1}}>
        <p style={{color:student.name?C.text:"#aaa",fontSize:16,margin:"0 0 4px",fontWeight:"bold"}}>{student.name||"Empty Slot"}</p>
        <p style={{color:C.textMid,fontSize:14,margin:"0 0 9px"}}>{student.grade||"—"} · {student.teacher||"—"}</p>
        <div style={{background:"#E8F5E9",borderRadius:6,height:7,overflow:"hidden"}}>
          <div style={{width:`${student.progress}%`,height:"100%",background:"linear-gradient(90deg,#2E7D32,#66BB6A)",borderRadius:6}}/>
        </div>
        <p style={{color:student.progress>0?C.primary:C.textLight,fontSize:13,margin:"5px 0 0"}}>{student.progress>0?`${student.progress}% completed`:"Not started"}</p>
      </div>
    </button>
  );
}

// ── New Slot ──
function NewStudentSlot({ id, onSetup }) {
  return (
    <div style={{background:"#FAFFFE",border:"2px dashed #A5D6A7",borderRadius:16,padding:20,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
      <UnknownAvatar size={64}/>
      <p style={{color:C.textLight,fontSize:14,margin:0}}>Future Student #{id}</p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
        <button onClick={()=>onSetup(id,"individual")} style={{...S.btnGhost,fontSize:14,padding:"8px 16px"}}>🧑 Individual</button>
        <button onClick={()=>onSetup(id,"family")} style={{...S.btnGhost,fontSize:14,padding:"8px 16px"}}>👨‍👩‍👧‍👦 Family</button>
      </div>
    </div>
  );
}

// ── Admin View ──
function AdminView({ students, onSelect, onSetupSlot }) {
  const [search,setSearch] = useState("");
  const [filter,setFilter] = useState("all");
  const familyIds = FAMILY_GROUPS.flatMap(g=>g.ids);
  const activeStudents = students.filter(s=>s.name);
  const emptySlots = students.filter(s=>!s.name);
  const individual = activeStudents.filter(s=>!familyIds.includes(s.id)).sort((a,b)=>a.name.localeCompare(b.name));
  const getUnread = (s) => (s.adminNotifs||[]).filter(n=>!n.read).length;
  const filtered = search.trim() ? activeStudents.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>a.name.localeCompare(b.name)) : null;

  const divider = (label) => (
    <div style={{display:"flex",alignItems:"center",gap:10,margin:"22px 0 14px"}}>
      <div style={{height:2,flex:1,background:`linear-gradient(90deg,${C.border},transparent)`}}/>
      <span style={{color:C.primary,fontSize:13,fontWeight:"bold",letterSpacing:2,background:"#E8F5E9",padding:"5px 14px",borderRadius:22,border:`1px solid ${C.border}`}}>{label}</span>
      <div style={{height:2,flex:1,background:`linear-gradient(90deg,transparent,${C.border})`}}/>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:1,minWidth:200}}>
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:C.textLight,fontSize:17}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search student..." style={{...S.input,paddingLeft:42,fontSize:15}}/>
          {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.textLight,cursor:"pointer",fontSize:18}}>✕</button>}
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{...S.inputSm,cursor:"pointer",color:C.primary,fontWeight:"bold",fontSize:15}}>
          <option value="all">👥 All Students</option>
          <option value="individual">🧑 Individual</option>
          <option value="families">👨‍👩‍👧‍👦 Families</option>
        </select>
      </div>
      {filtered?(
        filtered.length===0?<p style={{color:C.textLight,fontStyle:"italic",fontSize:15}}>No students found.</p>
          :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:14}}>{filtered.map(s=><StudentCard key={s.id} student={s} onSelect={onSelect} unreadCount={getUnread(s)}/>)}</div>
      ):(
        <>
          {(filter==="all"||filter==="individual")&&(<>
            {divider(`INDIVIDUAL STUDENTS (${individual.length})`)}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:14}}>{individual.map(s=><StudentCard key={s.id} student={s} onSelect={onSelect} unreadCount={getUnread(s)}/>)}</div>
          </>)}
          {(filter==="all"||filter==="families")&&(<>
            {divider(`FAMILY GROUPS (${FAMILY_GROUPS.length})`)}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {FAMILY_GROUPS.map(group=>{
                const gs=group.ids.map(id=>students.find(s=>s.id===id)).filter(Boolean).sort((a,b)=>a.name.localeCompare(b.name));
                if(!gs.length) return null;
                return(<div key={group.label} style={{background:"#F1F8F1",border:"1.5px solid #C8E6C9",borderRadius:16,padding:"18px 16px 14px"}}>
                  <p style={{color:C.primary,fontSize:15,fontWeight:"bold",margin:"0 0 14px"}}>👨‍👩‍👧‍👦 {group.label.toUpperCase()} · {gs.length} students</p>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>{gs.map(s=><StudentCard key={s.id} student={s} onSelect={onSelect} unreadCount={getUnread(s)}/>)}</div>
                </div>);
              })}
            </div>
          </>)}
          {filter==="all"&&emptySlots.length>0&&(<>
            {divider(`FUTURE INDIVIDUAL STUDENTS — ${emptySlots.length} SLOTS`)}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>{emptySlots.map(s=><NewStudentSlot key={s.id} id={s.id} onSetup={onSetupSlot}/>)}</div>
          </>)}
          {filter==="all"&&(<>
            {divider("FUTURE FAMILY GROUPS — 3 SLOTS")}
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {FUTURE_FAMILY_SLOTS.map((slot,i)=>{
                const slotStudent = students.find(s=>s.id===slot.ids[0]);
                return (
                  <div key={i} style={{background:"#FAFFFE",border:"2px dashed #A5D6A7",borderRadius:16,padding:"18px 16px"}}>
                    <p style={{color:C.textLight,fontSize:14,fontWeight:"bold",margin:"0 0 10px",letterSpacing:1}}>👨‍👩‍👧‍👦 {slot.label.toUpperCase()} — Admin will assign students</p>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      <button onClick={()=>slotStudent&&onSetupSlot(slot.ids[0],"family")} style={{...S.btnGhost,fontSize:14,padding:"8px 16px"}}>+ Set Up Family</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>)}
        </>
      )}
    </div>
  );
}

// ── Dashboard ──
function Dashboard({ account, onLogout }) {
  const [students,setStudents] = useState(STUDENTS);
  const [selected,setSelected] = useState(null);
  const [showNotif,setShowNotif] = useState(false);
  const [announcements,setAnnouncements] = useState([]);
  const isAdmin = account.role==="admin";
  const isParent = account.role==="parent";
  const visibleStudents = students.filter(s=>isAdmin?true:account.studentIds.includes(s.id));

  // Collect all unread notifications
  const adminNotifs = isAdmin ? students.flatMap(s=>(s.adminNotifs||[]).map(n=>({...n,studentName:s.name}))) : [];
  const parentNotifs = isParent ? visibleStudents.flatMap(s=>(s.parentNotifs||[])) : [];
  const myNotifs = isAdmin ? adminNotifs : parentNotifs;
  const unreadCount = myNotifs.filter(n=>!n.read).length;

  useEffect(()=>{
    const unsubs=STUDENTS.map(s=>{
      const ref=doc(db,"students",String(s.id));
      return onSnapshot(ref,snap=>{ if(snap.exists()){ const data=snap.data(); setStudents(prev=>prev.map(p=>p.id===s.id?{...p,...data}:p)); setSelected(prev=>prev&&prev.id===s.id?{...prev,...data}:prev); }});
    });
    // Listen for announcements
    const announcementsRef = doc(db,"config","announcements");
    const unsubAnnounce = onSnapshot(announcementsRef, snap=>{
      if(snap.exists()) setAnnouncements(snap.data().list||[]);
    });
    return()=>{ unsubs.forEach(u=>u()); unsubAnnounce(); };
  },[]);

  const handleSave = async (updated) => {
    try{ await setDoc(doc(db,"students",String(updated.id)),updated); }catch(e){console.error(e);}
    setStudents(prev=>prev.map(s=>s.id===updated.id?updated:s));
    setSelected(updated);
  };

  const addAnnouncement = async (announcement) => {
    const newList = [...announcements, announcement];
    await setDoc(doc(db,"config","announcements"), { list: newList });
    setAnnouncements(newList);
  };

  const deleteAnnouncement = async (idx) => {
    const newList = announcements.filter((_,i)=>i!==idx);
    await setDoc(doc(db,"config","announcements"), { list: newList });
    setAnnouncements(newList);
  };

  const markAllAnnouncementsRead = async () => {
    const newList = announcements.map(a=>({...a,read:true}));
    await setDoc(doc(db,"config","announcements"), { list: newList });
    setAnnouncements(newList);
  };

  const clearAllNotifs = async () => {
    if(isAdmin){
      for(const s of students){
        if((s.adminNotifs||[]).some(n=>!n.read)){
          const updated={...s,adminNotifs:(s.adminNotifs||[]).map(n=>({...n,read:true}))};
          await handleSave(updated);
        }
      }
    } else {
      for(const s of visibleStudents){
        if((s.parentNotifs||[]).some(n=>!n.read)){
          const updated={...s,parentNotifs:(s.parentNotifs||[]).map(n=>({...n,read:true}))};
          await handleSave(updated);
        }
      }
    }
    setShowNotif(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"#F5F7F5",fontFamily:"'Inter','Segoe UI',sans-serif",color:"#1A1A1A"}}>
      <div style={{maxWidth:960,margin:"0 auto",padding:"20px 18px"}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26,background:"#fff",borderRadius:16,padding:"16px 22px",border:`1.5px solid ${C.border}`,boxShadow:"0 2px 10px rgba(0,0,0,0.05)",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{width:50,height:50,borderRadius:"50%",background:"linear-gradient(135deg,#2E7D32,#1B5E20)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,color:"#F9A825",fontWeight:"800",border:"2px solid #F9A825",flexShrink:0,boxShadow:"0 2px 8px rgba(27,94,32,0.3)"}}>DN</div>
            <div>
              <h1 style={{color:C.primary,fontSize:20,margin:0,fontWeight:"bold",letterSpacing:1}}>Darul Noor Education Hub</h1>
              <p style={{color:C.textMid,fontSize:13,margin:"3px 0 0"}}>{isAdmin?"Admin Dashboard":"Parent Portal"} · Qur'an Tracker <span style={{color:C.success,fontSize:12}}>● Live</span></p>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14,marginLeft:"auto"}}>
            <button onClick={onLogout} style={{...S.btnGhost,padding:"9px 18px",fontSize:15}}>Sign Out</button>
            {/* Announcement badge */}
            <AnnouncementBadge
              announcements={announcements}
              isAdmin={isAdmin}
              onAdd={addAnnouncement}
              onDelete={deleteAnnouncement}
            />
            {/* Bell notification button — far right */}
            <div style={{position:"relative"}}>
              <button onClick={()=>setShowNotif(p=>!p)} style={{background:unreadCount>0?"#fff8e8":"#f8f8f8",border:`1.5px solid ${unreadCount>0?"#e0c060":C.border}`,borderRadius:12,padding:"10px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontSize:22,position:"relative"}}>
                🔔
                {unreadCount>0&&<span style={{position:"absolute",top:-8,right:-8,background:C.notif,color:"#fff",borderRadius:"50%",minWidth:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:"bold",fontFamily:"'Inter','Segoe UI',sans-serif",padding:"0 4px"}}>{unreadCount}</span>}
              </button>
              {showNotif&&<NotifPanel notifs={[...myNotifs].reverse()} onClear={clearAllNotifs} onClose={()=>setShowNotif(false)}/>}
            </div>
          </div>
        </div>

        {/* Announcement Board — always visible below header */}
        {!selected && (
          <AnnouncementBoard
            announcements={announcements}
            isAdmin={isAdmin}
            onMarkAllRead={markAllAnnouncementsRead}
            onDelete={deleteAnnouncement}
          />
        )}

        {selected?(
          <StudentDetail student={selected} onBack={()=>setSelected(null)} isAdmin={isAdmin} isParent={isParent} onSave={handleSave}/>
        ):(
          <>
            <p style={{color:C.textMid,fontSize:15,marginBottom:18}}>{isAdmin?`${visibleStudents.filter(s=>s.name).length} students`:visibleStudents.length>1?`${visibleStudents.length} children`:"Your child's progress"}</p>
            {isAdmin
              ?<AdminView students={visibleStudents} onSelect={setSelected} onSetupSlot={(id)=>setSelected(students.find(s=>s.id===id))}/>
              :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:16}}>
                {visibleStudents.map(s=><StudentCard key={s.id} student={s} onSelect={setSelected} unreadCount={(s.parentNotifs||[]).filter(n=>!n.read).length}/>)}
              </div>
            }
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [account,setAccount] = useState(null);
  return account?<Dashboard account={account} onLogout={()=>setAccount(null)}/>:<LoginScreen onLogin={setAccount}/>;
}
