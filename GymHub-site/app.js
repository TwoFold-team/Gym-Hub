function imgSrc(p){return (typeof IMGDATA!=="undefined"&&IMGDATA[p])||p;}
const firebaseConfig={apiKey:"AIzaSyAY8K2_LztVoVX1F00zmvU4ehPj4ufGGAM",authDomain:"gymm-c58cb.firebaseapp.com",databaseURL:"https://gymm-c58cb-default-rtdb.europe-west1.firebasedatabase.app",projectId:"gymm-c58cb",storageBucket:"gymm-c58cb.firebasestorage.app",messagingSenderId:"1027476403509",appId:"1:1027476403509:web:a5890bf3608c6c6dc7087c",measurementId:"G-5HE7JZ3W11"};
try{if(!firebase.apps.length) firebase.initializeApp(firebaseConfig);}catch(e){}
const EXIMG={bench:"images/ex/bench.jpg",inc:"images/ex/incline.jpg",pull:"images/ex/pulldown.jpg",row:"images/ex/row.jpg",press:"images/ex/shoulder.jpg",curl:"images/girls-hero.jpg",squat:"images/ex/squat.jpg",rdl:"images/boys-dead.jpg",lunge:"images/ex/lunge.jpg",hip:"images/ex/hip.jpg",kick:"images/ex/kick.jpg",core:"images/ex/plank.jpg",lat:"images/ex/raise.jpg"};
function isGirlView(){return section==="girls" || ((JSON.parse(sessionStorage.getItem("ykSub")||"{}").gender||"").toLowerCase()==="girl" && section!=="boys");}
function moveKey(it){
  const n=((it&&it.name)||"")+" "+((it&&it.muscle)||"")+" "+((it&&it.img)||"");
  const s=n.toLowerCase();
  if(/bench|بنج|صدر/.test(s) && /incline|مائل/.test(s)) return "incline";
  if(/bench|بنج|صدر/.test(s)) return "bench";
  if(/incline/.test(s)) return "incline";
  if(/pulldown|سحب|لات بول/.test(s)) return "pull";
  if(/row|تجديف/.test(s)) return "row";
  if(/deadlift|ديد|rdl|همستر/.test(s)) return "rdl";
  if(/squat|سكوات/.test(s)) return "squat";
  if(/lunge|اندفاع/.test(s)) return "lunge";
  if(/hip thrust|هيپ|جلوتس ثراست/.test(s)) return "hip";
  if(/kickback|كيك/.test(s)) return "kick";
  if(/lateral|رفع جانبي|lat raise/.test(s)) return "lat";
  if(/shoulder press|كتف/.test(s) && !/lat/.test(s)) return "press";
  if(/curl|باي|دراع|ذراع/.test(s)) return "curl";
  if(/plank|كور|بطن/.test(s)) return "core";
  if(/press/.test(s)) return "press";
  const byImg={bench:"bench",inc:"incline",pull:"pull",row:"row",press:"press",curl:"curl",squat:"squat",rdl:"rdl",lunge:"lunge",hip:"hip",kick:"kick",core:"core",lat:"lat"};
  return byImg[(it&&it.img)||"squat"]||"squat";
}
function exPic(it){
  const g=isGirlView()?"girl":"boy";
  let k=moveKey(it);
  if(g==="boy" && (k==="hip"||k==="kick")) k="lunge";
  return imgSrc("images/ex/"+g+"-"+k+".jpg");
}
function heroPic(s){return imgSrc(s==="girls"?"images/girls-hero.jpg":"images/boys-hero.jpg");}
function picsOf(it){
  const m=String((it&&it.muscle)||"");
  if(/[+\/]/.test(m) || (m.includes(" و "))){
    return m.split(/[+\/]| و /).map(x=>x.trim()).filter(Boolean).slice(0,2).map(p=>exPic({name:p,muscle:p,img:it&&it.img}));
  }
  return [exPic(it)];
}

function toggleTheme(){const d=document.documentElement;const next=d.getAttribute("data-theme")==="dark"?"light":"dark";d.setAttribute("data-theme",next);localStorage.setItem("gh_theme",next);syncThemeEmoji();}
function syncThemeEmoji(){const dark=document.documentElement.getAttribute("data-theme")==="dark";document.querySelectorAll(".theme span,#themeEmoji").forEach(el=>{if(el) el.textContent=dark?"☀️":"🌙";});}
if(localStorage.getItem("gh_theme")==="dark") document.documentElement.setAttribute("data-theme","dark");
syncThemeEmoji();
function showPage(id,btn){
  const logged=sessionStorage.getItem("ykAuth")==="1";
  const openPages=["welcome","login","reg"];
  if(!logged && !openPages.includes(id)){id="login";}
  ["welcome","home","sys","diet","work","ach","packs","pay","chat","profile","shop","follow","notif","login","reg"].forEach(p=>{const el=document.getElementById("pg-"+p); if(el) el.classList.add("hidden");});
  const map={welcome:"pg-welcome",home:"pg-home",sys:"pg-sys",diet:"pg-diet",work:"pg-work",ach:"pg-ach",packs:"pg-packs",pay:"pg-pay",chat:"pg-chat",profile:"pg-profile",shop:"pg-shop",follow:"pg-follow",notif:"pg-notif",login:"pg-login",reg:"pg-reg"};
  const target=map[id]||"pg-welcome";
  const dest=document.getElementById(target); dest.classList.remove("hidden"); dest.classList.remove("in"); void dest.offsetWidth; dest.classList.add("in"); document.body.setAttribute("data-page",id);
  document.querySelectorAll(".nav button").forEach(b=>b.classList.remove("on"));
  if(btn) btn.classList.add("on");
  if(id==="ach"){renderPts();drawWeights();showPhotos();} if(id==="home") weekPlan(); if(id==="diet") addProtein();
  if(id==="work") renderDaysTable();
  if(id==="packs"||id==="pay") renderPacks();
  if(id==="sys"){ renderWeekPick();
    const g=(JSON.parse(sessionStorage.getItem("ykSub")||"{}").gender||"boy").toLowerCase();
    const s=(g==="girl")?"girls":"boys";
    if(!section) section=s;
    openSection(section==="girls"&&g!=="girl"?"boys": (section==="boys"&&g!=="boy"?"girls":section));
  }
  if(id==="chat") listenChat(); if(id==="profile") renderProfile(); if(id==="shop") renderShop(); if(id==="follow"){}; if(id==="notif") openNotifs();
}
function goHomeNav(btn){if(sessionStorage.getItem("ykAuth")==="1") showPage("home",btn); else showPage("welcome",btn);}
function matchPack(sub){
  const p=String(sub.package||"");
  if(p.includes("تجربة")||p.includes("أيام")||+sub.days===3) return PACKS[0];
  if(p.includes("سنو")||p.includes("1500")||+sub.months===12) return PACKS[4];
  if(p.includes("6")||p.includes("850")||+sub.months===6) return PACKS[3];
  if(p.includes("3 شهور")||p.includes("500")||+sub.months===3) return PACKS[2];
  return PACKS[1];
}
function packLevel(sub){const pk=matchPack(sub); return pk?pk.months:1;}
function badgeName(days,pts){days=+days||0;pts=+pts||0; if(days>=30||pts>=800) return "أسطوري"; if(days>=20||pts>=500) return "نجم الجيم"; if(days>=12||pts>=250) return "ملتزم"; if(days>=7||pts>=120) return "منتظم"; if(days>=3||pts>=40) return "مجتهد"; return "مبتدئ";}

