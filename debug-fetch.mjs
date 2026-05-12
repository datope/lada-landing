import fetch from 'node-fetch';
import fs from 'fs';

const res = await fetch('https://sbox.game/teamx/xproject', {
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' }
});
const html = await res.text();

const matches = html.match(/.{0,60}(?:player|session|playtime|hours).{0,60}/gi);
console.log('=== MATCHES ===');
matches?.slice(0, 20).forEach(m => console.log(m.trim()));

fs.writeFileSync('debug-snippet.txt', html.slice(0, 30000));
console.log('\nFirst 30k chars saved to debug-snippet.txt');
