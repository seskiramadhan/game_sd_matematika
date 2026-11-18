// Konfigurasi Kelas 4 Bab 4: daftar pos di peta bab.
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
let _scGame4 = null; // game Soal Cerita dibuat sekali dari data bab
function gameSoalCerita4() {
  if (!_scGame4 && window.GameSoalCerita && window.SoalCeritaData && window.SoalCeritaData.k4b4) _scGame4 = window.GameSoalCerita.untuk(window.SoalCeritaData.k4b4);
  return _scGame4;
}
window.DAFTAR_BAB['k4b4'] = {
  kelas: 4,
  bab: 4,
  judul: 'Pecahan (1)',
  video: 'https://youtu.be/k1Jb4Ta8EPg',
  catatan: 'Pos lain (Pecahan di Garis Bilangan, Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'potong-pizza', ikon: '🍕', nama: 'Potong Pizza', warna: '#FF8A3D', game: () => window.GamePotongPizza },
    { id: 'cokelat-kembar', ikon: '🍫', nama: 'Cokelat Kembar', warna: '#9B5DE5', game: () => window.GameCokelatKembar },
    { id: 'bandingkan', ikon: '⚖️', nama: 'Mana Lebih Besar', warna: '#3A86FF', game: () => window.GameBandingkan },
    { id: 'soal-cerita', ikon: '📖', nama: 'Soal Cerita', warna: '#E04466', game: () => gameSoalCerita4() },
  ],
};
