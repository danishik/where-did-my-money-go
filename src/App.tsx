import { useState, useRef } from "react";

const SIMPLE_CATEGORIES = [
  "Groceries","Dining Out","Transport","Shopping","Entertainment",
  "Health & Medical","Bills & Utilities","Housing","Subscriptions","Misc"
];
const DETAILED_CATEGORIES = [
  "Amazon","Car Lease","Car Service","Childcare","Clothing & Apparel","Costco",
  "Dental","Dining Out (Family)","Dining Out (Personal)","Dollarama","Education",
  "Entertainment","Fuel","Grocery - Ethnic","Grocery - General","Gym",
  "Haircut & Grooming","Health Insurance","Home Insurance","Home Improvement",
  "Internet","Medical","Mortgage / Rent","Office Supplies","Paramedical Services",
  "Personal Care","Phone Bill","Public Transit","Savings Transfer","Shipping & Delivery",
  "Shopping - Online","Shopping - In Store","Subscriptions - Entertainment",
  "Subscriptions - Software","Uber / Rideshare","Utility Bill","Misc"
];
const DINING_CATS = [
  "Dining Out (Family)","Dining Out (Personal)","Dining Out",
  "Misc Grocery","Grocery - General","Grocery - Ethnic"
];

const toAmt = s => { const n = parseFloat(String(s).replace(/[^0-9.]/g,"")); return isNaN(n) ? 0 : n; };
const toSignedAmt = s => { const neg = String(s).trim().startsWith("-"); return neg ? -toAmt(s) : toAmt(s); };

const BLUE = "#2563eb";
const FONT = "'Inter','Geist',system-ui,sans-serif";

// Spacing scale: 4 8 12 16 24 32 48 64 96 128
const sp = { 1:4, 2:8, 3:12, 4:16, 6:24, 8:32, 12:48, 16:64, 24:96, 32:128 };

// Type scale & weights
const T = { xs:12, sm:14, base:16, lg:18, xl:20, "2xl":24, "3xl":30 };
const W = { normal:400, medium:500, semibold:600, bold:700 };

// Outer card radius and inner element radius
const R = { outer:"12px", inner:"8px", pill:"16px" };

const card = {
  background:"var(--color-background-primary)",
  border:"0.5px solid var(--color-border-tertiary)",
  borderRadius:R.outer,
  overflow:"hidden",
};

const ghostBtn = (small=false) => ({
  fontFamily:FONT, cursor:"pointer",
  padding: small ? `${sp[2]}px ${sp[3]}px` : `${sp[2]}px ${sp[4]}px`,
  height: small ? 32 : 40,
  borderRadius:R.inner,
  border:"1px solid #d1d5db",
  background:"var(--color-background-primary)",
  color:"var(--color-text-primary)",
  fontSize: small ? T.xs : T.sm,
  fontWeight:W.medium,
  display:"inline-flex", alignItems:"center",
});

const primaryBtn = (disabled=false, small=false) => ({
  fontFamily:FONT, cursor:disabled?"default":"pointer",
  padding: small ? `${sp[2]}px ${sp[3]}px` : `${sp[2]}px ${sp[6]}px`,
  height: small ? 32 : 40,
  borderRadius:R.inner,
  border:"none",
  background:disabled?"#93c5fd":BLUE,
  color:"#fff",
  fontSize: small ? T.xs : T.sm,
  fontWeight:W.semibold,
  display:"inline-flex", alignItems:"center",
});

const pill = active => ({
  fontFamily:FONT, cursor:"pointer",
  padding:`${sp[1]}px ${sp[3]}px`,
  height:28,
  borderRadius:R.pill,
  border:`0.5px solid ${active?"#93c5fd":"var(--color-border-secondary)"}`,
  background:active?"#dbeafe":"var(--color-background-secondary)",
  fontWeight:active?W.medium:W.normal,
  color:active?BLUE:"var(--color-text-primary)",
  fontSize:T.xs,
  display:"inline-flex", alignItems:"center",
});

const sectionLabel = {
  fontFamily:FONT, fontSize:T.xs, fontWeight:W.semibold,
  color:"var(--color-text-tertiary)", textTransform:"uppercase",
  letterSpacing:"0.08em", display:"block",
  margin:`0 0 ${sp[2]}px`,
};

