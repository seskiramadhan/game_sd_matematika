// Konfigurasi Kelas 4 Bab 6: daftar pos di peta bab.
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
let _scGame6 = null; // game Soal Cerita dibuat sekali dari data bab
function gameSoalCerita6() {
  if (!_scGame6 && window.GameSoalCerita && window.SoalCeritaData && window.SoalCeritaData.k4b6) _scGame6 = window.GameSoalCerita.untuk(window.SoalCeritaData.k4b6);
  return _scGame6;
}
window.DAFTAR_BAB['k4b6'] = {
  kelas: 4,
  bab: 6,
  judul: 'Desimal',
  video: 'https://youtu.be/vXqNbhMcNV8',
  catatan: 'Pos lain (Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'kotak-seratus', ikon: '🟦', nama: 'Kotak Seratus', warna: '#3A86FF', game: () => window.GameKotakSeratus },
    { id: 'garis-desimal', ikon: '📏', nama: 'Garis Desimal', warna: '#2BB673', game: () => window.GameGarisDesimal },
    { id: 'mana-lebih-besar', ikon: '⚖️', nama: 'Mana Lebih Besar', warna: '#9B5DE5', game: () => window.GameManaLebihBesar },
    { id: 'soal-cerita', ikon: '📖', nama: 'Soal Cerita', warna: '#E04466', game: () => gameSoalCerita6() },
  ],
};
