// Konfigurasi Kelas 4 Bab 11: daftar pos di peta bab. (Video bab ini belum ada: tombol 🎬 menampilkan "segera hadir".)
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
window.DAFTAR_BAB['k4b11'] = {
  kelas: 4,
  bab: 11,
  judul: 'Luas & Keliling',
  catatan: 'Pos lain (Soal Cerita, Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'jalan-keliling', ikon: '🐾', nama: 'Jalan Keliling', warna: '#FF8A3D', game: () => window.GameJalanKeliling },
    { id: 'hitung-petak', ikon: '🟦', nama: 'Hitung Petak', warna: '#3A86FF', game: () => window.GameHitungPetak },
    { id: 'potong-bangun', ikon: '✂️', nama: 'Potong Bangun', warna: '#9B5DE5', game: () => window.GamePotongBangun },
  ],
};
