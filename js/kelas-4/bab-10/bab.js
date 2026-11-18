// Konfigurasi Kelas 4 Bab 10: daftar pos di peta bab. (Video bab ini belum ada: tombol 🎬 menampilkan "segera hadir".)
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
let _scGame10 = null; // game Soal Cerita dibuat sekali dari data bab
function gameSoalCerita10() {
  if (!_scGame10 && window.GameSoalCerita && window.SoalCeritaData && window.SoalCeritaData.k4b10) _scGame10 = window.GameSoalCerita.untuk(window.SoalCeritaData.k4b10);
  return _scGame10;
}
window.DAFTAR_BAB['k4b10'] = {
  kelas: 4,
  bab: 10,
  judul: 'Segi Banyak',
  catatan: 'Pos lain (Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'hitung-sisi', ikon: '🔷', nama: 'Hitung Sisi', warna: '#3A86FF', game: () => window.GameHitungSisi },
    { id: 'cek-sifat', ikon: '🔍', nama: 'Cek Sifat', warna: '#FF8A3D', game: () => window.GameCekSifat },
    { id: 'susun-bangun', ikon: '🧩', nama: 'Susun Bangun', warna: '#9B5DE5', game: () => window.GameSusunBangun },
    { id: 'soal-cerita', ikon: '📖', nama: 'Soal Cerita', warna: '#E04466', game: () => gameSoalCerita10() },
  ],
};
