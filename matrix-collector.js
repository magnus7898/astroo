/* ============================================================
   matrix-collector.js — AUTO-FILL for MATRIX_DB combos.
   Include in matrix.html AFTER matrix_combos.js:

       <script src="matrix_combos.js"></script>
       <script src="matrix-collector.js"></script>   ← add this line
       <script src="matrix_boxes_addon.js"></script>

   How it works: wraps lookup(position, nums). Every combo a real
   user generates (any zone: persona, sex, talent_zone, tl, tr,
   br, bl, love, money, material_karma…) is sent ONCE to the
   backend, which stores unique keys. Zones with texts already
   written (karmic_tail) keep working — collection is silent.

   To get the grown skeleton in MATRIX_DB format, open:
   https://astrology-production-b165.up.railway.app/api/combo/export
   Copy the zones you want, write texts, merge into matrix_combos.js.
   ============================================================ */
(function(){
  const BACKEND='https://astrology-production-b165.up.railway.app';
  const seen=new Set();
  let queue=[],timer=null;
  function log(position,nums){
    if(!nums||nums.length!==3)return;              // combos only; singles fall back to tarot
    const key=position+':'+nums.join('-');         // exact order preserved (lookup tries exact first)
    if(seen.has(key))return;
    seen.add(key);
    queue.push(key);
    clearTimeout(timer);
    timer=setTimeout(()=>{                         // batch all boxes of one calculation
      const batch=queue.splice(0);
      if(batch.length)fetch(BACKEND+'/api/combo/log',{method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({keys:batch})}).catch(()=>{});
    },800);
  }
  const core=window.lookup;
  if(typeof core!=='function'){console.warn('matrix-collector: lookup not found — include after matrix_combos.js');return;}
  window.lookup=function(position,nums){
    try{log(position,nums);}catch(e){}
    return core(position,nums);
  };
})();