const DAY_EN=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAY_AR=["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
function todayEn(){return DAY_EN[new Date().getDay()];}
function todayAr(){return DAY_AR[new Date().getDay()];}
function todayKey(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function weekPlanSaved(){
  try{return JSON.parse(localStorage.getItem("gh_week_"+sid())||"null");}catch(e){return null;}
}
function setWeekPlan(obj){
  localStorage.setItem("gh_week_"+sid(), JSON.stringify(obj));
  try{firebase.database().ref("platform/progress/"+sid()+"/weekPlan").set(obj);}catch(e){}
}
function renderWeekPick(){
  const box=document.getElementById("weekPick"); const btns=document.getElementById("weekBtns");
  if(!box) return;
  let wp=weekPlanSaved();
  const locked=wp && wp.locked;
  const days=wp && wp.days ? wp.days : {};
  box.innerHTML="<div class='weekgrid'>"+DAY_EN.map((en,i)=>{
    const on=days[en]==="train";
    return "<button type='button' class='wday "+(on?"on":"")+"' data-d='"+en+"' "+(locked?"disabled":"")+">"+DAY_AR[i]+"<small>"+(on?"تمرين":"راحة")+"</small></button>";
  }).join("")+"</div>";
  if(!locked){
    box.querySelectorAll(".wday").forEach(b=>b.onclick=function(){
      const cur=weekPlanSaved()||{days:{},locked:false};
      cur.days=cur.days||{};
      cur.days[b.getAttribute("data-d")]= cur.days[b.getAttribute("data-d")]==="train"?"rest":"train";
      setWeekPlan(cur); renderWeekPick();
    });
  }
  if(btns){
    btns.innerHTML= locked
      ? "<button class='btn ghost' type='button' onclick='editWeek()'>تعديل الأيام</button><div class='muted'>النهارده "+todayAr()+"</div>"
      : "<button class='btn' type='button' onclick='lockWeek()'>تم</button>";
  }
}
function lockWeek(){
  const cur=weekPlanSaved()||{days:{}};
  const n=Object.values(cur.days||{}).filter(v=>v==="train").length;
  if(!n) return alert("اختار يوم تمرين واحد على الأقل");
  cur.locked=true; setWeekPlan(cur); renderWeekPick();
}
function editWeek(){
  const cur=weekPlanSaved()||{days:{}};
  cur.locked=false; setWeekPlan(cur); renderWeekPick();
}
function trainDaysList(){
  const wp=weekPlanSaved();
  if(!wp||!wp.days) return [];
  return DAY_EN.filter(d=>wp.days[d]==="train");
}
function todayProgramDay(days){
  const td=todayEn();
  const train=trainDaysList();
  if(!train.includes(td)) return null;
  if(!days||!days.length) return null;
  const idx=train.indexOf(td);
  return days[idx % days.length];
}

function nextSet(){startRest(); const el=document.getElementById("restDisp"); if(el) el.textContent="الجولة الجاية";}
function weekPlan(){
  const names=["سبت","أحد","اتنين","اتلات","أربع","خميس","جمعة"];
  const i=new Date().getDay(); const today=["أحد","اتنين","اتلات","أربع","خميس","جمعة","سبت"][i];
  const s=store(); const done=Object.keys(s.done||{}).filter(k=>s.done[k]).length;
  const goal=5; const el=document.getElementById("weekCard");
  if(el) el.innerHTML="<b>خطة الأسبوع</b><div class='muted'>النهارده: "+today+" — كمّل اللي ظاهر في جدولك.</div><div style='margin-top:8px'>خلصت <b>"+Math.min(done,goal)+"</b> من "+goal+" تمارين هذا الأسبوع</div>";
  const b=document.getElementById("badgeCard");
  const days=Object.keys(s.days||{}).length;
  if(b){const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}"); const st=store(); const bd=sub.badge||st.badge||badgeName(days,st.pts); b.innerHTML="<b>شارتك</b><div>"+bd+" · "+days+" يوم التزام</div>";}
  const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}");
  const pk=matchPack(sub);
  const perk=document.getElementById("perkCard");
  if(perk) perk.innerHTML="<b>باقتك فاتحة لك</b><ul class='muted'>"+(pk?pk.feats:[]).map(f=>"<li>"+f+"</li>").join("")+"</ul>";
  const ch=document.getElementById("chalCard");
  if(ch) ch.innerHTML=chalHTML();
}
function finishChal(){/* التحدي بيتسجل لوحده */}
function addProtein(){const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}"); const goal=Math.max(3,Math.round((+sub.weight||70)*2/30)); const k="yk_prot_"+sid()+"_"+new Date().toISOString().slice(0,10); const n=(+localStorage.getItem(k)||0)+1; localStorage.setItem(k,n); const el=document.getElementById("protOut"); if(el) el.textContent="النهارده: "+n+" / "+goal+" وجبات بروتين تقريبية";}
function saveWeight(){const w=document.getElementById("wLog").value; if(!w) return; const s=store(); s.weights=s.weights||[]; s.weights.push({d:new Date().toISOString().slice(0,10),w:+w}); saveStore(s); try{firebase.database().ref("platform/progress/"+sid()+"/weights").set(s.weights);}catch(e){} drawWeights();}
function drawWeights(){const s=store(); const el=document.getElementById("wChart"); if(!el) return; const arr=s.weights||[]; el.innerHTML=arr.slice(-8).map(x=>x.d+" → "+x.w+" كجم").join("<br>")||"لسه مفيش وزن متسجل.";}
function savePhotos(){const b=document.getElementById("phBefore").value.trim(); const a=document.getElementById("phAfter").value.trim(); const obj={before:b,after:a,at:Date.now()}; localStorage.setItem("yk_ph_"+sid(),JSON.stringify(obj)); try{firebase.database().ref("platform/progress/"+sid()+"/photos").set(obj);}catch(e){} showPhotos();}
function showPhotos(){const raw=localStorage.getItem("yk_ph_"+sid()); const el=document.getElementById("phBox"); if(!el) return; if(!raw){el.textContent="مفيش صور.";return;} const o=JSON.parse(raw); el.innerHTML=(o.before?"<img src='"+o.before+"' style='width:48%;border-radius:12px'>":"")+(o.after?"<img src='"+o.after+"' style='width:48%;border-radius:12px'>":"");}
function applyDietTpl(d){
  const el=document.getElementById("dietTpl"); if(!el) return;
  el.innerHTML="<b>قوالب الأكل</b><div class='muted'>خفيف / متوسط / عالي — الأدمن يقدر يغيّرهم.</div><pre style='white-space:pre-wrap'>"+(d&&d.dietLight?("خفيف:\n"+d.dietLight+"\n\nمتوسط:\n"+(d.dietMid||"")+"\n\nعالي:\n"+(d.dietHigh||"")):"خفيف: بيض + خضار\nمتوسط: فراخ ورز وسلطة\nعالي: فراخ ورز ومكسرات وزبادي")+"</pre>";
  if(d&&d.foodAlt){const a=document.getElementById("foodAlt"); if(a) a.innerHTML=d.foodAlt.replace(/\n/g,"<br>");}
  if(d&&d.challenge){const c=document.getElementById("chalTxt"); if(c) c.textContent=d.challenge;}
}


function formPts(k){return 4;}
function weekSat(){const d=new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()-((d.getDay()+1)%7)); return d;}
function chalCount(){
  const s=store();
  const start=weekSat().getTime();
  let n=0;
  const tags=s.backDone||{};
  Object.keys(tags).forEach(k=>{
    const m=String(k).match(/(\d{4}-\d{2}-\d{2})/);
    if(m && new Date(m[1]).getTime()>=start && tags[k]) n++;
  });
  return n;
}
function chalWeekId(){const d=weekSat(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+d.getDate();}
function chalHTML(){
  const need=5, got=Math.min(need,chalCount()), left=need-got;
  const awarded=(store().chalOk||{})[chalWeekId()];
  const st = awarded ? "التحدي خلص واتضاف 10 نقاط" : (got>=need ? "التحدي اكتمل" : "لسه مخلصتش · باقي "+left);
  return "<b>تحدي الأسبوع</b><div class='muted'>5 تمارين ظهر قبل الجمعة</div><div style='margin-top:8px'>كمّلت <b>"+got+"</b> من "+need+" · "+st+"</div>";
}
function checkChalAward(){
  if(chalCount()<5) return;
  const s=store(); s.chalOk=s.chalOk||{}; const id=chalWeekId();
  if(s.chalOk[id]) return;
  s.chalOk[id]=1; s.pts=(s.pts||0)+10; saveStore(s);
  try{firebase.database().ref("platform/progress/"+sid()+"/pts").set(s.pts);}catch(e){}
}

function renderProfile(){
  const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}");
  const s=store();
  const days=Object.keys(s.days||{}).length;
  const pts=s.pts||sub.pts||0;
  const badge=sub.badge||badgeName(days,pts);
  const set=(id,v)=>{const el=document.getElementById(id); if(el) el.textContent=v;};
  set("profName", sub.displayName||sub.name||"-");
  set("profUser", sub.name? String(sub.name) : "");
  set("profMeta", "");
  set("pPts", String(pts));
  set("pStreak", String(days));
  set("pBadge", badge);
  set("pCode", sub.code||"-");
  const dn=document.getElementById("displayName"); if(dn) dn.value=sub.displayName||"";
  const av=document.getElementById("avImg");
  if(av){ av.src=sub.avatar||av.src||""; av.style.display="block"; }
  try{firebase.database().ref("platform/progress/"+sid()).update({pts:pts,days:s.days||{},badge:badge});}catch(e){}
  renderBoard();
}

