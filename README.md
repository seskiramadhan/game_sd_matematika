# Game Matematika SD

Game web gratis untuk latihan Matematika SD (Kurikulum Merdeka). Dimainkan langsung di browser, cocok untuk iPad/tablet dalam posisi landscape.

**Main:** https://seskiramadhan.github.io/game_sd_matematika/

## Isi
| Kelas | Bab | Mini game | Status |
|---|---|---|---|
| 4 | 3 · Faktor & Kelipatan | 🍬 Bagi Rata (faktor) | ✅ bisa dicoba |
| 4 | 3 · Faktor & Kelipatan | 🐸 Katak Loncat (kelipatan) | ✅ bisa dicoba |
| 4 | 3 · Faktor & Kelipatan | 🧱 Prima atau Bukan | ✅ bisa dicoba |
| 4 | 3 · Faktor & Kelipatan | 🐸🐸 Ketemu di Mana? · 🌳 Pohon Faktor · 📖 Soal Cerita · 🏆 Tantangan Akhir | 🚧 Tahap 2 |
| 4 | 4 · Pecahan (1) | 🍕 Potong Pizza (pembilang & penyebut) | ✅ bisa dicoba |
| 4 | 4 · Pecahan (1) | 🍫 Cokelat Kembar (senilai, sederhanakan sampai habis) | ✅ bisa dicoba |
| 4 | 4 · Pecahan (1) | ⚖️ Mana Lebih Besar (bandingkan & urutkan) | ✅ bisa dicoba |
| 4 | 4 · Pecahan (1) | 📖 Soal Cerita · Pecahan di Garis Bilangan · 🏆 Tantangan Akhir | 🚧 Tahap 2 |
| 4 | 5 · Pecahan (2) | 🥐 Roti Utuh (pecahan campuran) | ✅ bisa dicoba |
| 4 | 5 · Pecahan (2) | 🔄 Tukar Bentuk (tidak murni ↔ campuran) | ✅ bisa dicoba |
| 4 | 5 · Pecahan (2) | 🍓 Bagi Kelompok (pecahan dari kelompok) | ✅ bisa dicoba |
| 4 | 5 · Pecahan (2) | 📖 Soal Cerita · Pecahan Campuran di Garis Bilangan · 🏆 Tantangan Akhir | 🚧 Tahap 2 |
| 4 | 6 · Desimal | 🟦 Kotak Seratus (persepuluhan, perseratusan, pecahan → desimal) | ✅ bisa dicoba |
| 4 | 6 · Desimal | 📏 Garis Desimal (letak desimal di garis bilangan, zoom) | ✅ bisa dicoba |
| 4 | 6 · Desimal | ⚖️ Mana Lebih Besar (bandingkan & urutkan desimal) | ✅ bisa dicoba |
| 4 | 6 · Desimal | 📖 Soal Cerita · 🏆 Tantangan Akhir | 🚧 Tahap 2 |

## Cara main
1. Buka link di Safari/Chrome, putar perangkat ke landscape.
2. Pilih kelas, lalu bab, lalu pos di peta.
3. Tiap ronde 5 soal, kumpulkan bintang ⭐.
4. Tips iPad: Share → **Add to Home Screen** supaya seperti aplikasi.

Progres tersimpan di perangkat (tanpa login).

## Coba di komputer
Jalankan server kecil di folder ini, lalu buka `http://localhost:8000/`:
```
python -m http.server 8000
```
Cek logika soal (jawaban dihitung kode): `node tools/cek-prima.js` dan `node tools/cek-bab3.js` (Bagi Rata & Katak Loncat), `node tools/cek-bab4.js` (Pecahan: Potong Pizza, Cokelat Kembar, Mana Lebih Besar), `node tools/cek-bab5.js` (Pecahan 2: Roti Utuh, Tukar Bentuk, Bagi Kelompok), `node tools/cek-bab6.js` (Desimal: Kotak Seratus, Garis Desimal, Mana Lebih Besar).

Urutan pos di peta: pos berikutnya terbuka setelah pos sebelumnya dapat ≥ 1 ⭐. Pos yang sudah pernah dimainkan selalu tetap terbuka (progres lama tidak terkunci bila ada pos baru).
