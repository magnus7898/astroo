/* ═══════════════════════════════════════════════════════════════════
   futurelife.js — MAGNUS · მომავალი სიცოცხლე  (v2 — reverse method)
   Method (mirror of past-life):
     past:   natal DRACONIC Pluto → when REAL Pluto was there (past)
     future: REAL Pluto now → when future DRACONIC Pluto (Pluto−Node
             at T) reaches that degree → epoch → cast future natal.
   Self-injecting; zero edits to astro.html besides the script tag.
   Uses globals: getPersonData, fetchChart, fetchPlutoAt, showError,
   showSingleChart, showDoubleChart, calcCrossAspects, calcDraconicChart,
   searchCity, ZSYM, SIGN_KA.
   ═══════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

const SCAN_YEARS=120;   // horizon; draconic-Pluto cycle ≈ 17.3y → ~7 epochs
const MAX_EPOCHS=8;

/* mean lunar node (Rahu), tropical, degrees */
function meanNode(y,m){
  const t=Date.UTC(y,(m||6)-1,15,12,0,0);
  const d=(t-Date.UTC(2000,0,1,12))/86400000;
  return (((125.0445479-0.0529537648*d)%360)+360)%360;
}
const norm=x=>((x%360)+360)%360;

/* ── UI injection ── */
function injectTab(){
  const bar=document.querySelector('.tab-bar');
  if(!bar||document.getElementById('fl-tab-btn'))return;
  const btn=document.createElement('button');
  btn.className='tab-btn';btn.id='fl-tab-btn';
  btn.textContent='მომავალი სიცოცხლე';
  btn.onclick=activate;
  const past=[...bar.querySelectorAll('.tab-btn')].find(b=>b.textContent.includes('წარსული'));
  if(past&&past.nextSibling)bar.insertBefore(btn,past.nextSibling);else bar.appendChild(btn);
}
function injectForm(){
  const card=document.querySelector('.form-card');
  if(!card||document.getElementById('form-futurelife'))return;
  const div=document.createElement('div');
  div.id='form-futurelife';div.className='form-section';
  div.innerHTML=`
    <div class="person-label">🐉 მომავალი ინკარნაცია</div>
    <div class="field wide" style="margin-bottom:10px">
      <label>სახელი</label><input id="fl-name" placeholder="სახელი">
    </div>
    <div class="form-grid">
      <div class="field"><label>დღე</label><input type="number" id="fl-day" value="1" min="1" max="31"></div>
      <div class="field"><label>თვე</label><input type="number" id="fl-month" value="1" min="1" max="12"></div>
      <div class="field"><label>წელი</label><input type="number" id="fl-year" value="1990"></div>
    </div>
    <div class="form-grid">
      <div class="field"><label>საათი</label><input type="number" id="fl-hour" value="12" min="0" max="23"></div>
      <div class="field"><label>წუთი</label><input type="number" id="fl-minute" value="0" min="0" max="59"></div>
      <div class="field"><label>წამი</label><input type="number" id="fl-second" value="0" min="0" max="59"></div>
    </div>
    <div class="field" style="margin-bottom:8px">
      <label>ქალაქი</label>
      <input id="fl-city" placeholder="ქალაქი" oninput="searchCity('fl')">
      <div class="city-hint" id="fl-city-hint"></div>
    </div>
    <div class="form-grid-2" style="margin-bottom:4px">
      <div class="field"><label>განედი</label><input type="number" id="fl-lat" step="0.0001" readonly></div>
      <div class="field"><label>გრძედი</label><input type="number" id="fl-lon" step="0.0001" readonly></div>
    </div>
    <input type="hidden" id="fl-tz" value="UTC">
    <div class="tz-display" id="fl-tz-display">—</div>
    <p style="font-size:10px;color:rgba(150,120,220,.6);margin:8px 0;font-style:italic">
      ♇ ნატალური პლუტო = მომავალი სიცოცხლის დრაკონული პლუტო ·
      ეპოქა, როცა (♇−☊) ამ გრადუსს მიაღწევს → მომავალი ნატალური რუქა</p>
    <button class="gen-btn" id="fl-gen-btn" style="margin-top:6px">🐉 მომავალი ინკარნაციების ძებნა</button>`;
  card.appendChild(div);
  document.getElementById('fl-gen-btn').onclick=run;
}
function activate(){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('fl-tab-btn').classList.add('active');
  document.querySelectorAll('.form-section').forEach(s=>s.classList.remove('active'));
  document.getElementById('form-futurelife').classList.add('active');
  const ca=document.getElementById('chart-area');if(ca)ca.style.display='none';
  const acg=document.getElementById('acg-section');if(acg)acg.style.display='none';
  try{currentMode='futurelife';}catch(e){}
}

