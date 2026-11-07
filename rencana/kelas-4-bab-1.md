# Rencana Game · Kelas 4 Bab 1 (Bilangan Cacah sampai 100.000)

Status: **disetujui Ayah 7 Nov 2026**; **Tahap 1 dibangun 7 Nov 2026** (3 mini game, catatan di bawah); Tahap 2 belum. Aturan umum: `rencana/aturan-game.md`. Maskot: `rencana/maskot-garuda.md`. Pola & mesin sama dengan Bab 3–6.

Topik: A. Membaca & menulis bilangan · B. Nilai tempat · C. Membandingkan & mengurutkan · D. Pembulatan & penaksiran.
Format Indonesia: **titik** pemisah ribuan (62.408).

Pos di peta: 🧱 Susun Angka → 🏔️ Mana Lebih Besar → 🎯 Bulatkan! (Tahap 1).

## Tahap 1: mini game
| | 🧱 Susun Angka | 🏔️ Mana Lebih Besar | 🎯 Bulatkan! |
|---|---|---|---|
| Konsep | Nilai tempat, membaca/menulis | Membandingkan & mengurutkan | Pembulatan & penaksiran |
| Soal 1–3 | Blok puluh ribuan/ribuan/ratusan/puluhan/satuan → pilih bilangannya; atau "Angka 2 pada 62.408 bernilai?"; atau tulisan "tiga puluh ribu lima belas" → pilih 30.015 | "38.540 ☐ 38.504" → **<**, **=**, **>** | "34.567 dibulatkan ke ribuan terdekat?" (pilih) |
| Soal 4–5 | Susun sendiri: ketuk blok sampai = bilangan (ada angka 0 di tengah, mis. 30.015) | Urutkan 4 bilangan dari terkecil/terbesar | Teka-teki batas: "Bilangan mana yang dibulatkan ke puluhan jadi 48.270?" (pilih semua yang cocok) / taksiran 4.980 + 3.020 ≈ ? |
| Kalau salah | Tabel nilai tempat + blok dihitung per tempat | Bandingkan dari kiri, digit demi digit (digit pertama yang beda disorot) | Garis bilangan dengan titik tengah (34.500) ditandai; angka penentu disorot |
| Tingkat 1 / 2 / 3 | ≤ 9.999 / ≤ 99.999 / ≤ 100.000 dengan nol di tengah | 4 angka / 5 angka beda di ribuan / 5 angka beda di puluhan atau satuan | ke puluhan / ratusan / ribuan + batas & taksiran |

Penekanan: angka **0** tetap ditulis (30.015, bukan 3.015); bandingkan dari kiri; **5 ke atas**; taksiran = bulatkan dulu baru hitung (tulis hasil taksiran, bukan hasil asli); teka-teki batas pembulatan.
Semua jawaban dihitung kode; skrip cek `tools/cek-bab1.js`.

## Tahap 2 (belum)
📖 Soal Cerita (taksiran jumlah penonton/belanja) · pola bilangan (+10.000, +10.100) · 🏆 Tantangan Akhir.

## Catatan pembangunan Tahap 1 (7 Nov 2026)
Berkas: `js/kelas-4/bab-1/` (`bilangan.js` alat bersama, `susun-angka.js`, `mana-lebih-besar.js`, `bulatkan.js`, `bab.js`), `tools/cek-bab1.js`. Objek global: `GameSusunAngka`, `GameBilManaLebihBesar` (beda nama dari Bab 6), `GameBulatkan`.
- **Bilangan = bilangan bulat biasa**; format titik ribuan lewat `fmt` (62.408). `kata(n)` menulis kata Indonesia yang benar (sebelas, seratus, seribu, sepuluh ribu, sebelas ribu sebelas, seratus ribu); diuji untuk semua 0..100.000 dengan pengurai kata -> angka yang independen.
- **🧱 Susun Angka**: soal 1-3 (urutan diacak): blok nilai tempat -> pilih bilangan; "Angka 2 pada 62.408 bernilai?" (angka hanya muncul sekali di bilangan; pengecoh: angka yang sama di tempat lain); tulisan -> pilih angka. Soal 4-5: susun dengan tombol + / - per tempat (maks 9, jadi satu susunan saja), target ditulis kata (soal 4) atau angka (soal 5). Pengecoh khas: nol dihapus / digeser (30.015 -> 3.015, 30.105), sisa digeser (30.150), tukar angka. Tingkat 2-3 hampir selalu punya angka 0 di tengah. Kalau salah: jumlah per tempat (30.000 + 0 + 0 + 10 + 5) + tabel nilai tempat.
- **🏔️ Mana Lebih Besar**: soal 1-3 tanda < = >; jenis: angka biasa, "nol di tengah", **bentuk panjang** (30.000 + 50 + 4 vs 30.504, satu-satunya cara "=" muncul), beda jumlah angka (9.870 vs 10.002). Tingkat 1: 4 angka; 2: 5 angka beda di ribuan; 3: beda di puluhan/satuan. Tiga jawaban tidak pernah sama semua. Soal 4 urut terkecil, soal 5 urut terbesar (4 bilangan, selalu ada nol di tengah). Kalau salah: tabel nilai tempat, kolom sama berwarna hijau, kolom beda pertama disorot kuning.
- **🎯 Bulatkan!**: soal 1-3 bulatkan (tingkat 1 puluhan, 2 ratusan, 3 ribuan; satu naik, satu turun, satu dekat batas; kadang melewati angka 9: 49.700 -> 50.000). Pengecoh: arah salah (lupa 5 ke atas), tempat salah. Soal 4: teka-teki batas, 6 bilangan, pilih semua yang cocok (2-3 benar, pengecoh tepat di luar batas). Soal 5: taksiran jumlah (tingkat 3 juga selisih); pengecoh wajib memuat hasil asli, kunci selalu beda dari hasil asli. Kalau salah: garis bilangan dengan titik tengah ditandai + angka penentu; teka-teki batas: daerah hijau + daftar "bilangan -> pembulatan"; taksiran: bulatkan dulu, baru hitung.
- Cek logika: `node tools/cek-bab1.js` (200 ronde x 3 tingkat x 3 mini game + soal mirip; himpunan jawaban teka-teki dicek; menjalankan cek Bab 3-6). Tes sentuh Chrome headless 1180x820 & 1024x768, tiap tingkat, 2 pola salah, 1 ronde penuh tiap mini game + regresi Bab 6.
- Belum / catatan: Tahap 2 (Soal Cerita taksiran, pola bilangan, Tantangan Akhir). Susun Angka: bilangan 100.000 hanya muncul di soal tulisan (kata).
