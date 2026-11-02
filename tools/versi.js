// Naikkan versi game sebelum push: node tools/versi.js
// Menulis versi.json, <meta name="versi"> dan ?v=<versi> di semua css/js lokal di index.html,
// supaya tombol "Perbarui" muncul di perangkat yang masih memakai versi lama.
const fs = require('fs');
const path = require('path');

const AKAR = path.join(__dirname, '..');
const d = new Date();
const dua = (n) => String(n).padStart(2, '0');
const versi = d.getFullYear() + dua(d.getMonth() + 1) + dua(d.getDate()) + '-' + dua(d.getHours()) + dua(d.getMinutes());

const fileHtml = path.join(AKAR, 'index.html');
let html = fs.readFileSync(fileHtml, 'utf8');
html = html.replace(/<meta name="versi" content="[^"]*">/, '<meta name="versi" content="' + versi + '">');
html = html.replace(/((?:href|src)="(?:css|js)\/[^"?]+\.(?:css|js))(?:\?v=[^"]*)?"/g, '$1?v=' + versi + '"');
fs.writeFileSync(fileHtml, html);
fs.writeFileSync(path.join(AKAR, 'versi.json'), JSON.stringify({ versi }) + '\n');
console.log('Versi game: ' + versi);