function toggleEditProf(){const el=document.getElementById("editProf"); if(el) el.classList.toggle("hidden");}
function openAvatar(){const src=(document.getElementById("avImg")||{}).src; const box=document.getElementById("avBig"); const img=document.getElementById("avBigImg"); if(!src||!box) return; if(img) img.src=src; box.classList.remove("hidden"); box.style.display="grid";}
function closeAvatar(){const box=document.getElementById("avBig"); if(box){box.classList.add("hidden"); box.style.display="none";}}
function saveProfile(){
  const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}");
  sub.displayName=(document.getElementById("displayName").value||"").trim()||sub.name; sub.username=((document.getElementById("userName")||{}).value||"").trim();
  const f=document.getElementById("avFile").files[0];
  const finish=function(){sessionStorage.setItem("ykSub",JSON.stringify(sub));
    if(sub.id) firebase.database().ref("platform/subs/"+sub.id).update({displayName:sub.displayName||null,username:sub.username||null,avatar:sub.avatar||null});
    const ed=document.getElementById("editProf"); if(ed) ed.classList.add("hidden"); renderProfile(); greet(); alert("تم حفظ التعديل");};
  if(f){const r=new FileReader(); r.onload=function(){sub.avatar=r.result; finish();}; r.readAsDataURL(f);} else finish();
}
function renderBoard(){
  const me=JSON.parse(sessionStorage.getItem("ykSub")||"{}");
  firebase.database().ref("platform").once("value").then(function(snap){
    const d=snap.val()||{}; let subs=d.subs||[]; if(!Array.isArray(subs)) subs=Object.values(subs);
    const g=(me.gender||"").toLowerCase();
    const prog=d.progress||{};
    const rows=subs.filter(s=>s && (s.gender||"").toLowerCase()===g).map(s=>{
      const pr=prog[s.id]||{}; const days=pr.days?Object.keys(pr.days).length:0;
      return {name:s.displayName||s.name||"-", pts:pr.pts||0, days:days, badge:s.badge||badgeName(days,pr.pts||0), avatar:s.avatar||""};
    }).sort((a,b)=>b.pts-a.pts).slice(0,20);
    const el=document.getElementById("board");
    if(el) el.innerHTML="<table style=\"width:100%;border-collapse:collapse;font-size:.86rem\"><thead><tr><th></th><th>الاسم</th><th>نقاط</th><th>ستريك</th><th>شارة</th></tr></thead><tbody>"+rows.map((r,i)=>"<tr><td>"+(i+1)+"</td><td style=\"display:flex;gap:8px;align-items:center\"><img src=\""+(r.avatar||"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'><rect fill='%23ccc' width='28' height='28'/></svg>")+"\" style=\"width:28px;height:28px;border-radius:50%;object-fit:cover\"> "+r.name+"</td><td>"+r.pts+"</td><td>"+r.days+"</td><td>"+r.badge+"</td></tr>").join("")+"</tbody></table>";
  });
}
function renderShop(){
  const s=store();
  const el=document.getElementById("shopPtsVal"); if(el) el.textContent=s.pts||0;
  const box=document.getElementById("shopBox"); if(!box) return;
  const offers=(window.REMOTE&&window.REMOTE.shopOffers)||[{pts:120,off:10},{pts:200,off:15},{pts:300,off:20},{pts:420,off:25},{pts:560,off:30},{pts:720,off:35},{pts:900,off:40}];
  box.innerHTML=offers.map(o=>"<div class='card pack'><h3>خصم "+o.off+"٪</h3><div class='price'>"+o.pts+" نقطة</div><p class='muted'>خصم على تجديد اشتراكك بعد تأكيد الكابتن.</p><button class='btn' type='button' onclick='redeem("+o.pts+","+o.off+")'>استبدال</button></div>").join("");
}
function redeem(pts,off){
  const s=store();
  if((s.pts||0)<pts) return alert("نقاطك غير كافيه");
  if(!confirm("طلب استبدال "+pts+" نقطة بخصم "+off+"٪؟ الطلب هيروح للكابتن. النقاط تتخصم بعد التأكيد.")) return;
  const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}");
  firebase.database().ref("platform/redeems").push({sid:sid(),id:sid(),name:sub.name,phone:sub.phone,code:sub.code,pts:pts,off:off,at:Date.now(),status:"pending"});
  firebase.database().ref("platform/notifs/"+sid()).push({text:"طلب استبدال "+pts+" نقطة بخصم "+off+"٪ في انتظار تأكيد الكابتن",at:Date.now(),read:false});
  alert("اتبعت طلب الاستبدال للكابتن. بعد التأكيد النقاط هتتخصم.");
}
function applySite(d){
  if(!d) return;
  window.REMOTE=d;
  const set=(id,v)=>{const el=document.getElementById(id); if(el&&v) el.textContent=v;};
  set("welcomeH", d.welcomeH);
  set("welcomeP", d.welcomeP);
  set("homeHint", d.homeHintTxt);
  set("footerNote", d.footerNote);
  set("credit", d.credit);
  set("chatHead", d.chatTitle);
  applyDietTpl(d); weekPlan();
  const pn=document.getElementById("payNums");
  if(pn && d){ pn.textContent="InstaPay: "+(d.instapay||"01062944697")+" · Vodafone Cash: "+(d.vfCash||"01062944697")+" · Orange Cash: "+(d.orCash||"01159010864"); }

  document.querySelectorAll(".brand").forEach(el=>{ if(d.brandName) el.textContent=d.brandName; 
  if(d.images){
    window.IMGDATA=window.IMGDATA||{};
    Object.keys(d.images).forEach(k=>{
      const v=d.images[k];
      if(k==="imgGym"){ const img=document.querySelector("#boyPick img"); if(img) img.src=v; IMGDATA["images/boys-hero.jpg"]=v; }
      else if(k==="imgHome"){ const img=document.querySelector("#girlPick img"); if(img) img.src=v; IMGDATA["images/girls-hero.jpg"]=v; }
      else { IMGDATA["images/ex/"+k+".jpg"]=v; }
    });
  }

});
  if(d.imgGym){ const img=document.querySelector("#boyPick img"); if(img) img.src=d.imgGym; 
  if(d.images){
    window.IMGDATA=window.IMGDATA||{};
    Object.keys(d.images).forEach(k=>{
      const v=d.images[k];
      if(k==="imgGym"){ const img=document.querySelector("#boyPick img"); if(img) img.src=v; IMGDATA["images/boys-hero.jpg"]=v; }
      else if(k==="imgHome"){ const img=document.querySelector("#girlPick img"); if(img) img.src=v; IMGDATA["images/girls-hero.jpg"]=v; }
      else { IMGDATA["images/ex/"+k+".jpg"]=v; }
    });
  }

}
  if(d.imgHome){ const img=document.querySelector("#girlPick img"); if(img) img.src=d.imgHome; 
  if(d.images){
    window.IMGDATA=window.IMGDATA||{};
    Object.keys(d.images).forEach(k=>{
      const v=d.images[k];
      if(k==="imgGym"){ const img=document.querySelector("#boyPick img"); if(img) img.src=v; IMGDATA["images/boys-hero.jpg"]=v; }
      else if(k==="imgHome"){ const img=document.querySelector("#girlPick img"); if(img) img.src=v; IMGDATA["images/girls-hero.jpg"]=v; }
      else { IMGDATA["images/ex/"+k+".jpg"]=v; }
    });
  }

}

  if(d.images){
    window.IMGDATA=window.IMGDATA||{};
    Object.keys(d.images).forEach(k=>{
      const v=d.images[k];
      if(k==="imgGym"){ const img=document.querySelector("#boyPick img"); if(img) img.src=v; IMGDATA["images/boys-hero.jpg"]=v; }
      else if(k==="imgHome"){ const img=document.querySelector("#girlPick img"); if(img) img.src=v; IMGDATA["images/girls-hero.jpg"]=v; }
      else { IMGDATA["images/ex/"+k+".jpg"]=v; }
    });
  }

}

function needAuth(){if(sessionStorage.getItem("ykAuth")!=="1"){openAuth("login"); return false;} return true;}
function openAuth(tab){showPage(tab==="reg"?"reg":"login");}
function closeAuth(){showPage("welcome");}
function authTab(w){openAuth(w);}
function submitReg(){
  const user=regUser.value.trim(),phone=regPhone.value.trim(),gender=regGender.value,w=regW.value.trim(),h=regH.value.trim(),a=regA.value.trim();
  const packEl=document.querySelector("input[name=regPack]:checked");
  if(!user||!phone||!gender||!w||!h||!a||!packEl) return alert("املأ البيانات واختار الباقة");
  const parts=packEl.value.split("|");
  const req={name:user,phone:phone,gender:gender,weight:w,height:h,age:a,package:parts[0],price:parts[1],months:parts[2],status:"pending",at:Date.now()};
  firebase.database().ref("platform/requests").push(req).then(function(){
    const m=document.getElementById("regMsg");
    if(m) m.textContent="تم إرسال الطلب. استنى التأكيد. هتوصلك رسالة على الواتساب.";
    alert("تم إرسال الطلب. انتظار التأكيد. سوف تصلك رسالة على الواتساب.");
  }).catch(function(){alert("حصل خطأ. جرّب تاني.");});
}
function registerAccount(num){submitReg();}
function sendPay(){
  const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}");
  const buy=JSON.parse(sessionStorage.getItem("ykBuy")||"{}");
  const method=window.PAY_WAY||"instapay";
  const from=(document.getElementById("payFrom")||{}).value||"";
  const ref=(document.getElementById("payRef")||{}).value||"";
  const amt=(document.getElementById("payAmt")||{}).value||buy.price||"";
  const f=document.getElementById("payShot");
  if(!from||!ref||!amt) return alert("اكتب الرقم اللي حولت منه ورقم العملية والمبلغ");
  if(!f||!f.files||!f.files[0]) return alert("حمّل سكرين التحويل من المعرض");
  const r=new FileReader();
  r.onload=function(){
    firebase.database().ref("platform/payReqs").push({
      sid:sub.id,name:sub.name,phone:sub.phone,code:sub.code,gender:sub.gender,
      method:method,from:from,ref:ref,amt:amt,shot:r.result,
      package:buy.name||sub.package||"",price:buy.price||amt,status:"pending",at:Date.now()
    }).then(function(){
      const m=document.getElementById("payMsg"); if(m) m.textContent="تم الإرسال. انتظر رسالة التأكيد على الواتس.";
      alert("تم الإرسال. انتظر رسالة التأكيد على الواتس.");
    });
  };
  r.readAsDataURL(f.files[0]);
}
function renewNow(){
  const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}");
  buyPack(sub.package||"تجديد", sub.remain||sub.paid||150, sub.months||1);
}

