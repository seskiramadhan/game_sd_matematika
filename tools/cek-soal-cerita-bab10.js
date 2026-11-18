// Cek logika 📖 Soal Cerita Kelas 4 Bab 10 (Segi Banyak): node tools/cek-soal-cerita-bab10.js
// BANGUN: nama bangun dihitung ULANG dari titik yang terbaca kembali dari gambar SVG (poligon gambar benar), dengan cara lain
//   (diagonal: saling membagi dua / sama panjang / tegak lurus; bukan pembanding sisi seperti di bangun.js). Setiap ciri di cerita
//   diuji sebagai pernyataan terhadap titik itu. Pilihan nama salah punya sebab yang benar (LEBIH_UMUM ditulis ulang di sini).
// PANJANG: banyak sisi dihitung dari kata di cerita dan dari jumlah pojok bernomor di gambar; kunci = penjumlahan berulang.
// Juga: cerita0 tanpa angka, pengecoh unik, 3 gambar dengan tepat satu yang cocok, contoh video muncul dengan kunci yang sama.
const M = require('../js/soal-cerita.js');
const D = require('../js/kelas-4/bab-10/soal-cerita-data.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 60) console.log('GAGAL:', pesan); } };

const KATA2N = { tiga: 3, empat: 4, lima: 5, enam: 6, tujuh: 7, delapan: 8 };
const EPS = 3e-3; // gambar SVG dibulatkan 2 desimal
const dekat = (a, b) => Math.abs(a - b) <= EPS * Math.max(1, Math.abs(a), Math.abs(b));

// ---- pengenal bentuk cara lain (diagonal) ----
const jarak = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const tengah = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
function sejajarV(a, b) { return Math.abs(a[0] * b[1] - a[1] * b[0]) <= EPS * Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]); }
const sisiV = (P) => P.map((p, i) => [P[(i + 1) % P.length][0] - p[0], P[(i + 1) % P.length][1] - p[1]]);
function pasangSejajar(P) { const s = sisiV(P); return (sejajarV(s[0], s[2]) ? 1 : 0) + (sejajarV(s[1], s[3]) ? 1 : 0); }
function jumlahSiku(P) { const s = sisiV(P), n = P.length; let c = 0; for (let i = 0; i < n; i++) { const a = s[(i + n - 1) % n], b = s[i]; if (Math.abs(a[0] * b[0] + a[1] * b[1]) <= EPS * Math.hypot(...a) * Math.hypot(...b)) c++; } return c; }
function kelasPanjang(P) { const L = sisiV(P).map((v) => Math.hypot(v[0], v[1])), unik = []; return L.map((v) => { let k = unik.findIndex((u) => dekat(u, v)); if (k < 0) { unik.push(v); k = unik.length - 1; } return k; }); }
function namaCaraLain(P) {
  const n = P.length;
  if (n >= 5) return 'segi-' + n;
  if (n === 3) {
    const k = kelasPanjang(P), sama = k[0] === k[1] && k[1] === k[2] ? 3 : (k[0] === k[1] || k[1] === k[2] || k[0] === k[2]) ? 2 : 1;
    const siku = jumlahSiku(P);
    if (siku) return 'siku-siku';
    return sama === 3 ? 'sama-sisi' : sama === 2 ? 'sama-kaki' : 'sembarang';
  }
  // segi empat lewat diagonal
  const d1 = [P[0], P[2]], d2 = [P[1], P[3]];
  const m1 = tengah(...d1), m2 = tengah(...d2);
  const saling = dekat(m1[0], m2[0]) && dekat(m1[1], m2[1]);
  const sama = dekat(jarak(...d1), jarak(...d2));
  const v1 = [P[2][0] - P[0][0], P[2][1] - P[0][1]], v2 = [P[3][0] - P[1][0], P[3][1] - P[1][1]];
  const tegak = Math.abs(v1[0] * v2[0] + v1[1] * v2[1]) <= EPS * jarak(...d1) * jarak(...d2);
  if (saling) return sama && tegak ? 'persegi' : sama ? 'persegi-panjang' : tegak ? 'belah-ketupat' : 'jajargenjang';
  if (pasangSejajar(P) === 1) return 'trapesium';
  const k = kelasPanjang(P);
  if ((k[0] === k[1] && k[2] === k[3]) || (k[1] === k[2] && k[3] === k[0])) return 'layang-layang';
  return 'sembarang';
}
// pernyataan ciri -> uji terhadap titik
function ujiCiri(teks, P) {
  const n = P.length, k = kelasPanjang(P), s = jumlahSiku(P);
  const cacah = {}; k.forEach((x) => { cacah[x] = (cacah[x] || 0) + 1; });
  const terbanyak = Math.max(...Object.values(cacah));
  const adjSama = n === 4 && (k[0] === k[1] || k[1] === k[2] || k[2] === k[3] || k[3] === k[0]);
  const aturan = {
    'dua pasang sisi sejajar': () => n === 4 && pasangSejajar(P) === 2,
    'tepat satu pasang sisi sejajar': () => n === 4 && pasangSejajar(P) === 1,
    'tidak ada sisi yang sejajar': () => n === 4 && pasangSejajar(P) === 0,
    'empat sudut siku-siku': () => n === 4 && s === 4,
    'tidak ada sudut siku-siku': () => s === 0,
    'keempat sisinya sama panjang': () => n === 4 && terbanyak === 4,
    'sisi yang bersebelahan tidak sama panjang': () => n === 4 && !adjSama,
    'dua pasang sisi sama panjang yang bersebelahan': () => n === 4 && terbanyak === 2 && adjSama && Object.keys(cacah).length === 2,
    'ketiga sisinya sama panjang': () => n === 3 && terbanyak === 3,
    'tepat dua sisinya sama panjang': () => n === 3 && terbanyak === 2,
    'semua sudutnya lancip': () => n === 3 && s === 0 && (() => { const v = sisiV(P); for (let i = 0; i < 3; i++) { const a = [-v[(i + 2) % 3][0], -v[(i + 2) % 3][1]], b = v[i]; if (a[0] * b[0] + a[1] * b[1] <= 0) return false; } return true; })(),
    'satu sudutnya siku-siku': () => n === 3 && s === 1,
    'tidak ada dua sisi yang sama panjang': () => n === 3 && terbanyak === 1,
  };
  const m = teks.match(/^(lima|enam|tujuh|delapan) sisi$/);
  if (m) return n === KATA2N[m[1]];
  if (!aturan[teks]) return null;
  return aturan[teks]();
}
// "benar sifatnya, tetapi ada nama lebih tepat" ditulis ulang sendiri
const LEBIH_UMUM = { persegi: ['persegi-panjang', 'belah-ketupat', 'jajargenjang', 'layang-layang'], 'persegi-panjang': ['jajargenjang'], 'belah-ketupat': ['jajargenjang', 'layang-layang'] };
const NAMA2ID = {}; Object.keys(D.NAMA).forEach((id) => { NAMA2ID[D.NAMA[id]] = id; });
const polaPoligon = (svg) => { const m = svg.match(/<polygon points="([^"]+)"/); return m ? m[1].trim().split(/\s+/).map((t) => t.split(',').map(Number)) : null; };
// bentuk sama (kemiripan) dengan titik data: semua rasio panjang antar-titik berurutan sama, setelah gambar diperkecil
function mirip(A, B) {
  if (A.length !== B.length) return false;
  const n = A.length, la = A.map((p, i) => jarak(p, A[(i + 1) % n])), lb = B.map((p, i) => jarak(p, B[(i + 1) % n]));
  const r = lb[0] / la[0];
  return la.every((v, i) => Math.abs(lb[i] / v - r) < 0.02);
}

