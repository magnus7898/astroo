/* ============================================================
   matrix_boxes_addon.js — INTERPRETATION BOXES
   ------------------------------------------------------------
   Pairs with matrix_combos.js (MATRIX_DB + lookup()).
   Load order in matrix.html (combos FIRST):
       <script src="matrix_combos.js"></script>
       <script src="matrix_boxes_addon.js"></script>

   Called by calculate():  buildMatrixBoxes(vals, method)
   Called by circle click:  openBoxById(id)

   ── BOX FIELDS ───────────────────────────────────────────────
   id      : matches circle ids in draw() so a click opens the box
   title   : zone name shown in the header
   keys    : circle/value names. 1 name = single number, 3 = combo
   color   : accent dot
   m1only  : true → shown ONLY in method 1 (sexiness)
   display : 'combo' (default, shows n-n-n) | 'sum' (shows r22 of the
             three) | 'one' (shows first number only)
   todo    : true → keys not set yet (define the circles, see chat)

   Article text comes from MATRIX_DB[id] in matrix_combos.js,
   looked up by the actual numbers. Single numbers with no entry
   fall back to the ENERGIES tarot meaning.
   ============================================================ */

const BOXES = [
  /* ───── COMBOS (three numbers) ───── */
  { id:'persona',        title:'პერსონა',                          keys:['L3','L2','L1'],   color:'#a78bfa' },
  { id:'karmic_tail',    title:'კარმული კუდი',                     keys:['B3','B2','B1'],   color:'#8e44ad' },
  { id:'material_karma', title:'მატერიალური კარმა',                keys:['R3','R2','R1'],   color:'#d35400' },
  { id:'sex',            title:'სექსუალურობა',                     keys:['Cv','RC1','RC2'], color:'#d4a017', m1only:true },
  { id:'talent_zone',    title:'ტალანტების ზონა',                  keys:['T3','T2','T1'],   color:'#2471a3', display:'sum' },
  { id:'tl',             title:'ნიჭები კაცი წინაპრების ხაზით',     keys:['TL3','TL2','TL1'], color:'#d28aff' },
  { id:'tr',             title:'ნიჭები ქალი წინაპრების ხაზით',     keys:['TR3','TR2','TR1'], color:'#ff8c8c' },
  { id:'br',             title:'კაცი წინაპრების კარმა',            keys:['BR3','BR2','BR1'], color:'#b06bd0' },
  { id:'bl',             title:'ქალი წინაპრების კარმა',            keys:['BL3','BL2','BL1'], color:'#e06b6b' },
  { id:'love',           title:'პირადი ურთიერთობების ხაზი',       keys:['B1','W1','W2'],   color:'#ff6b8a', flag:true },
  { id:'money',          title:'ფულის ხაზი',                       keys:['R1','W3','S6'],   color:'#7ec850' },
  { id:'heart',          title:'როგორი პარტნიორი შეგვეფერება',     keys:['W1'],             color:'#ff6b8a' },
  { id:'gel',            title:'როგორი სამსახური შეგვეფერება',      keys:['W3'],             color:'#7ec850' },

  /* ───── SINGLE NUMBERS ───── */
  { id:'b3',      title:'მთავარი ცხოვრებისეული გაკვეთილი',             keys:['B3'], color:'#e24b4a' },
  { id:'r3',      title:'მთავარი ცხოვრებისეული მატერიალური გაკვეთილი', keys:['R3'], color:'#e24b4a' },
  { id:'b1',      title:'როგორ შევდივართ ურთიერთობებში',               keys:['B1'], color:'#ef9f27' },
  { id:'r1',      title:'რა თვისებები გვჭირდება სამუშაო პროცესში',      keys:['R1'], color:'#ef9f27' },
  { id:'comfort', title:'კომფორტის ზონა',                              keys:['Cv'], color:'#ffd700' },
  { id:'g1',      title:'ფიზიკური სურვილები',                          keys:['G1'], color:'#639922' },
  { id:'g2',      title:'სოციალური სურვილები',                         keys:['G2'], color:'#639922' },
  { id:'l1',      title:'მშობელი-შვილის ურთიერთობა',                   keys:['L1'], color:'#4a8cc8' },
  { id:'t1',      title:'ნიჭები, კომუნიკაცია',                         keys:['T1'], color:'#4a8cc8' },
  { id:'l2',      title:'ბავშვობის ტრამვები, ხედვა',                   keys:['L2'], color:'#2060a8' },
  { id:'t2',      title:'მენტალური უნარები',                           keys:['T2'], color:'#2060a8' },
  { id:'l3',      title:'სავიზიტო ბარათი, უმაღლესი მე',                keys:['L3'], color:'#7f77dd' },
  { id:'t3',      title:'შთაგონება',                                   keys:['T3'], color:'#7f77dd' },

  /* ───── CHAKRA EMOTIONS (ემოცია column) ───── */
  { id:'emo_crown',    title:'გვირგვინოვანი ჩაკრა — ემოცია', keys:['S1'], color:'#7e57c2' },
  { id:'emo_thirdeye', title:'მესამე თვალის ჩაკრა — ემოცია', keys:['S2'], color:'#5c9bd6' },
  { id:'emo_throat',   title:'ხორხის ჩაკრა — ემოცია',        keys:['S3'], color:'#b5d4f4' },
  { id:'emo_heart',    title:'გულის ჩაკრა — ემოცია',         keys:['S4'], color:'#66bb6a' },
  { id:'emo_solar',    title:'მზის წნულის ჩაკრა — ემოცია',   keys:['S5'], color:'#ffd700' },
  { id:'emo_sacral',   title:'საკრალური ჩაკრა — ემოცია',     keys:['S6'], color:'#ef9f27' },
  { id:'emo_root',     title:'ფუძის ჩაკრა — ემოცია',         keys:['S7'], color:'#dc4646' },
];