function packMonths(sub){if(sub.days && +sub.days) return 0; if(sub.months) return +sub.months; const p=String(sub.package||""); if(p.includes("تجربة")||p.includes("أيام")) return 0; if(p.includes("سنو")||p.includes("12")) return 12; if(p.includes("6")) return 6; if(p.includes("3 شهور")||p.includes("3 شهر")) return 3; if(p.includes("3")) return 3; return 1;}
function expired(sub){if(!sub) return true; if(sub.expiresAt) return Date.now()> +sub.expiresAt; const start=sub.created||0; const p=String(sub.package||""); if(p.includes("تجربة")||+sub.days===3) return start && (Date.now()-start)>3*24*60*60*1000; return start && (Date.now()-start)>Math.max(packMonths(sub),1)*30*24*60*60*1000;}
function checkPassword(){const pass=passInput.value.trim();firebase.database().ref("platform").once("value").then(function(snap){var d=snap.val()||{};var subs=d.subs||[];if(subs&&!Array.isArray(subs))subs=Object.values(subs);var sub=subs.find(s=>s&&s.code===pass);if(!sub||sub.active===false||expired(sub)){errorMsg.style.display="block";return;}sessionStorage.setItem("ykAuth","1");sessionStorage.setItem("ykSub",JSON.stringify(sub));try{sub.lastSeen=Date.now(); if(sub.id) firebase.database().ref("platform/subs/"+sub.id).update({lastSeen:sub.lastSeen});}catch(e){}addPoints(1,"login");markStreak();unlock();}).catch(function(){errorMsg.style.display="block";});}
function logout(){sessionStorage.clear();location.reload();}
function sid(){try{return JSON.parse(sessionStorage.getItem("ykSub")||"{}").id||"x";}catch(e){return"x";}}
function store(){return JSON.parse(localStorage.getItem("yk_prog_"+sid())||'{"pts":0,"days":{},"done":{},"loginDays":{}}');}
function saveStore(s){localStorage.setItem("yk_prog_"+sid(),JSON.stringify(s));}
function listenMe(){
  const id=sid(); if(!id||id==="x") return;
  firebase.database().ref("platform/subs/"+id).on("value",function(snap){
    const s=snap.val(); if(!s) return;
    const cur=JSON.parse(sessionStorage.getItem("ykSub")||"{}");
    sessionStorage.setItem("ykSub", JSON.stringify(Object.assign({},cur,s)));
    const st=store();
    if(s.pts!=null) st.pts=+s.pts;
    if(s.badge) st.badge=s.badge;
    saveStore(st);
    try{renderPts(); greet(); if(typeof renderProfile==="function") renderProfile();}catch(e){}
  });
  firebase.database().ref("platform/progress/"+id).on("value",function(snap){
    const p=snap.val()||{};
    const st=store();
    const cur=JSON.parse(sessionStorage.getItem("ykSub")||"{}");
    const remote=Math.max(+ (p.pts||0), +(cur.pts||0), +(st.pts||0));
    st.pts=remote;
    if(p.badge||cur.badge) st.badge=p.badge||cur.badge;
    saveStore(st);
    try{renderPts(); if(typeof renderProfile==="function") renderProfile();}catch(e){}
  });
  firebase.database().ref("platform/notifs/"+id).on("value",function(snap){
    const val=snap.val()||{};
    const unread=Object.keys(val).filter(k=>val[k]&&!val[k].read).length;
    const n=document.getElementById("bellN"); if(n) n.textContent=unread?String(unread):"";
  });
}
function addPoints(n,why){const s=store();if(why==="login"){const day=new Date().toISOString().slice(0,10);if(s.loginDays[day])return;s.loginDays[day]=1;}s.pts+=(n||0);saveStore(s);}
function markStreak(){const s=store();s.days[new Date().toISOString().slice(0,10)]=1;saveStore(s);}
function renderPts(){const s=store();const days=Object.keys(s.days).length;const done=Object.keys(s.done).filter(k=>s.done[k]).length;if(document.getElementById("ptsVal")) ptsVal.textContent=s.pts;if(document.getElementById("exVal")) exVal.textContent=done;if(document.getElementById("streakVal")) streakVal.textContent=days;pctVal.textContent=Math.min(100,done*4)+"%";const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}");achTxt.innerHTML="اتبعت النظام: "+(done?"نعم، فيه تقدم واضح":"لسه في البداية")+"<br>الباقة: "+(sub.package||"غير محددة")+"<br>مدفوع: "+(sub.paid||0)+" جنيه · المتبقي: "+(sub.remain||0)+" جنيه";}
function greet(){const h=new Date().getHours();const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}");const msg=(h<17?"صباح الخير":"مساء الخير")+"، "+(sub.name||"بطل"); if(document.getElementById("hello")) hello.textContent=msg; const chip=document.getElementById("userChip"); if(chip){chip.classList.remove("hidden"); chip.textContent=(sub.name||"")+" · "+(sub.code||"");}}
function applyGenderLock(){const g=(JSON.parse(sessionStorage.getItem("ykSub")||"{}").gender||"").toLowerCase();boyPick.classList.toggle("lock",g==="girl");girlPick.classList.toggle("lock",g==="boy");}
function unlock(){closeAuth();document.getElementById("topbar").classList.remove("hidden");hdrLogin.classList.add("hidden");hdrReg.classList.add("hidden");hdrOut.classList.remove("hidden"); var fab=document.getElementById("fabChat"); if(fab) fab.classList.remove("hidden");document.getElementById("pg-welcome").classList.add("hidden");document.getElementById("pg-home").classList.remove("hidden");greet();applyGenderLock();fillBody();renderPts();listenMe();showPage("home",document.getElementById("navHome"));}
function fillBody(){const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}");if(sub.weight)wKg.value=sub.weight;if(sub.height)hCm.value=sub.height;if(sub.age)ageY.value=sub.age;}
function meals(g,target,pro){
const cut=g==="cut";
const carb=Math.round(target*0.4/4), fat=Math.round(target*0.25/9);
return `<div class="how"><b>خطة ${cut?"التنشيف / الريجيم":"التضخيم"} المطوّرة</b>
السعرات اليومية: ${target}
البروتين: ${pro} جم · كارب: ${carb} جم · دهون: ${fat} جم
الماء: 3-4 لتر · خطوات: 8-10 آلاف

فطار:
- ${cut?"بيضتين + توست أسمر + خيار":"بيضتين + شوفان بلبن + موزة"}
- قهوة سادة أو يانسون

سناك 1:
- ${cut?"تفاحة أو زبادي لايت":"زبادي كامل + معلقة عسل"}

غدا:
- ${cut?"صدر فرخة 150جم + رز 4 معالق + سلطة كبيرة":"صدر 200جم أو لحمة + رز 8 معالق + خضار"}

سناك 2:
- ${cut?"خيار وحمص":"حفنة مكسرات"}

عشا:
- ${cut?"تونة وسلطة أو زبادي وبيض":"بطاطس مشوية + فراخ أو شوفان بلبن"}

تحسينات الباقة الأعلى: تعديل أسبوعي للسعرات، بدائل أكل، وعدّاد ماء داخل المنصة.</div>`;
}
function calcDiet(){const w=+wKg.value,h=+hCm.value,a=+ageY.value,g=goalSel.value;if(!w||!h||!a){dietOut.textContent="الأدمن يدخل الوزن والطول والسن.";return;}const sex=JSON.parse(sessionStorage.getItem("ykSub")||"{}").gender==="girl"?-161:5;const target=Math.round((10*w+6.25*h-5*a+sex)*1.55)+(g==="cut"?-450:300);dietOut.innerHTML=meals(g,target,Math.round(w*2));}
const D={
bench:{name:"Bench Press",yt:"https://www.youtube.com/results?search_query=bench+press+form",img:"bench",muscle:"صدر",rest:"90 ث",level:"متوسط",forms:["4×8-10"],how:"نام على البنش وانزل البار لمنتصف الصدر ثم اطلع بتحكم.",tip:"متقوسش ظهرك زيادة."},
inc:{name:"Incline Press",yt:"https://www.youtube.com/results?search_query=incline+bench+press+form",img:"inc",muscle:"صدر علوي",rest:"75 ث",level:"متوسط",forms:["4×8"],how:"بنش 30 درجة. انزل لأعلى الصدر.",tip:"الميل العالي للأكتاف."},
pull:{name:"Lat Pulldown",yt:"https://www.youtube.com/results?search_query=lat+pulldown+form",img:"pull",muscle:"ظهر",rest:"75 ث",level:"مبتدئ",forms:["4×10"],how:"صدر لفوق واجذب للترقوة.",tip:"من غير تمايل جسم."},
row:{name:"Barbell Row",yt:"https://www.youtube.com/results?search_query=barbell+row+form",img:"row",muscle:"ظهر أوسط",rest:"90 ث",level:"متوسط",forms:["4×8"],how:"ميل 45 واسحب الكوع ورا.",tip:"ظهر مستقيم."},
press:{name:"Shoulder Press",yt:"https://www.youtube.com/results?search_query=overhead+shoulder+press+form",img:"press",muscle:"أكتاف",rest:"75 ث",level:"متوسط",forms:["4×10"],how:"الوزن عند الأذن واطلع لفوق.",tip:"متقدمش الوزن قدام وشك."},
curl:{name:"Biceps Curl",yt:"https://www.youtube.com/results?search_query=biceps+curl+form",img:"curl",muscle:"باي",rest:"45 ث",level:"مبتدئ",forms:["3×12"],how:"كوع ثابت من غير مرجحة.",tip:"نزول بطيء."},
squat:{name:"Squat",yt:"https://www.youtube.com/results?search_query=barbell+squat+form",img:"squat",muscle:"رجل",rest:"120 ث",level:"متقدم",forms:["4×6-8"],how:"انزل كأنك قاعد واطلع من الكعب.",tip:"ركب مع الأصابع."},
rdl:{name:"Romanian Deadlift",yt:"https://www.youtube.com/results?search_query=romanian+deadlift+form",img:"rdl",muscle:"همسترنج",rest:"90 ث",level:"متوسط",forms:["3×10"],how:"ورك لورا وظهر مستقيم.",tip:"متقوسش."},
lunge:{name:"Walking Lunge",yt:"https://www.youtube.com/results?search_query=walking+lunge+form",img:"lunge",muscle:"رجل + جلوتس",rest:"60 ث",level:"مبتدئ",forms:["3×10"],how:"خطوة متوسطة ونزل الركبة الخلفية.",tip:"الجذع ثابت."},
hip:{name:"Hip Thrust",yt:"https://www.youtube.com/results?search_query=hip+thrust+form",img:"hip",muscle:"جلوتس",rest:"75 ث",level:"متوسط",forms:["4×10"],how:"ارفع الورك واعصر الجلوتس.",tip:"متقوسش ظهرك."},
kick:{name:"Glute Kickback",yt:"https://www.youtube.com/results?search_query=glute+kickback+form",img:"kick",muscle:"جلوتس",rest:"45 ث",level:"مبتدئ",forms:["3×15"],how:"الرجل لورا بزاوية خفيفة.",tip:"الشكل أهم من الوزن."},
core:{name:"Plank",yt:"https://www.youtube.com/results?search_query=plank+exercise+form",img:"core",muscle:"كور",rest:"40 ث",level:"مبتدئ",forms:["3×40ث"],how:"الجسم خط واحد وشد البطن.",tip:"الكوع تحت الكتف."},
lat:{name:"Lateral Raise",yt:"https://www.youtube.com/results?search_query=lateral+raise+form",img:"lat",muscle:"جانب الكتف",rest:"45 ث",level:"مبتدئ",forms:["3×15"],how:"اطلع لمستوى الكتف وانزل ببطء.",tip:"من غير مرجحة."}
};
const DEFAULT_PROGRAMS={boys:[{id:"arnold",name:"Arnold Split",img:"bench"},{id:"ppl",name:"Push Pull Legs",img:"press"},{id:"bro",name:"Bro Split",img:"row"},{id:"ul",name:"Upper Lower",img:"squat"},{id:"cutting",name:"Cutting",img:"lunge"},{id:"bulking",name:"Bulking",img:"rdl"},{id:"athletic",name:"Athletic Body",img:"core"},{id:"fullbody",name:"Full Body",img:"squat"},{id:"homeb",name:"Home Workout",img:"lunge"},{id:"hiit",name:"HIIT Cut",img:"core"}],girls:[{id:"glutes",name:"Glute Builder",img:"hip"},{id:"hourglass",name:"Hourglass Sculpt",img:"kick"},{id:"upperg",name:"Upper Tone",img:"lat"},{id:"coreg",name:"Core & Waist",img:"core"},{id:"leang",name:"Lean Cutting",img:"lunge"},{id:"softbulk",name:"Soft Bulk",img:"hip"},{id:"shape",name:"Athletic Shape",img:"squat"},{id:"pilates",name:"Pilates Core",img:"core"},{id:"lower",name:"Lower Burn",img:"lunge"}],days:{arnold:[{day:"Saturday",title:"Chest / Back",items:[D.bench,D.pull,D.row]},{day:"Sunday",title:"Shoulders / Arms",items:[D.press,D.curl]},{day:"Tuesday",title:"Legs",items:[D.squat,D.rdl]}],ppl:[{day:"Saturday",title:"Push",items:[D.inc,D.press]},{day:"Sunday",title:"Pull",items:[D.pull,D.row]},{day:"Monday",title:"Legs",items:[D.squat,D.lunge]}],bro:[{day:"Saturday",title:"Chest",items:[D.bench,D.inc]},{day:"Sunday",title:"Back",items:[D.pull,D.row]},{day:"Monday",title:"Legs",items:[D.squat]}],ul:[{day:"Saturday",title:"Upper",items:[D.bench,D.row,D.press]},{day:"Sunday",title:"Lower",items:[D.squat,D.rdl]}],cutting:[{day:"Saturday",title:"Metabolic",items:[D.squat,D.press,D.core]}],bulking:[{day:"Saturday",title:"Heavy",items:[D.bench,D.squat]}],athletic:[{day:"Saturday",title:"Power",items:[D.squat,D.press,D.core]}],glutes:[{day:"Saturday",title:"Glute A",items:[D.hip,D.lunge]},{day:"Monday",title:"Glute B",items:[D.hip,D.kick]}],hourglass:[{day:"Saturday",title:"Shape",items:[D.hip,D.lat]}],upperg:[{day:"Saturday",title:"Upper Tone",items:[D.inc,D.pull,D.press]}],coreg:[{day:"Saturday",title:"Core",items:[D.core,D.hip]}],leang:[{day:"Saturday",title:"Lean",items:[D.lunge,D.core]}],softbulk:[{day:"Saturday",title:"Build",items:[D.hip,D.rdl]}],shape:[{day:"Saturday",title:"Athletic Shape",items:[D.squat,D.press]}],
fullbody:[{day:"Saturday",title:"Full A",items:[D.squat,D.bench,D.row]},{day:"Monday",title:"Full B",items:[D.rdl,D.press,D.core]}],
homeb:[{day:"Saturday",title:"Home Strength",items:[D.lunge,D.press,D.core]},{day:"Wednesday",title:"Home Pump",items:[D.squat,D.curl,D.lat]}],
hiit:[{day:"Saturday",title:"HIIT",items:[D.lunge,D.core,D.press]},{day:"Sunday",title:"Metabolic",items:[D.squat,D.lat,D.core]}],
pilates:[{day:"Saturday",title:"Core Flow",items:[D.core,D.hip]},{day:"Tuesday",title:"Control",items:[D.kick,D.lat]}],
lower:[{day:"Saturday",title:"Lower A",items:[D.squat,D.lunge,D.hip]},{day:"Monday",title:"Lower B",items:[D.rdl,D.kick,D.core]}]}};
let REMOTE=null;
function programs(){
  if(REMOTE && REMOTE.programs && (REMOTE.programs.boys||REMOTE.programs.girls)){
    const p=REMOTE.programs;
    return {boys:(p.boys&&p.boys.length)?p.boys:DEFAULT_PROGRAMS.boys, girls:(p.girls&&p.girls.length)?p.girls:DEFAULT_PROGRAMS.girls, days:Object.assign({},DEFAULT_PROGRAMS.days,p.days||{})};
  }
  return DEFAULT_PROGRAMS;
}
let section=null,current=null,currentName="";
function openSection(s){const g=(JSON.parse(sessionStorage.getItem("ykSub")||"{}").gender||"").toLowerCase();if(g==="boy"&&s==="girls")return;if(g==="girl"&&s==="boys")return;section=s;sysTitle.textContent=s==="boys"?"أنظمة الولاد":"أنظمة البنات";const list=(programs()[s]||[]);
sysBox.innerHTML=list.map(x=>`<article class="pick" onclick="openSys('${x.id}','${x.name}')"><img src="${heroPic(s)}"><div class="ov"><div><b>${x.name}</b></div></div></article>`).join("")||"<div class='muted'>مفيش أنظمة متاحة.</div>";
  if(document.body.getAttribute("data-page")!=="sys") showPage("sys", document.getElementById("navSys"));
}
function switchSys(id){const f=(programs()[section]||[]).find(x=>x.id===id);openSys(id,f?f.name:id);}
function longHow(it){
  const n=it.name||"التمرين";
  return "ازاي تعمل "+n+" بالتفصيل:\n"+
  "1) سخن 5 دقايق مشي أو تمارين خفيفة.\n"+
  "2) اظبط الوزن اللي تقدر تتحكم فيه لآخر عدة.\n"+
  "3) "+(it.how||"حافظ على ظهرك مستقيم والحركة بطيئة.")+"\n"+
  "4) انزل بعدّة مسيطر عليها، واطلع بقوة من غير ما تلعب بمفاصلك.\n"+
  "5) كل مجموعة خذ الراحة المكتوبة: "+(it.rest||"60 ث")+".\n"+
  "6) لو الوجع في المفصل مش في العضلة، وقف وقلل الوزن.\n"+
  "7) بعد آخر مجموعة، تمشى دقيقة واشرب مية.\n"+
  (it.tip?("ملاحظة الكابتن: "+it.tip):"");
}
function openSys(id,name){
  const wp=weekPlanSaved();
  if(!wp||!wp.locked){ alert("حدد أيام التمرين والراحة ودوس تم الأول"); showPage("sys"); renderWeekPick(); return; }
  current=id; currentName=name;
  const days=(programs().days||{})[id]||[];
  const st=store();
  const list=programs()[section]||[];
  const opts=list.map(x=>`<option value="${x.id}" ${x.id===id?"selected":""}>${x.name}</option>`).join("");
  const d=todayProgramDay(days);
  const rest=!trainDaysList().includes(todayEn());
  let body="";
  if(rest||!d){
    body=`<div class="card" style="padding:18px"><h3>النهارده ${todayAr()} راحة</h3><p class="muted">مفيش تمرين النهارده حسب جدولك. ارتاح، اشرب مية، وارجع يوم التمرين الجاي.</p></div>`;
  } else {
    const di=days.indexOf(d);
    body=`<div class="day"><h3>النهارده ${todayAr()} · ${d.title||"تمرين اليوم"}</h3>`+(d.items||[]).map((it,ii)=>{
      const k=id+"-"+todayKey()+"-"+ii;
      const done=!!st.done[k];
      return `<div class="excard"><div style="display:flex;justify-content:space-between;gap:8px"><b>${it.name}</b><button class="done" ${done?"disabled":""} onclick="markDone('${k}')">${done?"اتحسبت النهارده ✓":"خلصت التمرين"}</button></div>${picsOf(it).map(src=>`<img class="pic" src="${src}">`).join("")}<div class="meta"><span>${it.muscle||""}</span><span>راحة ${it.rest||"60 ث"}</span><span>${it.level||""}</span></div><div class="how"><b>التشكيلات</b>\n${(it.forms||[]).join(" · ")}\n\n<b>الشرح التفصيلي</b>\n${longHow(it)}</div>${it.yt?`<a class="btn ghost" href="${it.yt}" target="_blank" style="margin-top:8px">فيديو الحركة</a>`:""}</div>`;
    }).join("")+"</div>";
  }
  workBox.innerHTML=`<div class="card" style="padding:12px;margin-bottom:10px"><b>تغيير النظام</b> <select onchange="switchSys(this.value)">${opts}</select></div>
<div class="card" style="padding:12px;margin-bottom:10px"><b>تايمر الراحة</b><div style="display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap"><select id="restSec"><option value="30">30 ث</option><option value="45">45 ث</option><option value="60" selected>60 ث</option><option value="90">90 ث</option><option value="120">120 ث</option></select><button class="btn" type="button" onclick="startRest()">تشغيل</button><button class="btn ghost" type="button" onclick="nextSet()">الجولة الجاية</button><b id="restDisp">00:00</b></div></div>
<h3>${name}</h3>`+body;
  showPage("work", document.getElementById("navWork"));
  renderDaysTable();
}
let restT=null;
function playBeep5(){try{const ctx=new (window.AudioContext||window.webkitAudioContext)();const t0=ctx.currentTime;for(let i=0;i<5;i++){const o=ctx.createOscillator();const g=ctx.createGain();o.type="sine";o.frequency.value=880;g.gain.setValueAtTime(0.0001,t0+i);g.gain.exponentialRampToValueAtTime(0.2,t0+i+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t0+i+0.7);o.connect(g);g.connect(ctx.destination);o.start(t0+i);o.stop(t0+i+0.75);}}catch(e){}try{if(navigator.vibrate) navigator.vibrate([400,120,400,120,400,120,400,120,400]);}catch(e){}}
function startRest(){clearInterval(restT);let left=+(document.getElementById("restSec")||{value:60}).value;const disp=document.getElementById("restDisp");const tick=()=>{if(disp)disp.textContent=String(Math.floor(left/60)).padStart(2,"0")+":"+String(left%60).padStart(2,"0");};tick();restT=setInterval(()=>{left--;if(left<0){clearInterval(restT);if(disp)disp.textContent="انتهى";playBeep5();}else tick();},1000);}
function renderDaysTable(){const s=store();const days=Object.keys(s.days||{}).sort();const el=document.getElementById("dayTable");if(!el)return;el.innerHTML="<b>أيام التمرين</b><div class='muted'>عدد الأيام: "+days.length+"</div>"+(days.length?"<ul>"+days.map(d=>"<li>"+d+"</li>").join("")+"</ul>":"<div class='muted'>لسه ما فيش أيام متسجلة.</div>");}
function markDone(k){
  const s=store();
  if(s.done[k]){ alert("النقاط بتاعت التمرين ده اتتحسبت النهارده. بكرة يتفتح تاني."); return; }
  s.done[k]=1;
  s.pts+= 4;
  try{
    const bits=k.split("-");
    const ii=+bits.pop();
    const day=bits.slice(-3).join("-");
    const it=(((todayProgramDay((programs().days||{})[current]||[])||{}).items)||[])[ii]||{};
    const txt=((it.muscle||"")+" "+(it.name||"")+" "+(it.img||"")).toLowerCase();
    if(/ظهر|back|row|pull|pulldown/.test(txt)){ s.backDone=s.backDone||{}; s.backDone[k]=1; }
  }catch(e){}
  saveStore(s);
  checkChalAward();
  try{firebase.database().ref("platform/progress/"+sid()+"/pts").set(s.pts); firebase.database().ref("platform/subs/"+sid()+"/pts").set(s.pts); firebase.database().ref("platform/progress/"+sid()+"/done").set(s.done); firebase.database().ref("platform/progress/"+sid()+"/lastTrain").set(Date.now());}catch(e){}
  markStreak(); renderPts(); openSys(current,currentName);
}
function buyPack(name,price,months){
  sessionStorage.setItem("ykBuy", JSON.stringify({name:name,price:price,months:months||0}));
  const box=document.getElementById("selPackBox");
  if(box) box.innerHTML="<b>الباقة المختارة</b><div class='muted'>"+name+" · "+(price||0)+" جنيه · "+(months||0)+" شهر</div>";
  const amt=document.getElementById("payAmt"); if(amt) amt.value=price||0;
  showPage("pay");
}
function pickPay(m){
  window.PAY_WAY=m;
  ["instapay","vodafone","etisalat"].forEach(function(id){
    const el=document.getElementById("way-"+id); if(!el) return;
    el.classList.toggle("on", id===m);
  });
  const names={instapay:"إنستا باي 01159010864",vodafone:"فودافون كاش 01062944697",etisalat:"اتصالات كاش 01159010864"};
  const lab=document.getElementById("payPickLab");
  if(lab) lab.textContent="اختارت: "+(names[m]||m);
}
const PACKS=[
{id:"trial",name:"تجربة 3 أيام",old:75,price:0,months:0,days:3,feats:["خطة الأسبوع الأساسية","نظام غذائي مبسط","عداد ماء","بدون شات مطوّل"]},
{id:"m1",name:"الباقة الشهرية",old:200,price:150,months:1,feats:["جداول الولاد والبنات","نظام غذائي حسب الجسم","نقاط وستريك وشارة","دردشة الكابتن","تحدي أسبوعي"]},
{id:"m3",name:"باقة 3 شهور",old:600,price:500,months:3,feats:["كل مميزات الشهرية","سجل وزن أسبوعي","صور قبل وبعد للمتابعة","بدائل أكل وقوالب دايت","أولوية رد في الشات","خصم نقاط أعلى"]},
{id:"m6",name:"باقة 6 شهور",old:1100,price:850,months:6,feats:["كل مميزات 3 شهور","مكتبة فيديو للحركات","تحدي بنقاط زيادة","تتبع بروتين يومي","تعديل خطة كل شهر","أولوية أعلى من 3 شهور"]},
{id:"y1",name:"الباقة السنوية",old:2000,price:1500,months:12,feats:["كل المميزات السابقة","مكالمة مراجعة كل أسبوعين","أولوية قصوى في الشات","تحديث شهري للخطة","متابعة أدق للوزن والصور","أفضل قيمة للجنيه"]}
];
function packCard(p){return `<div class="card pack"><h3>${p.name}</h3><div>${p.price?`<span class="old">${p.old} جنيه</span><span class="price">${p.price} جنيه</span>`:`<span class="old">${p.old} جنيه</span><span class="price">مجاناً</span>`}</div><ul class="feats">${p.feats.map(f=>"<li><span class=\"chk\">✓</span> "+f+"</li>").join("")}</ul><button class="btn" onclick="buyPack('${p.name}',${p.price},${p.months||0})">اشتراك</button></div>`;}
function renderPacks(){
  const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}");
  const box=document.getElementById("packCards"); if(box) box.innerHTML=PACKS.filter(p=>p.price>0 && p.id!=="trial").map(packCard).join("");
  const pay=document.getElementById("payStatus");
  if(pay){
    const left=sub.expiresAt?Math.max(0,Math.ceil((+sub.expiresAt-Date.now())/86400000)):"-";
    const pk=matchPack(sub);
    pay.innerHTML=`<b>حالة اشتراكك</b><div class="muted">الباقة: ${sub.package||(pk&&pk.name)||"-"}<br>مدفوع: ${sub.paid||0} جنيه<br>المتبقي: ${sub.remain||0} جنيه<br>ينتهي بعد: ${left} يوم</div><div style="margin-top:8px"><b>باقتك فاتحة لك</b><ul class="muted">${(pk?pk.feats:["الجداول الأساسية"]).map(f=>"<li>"+f+"</li>").join("")}</ul></div>`;
  }
  const selb=document.getElementById("selPackBox"); const buySel=JSON.parse(sessionStorage.getItem("ykBuy")||"null"); if(selb&&buySel) selb.innerHTML="<b>الباقة المختارة</b><div class='muted'>"+buySel.name+" · "+(buySel.price||0)+" جنيه</div>";
}
function addWater(){const k="yk_water_"+sid()+"_"+new Date().toISOString().slice(0,10); const n=(+localStorage.getItem(k)||0)+1; localStorage.setItem(k,n); const el=document.getElementById("waterOut"); if(el) el.textContent="النهارده: "+n+" / 8 كوبايات";}
function listenChat(){
  const box=document.getElementById("chatBox"); if(!box) return;
  firebase.database().ref("platform/chats/"+sid()+"/messages").limitToLast(50).on("value",function(snap){
    const val=snap.val()||{};
    const arr=Object.keys(val).map(k=>val[k]).sort((a,b)=>(a.at||0)-(b.at||0));
    box.innerHTML=arr.map(m=>{const mine=m.from!=="admin"; const tm=m.at?new Date(m.at).toLocaleTimeString("ar-EG",{hour:"2-digit",minute:"2-digit"}):""; return `<div class="bubble ${mine?"me":"cap"}">${(m.text||"").replace(/[<>]/g,"")}<small>${mine?"أنت":"الكابتن"} · ${tm}</small></div>`;}).join("")||"<div class='muted'>ابدأ الدردشة مع الكابتن.</div>";
    box.scrollTop=box.scrollHeight;
  });
}
function sendChat(){
  const t=(document.getElementById("chatMsg").value||"").trim(); if(!t) return;
  const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}");
  firebase.database().ref("platform/chats/"+sid()).update({name:sub.name||"",phone:sub.phone||"",code:sub.code||"",updated:Date.now()});
  firebase.database().ref("platform/chats/"+sid()+"/messages").push({from:"user",text:t,at:Date.now()});
  document.getElementById("chatMsg").value="";
}
firebase.database().ref("platform").on("value", function(snap){ applySite(snap.val()||{}); });


