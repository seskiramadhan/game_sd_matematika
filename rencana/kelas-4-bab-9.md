# Rencana Game · Kelas 4 Bab 9 (Garis & Sudut)

Status: **disetujui Ayah 15 Nov 2026** (keputusan di bagian akhir); Tahap 1 belum dibangun. Lanjutan Bab 8 (Sudut). Aturan umum: `rencana/aturan-game.md`. Maskot: `rencana/maskot-garuda.md`. Pola & mesin sama dengan Bab 3–8 (`js/engine.js`, `js/app.js`); contoh struktur mini game: `js/kelas-4/bab-8/`.

Topik: A. Garis sejajar, berpotongan, tegak lurus · B. Menggambar garis sejajar & tegak lurus (kertas bertitik) · C. Sudut pada garis berpotongan, sudut lurus = 180° · D. Mengenali garis pada benda di sekitar.
Format: derajat menempel pada angka (90°), garis diberi nama dua huruf (garis AB), titik sudut huruf tengah (∠PQR) seperti Bab 8. Arti kata selalu tampil: **sejajar** = tidak pernah bertemu walau diperpanjang; **berpotongan** = bertemu di satu titik; **tegak lurus** = berpotongan dan membentuk sudut siku-siku (90°).

Pos di peta: 🛤️ Jenis Garis → ✏️ Tarik Garis → ✖️ Sudut Silang (Tahap 1).

## Tahap 1: mini game
| | 🛤️ Jenis Garis | ✏️ Tarik Garis | ✖️ Sudut Silang |
|---|---|---|---|
| Konsep | Sejajar · berpotongan · tegak lurus (= berpotongan siku-siku) · garis bisa diperpanjang terus | Sejajar = arah langkah sama (mis. 2 kanan 1 atas) · tegak lurus = langkah "diputar" (1 kanan 2 bawah) | Sudut lurus = 180° (setengah putaran) · dua sudut bersebelahan di garis lurus jumlahnya 180° · garis tegak lurus → 4 sudut 90° |
| Soal 1–3 | Dua garis SVG (diputar acak, huruf A-B dan C-D) → pilih Sejajar / Berpotongan / Tegak lurus | Kertas bertitik (10×6 titik, jarak ≥ 64 px) + garis AB + titik C → ketuk satu titik lain supaya garis dari C **sejajar** AB. Semua titik di garis itu diterima | Sudut lurus dibagi satu sinar, satu bagian tertulis (mis. 70°) → pilih bagian lainnya (110°). Pengecoh: 20° (90° − 70°), 290° (360° − 70°), 70° |
| Soal 4–5 | Gambar benda original (rel kereta, jendela berkisi, zebra cross, gunting terbuka, tanda tambah, anak tangga) dengan 2 tepi disorot → pilih jenis garisnya | Sama, tapi garis dari C harus **tegak lurus** AB. Contoh: AB langkah (2,1) → langkah tegak lurus (1,−2); dari C(5,1) jawaban (4,3) atau (3,5). Kunci = semua titik C + k·(1,−2) yang ada di kertas | Dua garis berpotongan, satu sudut berwarna diketahui (mis. 65°) → ketuk sudut yang besarnya 115° atau sudut yang juga 65° (ketuk daerah sudut, ≥ 80 px) |
| Kalau salah | Tombol "Perpanjang": kedua garis memanjang sampai tepi layar; kalau bertemu, titik potong disorot. Kotak pojok 90° ditempel di titik potong: pas = tegak lurus | Garis AB "digeser" (animasi) ke titik C untuk sejajar; untuk tegak lurus, kotak pojok 90° di titik potong + langkah dihitung titik demi titik | Busur setengah lingkaran (180°) ditempel di garis lurus, dua bagian diwarnai: 70° + 110° = 180°. Untuk sudut seberang: garis diputar sedikit, dua sudut seberang ikut berubah bersama |
| Tingkat 1 / 2 / 3 | Garis mendatar/tegak, tegak lurus jelas, berpotongan 30–60° / diputar acak, berpotongan dekat 90° (75–85°, 95–105°), garis putus (titik potong di luar gambar) / hampir sejajar (beda 6–12°, perlu "Perpanjang") + tiga garis: "a ⟂ c dan b ⟂ c, maka a dan b?" (sejajar) | Langkah mendatar/tegak (3,0), (0,2) / miring 1:1 (2,2) → tegak lurus (1,−1) / miring 2:1 (2,1) → tegak lurus (1,−2), dan 3:1 | Sudut lurus 1 sinar, kelipatan 10° / dua garis berpotongan, kelipatan 5°, cari sudut sebelah; garis tegak lurus → 90° / sembarang 1°, isi keempat sudut (mis. 50° → 130°, 50°, 130°, jumlah 360°) dan sudut lurus 3 bagian (180° − 45° − 70° = 65°) |

