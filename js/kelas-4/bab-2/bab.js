// Konfigurasi Kelas 4 Bab 2: daftar pos di peta bab.
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
window.DAFTAR_BAB['k4b2'] = {
  kelas: 4,
  bab: 2,
  judul: 'Perkalian & Pembagian',
  video: null, // link video menyusul
  catatan: 'Pos lain (Soal Cerita, Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'tabel-kilat', ikon: '🧮', nama: 'Tabel Kilat', warna: '#FF8A3D', game: () => window.GameTabelKilat },
    { id: 'kali-kotak', ikon: '🟦', nama: 'Kali Kotak', warna: '#3A86FF', game: () => window.GameKaliKotak },
    { id: 'bagi-bersusun', ikon: '🍰', nama: 'Bagi Bersusun', warna: '#E04466', game: () => window.GameBagiBersusun },
  ],
};
