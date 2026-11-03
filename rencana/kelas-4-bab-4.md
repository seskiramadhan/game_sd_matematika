# Rencana Game · Kelas 4 Bab 4 (Pecahan 1)

Status: **disetujui Ayah 3 Nov 2026**. **Tahap 1 selesai 3 Nov 2026** (3 mini game bisa dicoba; cek logika `node tools/cek-bab4.js`). Tahap 2 belum. Aturan umum: `rencana/aturan-game.md`. Maskot: `rencana/maskot-garuda.md`. Pola & mesin sama dengan Bab 3 (`rencana/kelas-4-bab-3.md`).

Topik: A. Pembilang & penyebut · B. Pecahan senilai (termasuk menyederhanakan) · C. Membandingkan & mengurutkan pecahan.

Pos di peta: 🍕 Potong Pizza → 🍫 Cokelat Kembar → ⚖️ Mana Lebih Besar (Tahap 1).

## Tahap 1: mini game
| | 🍕 Potong Pizza | 🍫 Cokelat Kembar | ⚖️ Mana Lebih Besar |
|---|---|---|---|
| Konsep | Pembilang & penyebut | Pecahan senilai, menyederhanakan | Membandingkan & mengurutkan |
| Soal 1–3 | Pizza/kue dipotong n, sebagian diwarnai: "Berapa bagian?" → pilih pecahan (4 pilihan, pengecoh: terbalik a/b ↔ b/a, sisa bagian) | "2/4 sama dengan?" → pilih pecahan senilai (batang cokelat sebagai gambar) | "3/8 ☐ 3/5" → ketuk **<**, **=**, atau **>** |
| Soal 4–5 | "Warnai 3/8 pizza": ketuk potongan sampai pas, tombol Cek | "Sederhanakan **sampai habis**: 12/16" → pilih bilangan pembagi berulang / jawaban akhir; berhenti di 6/8 = belum selesai | Urutkan 3–4 pecahan dari terkecil (seret/ketuk berurutan) |
| Kalau salah | Potongan dihitung satu-satu: angka atas = yang diwarnai, angka bawah = semua potongan | Dua batang cokelat sejajar: dipotong lebih kecil/besar, bagian berwarna sama panjang; pembagi bersama ditunjukkan | Batang pecahan sejajar, panjang dibandingkan; bila beda penyebut, disamakan dulu (2/3 = 8/12, 3/4 = 9/12) |
| Tingkat 1 / 2 / 3 | penyebut ≤ 8 / ≤ 12 / ≤ 24 | penyebut ≤ 8 / ≤ 12 / ≤ 24 | penyebut sama / pembilang sama / beda keduanya |

Penekanan: penyebut **6, 7, 8, 12** lebih sering; menyederhanakan **sampai habis** (jebakan berhenti di tengah); "penyebut besar = potongan kecil".
Semua jawaban dihitung kode (FPB untuk menyederhanakan, perkalian silang/samakan penyebut untuk membandingkan), skrip cek `tools/cek-bab4.js`.

## Tahap 2 (belum)
📖 Soal Cerita (model batang, mulai dari cerita tanpa angka) · Pecahan di garis bilangan · 🏆 Tantangan Akhir.

## Catatan pembangunan Tahap 1
- Kode: `js/kelas-4/bab-4/` (`pecahan.js` alat bersama: FPB, KPK, bandingkan, gambar pizza/kue/batang SVG, pecahan bertumpuk).
- 🍕 Penyebut > 12 (tingkat 3) digambar sebagai **kue persegi panjang** (mis. 24 = 4 × 6) supaya potongan tetap mudah diketuk. Penyebut prima > 12 tidak dipakai. Mewarnai: potongan mana saja boleh, yang dihitung banyaknya.
- 🍫 Soal 4–5: anak mengetuk tombol pembagi (:2 … :9) berulang kali, lalu "Sudah paling sederhana". Berhenti di tengah (mis. 12/16 → 6/8) = belum selesai, dengan pesan "Hampir! … belum habis". Mengetuk pembagi yang tidak membagi atas **dan** bawah = salah (dijelaskan). FPB soal hanya memuat faktor 2, 3, 5, 7.
- ⚖️ Semua penyebut ≤ 12; tingkat 3 hanya pasangan yang KPK-nya ≤ 24 (batang bisa disamakan). ± 55% soal tingkat 3 memakai jebakan "penyebut besar = lebih besar"; ± 17% jawabannya "=".
