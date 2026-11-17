// Konfigurasi Kelas 4 Bab 7: daftar pos di peta bab. (Video bab ini belum ada: tombol 🎬 menampilkan "segera hadir".)
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
let _scGame7 = null; // game Soal Cerita dibuat sekali dari data bab
function gameSoalCerita7() {
  if (!_scGame7 && window.GameSoalCerita && window.SoalCeritaData && window.SoalCeritaData.k4b7) _scGame7 = window.GameSoalCerita.untuk(window.SoalCeritaData.k4b7);
  return _scGame7;
}
window.DAFTAR_BAB['k4b7'] = {
  kelas: 4,
  bab: 7,
  judul: 'Persentase',
  catatan: 'Pos lain (Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'kotak-persen', ikon: '🟥', nama: 'Kotak Persen', warna: '#E04466', game: () => window.GameKotakPersen },
    { id: 'tukar-persen', ikon: '🔄', nama: 'Tukar Bentuk', warna: '#2BB673', game: () => window.GameTukarPersen },
    { id: 'persen-dari', ikon: '🏷️', nama: 'Persen dari…', warna: '#FF8A3D', game: () => window.GamePersenDari },
    { id: 'soal-cerita', ikon: '📖', nama: 'Soal Cerita', warna: '#9B5DE5', game: () => gameSoalCerita7() },
  ],
};
