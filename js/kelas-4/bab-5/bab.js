// Konfigurasi Kelas 4 Bab 5: daftar pos di peta bab.
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
window.DAFTAR_BAB['k4b5'] = {
  kelas: 4,
  bab: 5,
  judul: 'Pecahan (2)',
  video: 'https://youtu.be/ArB0NQrLwHM',
  catatan: 'Pos lain (Soal Cerita, Pecahan Campuran di Garis Bilangan, Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'roti-utuh', ikon: '🥐', nama: 'Roti Utuh', warna: '#F5A93A', game: () => window.GameRotiUtuh },
    { id: 'tukar-bentuk', ikon: '🔄', nama: 'Tukar Bentuk', warna: '#3A86FF', game: () => window.GameTukarBentuk },
    { id: 'bagi-kelompok', ikon: '🍓', nama: 'Bagi Kelompok', warna: '#E04466', game: () => window.GameBagiKelompok },
  ],
};