/* ── main ── */
async function run(){
  const btn=document.getElementById('fl-gen-btn');
  btn.disabled=true;btn.textContent='⏳ იტვირთება...';
  try{
    const p=getPersonData('fl');
    if(!p.lat||!p.lon){showError('შეიყვანეთ ქალაქი');return;}
    // natal (for comparison charts)
    const natal=await fetchChart(p);natal._timeUnknown=false;
    window._plNatal=natal;
    // target = REAL Pluto NOW
// target = THIS LIFE'S NATAL Pluto (its degree = future life's draconic Pluto)
    const plutoNow=natal.planets['პლუტონი']?.degree;
    if(plutoNow==null){showError('ნატალური პლუტო ვერ მოიძებნა');return;}
    const si=Math.floor(plutoNow/30)%12;
    const dg=Math.floor(plutoNow%30),mn=Math.floor((plutoNow%1)*60);
    // layout
    const ca=document.getElementById('chart-area');
    ca.style.display='block';
    const af=document.getElementById('asp-filters');if(af)af.style.display='none';
    document.getElementById('mode-label').textContent='🐉 მომავალი ინკარნაციები...';
    document.getElementById('legend-wrap').style.display='none';
    document.getElementById('planet-b-wrap').style.display='none';
    document.getElementById('wheel-wrap').style.display='none';
    const acg=document.getElementById('acg-section');if(acg)acg.style.display='none';
    let wrap=document.getElementById('future-life-wrap');
    if(!wrap){
      wrap=document.createElement('div');wrap.id='future-life-wrap';
      wrap.style.cssText='margin:12px 0;padding:14px 18px;background:rgba(8,6,20,.8);border:1px solid rgba(180,140,40,.4);border-radius:12px;';
      ca.appendChild(wrap);
    }
    wrap.innerHTML=`<div style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:rgba(240,208,128,.8);margin-bottom:8px">🐉 მომავალი ინკარნაციები</div>
      <div style="font-size:12px;color:#c8b8f0;margin-bottom:4px">ნატალური პლუტო (= მომავალი სიცოცხლის დრაკონული პლუტო):
        <strong style="color:#f0c96b">${ZSYM[si]} ${dg}°${String(mn).padStart(2,'0')}' ${SIGN_KA[si]}</strong></div>
      <div style="font-size:10px;color:rgba(155,168,184,.55);margin-bottom:10px">ეძებს მომენტებს, როცა (♇ − ☊) ზუსტად ამ გრადუსზეა — მომდევნო ${SCAN_YEARS} წელი</div>
      <div id="fl-result"></div>`;
    ca.scrollIntoView({behavior:'smooth',block:'start'});
    await scan(plutoNow,document.getElementById('fl-result'),p);
  }catch(e){showError(e.message);console.error(e);}
  finally{btn.disabled=false;btn.textContent='🐉 მომავალი ინკარნაციების ძებნა';}
}

/* draconic Pluto at (year,month): real Pluto − mean node */
async function dracoPlutoAt(y,m){
  const pl=await fetchPlutoAt(y,m);
  if(pl==null)return null;
  return norm(pl-meanNode(y,m));
}