function buildMatrixBoxes(v, method){
  const panel=document.getElementById('matrix-boxes');
  if(!panel) return;
  const R=(typeof r22==='function')?r22:(n=>n);

  // chakra emotion values (same formulas as the table's ემოცია column)
  const S={
    S1:R(v.T3+v.L3), S2:R(v.T2+v.L2), S3:R(v.T1+v.L1),
    S4:R(v.G2+v.G1), S5:R(v.Cv+v.Cv), S6:R(v.B1+v.R1), S7:R(v.B3+v.R3)
  };
  const VAL=Object.assign({},v,S);

  panel.innerHTML='';
  panel.style.display='flex';

  for(const box of BOXES){
    if(box.m1only && method!==1) continue;                 // sexiness: method 1 only

    const nums=(box.keys||[]).map(k=>VAL[k]).filter(n=>n!==undefined);
    const hasNums=nums.length>0;

    // header number(s)
    let headNums='—';
    if(hasNums){
      if(box.display==='sum')      headNums=String(R(nums.reduce((a,b)=>a+b,0)));
      else if(box.display==='one') headNums=String(nums[0]);
      else                         headNums=nums.join('-');
    }

    // article: MATRIX_DB first, then ENERGIES fallback for singles
    let art=null;
    if(hasNums && typeof lookup==='function') art=lookup(box.id,nums);
    if(!art && nums.length===1 && typeof getE==='function'){
      const e=getE(nums[0]); art={title:e.name, text:e.desc};
    }
    const subtitle=art&&art.title?art.title:'';
    const body=art&&art.text?art.text
              :(box.todo?'⚠ ამ ბოქსს წრეები ჯერ არ აქვს მითითებული (keys)':'სტატია ჯერ არ არის დამატებული');

    const wrap=document.createElement('div');
    wrap.className='mx-box'; wrap.id='mxbox-'+box.id;

    const head=document.createElement('div'); head.className='mx-box-head';
    head.innerHTML='<span><span class="mx-dot" style="background:'+box.color+'"></span>'+box.title+'</span>'+
                   '<span class="mx-key">'+headNums+'<span class="mx-arrow">▼</span></span>';

    const bod=document.createElement('div'); bod.className='mx-box-body'; bod.style.display='none';
    bod.innerHTML=(subtitle?'<div style="font-weight:600;color:#e8dcff;margin-bottom:6px">'+subtitle+'</div>':'')+body;

    head.addEventListener('click',()=>{ bod.style.display=(bod.style.display==='block')?'none':'block'; });

    wrap.appendChild(head); wrap.appendChild(bod);
    panel.appendChild(wrap);
  }
}

function openBoxById(id){
  const el=document.getElementById('mxbox-'+id);
  if(!el) return;
  const bod=el.querySelector('.mx-box-body');
  if(bod) bod.style.display='block';
  el.scrollIntoView({behavior:'smooth',block:'center'});
}

window.buildMatrixBoxes=buildMatrixBoxes;
window.openBoxById=openBoxById;
