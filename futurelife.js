/* ═══════════════════════════════════════════════════════════════════
   futurelife.js — MAGNUS · მომავალი სიცოცხლე  (v3 — final method)
   Symmetric reverse of past-life:
     past:   real Pluto(T) = natalPluto − natalNode  (≈250y backward)
     future: real Pluto(T) = natalPluto + natalNode  (≈250y forward)
   At T, rotating the future chart onto THIS dragon axis (−natalNode)
   puts its Pluto exactly on the current natal Pluto. Then T's chart
   becomes the future natal.
   One-line include in astro.html; zero other edits.
   ═══════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
const SPAN_YEARS=1000, MAX_EPOCHS=6;
const norm=x=>((x%360)+360)%360;
const fmtL=L=>{L=norm(L);const s=Math.floor(L/30),d=L%30;
  return Math.floor(d)+'°'+String(Math.floor((d%1)*60)).padStart(2,'0')+"' "+SIGN_KA[s];};

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
      🐉 მომავალი დრაკონული ♇ = ნატალური ♇ · რეალური პლუტო მიზნის გრადუსზე ≈ ყოველ 250 წელიწადში</p>
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
let _flNatalNode=null;
async function run(){
  const btn=document.getElementById('fl-gen-btn');
  btn.disabled=true;btn.textContent='⏳ იტვირთება...';
  try{
    const p=getPersonData('fl');
    if(!p.lat||!p.lon){showError('შეიყვანეთ ქალაქი');return;}
    const natal=await fetchChart(p);natal._timeUnknown=false;
    window._plNatal=natal;
    const natalPluto=natal.planets['პლუტონი']?.degree;
    const natalNode=natal.planets['ჩრდ. კვანძი']?.degree;
    if(natalPluto==null||natalNode==null){showError('ნატალური პლუტო/კვანძი ვერ მოიძებნა');return;}
    _flNatalNode=natalNode;
    // TARGET: real Pluto must reach natalPluto + natalNode
    // (then future chart rotated by −natalNode puts its Pluto on natal Pluto)
    const targetDeg=norm(natalPluto+natalNode);
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
    wrap.innerHTML=`<div style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:rgba(240,208,128,.8);margin-bottom:8px">🐉 მომავალი ინკარნაციები — ${SPAN_YEARS} წელი</div>
      <div style="font-size:12px;color:#c8b8f0;margin-bottom:4px">ნატალური ♇ <strong style="color:#c050a0">${fmtL(natalPluto)}</strong>
        · ☊ <strong style="color:#60c060">${fmtL(natalNode)}</strong>
        → სამიზნე: <strong style="color:#f0c96b">${fmtL(targetDeg)}</strong></div>
      <div style="font-size:10px;color:rgba(155,168,184,.55);margin-bottom:10px">როცა რეალური ♇ ამ გრადუსზეა, მომავალი დრაკონული ♇ = ნატალური ♇</div>
      <div id="fl-result"></div>`;
    ca.scrollIntoView({behavior:'smooth',block:'start'});
    await scan(targetDeg,natalPluto,document.getElementById('fl-result'),p);
  }catch(e){showError(e.message);console.error(e);}
  finally{btn.disabled=false;btn.textContent='🐉 მომავალი ინკარნაციების ძებნა';}
}

/* ── forward scan of REAL Pluto over fixed target (mirror of findPastLifeDate) ── */
async function scan(targetDeg,natalPluto,resultEl,p){
  const startY=new Date().getFullYear()+1,endY=startY+SPAN_YEARS;
  resultEl.innerHTML='<span style="color:#a78bfa">🔍 სკანირება '+startY+'–'+endY+'...</span>';
  const years=[];for(let y=startY;y<=endY;y+=5)years.push(y);
  const degs=[];
  for(let i=0;i<years.length;i+=25){
    const chunk=years.slice(i,i+25);
    degs.push(...await Promise.all(chunk.map(y=>fetchPlutoAt(y))));
    resultEl.innerHTML='<span style="color:#a78bfa">🔍 სკანირება... '+Math.min(i+25,years.length)+'/'+years.length+'</span>';
  }
  const brackets=[];
  for(let i=0;i<degs.length-1;i++){
    const d1=degs[i],d2=degs[i+1];
    if(d1==null||d2==null)continue;
    const motion=norm(d2-d1);
    if(motion>60)continue;
    const toTarget=norm(targetDeg-d1);
    if(toTarget<=motion)brackets.push([years[i],years[i+1]]);
    if(brackets.length>=MAX_EPOCHS)break;
  }
  if(!brackets.length){resultEl.textContent='⚠️ '+endY+' წლამდე გავლა ვერ მოიძებნა';return;}
  const MONTHS=['იანვ','თებ','მარ','აპრ','მაის','ივნ','ივლ','აგვ','სექ','ოქტ','ნოემ','დეკ'];
  const found=[];
  for(const br of brackets){
    resultEl.innerHTML='<span style="color:#a78bfa">🔍 დაზუსტება '+br[0]+'–'+br[1]+'... ('+(found.length+1)+'/'+brackets.length+')</span>';
    const yr0=br[0]-1,yr1=br[1]+1,yearRange=[];
    for(let y=yr0;y<=yr1;y++)yearRange.push(y);
    const yearDegs=await Promise.all(yearRange.map(y=>fetchPlutoAt(y)));
    let bestYear=yr0,bestOrb=999;
    for(let i=0;i<yearDegs.length;i++){
      if(yearDegs[i]==null)continue;
      const orb=Math.min(norm(yearDegs[i]-targetDeg),norm(targetDeg-yearDegs[i]));
      if(orb<bestOrb){bestOrb=orb;bestYear=yearRange[i];}
    }
    const monthDegs=await Promise.all([1,2,3,4,5,6,7,8,9,10,11,12].map(m=>fetchPlutoAt(bestYear,m)));
    let bestMonth=6,bestMOrb=999;
    for(let m=0;m<12;m++){
      if(monthDegs[m]==null)continue;
      const orb=Math.min(norm(monthDegs[m]-targetDeg),norm(targetDeg-monthDegs[m]));
      if(orb<bestMOrb){bestMOrb=orb;bestMonth=m+1;}
    }
    found.push({year:bestYear,month:bestMonth,orb:bestMOrb});
  }
  const nowY=new Date().getFullYear();
  resultEl.innerHTML=found.map((f,i)=>`
    <div style="padding:8px;margin-bottom:6px;background:rgba(120,80,20,.25);border-radius:8px;border-left:3px solid #f0c96b;font-size:11px;color:#e8dcc0;line-height:1.8">
      🐉 <strong>მომავალი ინკარნაცია ${i+1}</strong> · რეალური ♇ სამიზნეზე:<br>
      <span style="font-size:14px;color:#f9c646;font-family:Cinzel,serif">${MONTHS[f.month-1]}. ${f.year}</span>
      <span style="font-size:10px;color:rgba(200,180,140,.6)"> · ±${Math.round(f.orb*10)/10}° · ${f.year-nowY} წელიწადში</span>
      <button data-y="${f.year}" data-m="${f.month}" class="fl-chart-btn"
        style="background:none;border:1px solid rgba(240,201,107,.5);color:#f0c96b;border-radius:6px;padding:1px 9px;font-size:10px;cursor:pointer;font-family:inherit;margin-left:8px">📜 რუქა</button>
    </div>`).join('');
  resultEl.querySelectorAll('.fl-chart-btn').forEach(b=>{
    b.onclick=()=>showFuture(+b.dataset.y,+b.dataset.m,p);
  });
}

