// Konfigurasi Kelas 4 Bab 4: daftar pos di peta bab.
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
window.DAFTAR_BAB['k4b4'] = {
  kelas: 4,
  bab: 4,
  judul: 'Pecahan (1)',
  video: 'https://youtu.be/k1Jb4Ta8EPg',
  catatan: 'Pos lain (Soal Cerita, Pecahan di Garis Bilangan, Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'potong-pizza', ikon: '🍕', nama: 'Potong Pizza', warna: '#FF8A3D', game: () => window.GamePotongPizza },
    { id: 'cokelat-kembar', ikon: '🍫', nama: 'Cokelat Kembar', warna: '#9B5DE5', game: () => window.GameCokelatKembar },
    { id: 'bandingkan', ikon: '⚖️', nama: 'Mana Lebih Besar', warna: '#3A86FF', game: () => window.GameBandingkan },
  ],
};
