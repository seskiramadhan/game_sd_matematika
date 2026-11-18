# Rencana Game · Kelas 4 Bab 2 (Perkalian & Pembagian sampai 100.000)

Status: **disetujui Ayah 7 Nov 2026**; **Tahap 1 dibangun 7 Nov 2026** (3 mini game, catatan di bawah); **📖 Soal Cerita dibangun 18 Nov 2026**; Tantangan Akhir belum. Aturan umum: `rencana/aturan-game.md`. Maskot: `rencana/maskot-garuda.md`. Pola & mesin sama dengan Bab 1 dan 3-6.

Format Indonesia: **titik** pemisah ribuan (2.800). Hasil kali selalu ≤ 100.000.
Pos di peta: 🧮 Tabel Kilat → 🟦 Kali Kotak → 🍰 Bagi Bersusun (Tahap 1).

## Tahap 1: mini game
| | 🧮 Tabel Kilat | 🟦 Kali Kotak | 🍰 Bagi Bersusun |
|---|---|---|---|
| Konsep | Fakta perkalian + × puluhan/ratusan | Perkalian 2 angka (model luas → bersusun) | Pembagian 1 angka + sisa, cek dengan perkalian |
| Soal 1–3 | "7 × 12 = ?" pilih; pengecoh = kesalahan khas (mis. 94, tetangga ±7, ±10); angka 6, 7, 8, 12 muncul ± 70% | 23 × 14 dipecah 4 kotak (20×10, 20×4, 3×10, 3×4 = 200, 80, 30, 12) → isi tiap kotak, lalu jumlah | 86 : 6 langkah porogapit per langkah |
| Soal 4–5 | 400 × 7 = (4 × 7) lalu "tambah 2 nol" (pengecoh lupa nol: 280, 28.000); keluarga fakta 84 : 7 = ? | Bersusun lengkap, pilih hasil (pengecoh: lupa geser puluhan, mis. 92 + 23 = 115) | Sisa & cek: 6 × 14 + 2 = 86 |
| Kalau salah | Trik pecah: 7 × 12 = 7 × 10 + 7 × 2 = 70 + 14 | Kotak yang salah disorot | Langkah yang salah disorot + dihitung ulang |
| Tingkat 1/2/3 | fakta s.d. 10 / s.d. 12 (juga 11) / ratusan & ribuan × 1 angka | 2×1 angka / 2×2 angka / 3×2 angka | tanpa sisa / bersisa / bilangan 3–4 angka |

Penekanan: angka 6, 7, 8, 12 lebih sering; nol tidak boleh terlupa saat kali puluhan/ratusan; geser baris puluhan; sisa harus lebih kecil dari pembagi; cek pembagian dengan perkalian.
Semua jawaban dihitung kode; skrip cek `tools/cek-bab2.js`.

## Tahap 2
📖 Soal Cerita (4 langkah) **sudah ada** (catatan di bawah) · 🏆 Tantangan Akhir (belum).

