# Rencana Game · Kelas 4 Bab 3 (Faktor & Kelipatan)

Status: **disetujui Ayah 2 Nov 2026**. Dibangun: kerangka + mesin ronde + **Tahap 1 lengkap** (🍬 Bagi Rata, 🐸 Katak Loncat, 🧱 Prima atau Bukan; 2 Nov 2026). Berikutnya: Halaman Ayah/Bunda, Tahap 2. Aturan umum: `rencana/aturan-game.md`. Maskot: `rencana/maskot-garuda.md`.

Pos di peta: 🍬 Bagi Rata → 🐸 Katak Loncat → 🧱 Prima atau Bukan (Tahap 1) → 🐸🐸 Ketemu di Mana? → 🌳 Pohon Faktor → 📖 Soal Cerita → 🏆 Tantangan Akhir (Tahap 2).

## Tahap 1: mini game
| | 🍬 Bagi Rata | 🐸 Katak Loncat | 🧱 Prima atau Bukan |
|---|---|---|---|
| Konsep | Faktor | Kelipatan | Bilangan prima |
| Soal 1–3 | "18 permen ke 4 piring, rata?" → **Rata / Ada sisa** | Katak loncat n: n, 2n, 3n… ketuk tempat **mendarat berikutnya** di garis bilangan | "27?" → **Prima / Bukan** |
| Soal 4–5 | "Ketuk **semua** faktor 18" (chip angka) | "Lanjutkan **2 loncatan** lagi" | "Ketuk **semua prima** di antara 20–30" |
| Kalau salah | Permen terbagi ke piring, sisa dilingkari merah | Katak loncat ke angka benar + baris tabel perkalian | Kotak disusun jadi persegi panjang (bukti punya faktor lain) |
| Tingkat 1 / 2 / 3 | permen ≤24 / ≤48 / ≤100 | loncat 2–5 / 6–9 / 7, 8, 12 | angka ≤20 / ≤50 / ≤100 |

Catatan pembuatan Tahap 1:
- 🍬 Bagi Rata: permen per piring paling banyak 16 (supaya bisa digambar); piring 2–6 / 3–9 / 4–12, piring 6, 7, 8, 12 lebih sering. "Ketuk semua faktor": N ≤ 12 tampil chip 1..N; N lebih besar tampil semua faktor + pengecoh (maks 16 chip), N hasil kali 6/7/8/12 berbobot 3×.
- 🐸 Katak Loncat: garis bilangan hanya potongan yang relevan (maks 31 angka); ketuk garis memilih angka terdekat, angka pilihan tampil di gelembung, lalu tombol "Loncat!". Tingkat 3: loncat 7 dan 12 masing-masing ± 40%.
- Peta: pos yang sudah pernah dimainkan selalu tetap terbuka; Garuda berdiri di pos terbuka pertama yang belum berbintang.


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

## Catatan pembangunan Soal Cerita (📖, 8 Nov 2026)
Mesin **bersama** semua bab: `js/soal-cerita.js` (objek `GameSoalCerita`). Data bab ini: `js/kelas-4/bab-3/soal-cerita-data.js`. Cek: `node tools/cek-soal-cerita.js`. Pos 📖 ada di akhir peta (setelah Prima atau Bukan; Ketemu di Mana? dan Pohon Faktor belum dibuat, nanti disisipkan sebelum 📖).
- **Empat langkah per soal**, bilah di atas (Baca · Tandai · Gambar · Hitung dan Cek), langkah aktif kuning, selesai hijau:
  1. Baca: cerita tanpa satu digit pun, "Ini soal apa?" (Faktor / Kelipatan). Salah: kata kunci di cerita disorot kuning + daftar kata kunci kedua jenis.
  2. Tandai: ketuk angka penting (kuning) dan kalimat pertanyaan (biru), lalu "Sudah". Tingkat 1 tanpa angka pengecoh, tingkat 2 satu (mis. "pukul 7", "uang 15 ribu rupiah"), tingkat 3 dua. Petunjuk khusus bila ada angka pengecoh ditandai, angka penting kurang, atau kalimat tanya belum ditandai.
  3. Gambar: 3 pilihan SVG skema (tanpa angka jawaban): dua katak loncat di garis bilangan (kelipatan), isi tiap wadah sama (faktor), dua batang dibandingkan (pengecoh). Salah: petunjuk mengapa gambar itu cocok untuk jenis soal ini.
  4. Hitung dan Cek: pilihan ganda 4. Pengecoh bertanda sebab. Kelipatan: hasil kali kedua angka, kelipatan salah satu saja, jumlah, selisih, FPB. Faktor: faktor persekutuan bukan terbesar, isi tiap wadah, KPK, selisih, faktor salah satu angka saja. Benar: layar "Cek jawabannya" (daftar kelipatan/faktor + pembagian tanpa sisa) dan tombol Lanjut.
