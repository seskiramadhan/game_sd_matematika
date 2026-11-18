# Rencana Game · Kelas 4 Bab 6 (Desimal)

Status: **disetujui Ayah 7 Nov 2026**; **Tahap 1 dibangun 7 Nov 2026** (3 mini game, lihat catatan di bawah); pos **📖 Soal Cerita selesai 18 Nov 2026** (cek `node tools/cek-soal-cerita-bab6.js`); Tantangan Akhir belum. Aturan umum: `rencana/aturan-game.md`. Maskot: `rencana/maskot-garuda.md`. Pola & mesin sama dengan Bab 3–5.

Topik: A. Persepuluhan · B. Perseratusan (& perseribuan) · C. Membandingkan & mengurutkan desimal · D. Pecahan → desimal.
Format Indonesia: **koma** sebagai tanda desimal (0,75), bukan titik.

Pos di peta: 🟦 Kotak Seratus → 📏 Garis Desimal → ⚖️ Mana Lebih Besar (Tahap 1).

## Tahap 1: mini game
| | 🟦 Kotak Seratus | 📏 Garis Desimal | ⚖️ Mana Lebih Besar |
|---|---|---|---|
| Konsep | Persepuluhan & perseratusan, pecahan → desimal | Letak desimal di garis bilangan | Membandingkan & mengurutkan |
| Soal 1–3 | Kotak 10×10 (atau pita 10 bagian) diwarnai → pilih desimalnya (0,37); pengecoh 3,7 / 0,307 / 0,73 | Ketuk letak desimal di garis (0 sampai 1, atau 1 sampai 3) | "0,5 ☐ 0,45" → ketuk **<**, **=**, atau **>** |
| Soal 4–5 | Warnai sendiri sampai = 0,6 (ketuk kolom/kotak); atau "3/4 = ?" lalu warnai | Garis dengan 3 titik → pilih desimal untuk titik bertanda | Urutkan 3–4 desimal dari terkecil |
| Kalau salah | Hitung per kolom (persepuluhan) lalu per kotak (perseratusan) | Garis di-zoom: 0 sampai 1 dibagi 10 bagian, lalu 10 lagi | Samakan banyak angka di belakang koma (0,50 vs 0,45), tampilkan di dua kotak seratus |
| Tingkat 1 / 2 / 3 | persepuluhan / perseratusan / + pecahan (1/2, 1/4, 3/4, 2/5, 7/20…) | 0–1 persepuluhan / 0–1 perseratusan / 0–3 perseratusan | persepuluhan / campuran 1–2 angka di belakang koma / sampai perseribuan |

Penekanan: jebakan **"angka lebih panjang = lebih besar"** (0,45 > 0,5 salah); 0,6 = 0,60; 2,05 ≠ 2,5; pecahan → desimal lewat penyebut 10/100 (3/4 = 75/100 = 0,75).
Semua jawaban dihitung kode (bilangan bulat perseratusan/perseribuan, hindari galat floating point); skrip cek `tools/cek-bab6.js`.

## Tahap 2
- ✅ 📖 Soal Cerita (di bawah). Terbuka setelah ⚖️ Mana Lebih Besar berbintang.
- 🏆 Tantangan Akhir (belum).

### 📖 Soal Cerita (pesan inti: *Angka panjang belum tentu besar: samakan banyak angka di belakang koma dulu*)
Data: `js/kelas-4/bab-6/soal-cerita-data.js` (mesin `js/soal-cerita.js`). Nilai = bilangan bulat perseratus (1,25 = 125), tanpa floating point; pecahan (1/2, 1/4, 3/4, 1/5-4/5, 1/10, 3/10, 7/10, k/20) diubah ke perseratus. Format koma Indonesia.
- Jenis **Bandingkan** (mana lebih banyak/jauh/panjang; jawaban nama tokoh atau "Sama ...") dan **Cari selisih** (jawaban desimal, 4 pilihan).
- Tingkat 1: banding dua tokoh, persepuluhan, atau satu persepuluhan + satu perseratusan (0,6 lawan 0,45; 0,6 = 0,60). Tingkat 2: banding + selisih perseratusan (1,5 lawan 1,25). Tingkat 3: desimal lawan pecahan, tiga tokoh (paling banyak/sedikit), selisih desimal-pecahan, 1-2 angka pengecoh di Tandai.
- Gambar: semua nilai < 1 -> **kotak seratus** (1 kotak besar = 1 utuh = 100 kotak kecil); ada nilai >= 1 -> **garis bilangan**. 3 pilihan, 2 pengecoh dari: angka belakang koma dibaca perseratus (0,6 jadi 0,06), nilai tertukar, dua angka terbalik, bergeser 0,1.
- Pengecoh selisih: tidak meratakan koma (1,5 - 1,25 jadi 1,10 atau 0,20), koma salah tempat (2,5), menjumlah, hanya nilai besar, pecahan salah ubah (3/4 jadi 0,34).
- Contoh dari video Ep. 9 / Buku Saku (muncul +-12%): dua botol 1,5 dan 1,25 liter (selisih 0,25); Dodi 0,8 km dan Sari 3/4 km (selisih 0,05); tali Ali 0,6 m dan Beni 0,45 m (selisih 0,15).
- Cek logika: `node tools/cek-soal-cerita-bab6.js` (dihitung ulang dari teks angka: diratakan dan dibandingkan per huruf, dikurangi per digit dengan pinjam, pecahan dengan pembagian bersusun; gambar dibaca dari SVG).

