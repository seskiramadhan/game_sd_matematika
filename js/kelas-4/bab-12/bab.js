// Konfigurasi Kelas 4 Bab 12: daftar pos di peta bab. (Video bab ini belum ada: tombol 🎬 menampilkan "segera hadir".)
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
let _scGame12 = null; // game Soal Cerita dibuat sekali dari data bab
function gameSoalCerita12() {
  if (!_scGame12 && window.GameSoalCerita && window.SoalCeritaData && window.SoalCeritaData.k4b12) _scGame12 = window.GameSoalCerita.untuk(window.SoalCeritaData.k4b12);
  return _scGame12;
}
window.DAFTAR_BAB['k4b12'] = {
  kelas: 4,
  bab: 12,
  judul: 'Grafik Batang',
  catatan: 'Pos lain (Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'catat-turus', ikon: '📝', nama: 'Catat Turus', warna: '#FF8A3D', game: () => window.GameCatatTurus },
    { id: 'baca-batang', ikon: '📊', nama: 'Baca Batang', warna: '#3A86FF', game: () => window.GameBacaBatang },
    { id: 'bangun-batang', ikon: '🏗️', nama: 'Bangun Batang', warna: '#2BB673', game: () => window.GameBangunBatang },
    { id: 'soal-cerita', ikon: '📖', nama: 'Soal Cerita', warna: '#9B5DE5', game: () => gameSoalCerita12() },
  ],
};