- **Pujian untuk langkah**: tiap langkah selesai memunculkan pujian di langkah berikutnya ("Kamu menandai dulu sebelum menghitung!"); akhir soal memuji empat langkah (atau kesabaran bila sempat salah).
- **Aturan bintang** (keputusan, perlu disetujui Ayah): soal dianggap BENAR bila langkah 4 benar pada **percobaan pertama**. Salah di langkah 1 sampai 3 hanya memunculkan petunjuk dan anak mencoba lagi, tanpa mengurangi bintang (itu latihan caranya, bukan ujian). Salah di langkah 4: anak tetap mencoba lagi sampai benar, lalu soal dihitung salah, penjelasan tampil, dan soal mirip diulang di akhir ronde (mesin ronde yang ada).
- **Isi**: kelipatan (lampu berkedip, bel berbunyi, bus berangkat; "bersama lagi"): tingkat 1 angka 3 sampai 12 (KPK ≤ 36), tingkat 2 angka 3 sampai 15 (KPK ≤ 60), tingkat 3 angka 4 sampai 30 (KPK ≤ 60). Sekitar 30% soal saling prima (KPK = hasil kali), sisanya KPK lebih kecil dari hasil kali; tidak ada pasangan yang satu angka kelipatan angka lain. Faktor (stiker ke amplop, kelereng ke kantong, permen ke kotak; "paling banyak"): tingkat 1 angka 4 sampai 12, tingkat 2 sampai 48, tingkat 3 sampai 96; FPB ≥ 2 (dipilih rata dulu supaya jawaban tidak melulu 2). Satu ronde selalu memuat kedua jenis, urutan diacak.
- **Contoh tetap** sama dengan video & Buku Saku, muncul ± 12% per soal: lampu 6 dan 8 detik, jawaban 24 (tingkat 1); 24 stiker bintang dan 32 stiker hati, jawaban 8 amplop, tiap amplop 3 bintang dan 4 hati (tingkat 2).
- Tidak memakai penekanan angka 6, 7, 8, 12 (tidak diminta untuk pos ini).
- Teks cerita memakai nama generik (Ibu, Dodi, Kak Rina). Tidak ada suara baca soal (belum ada audio).
- Tes: 1.500 ronde per tingkat lolos (kunci = KPK/FPB dihitung ulang dengan pencarian satu per satu, pengecoh unik dan ≠ kunci, angka pengecoh ≠ angka penting, cerita tanpa angka bebas digit, sebab pengecoh benar secara matematika). Browser: ronde penuh dengan ketukan sentuh (salah di tiap langkah) di 1180×820 dan 1024×768.
- **Cara pakai bab lain**: buat `js/kelas-<k>/bab-<n>/soal-cerita-data.js` (isi `window.SoalCeritaData['k<k>b<n>']`: `jenis`, `tingkat`, `ingat`, `buatSoal(tingkat, jenisId, pakai)`; bentuk soal ada di komentar kepala `js/soal-cerita.js`). Pakai alat `GameSoalCerita` (`kpk`, `fpb`, `buatOpsi`, `pilihanGambar`, `GAMBAR`). Daftarkan kedua script di `index.html`, tambahkan pos di `bab.js` dengan `game: () => GameSoalCerita.untuk(window.SoalCeritaData['k<k>b<n>'])`. Gambar khusus bab: tambahkan objek `{ id, ket, svg }` lewat argumen kedua `pilihanGambar`.
