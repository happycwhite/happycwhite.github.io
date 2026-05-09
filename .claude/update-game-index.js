#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const GAME_DIR = path.join(__dirname, '..', 'game');
const INDEX_FILE = path.join(GAME_DIR, 'index.html');

function getTitle(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const m = content.match(/<title>(.*?)<\/title>/i);
    return m ? m[1] : path.basename(filepath);
  } catch {
    return path.basename(filepath);
  }
}

function getExistingCards(indexContent) {
  const cards = {};
  const pattern = /<a class="game-card" href="([^"]+)">\s*<div class="game-icon">([^<]+)<\/div>\s*<div class="game-title">([^<]+)<\/div>\s*<div class="game-desc">([^<]*)<\/div>\s*<\/a>/gs;
  for (const m of indexContent.matchAll(pattern)) {
    const [, href, icon, title, desc] = m;
    cards[href] = { icon: icon.trim(), title: title.trim(), desc: desc.trim() };
  }
  return cards;
}

const games = fs.readdirSync(GAME_DIR)
  .filter(f => f.endsWith('.html') && f !== 'index.html')
  .sort();

let existingCards = {};
if (fs.existsSync(INDEX_FILE)) {
  existingCards = getExistingCards(fs.readFileSync(INDEX_FILE, 'utf8'));
}

const cards = games.map(gameFile => {
  if (existingCards[gameFile]) {
    return { href: gameFile, ...existingCards[gameFile] };
  }
  return { href: gameFile, icon: '🎮', title: getTitle(path.join(GAME_DIR, gameFile)), desc: '' };
});

const cardsHtml = cards.map(c =>
  `<a class="game-card" href="${c.href}">\n      <div class="game-icon">${c.icon}</div>\n      <div class="game-title">${c.title}</div>\n      <div class="game-desc">${c.desc}</div>\n    </a>`
).join('\n    ');

const html = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>遊戲列表</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background: #1a1a2e;
      color: #eee;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 40px;
      color: #e0aaff;
      letter-spacing: 2px;
    }

    .game-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 24px;
      width: 100%;
      max-width: 800px;
    }

    .game-card {
      background: #16213e;
      border: 1px solid #0f3460;
      border-radius: 12px;
      padding: 28px 24px;
      text-decoration: none;
      color: inherit;
      transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .game-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(224, 170, 255, 0.2);
      border-color: #e0aaff;
    }

    .game-icon {
      font-size: 2.4rem;
    }

    .game-title {
      font-size: 1.2rem;
      font-weight: bold;
      color: #e0aaff;
    }

    .game-desc {
      font-size: 0.9rem;
      color: #aaa;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <h1>遊戲列表</h1>
  <div class="game-list">
    ${cardsHtml}
  </div>
</body>
</html>
`;

fs.writeFileSync(INDEX_FILE, html, 'utf8');
console.log(`index.html updated: ${cards.length} game(s) — ${cards.map(c => c.href).join(', ')}`);
