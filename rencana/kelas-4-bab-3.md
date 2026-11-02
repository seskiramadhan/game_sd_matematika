# Rencana Game · Kelas 4 Bab 3 (Faktor & Kelipatan)

Status: **disetujui Ayah 2 Nov 2026**, belum dibangun. Aturan umum: `rencana/aturan-game.md`. Maskot: `rencana/maskot-garuda.md`.

Pos di peta: 🍬 Bagi Rata → 🐸 Katak Loncat → 🧱 Prima atau Bukan (Tahap 1) → 🐸🐸 Ketemu di Mana? → 🌳 Pohon Faktor → 📖 Soal Cerita → 🏆 Tantangan Akhir (Tahap 2).

## Tahap 1: mini game
| | 🍬 Bagi Rata | 🐸 Katak Loncat | 🧱 Prima atau Bukan |
|---|---|---|---|
| Konsep | Faktor | Kelipatan | Bilangan prima |
| Soal 1–3 | "18 permen ke 4 piring, rata?" → **Rata / Ada sisa** | Katak loncat n: n, 2n, 3n… ketuk tempat **mendarat berikutnya** di garis bilangan | "27?" → **Prima / Bukan** |
| Soal 4–5 | "Ketuk **semua** faktor 18" (chip angka) | "Lanjutkan **2 loncatan** lagi" | "Ketuk **semua prima** di antara 20–30" |
| Kalau salah | Permen terbagi ke piring, sisa dilingkari merah | Katak loncat ke angka benar + baris tabel perkalian | Kotak disusun jadi persegi panjang (bukti punya faktor lain) |
| Tingkat 1 / 2 / 3 | permen ≤24 / ≤48 / ≤100 | loncat 2–5 / 6–9 / 7, 8, 12 | angka ≤20 / ≤50 / ≤100 |


## Tahap 2 (belum)
🐸🐸 Ketemu di Mana? (kelipatan persekutuan) · 🌳 Pohon Faktor · 📖 Soal Cerita (4 langkah, mulai dari cerita tanpa angka) · 🏆 Tantangan Akhir (10 soal campuran) · suara pembaca soal.

## Urutan kerja (bab pertama, termasuk kerangka)
1. Kerangka: layar, navigasi, progres (`localStorage`), bintang, Halaman Ayah/Bunda
2. Mesin ronde (5 soal, umpan balik, ulangi yang salah)
3. 🧱 Prima atau Bukan (paling sederhana, untuk menguji mesin)
4. 🍬 Bagi Rata
5. 🐸 Katak Loncat
6. Suara pujian (TTS dari `konten_sd_matematika/video/tts.py`) + efek (Web Audio)
7. Tes di ukuran iPad landscape (1180×820 & 1024×768), push, nyalakan GitHub Pages
