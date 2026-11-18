// Konfigurasi Kelas 4 Bab 2: daftar pos di peta bab.
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
let _scGame2 = null; // game Soal Cerita dibuat sekali dari data bab
function gameSoalCerita2() {
  if (!_scGame2 && window.GameSoalCerita && window.SoalCeritaData && window.SoalCeritaData.k4b2) _scGame2 = window.GameSoalCerita.untuk(window.SoalCeritaData.k4b2);
  return _scGame2;
}
window.DAFTAR_BAB['k4b2'] = {
  kelas: 4,
  bab: 2,
  judul: 'Perkalian & Pembagian',
  video: 'https://youtu.be/yhRL7vz3NTI',
  catatan: 'Pos lain (Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'tabel-kilat', ikon: '🧮', nama: 'Tabel Kilat', warna: '#FF8A3D', game: () => window.GameTabelKilat },
    { id: 'kali-kotak', ikon: '🟦', nama: 'Kali Kotak', warna: '#3A86FF', game: () => window.GameKaliKotak },
    { id: 'bagi-bersusun', ikon: '🍰', nama: 'Bagi Bersusun', warna: '#E04466', game: () => window.GameBagiBersusun },
    { id: 'soal-cerita', ikon: '📖', nama: 'Soal Cerita', warna: '#9B5DE5', game: () => gameSoalCerita2() },
  ],
};
