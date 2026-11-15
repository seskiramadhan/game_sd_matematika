// Konfigurasi Kelas 4 Bab 9: daftar pos di peta bab. (Video bab ini belum ada: tombol 🎬 menampilkan "segera hadir".)
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
window.DAFTAR_BAB['k4b9'] = {
  kelas: 4,
  bab: 9,
  judul: 'Garis & Sudut',
  catatan: 'Pos lain (Soal Cerita, Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'jenis-garis', ikon: '🛤️', nama: 'Jenis Garis', warna: '#3A86FF', game: () => window.GameJenisGaris },
    { id: 'tarik-garis', ikon: '✏️', nama: 'Tarik Garis', warna: '#FF8A3D', game: () => window.GameTarikGaris },
    { id: 'sudut-silang', ikon: '✖️', nama: 'Sudut Silang', warna: '#E04466', game: () => window.GameSudutSilang },
  ],
};