function matchPack(sub){
  const p=String(sub.package||"");
  if(p.includes("تجربة")||p.includes("أيام")||+sub.days===3) return PACKS[0];
  if(p.includes("سنو")||p.includes("1500")||+sub.months===12) return PACKS[4];
  if(p.includes("6")||p.includes("850")||+sub.months===6) return PACKS[3];
  if(p.includes("3 شهور")||p.includes("500")||+sub.months===3) return PACKS[2];
  return PACKS[1];
}
function packLevel(sub){const pk=matchPack(sub); return pk?pk.months:1;}
function badgeName(days,pts){days=+days||0;pts=+pts||0; if(days>=30||pts>=800) return "أسطوري"; if(days>=20||pts>=500) return "نجم الجيم"; if(days>=12||pts>=250) return "ملتزم"; if(days>=7||pts>=120) return "منتظم"; if(days>=3||pts>=40) return "مجتهد"; return "مبتدئ";}

function nextSet(){startRest(); const el=document.getElementById("restDisp"); if(el) el.textContent="الجولة الجاية";}
function weekPlan(){
  const names=["سبت","أحد","اتنين","اتلات","أربع","خميس","جمعة"];
  const i=new Date().getDay(); const today=["أحد","اتنين","اتلات","أربع","خميس","جمعة","سبت"][i];
  const s=store(); const done=Object.keys(s.done||{}).filter(k=>s.done[k]).length;
  const goal=5; const el=document.getElementById("weekCard");
  if(el) el.innerHTML="<b>خطة الأسبوع</b><div class='muted'>النهارده: "+today+" — كمّل اللي ظاهر في جدولك.</div><div style='margin-top:8px'>خلصت <b>"+Math.min(done,goal)+"</b> من "+goal+" تمارين هذا الأسبوع</div>";
  const b=document.getElementById("badgeCard");
  const days=Object.keys(s.days||{}).length;
  if(b){const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}"); const st=store(); const bd=sub.badge||st.badge||badgeName(days,st.pts); b.innerHTML="<b>شارتك</b><div>"+bd+" · "+days+" يوم التزام</div>";}
  const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}");
  const pk=matchPack(sub);
  const perk=document.getElementById("perkCard");
  if(perk) perk.innerHTML="<b>باقتك فاتحة لك</b><ul class='muted'>"+(pk?pk.feats:[]).map(f=>"<li>"+f+"</li>").join("")+"</ul>";
  const ch=document.getElementById("chalCard");
  if(ch) ch.innerHTML=chalHTML();
}
function finishChal(){/* التحدي بيتسجل لوحده */}
function addProtein(){const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}"); const goal=Math.max(3,Math.round((+sub.weight||70)*2/30)); const k="yk_prot_"+sid()+"_"+new Date().toISOString().slice(0,10); const n=(+localStorage.getItem(k)||0)+1; localStorage.setItem(k,n); const el=document.getElementById("protOut"); if(el) el.textContent="النهارده: "+n+" / "+goal+" وجبات بروتين تقريبية";}
function saveWeight(){const w=document.getElementById("wLog").value; if(!w) return; const s=store(); s.weights=s.weights||[]; s.weights.push({d:new Date().toISOString().slice(0,10),w:+w}); saveStore(s); try{firebase.database().ref("platform/progress/"+sid()+"/weights").set(s.weights);}catch(e){} drawWeights();}
function drawWeights(){const s=store(); const el=document.getElementById("wChart"); if(!el) return; const arr=s.weights||[]; el.innerHTML=arr.slice(-8).map(x=>x.d+" → "+x.w+" كجم").join("<br>")||"لسه مفيش وزن متسجل.";}
function savePhotos(){const b=document.getElementById("phBefore").value.trim(); const a=document.getElementById("phAfter").value.trim(); const obj={before:b,after:a,at:Date.now()}; localStorage.setItem("yk_ph_"+sid(),JSON.stringify(obj)); try{firebase.database().ref("platform/progress/"+sid()+"/photos").set(obj);}catch(e){} showPhotos();}
function showPhotos(){const raw=localStorage.getItem("yk_ph_"+sid()); const el=document.getElementById("phBox"); if(!el) return; if(!raw){el.textContent="مفيش صور.";return;} const o=JSON.parse(raw); el.innerHTML=(o.before?"<img src='"+o.before+"' style='width:48%;border-radius:12px'>":"")+(o.after?"<img src='"+o.after+"' style='width:48%;border-radius:12px'>":"");}
function applyDietTpl(d){
  const el=document.getElementById("dietTpl"); if(!el) return;
  el.innerHTML="<b>قوالب الأكل</b><div class='muted'>خفيف / متوسط / عالي — الأدمن يقدر يغيّرهم.</div><pre style='white-space:pre-wrap'>"+(d&&d.dietLight?("خفيف:\n"+d.dietLight+"\n\nمتوسط:\n"+(d.dietMid||"")+"\n\nعالي:\n"+(d.dietHigh||"")):"خفيف: بيض + خضار\nمتوسط: فراخ ورز وسلطة\nعالي: فراخ ورز ومكسرات وزبادي")+"</pre>";
  if(d&&d.foodAlt){const a=document.getElementById("foodAlt"); if(a) a.innerHTML=d.foodAlt.replace(/\n/g,"<br>");}
  if(d&&d.challenge){const c=document.getElementById("chalTxt"); if(c) c.textContent=d.challenge;}
}


