// Konfigurasi Kelas 4 Bab 1: daftar pos di peta bab.
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
let _scGame1 = null; // game Soal Cerita dibuat sekali dari data bab
function gameSoalCerita1() {
  if (!_scGame1 && window.GameSoalCerita && window.SoalCeritaData && window.SoalCeritaData.k4b1) _scGame1 = window.GameSoalCerita.untuk(window.SoalCeritaData.k4b1);
  return _scGame1;
}
window.DAFTAR_BAB['k4b1'] = {
  kelas: 4,
  bab: 1,
  judul: 'Bilangan Cacah',
  video: 'https://youtu.be/rIiEmOYlpTg',
  catatan: 'Pos lain (Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'susun-angka', ikon: '🧱', nama: 'Susun Angka', warna: '#FF8A3D', game: () => window.GameSusunAngka },
    { id: 'mana-lebih-besar', ikon: '🏔️', nama: 'Mana Lebih Besar', warna: '#9B5DE5', game: () => window.GameBilManaLebihBesar },
    { id: 'bulatkan', ikon: '🎯', nama: 'Bulatkan!', warna: '#E04466', game: () => window.GameBulatkan },
    { id: 'soal-cerita', ikon: '📖', nama: 'Soal Cerita', warna: '#E04466', game: () => gameSoalCerita1() },
  ],
};
