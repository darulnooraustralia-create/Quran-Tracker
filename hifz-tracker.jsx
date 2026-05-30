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
const NS = "http://www.w3.org/2000/svg";

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
  disabled: false,
  summary: { strengths: "", improve: "" },
  quranProgress: EMPTY_PROGRESS(),
  payments: EMPTY_PAYMENTS(),
  messages: [], adminNotifs: [], parentNotifs: [],
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

const DEFAULT_ACCOUNTS = [
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

function MaleAvatar({ size=64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 260" xmlns={NS}>
      <rect width="200" height="260" fill="#e8ebe8" rx="8"/>
      <path d="M55 90 Q55 30 100 28 Q145 30 145 90 Z" fill="#4a4a4a"/>
      <rect x="48" y="85" width="104" height="22" rx="3" fill="#3a3a3a"/>
      <path d="M58 104 Q56 90 100 88 Q144 90 142 104 Q144 140 136 155 Q122 168 100 170 Q78 168 64 155 Q56 140 58 104Z" fill="#4a4a4a"/>
      <ellipse cx="57" cy="130" rx="8" ry="12" fill="#4a4a4a"/>
      <ellipse cx="143" cy="130" rx="8" ry="12" fill="#4a4a4a"/>
      <rect x="86" y="168" width="28" height="22" rx="4" fill="#484848"/>
      <path d="M20 260 Q18 210 45 196 Q65 188 82 186 L86 190 L100 195 L114 190 L118 186 Q135 188 155 196 Q182 210 180 260Z" fill="#4a4a4a"/>
    </svg>
  );
}
function FemaleAvatar({ size=64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 260" xmlns={NS}>
      <rect width="200" height="260" fill="#eaeae6" rx="8"/>
      <path d="M18 260 Q14 190 22 160 Q28 138 36 122 Q40 90 100 72 Q160 90 164 122 Q172 138 178 160 Q186 190 182 260Z" fill="#5a5a5a"/>
      <path d="M36 120 Q36 68 100 65 Q164 68 164 120 Q150 100 100 97 Q50 100 36 120Z" fill="#4a4a4a"/>
      <ellipse cx="100" cy="138" rx="46" ry="52" fill="#3a3a3a"/>
      <path d="M18 260 Q20 230 28 218 Q40 205 60 200 Q75 205 100 208 Q125 205 140 200 Q160 205 172 218 Q180 230 182 260Z" fill="#525252"/>
    </svg>
  );
}
function Avatar({ student, size=64 }) {
  if (!student.name) return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns={NS}>
      <circle cx="50" cy="50" r="50" fill="#f0f4f0"/>
      <text x="50" y="60" textAnchor="middle" fill="#90a890" fontSize="36" fontFamily="Georgia,serif">?</text>
    </svg>
  );
  if (student.gender==="male") return <MaleAvatar size={size}/>;
  if (student.gender==="female") return <FemaleAvatar size={size}/>;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns={NS}>
      <circle cx="50" cy="50" r="50" fill="#e0eee0"/>
      <text x="50" y="66" textAnchor="middle" fill="#2d6a2d" fontSize="42" fontWeight="bold" fontFamily="Georgia,serif">{student.name.charAt(0).toUpperCase()}</text>
    </svg>
  );
}

const FONT = "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif";
const C = {
  primary:"#1B5E20", primaryMid:"#2E7D32", primaryLight:"#4CAF50",
  gold:"#9E6C00", goldLight:"#F9A825",
  border:"#C8E6C9", borderMid:"#A5D6A7",
  text:"#1A1A1A", textBody:"#2D3A2D", textMid:"#4E6B4E", textLight:"#7A977A",
  success:"#2E7D32", danger:"#C62828", warning:"#E65100",
  notif:"#D32F2F",
};
const S = {
  input:{ width:"100%", background:"#FAFFFE", border:"1.5px solid #C8E6C9", borderRadius:10, padding:"13px 16px", color:"#1A1A1A", fontSize:16, outline:"none", boxSizing:"border-box", fontFamily:FONT },
  inputSm:{ background:"#FAFFFE", border:"1.5px solid #C8E6C9", borderRadius:8, padding:"9px 13px", color:"#1A1A1A", fontSize:14, outline:"none", fontFamily:FONT },
  btnPrimary:{ background:"linear-gradient(135deg,#2E7D32,#1B5E20)", border:"none", borderRadius:10, padding:"12px 24px", color:"#fff", fontSize:16, fontWeight:"700", cursor:"pointer", fontFamily:FONT },
  btnGold:{ background:"linear-gradient(135deg,#F9A825,#9E6C00)", border:"none", borderRadius:10, padding:"12px 24px", color:"#fff", fontSize:16, fontWeight:"700", cursor:"pointer", fontFamily:FONT },
  btnGhost:{ background:"transparent", border:"2px solid #2E7D32", borderRadius:10, padding:"10px 22px", color:"#2E7D32", fontSize:16, cursor:"pointer", fontFamily:FONT, fontWeight:"600" },
  btnDanger:{ background:"transparent", border:"2px solid #C62828", borderRadius:10, padding:"10px 22px", color:"#C62828", fontSize:16, cursor:"pointer", fontFamily:FONT },
  btnWarning:{ background:"linear-gradient(135deg,#E65100,#BF360C)", border:"none", borderRadius:10, padding:"10px 22px", color:"#fff", fontSize:14, fontWeight:"700", cursor:"pointer", fontFamily:FONT },
  btnSuccess:{ background:"linear-gradient(135deg,#4CAF50,#2E7D32)", border:"none", borderRadius:10, padding:"10px 22px", color:"#fff", fontSize:16, fontWeight:"700", cursor:"pointer", fontFamily:FONT },
  tab:(a)=>({ padding:"10px 22px", borderRadius:24, border:a?"2px solid #2E7D32":"2px solid #C8E6C9", background:a?"#E8F5E9":"#fff", color:a?"#1B5E20":"#4E6B4E", fontSize:14, cursor:"pointer", fontFamily:FONT, fontWeight:a?"700":"400" }),
  card:{ background:"#fff", border:"1px solid #C8E6C9", borderRadius:16, padding:24, boxShadow:"0 2px 10px rgba(0,0,0,0.05)" },
  row:{ display:"flex", alignItems:"center", gap:8 },
  flexCol:{ display:"flex", flexDirection:"column", gap:8 },
  label:{ color:"#4E6B4E", fontSize:13, fontWeight:"bold", display:"block", marginBottom:6 },
};

function BackButton({ onBack }) {
  return (
    <button onClick={onBack} style={{...S.btnPrimary, fontSize:15, padding:"10px 20px"}}>
      ← Back to Dashboard
    </button>
  );
}

