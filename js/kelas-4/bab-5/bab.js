// Konfigurasi Kelas 4 Bab 5: daftar pos di peta bab.
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
let _scGame5 = null; // game Soal Cerita dibuat sekali dari data bab
function gameSoalCerita5() {
  if (!_scGame5 && window.GameSoalCerita && window.SoalCeritaData && window.SoalCeritaData.k4b5) _scGame5 = window.GameSoalCerita.untuk(window.SoalCeritaData.k4b5);
  return _scGame5;
}
window.DAFTAR_BAB['k4b5'] = {
  kelas: 4,
  bab: 5,
  judul: 'Pecahan (2)',
  video: 'https://youtu.be/ArB0NQrLwHM',
  catatan: 'Pos lain (Pecahan Campuran di Garis Bilangan, Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'roti-utuh', ikon: '🥐', nama: 'Roti Utuh', warna: '#F5A93A', game: () => window.GameRotiUtuh },
    { id: 'tukar-bentuk', ikon: '🔄', nama: 'Tukar Bentuk', warna: '#3A86FF', game: () => window.GameTukarBentuk },
    { id: 'bagi-kelompok', ikon: '🍓', nama: 'Bagi Kelompok', warna: '#E04466', game: () => window.GameBagiKelompok },
    { id: 'soal-cerita', ikon: '📖', nama: 'Soal Cerita', warna: '#9B5DE5', game: () => gameSoalCerita5() },
  ],
};
