let parser = new DOMParser();
let originalDoc;

async function loadIndex() {
  const res = await fetch('index.html');
  const html = await res.text();
  originalDoc = parser.parseFromString(html, 'text/html');
  loadSkills();
  loadProjects();
  loadTestimonials();
}

// -------- SKILLS --------
function loadSkills() {
  const container = document.getElementById('skills-list');
  container.innerHTML = '';
  originalDoc.querySelectorAll('.skill-category').forEach(cat => {
    const block = document.createElement('div');
    block.className = 'item';
    block.innerHTML = `
      <label>Category Name</label>
      <input value="${cat.querySelector('h3').textContent}">
      <div class="skills">
        ${Array.from(cat.querySelectorAll('.skill-list li')).map(li => `
          <div class="skill">
            <label>Skill Name</label>
            <input value="${li.textContent.trim()}">
            <label>Skill Icon (class)</label>
            <input value="${li.querySelector('i').className}">
            <button onclick="this.parentNode.remove()">🗑 Remove</button>
          </div>`).join('')}
      </div>
      <button onclick="addSkill(this)">+ Add Skill</button>
      <button onclick="this.parentNode.remove()">🗑 Remove Category</button>
    `;
    container.appendChild(block);
  });
}
function addSkill(btn){
  const div = document.createElement('div');
  div.className='skill';
  div.innerHTML = `
    <label>Skill Name</label><input>
    <label>Skill Icon (class)</label><input>
    <button onclick="this.parentNode.remove()">🗑 Remove</button>`;
  btn.parentNode.querySelector('.skills').appendChild(div);
}
function addSkillCategory(){
  const container = document.getElementById('skills-list');
  const block = document.createElement('div');
  block.className = 'item';
  block.innerHTML = `
    <label>Category Name</label><input>
    <div class="skills"></div>
    <button onclick="addSkill(this)">+ Add Skill</button>
    <button onclick="this.parentNode.remove()">🗑 Remove Category</button>`;
  container.appendChild(block);
}

// -------- PROJECTS --------
function loadProjects(){
  const container = document.getElementById('projects-list');
  container.innerHTML = '';
  originalDoc.querySelectorAll('.project-card').forEach(p=>{
    const block = document.createElement('div');
    block.className = 'item';
    block.innerHTML = `
      <label>Title</label><input value="${p.querySelector('.project-title').textContent}">
      <label>Description</label><textarea>${p.querySelector('.project-description').textContent}</textarea>
      <label>Image</label><input value="${p.querySelector('.project-image img').src}">
      <label>Tags (comma separated)</label><input value="${Array.from(p.querySelectorAll('.project-tag')).map(t=>t.textContent).join(', ')}">
      <button onclick="this.parentNode.remove()">🗑 Remove</button>`;
    container.appendChild(block);
  });
}
function addProject(){
  const container = document.getElementById('projects-list');
  const block = document.createElement('div');
  block.className = 'item';
  block.innerHTML = `
    <label>Title</label><input>
    <label>Description</label><textarea></textarea>
    <label>Image</label><input>
    <label>Tags (comma separated)</label><input>
    <button onclick="this.parentNode.remove()">🗑 Remove</button>`;
  container.appendChild(block);
}

// -------- TESTIMONIALS --------
function loadTestimonials(){
  const container = document.getElementById('testimonials-list');
  container.innerHTML = '';
  originalDoc.querySelectorAll('.testimonial-card').forEach(t=>{
    const block = document.createElement('div');
    block.className = 'item';
    block.innerHTML = `
      <label>Quote</label><textarea>${t.querySelector('.testimonial-text').textContent}</textarea>
      <label>Name</label><input value="${t.querySelector('.author-name').textContent}">
      <label>Role</label><input value="${t.querySelector('.author-role').textContent}">
      <button onclick="this.parentNode.remove()">🗑 Remove</button>`;
    container.appendChild(block);
  });
}
function addTestimonial(){
  const container = document.getElementById('testimonials-list');
  const block = document.createElement('div');
  block.className = 'item';
  block.innerHTML = `
    <label>Quote</label><textarea></textarea>
    <label>Name</label><input>
    <label>Role</label><input>
    <button onclick="this.parentNode.remove()">🗑 Remove</button>`;
  container.appendChild(block);
}

// -------- EXPORT --------
function exportHTML(){
  const doc = originalDoc.cloneNode(true);

  // rebuild skills
  doc.querySelectorAll('.skill-category').forEach(el=>el.remove());
  const skillsWrap = doc.querySelector('.skills-container');
  document.querySelectorAll('#skills-list .item').forEach(cat=>{
    const catDiv = document.createElement('div');
    catDiv.className='skill-category glass-card';
    catDiv.innerHTML=`<h3>${cat.querySelector('input').value}</h3><ul class="skill-list"></ul>`;
    cat.querySelectorAll('.skill').forEach(s=>{
      const [name, icon] = s.querySelectorAll('input');
      const li=document.createElement('li');
      li.innerHTML=`<i class="${icon.value}"></i> ${name.value}`;
      catDiv.querySelector('.skill-list').appendChild(li);
    });
    skillsWrap.appendChild(catDiv);
  });

  // rebuild projects
  doc.querySelectorAll('.project-card').forEach(p=>p.remove());
  const projWrap = doc.querySelector('.projects-grid');
  document.querySelectorAll('#projects-list .item').forEach(p=>{
    const [title, desc, img, tags] = p.querySelectorAll('input, textarea');
    const card=document.createElement('div');
    card.className='glass-card project-card';
    card.innerHTML=`
      <div class="project-image"><img src="${img.value}"></div>
      <h3 class="project-title">${title.value}</h3>
      <p class="project-description">${desc.value}</p>
      <div class="project-tags">${tags.value.split(',').map(t=>`<span class="project-tag">${t.trim()}</span>`).join('')}</div>
    `;
    projWrap.appendChild(card);
  });

  // rebuild testimonials
  doc.querySelectorAll('.testimonial-card').forEach(t=>t.remove());
  const testWrap = doc.querySelector('.testimonials-grid');
  document.querySelectorAll('#testimonials-list .item').forEach(t=>{
    const [quote, name, role] = t.querySelectorAll('textarea, input');
    const card=document.createElement('div');
    card.className='glass-card testimonial-card';
    card.innerHTML=`
      <p class="testimonial-text">${quote.value}</p>
      <div class="testimonial-author">
        <div class="author-details">
          <span class="author-name">${name.value}</span>
          <span class="author-role">${role.value}</span>
        </div>
      </div>`;
    testWrap.appendChild(card);
  });

  const finalHTML = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
  const blob = new Blob([finalHTML], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='index.html';
  a.click();
  URL.revokeObjectURL(url);
}

loadIndex();
