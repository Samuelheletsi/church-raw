// ----------------------------
// Dark/Light Mode Toggle
// ----------------------------
const themeToggle = document.getElementById('theme-toggle');
if(localStorage.getItem('theme')==='dark'){
  document.body.classList.add('dark');
}

// Toggle theme
themeToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// ----------------------------
// List/Grid Mode Toggle
// ----------------------------
const listToggle = document.getElementById('list-toggle');
if(listToggle){
  listToggle.addEventListener('click', ()=>{
    document.getElementById('programs-container').classList.toggle('list-view');
  });
}

// ----------------------------
// Contact Form Submission
// ----------------------------
const contactForm = document.querySelector(".contact-form");
if(contactForm){
  contactForm.addEventListener("submit", e=>{
    e.preventDefault();
    alert("Thank you! Your message has been sent.");
    e.target.reset();
  });
}

// ----------------------------
// Load Data (JSON)
// ----------------------------
fetch("./data.json")
  .then(res=>res.json())
  .then(data=>{
    loadAnnouncements(data.announcements);
    loadPrograms(data.programs);
    populateTeamSections(data);
  })
  .catch(err=>console.error("Failed to load data:", err));

// ----------------------------
// Load Announcements
// ----------------------------
function loadAnnouncements(announcements){
  const container = document.getElementById("announcements-container");
  if(!container) return;
  announcements.forEach(a=>{
    const div = document.createElement("div");
    div.className = "announcement";
    div.innerHTML = `<h3>${a.title}</h3><p>${a.date}</p><p>${a.details}</p>`;
    container.appendChild(div);
  });
}

// ----------------------------
// Load Programs with Slideshow
// ----------------------------
function loadPrograms(programs){
  const container = document.getElementById("programs-container");
  if(!container) return;

  programs.forEach(p=>{
    const card = document.createElement("div");
    card.className = "program-card";

    card.innerHTML = `
      <div class="slideshow-container" id="slide-${p.id}">
        ${p.images.map((img,i)=>`<img data-src="${img}" class="${i===0?'active lazy':''}" alt="${p.name} image ${i+1}">`).join('')}
      </div>
      <h3>${p.name}</h3>
      <p>${p.year}</p>
    `;
    card.onclick = ()=>window.location.href=`program.html?id=${p.id}`;
    container.appendChild(card);

    // Auto slideshow
    let idx = 0;
    setInterval(()=>{
      const slides = card.querySelectorAll(".slideshow-container img");
      slides.forEach(s=>s.classList.remove("active"));
      idx = (idx+1)%slides.length;
      slides[idx].classList.add("active");
    },3000);
  });

  lazyLoadImages();
}

// ----------------------------
// Populate Team Sections
// ----------------------------
function populateTeamSections(data){
  const sections = [
    {id:"pastors", items:data.pastors, fields:["description"]},
    {id:"fellowships", items:data.fellowships, fields:["leader_name","assistant"]},
    {id:"leaders", items:data.leaders, fields:["role"]},
    {id:"awards", items:[...data.awards.best_leaders, ...data.awards.best_fellowships], fields:["description"]}
  ];

  sections.forEach(s=>{
    const container = document.querySelector(`#${s.id} .team-container`);
    if(!container) return;
    s.items.forEach(item=>{
      const card = document.createElement("div");
      card.className = "team-card";
      card.innerHTML = `
        <img data-src="${item.image}" class="lazy" alt="${item.name||item.leader}">
        <h3>${item.name||item.leader}</h3>
        ${s.fields.map(f=>`<p>${item[f]}</p>`).join('')}
      `;
      container.appendChild(card);
    });
  });

  lazyLoadImages();
}

// ----------------------------
// Lazy Load Images
// ----------------------------
function lazyLoadImages(){
  const lazyImages = document.querySelectorAll("img.lazy");
  const observer = new IntersectionObserver((entries, obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        obs.unobserve(img);
      }
    });
  }, {rootMargin:"0px 0px 200px 0px"});

  lazyImages.forEach(img=>observer.observe(img));
}
