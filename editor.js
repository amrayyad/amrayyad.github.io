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

function loadSkills() {
  const container = document.getElementById('skills-list');
  container.innerHTML = '';
  originalDoc.querySelectorAll('.skill-category').forEach((cat, ci) => {
    const block = document.createElement('div');
    block.className = 'item';
    block.innerHTML = `
      <label>Category Name</label>
      <input value="${cat.querySelector('h3').textContent}">
      <div class="skills">
        ${Array.from(cat.querySelectorAll('.skill-list li')).map((li, si) => `
          <div class="skill" data-si="${si}">
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
function addSkill(btn) {
  const div = document.createElement('div');
  div.className = 'skill';
  div.innerHTML = `
    <label>Skill Name</label>
    <input>
    <label>Skill Icon (class)</label>
    <input>
    <button onclick="this.parentNode.remove()">🗑 Remove</button>
  `;
  btn.parentNode.querySelector('.skills').appendChild(div);
}
function addSkillCategory() {
  const container = document.getElementById('skills-list');
  const block = document.createElement('div');
  block.className = 'item';
  block.innerHTML = `
    <label>Category Name</label>
    <input>
    <div class="skills"></div>
    <button onclick="addSkill(this)">+ Add Skill</button>
    <button onclick="this.parentNode.remove()">🗑 Remove Category</button>
  `;
  container.appendChild(block);
}

function loadProjects() {
  const container = document.getElementById('projects-list');
  container.innerHTML = '';
  originalDoc.querySelectorAll('.project-card').forEach((p) => {
    const block = document.createElement('div');
    block.className = 'item';
    block.innerHTML = `
      <label>Title</label>
      <input value="${p.querySelector('.project-title').textContent}">
      <label>Description</label>
      <textarea>${p.querySelector('.project-description').textContent}</textarea>
      <label>Image</label>
      <input value="${p.querySelector('.project-image img').src}">
      <button onclick="this.parentNode.remove()">🗑 Remove</button>
    `;
    container.appendChild(block);
  });
}
function addProject() {
  const container = document.getElementById('projects-list');
  const block = document.createElement('div');
  block.className = 'item';
  block.innerHTML = `
    <label>Title</label><input>
    <label>Description</label><textarea></textarea>
    <label>Image</label><input>
    <button onclick="this.parentNode.remove()">🗑 Remove</button>
  `;
  container.appendChild(block);
}

function loadTestimonials() {
  const container = document.getElementById('testimonials-list');
  container.innerHTML = '';
  originalDoc.querySelectorAll('.testimonial-card').forEach((t) => {
    const block = document.createElement('div');
    block.className = 'item';
    block.innerHTML = `
      <label>Quote</label>
      <textarea>${t.querySelector('.testimonial-text').textContent}</textarea>
      <label>Name</label>
      <input value="${t.querySelector('.author-name').textContent}">
      <label>Role</label>
      <input value="${t.querySelector('.author-role').textContent}">
      <button onclick="this.parentNode.remove()">🗑 Remove</button>
    `;
    container.appendChild(block);
  });
}
function addTestimonial() {
  const container = document.getElementById('testimonials-list');
  const block = document.createElement('div');
  block.className = 'item';
  block.innerHTML = `
    <label>Quote</label><textarea></textarea>
    <label>Name</label><input>
    <label>Role</label><input>
    <button onclick="this.parentNode.remove()">🗑 Remove</button>
  `;
  container.appendChild(block);
}

function exportHTML() {
  // Rebuild the HTML based on edited form values
  const doc = originalDoc.cloneNode(true);

  // Skills
  const skillCats = doc.querySelectorAll('.skill-category');
  skillCats.forEach(c => c.remove());
  const newSkillCats = document.querySelectorAll('#skills-list .item');
  const skillContainer = doc.querySelector('.skills-grid');
  newSkillCats.forEach(cat => {
    const catName = cat.querySelector('input').value;
    const catDiv = document.createElement('div');
    catDiv.className = 'skill-category glass-card';
    catDiv.innerHTML = `<h3>${catName}</h3><ul class="skill-list"></ul>`;
    cat.querySelectorAll('.skill').forEach(s => {
      const name = s.querySelectorAll('input')[0].value;
      const icon = s.querySelectorAll('input')[1].value;
      const li = document.createElement('li');
      li.innerHTML = `<i class="${icon}"></i> ${name}`;
      catDiv.querySelector('.skill-list').appendChild(li);
    });
    skillContainer.appendChild(catDiv);
  });

  // Projects
  const oldProjects = doc.querySelectorAll('.project-card');
  oldProjects.forEach(p => p.remove());
  const newProjects = document.querySelectorAll('#projects-list .item');
  const projectContainer = doc.querySelector('.projects-carousel');
  newProjects.forEach(p => {
    const [title, desc, img] = p.querySelectorAll('input, textarea');
    const card = document.createElement('div');
    card.className = 'glass-card project-card';
    card.innerHTML = `
      <div class="project-image"><img src="${img.value}"></div>
      <h3 class="project-title">${title.value}</h3>
      <p class="project-description">${desc.value}</p>
    `;
    projectContainer.appendChild(card);
  });

  // Testimonials
  const oldTestimonials = doc.querySelectorAll('.testimonial-card');
  oldTestimonials.forEach(t => t.remove());
  const newTestimonials = document.querySelectorAll('#testimonials-list .item');
  const testimonialContainer = doc.querySelector('.testimonials');
  newTestimonials.forEach(t => {
    const [quote, name, role] = t.querySelectorAll('textarea, input');
    const card = document.createElement('div');
    card.className = 'glass-card testimonial-card';
    card.innerHTML = `
      <p class="testimonial-text">${quote.value}</p>
      <div class="testimonial-author">
        <div class="author-details">
          <span class="author-name">${name.value}</span>
          <span class="author-role">${role.value}</span>
        </div>
      </div>
    `;
    testimonialContainer.appendChild(card);
  });

  const finalHTML = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
  const blob = new Blob([finalHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'index.html';
  a.click();
  URL.revokeObjectURL(url);
}

loadIndex();
