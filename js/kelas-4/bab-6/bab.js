// Konfigurasi Kelas 4 Bab 6: daftar pos di peta bab.
window.DAFTAR_BAB = window.DAFTAR_BAB || {};
window.DAFTAR_BAB['k4b6'] = {
  kelas: 4,
  bab: 6,
  judul: 'Desimal',
  video: null, // link video menyusul
  catatan: 'Pos lain (Soal Cerita, Tantangan Akhir) segera hadir.',
  pos: [
    { id: 'kotak-seratus', ikon: '🟦', nama: 'Kotak Seratus', warna: '#3A86FF', game: () => window.GameKotakSeratus },
    { id: 'garis-desimal', ikon: '📏', nama: 'Garis Desimal', warna: '#2BB673', game: () => window.GameGarisDesimal },
    { id: 'mana-lebih-besar', ikon: '⚖️', nama: 'Mana Lebih Besar', warna: '#9B5DE5', game: () => window.GameManaLebihBesar },
  ],
};
