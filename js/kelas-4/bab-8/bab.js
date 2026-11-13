// Konfigurasi Kelas 4 Bab 8: daftar pos di peta bab. (Video bab ini belum ada: tombol 🎬 menampilkan "segera hadir".)
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
window.DAFTAR_BAB['k4b8'] = {
  kelas: 4,
  bab: 8,
  judul: 'Sudut',
  catatan: 'Pos lain (Soal Cerita, Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'jenis-sudut', ikon: '📐', nama: 'Jenis Sudut', warna: '#9B5DE5', game: () => window.GameJenisSudut },
    { id: 'baca-busur', ikon: '🔍', nama: 'Baca Busur', warna: '#3A86FF', game: () => window.GameBacaBusur },
    { id: 'putar-arah', ikon: '🧭', nama: 'Putar Arah', warna: '#FF8A3D', game: () => window.GamePutarArah },
  ],
};
