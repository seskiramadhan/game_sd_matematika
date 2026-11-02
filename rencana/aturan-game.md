# Aturan Game (semua bab)

Disepakati 2 Nov 2026. Rencana per bab ada di `rencana/kelas-<k>-bab-<n>.md`.

## Layar
| Layar | Isi | Peran Garuda |
|---|---|---|
| Beranda | Judul, ▶ Main, suara on/off | Melambai, ekspresi semangat |
| Pilih Kelas | Kelas 1–6 (hanya 4 aktif) | — |
| Pilih Bab | Bab 1–12 (hanya bab yang ada game-nya aktif) | — |
| Peta Bab | Jalur pos 🍬 → 🐸 → 🧱 (Tahap 2: 🐸🐸 → 🌳 → 📖 → 🏆), tombol 🎬 video | Berdiri di pos terakhir yang terbuka, terbang ke pos baru |
| Ronde | 5 soal | Pojok layar, bereaksi tiap jawaban |
| Hasil | Bintang 0–3, Main lagi / Lanjut | Berputar senang / menyemangati |
| Halaman Ayah/Bunda | Progres, soal sering salah, reset | Dibuka dengan menahan logo 3 detik |

## Aturan ronde
| Aturan | Isi |
|---|---|
| Soal | 5 per ronde, angka acak |
| Benar | "ding" + Garuda senang + suara "Benar!" |
| Salah | Garuda ups + alasan ditampilkan secara visual; soal mirip diulang di akhir ronde (tidak menambah bintang) |
| Bintang | 5 benar ⭐⭐⭐ · 4 ⭐⭐ · 3 ⭐ · <3 "Coba lagi yuk!" |
| Buka pos | Pos berikutnya terbuka setelah pos sebelumnya ≥ 1⭐ |
| Naik tingkat | ⭐⭐⭐ → tingkat berikutnya (1 → 2 → 3) |
| Waktu | Tanpa batas waktu |
| Bobot angka | 6, 7, 8, 12 lebih sering muncul (tabel perkalian yang sering salah) |

## Kerangka kode
Kerangka (layar, navigasi, progres, bintang, Halaman Ayah/Bunda, mesin ronde, maskot) dibuat **sekali** dan dipakai semua bab. Mini game per bab di `js/kelas-<k>/bab-<n>/<nama>.js`, didaftarkan ke peta bab lewat satu file konfigurasi bab.
