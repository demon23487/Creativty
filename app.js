(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const KEYS = {
    user: "creativity_user",
    creations: "creativity_creations"
  };

  let storyText = "";
  let ideasText = "";
  let poemText = "";
  let memeText = "";
  let scenarioText = "";

  function getCreations() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.creations) || "[]");
    } catch {
      return [];
    }
  }

  function notify(message) {
    let box = $("appMessage");

    if (!box) {
      box = document.createElement("div");
      box.id = "appMessage";
      box.style.cssText =
        "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);" +
        "background:#282442;color:white;padding:12px 20px;border-radius:10px;" +
        "z-index:9999;max-width:90%;text-align:center;";
      document.body.appendChild(box);
    }

    box.textContent = message;
    clearTimeout(box.timer);
    box.timer = setTimeout(() => box.remove(), 2500);
  }

  function setText(id, text) {
    const element = $(id);
    if (element) element.textContent = text;
  }

  function getValue(id, fallback = "") {
    return $(id)?.value.trim() || fallback;
  }

  function showOutput(id, text) {
    const element = $(id);
    if (!element) return;

    element.textContent = text;
    element.style.whiteSpace = "pre-wrap";
  }

  function saveCreation(type, content) {
    if (!content.trim()) {
      notify("Create something first!");
      return;
    }

    const creations = getCreations();

    creations.unshift({
      id: Date.now(),
      type,
      content,
      date: new Date().toLocaleString()
    });

    try {
      localStorage.setItem(KEYS.creations, JSON.stringify(creations));
      renderSaved();
      notify(type + " saved successfully!");
    } catch {
      notify("Storage is full. Please delete some saved creations.");
    }
  }

  async function copyText(text) {
    if (!text.trim()) {
      notify("Create something before copying!");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      notify("Copied successfully!");
    } catch {
      const input = document.createElement("textarea");
      input.value = text;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();

      const success = document.execCommand("copy");
      input.remove();

      notify(success ? "Copied successfully!" : "Copy failed. Select the text manually.");
    }
  }

  function initTabs() {
    document.querySelectorAll(".tab[data-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.tab;

        document.querySelectorAll(".tab[data-tab]").forEach((tab) => {
          tab.classList.toggle("active", tab === button);
        });

        document.querySelectorAll(".mode-section").forEach((section) => {
          section.classList.toggle("active", section.id === target);
        });

        if (target === "saved") renderSaved();
      });
    });
  }

  function initStory() {
    $("generateStoryBtn")?.addEventListener("click", () => {
      const character = getValue("storyCharacter", "a curious explorer");
      const setting = getValue("storySetting", "a mysterious forest");
      const problem = getValue("storyProblem", "discover a hidden secret");
      const vibe = getValue("storyVibe", "adventure");

      const endings = {
        funny: "Everything ended in laughter, and the adventure became a hilarious memory.",
        adventure: "With courage and teamwork, the challenge was overcome and a new adventure began.",
        mysterious: "A final clue appeared, revealing that the mystery was only the beginning.",
        heartwarming: "In the end, friendship and kindness proved more powerful than any obstacle."
      };

      storyText =
        `${character} was exploring ${setting} when an unexpected event occurred.\n\n` +
        `The biggest challenge was to ${problem}. Although the journey was difficult, ` +
        `${character} stayed determined and searched for a clever solution.\n\n` +
        `${endings[vibe] || endings.adventure}`;

      showOutput("storyOutput", storyText);
    });

    $("saveStoryBtn")?.addEventListener("click", () =>
      saveCreation("Story", storyText)
    );

    $("copyStoryBtn")?.addEventListener("click", () =>
      copyText(storyText)
    );
  }

  function initIdeas() {
    $("generateIdeaBtn")?.addEventListener("click", () => {
      const type = getValue("ideaType", "project");
      const topic = getValue("ideaKeyword", "creativity");

      const ideas = {
        project: [
          `Build a simple website about ${topic}.`,
          `Create a quiz game that teaches people about ${topic}.`,
          `Design a poster explaining useful facts about ${topic}.`,
          `Make a short video showing creative uses of ${topic}.`,
          `Develop a small app to solve a problem related to ${topic}.`
        ],
        event: [
          `Organize a ${topic} themed quiz competition.`,
          `Host a creative workshop about ${topic}.`,
          `Arrange a team challenge based on ${topic}.`,
          `Create a fun exhibition featuring ${topic}.`,
          `Plan a costume or decoration contest inspired by ${topic}.`
        ],
        name: [
          `${topic} Spark`,
          `Creative ${topic}`,
          `${topic} Studio`,
          `BrightIdea ${topic}`,
          `${topic} World`
        ],
        challenge: [
          `Spend 15 minutes daily learning about ${topic}.`,
          `Create one new thing connected to ${topic} every day.`,
          `Teach a friend something useful about ${topic}.`,
          `Keep a journal of your ideas about ${topic}.`,
          `Try five different ways to explore ${topic}.`
        ]
      };

      ideasText = `Creative ideas for ${topic}:\n\n` +
        (ideas[type] || ideas.project)
          .map((idea, index) => `${index + 1}. ${idea}`)
          .join("\n");

      showOutput("ideaOutput", ideasText);
    });

    $("saveIdeaBtn")?.addEventListener("click", () =>
      saveCreation("Ideas", ideasText)
    );

    $("copyIdeaBtn")?.addEventListener("click", () =>
      copyText(ideasText)
    );
  }

  function initPoetry() {
    $("generatePoemBtn")?.addEventListener("click", () => {
      const color = getValue("poemColor", "golden");
      const object = getValue("poemObject", "old bicycle");
      const place = getValue("poemPlace", "quiet library");
      const feeling = getValue("poemFeeling", "hopeful");

      poemText =
        `A ${color} light shines through the day,\n` +
        `An ${object} waits along the way.\n` +
        `Inside a ${place}, dreams grow,\n` +
        `And gentle winds begin to blow.\n\n` +
        `With a heart so ${feeling} and bright,\n` +
        `Tomorrow brings another light.`;

      showOutput("poemOutput", poemText);
    });

    $("savePoemBtn")?.addEventListener("click", () =>
      saveCreation("Poem", poemText)
    );

    $("copyPoemBtn")?.addEventListener("click", () =>
      copyText(poemText)
    );
  }

  function initMeme() {
    const scenarios = [
      "When you study all night and the exam asks something else.",
      "When your teacher says the assignment is very easy.",
      "When the Wi-Fi stops working during your favourite game.",
      "When you open the fridge for the fifth time.",
      "When you promise to sleep early but start watching videos.",
      "When the exam is tomorrow and you open the book today."
    ];

    $("newScenarioBtn")?.addEventListener("click", () => {
      scenarioText = scenarios[Math.floor(Math.random() * scenarios.length)];
      setText("memeScenario", scenarioText);
    });

    $("buildMemeBtn")?.addEventListener("click", () => {
      const top = getValue("memeCaption1", "MY EXPECTATIONS");
      const bottom = getValue("memeCaption2", "REALITY HAS OTHER PLANS");

      memeText = `${top.toUpperCase()}\n\n${scenarioText || "A normal day"}\n\n${bottom.toUpperCase()}`;
      showOutput("memeOutput", memeText);
    });

    $("saveMemeBtn")?.addEventListener("click", () =>
      saveCreation("Meme", memeText)
    );

    $("copyMemeBtn")?.addEventListener("click", () =>
      copyText(memeText)
    );
  }

  function renderSaved() {
    const container = $("savedList");
    if (!container) return;

    container.replaceChildren();

    const creations = getCreations();

    if (!creations.length) {
      const message = document.createElement("p");
      message.textContent = "No saved creations yet. Make something first!";
      container.appendChild(message);
      return;
    }

    creations.forEach((creation) => {
      const card = document.createElement("article");
      card.className = "saved-card";

      const heading = document.createElement("h3");
      heading.textContent = creation.type || "Creation";

      const date = document.createElement("small");
      date.textContent = creation.date || "";

      const content = document.createElement("p");
      content.textContent = creation.content || "";
      content.style.whiteSpace = "pre-wrap";

      const copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.textContent = "Copy";
      copyButton.addEventListener("click", () => copyText(creation.content || ""));

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";

      deleteButton.addEventListener("click", () => {
        const updated = getCreations().filter(
          (item) => item.id !== creation.id
        );

        localStorage.setItem(KEYS.creations, JSON.stringify(updated));
        renderSaved();
        notify("Creation deleted.");
      });

      card.append(heading, date, content, copyButton, deleteButton);
      container.appendChild(card);
    });
  }

  function initLogout() {
    const logoutButton = $("logoutBtn");
    if (!logoutButton) return;

    logoutButton.addEventListener("click", () => {
      localStorage.removeItem(KEYS.user);
      notify("You have logged out.");
    });
  }

  function init() {
    const user = (() => {
      try {
        return JSON.parse(localStorage.getItem(KEYS.user) || "null");
      } catch {
        return null;
      }
    })();

    setText("userInfo", user?.username ? `Welcome, ${user.username}!` : "Welcome, Creator!");

    initTabs();
    initStory();
    initIdeas();
    initPoetry();
    initMeme();
    initLogout();
    renderSaved();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
