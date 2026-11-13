# Rencana Game · Kelas 4 Bab 7 (Persentase)

Status: **disetujui Ayah 13 Nov 2026** (Tahap 1); Tahap 2 belum. Bab pertama Semester 2. Aturan umum: `rencana/aturan-game.md`. Maskot: `rencana/maskot-garuda.md`. Pola & mesin sama dengan Bab 3–6; kotak 10×10 dan representasi bilangan bulat diambil dari Bab 6 (`js/kelas-4/bab-6/desimal.js`, `kotak-seratus.js`).

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