function formPts(k){return 4;}
function renderProfile(){
  const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}");
  const s=store();
  const days=Object.keys(s.days||{}).length;
  const pts=s.pts||sub.pts||0;
  const badge=sub.badge||badgeName(days,pts);
  const set=(id,v)=>{const el=document.getElementById(id); if(el) el.textContent=v;};
  set("profName", sub.displayName||sub.name||"-");
  set("profUser", sub.name? String(sub.name) : "");
  set("profMeta", "");
  set("pPts", String(pts));
  set("pStreak", String(days));
  set("pBadge", badge);
  set("pCode", sub.code||"-");
  const dn=document.getElementById("displayName"); if(dn) dn.value=sub.displayName||"";
  const av=document.getElementById("avImg");
  if(av){ av.src=sub.avatar||av.src||""; av.style.display="block"; }
  try{firebase.database().ref("platform/progress/"+sid()).update({pts:pts,days:s.days||{},badge:badge});}catch(e){}
  renderBoard();
}

function toggleEditProf(){const el=document.getElementById("editProf"); if(el) el.classList.toggle("hidden");}
function openAvatar(){const src=(document.getElementById("avImg")||{}).src; const box=document.getElementById("avBig"); const img=document.getElementById("avBigImg"); if(!src||!box) return; if(img) img.src=src; box.classList.remove("hidden"); box.style.display="grid";}
function closeAvatar(){const box=document.getElementById("avBig"); if(box){box.classList.add("hidden"); box.style.display="none";}}
function saveProfile(){
  const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}");
  sub.displayName=(document.getElementById("displayName").value||"").trim()||sub.name; sub.username=((document.getElementById("userName")||{}).value||"").trim();
  const f=document.getElementById("avFile").files[0];
  const finish=function(){sessionStorage.setItem("ykSub",JSON.stringify(sub));
    if(sub.id) firebase.database().ref("platform/subs/"+sub.id).update({displayName:sub.displayName||null,username:sub.username||null,avatar:sub.avatar||null});
    const ed=document.getElementById("editProf"); if(ed) ed.classList.add("hidden"); renderProfile(); greet(); alert("تم حفظ التعديل");};
  if(f){const r=new FileReader(); r.onload=function(){sub.avatar=r.result; finish();}; r.readAsDataURL(f);} else finish();
}
function renderBoard(){
  const me=JSON.parse(sessionStorage.getItem("ykSub")||"{}");
  firebase.database().ref("platform").once("value").then(function(snap){
    const d=snap.val()||{}; let subs=d.subs||[]; if(!Array.isArray(subs)) subs=Object.values(subs);
    const g=(me.gender||"").toLowerCase();
    const prog=d.progress||{};
    const rows=subs.filter(s=>s && (s.gender||"").toLowerCase()===g).map(s=>{
      const pr=prog[s.id]||{}; const days=pr.days?Object.keys(pr.days).length:0;
      return {name:s.displayName||s.name||"-", pts:pr.pts||0, days:days, badge:s.badge||badgeName(days,pr.pts||0), avatar:s.avatar||""};
    }).sort((a,b)=>b.pts-a.pts).slice(0,20);
    const el=document.getElementById("board");
    if(el) el.innerHTML="<table style=\"width:100%;border-collapse:collapse;font-size:.86rem\"><thead><tr><th></th><th>الاسم</th><th>نقاط</th><th>ستريك</th><th>شارة</th></tr></thead><tbody>"+rows.map((r,i)=>"<tr><td>"+(i+1)+"</td><td style=\"display:flex;gap:8px;align-items:center\"><img src=\""+(r.avatar||"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'><rect fill='%23ccc' width='28' height='28'/></svg>")+"\" style=\"width:28px;height:28px;border-radius:50%;object-fit:cover\"> "+r.name+"</td><td>"+r.pts+"</td><td>"+r.days+"</td><td>"+r.badge+"</td></tr>").join("")+"</tbody></table>";
  });
}
function renderShop(){
  const s=store();
  const el=document.getElementById("shopPtsVal"); if(el) el.textContent=s.pts||0;
  const box=document.getElementById("shopBox"); if(!box) return;
  const offers=(window.REMOTE&&window.REMOTE.shopOffers)||[{pts:120,off:10},{pts:200,off:15},{pts:300,off:20},{pts:420,off:25},{pts:560,off:30},{pts:720,off:35},{pts:900,off:40}];
  box.innerHTML=offers.map(o=>"<div class='card pack'><h3>خصم "+o.off+"٪</h3><div class='price'>"+o.pts+" نقطة</div><p class='muted'>خصم على تجديد اشتراكك بعد تأكيد الكابتن.</p><button class='btn' type='button' onclick='redeem("+o.pts+","+o.off+")'>استبدال</button></div>").join("");
}
function redeem(pts,off){
  const s=store();
  if((s.pts||0)<pts) return alert("نقاطك غير كافيه");
  if(!confirm("طلب استبدال "+pts+" نقطة بخصم "+off+"٪؟ الطلب هيروح للكابتن. النقاط تتخصم بعد التأكيد.")) return;
  const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}");
  firebase.database().ref("platform/redeems").push({sid:sid(),id:sid(),name:sub.name,phone:sub.phone,code:sub.code,pts:pts,off:off,at:Date.now(),status:"pending"});
  firebase.database().ref("platform/notifs/"+sid()).push({text:"طلب استبدال "+pts+" نقطة بخصم "+off+"٪ في انتظار تأكيد الكابتن",at:Date.now(),read:false});
  alert("اتبعت طلب الاستبدال للكابتن. بعد التأكيد النقاط هتتخصم.");
}
function applySite(d){
  if(!d) return;
  window.REMOTE=d;
  const set=(id,v)=>{const el=document.getElementById(id); if(el&&v) el.textContent=v;};
  set("welcomeH", d.welcomeH);
  set("welcomeP", d.welcomeP);
  set("homeHint", d.homeHintTxt);
  set("footerNote", d.footerNote);
  set("credit", d.credit);
  set("chatHead", d.chatTitle);
  applyDietTpl(d); weekPlan();
  const pn=document.getElementById("payNums");
  if(pn && d){ pn.textContent="InstaPay: "+(d.instapay||"01062944697")+" · Vodafone Cash: "+(d.vfCash||"01062944697")+" · Orange Cash: "+(d.orCash||"01159010864"); }

  document.querySelectorAll(".brand").forEach(el=>{ if(d.brandName) el.textContent=d.brandName; });
  if(d.imgGym){ const img=document.querySelector("#boyPick img"); if(img) img.src=d.imgGym; }
  if(d.imgHome){ const img=document.querySelector("#girlPick img"); if(img) img.src=d.imgHome; }
}


