import { chromium } from 'playwright';
import fs from 'fs';

const fallback = JSON.parse(fs.existsSync('stats.json') ? fs.readFileSync('stats.json') : '{}');

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto('https://sbox.game/teamx/xproject', { waitUntil: 'networkidle', timeout: 30000 });

const text = await page.locator('body').innerText();
await browser.close();

const players  = text.match(/([\d.,]+k?)\s*players/i);
const hours    = text.match(/([\d.,]+)\s*hours?\s*playtime/i);

const stats = {
  players:  players ? players[1].toUpperCase() : (fallback.players ?? '1.7K'),
  playtime: hours   ? Math.round(parseFloat(hours[1].replace(/,/g,''))) + 'h' : (fallback.playtime ?? '321h'),
  updated:  new Date().toISOString(),
};

console.log('Stats:', stats);
fs.writeFileSync('stats.json', JSON.stringify(stats, null, 2));
