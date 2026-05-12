import fetch from 'node-fetch';
import fs from 'fs';

const URL = 'https://sbox.game/teamx/xproject';

// Current fallback values
const fallback = { players: '1.7K', playtime: '321h', updated: null };

async function fetchStats() {
  const res = await fetch(URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; stats-bot/1.0)' }
  });
  const html = await res.text();

  // Extract numbers from SSR HTML using sbox's known patterns
  const players = html.match(/(\d[\d.,]+)\s*(?:k\s*)?players/i);
  const hours   = html.match(/(\d[\d.,]+)\s*hours?\s*playtime/i);

  const stats = {
    players:  players ? formatNum(players[1]) : fallback.players,
    playtime: hours   ? formatHours(hours[1]) : fallback.playtime,
    updated:  new Date().toISOString(),
  };

  console.log('Stats:', stats);
  fs.writeFileSync('stats.json', JSON.stringify(stats, null, 2));
}

function formatNum(raw) {
  const n = parseFloat(raw.replace(/,/g, ''));
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(Math.round(n));
}

function formatHours(raw) {
  return Math.round(parseFloat(raw.replace(/,/g, ''))) + 'h';
}

fetchStats().catch(err => {
  console.error('Failed to fetch stats:', err.message);
  // Write fallback so the file always exists
  if (!fs.existsSync('stats.json')) {
    fs.writeFileSync('stats.json', JSON.stringify(fallback, null, 2));
  }
  process.exit(0); // don't fail the action
});
