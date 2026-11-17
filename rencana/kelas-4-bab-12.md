# Rencana Game · Kelas 4 Bab 12 (Grafik Batang)

Status: **disetujui Ayah 17 Nov 2026 dengan usulan default** (keputusan di bagian akhir, bisa diubah setelah dicoba); **Tahap 1 dibangun 17 Nov 2026** (3 mini game, lihat catatan pembangunan di bawah); Tahap 2 belum. Aturan umum: `rencana/aturan-game.md`. Maskot: `rencana/maskot-garuda.md`. Pola & mesin sama dengan Bab 3-11 (`js/engine.js`, `js/app.js`); contoh struktur mini game: `js/kelas-4/bab-11/`.

Topik: A. **Mengumpulkan data dengan turus** (setiap benda satu garis, ikat 5 = 4 garis tegak + 1 garis miring) dan membaca tabel turus · B. **Membaca diagram batang** dan piktogram (1 gambar = 1 atau 2): nilai tiap batang, paling banyak / paling sedikit, selisih, jumlah · C. **Skala**: garis tiap 1 / 2 / 5; batang di antara dua garis dibaca dengan melihat garis di bawah dan di atasnya (7 pada skala 2) · D. **Membuat diagram batang** dari tabel data dengan tinggi sesuai skala.
Format: bilangan bulat, angka format Indonesia. Warna tetap: tiap kategori punya warna batang sendiri (biru, oranye, hijau, ungu, merah muda) dan warna itu sama di tabel turus, tabel data, dan batang; garis bantu baca = putus-putus kuning. Arti kata selalu tampil: **turus** = tanda garis untuk menghitung, 5 garis jadi satu ikat; **skala** = berapa nilai di tiap garis tegak sumbu; **selisih** = dikurangi, **jumlah** = ditambah.

Pos di peta: 📝 Catat Turus → 📊 Baca Batang → 🏗️ Bangun Batang (Tahap 1).

## Tahap 1: mini game
| | 📝 Catat Turus | 📊 Baca Batang | 🏗️ Bangun Batang |
|---|---|---|---|
| Konsep | Mencatat data = satu benda satu turus · ikat 5 · jumlah = ikat × 5 + sisa · tabel turus dibaca untuk menjawab paling banyak, selisih, jumlah | Membaca batang lewat garis di sumbu · skala (nilai tiap garis) · batang di antara dua garis · piktogram: gambar × nilai satu gambar · selisih = kurang, jumlah = tambah | Data tabel jadi batang sesuai skala · tinggi batang = nilai · batang di tengah garis = setengah skala |
| Soal 1-3 | Benda muncul **satu per satu** (kartu di tengah) atau **sekumpulan** (tersebar): **ketuk benda** → satu turus muncul di baris kategorinya (ikat 5 digambar 4 garis + 1 miring); setelah semua benda diketuk, pilih jumlah satu kategori atau jumlah semua (4 pilihan) | Piktogram (tingkat 1) atau diagram batang: pilih **nilai** satu batang (4 pilihan); garis bantu tidak ditampilkan | Tabel data di kiri, batang di kanan mulai dari 0: ketuk ▲ ▼ di baris tabel atau **ketuk garis** di kolom batang untuk mengatur tinggi; tombol "Sudah" memeriksa |
| Soal 4-5 | Tabel turus sudah jadi (tanpa ketuk): ubah turus jadi angka, paling banyak, jumlah | Paling banyak / paling sedikit (nama kategori), selisih dua batang, jumlah dua batang atau semua batang | Tingkat 2-3: setelah batang benar, satu pertanyaan tentang diagram yang baru dibuat |
| Kalau salah | Semua benda diketuk ulang cepat dan turus ditulis angkanya: "ikat 5 + 3 = 8", jumlah semua "8 + 5 + 4 = 17" | Garis bantu putus-putus dari puncak batang ke sumbu, nilai garis di bawah dan di atas ditulis; selisih "12 − 6 = 6" (bila memilih 18 = jumlah: "selisih itu dikurangi"); jumlah ditulis per batang | Batang yang salah ditandai merah, tinggi yang benar muncul putus-putus dengan angka tabelnya dan skala |
| Tingkat 1 / 2 / 3 | 2-3 kategori, ≤ 5 benda per kategori (total ≤ 12), tabel turus jadi di soal 4-5 (nilai ≤ 9, ubah turus jadi angka) / 3 kategori, 12-20 benda dengan 1-2 ikat, tabel turus 4 kategori di soal 4-5 (jumlah, paling banyak) / ketuk 1 soal (3 kategori, 18-26 benda), lalu baca tabel turus 4-5 kategori (jumlah sampai 40): paling banyak, selisih, jumlah, contoh buah kesukaan | Piktogram 1 gambar = 1 atau 2 dan batang skala 1 (nilai ≤ 10) / skala 2 dengan nilai ganjil di antara dua garis, dan skala 5 / skala 2 (nilai ganjil) dan skala 5 sampai 30, jumlah semua batang, contoh buku dan kue | 3 batang skala 1 / 4-5 batang skala 2 (nilai ganjil di tengah garis) + pertanyaan di soal 3-5 / 5 batang skala 5, garis tiap 5 atau tiap 10 (nilai 15 di tengah garis) + pertanyaan |

