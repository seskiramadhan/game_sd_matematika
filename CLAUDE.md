# CLAUDE.md — Game Matematika SD (repo PUBLIK)

⚠️ Repo ini **publik**. Jangan menaruh data pribadi: nama anak, catatan kelemahan anak, email, isi buku penerbit. Rencana produk, ROADMAP, dan NEXT ada di repo privat `konten_sd_matematika` (pusat komando). **Rencana detail game Tahap 1 + maskot Garuda: `RENCANA.md`.**

## Tujuan
Web game gratis (HTML + CSS + JavaScript, tanpa build step) untuk latihan Matematika SD. Etalase gratis; video & PDF berbayar dijual terpisah.

## Teknis
- Dibuka di Safari iPad, **landscape**, layar sentuh, tombol besar. Juga jalan di HP/laptop.
- Host: **GitHub Pages** dari branch `main`, root folder. URL: `https://seskiramadhan.github.io/game_sd_matematika/`.
- Progres & bintang: `localStorage` (bungkus try/catch). Tanpa login, tanpa server.
- Gaya sama dengan video: latar krem `#FFF6E5`, teks `#1F2A44`, font Poppins (Google Fonts), permen/katak/kotak warna-warni.
- Suara: file audio pendek (dibuat dengan TTS di repo konten) di `audio/`.

## Struktur (rencana)
```
index.html              ← semua layar (Beranda, Kelas, Bab, Peta, Hasil)
css/style.css
js/app.js               ← navigasi, progres, bintang
js/engine.js            ← pola ronde 5 soal, umpan balik, suara
js/kelas-4/bab-3/*.js   ← mini game per bab
audio/kelas-4/bab-3/*.mp3
```

## Alur & aturan game
- Beranda → Pilih Kelas → Pilih Bab → Peta Bab (pos mini game → 📖 Soal Cerita → 🏆) → ronde → Hasil.
- Ronde **5 soal**, angka acak. Bintang: 5 benar ⭐⭐⭐, 4 ⭐⭐, 3 ⭐. Salah → tunjukkan alasannya (visual), soal mirip diulang di akhir ronde.
- Pos berikutnya terbuka setelah pos sebelumnya ≥ 1 bintang. ⭐⭐⭐ menaikkan tingkat.
- Tanpa batas waktu di awal. Pujian untuk langkah, bukan hanya jawaban.
- Soal cerita: 4 langkah (baca → tandai → gambar → hitung & cek), mulai dari cerita tanpa angka.
- Halaman orang tua: tahan logo 3 detik (progres, soal sering salah, reset).
- Tombol 🎬 di peta bab mengarah ke video.

## Git
- Branch: **`main`**. Commit kecil & sering. Tes di browser (Playwright tersedia di ruang kerja Claude) sebelum push.
