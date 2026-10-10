<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#6c5ce7">
  <title>Creativity Page</title>
  <link rel="stylesheet" href="./style.css">
</head>

<body>
  <div class="app">

    <header>
      <h1>🎨 Creativity Page</h1>
      <p class="tagline">
        A playful space to create stories, ideas, poems, and memes
      </p>
      <div id="userInfo" class="user-info"></div>
      <button id="logoutBtn" class="small-btn" type="button">
        Logout
      </button>
    </header>

    <nav class="tabs" aria-label="Creative tools">
      <button type="button" class="tab active" data-tab="story">
        Story Builder
      </button>
      <button type="button" class="tab" data-tab="idea">
        Idea Jam
      </button>
      <button type="button" class="tab" data-tab="poetry">
        Poetry Maker
      </button>
      <button type="button" class="tab" data-tab="meme">
        Meme Lab
      </button>
      <button type="button" class="tab" data-tab="saved">
        Saved Creations
      </button>
    </nav>

    <!-- STORY BUILDER -->
    <section id="story" class="mode-section active">
      <h2>Story Builder</h2>
      <p>Answer a few fun prompts and get a short story.</p>

      <div class="form-group">
        <label for="storyCharacter">Main character:</label>
        <input type="text" id="storyCharacter"
          placeholder="e.g. A curious cat">
      </div>

      <div class="form-group">
        <label for="storySetting">Setting:</label>
        <input type="text" id="storySetting"
          placeholder="e.g. Mysuru Palace at night">
      </div>

      <div class="form-group">
        <label for="storyProblem">Problem or goal:</label>
        <input type="text" id="storyProblem"
          placeholder="e.g. Find a hidden treasure">
      </div>

      <div class="form-group">
        <label for="storyVibe">Vibe:</label>
        <select id="storyVibe">
          <option value="funny">Funny</option>
          <option value="adventure">Adventure</option>
          <option value="mysterious">Mysterious</option>
          <option value="heartwarming">Heartwarming</option>
        </select>
      </div>

      <button type="button" id="generateStoryBtn" class="primary">
        ✨ Create Story
      </button>
      <button type="button" id="saveStoryBtn" class="secondary">
        💾 Save Story
      </button>

      <div class="output-card">
        <h3>Your Story</h3>
        <div id="storyOutput" class="output" aria-live="polite">
          Your story will appear here…
        </div>
        <button type="button" id="copyStoryBtn">📋 Copy Story</button>
      </div>
    </section>

    <!-- IDEA JAM -->
    <section id="idea" class="mode-section">
      <h2>Idea Jam</h2>
      <p>Generate creative ideas for projects, events, names, and more.</p>

      <div class="form-group">
        <label for="ideaType">What do you need ideas for?</label>
        <select id="ideaType">
          <option value="project">Project idea</option>
          <option value="event">Event / party theme</option>
          <option value="name">Name (app, brand, character)</option>
          <option value="challenge">Personal challenge</option>
        </select>
      </div>

      <div class="form-group">
        <label for="ideaKeyword">Topic or keyword (optional):</label>
        <input type="text" id="ideaKeyword"
          placeholder="e.g. space, food, Mysuru, games">
      </div>

      <button type="button" id="generateIdeaBtn" class="primary">
        💡 Generate Ideas
      </button>
      <button type="button" id="saveIdeaBtn" class="secondary">
        💾 Save Ideas
      </button>

      <div class="output-card">
        <h3>Your Ideas</h3>
        <div id="ideaOutput" class="output" aria-live="polite">
          Ideas will appear here…
        </div>
        <button type="button" id="copyIdeaBtn">📋 Copy Ideas</button>
      </div>
    </section>

    <!-- POETRY MAKER -->
    <section id="poetry" class="mode-section">
      <h2>Poetry Maker</h2>
      <p>Fill in the blanks and create a short poem.</p>

      <div class="form-group">
        <label for="poemColor">A color:</label>
        <input type="text" id="poemColor" placeholder="e.g. golden">
      </div>

      <div class="form-group">
        <label for="poemObject">An object:</label>
        <input type="text" id="poemObject" placeholder="e.g. old bicycle">
      </div>

      <div class="form-group">
        <label for="poemPlace">A place:</label>
        <input type="text" id="poemPlace" placeholder="e.g. quiet library">
      </div>

      <div class="form-group">
        <label for="poemFeeling">A feeling:</label>
        <input type="text" id="poemFeeling" placeholder="e.g. hopeful">
      </div>

      <button type="button" id="generatePoemBtn" class="primary">
        📜 Create Poem
      </button>
      <button type="button" id="savePoemBtn" class="secondary">
        💾 Save Poem
      </button>

      <div class="output-card">
        <h3>Your Poem</h3>
        <div id="poemOutput" class="output" aria-live="polite">
          Your poem will appear here…
        </div>
        <button type="button" id="copyPoemBtn">📋 Copy Poem</button>
      </div>
    </section>

    <!-- MEME LAB -->
    <section id="meme" class="mode-section">
      <h2>Meme Lab</h2>
      <p>Get a funny scenario and create your own meme captions.</p>

      <button type="button" id="newScenarioBtn" class="primary">
        🎲 New Scenario
      </button>
      <button type="button" id="saveMemeBtn" class="secondary">
        💾 Save Meme
      </button>

      <div class="output-card">
        <h3>Scenario</h3>
        <div id="memeScenario" class="output" aria-live="polite">
          Click "New Scenario" to start…
        </div>
      </div>

      <div class="form-group">
        <label for="memeCaption1">Caption 1:</label>
        <input type="text" id="memeCaption1" placeholder="Top text">
      </div>

      <div class="form-group">
        <label for="memeCaption2">Caption 2:</label>
        <input type="text" id="memeCaption2" placeholder="Bottom text">
      </div>

      <button type="button" id="buildMemeBtn" class="primary">
        🧠 Build Meme Text
      </button>

      <div class="output-card">
        <h3>Your Meme</h3>
        <div id="memeOutput" class="output" aria-live="polite">
          Your meme text will appear here…
        </div>
        <button type="button" id="copyMemeBtn">📋 Copy Meme</button>
      </div>
    </section>

    <!-- SAVED CREATIONS -->
    <section id="saved" class="mode-section">
      <h2>Saved Creations</h2>
      <p>Your saved stories, ideas, poems, and memes.</p>

      <div id="savedList" class="saved-list">
        <p>Loading your creations…</p>
      </div>
    </section>

    <footer>
      <p>Made with ❤️ for creative minds like you.</p>
    </footer>

  </div>

  <!-- Set the page mode BEFORE loading JavaScript -->
  <script>
    window.AUTH_PAGE = false;
  </script>
  <script src="./app.js" defer></script>
</body>
</html>