/* ── forward scan: (Pluto−Node)(T) crossing target ── */
async function scan(targetDeg,resultEl,p){
  const si=Math.floor(targetDeg/30)%12;
  const deg=Math.floor(targetDeg%30),mn=Math.floor((targetDeg%1)*60);
  const targetLabel=`${ZSYM[si]} ${deg}°${String(mn).padStart(2,'0')}' ${SIGN_KA[si]}`;
  const startY=new Date().getFullYear(),endY=startY+SCAN_YEARS;
  resultEl.innerHTML='<span style="color:#a78bfa">🔍 სკანირება '+startY+'–'+endY+'...</span>';
  // coarse: yearly samples (draconic Pluto advances ~+20.8°/year)
  const years=[];for(let y=startY;y<=endY;y++)years.push(y);
  const dps=[];
  for(let i=0;i<years.length;i+=25){
    const chunk=years.slice(i,i+25);
    const vals=await Promise.all(chunk.map(y=>dracoPlutoAt(y,6)));
    dps.push(...vals);
    resultEl.innerHTML='<span style="color:#a78bfa">🔍 სკანირება... '+Math.min(i+25,years.length)+'/'+years.length+' წელი</span>';
  }
  // find forward crossings (mod-safe, same pattern as past-life scanner)
  const brackets=[];
  for(let i=0;i<dps.length-1;i++){
    const d1=dps[i],d2=dps[i+1];
    if(d1==null||d2==null)continue;
    const motion=norm(d2-d1);
    if(motion>60)continue;                 // guard against bad samples
    const toTarget=norm(targetDeg-d1);
    if(toTarget<=motion)brackets.push(years[i]);
    if(brackets.length>=MAX_EPOCHS)break;
  }
  if(!brackets.length){resultEl.textContent='⚠️ '+endY+' წლამდე გადაკვეთა ვერ მოიძებნა';return;}
  // refine each bracket to month
  const MONTHS=['იანვ','თებ','მარ','აპრ','მაის','ივნ','ივლ','აგვ','სექ','ოქტ','ნოემ','დეკ'];
  const found=[];
  for(const y0 of brackets){
    resultEl.innerHTML='<span style="color:#a78bfa">🔍 დაზუსტება '+y0+'–'+(y0+1)+'... ('+(found.length+1)+'/'+brackets.length+')</span>';
    let best=null;
    for(const yy of[y0,y0+1]){
      const mvals=await Promise.all([1,2,3,4,5,6,7,8,9,10,11,12].map(m=>dracoPlutoAt(yy,m)));
      for(let m=0;m<12;m++){
        if(mvals[m]==null)continue;
        const orb=Math.min(norm(mvals[m]-targetDeg),norm(targetDeg-mvals[m]));
        if(!best||orb<best.orb)best={year:yy,month:m+1,orb};
      }
    }
    if(best)found.push(best);
  }
  // dedupe adjacent (bracket pairs can converge on same month)
  const uniq=[];
  for(const f of found)
    if(!uniq.some(u=>Math.abs((u.year*12+u.month)-(f.year*12+f.month))<=13))uniq.push(f);
  const nowY=new Date().getFullYear();
  resultEl.innerHTML=uniq.map((f,i)=>`
    <div style="padding:8px;margin-bottom:6px;background:rgba(120,80,20,.25);border-radius:8px;border-left:3px solid #f0c96b;font-size:11px;color:#e8dcc0;line-height:1.8">
      🐉 <strong>მომავალი ინკარნაცია ${i+1}</strong> · დრაკ. ♇ <span style="color:#f0c96b">${targetLabel}</span>–ზე:<br>
      <span style="font-size:14px;color:#f9c646;font-family:Cinzel,serif">${MONTHS[f.month-1]}. ${f.year}</span>
      <span style="font-size:10px;color:rgba(200,180,140,.6)"> · ±${Math.round(f.orb*10)/10}° · ${f.year-nowY} წელიწადში</span>
      <button data-y="${f.year}" data-m="${f.month}" class="fl-chart-btn"
        style="background:none;border:1px solid rgba(240,201,107,.5);color:#f0c96b;border-radius:6px;padding:1px 9px;font-size:10px;cursor:pointer;font-family:inherit;margin-left:8px">📜 ნატალური რუქა</button>
    </div>`).join('')+
    `<div style="font-size:9px;color:rgba(155,168,184,.45);margin-top:4px;letter-spacing:1px">ციკლი ≈ 17.3 წელი (♇−☊ სრული ბრუნი) · MAGNUS-ის საკუთარი უკუმეთოდი წარსული ინკარნაციისა</div>`;
  resultEl.querySelectorAll('.fl-chart-btn').forEach(b=>{
    b.onclick=()=>showFuture(+b.dataset.y,+b.dataset.m,p);
  });
}

/* ── cast the future natal chart, compare vs current natal ── */
async function showFuture(year,month,p){
  try{
    const fut=await fetchChart({year,month,day:15,hour:12,minute:0,second:0,lat:p.lat,lon:p.lon,tz_name:p.tz_name});
    fut._timeUnknown=false;
    const name=document.getElementById('fl-name').value||'';
    if(window._plNatal){
      const cross=calcCrossAspects(window._plNatal.planets,fut.planets);
      showDoubleChart(window._plNatal,fut,'ნატალი',''+year,'🐉 '+name+' — მომავალი ნატალი '+year,cross);
    }else{
      showSingleChart(fut,'🐉 '+name+' — მომავალი ნატალი '+year,false);
    }
    const wrap=document.getElementById('future-life-wrap');
    const ca=document.getElementById('chart-area');
    if(wrap&&ca&&wrap.parentNode===ca)ca.appendChild(wrap);
  }catch(e){showError(e.message);}
}

/* ── init ── */
function init(){injectTab();injectForm();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
