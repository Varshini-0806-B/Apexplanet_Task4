// Builder page logic: add skills, add projects, preview, save, export, sample load
document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('builderForm');
  const skillInput = document.getElementById('skillInput');
  const addSkillBtn = document.getElementById('addSkill');
  const skillsWrap = document.getElementById('skills');
  const addProjectBtn = document.getElementById('addProjectBtn');
  const projectsContainer = document.getElementById('projectsContainer');
  const profileInput = document.getElementById('profileImage');
  const profilePreview = document.getElementById('profilePreview');

  let data = loadFromLocal() || { name:'', title:'', email:'', location:'', bio:'', profile:'', skills:[], projects:[], social:{} };

  // init UI
  function refreshSkills(){ skillsWrap.innerHTML = ''; data.skills.forEach((s, i)=>{ const el = document.createElement('div'); el.className='tag'; el.innerText = s; el.onclick = ()=>{ data.skills.splice(i,1); refreshSkills(); }; skillsWrap.appendChild(el); }); }

  function refreshProjects(){
    projectsContainer.innerHTML = '';
    data.projects.forEach((p, idx)=>{
      const div = document.createElement('div'); div.className = 'projectItem';
      div.innerHTML = `<div>
        <input placeholder="Project title" value="${escapeHtml(p.title||'')}" data-idx="${idx}" data-field="title">
        <textarea placeholder="Short description" data-idx="${idx}" data-field="desc">${escapeHtml(p.desc||'')}</textarea>
        <input placeholder="Tech tags (comma separated)" value="${escapeHtml((p.tech||[]).join(','))}" data-idx="${idx}" data-field="tech">
        <input placeholder="Project URL (optional)" value="${escapeHtml(p.url||'')}" data-idx="${idx}" data-field="url">
        <input type="file" accept="image/*" data-idx="${idx}" data-field="img" class="projImgInput">
      </div><div><img class="projectThumb" src="${p.img||''}" /></div>`;
      projectsContainer.appendChild(div);
    });
  }

  function bindProjectInputs(){
    projectsContainer.querySelectorAll('[data-field]').forEach(inp=>{
      inp.addEventListener('input', e=>{
        const idx = parseInt(e.target.getAttribute('data-idx'));
        const field = e.target.getAttribute('data-field');
        if(field==='tech') data.projects[idx].tech = e.target.value.split(',').map(s=> s.trim()).filter(Boolean);
        else data.projects[idx][field] = e.target.value;
        saveToLocal(data);
      });
    });
    projectsContainer.querySelectorAll('.projImgInput').forEach(inp=>{
      inp.addEventListener('change', async e=>{
        const idx = parseInt(e.target.getAttribute('data-idx'));
        const file = e.target.files[0];
        if(file){ const url = await readFileAsDataURL(file); data.projects[idx].img = url; saveToLocal(data); refreshProjects(); bindProjectInputs(); }
      });
    });
  }

  function escapeHtml(str){ return String(str).replace(/[&<>"']/g, s=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" }[s])); }

  // profile preview
  profileInput.addEventListener('change', async e=>{
    const file = e.target.files[0];
    if(file){ const url = await readFileAsDataURL(file); data.profile = url; profilePreview.innerHTML = `<img src="${url}" />`; saveToLocal(data); }
  });

  // add skill
  addSkillBtn.addEventListener('click', ()=>{
    const v = skillInput.value.trim();
    if(!v) return;
    data.skills.push(v);
    skillInput.value = '';
    refreshSkills();
    saveToLocal(data);
  });

  // add project
  addProjectBtn.addEventListener('click', ()=>{
    data.projects.push({ title:'', desc:'', tech:[], url:'', img:'' });
    refreshProjects();
    bindProjectInputs();
    saveToLocal(data);
  });

  // save button
  document.getElementById('saveBtn').addEventListener('click', ()=>{ // gather few fields
    data.name = document.getElementById('name').value.trim();
    data.title = document.getElementById('title').value.trim();
    data.email = document.getElementById('email').value.trim();
    data.location = document.getElementById('location').value.trim();
    data.bio = document.getElementById('bio').value.trim();
    data.social = { github: document.getElementById('github').value.trim(), linkedin: document.getElementById('linkedin').value.trim() };
    saveToLocal(data);
    alert('Saved locally. Click Preview / Generate to view your portfolio.');
  });

  // export json
  document.getElementById('exportJson').addEventListener('click', ()=>{
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'portfolio_data.json'; a.click();
  });

  // clear
  document.getElementById('clearBtn').addEventListener('click', ()=>{ if(confirm('Clear all saved data?')){ localStorage.removeItem('portfolio_data'); data = { name:'', title:'', email:'', location:'', bio:'', profile:'', skills:[], projects:[], social:{} }; refreshSkills(); refreshProjects(); profilePreview.innerHTML=''; document.querySelectorAll('input, textarea').forEach(i=> i.value=''); } });

  // load sample
  document.getElementById('loadSample').addEventListener('click', ()=>{
    if(!confirm('Load sample demo data (this will overwrite current inputs)?')) return;
    data = {
      name:'Suchi R.',
      title:'Front-end Developer',
      email:'suchi@example.com',
      location:'Hyderabad, India',
      bio:'I build accessible and polished user interfaces. Currently interning as a front-end developer.',
      profile:'',
      skills:['HTML','CSS','JavaScript','React'],
      projects:[
        {title:'To-Do App', desc:'A sleek to-do app with localStorage and animations.', tech:['vanilla-js','localStorage'], url:'', img:''},
        {title:'Product UI', desc:'Filterable product listing with cart & wishlist.', tech:['ui','js'], url:'', img:''}
      ],
      social:{ github:'https://github.com/yourname', linkedin:'https://linkedin.com/in/yourname' }
    };
    saveToLocal(data);
    // populate form fields
    document.getElementById('name').value = data.name;
    document.getElementById('title').value = data.title;
    document.getElementById('email').value = data.email;
    document.getElementById('location').value = data.location;
    document.getElementById('bio').value = data.bio;
    document.getElementById('github').value = data.social.github;
    document.getElementById('linkedin').value = data.social.linkedin;
    refreshSkills(); refreshProjects(); bindProjectInputs();
  });

  // preview / generate -> open portfolio.html
  document.getElementById('toPreview').addEventListener('click', ()=>{
    // ensure saved
    data.name = document.getElementById('name').value.trim();
    data.title = document.getElementById('title').value.trim();
    data.email = document.getElementById('email').value.trim();
    data.location = document.getElementById('location').value.trim();
    data.bio = document.getElementById('bio').value.trim();
    data.social = { github: document.getElementById('github').value.trim(), linkedin: document.getElementById('linkedin').value.trim() };
    saveToLocal(data);
    window.open('portfolio.html', '_blank');
  });

  // initialize UI from saved
  if(data){
    document.getElementById('name').value = data.name || '';
    document.getElementById('title').value = data.title || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('location').value = data.location || '';
    document.getElementById('bio').value = data.bio || '';
    document.getElementById('github').value = (data.social && data.social.github) || '';
    document.getElementById('linkedin').value = (data.social && data.social.linkedin) || '';
    if(data.profile) profilePreview.innerHTML = '<img src="'+data.profile+'" />';
    refreshSkills(); refreshProjects(); bindProjectInputs();
  }
});