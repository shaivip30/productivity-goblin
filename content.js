const distractingSites = [
  "youtube.com", "instagram.com", "reddit.com", "x.com",
];

const roasts = [
  "Back again? Incredible lack of self-control.",
  "Your goblin is watching in horror.",
  "This could have been an email.",
  "Locked in? More like logged out mentally.",
  "Productivity has left the chat.",
  "You've visited this 4 times today. Pathetic.",
  "The goblin is disappointed. Again.",
  "Skill issue: touching grass.",
  "Your future self is cringing rn.",
  "bro said 'just 5 mins' 40 mins ago",
  "This site has defeated you. Again.",
];

const currentSite = window.location.hostname.replace("www.", "");
if (distractingSites.includes(currentSite)) showGoblinOverlay();

function showGoblinOverlay() {
  // Guard against duplicate overlays (SPAs re-trigger content scripts)
  if (document.getElementById("goblin-overlay")) return;

  // Inject font if not already present
  if (!document.querySelector("#goblin-font")) {
    const font = document.createElement("link");
    font.id   = "goblin-font";
    font.rel  = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap";
    document.head.appendChild(font);
  }

  const roast = roasts[Math.floor(Math.random() * roasts.length)];

  const overlay = document.createElement("div");
  overlay.id = "goblin-overlay";
  overlay.innerHTML = `
    <div style="
      font-family: 'Press Start 2P', monospace;
      font-size: 7px;
      color: #ffe066;
      text-shadow: 1px 1px 0 #8a7000;
      margin-bottom: 8px;
      letter-spacing: 1px;
    ">👺 GOBLIN SAYS</div>
    <div style="font-size: 18px; line-height: 1.6;">${roast}</div>
  `;

  Object.assign(overlay.style, {
    position:      "fixed",
    bottom:        "20px",
    right:         "20px",
    background:    "#0a160a",
    color:         "#3aff3a",
    fontFamily:    "'VT323', monospace",
    padding:       "14px 18px",
    border:        "2px solid #3aff3a",
    borderRadius:  "0px",
    outline:       "1px solid #3aff3a33",
    outlineOffset: "3px",
    boxShadow:     "4px 4px 0 #1a8a1a",
    maxWidth:      "260px",
    zIndex:        "999999",
    transition:    "opacity 0.4s steps(5), transform 0.4s steps(5)",
    opacity:       "0",
    transform:     "translateY(12px)",
  });

  document.body.appendChild(overlay);

  // Animate IN
  setTimeout(() => {
    overlay.style.opacity   = "1";
    overlay.style.transform = "translateY(0)";
  }, 100);

  // Animate OUT
  setTimeout(() => {
    overlay.style.opacity   = "0";
    overlay.style.transform = "translateY(20px)";
    setTimeout(() => overlay.remove(), 400);
  }, 5000);
}