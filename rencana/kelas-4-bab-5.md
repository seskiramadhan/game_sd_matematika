# Rencana Game · Kelas 4 Bab 5 (Pecahan 2)

Status: **disetujui Ayah 7 Nov 2026**. **Tahap 1 selesai 7 Nov 2026** (3 mini game bisa dicoba; cek logika `node tools/cek-bab5.js`). Tahap 2 belum. Aturan umum: `rencana/aturan-game.md`. Maskot: `rencana/maskot-garuda.md`. Pola & mesin sama dengan Bab 3–4; alat pecahan bersama: `js/kelas-4/bab-4/pecahan.js`.

Topik: A. Pecahan campuran · B. Pecahan tidak murni ↔ campuran · C. Pecahan dari kelompok · D. Soal cerita (model batang, bekerja mundur; Tahap 2).

Pos di peta: 🥐 Roti Utuh → 🔄 Tukar Bentuk → 🍓 Bagi Kelompok (Tahap 1).

## Tahap 1: mini game
| | 🥐 Roti Utuh | 🔄 Tukar Bentuk | 🍓 Bagi Kelompok |
|---|---|---|---|
| Konsep | Pecahan campuran | Tidak murni ↔ campuran | Pecahan dari kelompok |
| Soal 1–3 | Gambar roti/pizza utuh + potongan: "Berapa semuanya?" → pilih pecahan campuran (pengecoh: tidak menghitung yang utuh, pembilang/penyebut tertukar) | "11/4 = ?" → pilih bentuk campuran | "3/4 dari 20 stroberi = ?" → pilih jawaban |
| Soal 4–5 | Susun sendiri: ketuk roti utuh + potongan sampai = 2 3/8 | Arah sebaliknya: "2 3/8 = ?/8" → isi pembilang dengan tombol angka | Ketuk stroberi untuk membentuk kelompok, lalu pilih berapa kelompok yang diambil |
| Kalau salah | Roti utuh dihitung dulu (bilangan bulat), lalu potongan (pecahan) | Potongan dikumpulkan jadi lingkaran utuh; sisa potongan = pembilang baru (11 : 4 = 2 sisa 3) | Stroberi dibagi rata ke penyebut-kelompok, lalu kelompok yang diambil disorot |
| Tingkat 1 / 2 / 3 | penyebut ≤ 6, utuh ≤ 3 / penyebut ≤ 8 / penyebut ≤ 12, utuh ≤ 5 | sama | jumlah ≤ 24 / ≤ 48 / ≤ 96 |

Penekanan: penyebut **6, 7, 8, 12** lebih sering; tidak murni → campuran (bagi, sisa = pembilang); "pecahan dari kelompok" = bagi dulu, lalu kali.
Semua jawaban dihitung kode; skrip cek `tools/cek-bab5.js`.

## Tahap 2 (belum)
📖 Soal Cerita (model batang, bekerja mundur: "2/5 dimakan, sisa 18, semula?") · pecahan campuran di garis bilangan · 🏆 Tantangan Akhir.

## Catatan pembangunan Tahap 1
- Kode: `js/kelas-4/bab-5/`. Alat bersama baru `campuran.js` (tidak murni ↔ campuran, tampilan pecahan campuran: bilangan bulat besar + pecahan bertumpuk, roti bundar, baris roti, papan angka). Gambar roti memakai `potongan()` dari `bab-4/pecahan.js` (ditambah opsi `topping`, Bab 4 tidak berubah).
- Penyebut dan utuh per tingkat sama untuk 🥐 dan 🔄: ≤ 6 & utuh ≤ 3 / ≤ 8 & utuh ≤ 4 / ≤ 12 & utuh ≤ 5. Penyebut 11 tidak dipakai. Pecahan campuran **tidak** disederhanakan (mis. 9/6 = 1 3/6: penyebut tetap, sesuai gambar potongan).
- 🥐 Soal 1–3: pembilang ≥ 2 supaya pengecoh "tertukar" (mis. 2 8/3) berarti; pengecoh "lupa utuh" (hanya 3/8) selalu ada. Soal 4–5: tombol + / − Roti utuh (maks 6) dan ketuk potongan 1 roti; dinilai dari nilainya.
- 🔄 Soal 1–3: dipilih hanya soal dengan utuh < penyebut dan utuh ≠ sisa, supaya pengecoh "hasil bagi dan sisa tertukar" selalu ada. Soal 4–5: papan angka 0–9 (maks 2 digit, jawaban ≤ 71); salah "utuh + pembilang" dan "utuh × penyebut saja" dijelaskan khusus. Layar salah: "11 : 4 = 2 sisa 3" + roti berlabel "4 potong … sisa 3 potong".
- 🍓 Pecahan selalu paling sederhana dan pembilang ≥ 2 (penyebut ≥ 3), supaya "hanya dibagi" ≠ jawaban. Soal 1–3 jumlah ≤ 24 / 48 / 96; pengecoh wajib: hanya dibagi (20 : 4 = 5) dan dikali tanpa dibagi (3 × 20 = 60). Soal 4–5: tiap ketukan tumpukan membagi 1 stroberi ke tiap kelompok (isi per kelompok ≤ 6 / 8 / 10), lalu ketuk kelompok yang diambil; mengambil 1 kelompok = "baru dibagi".
- Tes: Chrome headless + ketukan sentuh CDP di 1180×820 dan 1024×768 (tingkat 1–3), 1 ronde penuh tiap mini game + regresi 1 ronde Bab 4, tanpa galat konsol.