/* ── future moment: dragon chart (on THIS dragon axis) → future natal ── */
async function showFuture(year,month,p){
  try{
    const fut=await fetchChart({year,month,day:15,hour:12,minute:0,second:0,lat:p.lat,lon:p.lon,tz_name:p.tz_name});
    fut._timeUnknown=false;
    const name=document.getElementById('fl-name').value||'';
    // rotate the future chart onto the CURRENT dragon axis (−natal node)
    const nn=_flNatalNode||0;
    const shift=d=>norm(d-nn);
    const drago={...fut,planets:{},aspects:[]};
    for(const[nm,pl]of Object.entries(fut.planets)){
      const nd=shift(pl.degree);
      drago.planets[nm]={...pl,degree:nd,sign:SIGN_KA[Math.floor(nd/30)%12]};
    }
    if(fut.asc!=null)drago.asc=shift(fut.asc);
    if(fut.mc!=null)drago.mc=shift(fut.mc);
    if(fut.houses)drago.houses=fut.houses.map(shift);
    drago._timeUnknown=false;
    // verification: dragon Pluto vs natal Pluto
    const dpl=drago.planets['პლუტონი']?.degree;
    const npl=window._plNatal?.planets['პლუტონი']?.degree;
    let verify='';
    if(dpl!=null&&npl!=null){
      const orb=Math.min(norm(dpl-npl),norm(npl-dpl));
      verify=' · 🐉♇ '+fmtL(dpl)+' ≈ ნატ.♇ '+fmtL(npl)+' (±'+orb.toFixed(2)+'°)';
    }
    showSingleChart(drago,'🐉 '+name+' — მომავალი დრაკონული '+year+verify,false);
    // flip button → future natal vs current natal
    const ml=document.getElementById('mode-label');
    const old=document.getElementById('fl-flip-btn');if(old)old.remove();
    if(ml){
      const b=document.createElement('button');
      b.id='fl-flip-btn';b.textContent='→ მომავალი ნატალური რუქა';
      b.style.cssText='display:block;margin:8px auto;background:linear-gradient(90deg,#8a6a20,#c9a84c);border:none;color:#0a0810;padding:7px 18px;border-radius:8px;cursor:pointer;font-family:Cinzel,serif;font-size:11px;letter-spacing:2px';
      ml.after(b);
      b.onclick=()=>{
        b.remove();
        if(window._plNatal){
          const cross=calcCrossAspects(window._plNatal.planets,fut.planets);
          showDoubleChart(window._plNatal,fut,'ნატალი',''+year,'🐉 '+name+' — მომავალი ნატალი '+year,cross);
        }else showSingleChart(fut,'🐉 '+name+' — მომავალი ნატალი '+year,false);
        const wrap=document.getElementById('future-life-wrap');
        const ca=document.getElementById('chart-area');
        if(wrap&&ca)ca.appendChild(wrap);
      };
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