function AnnouncementBadge({ announcements, isAdmin, onAdd, onDelete, onEdit }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(""); const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [editTitle, setEditTitle] = useState(""); const [editText, setEditText] = useState("");
  const unread = announcements.filter(a => !a.read).length;
  const handleAdd = async () => {
    if (!title.trim() || !draft.trim()) return;
    setSaving(true);
    await onAdd({ title: title.trim(), text: draft.trim(), time: new Date().toLocaleString("en-AU"), read: false });
    setTitle(""); setDraft(""); setSaving(false);
  };
  const startEdit = (i, a) => { setEditIdx(i); setEditTitle(a.title); setEditText(a.text); };
  const saveEdit = async () => {
    await onEdit(editIdx, { ...announcements[editIdx], title: editTitle.trim(), text: editText.trim() });
    setEditIdx(null);
  };
  return (
    <div style={{position:"relative"}}>
      <button onClick={()=>setOpen(p=>!p)} style={{background:unread>0?"#fff8e8":"#f8f8f8",border:`1.5px solid ${unread>0?"#e0c060":C.border}`,borderRadius:12,padding:"10px 16px",cursor:"pointer",fontSize:22,position:"relative"}}>
        📢{unread>0&&<span style={{position:"absolute",top:-8,right:-8,background:"#e67e22",color:"#fff",borderRadius:"50%",minWidth:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:"bold",fontFamily:FONT,padding:"0 4px"}}>{unread}</span>}
      </button>
      {open&&(
        <div style={{position:"absolute",top:60,right:0,width:370,background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,boxShadow:"0 8px 32px rgba(0,0,0,0.12)",zIndex:1000,overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",borderBottom:`1px solid ${C.border}`,background:"#FFF3E0"}}>
            <p style={{color:C.warning,fontSize:16,fontWeight:"bold",margin:0}}>📢 Announcements</p>
            <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",color:C.textLight,cursor:"pointer",fontSize:20}}>✕</button>
          </div>
          {isAdmin&&(
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,background:"#fffdf8"}}>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" style={{...S.inputSm,width:"100%",boxSizing:"border-box",marginBottom:8}}/>
              <textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Write announcement..." style={{...S.inputSm,width:"100%",boxSizing:"border-box",resize:"vertical",minHeight:70,lineHeight:1.5,marginBottom:10}}/>
              <button onClick={handleAdd} disabled={saving||!title.trim()||!draft.trim()} style={{...S.btnGold,fontSize:14,padding:"9px 18px",opacity:(saving||!title.trim()||!draft.trim())?0.5:1}}>
                {saving?"Posting...":"📤 Post"}
              </button>
            </div>
          )}
          <div style={{maxHeight:300,overflowY:"auto"}}>
            {announcements.length===0
              ?<p style={{color:C.textLight,fontSize:14,margin:"20px",textAlign:"center",fontStyle:"italic"}}>No announcements yet.</p>
              :[...announcements].reverse().map((a,i)=>{
                  const realIdx=announcements.length-1-i;
                  return (
                    <div key={i} style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,background:a.read?"#fff":"#fffbf0"}}>
                      {editIdx===realIdx?(
                        <div style={S.flexCol}>
                          <input value={editTitle} onChange={e=>setEditTitle(e.target.value)} style={{...S.inputSm,width:"100%",boxSizing:"border-box"}}/>
                          <textarea value={editText} onChange={e=>setEditText(e.target.value)} style={{...S.inputSm,width:"100%",boxSizing:"border-box",resize:"vertical",minHeight:60}}/>
                          <div style={S.row}>
                            <button onClick={saveEdit} style={{...S.btnPrimary,fontSize:13,padding:"6px 14px"}}>💾 Save</button>
                            <button onClick={()=>setEditIdx(null)} style={{...S.btnGhost,fontSize:13,padding:"6px 14px"}}>Cancel</button>
                          </div>
                        </div>
                      ):(
                        <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
                          <div style={{flex:1}}>
                            <p style={{color:C.text,fontSize:15,fontWeight:"bold",margin:"0 0 4px"}}>{a.title}</p>
                            <p style={{color:C.text,fontSize:14,margin:"0 0 5px",lineHeight:1.5}}>{a.text}</p>
                            <p style={{color:C.textLight,fontSize:12,margin:0}}>📅 {a.time}</p>
                          </div>
                          {isAdmin&&(
                            <div style={S.flexCol}>
                              <button onClick={()=>startEdit(realIdx,a)} style={{background:"none",border:"none",color:C.gold,cursor:"pointer",fontSize:15}}>✏️</button>
                              <button onClick={()=>onDelete(realIdx)} style={{background:"none",border:"none",color:C.danger,cursor:"pointer",fontSize:15}}>🗑️</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
            }
          </div>
        </div>
      )}
    </div>
  );
}

function AnnouncementBoard({ announcements, isAdmin, onMarkAllRead, onDelete, onEdit }) {
  const [collapsed, setCollapsed] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [editTitle, setEditTitle] = useState(""); const [editText, setEditText] = useState("");
  const unread = announcements.filter(a=>!a.read).length;
  const al = unread > 0;
  if (!announcements.length && !isAdmin) return null;
  const saveEdit = async () => {
    await onEdit(editIdx, { ...announcements[editIdx], title: editTitle.trim(), text: editText.trim() });
    setEditIdx(null);
  };
  return (
    <div style={{marginBottom:22,borderRadius:16,overflow:"hidden",border:`2px solid ${al?"#EF9A9A":"#A5D6A7"}`,boxShadow:al?"0 4px 20px rgba(183,28,28,0.12)":"0 2px 10px rgba(27,94,32,0.08)"}}>
      <div style={{background:al?"linear-gradient(135deg,#B71C1C,#D32F2F)":"linear-gradient(135deg,#2E7D32,#1B5E20)",padding:"13px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}} onClick={()=>setCollapsed(p=>!p)}>
        <div style={S.row}>
          <span style={{fontSize:22}}>📋</span>
          <span style={{color:"#fff",fontSize:16,fontWeight:"800",letterSpacing:1}}>NOTICE BOARD</span>
          {al?<span style={{background:"#fff",color:"#B71C1C",fontSize:13,fontWeight:"bold",borderRadius:20,padding:"2px 12px"}}>{unread} NEW</span>
             :<span style={{color:"rgba(255,255,255,0.75)",fontSize:13}}>All up to date</span>}
        </div>
        <span style={{color:"#fff",fontSize:18,transform:collapsed?"rotate(-90deg)":"rotate(0deg)",transition:"transform 0.2s"}}>▾</span>
      </div>
      {!collapsed&&(
        <div style={{background:al?"#FFF8F8":"#F8FFF8",padding:"16px 18px",display:"flex",flexDirection:"column",gap:12}}>
          {!announcements.length&&<p style={{color:C.textLight,fontSize:14,textAlign:"center",fontStyle:"italic",margin:"8px 0"}}>No announcements yet.</p>}
          {[...announcements].reverse().map((a,i)=>{
            const realIdx=announcements.length-1-i;
            return(
              <div key={i} style={{background:a.read?"#fff":al?"#fff5f5":"#f0fff0",border:`2px solid ${a.read?C.border:al?"#EF9A9A":"#81C784"}`,borderLeft:`6px solid ${a.read?C.borderMid:al?"#D32F2F":"#2E7D32"}`,borderRadius:12,padding:"14px 16px",position:"relative"}}>
                {!a.read&&editIdx!==realIdx&&<span style={{position:"absolute",top:10,right:12,background:al?"#D32F2F":C.primary,color:"#fff",fontSize:11,fontWeight:"bold",borderRadius:10,padding:"2px 9px"}}>NEW</span>}
                {editIdx===realIdx?(
                  <div style={S.flexCol}>
                    <input value={editTitle} onChange={e=>setEditTitle(e.target.value)} style={{...S.inputSm,width:"100%",boxSizing:"border-box"}}/>
                    <textarea value={editText} onChange={e=>setEditText(e.target.value)} style={{...S.inputSm,width:"100%",boxSizing:"border-box",resize:"vertical",minHeight:70}}/>
                    <div style={S.row}>
                      <button onClick={saveEdit} style={{...S.btnPrimary,fontSize:13,padding:"7px 16px"}}>💾 Save</button>
                      <button onClick={()=>setEditIdx(null)} style={{...S.btnGhost,fontSize:13,padding:"7px 16px"}}>Cancel</button>
                    </div>
                  </div>
                ):(
                  <>
                    <p style={{color:a.read?C.textMid:"#B71C1C",fontSize:16,fontWeight:"800",margin:"0 0 6px",paddingRight:50}}>{a.title}</p>
                    <p style={{color:a.read?C.textBody:C.text,fontSize:15,margin:"0 0 8px",lineHeight:1.6}}>{a.text}</p>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
                      <p style={{color:C.textLight,fontSize:12,margin:0}}>📅 {a.time}</p>
                      {isAdmin&&<div style={S.row}>
                        <button onClick={()=>{setEditIdx(realIdx);setEditTitle(a.title);setEditText(a.text);}} style={{background:"none",border:`1px solid ${C.gold}`,borderRadius:8,padding:"4px 12px",color:C.gold,cursor:"pointer",fontSize:13,fontFamily:FONT}}>✏️ Edit</button>
                        <button onClick={()=>onDelete(realIdx)} style={{background:"none",border:`1px solid ${C.danger}`,borderRadius:8,padding:"4px 12px",color:C.danger,cursor:"pointer",fontSize:13,fontFamily:FONT}}>🗑 Delete</button>
                      </div>}
                    </div>
                  </>
                )}
              </div>
            );
          })}
          {!isAdmin&&unread>0&&<button onClick={onMarkAllRead} style={{...S.btnGhost,alignSelf:"flex-end",fontSize:14,padding:"8px 18px",borderColor:"#B71C1C",color:"#B71C1C"}}>✓ Mark all as read</button>}
        </div>
      )}
    </div>
  );
}

function LoginScreen({ onLogin, accounts }) {
  const [login, setLogin] = useState(()=>{ try{return localStorage.getItem("dn_login")||"";}catch{return "";} });
  const [password, setPassword] = useState(()=>{ try{return localStorage.getItem("dn_pass")||"";}catch{return "";} });
  const [remember, setRemember] = useState(()=>{ try{return !!localStorage.getItem("dn_login");}catch{return false;} });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const handleLogin = () => {
    const acc = accounts.find(a=>a.login===login.trim().toLowerCase()&&a.password.toLowerCase()===password.trim().toLowerCase());
    if(acc){
      if(remember){try{localStorage.setItem("dn_login",login.trim().toLowerCase());localStorage.setItem("dn_pass",password.trim());}catch{}}
      else{try{localStorage.removeItem("dn_login");localStorage.removeItem("dn_pass");}catch{}}
      onLogin(acc);
    } else setError("Incorrect login or password. Please try again.");
  };
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#EDF4ED 0%,#F5F7F5 50%,#E8F5E9 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT}}>
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
            <label style={S.label}>Login ID</label>
            <input value={login} onChange={e=>setLogin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={S.input} placeholder="Enter your login ID"/>
          </div>
          <div style={{marginBottom:22}}>
            <label style={S.label}>Password</label>
            <div style={{position:"relative"}}>
              <input type={showPwd?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{...S.input,paddingRight:48}} placeholder="Enter your password"/>
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

function WeekTable({ weekData, onSaveSection, isAdmin }) {
  const [editSec, setEditSec] = useState(null);
  const [localCells, setLocalCells] = useState(null);
  const [localFb, setLocalFb] = useState("");
  const startEdit = (s) => {
    setEditSec(s);
    if(s==="feedback") setLocalFb(weekData.teacherFeedback||"");
    else setLocalCells(weekData.days.map(d=>d[s]||""));
  };
  const cancel = () => { setEditSec(null); setLocalCells(null); };
  const save = (s) => {
    if(s==="feedback") onSaveSection("feedback",null,localFb);
    else onSaveSection("cell",s,localCells);
    setEditSec(null);
  };
  const del = (s) => {
    if(s==="feedback") onSaveSection("feedback",null,"");
    else onSaveSection("cell",s,weekData.days.map(()=>""));
  };
  const lbl = (f) => f==="sabq"?"📖 Sabq":f==="manzil"?"🔁 Manzil":"📝 Notes";
  return (
    <div style={{border:`1.5px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:15}}>
          <thead>
            <tr style={{background:"#E8F5E9"}}>
              <th style={{padding:"11px 14px",textAlign:"left",color:C.textMid,fontWeight:"bold",fontSize:13,borderBottom:`1px solid ${C.border}`,minWidth:120}}>CATEGORY</th>
              {DAYS.map(d=><th key={d} style={{padding:"11px 14px",textAlign:"left",color:C.primary,fontWeight:"bold",fontSize:13,borderBottom:`1px solid ${C.border}`,minWidth:140}}>{d.toUpperCase()}</th>)}
              {isAdmin&&<th style={{padding:"11px 14px",textAlign:"center",color:C.textMid,fontWeight:"bold",fontSize:12,borderBottom:`1px solid ${C.border}`,minWidth:120}}>ACTIONS</th>}
            </tr>
          </thead>
          <tbody>
            {["sabq","manzil","notes"].map((field,fi)=>{
              const isEd = editSec===field;
              return (
                <tr key={field} style={{background:fi%2===0?"#fafcfa":"#fff"}}>
                  <td style={{padding:"10px 14px",color:C.text,fontSize:14,fontWeight:"bold",borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap"}}>{lbl(field)}</td>
                  {weekData.days.map((day,di)=>(
                    <td key={di} style={{padding:"7px 10px",borderBottom:`1px solid ${C.border}`}}>
                      {isEd
                        ?<input value={localCells?.[di]||""} onChange={e=>{const c=[...localCells];c[di]=e.target.value;setLocalCells(c);}} style={{...S.inputSm,width:"100%",boxSizing:"border-box"}} placeholder="—"/>
                        :<span style={{color:day[field]?C.text:C.textLight,fontSize:15}}>{day[field]||"—"}</span>
                      }
                    </td>
                  ))}
                  {isAdmin&&(
                    <td style={{padding:"7px 10px",borderBottom:`1px solid ${C.border}`,textAlign:"center"}}>
                      {isEd?(
                        <div style={S.row}>
                          <button onClick={()=>save(field)} style={{...S.btnPrimary,fontSize:12,padding:"5px 12px"}}>💾</button>
                          <button onClick={cancel} style={{...S.btnGhost,fontSize:12,padding:"5px 10px"}}>✕</button>
                        </div>
                      ):(
                        <div style={S.row}>
                          <button onClick={()=>startEdit(field)} style={{...S.btnGold,fontSize:12,padding:"5px 12px"}}>✏️</button>
                          <button onClick={()=>del(field)} style={{...S.btnDanger,fontSize:12,padding:"5px 10px"}}>🗑</button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{padding:"14px 18px",background:"#f8fcf8",borderTop:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,gap:8}}>
          <p style={{color:C.primary,fontSize:13,fontWeight:"bold",margin:0}}>✍️ TEACHER WEEKLY FEEDBACK</p>
          {isAdmin&&editSec!=="feedback"&&(
            <div style={S.row}>
              <button onClick={()=>startEdit("feedback")} style={{...S.btnGold,fontSize:12,padding:"5px 14px"}}>✏️ Edit</button>
              <button onClick={()=>del("feedback")} style={{...S.btnDanger,fontSize:12,padding:"5px 12px"}}>🗑</button>
            </div>
          )}
        </div>
        {editSec==="feedback"?(
          <div>
            <textarea value={localFb} onChange={e=>setLocalFb(e.target.value)} placeholder="Enter weekly feedback..." style={{...S.inputSm,width:"100%",boxSizing:"border-box",resize:"vertical",minHeight:75,lineHeight:1.6,marginBottom:10}}/>
            <div style={S.row}>
              <button onClick={()=>save("feedback")} style={{...S.btnPrimary,fontSize:13,padding:"7px 18px"}}>💾 Save</button>
              <button onClick={cancel} style={{...S.btnGhost,fontSize:13,padding:"7px 14px"}}>Cancel</button>
            </div>
          </div>
        ):(
          <p style={{color:weekData.teacherFeedback?C.text:C.textLight,fontSize:15,margin:0,lineHeight:1.6,fontStyle:weekData.teacherFeedback?"normal":"italic"}}>{weekData.teacherFeedback||"No feedback yet."}</p>
        )}
      </div>
    </div>
  );
}

function SummarySection({ label, color, borderColor, value, isAdmin, onChange, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(value);
  useEffect(()=>setLocal(value),[value]);
  const save = async () => { onChange(local); await onSave(); setEditing(false); };
  return (
    <div style={{...S.card,borderLeft:`4px solid ${borderColor}`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9,gap:6}}>
        <p style={{color,fontSize:13,fontWeight:"bold",letterSpacing:1,margin:0}}>{label}</p>
        {isAdmin&&!editing&&(
          <div style={S.row}>
            <button onClick={()=>setEditing(true)} style={{...S.btnGold,fontSize:11,padding:"4px 10px"}}>✏️</button>
            <button onClick={onDelete} style={{...S.btnDanger,fontSize:11,padding:"4px 8px"}}>🗑</button>
          </div>
        )}
      </div>
      {isAdmin&&editing?(
        <div>
          <textarea value={local} onChange={e=>setLocal(e.target.value)} style={{...S.inputSm,width:"100%",boxSizing:"border-box",resize:"vertical",minHeight:70,marginBottom:8}}/>
          <div style={S.row}>
            <button onClick={save} style={{...S.btnPrimary,fontSize:12,padding:"5px 14px"}}>💾 Save</button>
            <button onClick={()=>{setLocal(value);setEditing(false);}} style={{...S.btnGhost,fontSize:12,padding:"5px 10px"}}>Cancel</button>
          </div>
        </div>
      ):(
        <p style={{color:value?C.text:C.textLight,fontSize:15,margin:0,lineHeight:1.6}}>{value||"Not filled yet"}</p>
      )}
    </div>
  );
}

function MessageSection({ student, isAdmin, onSave }) {
  const [selYear,setSelYear] = useState(2026);
  const [selMonth,setSelMonth] = useState(MONTHS[new Date().getMonth()]);
  const [draft,setDraft] = useState("");
  const [saving,setSaving] = useState(false);
  const [editIdx,setEditIdx] = useState(null);
  const [editText,setEditText] = useState("");
  const messages = student.messages||[];
  const monthMsgs = messages.map((m,i)=>({...m,_idx:i})).filter(m=>m.year===selYear&&m.month===selMonth);
  const send = async () => {
    if(!draft.trim()) return;
    setSaving(true);
    const ts = new Date().toLocaleString("en-AU");
    const newMsg = { text:draft.trim(), from:isAdmin?"teacher":"parent", year:selYear, month:selMonth, time:ts };
    const updated = { ...student, messages:[...messages,newMsg] };
    if(!isAdmin) updated.adminNotifs=[...(student.adminNotifs||[]),{text:`📩 Message from parent of ${student.name}`,time:ts,read:false,studentId:student.id}];
    else updated.parentNotifs=[...(student.parentNotifs||[]),{text:`📩 Message from teacher about ${student.name}`,time:ts,read:false}];
    await onSave(updated); setDraft(""); setSaving(false);
  };
  const saveEdit = async () => {
    const newMsgs = messages.map((m,i)=>i===editIdx?{...m,text:editText,edited:true}:m);
    await onSave({...student,messages:newMsgs}); setEditIdx(null);
  };
  const deleteMsg = async (idx) => {
    if(!window.confirm("Delete this message?")) return;
    await onSave({...student,messages:messages.filter((_,i)=>i!==idx)});
  };
  return (
    <div style={S.card}>
      <p style={{color:C.primary,fontSize:15,fontWeight:"bold",letterSpacing:1,margin:"0 0 16px"}}>{isAdmin?"💬 MESSAGE TO PARENTS":"💬 MESSAGE TO TEACHER"}</p>
      <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
        <div><label style={S.label}>YEAR</label>
          <select value={selYear} onChange={e=>setSelYear(Number(e.target.value))} style={{...S.inputSm,cursor:"pointer"}}>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</select></div>
        <div><label style={S.label}>MONTH</label>
          <select value={selMonth} onChange={e=>setSelMonth(e.target.value)} style={{...S.inputSm,cursor:"pointer"}}>{MONTHS.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
      </div>
      <div style={{background:"#f8fcf8",border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:16,minHeight:130,maxHeight:320,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
        {monthMsgs.length===0
          ?<p style={{color:C.textLight,fontSize:15,margin:"auto",textAlign:"center",fontStyle:"italic"}}>No messages for {selMonth} {selYear}</p>
          :monthMsgs.map((m)=>(
            <div key={m._idx} style={{alignSelf:m.from==="parent"?"flex-end":"flex-start",background:m.from==="parent"?"#e0f0e0":"#fff8e8",border:`1px solid ${m.from==="parent"?C.border:"#e0d090"}`,borderRadius:12,padding:"11px 16px",maxWidth:"82%"}}>
              {editIdx===m._idx?(
                <div style={S.flexCol}>
                  <textarea value={editText} onChange={e=>setEditText(e.target.value)} style={{...S.inputSm,width:"100%",boxSizing:"border-box",resize:"vertical",minHeight:60}}/>
                  <div style={S.row}>
                    <button onClick={saveEdit} style={{...S.btnPrimary,fontSize:12,padding:"5px 12px"}}>💾 Save</button>
                    <button onClick={()=>setEditIdx(null)} style={{...S.btnGhost,fontSize:12,padding:"5px 10px"}}>Cancel</button>
                  </div>
                </div>
              ):(
                <>
                  <p style={{color:C.text,fontSize:15,margin:"0 0 5px",lineHeight:1.5}}>{m.text}{m.edited&&<span style={{color:C.textLight,fontSize:11,marginLeft:6}}>(edited)</span>}</p>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                    <p style={{color:C.textLight,fontSize:12,margin:0}}>{m.from==="parent"?"👨‍👩‍👧 Parent":"👩‍🏫 Teacher"} · {m.time}</p>
                    {isAdmin&&m.from==="teacher"&&(
                      <div style={S.row}>
                        <button onClick={()=>{setEditIdx(m._idx);setEditText(m.text);}} style={{background:"none",border:"none",color:C.gold,cursor:"pointer",fontSize:13}}>✏️</button>
                        <button onClick={()=>deleteMsg(m._idx)} style={{background:"none",border:"none",color:C.danger,cursor:"pointer",fontSize:13}}>🗑️</button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        }
      </div>
      <label style={S.label}>{isAdmin?"Reply to Parent:":"Your message:"}</label>
      <textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder={isAdmin?"Write a message to parent...":"Write your message to the teacher..."} style={{...S.inputSm,width:"100%",boxSizing:"border-box",resize:"vertical",minHeight:85,lineHeight:1.6,marginBottom:12}}/>
      <button onClick={send} disabled={saving||!draft.trim()} style={{...S.btnPrimary,opacity:(!draft.trim()||saving)?0.5:1,fontSize:16}}>{saving?"Sending...":"📤 Send"}</button>
    </div>
  );
}

function PaymentSection({ student, onSave, isAdmin }) {
  const [selYear,setSelYear] = useState(2026);
  const [saving,setSaving] = useState(false);
  const payments = student.payments||EMPTY_PAYMENTS();
  const toggle = async (month, val) => { setSaving(true); const u=JSON.parse(JSON.stringify(payments)); u[selYear][month].paid=val; await onSave({...student,payments:u}); setSaving(false); };
  return (
    <div style={S.card}>
      <p style={{color:C.primary,fontSize:15,fontWeight:"bold",letterSpacing:1,margin:"0 0 16px"}}>💳 PAYMENT STATUS</p>
      <div style={{display:"flex",gap:10,marginBottom:20,alignItems:"flex-end",flexWrap:"wrap"}}>
        <div><label style={S.label}>YEAR</label>
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
              {isAdmin&&<div style={S.row}>
                <button onClick={()=>toggle(m,true)} style={{...S.btnSuccess,padding:"6px 14px",fontSize:14,opacity:paid===true?0.5:1}} disabled={paid===true}>✓ Paid</button>
                <button onClick={()=>toggle(m,false)} style={{...S.btnDanger,padding:"6px 14px",fontSize:14,opacity:paid===false?0.5:1}} disabled={paid===false}>✗ Not Paid</button>
                <button onClick={()=>toggle(m,null)} style={{background:"#f0f0f0",border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px",fontSize:13,color:C.textMid,cursor:"pointer",fontFamily:FONT}} disabled={paid===null}>↺ Reset</button>
              </div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NotifPanel({ notifs, onClear, onClose }) {
  return (
    <div style={{position:"absolute",top:60,right:0,width:340,background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,boxShadow:"0 8px 32px rgba(0,0,0,0.12)",zIndex:1000,overflow:"hidden"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",borderBottom:`1px solid ${C.border}`,background:"#E8F5E9"}}>
        <p style={{color:C.primary,fontSize:15,fontWeight:"bold",margin:0}}>🔔 Notifications</p>
        <div style={S.row}>
          <button onClick={onClear} style={{background:"none",border:"none",color:C.textMid,cursor:"pointer",fontSize:13,fontFamily:FONT}}>Mark all read</button>
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

function AccountManager({ accounts, onSave, students }) {
  const [list, setList] = useState(accounts.filter(a=>a.role!=="admin"));
  const [editIdx, setEditIdx] = useState(null);
  const [newAcc, setNewAcc] = useState({ login:"", password:"", studentIds:[] });
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPwd, setShowPwd] = useState({});
  useEffect(()=>setList(accounts.filter(a=>a.role!=="admin")),[accounts]);
  const saveAll = async (updated) => {
    setSaving(true);
    await onSave([accounts.find(a=>a.role==="admin"),...updated]);
    setSaving(false);
  };
  const toggleStu = (i,sid) => {
    const u=[...list]; const ids=u[i].studentIds||[];
    u[i]={...u[i],studentIds:ids.includes(sid)?ids.filter(x=>x!==sid):[...ids,sid]};
    setList(u);
  };
  const named = students.filter(s=>s.name);
  const StuPicker = ({ids, onChange}) => (
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
      {named.map(s=>(
        <label key={s.id} style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",background:ids.includes(s.id)?"#e8f5e9":"#f5f5f5",border:`1px solid ${ids.includes(s.id)?C.primary:C.border}`,borderRadius:8,padding:"4px 9px",fontSize:13}}>
          <input type="checkbox" checked={ids.includes(s.id)} onChange={()=>onChange(s.id)} style={{width:13,height:13}}/>{s.name}
        </label>
      ))}
    </div>
  );
  return (
    <div style={S.card}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10}}>
        <p style={{color:C.primary,fontSize:16,fontWeight:"bold",margin:0}}>🔑 PARENT ACCOUNTS</p>
        <button onClick={()=>setShowNew(p=>!p)} style={{...S.btnGold,fontSize:14,padding:"9px 18px"}}>+ New Account</button>
      </div>
      {showNew&&(
        <div style={{background:"#fffdf0",border:`1.5px solid ${C.goldLight}`,borderRadius:12,padding:"16px 18px",marginBottom:18}}>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:10}}>
            <input value={newAcc.login} onChange={e=>setNewAcc(p=>({...p,login:e.target.value}))} placeholder="Login (e.g. parent.name@darulnoor)" style={{...S.inputSm,flex:2,minWidth:180}}/>
            <input value={newAcc.password} onChange={e=>setNewAcc(p=>({...p,password:e.target.value}))} placeholder="Password" style={{...S.inputSm,flex:1,minWidth:100}}/>
          </div>
          <StuPicker ids={newAcc.studentIds} onChange={sid=>setNewAcc(p=>({...p,studentIds:p.studentIds.includes(sid)?p.studentIds.filter(x=>x!==sid):[...p.studentIds,sid]}))}/>
          <div style={S.row}>
            <button onClick={async()=>{if(!newAcc.login.trim()||!newAcc.password.trim())return;const u=[...list,{...newAcc,login:newAcc.login.trim().toLowerCase(),role:"parent"}];setList(u);await saveAll(u);setNewAcc({login:"",password:"",studentIds:[]});setShowNew(false);}} disabled={!newAcc.login.trim()||!newAcc.password.trim()} style={{...S.btnPrimary,fontSize:13,padding:"7px 18px",opacity:(!newAcc.login.trim()||!newAcc.password.trim())?0.5:1}}>✅ Create</button>
            <button onClick={()=>setShowNew(false)} style={{...S.btnGhost,fontSize:13,padding:"7px 14px"}}>Cancel</button>
          </div>
        </div>
      )}
      <div style={S.flexCol}>
        {list.map((acc,i)=>{
          const isEd=editIdx===i;
          const names=(acc.studentIds||[]).map(id=>students.find(s=>s.id===id)?.name).filter(Boolean);
          return(
            <div key={i} style={{background:isEd?"#f8fff8":"#fafafa",border:`1.5px solid ${isEd?C.primary:C.border}`,borderRadius:12,padding:"14px 16px"}}>
              {isEd?(
                <div style={S.flexCol}>
                  <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                    <input value={list[i].login} onChange={e=>{const u=[...list];u[i]={...u[i],login:e.target.value};setList(u);}} placeholder="Login" style={{...S.inputSm,flex:2,minWidth:160}}/>
                    <input value={list[i].password} onChange={e=>{const u=[...list];u[i]={...u[i],password:e.target.value};setList(u);}} placeholder="Password" style={{...S.inputSm,flex:1,minWidth:100}}/>
                  </div>
                  <StuPicker ids={list[i].studentIds||[]} onChange={sid=>toggleStu(i,sid)}/>
                  <div style={S.row}>
                    <button onClick={async()=>{await saveAll(list);setEditIdx(null);}} style={{...S.btnPrimary,fontSize:13,padding:"7px 18px"}}>{saving?"Saving...":"💾 Save"}</button>
                    <button onClick={()=>setEditIdx(null)} style={{...S.btnGhost,fontSize:13,padding:"7px 14px"}}>Cancel</button>
                  </div>
                </div>
              ):(
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                  <div>
                    <p style={{color:C.text,fontSize:15,fontWeight:"bold",margin:"0 0 3px"}}>👤 {acc.login}</p>
                    <p style={{color:C.textMid,fontSize:13,margin:"0 0 3px"}}>
                      🔒 {showPwd[i]?acc.password:"••••••"}
                      <button onClick={()=>setShowPwd(p=>({...p,[i]:!p[i]}))} style={{background:"none",border:"none",cursor:"pointer",color:C.textLight,fontSize:13,marginLeft:6}}>{showPwd[i]?"🙈":"👁️"}</button>
                    </p>
                    <p style={{color:C.textLight,fontSize:12,margin:0}}>{names.length?names.join(", "):"No students"}</p>
                  </div>
                  <div style={S.row}>
                    <button onClick={()=>setEditIdx(i)} style={{...S.btnGold,fontSize:13,padding:"7px 14px"}}>✏️ Edit</button>
                    <button onClick={()=>{if(!window.confirm("Delete this account?"))return;const u=list.filter((_,idx)=>idx!==i);setList(u);saveAll(u);}} style={{...S.btnDanger,fontSize:13,padding:"7px 12px"}}>🗑️</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
  const fieldChange=(f,v)=>setLocal(p=>({...p,[f]:v}));
  const summaryChange=(k,v)=>setLocal(p=>({...p,summary:{...p.summary,[k]:v}}));
  const save=async()=>{ setSaving(true); await onSave(local); setSaving(false); setEditing(false); };
  const cancel=()=>{ setLocal(JSON.parse(JSON.stringify(student))); setEditing(false); };
  const handleSaveSection = async (type, field, value) => {
    const u = JSON.parse(JSON.stringify(local));
    if(!u.quranProgress) u.quranProgress=EMPTY_PROGRESS();
    if(type==="feedback"){
      u.quranProgress[selYear][selMonth][activeWeek].teacherFeedback=value;
      if(value){const ts=new Date().toLocaleString("en-AU");u.parentNotifs=[...(u.parentNotifs||[]),{text:`📝 Feedback added — ${local.name} ${selMonth} Week ${activeWeek+1}`,time:ts,read:false}];}
    } else {
      value.forEach((v,di)=>{ u.quranProgress[selYear][selMonth][activeWeek].days[di][field]=v; });
    }
    setLocal(u); await onSave(u);
  };
  const toggleDisable = async () => { const u={...local,disabled:!local.disabled}; setLocal(u); await onSave(u); };
  const deleteStudent = async () => {
    if(!window.confirm("Delete this student? This cannot be undone.")) return;
    await onSave(makeStudent(local.id,"","")); onBack();
  };
  const adminUnread=(local.adminNotifs||[]).filter(n=>!n.read).length;
  const parentUnread=(local.parentNotifs||[]).filter(n=>!n.read).length;
  return (
    <div>
      <div style={{marginBottom:18}}><BackButton onBack={onBack}/></div>
      {local.disabled&&(
        <div style={{background:"#fff3e0",border:"2px solid #e65100",borderRadius:12,padding:"12px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>⚠️</span>
          <p style={{color:"#e65100",fontSize:15,fontWeight:"bold",margin:0}}>This student is currently DISABLED.</p>
        </div>
      )}
      <div style={{...S.card,display:"flex",alignItems:"center",gap:20,marginBottom:20,flexWrap:"wrap",opacity:local.disabled?0.7:1}}>
        <div style={{flexShrink:0}}><Avatar student={local} size={80}/></div>
        <div style={{flex:1,minWidth:180}}>
          {isAdmin&&editing?(
            <div style={S.flexCol}>
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
      {isAdmin&&(
        <div style={{marginBottom:18,display:"flex",gap:10,flexWrap:"wrap"}}>
          {editing
            ?<><button onClick={save} style={{...S.btnPrimary,fontSize:16}} disabled={saving}>{saving?"Saving...":"✅ Save"}</button>
               <button onClick={cancel} style={{...S.btnGhost,fontSize:16}}>Cancel</button></>
            :<button onClick={()=>setEditing(true)} style={{...S.btnGold,fontSize:16}}>✏️ Edit Student</button>
          }
          <button onClick={toggleDisable} style={{...local.disabled?S.btnSuccess:S.btnWarning,fontSize:14,padding:"10px 18px"}}>
            {local.disabled?"✅ Enable":"🚫 Disable"}
          </button>
          <button onClick={deleteStudent} style={{...S.btnDanger,fontSize:14,padding:"10px 18px"}}>🗑️ Delete</button>
        </div>
      )}
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        <button style={S.tab(tab==="progress")} onClick={()=>setTab("progress")}>📖 Qur'an Progress</button>
        <button style={S.tab(tab==="messages")} onClick={()=>setTab("messages")}>
          {isAdmin?"💬 Messages":"💬 Message Teacher"}
          {isAdmin&&adminUnread>0&&<span style={{background:C.notif,color:"#fff",borderRadius:"50%",fontSize:12,padding:"2px 7px",marginLeft:7,fontWeight:"bold"}}>{adminUnread}</span>}
          {isParent&&parentUnread>0&&<span style={{background:C.notif,color:"#fff",borderRadius:"50%",fontSize:12,padding:"2px 7px",marginLeft:7,fontWeight:"bold"}}>{parentUnread}</span>}
        </button>
        <button style={S.tab(tab==="payment")} onClick={()=>setTab("payment")}>💳 Payment</button>
      </div>
      {tab==="progress"&&(
        <>
          <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
            <div><label style={S.label}>YEAR</label>
              <select value={selYear} onChange={e=>{setSelYear(Number(e.target.value));setActiveWeek(0);}} style={{...S.inputSm,cursor:"pointer",color:C.primary,fontWeight:"bold"}}>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</select></div>
            <div><label style={S.label}>MONTH</label>
              <select value={selMonth} onChange={e=>{setSelMonth(e.target.value);setActiveWeek(0);}} style={{...S.inputSm,cursor:"pointer"}}>{MONTHS.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            {getWeeks().map((w,i)=>(
              <button key={i} onClick={()=>setActiveWeek(i)} style={S.tab(activeWeek===i)}>Week {w.week}</button>
            ))}
          </div>
          <div style={{marginBottom:20}}>
            <WeekTable weekData={getWeeks()[activeWeek]} onSaveSection={handleSaveSection} isAdmin={isAdmin}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
            <SummarySection label="✦ STRENGTHS" color={C.success} borderColor={C.success}
              value={local.summary?.strengths||""} isAdmin={isAdmin}
              onChange={v=>summaryChange("strengths",v)}
              onSave={()=>onSave(local)}
              onDelete={async()=>{const u={...local,summary:{...local.summary,strengths:""}};setLocal(u);await onSave(u);}}
            />
            <SummarySection label="✦ TO IMPROVE" color="#b07020" borderColor="#e0a030"
              value={local.summary?.improve||""} isAdmin={isAdmin}
              onChange={v=>summaryChange("improve",v)}
              onSave={()=>onSave(local)}
              onDelete={async()=>{const u={...local,summary:{...local.summary,improve:""}};setLocal(u);await onSave(u);}}
            />
          </div>
        </>
      )}
      {tab==="messages"&&<MessageSection student={local} isAdmin={isAdmin} onSave={onSave}/>}
      {tab==="payment"&&<PaymentSection student={local} onSave={onSave} isAdmin={isAdmin}/>}
      <div style={{marginTop:30,paddingTop:20,borderTop:`1px solid ${C.border}`}}>
        <BackButton onBack={onBack}/>
      </div>
    </div>
  );
}

function StudentCard({ student, onSelect, unreadCount=0 }) {
  return (
    <button onClick={()=>onSelect(student)} style={{background:student.disabled?"#f5f5f5":"#fff",border:`1.5px solid ${student.disabled?"#e0e0e0":C.border}`,borderRadius:16,padding:20,cursor:"pointer",textAlign:"left",fontFamily:FONT,display:"flex",alignItems:"center",gap:16,width:"100%",boxShadow:"0 2px 10px rgba(0,0,0,0.05)",position:"relative",opacity:student.disabled?0.65:1}}>
      {student.disabled&&<span style={{position:"absolute",top:10,left:12,background:"#e65100",color:"#fff",fontSize:10,fontWeight:"bold",borderRadius:8,padding:"2px 8px"}}>DISABLED</span>}
      {unreadCount>0&&<div style={{position:"absolute",top:12,right:12,background:C.notif,color:"#fff",borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:"bold"}}>{unreadCount}</div>}
      <div style={{flexShrink:0}}><Avatar student={student} size={64}/></div>
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

function AdminView({ students, onSelect, onSetupSlot, accounts, onSaveAccounts }) {
  const [search,setSearch] = useState("");
  const [filter,setFilter] = useState("all");
  const [showAccounts,setShowAccounts] = useState(false);
  const familyIds = FAMILY_GROUPS.flatMap(g=>g.ids);
  const active = students.filter(s=>s.name);
  const empty = students.filter(s=>!s.name);
  const individual = active.filter(s=>!familyIds.includes(s.id)).sort((a,b)=>a.name.localeCompare(b.name));
  const getUnread = (s) => (s.adminNotifs||[]).filter(n=>!n.read).length;
  const filtered = search.trim() ? active.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>a.name.localeCompare(b.name)) : null;
  const divider = (label) => (
    <div style={{display:"flex",alignItems:"center",gap:10,margin:"22px 0 14px"}}>
      <div style={{height:2,flex:1,background:`linear-gradient(90deg,${C.border},transparent)`}}/>
      <span style={{color:C.primary,fontSize:13,fontWeight:"bold",background:"#E8F5E9",padding:"5px 14px",borderRadius:22,border:`1px solid ${C.border}`}}>{label}</span>
      <div style={{height:2,flex:1,background:`linear-gradient(90deg,transparent,${C.border})`}}/>
    </div>
  );
  return (
    <div>
      <div style={{marginBottom:16}}>
        <button onClick={()=>setShowAccounts(p=>!p)} style={{...S.btnGhost,fontSize:14,padding:"9px 18px"}}>
          🔑 {showAccounts?"Hide":"Manage"} Parent Accounts
        </button>
      </div>
      {showAccounts&&<div style={{marginBottom:24}}><AccountManager accounts={accounts} onSave={onSaveAccounts} students={students}/></div>}
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:1,minWidth:200}}>
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:C.textLight,fontSize:17}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search student..." style={{...S.input,paddingLeft:42,fontSize:15}}/>
          {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.textLight,cursor:"pointer",fontSize:18}}>✕</button>}
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{...S.inputSm,cursor:"pointer",color:C.primary,fontWeight:"bold",fontSize:15}}>
          <option value="all">👥 All</option>
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
            {divider(`INDIVIDUAL (${individual.length})`)}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:14}}>{individual.map(s=><StudentCard key={s.id} student={s} onSelect={onSelect} unreadCount={getUnread(s)}/>)}</div>
          </>)}
          {(filter==="all"||filter==="families")&&(<>
            {divider(`FAMILY GROUPS (${FAMILY_GROUPS.length})`)}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {FAMILY_GROUPS.map(group=>{
                const gs=group.ids.map(id=>students.find(s=>s.id===id)).filter(s=>s&&s.name).sort((a,b)=>a.name.localeCompare(b.name));
                if(!gs.length) return null;
                return(
                  <div key={group.label} style={{background:"#F1F8F1",border:"1.5px solid #C8E6C9",borderRadius:16,padding:"18px 16px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
                      <p style={{color:C.primary,fontSize:15,fontWeight:"bold",margin:0}}>👨‍👩‍👧‍👦 {group.label.toUpperCase()} · {gs.length} students</p>
                      <button onClick={()=>{ const next=students.find(s=>!s.name&&group.ids.includes(s.id)); if(next) onSetupSlot(next.id); else alert("No empty slots in this family group."); }} style={{...S.btnGhost,fontSize:13,padding:"6px 14px"}}>+ Add Student</button>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>{gs.map(s=><StudentCard key={s.id} student={s} onSelect={onSelect} unreadCount={getUnread(s)}/>)}</div>
                  </div>
                );
              })}
            </div>
          </>)}
          {filter==="all"&&empty.length>0&&(<>
            {divider(`FUTURE SLOTS (${empty.length})`)}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
              {empty.map(s=>(
                <div key={s.id} style={{background:"#FAFFFE",border:"2px dashed #A5D6A7",borderRadius:16,padding:20,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
                  <Avatar student={s} size={56}/>
                  <p style={{color:C.textLight,fontSize:14,margin:0}}>Slot #{s.id}</p>
                  <button onClick={()=>onSetupSlot(s.id)} style={{...S.btnGhost,fontSize:14,padding:"8px 16px"}}>+ Set Up</button>
                </div>
              ))}
            </div>
          </>)}
        </>
      )}
    </div>
  );
}

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

function Dashboard({ account, onLogout }) {
  const [students,setStudents] = useState(STUDENTS);
  const [selected,setSelected] = useState(null);
  const [showNotif,setShowNotif] = useState(false);
  const [showAnnounce,setShowAnnounce] = useState(false);
  const [announcements,setAnnouncements] = useState([]);
  const isAdmin = account.role==="admin";
  const isParent = account.role==="parent";
  const visibleStudents = students.filter(s=>isAdmin?true:account.studentIds.includes(s.id));
  const adminNotifs = isAdmin ? students.flatMap(s=>(s.adminNotifs||[]).map(n=>({...n,studentName:s.name}))) : [];
  const parentNotifs = isParent ? visibleStudents.flatMap(s=>(s.parentNotifs||[])) : [];
  const myNotifs = isAdmin ? adminNotifs : parentNotifs;
  const unreadCount = myNotifs.filter(n=>!n.read).length;
  const unreadAnnounce = announcements.filter(a=>!a.read).length;

  useEffect(()=>{
    const unsubs=STUDENTS.map(s=>{
      const ref=doc(db,"students",String(s.id));
      return onSnapshot(ref,snap=>{ if(snap.exists()){ const data=snap.data(); setStudents(prev=>prev.map(p=>p.id===s.id?{...p,...data}:p)); setSelected(prev=>prev&&prev.id===s.id?{...prev,...data}:prev); }});
    });
    const unsubA=onSnapshot(doc(db,"config","announcements"),snap=>{ if(snap.exists()) setAnnouncements(snap.data().list||[]); });
    return()=>{ unsubs.forEach(u=>u()); unsubA(); };
  },[]);

  const handleSave = async (updated) => {
    try{ await setDoc(doc(db,"students",String(updated.id)),updated); }catch(e){console.error(e);}
    setStudents(prev=>prev.map(s=>s.id===updated.id?updated:s));
    setSelected(updated);
  };

  const addAnnouncement = async (ann) => {
    const newList=[...announcements,ann];
    await setDoc(doc(db,"config","announcements"),{list:newList});
    setAnnouncements(newList);
  };

  const deleteAnnouncement = async (idx) => {
    const newList=announcements.filter((_,i)=>i!==idx);
    await setDoc(doc(db,"config","announcements"),{list:newList});
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
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26,background:"#fff",borderRadius:16,padding:"16px 22px",boxShadow:"0 3px 12px rgba(0,0,0,0.08)",border:"1.5px solid #C8E6C9",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{width:50,height:50,borderRadius:"50%",background:"linear-gradient(135deg,#2E7D32,#1B5E20)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,color:"#F9A825",fontWeight:"800",border:"2px solid #F9A825",flexShrink:0,boxShadow:"0 2px 8px rgba(27,94,32,0.3)"}}>DN</div>
            <div>
              <h1 style={{color:"#1B5E20",fontSize:20,margin:0,fontWeight:"800",letterSpacing:0.5}}>Darul Noor Education Hub</h1>
              <p style={{color:"#4E6B4E",fontSize:13,margin:"3px 0 0"}}>{isAdmin?"Admin Dashboard":"Parent Portal"} · Qur'an Tracker <span style={{color:"#2E7D32",fontSize:12}}>● Live</span></p>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginLeft:"auto"}}>
            <button onClick={onLogout} style={{background:"transparent",border:"2px solid #2E7D32",borderRadius:10,padding:"9px 18px",color:"#2E7D32",fontSize:15,cursor:"pointer",fontFamily:"'Inter','Segoe UI',sans-serif",fontWeight:"600"}}>Sign Out</button>
            {/* Announcement badge */}
            <div style={{position:"relative"}}>
              <button onClick={()=>{setShowAnnounce(p=>!p);setShowNotif(false);}} style={{background:unreadAnnounce>0?"#FFF3E0":"#f8f8f8",border:`1.5px solid ${unreadAnnounce>0?"#E65100":"#C8E6C9"}`,borderRadius:12,padding:"10px 14px",cursor:"pointer",fontSize:20,position:"relative"}}>
                📢
                {unreadAnnounce>0&&<span style={{position:"absolute",top:-8,right:-8,background:"#E65100",color:"#fff",borderRadius:"50%",minWidth:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:"bold",padding:"0 4px"}}>
                  {unreadAnnounce}
                </span>}
              </button>
              {showAnnounce&&(
                <div style={{position:"absolute",top:56,right:0,width:350,background:"#fff",border:"1.5px solid #C8E6C9",borderRadius:16,boxShadow:"0 8px 32px rgba(0,0,0,0.12)",zIndex:1000,overflow:"hidden"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",borderBottom:"1px solid #C8E6C9",background:"#FFF3E0"}}>
                    <p style={{color:"#E65100",fontSize:16,fontWeight:"700",margin:0}}>📢 Announcements</p>
                    <button onClick={()=>setShowAnnounce(false)} style={{background:"none",border:"none",color:"#7A977A",cursor:"pointer",fontSize:20}}>✕</button>
                  </div>
                  {isAdmin&&(
                    <AnnouncementCompose onPost={addAnnouncement}/>
                  )}
                  <div style={{maxHeight:300,overflowY:"auto"}}>
                    {announcements.length===0
                      ?<p style={{color:"#7A977A",fontSize:14,margin:"20px",textAlign:"center",fontStyle:"italic"}}>No announcements yet.</p>
                      :[...announcements].reverse().map((a,i)=>(
                        <div key={i} style={{padding:"12px 18px",borderBottom:"1px solid #C8E6C9",background:a.read?"#fff":"#FFFDE7"}}>
                          <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
                            <div style={{flex:1}}>
                              <p style={{color:"#1A1A1A",fontSize:15,fontWeight:"700",margin:"0 0 4px"}}>{a.title}</p>
                              <p style={{color:"#2D3A2D",fontSize:14,margin:"0 0 5px",lineHeight:1.5}}>{a.text}</p>
                              <p style={{color:"#7A977A",fontSize:12,margin:0}}>📅 {a.time}</p>
                            </div>
                            {isAdmin&&<button onClick={()=>deleteAnnouncement(announcements.length-1-i)} style={{background:"none",border:"none",color:"#C62828",cursor:"pointer",fontSize:16,padding:"2px 6px"}}>🗑️</button>}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
            {/* Bell notification */}
            <div style={{position:"relative"}}>
              <button onClick={()=>{setShowNotif(p=>!p);setShowAnnounce(false);}} style={{background:unreadCount>0?"#fff8e8":"#f8f8f8",border:`1.5px solid ${unreadCount>0?"#e0c060":"#C8E6C9"}`,borderRadius:12,padding:"10px 14px",cursor:"pointer",fontSize:20,position:"relative"}}>
                🔔
                {unreadCount>0&&<span style={{position:"absolute",top:-8,right:-8,background:"#D32F2F",color:"#fff",borderRadius:"50%",minWidth:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:"bold",padding:"0 4px"}}>{unreadCount}</span>}
              </button>
              {showNotif&&(
                <div style={{position:"absolute",top:56,right:0,width:340,background:"#fff",border:"1.5px solid #C8E6C9",borderRadius:16,boxShadow:"0 8px 32px rgba(0,0,0,0.12)",zIndex:1000,overflow:"hidden"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",borderBottom:"1px solid #C8E6C9",background:"#E8F5E9"}}>
                    <p style={{color:"#1B5E20",fontSize:15,fontWeight:"700",margin:0}}>🔔 Notifications</p>
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={clearAllNotifs} style={{background:"none",border:"none",color:"#4E6B4E",cursor:"pointer",fontSize:13,fontFamily:"'Inter','Segoe UI',sans-serif"}}>Mark all read</button>
                      <button onClick={()=>setShowNotif(false)} style={{background:"none",border:"none",color:"#7A977A",cursor:"pointer",fontSize:18}}>✕</button>
                    </div>
                  </div>
                  <div style={{maxHeight:340,overflowY:"auto"}}>
                    {myNotifs.length===0
                      ?<p style={{color:"#7A977A",fontSize:14,margin:"20px",textAlign:"center",fontStyle:"italic"}}>No notifications</p>
                      :[...myNotifs].reverse().map((n,i)=>(
                        <div key={i} style={{padding:"12px 18px",borderBottom:"1px solid #C8E6C9",background:n.read?"#fff":"#F1F8F1"}}>
                          <p style={{color:"#1A1A1A",fontSize:14,margin:"0 0 4px",lineHeight:1.4}}>{n.text}</p>
                          <p style={{color:"#7A977A",fontSize:12,margin:0}}>{n.time}</p>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {selected?(
          <StudentDetail student={selected} onBack={()=>setSelected(null)} isAdmin={isAdmin} isParent={isParent} onSave={handleSave}/>
        ):(
          <>
            <p style={{color:"#4E6B4E",fontSize:15,marginBottom:18}}>
              {isAdmin?`${visibleStudents.filter(s=>s.name).length} students`:visibleStudents.length>1?`${visibleStudents.length} children`:"Your child's progress"}
            </p>
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

function AnnouncementCompose({ onPost }) {
  const [title,setTitle] = useState("");
  const [text,setText] = useState("");
  const [saving,setSaving] = useState(false);
  const post = async () => {
    if(!title.trim()||!text.trim()) return;
    setSaving(true);
    await onPost({title:title.trim(),text:text.trim(),time:new Date().toLocaleString("en-AU"),read:false});
    setTitle(""); setText(""); setSaving(false);
  };
  return (
    <div style={{padding:"14px 18px",borderBottom:"1px solid #C8E6C9",background:"#FFFDE7"}}>
      <p style={{color:"#4E6B4E",fontSize:13,fontWeight:"700",margin:"0 0 8px"}}>NEW ANNOUNCEMENT</p>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title (e.g. Holiday Notice)"
        style={{width:"100%",background:"#fff",border:"1.5px solid #C8E6C9",borderRadius:8,padding:"9px 12px",color:"#1A1A1A",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Inter','Segoe UI',sans-serif",marginBottom:8}}/>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write announcement..."
        style={{width:"100%",background:"#fff",border:"1.5px solid #C8E6C9",borderRadius:8,padding:"9px 12px",color:"#1A1A1A",fontSize:14,outline:"none",fontFamily:"'Inter','Segoe UI',sans-serif",resize:"vertical",minHeight:65,boxSizing:"border-box",marginBottom:10}}/>
      <button onClick={post} disabled={saving||!title.trim()||!text.trim()}
        style={{background:"linear-gradient(135deg,#F9A825,#9E6C00)",border:"none",borderRadius:8,padding:"9px 18px",color:"#fff",fontSize:14,fontWeight:"700",cursor:"pointer",fontFamily:"'Inter','Segoe UI',sans-serif",opacity:(saving||!title.trim()||!text.trim())?0.5:1}}>
        {saving?"Posting...":"📤 Post"}
      </button>
    </div>
  );
}

export default function App() {
  const [account,setAccount] = useState(null);
  return account?<Dashboard account={account} onLogout={()=>setAccount(null)}/>:<LoginScreen onLogin={setAccount}/>;
}