## Catatan pembangunan Tahap 1 (7 Nov 2026)
Berkas: `js/kelas-4/bab-2/` (`hitung.js` alat bersama, `tabel-kilat.js`, `kali-kotak.js`, `bagi-bersusun.js`, `bab.js`), `tools/cek-bab2.js`. Objek global: `HitungB2`, `GameTabelKilat`, `GameKaliKotak`, `GameBagiBersusun`. Semua soal pilihan ganda 4 pilihan (tanpa papan angka), pengecoh bertanda sebab, sehingga layar "kalau salah" menyebut kesalahan yang dipilih. Pengecoh wajib (misalnya "lupa geser", "lupa nol", "lupa simpan", "sisa >= pembagi") selalu ikut muncul.
- **🧮 Tabel Kilat**: tingkat 1-2 soal 1-3 fakta (70% soal memuat 6/7/8/12, 30% tanpa; terukur 69-71%), soal 4 kali puluhan (T1) / ratusan (T2), soal 5 keluarga fakta. Tingkat 3: soal 1-4 ratusan/ribuan × 1 angka, soal 5 keluarga fakta berangka nol (mis. 5.600 : 8). Kalau salah: trik pecah (dua kotak berwarna), atau "kali angka depan, tambah nol", atau keluarga fakta.
- **🟦 Kali Kotak**: soal 1-3 isi tiap kotak lalu jumlah (satu pilihan per langkah; salah di langkah mana pun langsung menyorot kotak itu). Keputusan: tingkat 3 (3 angka × 2 angka) memakai 2 kotak (3 angka × puluhan, 3 angka × satuan), bukan 6 kotak, supaya ronde tidak terlalu panjang. Soal 4 bersusun dengan baris hasil terlihat (baris puluhan memakai 0 pudar), soal 5 tanpa baris (hitung sendiri).
- **🍰 Bagi Bersusun**: soal 1-3 porogapit per langkah (pilih angka hasil bagi satu per satu, lalu sisa bila ada); tingkat 3 memuat nol di hasil bagi (mis. 3.045 : 3). Soal 4 cek "6 × 14 + 2 = ?". Soal 5 pilih hasil yang benar; pengecoh selalu memuat pasangan yang tampak benar tetapi sisanya >= pembagi.
- Cek: `node tools/cek-bab2.js` (200 ronde × 3 tingkat × 3 mini game + soal mirip; pembanding independen BigInt / penjumlahan berulang; menjalankan juga cek Bab 1, 3-6). Tes sentuh Chrome headless 1180×820 dan 1024×768: tiap tingkat, 1 ronde benar semua + 1 ronde pola salah (3 mini game), tidak ada tombol tertutup / keluar layar.
- Belum / catatan: Tahap 2. Pos 🟦 dan 🍰 terkunci sampai pos sebelumnya ≥ 1 bintang (aturan umum).

## Catatan 📖 Soal Cerita (18 Nov 2026)
Berkas: `js/kelas-4/bab-2/soal-cerita-data.js` (data untuk mesin bersama `js/soal-cerita.js`), pos di `bab.js` (terbuka setelah 🍰 Bagi Bersusun berbintang), `tools/cek-soal-cerita-bab2.js`. Pesan inti video Jago Soal Cerita Ep. 7: **kali dulu, lalu bagi** + arti **sisa**.
- Tiga jenis (pilihan di langkah Baca): *Hanya kali*, *Hanya bagi*, *Kali dulu, lalu bagi*. Gambar: model batang (kelompok sama di atas, dibagi rata di bawah, bagian kecil putus-putus = sisa).
- **Tingkat 1**: satu langkah, angka kecil (kali saja, atau bagi bersisa; jawaban "hasil sisa"). **Tingkat 2**: kali dulu, lalu bagi bersisa (jawaban "13 sisa 5"; pengecoh: sisa >= pembagi, lupa kali, lupa sisa, dijumlah). **Tingkat 3**: dua langkah + arti sisa: "berapa wadah dibutuhkan" (hasil bagi + 1) atau "berapa yang tidak kebagian" (sisanya), 1-2 angka pengecoh di Tandai, kadang soal satu langkah "berapa wadah" (jenis bagi).
- Jawaban "hasil dan sisa" memakai `labelOpsi` (kode hasil x 1000 + sisa, label "13 sisa 5"), tanpa mengubah perilaku bab lain. Satu perubahan kecil di mesin: `data.jenisTingkat(tingkat)` (opsional) menentukan jenis yang muncul per tingkat; bab lain tidak memakainya.
- Penekanan tabel 6, 7, 8, 12: sekitar 70% soal memuat angka itu (terukur 68-73%); hasil kali selalu <= 3 angka. Contoh video muncul sekitar 12%: Kue Bu Rina (12 x 8 : 7 = 13 sisa 5) dan pensil sekolah (15 x 12 : 8 = 22 sisa 4) di tingkat 2, 50 murid / mobil 8 orang = 7 mobil di tingkat 3.
- Cek: `node tools/cek-soal-cerita-bab2.js` (1.500 ronde per tingkat; kunci dihitung ulang dengan penjumlahan dan pengurangan berulang, sebab pengecoh diperiksa).
