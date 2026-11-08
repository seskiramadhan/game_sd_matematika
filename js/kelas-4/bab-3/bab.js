// Konfigurasi Kelas 4 Bab 3: daftar pos di peta bab.
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
let _scGame = null; // game Soal Cerita dibuat sekali dari data bab
function gameSoalCerita() {
  if (!_scGame && window.GameSoalCerita && window.SoalCeritaData) _scGame = window.GameSoalCerita.untuk(window.SoalCeritaData.k4b3);
  return _scGame;
}
window.DAFTAR_BAB['k4b3'] = {
  kelas: 4,
  bab: 3,
  judul: 'Faktor & Kelipatan',
  video: null, // link video menyusul
  catatan: 'Pos lain (Ketemu di Mana?, Pohon Faktor, Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'bagi-rata', ikon: '🍬', nama: 'Bagi Rata', warna: '#FF6384', game: () => window.GameBagiRata },
    { id: 'katak-loncat', ikon: '🐸', nama: 'Katak Loncat', warna: '#2BB673', game: () => window.GameKatakLoncat },
    { id: 'prima', ikon: '🧱', nama: 'Prima atau Bukan', warna: '#3A86FF', game: () => window.GamePrima },
    { id: 'soal-cerita', ikon: '📖', nama: 'Soal Cerita', warna: '#9B5DE5', game: () => gameSoalCerita() },
  ],
};
