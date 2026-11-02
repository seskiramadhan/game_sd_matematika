---
name: buat-game-bab
description: Bangun game web untuk satu bab Matematika SD (mis. "buat game kelas 4 bab 3"). Membaca rencana bab, membangun kerangka bila belum ada, membuat mini game, mengetes di ukuran iPad, lalu commit & push.
---

# Buat game per bab

Membangun (atau melanjutkan) game web di repo **publik** `game_sd_matematika` untuk satu kelas & bab.
Argumen: kelas dan bab, mis. `kelas 4 bab 3` (boleh juga `tahap 2`). Bila tidak jelas, tanya dulu.

## Aturan tetap
- Repo ini **PUBLIK**: jangan pernah menaruh nama anak, catatan kelemahan anak, email, atau isi/contoh dari buku penerbit. Angka & soal original.
- HTML + CSS + JavaScript biasa, **tanpa framework & tanpa build step**. Font Poppins (Google Fonts). `localStorage` dibungkus try/catch.
- Maskot **Garuda** sesuai `rencana/maskot-garuda.md`, digambar sebagai SVG. Harus berbeda jelas dari Lambang Negara (tanpa perisai, pita, pose resmi).
- Bahasa Indonesia sederhana untuk anak SD. Angka format Indonesia.
- **Setiap jawaban dihitung oleh kode** (generator soal + pemeriksa), bukan ditulis manual.

## Langkah 1 — Baca konteks
1. `CLAUDE.md`, `rencana/aturan-game.md`, `rencana/maskot-garuda.md`.
2. `rencana/kelas-<k>-bab-<n>.md` untuk bab yang diminta.
3. Bila tersedia (repo berdampingan): `../konten_sd_matematika/STATUS.md` dan `NEXT.md`. Boleh membaca catatan progres anak di repo privat (berdampingan, di luar repo ini) hanya untuk menentukan penekanan (mis. angka yang sering salah); **jangan menyalin isinya** ke repo ini.

## Langkah 2 — Pastikan ada rencana bab
- Bila `rencana/kelas-<k>-bab-<n>.md` **belum ada**: susun usulan dengan format yang sama seperti `rencana/kelas-4-bab-3.md` (pos di peta, tabel mini game: konsep, soal 1–3, soal 4–5, kalau salah, tingkat 1/2/3), satu mini game per sub bab. Simpan, tunjukkan ke Ayah, lalu **berhenti dan tunggu persetujuan**.
- Bila sudah ada dan berstatus disetujui: lanjut.

## Langkah 3 — Kerangka (sekali untuk semua bab)
Bila `index.html` / `js/app.js` / `js/engine.js` belum ada, bangun dulu sesuai `rencana/aturan-game.md`:
- Layar: Beranda, Pilih Kelas, Pilih Bab, Peta Bab, Ronde, Hasil, Halaman Ayah/Bunda (tahan logo 3 detik).
- Progres & bintang per pos di `localStorage`; buka kunci pos; naik tingkat saat ⭐⭐⭐.
- Mesin ronde: 5 soal, umpan balik benar/salah, soal salah diulang di akhir ronde, bintang 5/4/3.
- Garuda SVG dengan 3 ekspresi (senang, semangat, ups).
- Efek suara dengan Web Audio (ding, pop, boing). File suara TTS (bila ada) di `audio/`.
- Satu file konfigurasi per bab (`js/kelas-<k>/bab-<n>/bab.js`) yang mendaftarkan pos-pos di peta.

## Langkah 4 — Mini game
Untuk tiap mini game di rencana (urutan sesuai rencana, yang paling sederhana dulu):
1. Buat `js/kelas-<k>/bab-<n>/<nama>.js`: generator soal per tingkat, pemeriksa jawaban, tampilan, dan visual "kalau salah".
2. Tes generator dengan Node (`node -e ...`): 200 soal acak per tingkat, pastikan jawaban benar menurut pemeriksa dan angka dalam batas tingkat.
3. Tes tampilan dengan Playwright (sudah terpasang: `require('playwright')`, `chromium.launch()`), viewport **1180×820** dan **1024×768**: screenshot tiap layar penting, mainkan 1 ronde otomatis. Lihat screenshot-nya, perbaiki yang terpotong/bertumpuk.
4. Commit kecil ke `master` setelah mini game itu lolos tes.

## Langkah 5 — Rilis & catat
1. Push ke `master`. Bila GitHub Pages belum aktif, pandu Ayah: Settings → Pages → Source: branch `master`, folder `/ (root)` → Save. URL: `https://seskiramadhan.github.io/game_sd_matematika/`.
2. Update `README.md` (tabel isi) dan status di `rencana/kelas-<k>-bab-<n>.md`.
3. Bila repo konten tersedia: update kolom Game di `../konten_sd_matematika/STATUS.md` dan centang di `NEXT.md`, commit & push di repo itu (branch `master`).

## Langkah 6 — Laporkan
Ringkas dalam Bahasa Indonesia: link game, mini game yang selesai, 2–3 screenshot, hal yang belum. Minta Ayah mencoba bersama anak; reaksi dan soal yang sering salah dicatat Ayah/Claude di catatan progres anak (repo privat), **bukan** di repo ini.
