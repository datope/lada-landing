import { chromium } from 'playwright';
import fs from 'fs';

const existing = fs.existsSync('stats.json') ? JSON.parse(fs.readFileSync('stats.json')) : {};

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('https://sbox.game/teamx/xproject', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2000);
const text = await page.locator('body').innerText();
await browser.close();

// Total players: "1.7k players" — require k suffix to avoid matching small online count
const total   = text.match(/([\d.]+k)\s*players/i);
// Online: "● 3" pattern (live dot + number)
const online  = text.match(/●\s*(\d+)/);
// Playtime: "324 hours playtime"
const hours   = text.match(/([\d.,]+)\s*hours?\s*playtime/i);

const onlineNum = online ? parseInt(online[1]) : 0;

const stats = {
  players:  total  ? total[1].toUpperCase()                                 : (existing.players  ?? '1.7K'),
  playtime: hours  ? Math.round(parseFloat(hours[1].replace(/,/g,''))) + 'h' : (existing.playtime ?? '321h'),
  online:   onlineNum > 0 ? onlineNum : 0,
  updated:  new Date().toISOString(),
};

console.log('Stats:', stats);
fs.writeFileSync('stats.json', JSON.stringify(stats, null, 2));
