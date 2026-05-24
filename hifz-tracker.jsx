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

const EMPTY_WEEKS = () => [1,2,3,4].map(week => ({
  week,
  days: [
    { day: "Monday", sabq: "", manzil: "", notes: "" },
    { day: "Tuesday", sabq: "", manzil: "", notes: "" },
    { day: "Wednesday", sabq: "", manzil: "", notes: "" },
    { day: "Thursday", sabq: "", manzil: "", notes: "" },
  ],
  teacherFeedback: "",
}));

const EMPTY_PROGRESS = () => {
  const result = {};
  [2026,2027,2028].forEach(yr => {
    result[yr] = {};
    ["January","February","March","April","May","June","July","August","September","October","November","December"].forEach(m => {
      result[yr][m] = EMPTY_WEEKS();
    });
  });
  return result;
};

const EMPTY_PAYMENTS = () => {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const result = {};
  [2026,2027].forEach(yr => {
    result[yr] = {};
    months.forEach(m => { result[yr][m] = { paid: null, comment: "" }; });
  });
  return result;
};

const makeStudent = (id, name) => ({
  id, name, grade: "", teacher: "", weeks: EMPTY_WEEKS(),
  summary: { strengths: "", improve: "" }, progress: 0,
  payments: EMPTY_PAYMENTS(),
  quranProgress: EMPTY_PROGRESS(),
});

const STUDENTS = [
  makeStudent(1,  "Asiya Islam"),
  makeStudent(2,  "Aafiyah Zainab"),
  makeStudent(3,  "Hafsa Nawed"),
  makeStudent(4,  "Husna Nawed"),
  makeStudent(5,  "Aowaab Yousuf"),
  makeStudent(6,  "Hajera Hamda Fatima"),
  makeStudent(7,  "Anaya Kamal"),
  makeStudent(8,  "Hamza Sazzad"),
  makeStudent(9,  "Maryam Bint Rabi"),
  makeStudent(10, "Eesa Zohaib"),
  makeStudent(11, "Yusra Sheikh"),
  makeStudent(12, "Ibraheem Munsi"),
  makeStudent(13, "Maryam Munsi"),
  makeStudent(14, "Yusuf Bin Ali"),
  makeStudent(15, "Aisha Khanam"),
  makeStudent(16, "Mohammed Ibrahim Faizan"),
  makeStudent(17, "Mohammed Idrees"),
  makeStudent(18, "Munazza Fatima"),
  makeStudent(19, "Manha Fatima"),
  makeStudent(20, "Azwar Rahman"),
  makeStudent(21, "Owais Abdul Aziz"),
  makeStudent(22, "Uzair Abdul Aziz"),
  makeStudent(23, "Halima Abdusamed Hassan"),
  makeStudent(24, "Abubakr Siddik"),
  makeStudent(25, "Abuobaida Siddik"),
  makeStudent(26, "Abuhuraira Siddik"),
  makeStudent(27, "Abrar Farzad"),
  makeStudent(28, "Ali Faraz"),

];

const ACCOUNTS = [
  { login: "admin@darulnoor",           password: "darulnoor",      role: "admin",  studentIds: STUDENTS.map(s => s.id) },
  { login: "asiya.i@darulnoor",         password: "islam123",       role: "parent", studentIds: [1] },
  { login: "aafiyah.z@darulnoor",       password: "zainab123",      role: "parent", studentIds: [2] },
  { login: "family.nawed@darulnoor",    password: "nawed123",       role: "parent", studentIds: [3,4] },
  { login: "aowaab.y@darulnoor",        password: "yousuf123",      role: "parent", studentIds: [5] },
  { login: "hajera.h@darulnoor",        password: "hamda123",       role: "parent", studentIds: [6] },
  { login: "anaya.k@darulnoor",         password: "kamal123",       role: "parent", studentIds: [7] },
  { login: "hamza.s@darulnoor",         password: "sazzad123",      role: "parent", studentIds: [8] },
  { login: "maryam.b@darulnoor",        password: "rabi123",        role: "parent", studentIds: [9] },
  { login: "eesa.z@darulnoor",          password: "zohaib123",      role: "parent", studentIds: [10] },
  { login: "yusra.s@darulnoor",         password: "sheikh123",      role: "parent", studentIds: [11] },
  { login: "family.munsi@darulnoor",    password: "munsi123",       role: "parent", studentIds: [12,13] },
  { login: "yusuf.aisha@darulnoor",     password: "family123",      role: "parent", studentIds: [14,15] },
  { login: "muhammad.fatima@darulnoor", password: "family123",      role: "parent", studentIds: [16,17,18,19] },
  { login: "azwar.r@darulnoor",         password: "rahman123",      role: "parent", studentIds: [20] },
  { login: "family.abdulaziz@darulnoor",password: "abdulaziz123",   role: "parent", studentIds: [21,22] },
  { login: "halima.a@darulnoor",        password: "hassan123",      role: "parent", studentIds: [23] },
  { login: "family.siddik@darulnoor",   password: "siddik123",      role: "parent", studentIds: [24,25,26] },
  { login: "abrar.f@darulnoor",         password: "farzad123",      role: "parent", studentIds: [27] },
  { login: "ali.f@darulnoor",            password: "faraz123",       role: "parent", studentIds: [28] },
];