function sendFollow(){
  const w=document.getElementById("wLog").value;
  const f=document.getElementById("bodyFile").files[0];
  const msg=document.getElementById("followMsg");
  if(!w && !f) return alert("حط الوزن أو الصورة");
  const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}");
  const push=function(photo){
    const item={id:sid(),name:sub.name,phone:sub.phone,code:sub.code,gender:sub.gender,weight:w,photo:photo||"",at:Date.now()};
    firebase.database().ref("platform/follows").push(item);
    firebase.database().ref("platform/progress/"+sid()+"/weights").once("value").then(function(s){
      const arr=s.val()||[]; const list=Array.isArray(arr)?arr:[]; list.push({d:new Date().toISOString().slice(0,10),w:+w}); firebase.database().ref("platform/progress/"+sid()+"/weights").set(list);
    });
    firebase.database().ref("platform/chats/"+sid()+"/messages").push({from:"system",text:"تم إرسال المتابعة للكابتن. استنى الرد هنا.",at:Date.now()});
    document.getElementById("wLog").value=""; document.getElementById("bodyFile").value="";
    if(msg) msg.textContent="تم الإرسال. استنى رد الكابتن في الدردشة.";
    alert("تم الإرسال. استنى رد الكابتن في الدردشة.");
  };
  if(f){const r=new FileReader(); r.onload=function(){push(r.result);}; r.readAsDataURL(f);} else push("");
}

