// portfolio page: read saved data and render sections, theme toggle, edit button, print
document.addEventListener('DOMContentLoaded', ()=>{
  const data = loadFromLocal() || {};
  if(!data) return;
  document.getElementById('year').innerText = new Date().getFullYear();
  document.getElementById('brandName').innerText = data.name || 'Your Name';
  document.getElementById('pName').innerText = data.name || '';
  document.getElementById('pTitle').innerText = data.title || '';
  document.getElementById('pLocation').innerText = data.location || '';
  document.getElementById('pEmail').innerText = data.email || '';
  document.getElementById('pBio').innerText = data.bio || '';

  // profile image
  if(data.profile){
    const box = document.getElementById('profileImageBox');
    box.innerHTML = '<img src="'+data.profile+'" alt="Profile">';
  }

  // skills
  const skillsWrap = document.getElementById('pSkills');
  (data.skills||[]).forEach(s=>{
    const el = document.createElement('div'); el.className='tag'; el.innerText = s; skillsWrap.appendChild(el);
  });

  // projects
  const projGrid = document.getElementById('pProjects');
  (data.projects||[]).forEach(p=>{
    const card = document.createElement('div'); card.className='projectCard';
    card.innerHTML = `<img src="${p.img||'https://via.placeholder.com/600x360?text=Project'}" alt="${p.title}"><div class="pbody"><h4>${p.title}</h4><p class="tech">${(p.tech||[]).join(', ')}</p><p>${p.desc}</p>${p.url?'<p><a href="'+p.url+'" target="_blank">View project</a></p>':''}</div>`;
    projGrid.appendChild(card);
  });

  // social links
  const socialWrap = document.getElementById('pSocial');
  if(data.social && data.social.github) socialWrap.innerHTML += `<a href="${data.social.github}" target="_blank">GitHub</a>`;
  if(data.social && data.social.linkedin) socialWrap.innerHTML += `<a href="${data.social.linkedin}" target="_blank">LinkedIn</a>`;

  // edit button
  document.getElementById('editBtn').addEventListener('click', ()=>{ window.location.href = 'index.html'; });

  // theme toggle
  const body = document.body;
  const mode = localStorage.getItem('theme_mode') || 'light';
  if(mode === 'dark') body.classList.add('dark');
  document.getElementById('themeToggle').addEventListener('click', ()=>{
    body.classList.toggle('dark');
    const m = body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme_mode', m);
    document.getElementById('themeToggle').innerText = body.classList.contains('dark') ? 'Light' : 'Dark';
  });

  // print/pdf
  document.getElementById('downloadPDF').addEventListener('click', ()=>{ window.print(); });

  // mailto link
  const mailTo = document.getElementById('mailTo');
  mailTo.href = 'mailto:' + (data.email || '');
  mailTo.innerText = data.email || 'your-email@example.com';
});