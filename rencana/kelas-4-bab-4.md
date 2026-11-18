# Rencana Game · Kelas 4 Bab 4 (Pecahan 1)

Status: **disetujui Ayah 3 Nov 2026**. **Tahap 1 selesai 3 Nov 2026** (3 mini game bisa dicoba; cek logika `node tools/cek-bab4.js`). Pos **📖 Soal Cerita selesai 18 Nov 2026** (cek `node tools/cek-soal-cerita-bab4.js`). Pecahan di Garis Bilangan dan Tantangan Akhir belum. Aturan umum: `rencana/aturan-game.md`. Maskot: `rencana/maskot-garuda.md`. Pola & mesin sama dengan Bab 3 (`rencana/kelas-4-bab-3.md`).

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

## Tahap 2
- ✅ 📖 Soal Cerita (di bawah). Terbuka setelah ⚖️ Mana Lebih Besar berbintang.
- Belum: Pecahan di garis bilangan · 🏆 Tantangan Akhir.

### 📖 Soal Cerita (pesan inti: *Siapa lebih banyak? Samakan penyebut dulu*)
Data: `js/kelas-4/bab-4/soal-cerita-data.js` (mesin `js/soal-cerita.js`). Utuhnya selalu sama besar, pecahan < 1, penyebut ≤ 12, KPK ≤ 24, tanpa desimal (pecahan = pasangan bilangan bulat; perkalian silang).
| Tingkat | Jenis | Isi |
|---|---|---|
| 1 | Bandingkan (2 tokoh) | penyebut berbeda tetapi satu kelipatan yang lain (4 dan 8, 3 dan 6); ± 25% jawabannya "Sama banyak" (mis. 6/8 = 3/4); jebakan "angka lebih besar ≠ pecahan lebih besar" |
| 2 | Bandingkan + Cari selisih | penyebut kelipatan persekutuan (3 dan 4, 4 dan 6); selisih sudah paling sederhana |
| 3 | Bandingkan 3 tokoh (paling banyak/sedikit) + Cari selisih | selisih yang harus disederhanakan (pengecoh "belum sederhana"), 1–2 angka pengecoh di Tandai |
- Jawaban nama tokoh / "Sama banyak" lewat `labelOpsi`; jawaban pecahan (kode = pembilang × 100 + penyebut) ditampilkan bertumpuk. Pengecoh selisih: kurangi pembilang & penyebut langsung (3/4 − 2/3 → 1/1), lupa menyamakan penyebut, pecahan besar saja, menjumlah, belum disederhanakan.
- Gambar: model batang, tiap batang = 1 utuh; benar = batang sama panjang dipotong sama kecil (KPK); salah = batang beda panjang, atau potongan belum disamakan.
- Contoh video Ep. 8 / Buku Saku (± 12%): botol jus 6/8 dan 3/4 (sama), pita 2/3 dan 3/4 m (selisih 1/12), roti 3/5 dan 1/2 (Rani lebih banyak, selisih 1/10).

## Catatan pembangunan Tahap 1
- Kode: `js/kelas-4/bab-4/` (`pecahan.js` alat bersama: FPB, KPK, bandingkan, gambar pizza/kue/batang SVG, pecahan bertumpuk).
- 🍕 Penyebut > 12 (tingkat 3) digambar sebagai **kue persegi panjang** (mis. 24 = 4 × 6) supaya potongan tetap mudah diketuk. Penyebut prima > 12 tidak dipakai. Mewarnai: potongan mana saja boleh, yang dihitung banyaknya.
- 🍫 Soal 4–5: anak mengetuk tombol pembagi (:2 … :9) berulang kali, lalu "Sudah paling sederhana". Berhenti di tengah (mis. 12/16 → 6/8) = belum selesai, dengan pesan "Hampir! … belum habis". Mengetuk pembagi yang tidak membagi atas **dan** bawah = salah (dijelaskan). FPB soal hanya memuat faktor 2, 3, 5, 7.
- ⚖️ Semua penyebut ≤ 12; tingkat 3 hanya pasangan yang KPK-nya ≤ 24 (batang bisa disamakan). ± 55% soal tingkat 3 memakai jebakan "penyebut besar = lebih besar"; ± 17% jawabannya "=".