## Catatan pembangunan Tahap 1 (7 Nov 2026)
Berkas: `js/kelas-4/bab-6/` (`desimal.js` alat bersama, `kotak-seratus.js`, `garis-desimal.js`, `mana-lebih-besar.js`, `bab.js`), `tools/cek-bab6.js`.
- **Nilai disimpan sebagai bilangan bulat** `{ n, d }` (n dalam satuan 10^-d), dibandingkan lewat "mil" (perseribuan). Tidak ada floating point. Format selalu koma (0,75; 2,05); nol di belakang dipertahankan bila memang bagian soal (0,60).
- **🟦 Kotak Seratus**: tingkat 1 memakai **pita 10 bagian**, tingkat 2 **kotak 10×10**, tingkat 3 pecahan (1/2, 1/4, 3/4, 1/5–4/5, 3/10, 7/10, k/20) + 1 soal kotak. Soal 4-5 mewarnai sendiri: pita = ketuk bagian terakhir; kotak = ketuk tombol ▼ (1 kolom = 10 kotak) atau kotak satu per satu; tingkat 3 "warnai 3/4 dari kotak seratus". Pengecoh 0,37: 3,7 / 0,307 / 0,73 (cadangan 0,63 = bagian tak berwarna); pecahan: 3/4 → 3,4 / 0,34 / 0,4 / 0,25. Kalau salah: hitung per kolom (persepuluhan) lalu per kotak (perseratusan), pecahan lewat "×25 jadi per 100".
- **📏 Garis Desimal**: soal 1-3 **ketuk bertahap** (ketuk bagian, garis diperbesar 0–1 → 0,3–0,4; di tahap terakhir ketuk tik, muncul gelembung nilai + tombol Cek; tombol "↩ Perluas" untuk kembali). Tingkat 3: 0–3 → satuan → persepuluhan → perseratusan. Sasaran ketuk ≥ 74 px di 1024 px. Soal 4-5: 3 titik, pilih nilai titik "?" (tingkat 3: titik di tengah dua tik, mis. 1,25). Kalau salah: dua garis bertingkat (zoom) dengan penjelasan "dibagi 10 lagi".
- **⚖️ Mana Lebih Besar**: pola soal 1-3: tingkat 2 soal 1 selalu "angka lebih panjang tapi lebih kecil" (0,5 vs 0,45), lalu campuran 0,6 = 0,60 ("="), 2,05 vs 2,5, acak; tingkat 3 sampai perseribuan (0,45 = 0,450; 0,405 vs 0,45). Jawaban 1-3 tidak pernah semuanya sama. Soal urut selalu memuat pasangan jebakan. Kalau salah: samakan banyak angka (0,5 = 0,50), dua kotak seratus (bagian di belakang koma) atau tabel nilai tempat bila sampai perseribuan / bagian utuh beda.
- Cek logika: `node tools/cek-bab6.js` (200 ronde × 3 tingkat × 3 mini game, kunci dihitung ulang dengan pembanding teks independen). Tes sentuh Chrome headless 1180×820 & 1024×768, tiap tingkat.
- Belum / catatan: kotak 10×10 untuk mewarnai berukuran sel ≈ 27–31 px (untuk 1 kotak lebih kecil dari target ketuk ideal 44 px; tombol ▼ per kolom membantu). Tahap 2: Soal Cerita & Tantangan Akhir.