Penekanan: **tegak lurus juga berpotongan** (jenis khusus, sudutnya 90°); **sejajar dicek dengan memperpanjang**, bukan dengan "di layar tidak bersentuhan"; **garis lurus = 180°**, jebakan 90° − a dan 360° − a. Contoh benda dan cerita original (bukan dari buku penerbit). Semua kunci bilangan bulat: sudut dalam derajat bulat; di kertas bertitik garis = vektor bilangan bulat, **sejajar ⇔ perkalian silang = 0**, **tegak lurus ⇔ perkalian titik = 0** (cek: (2,1)·(1,−2) = 2 − 2 = 0 ✔; (2,2)·(1,−1) = 0 ✔); tidak ada floating point untuk kunci. Skrip cek usulan `tools/cek-bab9.js`.

Contoh kunci yang sudah dihitung ulang: 180° − 70° = 110° · 180° − 65° = 115° · 180° − 38° = 142° · 180° − 45° − 70° = 65° · 50° + 130° + 50° + 130° = 360°. Tarik Garis tingkat 3: AB (1,1)→(3,2), langkah (2,1); dari C(5,1) titik sejajar: (7,2), (9,3), (3,0); titik tegak lurus: (4,3), (3,5); (6,−1) di luar kertas (x 0–9, y 0–5).

### Alat yang dipakai ulang dari Bab 8 (`js/kelas-4/bab-8/sudut.js`, objek `window.Sudut`)
- `sudutSvg({ sinar, lengkung, hurufTitik, pojok })`: menggambar sinar dari satu titik, lengkung sudut, dan **kotak pojok 90°**. Dipakai untuk Sudut Silang (4 sinar = 2 garis berpotongan, sinar berlawanan arah = garis lurus) dan kotak pojok di Jenis Garis / Tarik Garis.
- `busurSvg({ b })` + `busur(rho, sisi, s)`: busur 180° untuk penjelasan "garis lurus = 180°" di Sudut Silang.
- `jenisSudut()` (sudah punya `'lurus'` = 180°), `ambilHuruf()` / `namaSudut()` untuk nama garis & sudut, `acak` / `pilih` / `kocok` / `mod`, `svgEl` / `el`.
- Pola tombol putar ◀◀ ◀ ▶ ▶▶ dari `baca-busur.js` (untuk animasi "putar garis" pada penjelasan Sudut Silang).
- Usul: alat baru `js/kelas-4/bab-9/garis.js` (kertas bertitik, garis + tombol Perpanjang, cek sejajar/tegak lurus dengan vektor bulat). Fungsi bantu `titik()` dan `jalurLengkung()` di `sudut.js` belum diekspor; cukup **menambah ekspor** (perilaku Bab 8 tidak berubah), atau disalin kecil di `garis.js`.

## Tahap 2 (belum)
📖 Soal Cerita (garis di denah jalan & kelas, sudut lurus pada benda; mesin `js/soal-cerita.js`) · 🏆 Tantangan Akhir.

## Keputusan Ayah (15 Nov 2026)
1. **Tegak lurus vs berpotongan** di 🛤️ Jenis Garis: kunci tunggal **"Tegak lurus"**; "Berpotongan" untuk garis siku dianggap salah, dengan penjelasan bahwa tegak lurus juga berpotongan.
2. **Sudut seberang (bertolak belakang) sama besar**: **masuk Tahap 1** (soal 4–5 ✖️ Sudut Silang & tingkat 3).
3. **Simbol ∥ dan ⊥**: **ditampilkan kecil di samping kata** (AB sejajar CD, AB ∥ CD); kata tetap utama.
4. **Urutan pos**: 🛤️ Jenis Garis → ✏️ Tarik Garis → ✖️ Sudut Silang.