function openNotifs(){
  const box=document.getElementById("notifList"); if(!box) return;
  const cut=Date.now()-3*24*60*60*1000;
  firebase.database().ref("platform/notifs/"+sid()).once("value").then(function(snap){
    let val=snap.val()||{};
    const keep={};
    Object.keys(val).forEach(k=>{ if((val[k].at||0)>=cut) keep[k]=Object.assign({},val[k],{read:true}); });
    firebase.database().ref("platform/notifs/"+sid()).set(keep);
    return keep;
  }).then(function(keep){
    firebase.database().ref("platform/chats/"+sid()+"/messages").limitToLast(20).once("value").then(function(s2){
      const msgs=s2.val()||{};
      const extra=Object.keys(msgs).map(k=>msgs[k]).filter(m=>m.from==="admin" && (m.at||0)>=cut).map(m=>({text:"رسالة من الكابتن: "+(m.text||""),at:m.at}));
      const local=Object.values(keep||{}).concat(extra).sort((a,b)=>(b.at||0)-(a.at||0));
      box.innerHTML=local.map(n=>"<div style=\"padding:10px 0;border-bottom:1px solid var(--line)\"><div>"+(n.text||n.title||"تحديث")+"</div><small class=\"muted\">"+(n.at?new Date(n.at).toLocaleString("ar-EG"):"")+"</small></div>").join("")||"<div class=\"muted\">مفيش إشعارات</div>";
      const n=document.getElementById("bellN"); if(n) n.textContent="";
    });
  });
}
function pushNotif(id,text){ firebase.database().ref("platform/notifs/"+id).push({text:text,at:Date.now(),read:false}); }

function toggleNotif(){
  const box=document.getElementById("notifBox"); if(!box) return;
  box.classList.toggle("hidden");
  listenNotif();
}
function listenNotif(){
  const box=document.getElementById("notifBox"); if(!box) return;
  firebase.database().ref("platform/chats/"+sid()+"/messages").limitToLast(8).on("value",function(snap){
    const val=snap.val()||{};
    const arr=Object.keys(val).map(k=>val[k]).filter(m=>m.from==="admin").sort((a,b)=>(b.at||0)-(a.at||0));
    const n=document.getElementById("bellN"); if(n) n.textContent=arr.length?String(arr.length):"";
    box.innerHTML=arr.map(m=>"<div style='padding:8px 0;border-bottom:1px solid var(--line)'><b>الكابتن</b><div class='muted'>"+ (m.text||"") +"</div></div>").join("")||"<div class='muted'>مفيش رسائل جديدة</div>";
  });
}

if(sessionStorage.getItem("ykAuth")==="1"){const sub=JSON.parse(sessionStorage.getItem("ykSub")||"{}");if(sub&&sub.code) unlock();}
