// Utility functions used by both builder and portfolio pages
function readFileAsDataURL(file){ return new Promise((res, rej)=>{ const fr = new FileReader(); fr.onload = e=> res(e.target.result); fr.onerror = rej; fr.readAsDataURL(file); }); }

function saveToLocal(data){
  localStorage.setItem('portfolio_data', JSON.stringify(data));
}

function loadFromLocal(){
  try{ return JSON.parse(localStorage.getItem('portfolio_data') || 'null'); }
  catch(e){ return null; }
}

// generate id simple
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
