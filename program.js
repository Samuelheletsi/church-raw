// Get program ID from query string
const urlParams = new URLSearchParams(window.location.search);
const programId = urlParams.get("id");

// Load program data
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    const program = data.programs.find(p => p.id === programId);
    if(!program) return;

    // Set Title & Description
    document.getElementById("program-title").textContent = `${program.name} (${program.year})`;
    document.getElementById("program-description").textContent = program.description;

    // Gallery Images
    const galleryDiv = document.getElementById("program-gallery");
    program.images.forEach(img=>{
      const imageEl = document.createElement("img");
      imageEl.src = img;
      galleryDiv.appendChild(imageEl);
    });

    // Videos
    const videosDiv = document.getElementById("program-videos");
    program.videos.forEach(v=>{
      if(v.type === "youtube"){
        const iframe = document.createElement("iframe");
        iframe.src = v.url;
        iframe.width = "560";
        iframe.height = "315";
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        videosDiv.appendChild(iframe);
      } else {
        const videoEl = document.createElement("video");
        videoEl.src = v.url;
        videoEl.controls = true;
        videosDiv.appendChild(videoEl);
      }
    });
  })
  .catch(err => console.error("Failed to load program data:", err));