// contoh video
cek(namaCaraLain([[0, 0], [2, 0], [4, 2], [2, 2]]) === 'jajargenjang' && 2 + 2 === 4, 'contoh Dina jajargenjang, luas 2 + 2 = 4');
cek(6 * 4 === 24 && 5 * 7 === 35, 'contoh pita 24 dan 35');

const RONDE = 1000, stat = {};
const g = M.untuk(D);
const FRAGMEN = ['Itu panjang satu sisi saja', 'dikira 4 sisi', 'Satu sisi terlewat', 'Itu hasil ditambah', 'Terlalu banyak sisi'];
for (let t = 1; t <= 3; t++) {
  stat[t] = { bangun: 0, panjang: 0, contoh: 0, nama: {}, n: {} };
  const s = stat[t];
  for (let r = 0; r < RONDE; r++) {
    const ronde = g.buatRonde(t);
    cek(ronde.length === 5 && new Set(ronde.map((x) => x.jenis)).size === 2, 'ronde 5 soal, dua jenis campur t' + t);
    cek(new Set(ronde.map((x) => x.kode)).size === 5, 'soal kembar dalam ronde');
    ronde.concat([g.soalMirip(ronde[0], t)]).forEach((so, idx) => {
      const nama = 't' + t + ' ' + so.kode;
      cek(!/\d/.test(so.cerita0), nama + ' cerita0 ada digit');
      so.kata.forEach((k) => cek(so.cerita0.includes(k), nama + ' kata kunci tidak ada: ' + k));
      so.segmen.filter((x) => x.k !== 'angka').forEach((x) => cek(!/\d/.test(x.t), nama + ' teks segmen ada digit: ' + x.t));
      cek(so.segmen.filter((x) => x.k === 'tanya').length === 1 && so.segmen[so.segmen.length - 1].k === 'tanya', nama + ' satu kalimat tanya di akhir');
      cek(so.segmen[so.segmen.length - 1].t === so.tanya4.teks && so.cerita0.endsWith(so.tanya4.teks), nama + ' tanya = tanya4 = akhir cerita0');
      cek(so.opsi.length === 4 && new Set(so.opsi).size === 4 && so.opsi.filter((o) => o === so.kunci).length === 1, nama + ' opsi 4 unik: ' + so.opsi);
      cek(!(so.kunci in so.sebab), nama + ' kunci punya sebab salah');
      Object.keys(so.sebab).forEach((k) => cek(so.opsi.includes(Number(k)) && so.sebab[k].length > 10, nama + ' sebab non-opsi'));
      const pengecoh = so.segmen.filter((x) => x.k === 'angka' && !x.penting).map((x) => Number(x.t));
      const gp = so.gambar.pilihan;
      cek(gp.length === 3 && new Set(gp.map((p) => p.id)).size === 3 && gp.filter((p) => p.id === so.gambar.benar).length === 1, nama + ' 3 pilihan gambar, 1 benar');
      gp.forEach((p) => cek(p.svg.startsWith('<svg') && p.svg.endsWith('</svg>') && p.ket.length > 3, nama + ' svg ' + p.id));
      cek(!/  /.test(so.segmen.map((x) => x.t).join('')), nama + ' spasi ganda');

      if (so.jenis === 'bangun') {
        s.bangun++; if (so.contoh) s.contoh++;
        const bn = gp.find((p) => p.id === so.gambar.benar);
        const Pg = polaPoligon(bn.svg);
        // 1. nama dari titik yang digambar (cara lain), bukan dari data
        const idCaraLain = namaCaraLain(Pg);
        const idKunci = Object.keys(D.KODE).find((id) => D.KODE[id] === so.kunci);
        cek(idCaraLain === idKunci, nama + ' nama dari gambar ' + idCaraLain + ' != kunci ' + idKunci);
        cek(namaCaraLain(so.pts) === idKunci && mirip(so.pts, Pg), nama + ' titik data = gambar');
        cek(so.labelOpsi[so.kunci] === D.NAMA[idKunci], nama + ' label kunci');
        // 2. setiap ciri benar untuk bangun itu
        const ciri = so.segmen.filter((x) => x.k === 'angka' && x.penting).map((x) => x.t);
        cek(ciri.length >= 1, nama + ' ada ciri penting');
        ciri.forEach((c) => { const u = ujiCiri(c, so.pts); cek(u === true, nama + ' ciri salah/tak dikenal: ' + c + ' untuk ' + idKunci); cek(so.cerita0.includes(c), nama + ' ciri tidak di cerita0: ' + c); });
        // ciri semua memenuhi, dan yang satu-satunya nama paling khusus dari pasangan: bangun yang diklasifikasi ulang tetap kunci
        // 3. gambar: tepat satu gambar yang cocok dengan SEMUA ciri; nama gambar lain berbeda
        const cocok = gp.filter((p) => { const Pp = polaPoligon(p.svg); return ciri.every((c) => ujiCiri(c, Pp) === true) && namaCaraLain(Pp) === idKunci; });
        cek(cocok.length === 1 && cocok[0].id === so.gambar.benar, nama + ' gambar yang cocok ' + cocok.length);
        const namaGambar = gp.map((p) => namaCaraLain(polaPoligon(p.svg)));
        cek(new Set(namaGambar).size === 3, nama + ' nama gambar kembar ' + namaGambar);
        gp.forEach((p) => cek(namaCaraLain(polaPoligon(p.svg)) === p.tid && mirip(p.pts, polaPoligon(p.svg)), nama + ' gambar ' + p.id + ' tid'));
        // tanda di gambar: jumlah kotak pojok dan panah sesuai bentuknya
        gp.forEach((p) => {
          const Pp = polaPoligon(p.svg), kotak = (p.svg.match(/ Z" fill="#FF8A3D"/g) || []).length, panah = (p.svg.match(/stroke="#2A7BE8"/g) || []).length;
          cek(kotak === jumlahSiku(Pp), nama + ' kotak pojok ' + kotak + ' != ' + jumlahSiku(Pp) + ' ' + p.id);
          cek(panah === (Pp.length === 4 ? [0, 2, 6][pasangSejajar(Pp)] : 0), nama + ' panah ' + panah + ' ' + p.id);
        });
        // 4. pilihan nama: kunci benar, sebab jujur
        so.opsi.forEach((o) => {
          const id = Object.keys(D.KODE).find((x) => D.KODE[x] === o);
          cek(!!id && so.labelOpsi[o] === D.NAMA[id], nama + ' label opsi ' + o);
          if (o === so.kunci) return;
          cek(namaCaraLain(so.pts) !== id, nama + ' pengecoh = kunci');
          const sb = so.sebab[o] || '';
          cek(sb.length > 0, nama + ' pengecoh tanpa sebab ' + id);
          if (/memang benar sifatnya/.test(sb)) cek((LEBIH_UMUM[idKunci] || []).includes(id), nama + ' "benar sifatnya" padahal ' + id + ' tidak lebih umum dari ' + idKunci);
          else if ((LEBIH_UMUM[idKunci] || []).includes(id)) cek(false, nama + ' pengecoh lebih umum tanpa catatan nama lebih tepat');
          cek(sb.includes(D.NAMA[id]), nama + ' sebab tidak menyebut nama ' + id);
        });
        // pengecoh angka (tingkat) dan cek memuat nama kunci
        if (!so.contoh) { cek(pengecoh.length === t - 1 && new Set(pengecoh).size === pengecoh.length && JSON.stringify(so.angkaPengecoh) === JSON.stringify(pengecoh), nama + ' jumlah pengecoh ' + pengecoh.length); }
        cek(so.cek.includes('<b>' + D.NAMA[idKunci] + '</b>'), nama + ' cek tidak memuat nama');
        // kelompok nama tiap tingkat
        const kel = so.opsi.map((o) => Object.keys(D.KODE).find((x) => D.KODE[x] === o));
        if (t === 1) cek(kel.every((id) => ['persegi', 'persegi-panjang', 'jajargenjang', 'trapesium'].includes(id)), nama + ' tingkat 1 nama di luar empat dasar');
        cek(kel.every((id) => (idKunci.startsWith('segi') ? id.startsWith('segi') : ['sama-sisi', 'sama-kaki', 'siku-siku', 'sembarang'].includes(idKunci) ? ['sama-sisi', 'sama-kaki', 'siku-siku', 'sembarang'].includes(id) : ['persegi', 'persegi-panjang', 'jajargenjang', 'belah-ketupat', 'trapesium', 'layang-layang'].includes(id))), nama + ' pilihan campur kelompok ' + kel);
        if (t === 1) cek(!so.contoh && so.pts.length === 4 && !['belah-ketupat', 'layang-layang'].includes(idKunci), nama + ' tingkat 1 hanya empat nama dasar');
        if (t === 3) cek(!so.contoh, 'contoh hanya di tingkat 2');
        if (idx < 5) s.nama[idKunci] = (s.nama[idKunci] || 0) + 1;
      } else {
        s.panjang++; if (so.contoh) s.contoh++;
        // banyak sisi dari kata di cerita + jumlah pojok di gambar benar; panjang sisi dari angka
        const bangunTok = so.segmen.find((x) => x.k === 'angka' && x.penting && !/^\d/.test(x.t));
        const m = bangunTok.t.match(/^segi (tiga|lima|enam|tujuh|delapan) beraturan$/);
        const n = bangunTok.t === 'segitiga sama sisi' ? 3 : KATA2N[m[1]];
        const sTok = so.segmen.filter((x) => x.k === 'angka' && x.penting && /^\d+$/.test(x.t));
        cek(sTok.length === 1, nama + ' tepat satu angka penting');
        const sisi = Number(sTok[0].t);
        cek(so.cerita0.includes(bangunTok.t), nama + ' nama bangun di cerita0');
        let jml = 0; for (let i = 0; i < n; i++) jml += sisi; // penjumlahan berulang
        cek(so.kunci === jml && so.kunci === n * sisi, nama + ' kunci ' + so.kunci + ' != ' + jml);
        cek(so.n === n && so.s === sisi, nama + ' data n/s');
        const R = D.LEVEL[t];
        if (!so.contoh) cek(R.n.includes(n) && sisi >= R.s[0] && sisi <= R.s[1], nama + ' di luar rentang tingkat');
        else cek(t === 1, 'contoh panjang hanya tingkat 1');
        const bn = gp.find((p) => p.id === 'p-benar'), satu = gp.find((p) => p.id === 'p-satu'), lain = gp.find((p) => p.id === 'p-n');
        const nomor = (p) => (p.svg.match(/class="nomor"/g) || []).length, sorot = (p) => (p.svg.match(/class="sorot"/g) || []).length;
        cek(nomor(bn) === n && sorot(bn) === n, nama + ' gambar benar: pojok ' + nomor(bn) + ' sorot ' + sorot(bn));
        cek(nomor(satu) === n && sorot(satu) === 1, nama + ' gambar satu sisi');
        cek(nomor(lain) !== n && sorot(lain) === nomor(lain), nama + ' gambar bangun lain');
        cek(so.gambar.benar === 'p-benar', nama + ' kunci gambar');
        // sebab jujur
        so.opsi.forEach((o) => {
          const sb = so.sebab[o] || '';
          if (/panjang satu sisi saja/.test(sb)) cek(o === sisi, nama + ' sebab satu sisi');
          if (/dikira 4 sisi/.test(sb)) cek(o === 4 * sisi && n !== 4, nama + ' sebab 4 sisi');
          if (/Satu sisi terlewat/.test(sb)) cek(o === (n - 1) * sisi, nama + ' sebab terlewat');
          if (/hasil ditambah/.test(sb)) cek(o === n + sisi, nama + ' sebab tambah');
          if (/Terlalu banyak sisi/.test(sb)) cek(o === (n + 1) * sisi, nama + ' sebab terlalu banyak');
        });
        if (!so.contoh) cek(pengecoh.length === t - 1 && new Set(pengecoh).size === pengecoh.length, nama + ' jumlah pengecoh ' + pengecoh.length);
        const terlarang = new Set([sisi, so.kunci, n]); pengecoh.forEach((p) => cek(!terlarang.has(p), nama + ' pengecoh sama angka penting ' + p));
        cek(so.cek.includes('<b>' + M.fmt(so.kunci) + '</b>') && so.cek.includes(Array(n).fill(sisi).join(' + ')), nama + ' cek');
        s.n[n] = (s.n[n] || 0) + 1;
      }
    });
  }
}
// contoh video muncul dengan kunci yang sama
const lihat = {};
for (let i = 0; i < 60000; i++) {
  for (const [tg, jenis] of [[1, 'panjang'], [2, 'bangun']]) {
    const so = D.buatSoal(tg, jenis, new Set());
    if (so.contoh) lihat[so.jenis + '|' + (so.tid) + '|' + (so.n || '') + '|' + (so.s || '') + '|' + (so.pts ? so.pts.join(';') : '') + '=' + (so.labelOpsi ? so.labelOpsi[so.kunci] : so.kunci)] = 1;
  }
}
const diharap = ['panjang|ubin|6|4|=24', 'panjang|bingkai|5|7|=35', 'bangun|jajargenjang|||0,0;2,0;4,2;2,2=Jajargenjang'];
diharap.forEach((k) => cek(lihat[k], 'contoh video tidak muncul / kunci salah: ' + k));
cek(Object.keys(lihat).length === 3, 'contoh lain muncul: ' + Object.keys(lihat));
const frek = (t, jenis) => { let c = 0, tot = 0; for (let i = 0; i < 20000; i++) { const so = D.buatSoal(t, jenis, new Set()); tot++; if (so.contoh) c++; } return c / tot; };
const f1 = frek(1, 'panjang'), f2 = frek(2, 'bangun');
cek(f1 > 0.08 && f1 < 0.16 && f2 > 0.08 && f2 < 0.16, 'frekuensi contoh ' + f1 + ' ' + f2);
cek(frek(3, 'bangun') === 0 && frek(2, 'panjang') === 0 && frek(1, 'bangun') === 0, 'contoh hanya di tingkat yang ditentukan');
// semua nama muncul per tingkat
cek(['persegi', 'persegi-panjang', 'jajargenjang', 'trapesium'].every((id) => stat[1].nama[id] > 0), 'tingkat 1 semua nama dasar muncul');
cek(['persegi', 'persegi-panjang', 'jajargenjang', 'belah-ketupat', 'trapesium', 'layang-layang', 'sama-sisi', 'sama-kaki', 'siku-siku'].every((id) => stat[2].nama[id] > 0), 'tingkat 2 semua nama muncul');
cek(['segi-5', 'segi-6', 'segi-7', 'segi-8'].every((id) => stat[3].nama[id] > 0) && stat[3].n[3] > 0, 'tingkat 3 segi banyak dan segitiga sama sisi muncul');
cek([1, 2, 3].every((t) => stat[t].bangun > 0 && stat[t].panjang > 0), 'dua jenis muncul di semua tingkat');
// kunci tunggal: persegi tidak pernah jadi pengecoh "kunci" lain dan setiap bangun dikenali dengan dua cara berbeda
for (let i = 0; i < 20000; i++) {
  const P = D.buatSoal(3, 'bangun', new Set());
  cek(D.kenali(P.pts) === namaCaraLain(P.pts) && P.tid === namaCaraLain(P.pts), 'dua pengenal berbeda');
}
console.log('Statistik per tingkat:', JSON.stringify(stat));
console.log(gagal ? 'GAGAL: ' + gagal + ' pemeriksaan' : 'Semua pemeriksaan Soal Cerita Bab 10 lolos.');
process.exit(gagal ? 1 : 0);
