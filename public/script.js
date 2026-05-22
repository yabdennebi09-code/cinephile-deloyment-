console.log("SCRIPT LOADED");

const form = document.querySelector("#movie-form");
const movieInput = document.querySelector("#movie-input");
const outfitGrid = document.querySelector("#outfit-grid");
const movieRow = document.querySelector("#movie-row");
const trendingSection = document.querySelector(".trending");
const resultsSection = document.querySelector(".results");
const resultsKicker = document.querySelector("#results-kicker");
const resultsTitle = document.querySelector("#results-title");
const generateButton = form.querySelector("button");
const lightbox = document.querySelector("#image-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxClose = document.querySelector(".lightbox-close");

const appConfig = window.CINEPHILE_STYLE_CONFIG || {};
const backendURL = appConfig.apiBaseUrl || (
  window.location.protocol === "file:" ? "http://localhost:3001" : window.location.origin
);

/* -------------------------
   TRENDING MOVIES
--------------------------*/
const trendingMovies = [
  "Matrix",
  "Joker",
  "Barbie",
  "Interstellar",
  "Inception",
  "Avatar",
  "Dune",
  "Batman",
  "Spiderman",
  "Harry Potter"
];

const moviePosters = {
  Matrix: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  Joker: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
  Barbie: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
  Interstellar: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  Inception: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
  Avatar: "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
  Dune: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
  Batman: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
  Spiderman: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
  "Harry Potter": "https://image.tmdb.org/t/p/w500/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg"
};

/* -------------------------
   CINEMATIC AESTHETIC SYSTEM
--------------------------*/
const aesthetics = {
  cyberpunk: "neon cyberpunk fashion, futuristic techwear, glowing city lights, dystopian cinematic mood",
  luxury: "high fashion editorial, Vogue style luxury, elegant tailoring, studio lighting, premium fabrics",
  vintage: "retro cinematic fashion, film grain aesthetic, warm analog photography",
  noir: "dark cinematic noir fashion, dramatic shadows, detective aesthetic",
  fantasy: "fantasy couture, ethereal glowing fabrics, magical cinematic world",
  grunge: "raw grunge fashion, underground street style, chaotic aesthetic",
  minimalist: "clean minimalist fashion, modern architectural fashion"
};

/* -------------------------
   MOVIE DATA (20+ OUTFITS)
--------------------------*/
const movieData = {
  matrix: { name: "Neo Operator", vibe: "Cyber noir", style: "cyberpunk", details: "full body black futuristic techwear trench coat, neon rain cyberpunk aesthetic" },

  joker: { name: "Gotham Chaos", vibe: "Anarchic elegance", style: "grunge", details: "full body chaotic clown-inspired suit, dark cinematic fashion styling" },

  barbie: { name: "Plastic Dream", vibe: "Hyper pop luxury", style: "luxury", details: "full body pink couture outfit, glossy fashion editorial Barbie aesthetic" },

  interstellar: { name: "Space Nomad", vibe: "Sci-fi realism", style: "minimalist", details: "full body astronaut-inspired survival fashion, futuristic spacewear" },

  inception: { name: "Dream Architect", vibe: "Mind-bending elegance", style: "noir", details: "full body tailored suit, surreal cinematic layering fashion" },

  avatar: { name: "Pandora Spirit", vibe: "Nature fantasy", style: "fantasy", details: "full body glowing tribal couture, bioluminescent fantasy fashion" },

  dune: { name: "Desert Noble", vibe: "Sci-fi royalty", style: "minimalist", details: "full body desert layered robes, futuristic aristocratic fashion" },

  bladerunner: { name: "Synthetic Soul", vibe: "Neon noir", style: "cyberpunk", details: "full body rain-soaked trench coat, neon dystopian fashion" },

  batman: { name: "Dark Vigilante", vibe: "Gothic hero", style: "noir", details: "full body armored black tactical suit, Gotham cinematic fashion" },

  spiderman: { name: "Urban Hero", vibe: "Street kinetic", style: "grunge", details: "full body sleek superhero suit, modern urban fashion aesthetic" },

  harrypotter: { name: "Wizard Academia", vibe: "Magical scholastic", style: "fantasy", details: "full body wizard robes, enchanted academic fashion" },

  frozen: { name: "Ice Queen", vibe: "Frozen elegance", style: "fantasy", details: "full body icy gown, crystalline winter couture" },

  gatsby: { name: "Golden Age Luxe", vibe: "1920s glamour", style: "vintage", details: "full body art deco luxury fashion, 1920s elegance" },

  oppenheimer: { name: "Atomic Elegance", vibe: "Historical drama", style: "noir", details: "full body 1940s formal scientific attire, muted cinematic fashion" },

  tron: { name: "Digital Warrior", vibe: "Neon digital world", style: "cyberpunk", details: "full body glowing circuit suit, futuristic neon armor fashion" },

  venom: { name: "Symbiote Form", vibe: "Dark alien force", style: "noir", details: "full body living black symbiote fashion, organic horror aesthetic" },

  maleficent: { name: "Dark Enchantress", vibe: "Dark fantasy royalty", style: "fantasy", details: "full body gothic magical couture, dark winged fashion aesthetic" },

  default: { name: "Cinematic Lead", vibe: "Main character energy", style: "luxury", details: "full body cinematic fashion editorial outfit, high-end magazine styling" }
};

/* -------------------------
   MATCH MOVIE
--------------------------*/
function getMovie(movie) {
  const key = movie.toLowerCase().replace(/\s/g, "");

  if (key.includes("matrix")) return movieData.matrix;
  if (key.includes("joker")) return movieData.joker;
  if (key.includes("barbie")) return movieData.barbie;
  if (key.includes("interstellar")) return movieData.interstellar;
  if (key.includes("inception")) return movieData.inception;
  if (key.includes("avatar")) return movieData.avatar;
  if (key.includes("dune")) return movieData.dune;
  if (key.includes("blade")) return movieData.bladerunner;
  if (key.includes("batman")) return movieData.batman;
  if (key.includes("spiderman")) return movieData.spiderman;
  if (key.includes("harry")) return movieData.harrypotter;
  if (key.includes("frozen")) return movieData.frozen;
  if (key.includes("gatsby")) return movieData.gatsby;
  if (key.includes("oppenheimer")) return movieData.oppenheimer;
  if (key.includes("tron")) return movieData.tron;
  if (key.includes("venom")) return movieData.venom;
  if (key.includes("maleficent")) return movieData.maleficent;

  return movieData.default;
}

/* -------------------------
   PROMPT BUILDER
--------------------------*/
function createPrompt(movieName, outfit) {
  const style = aesthetics[outfit.style] || aesthetics.luxury;

  return `
ultra realistic full body fashion editorial photoshoot

movie inspiration: ${movieName}

outfit concept:
${outfit.details}

art direction:
${style}

requirements:
- full body head to toe visible
- vertical runway composition
- centered subject
- Vogue magazine fashion editorial style
- 85mm fashion photography
- ultra detailed clothing textures
- cinematic lighting

negative prompt:
no close-up, no cropped body, no face-only image, no distortion
`;
}

/* -------------------------
   BACKEND CALL
--------------------------*/
async function generateAIImage(prompt) {
  try {
    const res = await fetch(`${backendURL}/generate-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.details || data.error || "Image generation failed");
    }

    return data.imageUrl;
  } catch (err) {
    console.log("AI error:", err);
    return { error: err.message };
  }
}

/* -------------------------
   LOADING
--------------------------*/
function showLoading() {
  trendingSection.classList.add("is-hidden");
  resultsSection.classList.remove("is-hidden");
  resultsKicker.textContent = "AI Fashion Director is working...";
  resultsTitle.textContent = "Generating cinematic outfit...";
  outfitGrid.innerHTML = "";
  generateButton.disabled = true;
}

function hideLoading() {
  generateButton.disabled = false;
}

/* -------------------------
   RENDER SINGLE AI OUTFIT
--------------------------*/
async function renderOutfit(movieName) {
  const outfit = getMovie(movieName);

  resultsKicker.textContent = "AI Fashion Result";
  resultsTitle.textContent = `Outfit inspired by ${movieName}`;

  outfitGrid.innerHTML = `
    <article class="outfit-card">
      <div class="outfit-image-wrap">
        <img id="ai-image" src="https://placehold.co/800x1000/111/fff?text=Generating..." alt="${outfit.name} outfit concept" />
      </div>

      <div class="outfit-copy">
        <span class="outfit-label">Generated look</span>
        <h3>${outfit.name}</h3>
        <p class="outfit-vibe">${outfit.vibe}</p>
        <p class="outfit-details">${outfit.details}</p>
        <p class="outfit-error" id="outfit-error" role="alert"></p>
      </div>
    </article>
  `;

  const prompt = createPrompt(movieName, outfit);
  const imageUrl = await generateAIImage(prompt);

  const img = document.getElementById("ai-image");

  const error = document.getElementById("outfit-error");

  if (imageUrl?.error) {
    img.src = "https://placehold.co/800x1000/111/fff?text=AI+Failed";
    error.textContent = imageUrl.error;
  } else if (imageUrl) {
    img.src = imageUrl;
  } else {
    img.src = "https://placehold.co/800x1000/111/fff?text=AI+Failed";
    error.textContent = "The image generator did not return an image.";
  }
}

/* -------------------------
   TRENDING SECTION
--------------------------*/
function renderTrending() {
  movieRow.innerHTML = trendingMovies.map(movie => {
    const poster = moviePosters[movie];

    return `
      <button class="movie-tile" type="button" data-movie="${movie}" aria-label="Generate outfit for ${movie}">
        <img src="${poster}" alt="${movie} poster" loading="lazy" />
        <span>${movie}</span>
      </button>
    `;
  }).join("");
}

/* -------------------------
   FORM
--------------------------*/
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const movie = movieInput.value.trim();
  if (!movie) return;

  showLoading();
  await renderOutfit(movie);
  hideLoading();
});

movieRow.addEventListener("click", (e) => {
  const movieTile = e.target.closest(".movie-tile");

  if (!movieTile) return;

  movieInput.value = movieTile.dataset.movie;
  form.requestSubmit();
});

/* -------------------------
   IMAGE LIGHTBOX
--------------------------*/
function openLightbox(image) {
  if (!lightbox || !lightboxImage) return;

  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt || "Expanded outfit image";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  lightboxImage.src = "";
  lightboxImage.alt = "";
}

outfitGrid.addEventListener("click", (e) => {
  const image = e.target.closest(".outfit-card img");

  if (!image) return;

  openLightbox(image);
});

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target === lightboxClose) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox?.classList.contains("is-open")) {
    closeLightbox();
  }
});

/* -------------------------
   INIT
--------------------------*/
renderTrending();
