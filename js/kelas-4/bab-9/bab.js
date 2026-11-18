// Konfigurasi Kelas 4 Bab 9: daftar pos di peta bab. (Video bab ini belum ada: tombol 🎬 menampilkan "segera hadir".)
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
let _scGame9 = null; // game Soal Cerita dibuat sekali dari data bab
function gameSoalCerita9() {
  if (!_scGame9 && window.GameSoalCerita && window.SoalCeritaData && window.SoalCeritaData.k4b9) _scGame9 = window.GameSoalCerita.untuk(window.SoalCeritaData.k4b9);
  return _scGame9;
}
window.DAFTAR_BAB['k4b9'] = {
  kelas: 4,
  bab: 9,
  judul: 'Garis & Sudut',
  catatan: 'Pos lain (Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'jenis-garis', ikon: '🛤️', nama: 'Jenis Garis', warna: '#3A86FF', game: () => window.GameJenisGaris },
    { id: 'tarik-garis', ikon: '✏️', nama: 'Tarik Garis', warna: '#FF8A3D', game: () => window.GameTarikGaris },
    { id: 'sudut-silang', ikon: '✖️', nama: 'Sudut Silang', warna: '#E04466', game: () => window.GameSudutSilang },
    { id: 'soal-cerita', ikon: '📖', nama: 'Soal Cerita', warna: '#9B5DE5', game: () => gameSoalCerita9() },
  ],
};