const DAYS = ["Monday","Tuesday","Wednesday","Thursday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const YEARS = [2026, 2027];
const LOGO = "/logo.jpg"; // Logo served from public folder

function IslamicPattern() {
  return (
    <svg style={{position:"fixed",inset:0,width:"100%",height:"100%",opacity:0.04,pointerEvents:"none",zIndex:0}} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="star" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <polygon points="40,5 47,28 72,28 52,43 59,67 40,52 21,67 28,43 8,28 33,28" fill="none" stroke="#c8a96e" strokeWidth="0.8"/>
          <polygon points="40,18 44,30 57,30 47,38 51,51 40,43 29,51 33,38 23,30 36,30" fill="none" stroke="#c8a96e" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#star)"/>
    </svg>
  );
}

function LoginScreen({ onLogin }) {
  const [login, setLogin] = useState(() => { try { return localStorage.getItem("dn_saved_login") || ""; } catch { return ""; } });
  const [password, setPassword] = useState(() => { try { return localStorage.getItem("dn_saved_password") || ""; } catch { return ""; } });
  const [remember, setRemember] = useState(() => { try { return !!localStorage.getItem("dn_saved_login"); } catch { return false; } });
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const handleLogin = () => {
    const acc = ACCOUNTS.find(a => a.login === login.trim().toLowerCase() && a.password.toLowerCase() === password.trim().toLowerCase());
    if (acc) {
      if (remember) {
        try { localStorage.setItem("dn_saved_login", login.trim().toLowerCase()); localStorage.setItem("dn_saved_password", password.trim()); } catch {}
      } else {
        try { localStorage.removeItem("dn_saved_login"); localStorage.removeItem("dn_saved_password"); } catch {}
      }
      onLogin(acc);
    } else { setError("Incorrect login or password. Please try again."); }
  };
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0a1f0a 0%,#0f1f0f 40%,#1a1200 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Georgia',serif",position:"relative",overflow:"hidden"}}>
      <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:600,height:600,background:"radial-gradient(ellipse,rgba(200,169,110,0.08) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:800,height:300,background:"radial-gradient(ellipse,rgba(34,100,34,0.12) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:440,padding:"0 24px"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:180,height:180,margin:"0 auto 20px",borderRadius:"50%",overflow:"hidden",border:"3px solid rgba(200,169,110,0.4)",boxShadow:"0 0 60px rgba(200,169,110,0.2),0 0 120px rgba(34,100,34,0.15)",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <img src={LOGO} alt="Darul Noor Logo" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          </div>
          <h1 style={{color:"#c8a96e",fontSize:30,fontWeight:"bold",letterSpacing:3,margin:"0 0 4px",textShadow:"0 0 30px rgba(200,169,110,0.4)"}}>DARUL NOOR</h1>
          <p style={{color:"#7a9a6a",fontSize:13,letterSpacing:3,margin:0,textTransform:"uppercase"}}>Education Hub</p>
          <div style={{width:60,height:1,background:"linear-gradient(90deg,transparent,#c8a96e,transparent)",margin:"12px auto 0"}}/>
        </div>
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(200,169,110,0.25)",borderRadius:18,padding:"28px 32px",backdropFilter:"blur(12px)",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}>
          <p style={{color:"#6b8a5a",fontSize:12,letterSpacing:2,textAlign:"center",margin:"0 0 20px",textTransform:"uppercase"}}>Student Quran Portal</p>
          <div style={{marginBottom:14}}>
            <label style={{color:"#8fa3b3",fontSize:11,letterSpacing:1.5,display:"block",marginBottom:7,textTransform:"uppercase"}}>Login ID</label>
            <input value={login} onChange={e=>setLogin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(200,169,110,0.2)",borderRadius:10,padding:"12px 14px",color:"#e8dcc8",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}
              onFocus={e=>e.target.style.borderColor="rgba(200,169,110,0.6)"} onBlur={e=>e.target.style.borderColor="rgba(200,169,110,0.2)"}
              placeholder="Enter your login ID"/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{color:"#8fa3b3",fontSize:11,letterSpacing:1.5,display:"block",marginBottom:7,textTransform:"uppercase"}}>Password</label>
            <div style={{position:"relative"}}>
              <input type={showPwd?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(200,169,110,0.2)",borderRadius:10,padding:"12px 42px 12px 14px",color:"#e8dcc8",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}
                onFocus={e=>e.target.style.borderColor="rgba(200,169,110,0.6)"} onBlur={e=>e.target.style.borderColor="rgba(200,169,110,0.2)"}
                placeholder="••••••••"/>
              <button onClick={()=>setShowPwd(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#8fa3b3",fontSize:16,padding:4,display:"flex",alignItems:"center"}}>
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          {error && <div style={{background:"rgba(220,80,80,0.1)",border:"1px solid rgba(220,80,80,0.3)",borderRadius:8,padding:"10px 14px",marginBottom:14}}><p style={{color:"#e07c7c",fontSize:12,margin:0,textAlign:"center"}}>⚠ {error}</p></div>}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,cursor:"pointer"}} onClick={()=>setRemember(r=>!r)}>
            <div style={{width:18,height:18,borderRadius:4,border:"1px solid rgba(200,169,110,0.4)",background:remember?"rgba(200,169,110,0.2)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {remember && <span style={{color:"#c8a96e",fontSize:13,lineHeight:1}}>✓</span>}
            </div>
            <span style={{color:"#8fa3b3",fontSize:12,userSelect:"none"}}>Remember my login details</span>
          </div>
          <button onClick={handleLogin}
            style={{width:"100%",background:"linear-gradient(135deg,#2d6a2d,#1a4a1a)",border:"1px solid rgba(200,169,110,0.4)",borderRadius:10,padding:"13px",color:"#c8a96e",fontSize:14,fontWeight:"bold",letterSpacing:2,cursor:"pointer",fontFamily:"inherit",textTransform:"uppercase",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}
            onMouseEnter={e=>{e.currentTarget.style.background="linear-gradient(135deg,#3a7a3a,#2a5a2a)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="linear-gradient(135deg,#2d6a2d,#1a4a1a)";}}>
            Sign In
          </button>
        </div>
        <p style={{color:"#2a4a2a",fontSize:13,textAlign:"center",marginTop:20,letterSpacing:2}}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
      </div>
    </div>
  );
}

function ProgressArc({ pct }) {
  const r=28,cx=36,cy=36,stroke=6,circ=2*Math.PI*r,dash=(pct/100)*circ;
  return (
    <svg width="72" height="72">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(200,169,110,0.15)" strokeWidth={stroke}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#c8a96e" strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ/4} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}/>
      <text x={cx} y={cy+5} textAnchor="middle" fill="#c8a96e" fontSize="13" fontWeight="bold">{pct}%</text>
    </svg>
  );
}

function WeekTable({ weekData, editing, onChange, onFeedbackChange }) {
  return (
    <div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr>
              <th style={{padding:"10px 12px",textAlign:"left",color:"#8fa3b3",fontWeight:"normal",fontSize:11,letterSpacing:1,borderBottom:"1px solid rgba(200,169,110,0.15)",minWidth:140}}>CATEGORY</th>
              {DAYS.map(d=><th key={d} style={{padding:"10px 12px",textAlign:"left",color:"#c8a96e",fontWeight:"normal",fontSize:11,letterSpacing:1,borderBottom:"1px solid rgba(200,169,110,0.15)",minWidth:150}}>{d.toUpperCase()}</th>)}
            </tr>
          </thead>
          <tbody>
            {["sabq","manzil","notes"].map((field,fi)=>(
              <tr key={field} style={{background:fi%2===0?"rgba(255,255,255,0.02)":"transparent"}}>
                <td style={{padding:"10px 12px",color:"#e8dcc8",fontSize:12,fontStyle:field==="notes"?"italic":"normal",borderBottom:"1px solid rgba(255,255,255,0.04)",whiteSpace:"nowrap"}}>
                  {field==="sabq"?"📖 Sabq (Daily Lesson)":field==="manzil"?"🔁 Manzil (Revision)":"📝 Teacher Notes"}
                </td>
                {weekData.days.map((day,di)=>(
                  <td key={di} style={{padding:"6px 8px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    {editing
                      ? <input value={day[field]} onChange={e=>onChange(di,field,e.target.value)} style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(200,169,110,0.25)",borderRadius:6,padding:"6px 8px",color:"#e8dcc8",fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}} placeholder="—"/>
                      : <span style={{color:day[field]?(field==="notes"?"#8fa3b3":"#d4c4a8"):"#2d3f4f",fontStyle:field==="notes"?"italic":"normal"}}>{day[field]||"—"}</span>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Teacher Feedback section below table */}
      <div style={{padding:"14px 16px",borderTop:"1px solid rgba(200,169,110,0.12)",background:"rgba(200,169,110,0.03)"}}>
        <p style={{color:"#c8a96e",fontSize:11,letterSpacing:1,margin:"0 0 8px"}}>✍️ TEACHER'S WEEKLY FEEDBACK</p>
        {editing
          ? <textarea value={weekData.teacherFeedback||""} onChange={e=>onFeedbackChange(e.target.value)}
              placeholder="Enter overall feedback for this week..."
              style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(200,169,110,0.2)",borderRadius:8,padding:"10px 12px",color:"#d4c4a8",fontSize:13,outline:"none",fontFamily:"inherit",resize:"vertical",minHeight:70,boxSizing:"border-box",lineHeight:1.6}}/>
          : <p style={{color:weekData.teacherFeedback?"#d4c4a8":"#2d3f4f",fontSize:13,margin:0,lineHeight:1.6,fontStyle:weekData.teacherFeedback?"normal":"italic"}}>
              {weekData.teacherFeedback||"No feedback entered yet."}
            </p>
        }
      </div>
    </div>
  );
}

function FeedbackSection({ payments, onUpdate, isParent }) {
  const [selYear, setSelYear] = useState(2026);
  const [selMonth, setSelMonth] = useState(MONTHS[new Date().getMonth()]);
  const entry = payments?.[selYear]?.[selMonth] || { paid: null, comment: "" };

  const inp = (field, val) => {
    const updated = JSON.parse(JSON.stringify(payments));
    updated[selYear][selMonth][field] = val;
    onUpdate(updated);
  };

  return (
    <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(200,169,110,0.15)",borderRadius:12,padding:20}}>
      <p style={{color:"#c8a96e",fontSize:11,letterSpacing:1.5,margin:"0 0 16px",textTransform:"uppercase"}}>💬 Parent Feedback</p>

      {/* Year + Month selectors */}
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          <label style={{color:"#8fa3b3",fontSize:10,letterSpacing:1}}>YEAR</label>
          <select value={selYear} onChange={e=>setSelYear(Number(e.target.value))}
            style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(200,169,110,0.25)",borderRadius:8,padding:"8px 12px",color:"#e8dcc8",fontSize:13,outline:"none",fontFamily:"inherit",cursor:"pointer"}}>
            {YEARS.map(y=><option key={y} value={y} style={{background:"#1a2a1a"}}>{y}</option>)}
          </select>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          <label style={{color:"#8fa3b3",fontSize:10,letterSpacing:1}}>MONTH</label>
          <select value={selMonth} onChange={e=>setSelMonth(e.target.value)}
            style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(200,169,110,0.25)",borderRadius:8,padding:"8px 12px",color:"#e8dcc8",fontSize:13,outline:"none",fontFamily:"inherit",cursor:"pointer"}}>
            {MONTHS.map(m=><option key={m} value={m} style={{background:"#1a2a1a"}}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Comment box */}
      <div style={{marginBottom:16}}>
        <label style={{color:"#8fa3b3",fontSize:10,letterSpacing:1,display:"block",marginBottom:8}}>YOUR FEEDBACK FOR {selMonth.toUpperCase()} {selYear}</label>
        {isParent ? (
          <textarea value={entry.comment} onChange={e=>inp("comment",e.target.value)}
            placeholder="Write your feedback or message for this month here..."
            style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(200,169,110,0.2)",borderRadius:8,padding:"12px",color:"#d4c4a8",fontSize:13,outline:"none",fontFamily:"inherit",resize:"vertical",minHeight:100,boxSizing:"border-box",lineHeight:1.6}}
          />
        ) : (
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(200,169,110,0.1)",borderRadius:8,padding:"12px",minHeight:80}}>
            <p style={{color:entry.comment?"#d4c4a8":"#2d3f4f",fontSize:13,margin:0,fontStyle:entry.comment?"normal":"italic",lineHeight:1.6}}>{entry.comment||"No feedback from parent yet."}</p>
          </div>
        )}
      </div>

      {/* Previous months with comments */}
      <div>
        <p style={{color:"#6b7f8e",fontSize:10,letterSpacing:1,margin:"0 0 10px"}}>PREVIOUS FEEDBACK</p>
        <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:260,overflowY:"auto"}}>
          {MONTHS.filter(m => payments?.[selYear]?.[m]?.comment).map(m => (
            <div key={m} onClick={()=>setSelMonth(m)} style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${m===selMonth?"rgba(200,169,110,0.4)":"rgba(255,255,255,0.07)"}`,borderRadius:8,padding:"10px 14px",cursor:"pointer"}}>
              <p style={{color:"#c8a96e",fontSize:10,letterSpacing:1,margin:"0 0 4px"}}>{m.toUpperCase()} {selYear}</p>
              <p style={{color:"#d4c4a8",fontSize:12,margin:0,lineHeight:1.5}}>{payments[selYear][m].comment}</p>
            </div>
          ))}
          {!MONTHS.some(m => payments?.[selYear]?.[m]?.comment) && (
            <p style={{color:"#2d3f4f",fontSize:12,margin:0,fontStyle:"italic"}}>No feedback recorded for {selYear} yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentSection({ payments, onUpdate, isParent }) {
  const [selYear, setSelYear] = useState(2026);
  const [selMonth, setSelMonth] = useState(MONTHS[new Date().getMonth()]);
  const entry = payments?.[selYear]?.[selMonth] || { paid: null, comment: "" };

  const inp = (field, val) => {
    const updated = JSON.parse(JSON.stringify(payments));
    updated[selYear][selMonth][field] = val;
    onUpdate(updated);
  };

  const paidColor = entry.paid === true ? "#7dcf9e" : entry.paid === false ? "#e07c7c" : "#6b7f8e";
  const paidBg = entry.paid === true ? "rgba(100,200,100,0.15)" : entry.paid === false ? "rgba(220,80,80,0.12)" : "rgba(255,255,255,0.04)";
  const paidBorder = entry.paid === true ? "rgba(100,200,100,0.4)" : entry.paid === false ? "rgba(220,80,80,0.3)" : "rgba(200,169,110,0.2)";

  return (
    <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(200,169,110,0.15)",borderRadius:12,padding:20,marginTop:20}}>
      <p style={{color:"#c8a96e",fontSize:11,letterSpacing:1.5,margin:"0 0 16px",textTransform:"uppercase"}}>💳 Payment Status</p>

      {/* Year + Month selectors */}
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          <label style={{color:"#8fa3b3",fontSize:10,letterSpacing:1}}>YEAR</label>
          <select value={selYear} onChange={e=>setSelYear(Number(e.target.value))}
            style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(200,169,110,0.25)",borderRadius:8,padding:"8px 12px",color:"#e8dcc8",fontSize:13,outline:"none",fontFamily:"inherit",cursor:"pointer"}}>
            {YEARS.map(y=><option key={y} value={y} style={{background:"#1a2a1a"}}>{y}</option>)}
          </select>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          <label style={{color:"#8fa3b3",fontSize:10,letterSpacing:1}}>MONTH</label>
          <select value={selMonth} onChange={e=>setSelMonth(e.target.value)}
            style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(200,169,110,0.25)",borderRadius:8,padding:"8px 12px",color:"#e8dcc8",fontSize:13,outline:"none",fontFamily:"inherit",cursor:"pointer"}}>
            {MONTHS.map(m=><option key={m} value={m} style={{background:"#1a2a1a"}}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Payment status display + parent toggle */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <div style={{background:paidBg,border:`1px solid ${paidBorder}`,borderRadius:10,padding:"10px 18px",display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:16}}>{entry.paid===true?"✅":entry.paid===false?"❌":"⏳"}</span>
          <span style={{color:paidColor,fontSize:13,fontWeight:"bold"}}>{entry.paid===true?"PAID":entry.paid===false?"NOT PAID":"NOT SET"}</span>
        </div>
        {isParent && (
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>inp("paid",true)}
              style={{background:entry.paid===true?"rgba(100,200,100,0.2)":"transparent",border:"1px solid rgba(100,200,100,0.4)",borderRadius:8,padding:"8px 16px",color:"#7dcf9e",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:entry.paid===true?"bold":"normal"}}>
              ✓ Yes — Paid
            </button>
            <button onClick={()=>inp("paid",false)}
              style={{background:entry.paid===false?"rgba(220,80,80,0.2)":"transparent",border:"1px solid rgba(220,80,80,0.35)",borderRadius:8,padding:"8px 16px",color:"#e07c7c",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:entry.paid===false?"bold":"normal"}}>
              ✗ No — Not Paid
            </button>
          </div>
        )}
      </div>

      {/* Monthly overview mini grid */}
      <div style={{marginBottom:16}}>
        <p style={{color:"#6b7f8e",fontSize:10,letterSpacing:1,margin:"0 0 8px"}}>{selYear} OVERVIEW</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
          {MONTHS.map(m => {
            const p = payments?.[selYear]?.[m]?.paid;
            return (
              <div key={m} onClick={()=>setSelMonth(m)} title={m}
                style={{width:28,height:28,borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,
                  background:p===true?"rgba(100,200,100,0.25)":p===false?"rgba(220,80,80,0.2)":"rgba(255,255,255,0.05)",
                  border:`1px solid ${m===selMonth?"#c8a96e":p===true?"rgba(100,200,100,0.4)":p===false?"rgba(220,80,80,0.3)":"rgba(255,255,255,0.1)"}`,
                  color:p===true?"#7dcf9e":p===false?"#e07c7c":"#4a5a6a",fontWeight:"bold"}}>
                {m.slice(0,1)}
              </div>
            );
          })}
        </div>
        <p style={{color:"#3d5166",fontSize:10,margin:"6px 0 0"}}>Click a month letter to jump to it</p>
      </div>

    </div>
  );
}

function StudentCard({ student, onClick }) {
  return (
    <button onClick={onClick} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(200,169,110,0.15)",borderRadius:14,padding:24,cursor:"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",alignItems:"center",gap:18,width:"100%"}}
      onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(200,169,110,0.5)"}
      onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(200,169,110,0.15)"}>
      <div style={{width:52,height:52,borderRadius:"50%",background:student.name?"linear-gradient(135deg,#c8a96e,#8b6914)":"rgba(200,169,110,0.1)",border:student.name?"none":"1px dashed rgba(200,169,110,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:student.name?"#0f1923":"#3d5166",fontWeight:"bold",flexShrink:0}}>
        {student.name?student.name.charAt(0).toUpperCase():"?"}
      </div>
      <div style={{flex:1}}>
        <p style={{color:student.name?"#e8dcc8":"#3d5166",fontSize:15,margin:"0 0 4px",fontWeight:"normal"}}>{student.name||"Empty"}</p>
        <p style={{color:"#6b7f8e",fontSize:12,margin:"0 0 10px"}}>{student.grade||"—"} · {student.teacher||"—"}</p>
        <div style={{background:"rgba(200,169,110,0.1)",borderRadius:4,height:5,overflow:"hidden"}}>
          <div style={{width:`${student.progress}%`,height:"100%",background:"linear-gradient(90deg,#c8a96e,#e8c882)",borderRadius:4}}/>
        </div>
        <p style={{color:student.progress>0?"#c8a96e":"#3d5166",fontSize:11,margin:"5px 0 0"}}>{student.progress>0?`${student.progress}% completed`:"Not started"}</p>
      </div>
    </button>
  );
}

function StudentDetail({ student, onBack, isAdmin, isParent, onSave }) {
  const [activeTab, setActiveTab] = useState("progress");
  const [activeWeek, setActiveWeek] = useState(0);
  const [selYear, setSelYear] = useState(2026);
  const [selMonth, setSelMonth] = useState(MONTHS[new Date().getMonth()]);
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(JSON.parse(JSON.stringify(student)));

  const getWeeks = () => local.quranProgress?.[selYear]?.[selMonth] || EMPTY_WEEKS();

  const cellChange = (di,field,val) => {
    const u=JSON.parse(JSON.stringify(local));
    if (!u.quranProgress) u.quranProgress = EMPTY_PROGRESS();
    u.quranProgress[selYear][selMonth][activeWeek].days[di][field]=val;
    setLocal(u);
  };
  const feedbackChange = (val) => {
    const u=JSON.parse(JSON.stringify(local));
    if (!u.quranProgress) u.quranProgress = EMPTY_PROGRESS();
    u.quranProgress[selYear][selMonth][activeWeek].teacherFeedback=val;
    setLocal(u);
  };
  const fieldChange = (f,v) => setLocal(p=>({...p,[f]:v}));
  const summaryChange = (k,v) => setLocal(p=>({...p,summary:{...p.summary,[k]:v}}));
  const paymentUpdate = (updated) => { const u={...local,payments:updated}; setLocal(u); onSave(u); };
  const save = () => { onSave(local); setEditing(false); };
  const cancel = () => { setLocal(JSON.parse(JSON.stringify(student))); setEditing(false); };
  const s = local;

  const tabStyle = (t) => ({
    padding:"9px 20px",borderRadius:20,border:"1px solid",cursor:"pointer",fontFamily:"inherit",fontSize:13,
    borderColor:activeTab===t?"#c8a96e":"rgba(200,169,110,0.2)",
    background:activeTab===t?"rgba(200,169,110,0.15)":"transparent",
    color:activeTab===t?"#c8a96e":"#6b7f8e",
  });

  return (
    <div>
      <button onClick={onBack} style={{background:"none",border:"none",color:"#c8a96e",cursor:"pointer",fontSize:13,letterSpacing:1,padding:"0 0 20px 0",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit"}}>← BACK</button>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:20,flexWrap:"wrap"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#c8a96e,#8b6914)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,color:"#0f1923",fontWeight:"bold",flexShrink:0}}>
          {s.name?s.name.charAt(0).toUpperCase():"?"}
        </div>
        <div style={{flex:1}}>
          {isAdmin&&editing ? (
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <input value={s.name} onChange={e=>fieldChange("name",e.target.value)} placeholder="Student Name" style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(200,169,110,0.3)",borderRadius:6,padding:"6px 10px",color:"#e8dcc8",fontSize:16,outline:"none",fontFamily:"inherit"}}/>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <input value={s.grade} onChange={e=>fieldChange("grade",e.target.value)} placeholder="Grade / Class" style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(200,169,110,0.2)",borderRadius:6,padding:"5px 10px",color:"#8fa3b3",fontSize:13,outline:"none",fontFamily:"inherit",flex:1}}/>
                <input value={s.teacher} onChange={e=>fieldChange("teacher",e.target.value)} placeholder="Teacher Name" style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(200,169,110,0.2)",borderRadius:6,padding:"5px 10px",color:"#8fa3b3",fontSize:13,outline:"none",fontFamily:"inherit",flex:1}}/>
                <input type="number" min="0" max="100" value={s.progress} onChange={e=>fieldChange("progress",Number(e.target.value))} placeholder="Progress %" style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(200,169,110,0.2)",borderRadius:6,padding:"5px 10px",color:"#c8a96e",fontSize:13,outline:"none",fontFamily:"inherit",width:90}}/>
              </div>
            </div>
          ) : (
            <>
              <h2 style={{color:s.name?"#e8dcc8":"#3d5166",margin:0,fontSize:22,fontWeight:"normal"}}>{s.name||"No name"}</h2>
              <p style={{color:"#6b7f8e",margin:"4px 0 0",fontSize:13}}>{s.grade||"—"} · {s.teacher||"—"}</p>
            </>
          )}
        </div>
        <ProgressArc pct={s.progress}/>
      </div>



      {/* Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        <button style={tabStyle("progress")} onClick={()=>setActiveTab("progress")}>📖 Quran Progress</button>
        <button style={tabStyle("feedback")} onClick={()=>setActiveTab("feedback")}>💬 Feedback</button>
        <button style={tabStyle("payment")} onClick={()=>setActiveTab("payment")}>💳 Payment</button>
      </div>

      {activeTab === "progress" && (
        <>
          {/* Year + Month selectors */}
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"flex-end"}}>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              <label style={{color:"#8fa3b3",fontSize:10,letterSpacing:1}}>YEAR</label>
              <select value={selYear} onChange={e=>{setSelYear(Number(e.target.value));setActiveWeek(0);}}
                style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(200,169,110,0.25)",borderRadius:8,padding:"8px 14px",color:"#c8a96e",fontSize:13,outline:"none",fontFamily:"inherit",cursor:"pointer",fontWeight:"bold"}}>
                {[2026,2027,2028].map(y=><option key={y} value={y} style={{background:"#0a1a0a"}}>{y}</option>)}
              </select>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              <label style={{color:"#8fa3b3",fontSize:10,letterSpacing:1}}>MONTH</label>
              <select value={selMonth} onChange={e=>{setSelMonth(e.target.value);setActiveWeek(0);}}
                style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(200,169,110,0.25)",borderRadius:8,padding:"8px 14px",color:"#e8dcc8",fontSize:13,outline:"none",fontFamily:"inherit",cursor:"pointer"}}>
                {MONTHS.map(m=><option key={m} value={m} style={{background:"#0a1a0a"}}>{m}</option>)}
              </select>
            </div>
            {isAdmin && (
              <div style={{marginLeft:"auto"}}>
                {editing
                  ? <div style={{display:"flex",gap:8}}>
                      <button onClick={save} style={{background:"linear-gradient(135deg,#c8a96e,#8b6914)",border:"none",borderRadius:8,padding:"8px 20px",color:"#0f1923",fontSize:12,fontWeight:"bold",cursor:"pointer",fontFamily:"inherit",letterSpacing:1}}>✓ SAVE</button>
                      <button onClick={cancel} style={{background:"none",border:"1px solid rgba(200,169,110,0.2)",borderRadius:8,padding:"8px 20px",color:"#6b7f8e",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>CANCEL</button>
                    </div>
                  : <button onClick={()=>setEditing(true)} style={{background:"none",border:"1px solid rgba(200,169,110,0.3)",borderRadius:8,padding:"8px 20px",color:"#c8a96e",fontSize:12,cursor:"pointer",fontFamily:"inherit",letterSpacing:1}}>✎ EDIT</button>
                }
              </div>
            )}
          </div>

          {/* Month label */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{height:1,flex:1,background:"rgba(200,169,110,0.12)"}}/>
            <p style={{color:"#c8a96e",fontSize:12,letterSpacing:2,margin:0}}>{selMonth.toUpperCase()} {selYear}</p>
            <div style={{height:1,flex:1,background:"rgba(200,169,110,0.12)"}}/>
          </div>

          {/* Week tabs */}
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            {getWeeks().map((w,i)=>(
              <button key={i} onClick={()=>setActiveWeek(i)} style={{padding:"8px 22px",borderRadius:20,border:"1px solid",borderColor:activeWeek===i?"#c8a96e":"rgba(200,169,110,0.2)",background:activeWeek===i?"rgba(200,169,110,0.15)":"transparent",color:activeWeek===i?"#c8a96e":"#6b7f8e",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                Week {w.week}
              </button>
            ))}
          </div>

          {/* Week table + teacher feedback */}
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(200,169,110,0.15)",borderRadius:12,overflow:"hidden",marginBottom:20}}>
            <WeekTable
              weekData={getWeeks()[activeWeek]}
              editing={isAdmin&&editing}
              onChange={cellChange}
              onFeedbackChange={feedbackChange}
            />
          </div>

          {/* Monthly summary */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{background:"rgba(100,200,100,0.05)",border:"1px solid rgba(100,200,100,0.2)",borderRadius:12,padding:20}}>
              <p style={{color:"#7dcf9e",fontSize:11,letterSpacing:1,margin:"0 0 10px"}}>✦ STRENGTHS</p>
              {isAdmin&&editing
                ? <textarea value={s.summary.strengths} onChange={e=>summaryChange("strengths",e.target.value)} placeholder="Enter strengths..." style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(100,200,100,0.2)",borderRadius:6,padding:8,color:"#c8dcc0",fontSize:13,outline:"none",fontFamily:"inherit",resize:"vertical",minHeight:70,boxSizing:"border-box"}}/>
                : <p style={{color:s.summary.strengths?"#c8dcc0":"#2d3f4f",fontSize:13,margin:0,lineHeight:1.6}}>{s.summary.strengths||"Not filled yet"}</p>
              }
            </div>
            <div style={{background:"rgba(200,150,100,0.05)",border:"1px solid rgba(200,150,100,0.2)",borderRadius:12,padding:20}}>
              <p style={{color:"#e0a87c",fontSize:11,letterSpacing:1,margin:"0 0 10px"}}>✦ AREAS TO IMPROVE</p>
              {isAdmin&&editing
                ? <textarea value={s.summary.improve} onChange={e=>summaryChange("improve",e.target.value)} placeholder="Enter areas to improve..." style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(200,150,100,0.2)",borderRadius:6,padding:8,color:"#dcc8b0",fontSize:13,outline:"none",fontFamily:"inherit",resize:"vertical",minHeight:70,boxSizing:"border-box"}}/>
                : <p style={{color:s.summary.improve?"#dcc8b0":"#2d3f4f",fontSize:13,margin:0,lineHeight:1.6}}>{s.summary.improve||"Not filled yet"}</p>
              }
            </div>
          </div>
        </>
      )}

      {activeTab === "feedback" && (
        <FeedbackSection payments={s.payments} onUpdate={paymentUpdate} isParent={isParent||isAdmin}/>
      )}

      {activeTab === "payment" && (
        <PaymentSection payments={s.payments} onUpdate={paymentUpdate} isParent={isParent||isAdmin}/>
      )}
    </div>
  );
}


// Family groupings for admin view
const FAMILY_GROUPS = [
  { label: "Nawed Family", ids: [3,4] },
  { label: "Munsi Family", ids: [12,13] },
  { label: "Yusuf & Aisha Family", ids: [14,15] },
  { label: "Muhammad & Fatima Family", ids: [16,17,18,19] },
  { label: "Abdul Aziz Family", ids: [21,22] },
  { label: "Siddik Family", ids: [24,25,26] },
];

function AdminStudentList({ students, onSelect, accounts, showAddLogin, setShowAddLogin, newLogin, setNewLogin, newPassword, setNewPassword, loginError, setLoginError, onAssignLogin }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const familyIds = FAMILY_GROUPS.flatMap(g => g.ids);
  const hasLogin = (id) => accounts && accounts.find(a => a.role === "parent" && a.studentIds.includes(id));
  const matchesSearch = (s) => s.name.toLowerCase().includes(search.toLowerCase());

  // Search mode — show flat filtered list
  if (search.trim()) {
    const results = students.filter(matchesSearch).sort((a,b)=>a.name.localeCompare(b.name));
    return (
      <div>
        <SearchBar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter}/>
        {results.length === 0
          ? <p style={{color:"#3d5166",fontSize:13,marginTop:20,fontStyle:"italic"}}>No students found matching "{search}"</p>
          : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:12,marginTop:16}}>
              {results.map(s=><StudentCard key={s.id} student={s} onClick={()=>onSelect(s)}/>)}
            </div>
        }
      </div>
    );
  }

  const individualStudents = students.filter(s=>!familyIds.includes(s.id)).sort((a,b)=>a.name.localeCompare(b.name));

  const showIndividual = filter === "all" || filter === "individual";
  const showFamilies = filter === "all" || filter === "families";

  return (
    <div>
      <SearchBar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter}/>

      {showIndividual && (
        <div style={{marginBottom:28,marginTop:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{height:1,flex:1,background:"rgba(200,169,110,0.15)"}}/>
            <p style={{color:"#c8a96e",fontSize:11,letterSpacing:2,margin:0}}>INDIVIDUAL STUDENTS ({individualStudents.length})</p>
            <div style={{height:1,flex:1,background:"rgba(200,169,110,0.15)"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:12}}>
            {individualStudents.map(s=><StudentCard key={s.id} student={s} onClick={()=>onSelect(s)}/>)}
          </div>
        </div>
      )}

      {showFamilies && (
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{height:1,flex:1,background:"rgba(200,169,110,0.15)"}}/>
            <p style={{color:"#c8a96e",fontSize:11,letterSpacing:2,margin:0}}>FAMILY GROUPS ({FAMILY_GROUPS.length})</p>
            <div style={{height:1,flex:1,background:"rgba(200,169,110,0.15)"}}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {FAMILY_GROUPS.map(group=>{
              const groupStudents = group.ids.map(id=>students.find(s=>s.id===id)).filter(Boolean).sort((a,b)=>a.name.localeCompare(b.name));
              if (!groupStudents.length) return null;
              return (
                <div key={group.label} style={{background:"rgba(200,169,110,0.04)",border:"1px solid rgba(200,169,110,0.12)",borderRadius:14,padding:"16px 16px 12px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                    <span style={{fontSize:14}}>👨‍👩‍👧‍👦</span>
                    <p style={{color:"#c8a96e",fontSize:12,letterSpacing:1,margin:0,fontWeight:"bold"}}>{group.label.toUpperCase()}</p>
                    <span style={{color:"#3d5a3d",fontSize:11,marginLeft:4}}>{groupStudents.length} students</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
                    {groupStudents.map(s=><StudentCard key={s.id} student={s} onClick={()=>onSelect(s)}/>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Unassigned / future student slots */}
      {(filter === "all" || filter === "individual") && !search.trim() && (() => {
        const unassigned = students.filter(s => !s.name && !familyIds.includes(s.id));
        if (!unassigned.length) return null;
        return (
          <div style={{marginTop:28}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{height:1,flex:1,background:"rgba(200,169,110,0.08)"}}/>
              <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(200,169,110,0.06)",border:"1px dashed rgba(200,169,110,0.2)",borderRadius:20,padding:"5px 14px"}}>
                <span style={{fontSize:12}}>🕐</span>
                <p style={{color:"#4a6a4a",fontSize:11,letterSpacing:2,margin:0}}>FUTURE STUDENTS — {unassigned.length} SLOTS AVAILABLE</p>
              </div>
              <div style={{height:1,flex:1,background:"rgba(200,169,110,0.08)"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:12}}>
              {unassigned.map(s => (
                <div key={s.id} style={{background:"rgba(255,255,255,0.02)",border:"1px dashed rgba(200,169,110,0.15)",borderRadius:14,padding:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
                    <div style={{width:44,height:44,borderRadius:"50%",background:"rgba(200,169,110,0.07)",border:"1px dashed rgba(200,169,110,0.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"#3d5a3d",fontSize:18,flexShrink:0}}>+</div>
                    <div>
                      <p style={{color:"#3d5a3d",fontSize:13,margin:0}}>Empty Slot #{s.id}</p>
                      <p style={{color:"#2a3f2a",fontSize:11,margin:"2px 0 0"}}>No student assigned</p>
                    </div>
                  </div>
                  <button onClick={()=>onSelect(s)} style={{width:"100%",background:"none",border:"1px solid rgba(200,169,110,0.2)",borderRadius:8,padding:"7px",color:"#c8a96e",fontSize:11,cursor:"pointer",fontFamily:"inherit",letterSpacing:1,marginBottom:6}}>
                    ✎ ASSIGN STUDENT
                  </button>
                  {!hasLogin(s.id) && (
                    showAddLogin === s.id ? (
                      <div style={{marginTop:8}}>
                        <input value={newLogin} onChange={e=>setNewLogin(e.target.value)} placeholder="Login (e.g. name@darulnoor)"
                          style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(200,169,110,0.2)",borderRadius:6,padding:"7px 10px",color:"#e8dcc8",fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:"inherit",marginBottom:6}}/>
                        <input value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="Password"
                          style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(200,169,110,0.2)",borderRadius:6,padding:"7px 10px",color:"#e8dcc8",fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:"inherit",marginBottom:6}}/>
                        {loginError && <p style={{color:"#e07c7c",fontSize:11,margin:"0 0 6px"}}>{loginError}</p>}
                        <div style={{display:"flex",gap:6}}>
                          <button onClick={()=>onAssignLogin(s.id)} style={{flex:1,background:"linear-gradient(135deg,#2d6a2d,#1a4a1a)",border:"1px solid rgba(200,169,110,0.3)",borderRadius:6,padding:"7px",color:"#c8a96e",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✓ CREATE</button>
                          <button onClick={()=>{setShowAddLogin(null);setNewLogin("");setNewPassword("");setLoginError("");}} style={{background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"7px 10px",color:"#6b7f8e",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={()=>{setShowAddLogin(s.id);setLoginError("");}} style={{width:"100%",background:"none",border:"1px solid rgba(100,200,100,0.2)",borderRadius:8,padding:"7px",color:"#7dcf9e",fontSize:11,cursor:"pointer",fontFamily:"inherit",letterSpacing:1}}>
                        + CREATE LOGIN
                      </button>
                    )
                  )}
                  {hasLogin(s.id) && <p style={{color:"#7dcf9e",fontSize:11,margin:"4px 0 0",textAlign:"center"}}>✅ Login assigned</p>}
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function SearchBar({ search, setSearch, filter, setFilter }) {
  const filterOptions = [
    { value: "all", label: "👥 All Students" },
    { value: "individual", label: "🧑 Individual Only" },
    { value: "families", label: "👨‍👩‍👧‍👦 Families Only" },
  ];
  return (
    <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
      {/* Search box */}
      <div style={{position:"relative",flex:1,minWidth:200}}>
        <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#6b7f8e",fontSize:14}}>🔍</span>
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search student name..."
          style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(200,169,110,0.2)",borderRadius:10,padding:"10px 14px 10px 36px",color:"#e8dcc8",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}
          onFocus={e=>e.target.style.borderColor="rgba(200,169,110,0.6)"} onBlur={e=>e.target.style.borderColor="rgba(200,169,110,0.2)"}
        />
        {search && <button onClick={()=>setSearch("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#6b7f8e",cursor:"pointer",fontSize:16,padding:2}}>✕</button>}
      </div>
      {/* Filter dropdown */}
      <select value={filter} onChange={e=>setFilter(e.target.value)}
        style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(200,169,110,0.2)",borderRadius:10,padding:"10px 14px",color:"#c8a96e",fontSize:13,outline:"none",fontFamily:"inherit",cursor:"pointer",minWidth:180}}>
        {filterOptions.map(o=><option key={o.value} value={o.value} style={{background:"#0a1a0a"}}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Dashboard({ account, onLogout }) {
  const [students, setStudents] = useState(STUDENTS);
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const [selected, setSelected] = useState(null);
  const [showAddLogin, setShowAddLogin] = useState(null); // studentId being assigned login
  const [newLogin, setNewLogin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const isAdmin = account.role === "admin";
  const isParent = account.role === "parent";
  const visibleStudents = students.filter(s => isAdmin ? true : account.studentIds.includes(s.id));

  const handleSave = (updated) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    setSelected(updated);
  };

  const handleAssignLogin = (studentId) => {
    const loginTrimmed = newLogin.trim().toLowerCase();
    const passTrimmed = newPassword.trim();
    if (!loginTrimmed || !passTrimmed) { setLoginError("Both login and password are required."); return; }
    if (accounts.find(a => a.login === loginTrimmed)) { setLoginError("This login already exists. Choose another."); return; }
    const newAcc = { login: loginTrimmed, password: passTrimmed, role: "parent", studentIds: [studentId] };
    setAccounts(prev => [...prev, newAcc]);
    setShowAddLogin(null);
    setNewLogin(""); setNewPassword(""); setLoginError("");
    alert(`Login created!
Login: ${loginTrimmed}
Password: ${passTrimmed}`);
  };

  return (
    <div style={{minHeight:"100vh",background:"#0a1a0a",fontFamily:"'Georgia',serif",position:"relative"}}>
      <IslamicPattern/>
      <div style={{position:"relative",zIndex:1,maxWidth:920,margin:"0 auto",padding:"28px 24px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32,flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:44,height:44,borderRadius:"50%",overflow:"hidden",border:"2px solid rgba(200,169,110,0.4)"}}>
              <img src={LOGO} alt="DN" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            </div>
            <div>
              <h1 style={{color:"#c8a96e",fontSize:20,margin:0,fontWeight:"bold",letterSpacing:1}}>Darul Noor Education Hub</h1>
              <p style={{color:"#3d5a3d",fontSize:11,margin:"3px 0 0",letterSpacing:1}}>
                {isAdmin?"ADMIN DASHBOARD":"PARENT PORTAL"} · QUR'AN TRACKER
                {syncing && <span style={{color:"#c8a96e",marginLeft:8}}>⟳ Saving...</span>}
                {!syncing && <span style={{color:"#3d7a3d",marginLeft:8}}>● Live</span>}
              </p>
            </div>
          </div>
          <button onClick={onLogout} style={{background:"none",border:"1px solid rgba(200,169,110,0.2)",borderRadius:8,padding:"8px 16px",color:"#6b7f8e",fontSize:12,cursor:"pointer",fontFamily:"inherit",letterSpacing:1}}>SIGN OUT</button>
        </div>

        {selected ? (
          <StudentDetail student={selected} onBack={()=>setSelected(null)} isAdmin={isAdmin} isParent={isParent} onSave={handleSave}/>
        ) : (
          <>
            <p style={{color:"#6b7f8e",fontSize:13,marginBottom:20}}>
              {isAdmin?`All students (${visibleStudents.length})`:visibleStudents.length>1?`${visibleStudents.length} children linked to your account`:"Your child's progress"}
            </p>
            {isAdmin ? <AdminStudentList students={visibleStudents} onSelect={setSelected} accounts={accounts} showAddLogin={showAddLogin} setShowAddLogin={setShowAddLogin} newLogin={newLogin} setNewLogin={setNewLogin} newPassword={newPassword} setNewPassword={setNewPassword} loginError={loginError} setLoginError={setLoginError} onAssignLogin={handleAssignLogin}/> : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
                {visibleStudents.map(s=><StudentCard key={s.id} student={s} onClick={()=>setSelected(s)}/>)}
              </div>
            )}
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
