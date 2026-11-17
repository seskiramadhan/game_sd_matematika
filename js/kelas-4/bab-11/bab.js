// Konfigurasi Kelas 4 Bab 11: daftar pos di peta bab. (Video bab ini belum ada: tombol 🎬 menampilkan "segera hadir".)
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
let _scGame11 = null; // game Soal Cerita dibuat sekali dari data bab
function gameSoalCerita11() {
  if (!_scGame11 && window.GameSoalCerita && window.SoalCeritaData && window.SoalCeritaData.k4b11) _scGame11 = window.GameSoalCerita.untuk(window.SoalCeritaData.k4b11);
  return _scGame11;
}
window.DAFTAR_BAB['k4b11'] = {
  kelas: 4,
  bab: 11,
  judul: 'Luas & Keliling',
  catatan: 'Pos lain (Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'jalan-keliling', ikon: '🐾', nama: 'Jalan Keliling', warna: '#FF8A3D', game: () => window.GameJalanKeliling },
    { id: 'hitung-petak', ikon: '🟦', nama: 'Hitung Petak', warna: '#3A86FF', game: () => window.GameHitungPetak },
    { id: 'potong-bangun', ikon: '✂️', nama: 'Potong Bangun', warna: '#9B5DE5', game: () => window.GamePotongBangun },
    { id: 'soal-cerita', ikon: '📖', nama: 'Soal Cerita', warna: '#9B5DE5', game: () => gameSoalCerita11() },
  ],
};
