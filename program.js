let currentImageIndex = 0;
let images = [];

// Get program ID from URL
const urlParams = new URLSearchParams(window.location.search);
const programId = urlParams.get("id");


// Navbar mobile toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("nav ul");

  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });
});


// Fetch program data
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    const program = data.programs.find(p => p.id == programId);
    if (!program) {
      document.getElementById("program-content").innerHTML = "<p>Program not found.</p>";
      return;
    }

    // Title & description
    document.getElementById("program-title").textContent = program.name;
    document.getElementById("program-description").textContent = program.description || "";

    // Gallery
    const gallery = document.getElementById("program-gallery");
    images = program.images;
    images.forEach((img, index) => {
      const image = document.createElement("img");
      image.src = img;
      image.alt = program.name;
      image.addEventListener("click", () => openLightbox(index));
      gallery.appendChild(image);
    });

    // Videos
    const videos = document.getElementById("program-videos");
    program.videos?.forEach(v => {
      const iframe = document.createElement("iframe");
      iframe.src = v;
      iframe.width = "560";
      iframe.height = "315";
      iframe.frameBorder = "0";
      iframe.allowFullscreen = true;
      videos.appendChild(iframe);
    });
  })
  .catch(err => {
    console.error("Failed to load program:", err);
    document.getElementById("program-content").innerHTML = "<p>Error loading program details.</p>";
  });

// Lightbox functions
function openLightbox(index) {
  currentImageIndex = index;
  document.getElementById("lightbox-img").src = images[currentImageIndex];
  document.getElementById("lightbox").style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

function showNext() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  document.getElementById("lightbox-img").src = images[currentImageIndex];
}

function showPrev() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  document.getElementById("lightbox-img").src = images[currentImageIndex];
}

// Event Listeners
document.querySelector(".close").addEventListener("click", closeLightbox);
document.querySelector(".next").addEventListener("click", showNext);
document.querySelector(".prev").addEventListener("click", showPrev);

// Close on background click
document.getElementById("lightbox").addEventListener("click", (e) => {
  if (e.target === document.getElementById("lightbox")) closeLightbox();
});
