# Rencana Game · Kelas 4 Bab 8 (Sudut)

Status: **disetujui Ayah 13 Nov 2026**; Tahap 1 belum dibangun. Aturan umum: `rencana/aturan-game.md`. Maskot: `rencana/maskot-garuda.md`. Pola & mesin sama dengan Bab 3–7 (`js/engine.js`, `js/app.js`); contoh struktur mini game: `js/kelas-4/bab-7/`.

Topik: A. Menamai & jenis sudut · B. Mengukur sudut dengan busur derajat · C. Putaran & 8 arah mata angin.
Format: derajat menempel pada angka (90°), simbol sudut ∠, titik sudut selalu huruf tengah (∠PQR, titik sudut Q).

Pos di peta: 📐 Jenis Sudut → 🔍 Baca Busur → 🧭 Putar Arah (Tahap 1).

## Tahap 1: mini game
| | 📐 Jenis Sudut | 🔍 Baca Busur | 🧭 Putar Arah |
|---|---|---|---|
| Konsep | Lancip < 90°, siku-siku = 90°, tumpul > 90° · titik sudut di tengah nama | Busur: pusat di titik sudut, garis 0° di satu kaki, pilih skala yang mulai dari 0 | ¼ = 90°, ½ = 180°, ¾ = 270°, 1 putaran = 360° · 8 arah, bersebelahan 45° · kanan = searah jarum jam |
| Soal 1–3 | Sudut SVG (diputar acak) → pilih Lancip / Siku-siku / Tumpul | Busur SVG 2 skala (dalam & luar) + sudut, kaki kedua menunjuk 2 angka (mis. 60 & 120) → pilih besar sudut. Pengecoh = angka skala lain | Garuda menghadap satu arah, perintah "putar ¼ putaran ke kanan" → ketuk arah baru di mawar mata angin |
| Soal 4–5 | Sudut berlabel 3 titik (huruf acak, mis. P-Q-R) → pilih nama yang benar (∠PQR / ∠RQP). Pengecoh: huruf titik sudut tidak di tengah | Bentuk sudut sendiri: putar kaki dengan tombol ◀ ▶ (±10°, ±1°) sampai = target (mis. 70°), lalu ✔ | Kebalikan: "dari U ke B putar kanan, berapa derajat?" (pilihan ganda: 90° / 270° / 180°) |
| Kalau salah | Kotak pojok 90° ditempel di sudut: lebih sempit = lancip, lebih lebar = tumpul. Huruf tengah disorot | Tebak dulu: lancip atau tumpul? Lalu sorot skala yang mulai dari 0 di kaki pertama, hitung dari situ | Garuda berputar langkah demi langkah (per 90° atau 45°) dengan hitungan derajat |
| Tingkat 1 / 2 / 3 | Sudut jelas (20–70°, 90°, 110–160°) / dekat 90° (75–85°, 95–105°) / + sudut lurus 180° dan nama ∠ dengan huruf kecil (∠x) | Kelipatan 10°, kaki 0° di kanan (skala dalam) / kelipatan 5°, kaki 0° kiri atau kanan / sembarang 1°, busur ikut diputar | 4 arah (U T S B), ¼ & ½ putaran / 4 arah, 90°, 180°, 270°, kiri & kanan / 8 arah, 45°, 135°, 225°, 315° |

Penekanan: **tebak lancip/tumpul dulu** sebelum membaca busur (jebakan 50° terbaca 130°) dan **huruf titik sudut selalu di tengah**. Jembatan keledai arah ditulis original (bukan dari buku penerbit). Semua sudut derajat bilangan bulat, arah = indeks 0–7 mod 8 (U, TL, T, TG, S, BD, B, BL); tidak ada floating point untuk kunci. Contoh original. Skrip cek `tools/cek-bab8.js`.

## Tahap 2 (belum)
📖 Soal Cerita (sudut jarum jam, arah jalan; mesin `js/soal-cerita.js`) · 🏆 Tantangan Akhir.
