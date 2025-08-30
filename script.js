// ----------------------------
// Dark/Light Mode Toggle
// ----------------------------
const themeToggle = document.getElementById('theme-toggle');
if(localStorage.getItem('theme')==='dark') document.body.classList.add('dark');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// ----------------------------
// List/Grid Mode Toggle
// ----------------------------
const listToggle = document.getElementById('list-toggle');
if(listToggle){
  listToggle.addEventListener('click', () => {
    document.getElementById('programs-container').classList.toggle('list-view');
  });
}

// ----------------------------
// Contact Form Submission
// ----------------------------
const contactForm = document.querySelector(".contact-form");
if(contactForm){
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    alert("Thank you! Your message has been sent.");
    e.target.reset();
  });
}

// ----------------------------
// Load Data (JSON)
// ----------------------------
fetch("./data.json")
  .then(res => res.json())
  .then(data => {
    loadAnnouncements(data.announcements);
    loadPrograms(data.programs);
    populateTeamSections(data);
  })
  .catch(err => console.error("Failed to load data:", err));

// ----------------------------
// Load Announcements
// ----------------------------
function loadAnnouncements(announcements){
  const container = document.getElementById("announcements-container");
  if(!container) return;
  announcements.forEach(a => {
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

  programs.forEach(p => {
    const card = document.createElement("div");
    card.className = "program-card";

    const slidesHtml = p.images.map((img, i) => `
      <img ${i === 0 ? `src="${img}"` : `data-src="${img}" class="lazy"`} class="${i === 0 ? 'active' : ''}" alt="${p.name} image ${i+1}">
    `).join('');

    card.innerHTML = `
      <div class="slideshow-container" id="slide-${p.id}">
        ${slidesHtml}
      </div>
      <h3>${p.name}</h3>
      <p>${p.year}</p>
    `;

    card.onclick = () => window.location.href = `program.html?id=${p.id}`;
    container.appendChild(card);

    // Auto slideshow
    let idx = 0;
    const slides = card.querySelectorAll(".slideshow-container img");
    setInterval(() => {
      slides.forEach(s => s.classList.remove("active"));
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add("active");
    }, 3000);
  });

  lazyLoadImages();
}

// ----------------------------
// Populate Team Sections
// ----------------------------
function populateTeamSections(data){
  // Pastors
  const pastorContainer = document.querySelector("#pastors-container");
  data.pastors.forEach(p => {
    const card = document.createElement("div");
    card.className = "team-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.description}</p>
    `;
    card.onclick = () => window.location.href = `pastors.html?id=${encodeURIComponent(p.name)}`;
    pastorContainer.appendChild(card);
  });

  // Fellowships
  const fellowshipContainer = document.querySelector("#fellowships-container");
  data.fellowships.forEach(f => {
    const card = document.createElement("div");
    card.className = "team-card";
    card.innerHTML = `
      <img src="${f.image}" alt="${f.name}">
      <h3>${f.name}</h3>
      <p>Leader: ${f.leader_name}</p>
    `;
    card.onclick = () => window.location.href = `fellowship.html?id=${encodeURIComponent(f.name)}`;
    fellowshipContainer.appendChild(card);
  });

  // Leaders
  const leaderContainer = document.querySelector("#leaders .team-container");
  data.leaders.forEach(l => {
    const card = document.createElement("div");
    card.className = "team-card";
    card.innerHTML = `
      <img src="${l.image}" alt="${l.leader}">
      <h3>${l.leader}</h3>
      <p>${l.role}</p>
    `;
    leaderContainer.appendChild(card);
  });

  // Awards
  const awardsContainer = document.querySelector("#awards .team-container");
  [...data.awards.best_leaders, ...data.awards.best_fellowships].forEach(a => {
    const card = document.createElement("div");
    card.className = "team-card";
    card.innerHTML = `
      <img src="${a.image}" alt="${a.name || a.leader}">
      <h3>${a.name || a.leader}</h3>
      <p>${a.description}</p>
    `;
    awardsContainer.appendChild(card);
  });
}

// ----------------------------
// Lazy Load Images
// ----------------------------
function lazyLoadImages(){
  const lazyImages = document.querySelectorAll("img.lazy");
  if('IntersectionObserver' in window){
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          obs.unobserve(img);
        }
      });
    }, {rootMargin:"0px 0px 200px 0px"});
    lazyImages.forEach(img => observer.observe(img));
  } else {
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove("lazy");
    });
  }
}

// ----------------------------
// Hero Video Play Trigger (Desktop + Mobile)
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("bg-video");
  const fallback = document.querySelector(".bg-fallback");

  if(video){
    video.muted = true;
    video.playsInline = true;

    const tryPlay = () => {
      const playPromise = video.play();
      if(playPromise !== undefined){
        playPromise
          .then(() => {
            if(fallback) fallback.style.display = "none";
          })
          .catch(err => {
            console.log("Autoplay blocked, showing fallback image.", err);
            video.style.display = "none";
            if(fallback) fallback.style.display = "block";
          });
      }
    };

    tryPlay();
    document.addEventListener("click", tryPlay, { once: true });
    document.addEventListener("touchstart", tryPlay, { once: true });
  }
});

// ----------------------------
// Go To Page
// ----------------------------
function goToPage(type, id) {
  window.location.href = `${type}.html?id=${encodeURIComponent(id)}`;
}

// ----------------------------
// Navbar Mobile Toggle
// ----------------------------
const menuToggle = document.querySelector(".menu-toggle");
const navUl = document.querySelector("nav ul");
if(menuToggle && navUl){
  menuToggle.addEventListener("click", () => {
    navUl.classList.toggle("active");
  });
}

// ----------------------------
// Smooth Scroll for Navbar Links
// ----------------------------
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e){
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if(target){
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if(navUl.classList.contains("active")) navUl.classList.remove("active");
    }
  });
});
