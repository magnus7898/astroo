/* ════════════════════════════════════════════════════════════════════
   MATRIX INTERPRETATION BOXES
   Each box: closed on generate, click header (or its circle) to open,
   click again to close. Article keys:
     - single circle  → "N"            (one arcana number)
     - combo of 3      → "A-B-C"       (outer-mid-inner)
     - combo of 2      → "A-B"
   Fill the empty article:"" strings with your text (HTML allowed).
   ════════════════════════════════════════════════════════════════════ */

/* ---- 1. BOX DEFINITIONS (order = display order under the diagram) ---- */
const MATRIX_BOXES = [
  // id            title (Georgian)                                  type      keys (which v.* circles)         color
  { id:'comfort', title:'კომფორტის ზონა',                            kind:'single', keys:['Cv'],               color:'#d4a017' },
  { id:'sex', title:'სექსუალურობა', kind:'combo', keys:['Cv','T1','B1'], color:'#d4a017' },
  { id:'l3',   title:'სავიზიტო ბარათი',                              kind:'single', keys:['L3'],               color:'#7F77DD' },
  { id:'persona', title:'პერსონა',                                  kind:'combo',  keys:['L3','L2','L1'],     color:'#7F77DD' },
  { id:'t3',   title:'ტალანტები',                                    kind:'single', keys:['T3'],               color:'#7F77DD' },
  { id:'r3',   title:'მატერიალური კარმა',                            kind:'combo',  keys:['R3','R2','R1'],     color:'#E24B4A' },
  { id:'b3',   title:'კარმული კუდი',                                 kind:'combo',  keys:['B3','B2','B1'],     color:'#E24B4A' },
  { id:'l2',   title:'ბავშვობის ტრამვები და როგორ ვხედავთ სამყაროს', kind:'single', keys:['L2'],               color:'#2060a8' },
  { id:'t2',   title:'ჩვენი უნიკალური ხედვა · ნიჭი',                 kind:'single', keys:['T2'],               color:'#2060a8' },
  { id:'l1',   title:'მშობლებისა და შვილების ურთიერთობა, კომუნიკაცია', kind:'single', keys:['L1'],             color:'#4a8cc8' },
  { id:'t1',   title:'გადმოცემის ნიჭი',                              kind:'single', keys:['T1'],               color:'#4a8cc8' },
  { id:'g1',   title:'ჩვენი ფიზიკური სურვილები',                     kind:'single', keys:['G1'],               color:'#639922' },
  { id:'g2',   title:'ჩვენი სოციალური სურვილები',                    kind:'single', keys:['G2'],               color:'#639922' },
  { id:'b1',   title:'როგორ შევდივართ ურთიერთობაში',                 kind:'single', keys:['B1'],               color:'#EF9F27' },
  { id:'r1',   title:'როგორი სტილის სამუშაო გარემო გვჭირდება',       kind:'single', keys:['R1'],               color:'#EF9F27' },
  { id:'love', title:'პირადი ურთიერთობების ხაზი',                    kind:'combo',  keys:['B1','W1','W2'],     color:'#ff6b8a' },
  { id:'money',title:'ფულის ხაზი',                                   kind:'combo',  keys:['R1','W3','W2'],     color:'#7ec850' },
  { id:'tl',   title:'ნიჭები — კაცი წინაპრების ხაზიდან',             kind:'combo',  keys:['TL3','TL2','TL1'],  color:'#a06cff' },
  { id:'tr',   title:'ნიჭები — ქალი წინაპრების ხაზიდან',             kind:'combo',  keys:['TR3','TR2','TR1'],  color:'#ff8cc0' },
  { id:'br',   title:'კაცი წინაპრების კარმა',                        kind:'combo',  keys:['BR3','BR2','BR1'],  color:'#a06cff' },
  { id:'bl',   title:'ქალი წინაპრების კარმა',                        kind:'combo',  keys:['BL3','BL2','BL1'],  color:'#ff8cc0' },
  { id:'health', title:'ჯანმრთელობა',                               kind:'chakra', keys:[],                   color:'#7e57c2' },
];

/* ---- 2. ARTICLES — fill these in. Keys are arcana numbers (joined for combos). ---- */
/*    single circle: "N"   |   3-combo: "A-B-C"   |   2-combo: "A-B"                  */
const MATRIX_ARTICLES = {

  // ── Cv · კომფორტის ზონა (yellow center, single number 1–22) ──
  comfort: {
    // "1":"...", ... "22"
  },

  // ── Cv · სექსუალურობა (three center circles, method 1 only) ──
  sex: {
    // "1":"...", ... "22"
  },

  // ── L3 · სავიზიტო ბარათი (single) ──
  l3: {
    // "1":"...", ... "22"
  },

  // ── L3-L2-L1 · პერსონა (combo) ──
  persona: {
    // "3-7-12":"...", etc.
  },

  // ── T3 · ტალანტები (single) ──
  t3: {
    // "1":"...", ... "22"
  },

  // ── R3-R2-R1 · მატერიალური კარმა (combo) ──
  r3: {
    // "8-5-15":"...", etc.
  },

  // ── B3-B2-B1 · კარმული კუდი (your 26 combos) ──
  b3: {
    "10-13-3":"",  "10-4-21":"",  "19-22-3":"",  "11-8-15":"",  "11-17-6":"",
    "20-8-6":"",   "3-12-9":"",   "12-3-18":"",  "21-3-9":"",   "4-16-12":"",
    "13-7-21":"",  "22-7-3":"",   "5-20-15":"",  "14-20-6":"",  "6-6-18":"",
    "6-15-9":"",   "15-6-18":"",  "7-10-21":"",  "7-19-12":"",  "16-10-21":"",
    "8-5-15":"",   "8-14-6":"",   "17-5-6":"",   "9-9-18":"",   "9-18-9":"",  "18-9-9":"",
  },

  l2: {}, t2: {}, l1: {}, t1: {}, g1: {}, g2: {}, b1: {}, r1: {},
  love: {}, money: {}, tl: {}, tr: {}, br: {}, bl: {},
};

