// Konfigurasi Kelas 4 Bab 1: daftar pos di peta bab.
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
window.DAFTAR_BAB['k4b1'] = {
  kelas: 4,
  bab: 1,
  judul: 'Bilangan Cacah',
  video: null, // link video menyusul
  catatan: 'Pos lain (Soal Cerita, Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'susun-angka', ikon: '🧱', nama: 'Susun Angka', warna: '#FF8A3D', game: () => window.GameSusunAngka },
    { id: 'mana-lebih-besar', ikon: '🏔️', nama: 'Mana Lebih Besar', warna: '#9B5DE5', game: () => window.GameBilManaLebihBesar },
    { id: 'bulatkan', ikon: '🎯', nama: 'Bulatkan!', warna: '#E04466', game: () => window.GameBulatkan },
  ],
};
