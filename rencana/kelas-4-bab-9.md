# Rencana Game · Kelas 4 Bab 9 (Garis & Sudut)

Status: **disetujui Ayah 15 Nov 2026** (keputusan di bagian akhir); **Tahap 1 dibangun 15 Nov 2026** (3 mini game, lihat catatan pembangunan di bawah); **📖 Soal Cerita dibangun 18 Nov 2026**; 🏆 Tantangan Akhir belum. Lanjutan Bab 8 (Sudut). Aturan umum: `rencana/aturan-game.md`. Maskot: `rencana/maskot-garuda.md`. Pola & mesin sama dengan Bab 3–8 (`js/engine.js`, `js/app.js`); contoh struktur mini game: `js/kelas-4/bab-8/`.

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

## Tahap 2
📖 Soal Cerita: **sudah ada** (lihat catatan di bawah) · 🏆 Tantangan Akhir: belum.

## Keputusan Ayah (15 Nov 2026)
1. **Tegak lurus vs berpotongan** di 🛤️ Jenis Garis: kunci tunggal **"Tegak lurus"**; "Berpotongan" untuk garis siku dianggap salah, dengan penjelasan bahwa tegak lurus juga berpotongan.
2. **Sudut seberang (bertolak belakang) sama besar**: **masuk Tahap 1** (soal 4–5 ✖️ Sudut Silang & tingkat 3).
3. **Simbol ∥ dan ⊥**: **ditampilkan kecil di samping kata** (AB sejajar CD, AB ∥ CD); kata tetap utama.
4. **Urutan pos**: 🛤️ Jenis Garis → ✏️ Tarik Garis → ✖️ Sudut Silang.

## Catatan pembangunan Tahap 1 (15 Nov 2026)
File: `js/kelas-4/bab-9/` = `garis.js` (alat bersama `window.Garis`), `jenis-garis.js`, `tarik-garis.js`, `sudut-silang.js`, `bab.js`; cek logika `tools/cek-bab9.js` (200 ronde x 3 tingkat x 3 mini game, kunci dihitung ulang dengan cara lain, contoh rencana dicek satu per satu). Di `bab-8/sudut.js` hanya ada **tambahan**: ekspor `titik`, `jalurLengkung`, `teks`, dan parameter opsional `rTeks` pada `lengkung` (letak teks); perilaku Bab 8 tidak berubah (`cek-bab8.js` lulus). Video bab ini belum ada: tombol 🎬 menampilkan "segera hadir".

Keputusan Ayah yang dijalankan: kunci tunggal **Tegak lurus** untuk garis siku (memilih "Berpotongan" = salah, penjelasan "tegak lurus juga berpotongan"); sudut seberang masuk Tahap 1; simbol ∥ dan ⊥ kecil di samping kata (tombol & penjelasan); urutan pos 🛤️ → ✏️ → ✖️.

Hal yang diputuskan saat membangun (di luar tabel rencana):
- **Jenis Garis**: soal 4-5 memakai 7 gambar benda original (rel, jendela berkisi, zebra cross, gunting terbuka, tanda tambah, atap rumah, tangga), kunci dari vektor bulat. Tingkat 3 soal 5 = tiga garis a, b, c (3 varian: dua-tegak -> sejajar, dua-sejajar -> sejajar, sejajar-tegak -> tegak lurus). Tombol Perpanjang ada di semua tingkat; di tingkat 3 gambar memperkecil (zoom) secukupnya supaya titik potong yang di luar bingkai terlihat. Garis putus & hampir sejajar (beda 6-12 derajat) hanya di tingkat 3.
- **Tarik Garis**: kertas 10x6, jarak titik 64 px (tepat di batas target sentuh). Kunci = semua titik kertas P (selain C) dengan P - C sejajar (silang = 0) atau tegak lurus (titik = 0) terhadap AB; C selalu di luar garis AB. Info "Langkah AB: 2 kanan, 1 atas" selalu tampil; tombol "Perpanjang AB" memanjangkan AB sampai tepi kertas. Penjelasan salah: garis hijau dari C + titik hijau (semua titik benar), titik merah pilihan anak, kotak pojok 90 derajat di titik potong (tegak lurus), langkah "diputar" (2 kanan 1 atas -> 1 kanan 2 bawah).
- **Sudut Silang**: tingkat 1 = 3 soal sudut lurus 1 sinar (kelipatan 10) + 2 soal ketuk; tingkat 2 = 3 soal sudut sebelah di dua garis (kelipatan 5; tepat satu soal garis tegak lurus = 90) + 2 ketuk; tingkat 3 = 2 soal sudut lurus 3 bagian (180 - x - y), 1 soal sudut sebelah (1 derajat), 1 ketuk, 1 soal "isi keempat sudut" (pilih urutan sudut ① ② ③; jumlah 360). Ketuk memilih daerah dari arah ketukan terhadap titik potong; sudut kecil dibatasi >= 35 derajat supaya daerahnya >= 80 px di iPad 1024 px. Mengetuk sudut yang sudah diketahui tidak dihitung (hanya bunyi). Soal ketuk: "yang besarnya (180 - a)" (dua daerah benar) atau "yang juga a" (sudut seberang, satu daerah benar); a = 90 tidak dipakai di ketuk. Penjelasan: pengecoh 90 - a, 360 - a, a dijelaskan satu per satu; pada dua garis berpotongan garis "diputar sedikit" (animasi nilai berubah, sudut seberang ikut sama).
- Tes tampilan: Chrome headless + CDP dengan ketukan sentuh sungguhan, 1180x820 dan 1024x768, ronde penuh tiap mini game termasuk jawaban salah, tanpa error konsol.

## Catatan pembangunan 📖 Soal Cerita (18 Nov 2026)
File: `js/kelas-4/bab-9/soal-cerita-data.js` (data untuk mesin `js/soal-cerita.js`), pos ke-4 di `bab.js` (terbuka setelah pos Tahap 1 terakhir berbintang), cek logika `tools/cek-soal-cerita-bab9.js`. Pesan inti: **garis lurus = 180°, silang = berseberangan sama besar**; derajat bilangan bulat, kunci dihitung kode.
- **Sudut di garis lurus** (balok, jalan, lampu sorot, kue): 180° dikurangi semua sudut yang diketahui. T1 satu sudut, T2 dua, T3 tiga. Pengecoh: dihitung dari 360° atau 90°, lupa satu sudut, menjumlah saja.
- **Perempatan / silang**: dua garis lurus berpotongan, satu sudut diketahui. T2 satu sudut ditanya (seberang atau sebelah); T3 ketiga sudut sekaligus ("seberang, sebelah, sebelah", mis. 55°, 125°, 125°). Pengecoh: seberang dikira 180° - x, sebelah dikira sama, dihitung dari 90° atau 360°.
- **Sejajar atau tegak lurus?** (hanya T1): tiga jalan / rel / selokan, hitung pasangan (3 garis = 3 pasang): tidak pernah bertemu = sejajar, tepat 90° = tegak lurus.
- Tiap tingkat memuat dua jenis (T1: sejajar + lurus; T2: lurus + silang; T3: silang + lurus). T3 + 1-2 angka pengecoh di Tandai. Gambar: sudut berwarna di garis lurus, dua garis bersilang, atau denah garis (pengecoh: garis patah, tanda seberang salah, bentuk lain). Contoh video Ep. 12 / Buku Saku muncul sekitar 12% (Tali Lampu 40° + 85° di T2; perempatan Cemara-Dahlia 55° dan dua penggaris 70° di T3; denah Mawar-Melati-Kenanga di T1).