Penekanan: **baca skala dulu** (garis di sumbu naik berapa), baru baca batang; **bukan menghitung kotak** tetapi nilai di sumbu; selisih ≠ jumlah; ikat 5 dihitung 5, bukan 1 atau 4. Contoh benda dan cerita original (kecuali tiga contoh yang sama dengan video dan Buku Saku). Semua kunci bilangan bulat; kunci dihitung kode dari data, bukan ditulis. Pengecoh dari salah umum: membaca garis terdekat (6 atau 8 untuk 7), menghitung banyak garis bukan nilai skala, selisih ditukar jumlah, ikat dihitung 1 atau 4, jumlah kategori ditukar jumlah semua. Skrip cek `tools/cek-bab12.js`.

Contoh kunci yang sudah dihitung ulang (muncul ± 12% soal, sama dengan video dan Buku Saku):
- Buah kesukaan 28 murid: mangga 8, jeruk 7, pisang 5, apel 4, semangka 4 → 8 + 7 + 5 + 4 + 4 = 28 · paling banyak mangga · mangga − jeruk = 1 · turus: mangga ikat + 3, jeruk ikat + 2, pisang 1 ikat, apel 4, semangka 4.
- Buku dibaca Senin-Jumat, skala 2: 6, 10, 7, 12, 9 → paling banyak Kamis 12 · paling sedikit Senin 6 · selisih 12 − 6 = 6 · jumlah 6 + 10 + 7 + 12 + 9 = 44 (7 dan 9 berada di antara dua garis).
- Kue Bu Ani, skala 5: Senin 15, Selasa 20, Rabu 10, Kamis 25 → Kamis − Rabu = 15 · jumlah 15 + 20 + 10 + 25 = 70.

## Tahap 2 (belum)
📖 Soal Cerita (**selesai 17 Nov 2026**, lihat catatan di bawah) · 🏆 Tantangan Akhir (campuran: turus → batang → pertanyaan, skala 5, dua diagram dibandingkan).

## Keputusan (17 Nov 2026, usulan default; Ayah boleh ubah setelah dicoba)
1. **Cara menjawab angka**: 4 pilihan dengan pengecoh dari salah umum.
2. **Skala**: tingkat 1 skala 1 (dan piktogram), tingkat 2 skala 2 dengan nilai ganjil, tingkat 3 skala 5 (nilai kelipatan 5) dan skala 2; di Bangun Batang tingkat 3 garis tiap 5 atau tiap 10 dengan tiap ketukan ▲ ▼ naik 5.
3. **Batang salah di Bangun Batang**: pemeriksaan pertama yang salah dihitung soal salah (tidak ada percobaan ulang), lalu penjelasan memperlihatkan batang yang benar; soal yang mirip diulang di akhir ronde.
4. **Video**: tombol 🎬 menampilkan "segera hadir" sampai videonya masuk.

## Catatan pembangunan Tahap 1 (17 Nov 2026)
File: `js/kelas-4/bab-12/` = `grafik.js` (alat bersama `window.Grafik`: data, turus, pertanyaan dengan kunci dari kode, gambar turus, diagram batang SVG, piktogram), `catat-turus.js`, `baca-batang.js`, `bangun-batang.js`, `bab.js`; cek logika `tools/cek-bab12.js` (200 ronde x 3 tingkat x 3 mini game; kunci dihitung ulang dengan cara lain, tepat satu pilihan benar, tiga contoh rencana dicek satu per satu, frekuensi contoh ± 12%).

