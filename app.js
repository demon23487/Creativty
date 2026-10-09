const IS_AUTH_PAGE = window.AUTH_PAGE !== false;

if (IS_AUTH_PAGE) {
  initAuthPage();
} else {
  initMainApp();
}



function initAuthPage() {
  const form = document.getElementById("authForm");
  const messageEl = document.getElementById("authMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      messageEl.textContent = "Please enter username and password.";
      messageEl.style.color = "#d63031";
      return;
    }

    try {
      const res = await fetch("api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "auth",
          username,
          password,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        localStorage.setItem("cp_user", JSON.stringify({
          username: data.username,
          token: data.token,
        }));
        window.location.href = "index.html";
      } else {
        messageEl.textContent = data.error || "Login failed.";
        messageEl.style.color = "#d63031";
      }
    } catch (err) {
      console.error(err);
      messageEl.textContent = "Network error.";
      messageEl.style.color = "#d63031";
    }
  });
}


function initMainApp() {
  const userRaw = localStorage.getItem("cp_user");
  if (!userRaw) {
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(userRaw);
  const userInfo = document.getElementById("userInfo");
  const logoutBtn = document.getElementById("logoutBtn");

  userInfo.textContent = `Logged in as: ${user.username}`;

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("cp_user");
    window.location.href = "login.html";
  });

  initTabs();
  initStory(user);
  initIdea(user);
  initPoetry(user);
  initMeme(user);
  loadSavedCreations(user);
}

function initTabs() {
  const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll(".mode-section");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));

      tab.classList.add("active");
      const target = tab.getAttribute("data-tab");
      document.getElementById(target).classList.add("active");

      if (target === "saved") {
        const user = JSON.parse(localStorage.getItem("cp_user"));
        loadSavedCreations(user);
      }
    });
  });
}

function apiHeaders(user) {
  return {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + user.token,
  };
}