const CashIcon = ({ size=16 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect x="3" y="8" width="22" height="14" rx="2" stroke="white" strokeWidth="2"/>
    <circle cx="14" cy="15" r="3" stroke="white" strokeWidth="2"/>
    <path d="M3 12h3M22 12h3M3 18h3M22 18h3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const NavLink = ({ label, onClick, blue }) => (
  <button onClick={onClick} style={{
    fontFamily:FONT, background:"none", border:"none",
    color:blue?BLUE:"var(--color-text-tertiary)",
    fontSize:T.sm, fontWeight:W.medium, cursor:"pointer",
    padding:`${sp[1]}px ${sp[2]}px`,
  }}>{label}</button>
);

const AppBar = ({ subtitle, left, right }) => (
  <div style={{
    borderBottom:"0.5px solid var(--color-border-tertiary)",
    marginBottom:sp[6], padding:`${sp[4]}px ${sp[6]}px`,
    display:"flex", alignItems:"center", justifyContent:"space-between",
  }}>
    <div style={{ display:"flex", alignItems:"center", gap:sp[3] }}>
      <div style={{
        width:32, height:32, borderRadius:R.inner, background:BLUE,
        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
      }}>
        <CashIcon size={16}/>
      </div>
      <div>
        <p style={{ fontFamily:FONT, margin:0, fontSize:T.base, fontWeight:W.semibold, color:"var(--color-text-primary)" }}>
          Where did my money go?
        </p>
        {subtitle && <p style={{ fontFamily:FONT, margin:`${sp[1]}px 0 0`, fontSize:T.xs, fontWeight:W.normal, color:"var(--color-text-tertiary)" }}>{subtitle}</p>}
      </div>
    </div>
    <div style={{ display:"flex", gap:sp[1] }}>{left}{right}</div>
  </div>
);

const Checkbox = ({ checked, onChange, label, desc }) => (
  <div onClick={onChange} style={{
    display:"flex", alignItems:"flex-start", gap:sp[3],
    padding:`${sp[4]}px`, cursor:"pointer",
    background:checked?"#eff6ff":"var(--color-background-primary)",
  }}>
    <div style={{
      width:18, height:18, borderRadius:4,
      border:`1.5px solid ${checked?BLUE:"#d1d5db"}`,
      background:checked?BLUE:"#fff",
      display:"flex", alignItems:"center", justifyContent:"center",
      flexShrink:0, marginTop:2,
    }}>
      {checked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
    <div>
      <p style={{ fontFamily:FONT, fontSize:T.sm, fontWeight:W.medium, color:"var(--color-text-primary)", margin:`0 0 ${sp[1]}px` }}>{label}</p>
      <p style={{ fontFamily:FONT, fontSize:T.xs, fontWeight:W.normal, color:"var(--color-text-secondary)", margin:0, lineHeight:1.5 }}>{desc}</p>
    </div>
  </div>
);

export default function App() {
  const [page, setPage] = useState("home");
  const [categories, setCategories] = useState([]);
  const [autoMode, setAutoMode] = useState(null);
  const [newCat, setNewCat] = useState("");
  const [inlineNewCat, setInlineNewCat] = useState("");
  const [includePayments, setIncludePayments] = useState(false);
  const [includeRefunds, setIncludeRefunds] = useState(false);
  const [input, setInput] = useState("");
  const [images, setImages] = useState([]);
  const [csvTexts, setCsvTexts] = useState([]);
  const [results, setResults] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [removedDuplicates, setRemovedDuplicates] = useState([]);
  const [duplicatesResolved, setDuplicatesResolved] = useState(false);
  const [reviewing, setReviewing] = useState(null);
  const [pendingCat, setPendingCat] = useState(null);
  const [editingResult, setEditingResult] = useState(null);
  const [learnedMerchants, setLearnedMerchants] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();
  const csvRef = useRef();
  const csvTxnRef = useRef();

  const normalizeMerchant = name => name.toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,20);

  const detectDuplicates = parsed => {
    const dupes = new Set();
    for (let i = 0; i < parsed.length; i++) {
      for (let j = i+1; j < parsed.length; j++) {
        const a=parsed[i], b=parsed[j];
        const sameAmt = toAmt(a.amount)===toAmt(b.amount) && toAmt(a.amount)>0;
        const nA=normalizeMerchant(a.merchant), nB=normalizeMerchant(b.merchant);
        const simMerch = nA.includes(nB.slice(0,6)) || nB.includes(nA.slice(0,6));
        const dA=new Date(a.date), dB=new Date(b.date);
        const close = !isNaN(dA)&&!isNaN(dB)&&Math.abs(dA-dB)<=86400000*2;
        if (sameAmt&&simMerch&&close){dupes.add(i);dupes.add(j);}
      }
    }
    return [...dupes];
  };

  const getSystem = () => `You are a financial transaction categorizer. Categorize each transaction into exactly one of: ${categories.join(", ")}.
Rules:
- Dining out = restaurants, cafes, fast food, food delivery.
- If no category fits, use NEEDS_REVIEW.
- ${includePayments?'Credit card payments (e.g. "Payment - Thank You") should be included, categorized as "Payments", and represented as a negative amount.':'Exclude credit card payments — do not include them.'}
- ${includeRefunds?'Include refunds and credits as negative amounts.':'Exclude refunds and credits — do not include them.'}
Return ONLY a JSON array, no markdown, no code fences. Each item: {"date":"...","merchant":"...","amount":"...","category":"...","confidence":"high or low","note":"..."}
For negative amounts include the minus sign (e.g. "-$150.00").`;

  const applyAutoMode = m => { setAutoMode(m); setCategories(m==="simple"?[...SIMPLE_CATEGORIES]:[...DETAILED_CATEGORIES]); };
  const resetToCustom = () => { setAutoMode(null); setCategories([]); };
  const addCategory = () => {
    const parts=newCat.split(",").map(t=>t.trim()).filter(Boolean);
    const unique=parts.filter(t=>!categories.includes(t));
    if(unique.length>0) setCategories(p=>[...p,...unique].sort());
    setNewCat("");
  };
  const removeCategory = cat => setCategories(p=>p.filter(c=>c!==cat));

  const addInlineCat = (idx, forChange=false) => {
    const t=inlineNewCat.trim(); if(!t) return;
    if(!categories.includes(t)) setCategories(p=>[...p,t].sort());
    setInlineNewCat("");
    if(forChange) setResults(p=>p.map((r,i)=>i===idx?{...r,_pending:t}:r));
    else setPendingCat(t);
  };

  const handleCSV = e => {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{const cats=ev.target.result.split("\n").flatMap(l=>l.split(",")).map(c=>c.replace(/"/g,"").trim()).filter(Boolean); if(cats.length){setCategories([...new Set(cats)].sort());setAutoMode(null);}};
    r.readAsText(f);
  };
  const handleFiles = e => {
    Array.from(e.target.files).forEach(f=>{
      const r=new FileReader();
      r.onload=ev=>{const b64=ev.target.result.split(",")[1]; setImages(prev=>[...prev,{base64:b64,mediaType:f.type,name:f.name,preview:ev.target.result}]);};
      r.readAsDataURL(f);
    });
  };
  const handleTxnCSV = e => {
    Array.from(e.target.files).forEach(f=>{
      const r=new FileReader();
      r.onload=ev=>setCsvTexts(prev=>[...prev,{name:f.name,text:ev.target.result}]);
      r.readAsText(f);
    });
    e.target.value="";
  };

  const removeImage = idx => setImages(p=>p.filter((_,i)=>i!==idx));
  const removeCsv = idx => setCsvTexts(p=>p.filter((_,i)=>i!==idx));
  const removeResult = idx => setResults(p=>p.filter((_,i)=>i!==idx));

  const removeDuplicate = idx => {
    const removed=results[idx];
    setRemovedDuplicates(p=>[...p,{transaction:removed,originalIdx:idx}]);
    setResults(p=>p.filter((_,i)=>i!==idx));
    setDuplicates(p=>p.filter(d=>d!==idx).map(d=>d>idx?d-1:d));
  };
  const undoRemove = entry => {
    setRemovedDuplicates(p=>p.filter(r=>r!==entry));
    setResults(p=>{const n=[...p];n.splice(entry.originalIdx,0,entry.transaction);return n;});
    setDuplicates(p=>[...p,entry.originalIdx].sort((a,b)=>a-b));
    setDuplicatesResolved(false);
  };

  const getMessages = () => {
    const content=[];
    images.forEach((img,i)=>{content.push({type:"text",text:`Image ${i+1}:`});content.push({type:"image",source:{type:"base64",media_type:img.mediaType,data:img.base64}});});
    if(csvTexts.length>0) content.push({type:"text",text:"CSV contents:\n"+csvTexts.map(f=>f.name+":\n"+f.text).join("\n\n")});
    if(input.trim()) content.push({type:"text",text:"Pasted text:\n"+input.trim()});
    content.push({type:"text",text:"Extract all transactions from all sources and categorize per the rules. Return only a JSON array, no markdown."});
    return [{role:"user",content}];
  };

  const run = async () => {
    if(images.length===0&&csvTexts.length===0&&!input.trim()) return setError("Add at least one image, CSV file, or paste some text.");
    setError("");setResults([]);setDuplicates([]);setRemovedDuplicates([]);setDuplicatesResolved(false);setLoading(true);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:8000,system:getSystem(),messages:getMessages()})});
      const data=await res.json();
      if(data.error) throw new Error(data.error.message);
      const raw=data.content.filter(b=>b.type==="text").map(b=>b.text).join("");
      const clean=raw.replace(/```json/gi,"").replace(/```/g,"").trim();
      const parsed=JSON.parse(clean);
      const flagged=parsed.map(t=>{
        const key=normalizeMerchant(t.merchant);
        if(learnedMerchants[key]) return {...t,category:learnedMerchants[key],confidence:"high",note:""};
        if(DINING_CATS.some(d=>t.category.toLowerCase().includes(d.toLowerCase())||d.toLowerCase().includes(t.category.toLowerCase()))) return {...t,confidence:"low",note:t.note||"Please confirm: dining or grocery related"};
        return t;
      });
      setDuplicates(detectDuplicates(flagged));
      setResults(flagged);
    } catch(e){setError("Error: "+e.message);}
    setLoading(false);
  };

  const assign = (idx,cat) => {
    const key=normalizeMerchant(results[idx]?.merchant||"");
    if(key) setLearnedMerchants(prev=>({...prev,[key]:cat}));
    setResults(p=>p.map((r,i)=>i===idx?{...r,category:cat,confidence:"high",note:""}:r));
    setReviewing(null);setPendingCat(null);
  };
  const reassign = (idx,cat) => {
    const key=normalizeMerchant(results[idx]?.merchant||"");
    if(key) setLearnedMerchants(prev=>({...prev,[key]:cat}));
    setResults(p=>p.map((r,i)=>i===idx?{...r,category:cat,confidence:"high",note:"",_pending:undefined}:r));
    setEditingResult(null);
  };
  const confirmAllSuggested = () => {
    setResults(p=>p.map(r=>{
      if((r.confidence==="low"||r.category==="NEEDS_REVIEW")&&r.category!=="NEEDS_REVIEW"){
        const key=normalizeMerchant(r.merchant);
        if(key) setLearnedMerchants(prev=>({...prev,[key]:r.category}));
        return {...r,confidence:"high",note:""};
      }
      return r;
    }));
  };

  const exportCSVData = (rows,filename) => {
    const csv=rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(",")).join("\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=filename;
    document.body.appendChild(a);a.click();document.body.removeChild(a);
  };
  const exportTransactionsCSV = () => exportCSVData([["Date","Merchant","Amount","Category"],...done.map(r=>[r.date,r.merchant,r.amount,r.category])],"transactions.csv");
  const exportXLSX = () => {
    const txn=[["Date","Merchant","Amount","Category"],...done.map(r=>[r.date,r.merchant,r.amount,r.category])];
    const sum=[["Category","Total"],...Object.entries(grouped).sort((a,b)=>a[0].localeCompare(b[0])).map(([cat,txns])=>[cat,"$"+txns.reduce((s,t)=>s+toSignedAmt(t.amount),0).toFixed(2)]),["Grand Total","$"+grandTotal]];
    exportCSVData([...txn,[],["--- Summary ---",""],...sum],"transactions.csv");
  };

  const needsReview=results.filter(r=>r.confidence==="low"||r.category==="NEEDS_REVIEW");
  const done=results.filter(r=>r.confidence==="high"&&r.category!=="NEEDS_REVIEW");
  const grouped=done.reduce((a,r)=>{a[r.category]=a[r.category]||[];a[r.category].push(r);return a;},{});
  const grandTotal=done.reduce((s,t)=>s+toSignedAmt(t.amount),0).toFixed(2);

  const InlineAddCatJSX = (idx,forChange=false) => (
    <div style={{display:"flex",gap:sp[2],alignItems:"center"}}>
      <input value={inlineNewCat} onChange={e=>setInlineNewCat(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&addInlineCat(idx,forChange)}
        placeholder="New category..."
        style={{fontFamily:FONT,flex:1,padding:`${sp[2]}px ${sp[3]}px`,borderRadius:R.inner,border:"0.5px solid var(--color-border-secondary)",fontSize:T.xs,background:"var(--color-background-primary)",color:"var(--color-text-primary)"}}/>
      <button onClick={()=>addInlineCat(idx,forChange)} style={{...ghostBtn(true),whiteSpace:"nowrap"}}>Add & select</button>
    </div>
  );

  // ══════════════════════════════════════════
  // HOME
  // ══════════════════════════════════════════
  if(page==="home") return (
    <div style={{fontFamily:FONT,maxWidth:560,margin:"0 auto",padding:`${sp[12]}px ${sp[6]}px ${sp[8]}px`}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>

      {/* Hero */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",marginBottom:sp[12]}}>
        <div style={{width:64,height:64,borderRadius:16,background:BLUE,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:sp[6]}}>
          <CashIcon size={32}/>
        </div>
        <span style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.semibold,color:"var(--color-text-tertiary)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:sp[2],display:"block"}}>Personal finance</span>
        <h1 style={{fontFamily:FONT,fontSize:T["3xl"],fontWeight:W.bold,margin:`0 0 ${sp[4]}px`,color:"var(--color-text-primary)",lineHeight:1.2}}>Where did my money go?</h1>
        <p style={{fontFamily:FONT,fontSize:T.base,fontWeight:W.normal,color:"var(--color-text-secondary)",lineHeight:1.7,margin:0,maxWidth:420}}>Upload bank statement screenshots, CSV files, or paste transactions. The AI matches each one to your spending categories and flags anything uncertain for your review.</p>
      </div>

      {/* Steps */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:sp[3],marginBottom:sp[12]}}>
        {[
          {num:"01",label:"Upload or paste",desc:"Screenshots, CSV files, or raw text from your bank"},
                      {num:"02",label:"Auto-categorize",desc:"AI matches each transaction to your categories."},
          {num:"03",label:"Review & export",desc:"Confirm flagged items then download your results"},
        ].map((item,i)=>(
          <div key={i} style={{...card,padding:sp[4]}}>
            <p style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.bold,color:BLUE,margin:`0 0 ${sp[2]}px`,letterSpacing:"0.06em"}}>{item.num}</p>
            <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.semibold,color:"var(--color-text-primary)",margin:`0 0 ${sp[1]}px`}}>{item.label}</p>
            <p style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.normal,color:"var(--color-text-secondary)",margin:0,lineHeight:1.55}}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Privacy card */}
      <div style={{...card,marginBottom:sp[8]}}>
        <div style={{background:"var(--color-background-warning)",borderBottom:"0.5px solid var(--color-border-tertiary)",padding:`${sp[3]}px ${sp[4]}px`,display:"flex",alignItems:"center",gap:sp[2]}}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L1 14h14L8 1z" stroke="#b45309" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 6v4M8 11v1" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.semibold,color:"var(--color-text-warning)",margin:0}}>Privacy & data handling</p>
        </div>
        <div style={{padding:sp[4]}}>
          <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.normal,color:"var(--color-text-primary)",lineHeight:1.7,margin:`0 0 ${sp[3]}px`}}>Your transaction data is sent to Anthropic's servers to perform categorization. Merchant names, amounts, and dates leave your device with each request.</p>
          <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.normal,color:"var(--color-text-primary)",lineHeight:1.7,margin:`0 0 ${sp[4]}px`}}>Do not include your name, card number, or account number. Black out sensitive fields before uploading screenshots.</p>
          <div style={{borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:sp[3],display:"flex",flexDirection:"column",gap:sp[2]}}>
            {[
              "On a free Anthropic plan, conversations may be used for model training by default. On Claude.ai Pro/Max, this is off by default.",
              'Transaction descriptions like "SHELL OIL" or "SUPERSTORE #123" are relatively low-sensitivity, but be comfortable with this before proceeding.',
              "If you want zero data leaving your machine, consider running this tool locally with Ollama instead.",
              "By using this app, you assume full responsibility for how your data is used and any decisions made based on its output. The creator accepts no liability and cannot be held responsible or subject to legal action for any outcomes."
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",gap:sp[2]}}>
                <span style={{fontFamily:FONT,fontSize:T.xs,color:"var(--color-text-tertiary)",marginTop:3,flexShrink:0}}>–</span>
                <p style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.normal,color:"var(--color-text-secondary)",lineHeight:1.6,margin:0}}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={()=>setPage("categories")} style={{display:"block",width:"100%",padding:`${sp[4]}px`,borderRadius:R.inner,border:"none",background:BLUE,color:"#fff",fontSize:T.base,fontWeight:W.semibold,cursor:"pointer",marginBottom:sp[2]}}>
        Get started →
      </button>
      <p style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.normal,color:"var(--color-text-tertiary)",margin:0,textAlign:"center"}}>By continuing you acknowledge the privacy information above.</p>
    </div>
  );

  // ══════════════════════════════════════════
  // CATEGORIES
  // ══════════════════════════════════════════
  if(page==="categories") return (
    <div style={{fontFamily:FONT,maxWidth:640,margin:"0 auto",padding:`${sp[8]}px ${sp[6]}px ${sp[12]}px`}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
      <AppBar subtitle="Category setup" right={<NavLink label="← Home" onClick={()=>setPage("home")}/>}/>

      <h2 style={{fontFamily:FONT,fontSize:T.xl,fontWeight:W.bold,margin:`0 0 ${sp[1]}px`,color:"var(--color-text-primary)"}}>Set up your categories</h2>
      <p style={{fontFamily:FONT,fontSize:T.base,fontWeight:W.normal,color:"var(--color-text-secondary)",margin:`0 0 ${sp[8]}px`,lineHeight:1.6}}>Choose a preset, import from a CSV, or build your own list from scratch.</p>


      {/* Presets */}
      <div style={{marginBottom:sp[8]}}>
        <span style={sectionLabel}>Presets</span>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:sp[3],marginBottom:sp[2]}}>
          {[
            {key:"simple",label:"Simple",desc:"Broad buckets, ideal for a high-level overview.",example:"Groceries, Dining Out, Transport, Bills, Shopping, Health, Misc"},
            {key:"detailed",label:"Detailed",desc:"Granular, ideal for tracking specific spending habits.",example:"Dining Out (Family), Fuel, Dental, Shopping - Online, and more"}
          ].map(opt=>(
            <div key={opt.key} onClick={()=>applyAutoMode(opt.key)} style={{...card,padding:sp[4],cursor:"pointer",border:autoMode===opt.key?`2px solid ${BLUE}`:"0.5px solid var(--color-border-tertiary)",background:autoMode===opt.key?"#eff6ff":"var(--color-background-primary)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:sp[1]}}>
                <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.semibold,color:"var(--color-text-primary)",margin:0}}>{opt.label}</p>
                {autoMode===opt.key&&<span style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.semibold,background:BLUE,color:"#fff",borderRadius:R.pill,padding:`${sp[1]}px ${sp[2]}px`}}>Active</span>}
              </div>
              <p style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.normal,color:"var(--color-text-secondary)",margin:`0 0 ${sp[1]}px`,lineHeight:1.5}}>{opt.desc}</p>
              <p style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.normal,color:"var(--color-text-tertiary)",margin:0,lineHeight:1.5}}>{opt.example}</p>
            </div>
          ))}
        </div>
        {autoMode&&<button onClick={resetToCustom} style={{fontFamily:FONT,background:"none",border:"none",color:"var(--color-text-secondary)",fontSize:T.xs,cursor:"pointer",padding:0,textDecoration:"underline"}}>Reset to custom</button>}
      </div>

      {autoMode&&(
        <div style={{marginBottom:sp[8]}}>
          <span style={sectionLabel}>Categories in this preset ({categories.length})</span>
          <div style={{display:"flex",flexWrap:"wrap",gap:sp[2]}}>
            {categories.map(cat=>(
              <span key={cat} style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.normal,padding:`${sp[1]}px ${sp[3]}px`,borderRadius:R.pill,border:"0.5px solid var(--color-border-secondary)",color:"var(--color-text-secondary)",background:"var(--color-background-secondary)"}}>{cat}</span>
            ))}
          </div>
        </div>
      )}

      {!autoMode&&(
        <>
          <div style={{marginBottom:sp[8]}}>
            <span style={sectionLabel}>Import from CSV</span>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:sp[4]}}>
              <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.normal,color:"var(--color-text-secondary)",margin:0,lineHeight:1.5}}>Upload a CSV with one category per row or comma-separated.</p>
              <button onClick={()=>csvRef.current.click()} style={{...ghostBtn(),whiteSpace:"nowrap"}}>Choose file</button>
              <input ref={csvRef} type="file" accept=".csv,text/csv" style={{display:"none"}} onChange={handleCSV}/>
            </div>
          </div>

          <div style={{marginBottom:sp[8]}}>
            <span style={sectionLabel}>Your categories ({categories.length})</span>
            <div style={{display:"flex",gap:sp[2],marginBottom:sp[3]}}>
              <input value={newCat} onChange={e=>setNewCat(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCategory()} placeholder="e.g. Groceries, Fuel, Dining Out..."
                style={{fontFamily:FONT,flex:1,padding:`${sp[2]}px ${sp[4]}px`,borderRadius:R.inner,border:"0.5px solid var(--color-border-secondary)",fontSize:T.sm,background:"var(--color-background-primary)",color:"var(--color-text-primary)"}}/>
              <button onClick={addCategory} style={{...primaryBtn(),whiteSpace:"nowrap"}}>Add</button>
            </div>
            {categories.length===0?(
              <div style={{textAlign:"center",padding:`${sp[8]}px ${sp[6]}px`,borderRadius:R.outer,border:"0.5px dashed var(--color-border-secondary)"}}>
                <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.semibold,color:"var(--color-text-primary)",margin:`0 0 ${sp[1]}px`}}>No categories yet</p>
                <p style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.normal,color:"var(--color-text-tertiary)",margin:0,lineHeight:1.6}}>Add categories manually above, upload a CSV, or choose a preset.</p>
              </div>
            ):(
              <div style={card}>
                {categories.map((cat,i)=>(
                  <div key={cat} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:`${sp[3]}px ${sp[4]}px`,borderBottom:i<categories.length-1?"0.5px solid var(--color-border-tertiary)":"none"}}>
                    <span style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.normal,color:"var(--color-text-primary)"}}>{cat}</span>
                    <button onClick={()=>removeCategory(cat)} style={{background:"none",border:"none",color:"var(--color-text-tertiary)",cursor:"pointer",fontSize:T.lg,lineHeight:1,padding:`0 ${sp[1]}px`}}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Transaction preferences */}
      <div style={{marginBottom:sp[8]}}>
        <span style={sectionLabel}>Transaction preferences</span>
        <div style={card}>
          <div style={{borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
            <Checkbox checked={includePayments} onChange={()=>setIncludePayments(!includePayments)}
              label="Include credit card payments"
              desc='Transactions like "Payment - Thank You" will be included as "Payments" with a negative amount.'/>
          </div>
          <Checkbox checked={includeRefunds} onChange={()=>setIncludeRefunds(!includeRefunds)}
            label="Include refunds & credits"
            desc="Refunds and credits will be included as negative amounts, reducing your total."/>
        </div>
      </div>

      <button onClick={()=>categories.length>0&&setPage("app")} style={{display:"block",width:"100%",padding:`${sp[4]}px`,borderRadius:R.inner,border:"none",background:categories.length>0?BLUE:"#93c5fd",color:"#fff",fontSize:T.base,fontWeight:W.semibold,cursor:categories.length>0?"pointer":"default"}}>
        {categories.length===0?"Add categories to continue":"Continue to categorizer →"}
      </button>
    </div>
  );

  // ══════════════════════════════════════════
  // CATEGORIZER
  // ══════════════════════════════════════════
  return (
    <div style={{fontFamily:FONT,maxWidth:780,margin:"0 auto",padding:`0 0 ${sp[12]}px`}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
      <AppBar subtitle={`${categories.length} categories active`}
        left={<NavLink label="← Categories" onClick={()=>setPage("categories")} blue/>}
        right={<NavLink label="Home" onClick={()=>setPage("home")}/>}
      />

      <div style={{padding:`0 ${sp[6]}px`}}>

        {/* Input sources */}
        <div style={{marginBottom:sp[8]}}>
          <span style={sectionLabel}>Input sources</span>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:sp[3],marginBottom:sp[3]}}>
            <div style={{...card,padding:sp[4]}}>
              <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.semibold,color:"var(--color-text-primary)",margin:`0 0 ${sp[3]}px`}}>Images</p>
              <button onClick={()=>fileRef.current.click()} style={{...ghostBtn(),width:"100%",justifyContent:"center",marginBottom:images.length>0?sp[3]:0}}>+ Add images</button>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handleFiles}/>
              {images.length>0&&(
                <div style={{display:"flex",flexWrap:"wrap",gap:sp[2]}}>
                  {images.map((img,i)=>(
                    <div key={i} style={{position:"relative"}}>
                      <img src={img.preview} alt={img.name} style={{height:64,borderRadius:R.inner,border:"0.5px solid var(--color-border-tertiary)",display:"block"}}/>
                      <button onClick={()=>removeImage(i)} style={{position:"absolute",top:sp[1],right:sp[1],background:"#000000bb",color:"#fff",border:"none",borderRadius:"50%",width:16,height:16,cursor:"pointer",fontSize:10,lineHeight:"16px",textAlign:"center",padding:0}}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{...card,padding:sp[4]}}>
              <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.semibold,color:"var(--color-text-primary)",margin:`0 0 ${sp[3]}px`}}>CSV files</p>
              <button onClick={()=>csvTxnRef.current.click()} style={{...ghostBtn(),width:"100%",justifyContent:"center",marginBottom:csvTexts.length>0?sp[3]:0}}>+ Add CSV files</button>
              <input ref={csvTxnRef} type="file" accept=".csv,text/csv" multiple style={{display:"none"}} onChange={handleTxnCSV}/>
              {csvTexts.length>0&&(
                <div style={{display:"flex",flexDirection:"column",gap:sp[2]}}>
                  {csvTexts.map((f,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:`${sp[1]}px ${sp[3]}px`,borderRadius:R.inner,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)"}}>
                      <span style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.normal,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"var(--color-text-primary)"}}>{f.name}</span>
                      <button onClick={()=>removeCsv(i)} style={{background:"none",border:"none",color:"var(--color-text-tertiary)",cursor:"pointer",fontSize:T.base,padding:0,lineHeight:1,flexShrink:0}}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{...card,padding:sp[4]}}>
            <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.semibold,color:"var(--color-text-primary)",margin:`0 0 ${sp[3]}px`}}>Paste text</p>
            <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={"Apr 01  AMAZON.CA  $34.99\nApr 02  SUPERSTORE #123  $112.40"}
              style={{fontFamily:FONT,width:"100%",height:96,padding:`${sp[3]}px`,fontSize:T.sm,borderRadius:R.inner,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",color:"var(--color-text-primary)",resize:"vertical",boxSizing:"border-box"}}/>
          </div>
        </div>

        {/* Categorize button */}
        <div style={{marginBottom:sp[6]}}>
          <button onClick={run} disabled={loading} style={{...primaryBtn(loading),padding:`${sp[3]}px ${sp[8]}px`,height:48,fontSize:T.base}}>
            {loading?"Categorizing...":"Categorize"}
          </button>
        </div>

        {loading&&(
          <div style={{display:"flex",alignItems:"center",gap:sp[3],marginBottom:sp[6],padding:`${sp[3]}px ${sp[4]}px`,background:"var(--color-background-secondary)",borderRadius:R.inner}}>
            <div style={{width:16,height:16,borderRadius:"50%",border:"2px solid #bfdbfe",borderTopColor:BLUE,animation:"spin 0.8s linear infinite",flexShrink:0}}/>
            <span style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.normal,color:"var(--color-text-secondary)"}}>Analyzing your transactions...</span>
          </div>
        )}

        {error&&(
          <div style={{padding:`${sp[4]}px`,background:"#fef2f2",border:"0.5px solid #fca5a5",borderRadius:R.inner,marginBottom:sp[6]}}>
            <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.semibold,color:"#dc2626",margin:`0 0 ${sp[2]}px`}}>Something went wrong — please try again.</p>
            <p style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.normal,color:"#dc2626",margin:`0 0 ${sp[3]}px`,opacity:0.8}}>{error}</p>
            <button onClick={()=>{setError("");setResults([]);setDuplicates([]);setRemovedDuplicates([]);setDuplicatesResolved(false);}} style={{...ghostBtn(true),color:"#dc2626",borderColor:"#fca5a5"}}>
              Reset & try again
            </button>
          </div>
        )}

        {/* Duplicates */}
        {(duplicates.length>0||removedDuplicates.length>0)&&(
          <div style={{marginBottom:sp[8]}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:sp[2]}}>
              <span style={{...sectionLabel,color:"#dc2626",margin:0}}>Possible duplicates {duplicatesResolved?"(resolved)":"("+duplicates.length+")"}</span>
              {!duplicatesResolved&&duplicates.length>0&&<button onClick={()=>setDuplicatesResolved(true)} style={ghostBtn(true)}>Mark as resolved</button>}
              {duplicatesResolved&&<button onClick={()=>setDuplicatesResolved(false)} style={ghostBtn(true)}>Review again</button>}
            </div>
            {!duplicatesResolved&&(
              <div style={{...card,borderLeft:"3px solid #dc2626"}}>
                <div style={{padding:`${sp[3]}px ${sp[4]}px`,background:"#fef2f2",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                  <p style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.normal,color:"#dc2626",margin:0,lineHeight:1.6}}>Same merchant and amount within 2 days. Remove any counted twice, or mark as resolved if they are genuine separate transactions.</p>
                </div>
                {duplicates.map((idx,i)=>{
                  const t=results[idx]; if(!t) return null;
                  return (
                    <div key={idx} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:`${sp[3]}px ${sp[4]}px`,borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                      <div>
                        <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.medium,color:"var(--color-text-primary)",margin:`0 0 ${sp[1]}px`}}>{t.merchant}</p>
                        <p style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.normal,color:"var(--color-text-tertiary)",margin:0}}>{t.date} · {t.amount} · {t.category}</p>
                      </div>
                      <button onClick={()=>removeDuplicate(idx)} style={{...ghostBtn(true),color:"#dc2626",borderColor:"#fca5a5"}}>Remove</button>
                    </div>
                  );
                })}
                {removedDuplicates.map((entry,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:`${sp[3]}px ${sp[4]}px`,background:"var(--color-background-secondary)",borderTop:"0.5px solid var(--color-border-tertiary)"}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:sp[2],marginBottom:sp[1]}}>
                        <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.medium,color:"var(--color-text-tertiary)",margin:0,textDecoration:"line-through"}}>{entry.transaction.merchant}</p>
                        <span style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.medium,background:"#fee2e2",color:"#dc2626",padding:`0 ${sp[2]}px`,borderRadius:R.pill}}>Removed</span>
                      </div>
                      <p style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.normal,color:"var(--color-text-tertiary)",margin:0}}>{entry.transaction.date} · {entry.transaction.amount}</p>
                    </div>
                    <button onClick={()=>undoRemove(entry)} style={ghostBtn(true)}>Undo</button>
                  </div>
                ))}
              </div>
            )}
            {duplicatesResolved&&(
              <div style={{...card,padding:`${sp[3]}px ${sp[4]}px`}}>
                <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.normal,color:"var(--color-text-secondary)",margin:0}}>
                  {removedDuplicates.length>0?`${removedDuplicates.length} transaction${removedDuplicates.length>1?"s":""} removed. `:"No transactions removed. "}
                  <button onClick={()=>setDuplicatesResolved(false)} style={{fontFamily:FONT,background:"none",border:"none",color:BLUE,fontSize:T.sm,cursor:"pointer",padding:0,textDecoration:"underline"}}>Review</button>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Needs review */}
        {needsReview.length>0&&(
          <div style={{marginBottom:sp[8]}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:sp[1]}}>
              <span style={{...sectionLabel,color:"var(--color-text-warning)",margin:0}}>Needs your review ({needsReview.length})</span>
              <button onClick={confirmAllSuggested} style={ghostBtn(true)}>Confirm all suggested</button>
            </div>
            <p style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.normal,color:"var(--color-text-tertiary)",margin:`0 0 ${sp[3]}px`,lineHeight:1.5}}>These transactions are not included in the totals below until confirmed.</p>
            <div style={{display:"flex",flexDirection:"column",gap:sp[3]}}>
              {needsReview.map((r,i)=>{
                const idx=results.indexOf(r);
                return (
                  <div key={i} style={{...card,borderLeft:"3px solid #f59e0b"}}>
                    <div style={{padding:`${sp[4]}px`,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:sp[3],alignItems:"flex-start"}}>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontFamily:FONT,fontSize:T.base,fontWeight:W.semibold,color:"var(--color-text-primary)",margin:`0 0 ${sp[1]}px`,wordBreak:"break-word"}}>{r.merchant}</p>
                        <p style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.normal,color:"var(--color-text-secondary)",margin:`0 0 ${sp[2]}px`}}>{r.date} · {r.amount}</p>
                        {r.category!=="NEEDS_REVIEW"&&<span style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.medium,background:"#dbeafe",color:"#1d4ed8",padding:`${sp[1]}px ${sp[2]}px`,borderRadius:R.pill,display:"inline-block"}}>Suggested: {r.category}</span>}
                        {r.note&&<p style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.normal,color:"var(--color-text-tertiary)",margin:`${sp[2]}px 0 0`}}>{r.note}</p>}
                      </div>
                      <div style={{display:"flex",gap:sp[2],flexShrink:0}}>
                        <button onClick={()=>{setReviewing(reviewing===idx?null:idx);setPendingCat(r.category);}} style={ghostBtn(true)}>{reviewing===idx?"Close":"Confirm / Change"}</button>
                        <button onClick={()=>removeResult(idx)} style={{...ghostBtn(true),color:"#dc2626",borderColor:"#fca5a5"}}>Remove</button>
                      </div>
                    </div>
                    {reviewing===idx&&(
                      <div style={{borderTop:"0.5px solid var(--color-border-tertiary)",padding:`${sp[4]}px`}}>
                        <div style={{display:"flex",flexWrap:"wrap",gap:sp[2],marginBottom:sp[4]}}>
                          {categories.map(cat=>(
                            <button key={cat} onClick={()=>setPendingCat(cat)} style={pill(cat===(pendingCat||r.category))}>{cat}</button>
                          ))}
                        </div>
                        <div style={{marginBottom:sp[4]}}>{InlineAddCatJSX(idx,false)}</div>
                        <div style={{display:"flex",gap:sp[2]}}>
                          <button onClick={()=>assign(idx,pendingCat||r.category)} style={primaryBtn(false,true)}>Confirm</button>
                          <button onClick={()=>{setReviewing(null);setPendingCat(null);}} style={ghostBtn(true)}>Close</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Categorized - masonry grid of category cards */}
        {Object.keys(grouped).length>0&&(
          <div>
            <span style={sectionLabel}>Categorized ({done.length})</span>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:sp[3],marginBottom:sp[4],alignItems:"start"}}>
              {Object.entries(grouped).sort((a,b)=>a[0].localeCompare(b[0])).map(([cat,txns])=>(
                <div key={cat} style={{...card}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:`${sp[3]}px ${sp[4]}px`,background:"var(--color-background-secondary)"}}>
                    <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.semibold,color:"var(--color-text-primary)",margin:0}}>{cat}</p>
                    <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.semibold,color:"var(--color-text-primary)",margin:0}}>${txns.reduce((s,t)=>s+toSignedAmt(t.amount),0).toFixed(2)}</p>
                  </div>
                  {txns.map(t=>{
                    const idx=results.indexOf(t);
                    return (
                      <div key={idx} style={{borderTop:"0.5px solid var(--color-border-tertiary)"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:`${sp[3]}px ${sp[4]}px`}}>
                          <div style={{flex:1,minWidth:0,marginRight:sp[3]}}>
                            <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.normal,color:"var(--color-text-primary)",margin:`0 0 ${sp[1]}px`,wordBreak:"break-word"}}>{t.merchant}</p>
                            <p style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.normal,color:"var(--color-text-tertiary)",margin:0}}>{t.date}</p>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:sp[3],flexShrink:0}}>
                            <p style={{fontFamily:FONT,fontSize:T.sm,fontWeight:W.normal,color:"var(--color-text-primary)",margin:0}}>{t.amount}</p>
                            <button onClick={()=>setEditingResult(editingResult===idx?null:idx)} style={{fontFamily:FONT,background:"none",border:"none",color:BLUE,fontSize:T.xs,fontWeight:W.medium,cursor:"pointer",padding:0}}>{editingResult===idx?"Close":"Change"}</button>
                            <button onClick={()=>removeResult(idx)} style={{fontFamily:FONT,background:"none",border:"none",color:"#dc2626",fontSize:T.xs,fontWeight:W.medium,cursor:"pointer",padding:0}}>Remove</button>
                          </div>
                        </div>
                        {editingResult===idx&&(
                          <div style={{borderTop:"0.5px solid var(--color-border-tertiary)",padding:`${sp[4]}px`,background:"var(--color-background-secondary)"}}>
                            <div style={{display:"flex",flexWrap:"wrap",gap:sp[2],marginBottom:sp[4]}}>
                              {categories.map(c=>(
                                <button key={c} onClick={()=>setResults(p=>p.map((r2,i2)=>i2===idx?{...r2,_pending:c}:r2))} style={pill(c===(t._pending||t.category))}>{c}</button>
                              ))}
                            </div>
                            <div style={{marginBottom:sp[4]}}>{InlineAddCatJSX(idx,true)}</div>
                            <div style={{display:"flex",gap:sp[2]}}>
                              <button onClick={()=>reassign(idx,t._pending||t.category)} style={primaryBtn(false,true)}>Confirm</button>
                              <button onClick={()=>setEditingResult(null)} style={ghostBtn(true)}>Close</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            {/* Total and export below the masonry grid */}
            <div style={{...card,marginBottom:sp[4]}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:`${sp[4]}px`}}>
                <p style={{fontFamily:FONT,fontSize:T.base,fontWeight:W.bold,color:"var(--color-text-primary)",margin:0}}>Total</p>
                <p style={{fontFamily:FONT,fontSize:T.base,fontWeight:W.bold,color:"var(--color-text-primary)",margin:0}}>${grandTotal}</p>
              </div>
            </div>
            <div style={{display:"flex",gap:sp[3]}}>
              <button onClick={exportXLSX} style={ghostBtn()}>Export Excel</button>
              <button onClick={exportTransactionsCSV} style={ghostBtn()}>Export CSV</button>
            </div>
            {needsReview.length>0&&(
              <p style={{fontFamily:FONT,fontSize:T.xs,fontWeight:W.normal,color:"var(--color-text-tertiary)",marginTop:sp[3]}}>
                {needsReview.length} transaction{needsReview.length>1?"s":""} pending review not included in totals above.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