/* Titles per combo (optional override). If a combo has a named meaning by its
   numbers you can show it; otherwise the box title is used. */

/* ---- 3. BUILD the boxes (called from calculate(), after draw) ---- */
let _MATRIX_V = null;   // holds the last computed values
function buildMatrixBoxes(v, method){
  _MATRIX_V = v;
  method = method || 1;
  const wrap = document.getElementById('matrix-boxes');
  if(!wrap) return;
  wrap.innerHTML = '';
  wrap.style.display = 'flex';

  for(const box of MATRIX_BOXES){
    // სექსუალურობა only exists as separate box in method 1; methods 2-4 only have კომფორტის ზონა
    if(box.id==='sex' && method!==1) continue;
    // compute the key + label for this box
    let key, label;
    if(box.kind === 'chakra'){
      key = '_chakra'; label = '';
    } else {
      const nums = box.keys.map(k => v[k]).filter(n => n != null);
      if(nums.length !== box.keys.length) continue;   // skip if a value missing (e.g. RC hidden)
      key = nums.join('-');
      label = nums.join('–');
    }

    const el = document.createElement('div');
    el.className = 'mx-box';
    el.dataset.boxid = box.id;
    el.dataset.key = key;
    el.style.borderColor = box.color + '88';
    el.innerHTML = `
      <div class="mx-box-head" style="background:${box.color}22;">
        <span><span class="mx-dot" style="background:${box.color}"></span>${box.title}</span>
        <span class="mx-key">${label ? label : ''} <span class="mx-arrow">▼</span></span>
      </div>
      <div class="mx-box-body" style="display:none;"></div>`;
    el.querySelector('.mx-box-head').addEventListener('click', ()=>toggleMatrixBox(box.id));
    wrap.appendChild(el);
  }
}

function fillBoxBody(box, key, bodyEl){
  if(box.kind === 'chakra'){
    bodyEl.innerHTML = renderChakraHealth();
    return;
  }
  const articles = MATRIX_ARTICLES[box.id] || {};
  const txt = articles[key];
  if(txt && txt.trim()){
    bodyEl.innerHTML = txt;
  }else{
    bodyEl.innerHTML = `<div style="color:rgba(180,160,220,0.5);font-style:italic;">
        სტატია ჯერ არ არის შევსებული — კომბინაცია: <b style="color:${box.color}">${key}</b>
      </div>`;
  }
}

function toggleMatrixBox(id){
  const el = document.querySelector(`.mx-box[data-boxid="${id}"]`);
  if(!el) return;
  const body  = el.querySelector('.mx-box-body');
  const arrow = el.querySelector('.mx-arrow');
  const box   = MATRIX_BOXES.find(b=>b.id===id);
  const open  = body.style.display !== 'none';
  if(open){
    body.style.display = 'none';
    if(arrow) arrow.textContent = '▼';
  }else{
    fillBoxBody(box, el.dataset.key, body);
    body.style.display = 'block';
    if(arrow) arrow.textContent = '▲';
    el.scrollIntoView({behavior:'smooth', block:'nearest'});
  }
}

/* Chakra "health" box pulls the already-rendered chakra table numbers */
function renderChakraHealth(){
  const get = id => (document.getElementById(id)?.textContent || '–');
  const rows = [
    ['საჰასრარა',   'c-t3','c-l3','c-s1'],
    ['აჯნა',        'c-t2','c-l2','c-s2'],
    ['ვიშუდჰა',     'c-t1','c-l1','c-s3'],
    ['ანაჰატა',     'c-g2','c-g1','c-s4'],
    ['მანიპურა',    'c-cv','c-cv2','c-s5'],
    ['სვადჰისტანა', 'c-b1','c-r1','c-s6'],
    ['მულადჰარა',   'c-b3','c-r3','c-s7'],
  ];
  let html = '<div style="font-size:12px;line-height:1.9;">';
  for(const [name,e,l,s] of rows){
    html += `<div><b style="color:#b39ddb">${name}</b> — ენერგია ${get(e)} · მატერია ${get(l)} · ემოცია ${get(s)}</div>`;
  }
  html += '</div>';
  return html;
}

/* Open a specific box by the circle key (called from diagram circle clicks) */
function openBoxById(id){
  const el = document.querySelector(`.mx-box[data-boxid="${id}"]`);
  if(!el) return;
  const body = el.querySelector('.mx-box-body');
  if(body.style.display === 'none') toggleMatrixBox(id);   // open if closed
  else el.scrollIntoView({behavior:'smooth', block:'nearest'});
}