Hal yang diputuskan saat membangun (di luar tabel rencana):
- Tiap soal memakai topik original (hewan, olahraga, jajanan, warna, cara ke sekolah, bunga, ekskul; hari sekolah untuk botol bekas, pengunjung perpustakaan, sampah plastik, es lilin). Tiga contoh rencana muncul ± 12% soal (Catat Turus tingkat 2-3: buah, Baca Batang tingkat 2-3: buku, kue, buah, Bangun Batang semua tingkat).
- **Catat Turus**: benda satu per satu (kartu besar) hanya di tingkat 1, selain itu sekumpulan; tombol jawab terkunci sampai semua benda diketuk. Penjelasan menampilkan tabel turus dengan angka ("5 + 3 = 8").
- **Baca Batang**: diagram minimal 4 batang supaya "paling banyak / sedikit" punya 4 pilihan nama; kotak samping menampilkan arti skala; penjelasan menggambar garis bantu (putus-putus kuning) dan dua garis di bawah dan di atas batang yang berada di antara dua garis.
- **Bangun Batang**: ▲ ▼ ada di baris tabel (tombol 52-58 px), ketuk kolom batang juga mengatur tinggi (dibulatkan ke langkah terdekat); batang kosong di awal; setelah "Sudah" benar muncul satu pertanyaan (tingkat 1 soal 5, tingkat 2 soal 3-5, tingkat 3 semua soal).
- Tes tampilan: Chrome headless + CDP dengan ketukan sentuh sungguhan, 1180x820 dan 1024x768, ronde penuh tiap mini game tiap tingkat dengan jawaban benar dan salah.

## Catatan pembangunan 📖 Soal Cerita (17 Nov 2026)
- Data `js/kelas-4/bab-12/soal-cerita-data.js`, id `k4b12`. Dua jenis (video Jago Soal Cerita Ep. 5, "Lebih Banyak atau Seluruhnya?"): **Lebih banyak / selisih (kurang)** (lebih banyak, lebih sedikit, atau selisih dua batang: besar dikurangi kecil) dan **Seluruhnya (tambah)** (seluruhnya, jumlah semua batang; di tingkat 3 kadang jumlah dua batang saja). Satu ronde 5 soal memuat kedua jenis.
- 9 topik original (kue, botol bekas, pengunjung perpustakaan, es lilin, kantong sampah, hewan, olahraga, buah, sepeda) x 2 jenis = 18 templat. Cerita tidak memuat angka: angka dibaca dari diagram batang bernomor sumbu, jadi anak **harus membaca skala dulu**. Langkah Tandai: ketuk nama batang yang dipakai (kuning) + kalimat tanya (biru). Langkah Gambar: tiga diagram dengan batang disorot (tanda **?** = dua batang dibandingkan, tanda **+** = digabung, satu batang); anak memilih batang mana yang dibandingkan atau dijumlah.
- Tingkat 1: 2 batang, skala 1 atau 2 (nilai ganjil terbaca di tengah), tanpa angka pengecoh. Tingkat 2: skala 5, 3-4 batang, 1 angka pengecoh, contoh video muncul. Tingkat 3: skala 5 atau 10 (35 terbaca di tengah garis 30 dan 40), 4-5 batang, jumlah dua batang saja, 2 angka pengecoh.
- Contoh yang sama dengan video Ep. 5 dan Buku Saku (tingkat 2, ± 12%): kue Bu Ani skala 5 (Kamis lebih banyak dari Rabu 15; seluruhnya 70), olahraga skala 2 (Bola 9, Renang 6, Bulu tangkis 12, Voli 3: jumlah 30; Bulu tangkis lebih banyak dari Renang 6), sepeda skala 5 (Ali 10, Dini 25, Eka 15: selisih Dini dan Eka 10).
- Jebakan jadi pengecoh dengan penjelasan: menjumlah untuk "lebih banyak", mengurangi untuk "seluruhnya", membaca banyak garis bukan nilainya (kotak, bukan skala), memakai satu batang saja, ada batang yang terlewat, semua batang dijumlah padahal hanya dua yang ditanya.
- Mesin bersama `js/soal-cerita.js` bertambah: `GAMBAR.diagramBatang` (diagram SVG bernomor sumbu dengan sorotan), kolom opsional `soal.diagram` (diagram ikut tampil di langkah Tandai dan Hitung), `soal.arahAngka` dan `soal.hintKurang` (teks arahan langkah Tandai bila yang ditandai bukan angka). Bab 3, 5, 7, 11 tidak berubah perilakunya.
- Aturan pos dan bintang sama dengan bab lain: terbuka setelah Bangun Batang minimal 1 bintang. Cek logika: `node tools/cek-soal-cerita-bab12.js` (3.600 ronde; nilai batang dibaca kembali dari SVG, kunci dihitung ulang dari nama batang di kalimat tanya, tiga contoh video dicek angka persisnya).
