const productiveSites = ["github.com", "leetcode.com", "chatgpt.com", "claude.ai", "notion.so", "figma.com", "stackoverflow.com", "coursera.org", "udemy.com", "edx.org", "kaggle.com", "freecodecamp.org", "roadmap.sh", "developer.mozilla.org", "docs.google.com", "linear.app", "vercel.com", "netlify.app", "replit.com", "deepseek.com", "perplexity.ai", "huggingface.co", "canva.com", "medium.com", "geeksforgeeks.org"];
const distractingSites = ["youtube.com", "instagram.com", "reddit.com", "x.com", "facebook.com", "netflix.com", "primevideo.com", "hotstar.com", "tiktok.com", "snapchat.com", "9gag.com", "pinterest.com", "discord.com", "twitch.tv", "spotify.com", "linkedin.com", "quora.com", "tumblr.com", "buzzfeed.com", "ifunny.co", "c.ai", "character.ai", "web.whatsapp.com", "messenger.com", "telegram.org"];

const happyRoasts = [
  "Goblin is impressed. Suspiciously impressed.",
  "Productivity detected. Rare event.",
  "You actually worked today.",
  "Your goblin believes in you again.",
  "Your tabs are behaving for once.",
  "Focused? In this economy?",
  "Goblin approves of this academic comeback.",
  "You resisted doomscrolling. Historic moment.",
  "Productivity levels rising. Goblin is frightened.",
  "Your future self whispered: finally.",
  "You cooked today. Digitally speaking.",
  "Goblin has stopped preparing your downfall.",
  "This much focus was not expected from you.",
  "Your attention span survived another day.",
  "The goblin council acknowledges your efforts.",
  "You opened YouTube and LEFT. Incredible.",
  "Goblin mood upgraded from concerned to hopeful.",
  "Work was completed. Miracles continue.",
  "You may actually beat the allegations.",
  "Goblin grants you temporary respect."
];

const angryRoasts = [
  "Your attention span is collapsing.",
  "You opened YouTube again?",
  "Goblin is deeply disappointed.",
  "Multitasking? No. Just distracted.",
  "Back on the dopamine treadmill, huh?",
  "Your goblin is taking psychic damage.",
  "This could have been productive.",
  "You switched tabs 14 times in 2 minutes.",
  "Locked in? More like locked out mentally.",
  "Your future self is filing complaints.",
  "Goblin watched you open Instagram with confidence.",
  "Productivity has left the chat.",
  "One more short-form video should fix your life.",
  "Your browser history scares the goblin.",
  "You are one tab away from complete brainrot.",
  "Goblin expected nothing and is still disappointed.",
  "This is not what the ancestors fought for.",
  "You opened a new tab and immediately forgot why.",
  "The goblin has stopped defending you.",
  "YouTube autoplay owns your soul now.",
  "Your focus lasted shorter than a loading screen.",
  "Goblin recommends touching grass immediately.",
  "Your tabs are reproducing uncontrollably.",
  "That was not research and you know it.",
  "The productivity streak died heroically.",
  "Goblin is updating your clown statistics.",
  "You entered the distraction dungeon willingly.",
  "Your concentration is running on 1 HP.",
  "Even the goblin cannot justify this behavior.",
  "Another hour vanished mysteriously. Fascinating."
];

const ALL_ACHIEVEMENTS = [
  { id: "locked_in",    icon: "🏆", label: "Locked In" },
  { id: "code_goblin",  icon: "💻", label: "Code Goblin" },
  { id: "brainrot",     icon: "🧠", label: "Brainrot" },
  { id: "tab_wanderer", icon: "🕸️", label: "Tab Wanderer" },
];

chrome.storage.local.get(["trackingData"], (result) => {
  const data = result.trackingData || {};

  let productiveTime = 0;
  let distractingTime = 0;

  // --- BROWSER LOG (now inside a card) ---
  const statsDiv = document.getElementById("stats");
  statsDiv.innerHTML = "";

  Object.entries(data).forEach(([site, time]) => {
    const minutes = Math.floor(time / 1000 / 60);
    if (minutes <= 0) return;

    const row = document.createElement("div");
    row.className = "site";
    row.innerHTML = `<span>${site}</span><span class="xp-amount">${minutes} min</span>`;
    statsDiv.appendChild(row);

    if (productiveSites.includes(site)) productiveTime += time;
    if (distractingSites.includes(site)) distractingTime += time;
  });

  if (statsDiv.children.length === 0) {
    statsDiv.innerHTML = `<div class="site" style="color:#4a6a4a">No activity yet.</div>`;
  }

  // --- XP + LEVEL ---
  let xp = Math.floor(productiveTime / 60000) * 10;
  xp -= Math.floor(distractingTime / 60000) * 5;
  if (xp < 0) xp = 0;

  const level = Math.floor(xp / 100) + 1;
  const currentLevelXP = xp % 100;

  let title = "Tiny Menace";
  if (level >= 2) title = "Cave Goblin";
  if (level >= 3) title = "Productivity Gremlin";
  if (level >= 5) title = "Focus Fiend";
  if (level >= 8) title = "Chaos Wizard";

  document.getElementById("level").textContent = `Level ${level}`;
  document.getElementById("title").textContent = title;
  document.getElementById("xp").textContent = `${currentLevelXP} / 100 XP`;

  // XP bar — fixed: was using raw xp, now uses currentLevelXP
  document.getElementById("xp-fill").style.width = `${currentLevelXP}%`;

  // --- ACHIEVEMENTS (unlocked + locked) ---
  const unlockedIds = new Set();
  if (productiveTime > distractingTime)        unlockedIds.add("locked_in");
  if (productiveTime >= 60 * 60 * 1000)        unlockedIds.add("code_goblin");
  if (distractingTime >= 2 * 60 * 60 * 1000)  unlockedIds.add("brainrot");
  if (Object.keys(data).length >= 5)           unlockedIds.add("tab_wanderer");

  const achievementsDiv = document.getElementById("achievements");
  achievementsDiv.innerHTML = "";

  ALL_ACHIEVEMENTS.forEach(({ id, icon, label }) => {
    const p = document.createElement("p");
    if (unlockedIds.has(id)) {
      p.className = "achievement";
      p.textContent = `${icon} ${label}`;
    } else {
      p.className = "achievement locked";
      p.textContent = `🔒 ${label}`;
    }
    achievementsDiv.appendChild(p);
  });

  // --- MOOD + GOBLIN ---
  const mood   = document.getElementById("mood");
  const goblin = document.getElementById("goblin");
  const roast  = document.getElementById("roast");

  if (productiveTime > distractingTime) {
    mood.textContent  = "Goblin is proud.";
    goblin.src        = "assets/happy.png";
    roast.textContent = happyRoasts[Math.floor(Math.random() * happyRoasts.length)];
  } else {
    mood.textContent  = "Goblin is disappointed.";
    goblin.src        = "assets/angry.png";
    roast.textContent = angryRoasts[Math.floor(Math.random() * angryRoasts.length)];
  }
});

// --- RESET ---
document.getElementById("reset").addEventListener("click", () => {
  chrome.storage.local.clear(() => location.reload());
});