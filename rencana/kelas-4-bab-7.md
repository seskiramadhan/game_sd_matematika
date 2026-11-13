# Rencana Game · Kelas 4 Bab 7 (Persentase)

Status: **disetujui Ayah 13 Nov 2026**; **Tahap 1 dibangun 13 Nov 2026** (3 mini game, lihat catatan di bawah); Tahap 2 belum. Bab pertama Semester 2. Aturan umum: `rencana/aturan-game.md`. Maskot: `rencana/maskot-garuda.md`. Pola & mesin sama dengan Bab 3–6; kotak 10×10 dan representasi bilangan bulat diambil dari Bab 6 (`js/kelas-4/bab-6/desimal.js`, `kotak-seratus.js`).

Topik: A. Arti persen (per seratus) · B. Persen ↔ pecahan ↔ desimal · C. Persen dari suatu banyak.
Format Indonesia: tanda desimal **koma** (0,25), tanda persen menempel pada angka (25%).

Pos di peta: 🟥 Kotak Persen → 🔄 Tukar Bentuk → 🏷️ Persen dari… (Tahap 1).

## Tahap 1: mini game
| | 🟥 Kotak Persen | 🔄 Tukar Bentuk | 🏷️ Persen dari… |
|---|---|---|---|
| Konsep | Persen = per seratus | Persen ↔ pecahan ↔ desimal | Persen dari suatu banyak |
| Soal 1–3 | Kotak 10×10 diwarnai → pilih persennya (37%); pengecoh 3,7% / 63% (bagian tak berwarna) / 0,37% | Cocokkan pasangan: 50% = 1/2 = 0,5 (pilih dari 3–4 pilihan) | "25% dari 80 permen = ?" dengan model kotak/pita (pilihan ganda) |
| Soal 4–5 | Warnai sendiri sampai = 45% (tombol ▼ per kolom = 10%, atau ketuk kotak) | Isi bentuk yang hilang: 3/4 = …% · 0,2 = …% · 30% = …/10 (pilihan ganda) | Cerita pendek original: diskon toko, murid yang suka sepak bola, isi kebun (pilihan ganda) |
| Kalau salah | Hitung per kolom (10%) lalu per kotak (1%) | Lewat penyebut 100: 3/4 = 75/100 = 75% = 0,75 (×25, ×20, ×10) | Pita dipotong jadi 10 bagian (10% masing-masing), lalu jumlahkan bagian yang diminta |
| Tingkat 1 / 2 / 3 | kelipatan 10% / 1–99% sembarang / + 1%, 100%, dan "berapa % tidak berwarna?" | 50%, 25%, 75%, 10% / k/5, k/10, k/20 / campuran tiga arah + desimal 2 angka (0,35) | 50% dan 10% dari 10–200 / 25%, 20%, 5% / 15%, 35%, 75%, 30% (banyak dipilih agar hasilnya bulat) |

Penekanan: **% = per 100**; jebakan **0,5 = 50% (bukan 5%)** dan **5% = 0,05 (bukan 0,5)**; 100% = utuh; "persen dari" = potong menjadi 100 (atau 10) bagian sama.
Semua jawaban dihitung kode dengan bilangan bulat (persen sebagai bilangan bulat 0–100, banyak dipilih supaya hasil "persen dari" selalu bulat); tidak ada floating point. Contoh original, bukan dari buku penerbit. Skrip cek `tools/cek-bab7.js`.

## Tahap 2 (belum)
📖 Soal Cerita (persen dalam belanja & data kelas, mesin `js/soal-cerita.js`) · 🏆 Tantangan Akhir.

## Catatan pembangunan Tahap 1 (13 Nov 2026)
Berkas: `js/kelas-4/bab-7/` (`persen.js` alat bersama, `kotak-persen.js`, `tukar-persen.js`, `persen-dari.js`, `bab.js`), `tools/cek-bab7.js`. Memakai kotak 10×10 dan format koma dari Bab 6 (`desimal.js`) serta pecahan bertumpuk dari Bab 4; tidak ada yang diubah di Bab 6. Tombol 🎬 Bab 7 belum ada tautan (menampilkan "segera hadir").
- **Bilangan bulat saja**: persen 0-100; persen yang tidak bulat (3,7% / 0,37%) hanya muncul sebagai pengecoh dan disimpan per-sepuluh-ribu. Tanda % menempel (25%), desimal pakai koma (0,25), ribuan pakai titik (Rp 20.000).
- **🟥 Kotak Persen**: soal 1-3 baca kotak 10×10 (pengecoh 3,7% / 0,37% / 63% bagian tak berwarna; hampir selalu ada). Tingkat 3: soal 1 = 1% atau 100%, soal 2 = "berapa persen yang TIDAK berwarna?" (jebakan: persen yang berwarna). Soal 4-5 warnai sendiri (▼ per kolom = 10%, atau ketuk kotak). Kalau salah: kolom penuh × 10% + kotak sisa × 1%.
- **🔄 Tukar Bentuk**: soal 1-3 pilih bentuk setara (tingkat 1-2: selalu melibatkan persen; tingkat 3: enam arah termasuk pecahan ↔ desimal; pool tingkat 3 menambah 2%, 4%, 6%, 8%, 12%, 16%, 24%, 32%, 36%, 44%). Soal 4-5 isi yang hilang: 3/4 = …%, 0,2 = …%, 30% = …/10. Jebakan 0,5 ↔ 5% dan 5% ↔ 0,5 / 0,005 dihasilkan otomatis. Kalau salah: ubah penyebut jadi 100 (×25, ×20, ×10 …) lalu persen lalu desimal.
- **🏷️ Persen dari…**: banyaknya dipilih kelipatan 100/fpb(p,100) sehingga hasil selalu bulat. Soal 1-3 dengan pita (bagian = fpb(p,100)%), soal 4-5 cerita original (toko diskon dalam rupiah, murid kelas 4B, kebun Bu Ani), dua cerita berbeda tiap ronde. Kalau salah: pita dipotong jadi n bagian sama besar (10% → 10 bagian, 25% → 4, 5% → 20), 1 bagian = banyak ÷ n, lalu jumlahkan bagian yang diminta.
- Jawaban soal 1-3 tidak pernah semuanya sama (dijaga generator). Cek logika: `node tools/cek-bab7.js` (200 ronde × 3 tingkat × 3 mini game; kunci dihitung ulang dari teks yang tampil dengan pecahan bilangan bulat, dan "persen dari" dengan penjumlahan berulang). Tes sentuh Playwright 1180×820 & 1024×768, tiap mini game dan tingkat, satu soal salah sengaja untuk melihat penjelasan.
- Belum / catatan: Tahap 2 (📖 Soal Cerita, 🏆 Tantangan Akhir), video bab, audio khusus bab. Sel kotak mewarnai ≈ 27-31 px (sama seperti Bab 6; tombol ▼ per kolom membantu).
