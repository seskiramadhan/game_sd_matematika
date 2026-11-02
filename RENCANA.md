# Rencana Game — Tahap 1 (Kelas 4 · Bab 3 Faktor & Kelipatan)

Disepakati 2 Nov 2026. Baca bersama `CLAUDE.md`.

## Maskot: Garuda
- Garuda kecil berbentuk **bola bulat sempurna** (kepala = badan), fluffy, oranye-emas `#F5A93A`, perut krem `#FFE9BF`, **jambul 3 bulu** `#D9622B`, sayap kecil `#E0891F`, kaki kecil, pipi merah muda, paruh kuning `#FFC233`. Mata besar.
- 3 ekspresi: **senang** (mata melengkung ^^, jawaban benar), **semangat** (mata berbinar, sayap terangkat; beranda & mulai ronde), **ups** (mata bulat kecil, setetes keringat, paruh "o"; jawaban salah, tetap lucu & tidak menakutkan).
- ⚠️ Harus **berbeda jelas dari Lambang Negara Garuda Pancasila**: tanpa perisai/simbol sila, tanpa pita, tanpa pose resmi menghadap depan dengan sayap simetris, tanpa jumlah bulu bermakna. Diperlakukan dengan hormat.
- Nama tokoh: **Garuda**. (Nama brand game dipikirkan terpisah; sementara "Game Matematika SD".)
- Digambar sebagai SVG di kode.

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

## Mini game Tahap 1
| | 🍬 Bagi Rata | 🐸 Katak Loncat | 🧱 Prima atau Bukan |
|---|---|---|---|
| Konsep | Faktor | Kelipatan | Bilangan prima |
| Soal 1–3 | "18 permen ke 4 piring, rata?" → **Rata / Ada sisa** | Katak loncat n: n, 2n, 3n… ketuk tempat **mendarat berikutnya** di garis bilangan | "27?" → **Prima / Bukan** |
| Soal 4–5 | "Ketuk **semua** faktor 18" (chip angka) | "Lanjutkan **2 loncatan** lagi" | "Ketuk **semua prima** di antara 20–30" |
| Kalau salah | Permen terbagi ke piring, sisa dilingkari merah | Katak loncat ke angka benar + baris tabel perkalian | Kotak disusun jadi persegi panjang (bukti punya faktor lain) |
| Tingkat 1 / 2 / 3 | permen ≤24 / ≤48 / ≤100 | loncat 2–5 / 6–9 / 7, 8, 12 | angka ≤20 / ≤50 / ≤100 |

Visual mengikuti video: permen bulat dengan bungkus segitiga, katak hijau, kotak warna-warni. Warna permen: `#FF6384 #3A86FF #FFC400 #2BB673 #9B5DE5 #FF8A3D`.

## Urutan kerja
1. Kerangka: layar, navigasi, progres (`localStorage`), bintang, Halaman Ayah/Bunda
2. Mesin ronde (5 soal, umpan balik, ulangi yang salah)
3. 🧱 Prima atau Bukan (paling sederhana, untuk menguji mesin)
4. 🍬 Bagi Rata
5. 🐸 Katak Loncat
6. Suara pujian (TTS dari `konten_sd_matematika/video/tts.py`) + efek (Web Audio)
7. Tes di ukuran iPad landscape (1180×820 & 1024×768), push, nyalakan GitHub Pages

## Tahap 2 (belum)
🐸🐸 Ketemu di Mana? (kelipatan persekutuan) · 🌳 Pohon Faktor · 📖 Soal Cerita (4 langkah, mulai dari cerita tanpa angka) · 🏆 Tantangan Akhir (10 soal campuran) · suara pembaca soal.