function initStory(user) {
  const generateStoryBtn = document.getElementById("generateStoryBtn");
  const saveStoryBtn = document.getElementById("saveStoryBtn");
  const storyOutput = document.getElementById("storyOutput");
  const copyStoryBtn = document.getElementById("copyStoryBtn");

  generateStoryBtn.addEventListener("click", () => {
    const character = document.getElementById("storyCharacter").value.trim() || "a curious hero";
    const setting = document.getElementById("storySetting").value.trim() || "a magical place";
    const problem = document.getElementById("storyProblem").value.trim() || "solve a big mystery";
    const vibe = document.getElementById("storyVibe").value;

    const openers = [
      `One day, ${character} decided to explore ${setting}.`,
      `In ${setting}, ${character} was known for being unusually brave.`,
      `${character} had always dreamed of visiting ${setting}.`,
    ];

    const conflicts = [
      `But there was a problem: ${problem}.`,
      `Everything changed when ${problem}.`,
      `Life got complicated because ${problem}.`,
    ];

    const vibes = {
      funny: [
        "Naturally, things went hilariously wrong before they went right.",
        "Somehow, this led to a very awkward but funny situation.",
        "And yes, there was at least one embarrassing moment involved.",
      ],
      adventure: [
        "This was the start of an unforgettable adventure.",
        "Every step forward felt like a new discovery.",
        "Danger and excitement waited around every corner.",
      ],
      mysterious: [
        "Nothing here was as simple as it seemed.",
        "Secrets hid in the smallest details.",
        "Something about this place felt deeply strange.",
      ],
      heartwarming: [
        "Along the way, kindness appeared in unexpected places.",
        "It turned out that help was closer than anyone thought.",
        "In the end, what mattered most was connection.",
      ],
    };

    const endings = [
      "In the end, our hero learned that courage comes in many forms.",
      "And so, life in this place was never quite the same again.",
      "This story became a small legend that people liked to tell.",
    ];

    const story =
      randomItem(openers) + " " +
      randomItem(conflicts) +" " +
      randomItem(vibes[vibe]) +" " +
      randomItem(endings);

    storyOutput.textContent = story;
  });

  copyStoryBtn.addEventListener("click", () => {
    const text = storyOutput.textContent;
    if (!text.trim() || text.includes("will appear here")) {
      alert("No story yet.");
      return;
    }
    navigator.clipboard.writeText(text).then(() => alert("Story copied!"));
  });

  saveStoryBtn.addEventListener("click", async () => {
    const text = storyOutput.textContent;
    if (!text.trim() || text.includes("will appear here")) {
      alert("No story to save.");
      return;
    }

    try {
      const res = await fetch("api.php", {
        method: "POST",
        headers: apiHeaders(user),
        body: JSON.stringify({
          action: "save",
          type: "story",
          content: text,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        alert("Story saved!");
      } else {
        alert("Save failed: " + (data.error || "unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error while saving.");
    }
  });
}


function initIdea(user) {
  const generateIdeaBtn = document.getElementById("generateIdeaBtn");
  const saveIdeaBtn = document.getElementById("saveIdeaBtn");
  const ideaOutput = document.getElementById("ideaOutput");
  const copyIdeaBtn = document.getElementById("copyIdeaBtn");

  generateIdeaBtn.addEventListener("click", () => {
    const type = document.getElementById("ideaType").value;
    const keyword = document.getElementById("ideaKeyword").value.trim();

    const baseIdeas = {
      project: [
        "An app that helps students track assignments with fun rewards.",
        "A website that shares local stories from people in your city.",
        "A challenge tracker that turns habits into a game.",
        "A platform where users swap skills instead of money.",
      ],
      event: [
        "A ‘mystery picnic’ where teams get clues to find food spots.",
        "A movie night where everyone brings a film from their childhood.",
        "A ‘no phones’ hangout with board games and music.",
        "A cultural potluck where each dish has a story behind it.",
      ],
      name: [
        "SparkLab",
        "IdeaNest",
        "MindMingle",
        "Creativity Cove",
        "BrainBloom",
      ],
      challenge: [
        "7 days of creating one small thing daily (drawing, poem, idea).",
        "Talk to one new person every day for a week.",
        "Learn the basics of a new skill in 5 days.",
        "Spend 30 minutes daily outside without your phone.",
      ],
    };

    let ideas = baseIdeas[type] || baseIdeas.project;

    if (keyword) {
      ideas = ideas.map((idea) => {
        if (Math.random() > 0.5) {
          return idea + ` (bonus twist: include '${keyword}')`;
        }
        return idea;
      });
    }

    ideas = ideas.sort(() => 0.5 - Math.random()).slice(0, 3);

    const header =
      type === "project"
        ? "Project ideas:"
        : type === "event"
        ? "Event/theme ideas:"
        : type === "name"
        ? "Name ideas:"
        : "Challenge ideas:";

    ideaOutput.textContent = header + "- " + ideas.join("- ");
  });

  copyIdeaBtn.addEventListener("click", () => {
    const text = ideaOutput.textContent;
    if (!text.trim() || text.includes("will appear here")) {
      alert("No ideas yet.");
      return;
    }
    navigator.clipboard.writeText(text).then(() => alert("Ideas copied!"));
  });

  saveIdeaBtn.addEventListener("click", async () => {
    const text = ideaOutput.textContent;
    if (!text.trim() || text.includes("will appear here")) {
      alert("No ideas to save.");
      return;
    }

    try {
      const res = await fetch("api.php", {
        method: "POST",
        headers: apiHeaders(user),
        body: JSON.stringify({
          action: "save",
          type: "idea",
          content: text,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        alert("Ideas saved!");
      } else {
        alert("Save failed: " + (data.error || "unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error while saving.");
    }
  });
}


function initPoetry(user) {
  const generatePoemBtn = document.getElementById("generatePoemBtn");
  const savePoemBtn = document.getElementById("savePoemBtn");
  const poemOutput = document.getElementById("poemOutput");
  const copyPoemBtn = document.getElementById("copyPoemBtn");

  generatePoemBtn.addEventListener("click", () => {
    const color = document.getElementById("poemColor").value.trim() || "bright";
    const obj = document.getElementById("poemObject").value.trim() || "something old";
    const place = document.getElementById("poemPlace").value.trim() || "a quiet corner";
    const feeling = document.getElementById("poemFeeling").value.trim() || "hopeful";

    const poem =
      `In ${place}, where shadows softly play,` +
      `A ${color} light finds its way.` +
      `On ${obj}, time leaves its trace,` +
      `And ${feeling} fills this quiet space.` +
      `Moments gather, slow and deep,` +
      `Like promises the heart will keep.`;
    poemOutput.textContent = poem;
  });

  copyPoemBtn.addEventListener("click", () => {
    const text = poemOutput.textContent;
    if (!text.trim() || text.includes("will appear here")) {
      alert("No poem yet.");
      return;
    }
    navigator.clipboard.writeText(text).then(() => alert("Poem copied!"));
  });

  savePoemBtn.addEventListener("click", async () => {
    const text = poemOutput.textContent;
    if (!text.trim() || text.includes("will appear here")) {
      alert("No poem to save.");
      return;
    }

    try {
      const res = await fetch("api.php", {
        method: "POST",
        headers: apiHeaders(user),
        body: JSON.stringify({
          action: "save",
          type: "poem",
          content: text,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        alert("Poem saved!");
      } else {
        alert("Save failed: " + (data.error || "unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error while saving.");
    }
  });
}



function initMeme(user) {
  const newScenarioBtn = document.getElementById("newScenarioBtn");
  const saveMemeBtn = document.getElementById("saveMemeBtn");
  const memeScenario = document.getElementById("memeScenario");
  const buildMemeBtn = document.getElementById("buildMemeBtn");
  const memeOutput = document.getElementById("memeOutput");
  const copyMemeBtn = document.getElementById("copyMemeBtn");

  const scenarios = [
    "When you say ‘just 5 more minutes’ but fall asleep for 2 hours.",
    "When you open the fridge 10 times hoping new food appeared.",
    "When you pretend to be busy as soon as a teacher/parent walks in.",
    "When you remember an embarrassing moment from 5 years ago at 2 AM.",
    "When you say ‘I’ll start tomorrow’ for the 100th time.",
    "When you try to act normal after sending a message with typos.",
    "When you hear your name in a conversation and instantly get curious.",
  ];

  newScenarioBtn.addEventListener("click", () => {
    memeScenario.textContent = randomItem(scenarios);
  });

  buildMemeBtn.addEventListener("click", () => {
    const scenario = memeScenario.textContent.trim();
    const cap1 = document.getElementById("memeCaption1").value.trim();
    const cap2 = document.getElementById("memeCaption2").value.trim();

    if (!scenario || scenario.includes("Click")) {
      alert("Generate a scenario first.");
      return;
    }

    const memeText =
      `Scenario: ${scenario}` +
      `Top text: ${cap1 || "(no top text)"}` +
      `Bottom text: ${cap2 || "(no bottom text)"}`;

    memeOutput.textContent = memeText;
  });

  copyMemeBtn.addEventListener("click", () => {
    const text = memeOutput.textContent;
    if (!text.trim() || text.includes("will appear here")) {
      alert("No meme yet.");
      return;
    }
    navigator.clipboard.writeText(text).then(() => alert("Meme text copied!"));
  });

  saveMemeBtn.addEventListener("click", async () => {
    const text = memeOutput.textContent;
    if (!text.trim() || text.includes("will appear here")) {
      alert("No meme to save.");
      return;
    }

    try {
      const res = await fetch("api.php", {
        method: "POST",
        headers: apiHeaders(user),
        body: JSON.stringify({
          action: "save",
          type: "meme",
          content: text,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        alert("Meme saved!");
      } else {
        alert("Save failed: " + (data.error || "unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error while saving.");
    }
  });
}



function loadSavedCreations(user) {
  const savedList = document.getElementById("savedList");
  savedList.innerHTML = "<p>Loading your creations…</p>";

  fetch("api.php", {
    method: "POST",
    headers: apiHeaders(user),
    body: JSON.stringify({ action: "list" }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.ok || !data.items || data.items.length === 0) {
        savedList.innerHTML = "<p>No saved creations yet.</p>";
        return;
      }

      savedList.innerHTML = "";
      data.items.forEach((item) => {
        const div = document.createElement("div");
        div.className = "saved-item";

        const title =
          item.type === "story"
            ? "📖 Story"
            : item.type === "idea"
            ? "💡 Ideas"
            : item.type === "poem"
            ? "📜 Poem"
            : "🧠 Meme";

        const date = new Date(item.created_at * 1000).toLocaleString();

        div.innerHTML = `
          <h4>${title}</h4>
          <div class="meta">Saved on: ${date}</div>
          <div class="content">${escapeHtml(item.content)}</div>`;

        savedList.appendChild(div);
      });
    })
    .catch((err) => {
      console.error(err);
      savedList.innerHTML = "<p>Error loading creations.</p>";
    });
}



function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
