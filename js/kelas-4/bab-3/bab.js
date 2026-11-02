// Konfigurasi Kelas 4 Bab 3: daftar pos di peta bab.
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
window.DAFTAR_BAB['k4b3'] = {
  kelas: 4,
  bab: 3,
  judul: 'Faktor & Kelipatan',
  video: null, // link video menyusul
  catatan: 'Pos lain (Ketemu di Mana?, Pohon Faktor, Soal Cerita, Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'bagi-rata', ikon: '🍬', nama: 'Bagi Rata', warna: '#FF6384', segera: true },
    { id: 'katak-loncat', ikon: '🐸', nama: 'Katak Loncat', warna: '#2BB673', segera: true },
    { id: 'prima', ikon: '🧱', nama: 'Prima atau Bukan', warna: '#3A86FF', game: () => window.GamePrima },
  ],
};
