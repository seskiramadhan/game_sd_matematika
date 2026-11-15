// Cek logika mini game Kelas 4 Bab 11 (Luas & Keliling): node tools/cek-bab11.js
// 200 ronde per tingkat per mini game. Kunci dihitung ulang dengan cara lain (titik uji pecahan 1/8 petak dengan bilangan lilitan, tepi petak,
// tali sepatu, jumlah p x l), tepat satu pilihan benar, tidak ada pilihan kembar, contoh di rencana dicek satu per satu.
const L = require('../js/kelas-4/bab-11/luas.js');
const JK = require('../js/kelas-4/bab-11/jalan-keliling.js');
const HP = require('../js/kelas-4/bab-11/hitung-petak.js');
const PB = require('../js/kelas-4/bab-11/potong-bangun.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 300) console.log('GAGAL:', pesan); } };
const RONDE = 200;
const unik = (arr) => new Set(arr).size === arr.length;
const jml = (a) => a.reduce((x, y) => x + y, 0);

// ---- pembanding mandiri: luas dari titik uji pecahan 1/8 petak (bilangan lilitan, bukan sinar) ----
function lilitan(pts, x, y) { // winding number, koordinat desimal
  let w = 0; const n = pts.length;
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n], sisi = (b[0] - a[0]) * (y - a[1]) - (x - a[0]) * (b[1] - a[1]);
    if (a[1] <= y) { if (b[1] > y && sisi > 0) w++; } else if (b[1] <= y && sisi < 0) w--;
  }
  return w !== 0;
}
function luasSampel(pts) {
  const W = Math.max(...pts.map((p) => p[0])), H = Math.max(...pts.map((p) => p[1])), N = 8; let c = 0;
  for (let i = 0; i < W * N; i++) for (let j = 0; j < H * N; j++) if (lilitan(pts, (i + 0.5) / N + 1e-6, (j + 0.5) / N + 1e-6)) c++;
  return c / (N * N);
}
const kelSisi = (pts) => jml(pts.map((p, i) => { const q = pts[(i + 1) % pts.length]; return Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]); }));
// cek satu bangun: luas (kuartal) = tali sepatu / 2 = sampel; keliling sisi = tepi petak
function cekBangun(pts, nama, kel) {
  const sel = L.selDari(pts), luasK = L.luasDariSel(sel);
  cek(Math.abs(luasK - L.luas2(pts) / 2) < 1e-9, nama + ' luas kuartal = tali sepatu');
  if (L.kelilingPts(pts) !== null) cek(Math.abs(luasK - luasSampel(pts)) < 1e-9, nama + ' luas = sampel ' + luasK + ' vs ' + luasSampel(pts)); // sisi miring: pembanding = tali sepatu
  cek(sel.every((s) => s.q === 4 || s.q === 2), nama + ' hanya petak utuh/setengah');
  if (kel !== false) {
    const k = L.kelilingPts(pts);
    cek(k === kelSisi(pts) && k === L.kelilingSel(sel), nama + ' keliling sisi = tepi petak');
  }
  return luasK;
}

// ---- contoh rencana (dihitung ulang) ----
cek(L.jumlah([6, 4, 6, 4]) === 20 && 2 * (6 + 4) === 20, 'kebun 6 x 4 keliling 20');
cek(4 * 5 === 20, 'persegi sisi 5 keliling 20');
cek(cekBangun(L.persegiPanjang(5, 3), 'pp 5x3') === 15, 'luas 5 x 3 = 15');
{
  const Lc = L.bentukL(6, 5, 2, 2); // (6 x 2) + (2 x 3)
  cek(cekBangun(Lc, 'L 6x2+2x3') === 18 && L.kelilingPts(Lc) === 22 && 6 * 2 + 2 * 3 === 18 && 2 * (6 + 5) === 22, 'L 6x2 + 2x3 luas 18 keliling 22');
}
cek(5 + 6 + 7 === 18 && 3 + 4 + 5 + 2 + 6 === 20 && 4 * 7 === 28 && 2 * (9 + 4) === 26, 'keliling berlabel (segitiga, segi lima, persegi, 9 x 4)');
cek(9 + 4 === 13 && 9 * 4 === 36 && 9 + 4 + 9 === 22, 'pengecoh 13, 36, 22');
cek(30 / 2 - 9 === 6 && 2 * (9 + 6) === 30 && 36 / 4 === 9 && 24 - 8 - 7 === 9, 'cari sisi hilang');
{
  const l1 = L.bentukL(5, 4, 2, 2);
  cek(cekBangun(l1, 'L kecil') === 14 && L.kelilingPts(l1) === 18 && L.lensDari(l1).join() === '5,2,3,2,2,4' && 5 * 2 + 2 * 2 === 14 && 2 * 4 + 3 * 2 === 14, 'L kecil luas 14 keliling 18');
  const lb = L.buatL(10, 8, 4, 3);
  cek(L.lensDari(lb.pts).join() === '10,3,6,5,4,8' && L.kelilingPts(lb.pts) === 36 && L.luasPts(lb.pts) === 50, 'L berlabel 10,3,6,5,4,8 keliling 36 luas 50');
  cek(lb.cuts[0].bagian.map(L.luasBagian).join() === '30,20' && lb.cuts[1].bagian.map(L.luasBagian).join() === '32,18' && L.luasKurang(lb.kurang) === 50, 'L berlabel: mendatar 30+20, tegak 32+18, kurang 80-30');
  const T = L.buatT(9, 2, 3, 5);
  cek(L.luasPts(T.pts) === 33 && L.kelilingPts(T.pts) === 32 && 18 + 15 === 33 && 2 * (9 + 7) === 32 && cekBangun(T.pts, 'T 9x2 + 3x5') === 33, 'T luas 33 keliling 32');
  cek(T.cuts.every((c) => jml(c.bagian.map(L.luasBagian)) === 33) && L.luasKurang(T.kurang) === 33, 'T: semua cara potong 33');
}
cek(cekBangun([[0, 0], [6, 0], [4, 2], [2, 2]], 'trapesium', false) === 8 && L.selDari([[0, 0], [6, 0], [4, 2], [2, 2]]).filter((s) => s.q === 4).length === 6 && L.selDari([[0, 0], [6, 0], [4, 2], [2, 2]]).filter((s) => s.q === 2).length === 4, 'trapesium 6 utuh + 4 setengah = 8');
cek(cekBangun([[0, 0], [4, 0], [0, 4]], 'segitiga', false) === 8 && (6 + 4 / 2) === 8, 'segitiga 4,4 = 8');
cek(8 * 6 === 48 && 2 * (8 + 6) === 28 && 8 + 6 === 14 && 9 * 9 === 81 && 12 * 7 === 84 && 56 / 8 === 7 && 8 * 8 === 64, 'rumus luas');
cek(2 * (12 + 7) === 38 && 2 * (120 + 60) === 360 && 30 * 20 === 600 && 18 * 9 === 162, 'satuan');
{
  const j = (a, b) => L.banding(L.ukur(L.persegiPanjang(...a)), L.ukur(L.persegiPanjang(...b)));
  cek(j([6, 2], [4, 3]) === 'luasSama' && j([5, 3], [7, 1]) === 'kelSama' && j([4, 4], [6, 2]) === 'kelSama', 'jebakan contoh');
  cek(L.ukur(L.persegiPanjang(6, 2)).keliling === 16 && L.ukur(L.persegiPanjang(4, 3)).keliling === 14, 'luas 12 keliling 16 / 14');
  const ps = [[12, 1], [6, 2], [4, 3]].map((x) => 2 * (x[0] + x[1]));
  cek(ps.join() === '26,16,14', 'luas 12: keliling 26, 16, 14');
  const g = L.tangga(5, 4, 3);
  cek(L.luasPts(g) === 12 && L.kelilingPts(g) === 16 && L.kelilingPts(L.persegiPanjang(4, 3)) === 14, 'geser 1 petak: luas 12, keliling 16 vs 14');
}
// templat poligon berlawanan jarum jam & sederhana
Object.keys(L.POLI).forEach((n) => L.POLI[n].forEach((p, i) => {
  cek(p.length === Number(n) && L.arahPutar(p) > 0, 'templat poli ' + n + '/' + i + ' berlawanan jarum jam');
  let cembung = true; for (let k = 0; k < p.length; k++) { const a = p[k], b = p[(k + 1) % p.length], c = p[(k + 2) % p.length]; if ((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]) <= 0) cembung = false; }
  cek(cembung, 'templat poli cembung ' + n + '/' + i);
}));

// ---- bentuk acak: luas & keliling dicek silang ----
for (let i = 0; i < 300; i++) {
  [L.acakL(4, 10, 4, 8, 2), L.acakT(7, 10, 5, 8), L.acakU(8, 10, 6, 8)].forEach((b) => {
    const luas = cekBangun(b.pts, 'bentuk ' + b.jenis);
    cek(b.cuts.every((c) => jml(c.bagian.map(L.luasBagian)) === luas), 'jumlah bagian = luas ' + b.jenis);
    cek(L.luasKurang(b.kurang) === luas, 'cara kurang = luas ' + b.jenis);
    // bagian saling lepas dan gabungannya = bangun
    b.cuts.forEach((c) => {
      const semua = new Set(L.selDari(b.pts).map((s) => s.i + ',' + s.j)), dipakai = new Set(); let ok = true;
      c.bagian.forEach((g) => { for (let x = g.x; x < g.x + g.w; x++) for (let y = g.y; y < g.y + g.h; y++) { const k = x + ',' + y; if (dipakai.has(k) || !semua.has(k)) ok = false; dipakai.add(k); } });
      cek(ok && dipakai.size === semua.size, 'bagian lepas dan menutup penuh ' + b.jenis + ' ' + c.id);
    });
    cek(L.lensDari(b.pts).every((x) => x >= 2), 'sisi >= 2 ' + b.jenis);
  });
}

// ---- pilihan jawaban ----
for (let i = 0; i < 500; i++) {
  const k = L.acak(2, 80), o = L.opsiAngka(k, [k + L.acak(-5, 5), 0, -3, 2.5, k]);
  cek(o.length === 4 && unik(o) && o.includes(k) && o.every((v) => Number.isInteger(v) && v > 0), 'opsiAngka ' + JSON.stringify(o));
}

const hitungKode = (opsi, kunci, fn) => opsi.filter((o) => fn(o)).length;
function cekOpsiBulat(s, nama) {
  cek(s.opsi.length === 4 && unik(s.opsi) && s.opsi.includes(s.kunci), nama + ' opsi 4 unik berisi kunci ' + JSON.stringify(s.opsi) + ' ' + s.kunci);
  cek(s.opsi.every((v) => Number.isInteger(v) && v > 0), nama + ' opsi bilangan bulat');
  cek(hitungKode(s.opsi, s.kunci, (v) => s.opsi && JK.periksa(s, v).benar) === 1, nama + ' tepat satu benar');
}

// ---------- 🐾 Jalan Keliling ----------
for (let t = 1; t <= 3; t++) {
  const cacah = {};
  for (let r = 0; r < RONDE; r++) {
    const ronde = JK.buatRonde(t);
    cek(ronde.length === 5 && unik(ronde.map((s) => s.kode)), 'jalan ronde 5 soal berbeda t' + t);
    ronde.forEach((s, idx) => {
      cacah[s.jenis + (s.bentuk || s.tipe || '')] = (cacah[s.jenis + (s.bentuk || s.tipe || '')] || 0) + 1;
      cekOpsiBulat(s, 'jalan ' + s.kode);
      if (s.jenis === 'ketuk') {
        cek(idx < 3 && s.lens.length === s.pts.length, 'ketuk: soal 1-3, jumlah sisi = jumlah titik');
        if (s.bentuk === 'poli') {
          cek(s.lens.reduce((a, b) => a + b, 0) === s.kunci, 'kunci poli = jumlah sisi');
          cek(L.arahPutar(s.pts) > 0, 'poli berlawanan jarum jam');
          if (t === 1) { cek(s.lens.every((x) => x >= 3 && x <= 12) && s.n <= 4, 'poli t1: sisi <= 12, segitiga/segi empat'); if (s.n === 3) { const [a, b, c] = s.lens.slice().sort((x, y) => x - y); cek(a + b > c, 'segitiga bisa dibuat'); } }
          else cek(s.n >= 5 && s.lens.every((x) => x >= 2 && x <= 9), 'poli t2: segi lima/enam');
        } else {
          cek(L.kelilingPts(s.pts) === s.kunci && L.kelilingSel(L.selDari(s.pts)) === s.kunci && 2 * (L.lebarTinggi(s.pts)[0] + L.lebarTinggi(s.pts)[1]) === s.kunci, 'bangun L keliling = 2 (W + H) = tepi petak');
          cek(L.lensDari(s.pts).join() === s.lens.join(), 'lens = sisi poligon');
        }
        if (s.bentuk === 'L') {
          cek(t === 3 && s.tanya.join() === '2,3' && s.lens[2] === s.lens[0] - s.lens[4] && s.lens[3] === s.lens[5] - s.lens[1], 'L berlabel: sisi 2 dan 3 dicari dari sisi seberang');
          cek(s.hint[2] && s.hint[3] && s.lens[2] >= 3 && s.lens[3] >= 3 && s.lens[4] >= 2 && s.lens[1] >= 2, 'L berlabel: petunjuk, lekukan >= 3 x 3');
        }
        if (s.bentuk === 'Lgrid') cek(s.lens[2] >= 2 && s.lens[3] >= 2, 'L petak: lekukan >= 2 x 2');
      } else if (s.jenis === 'pl') {
        cek(idx === 3 && s.kunci === 2 * (s.p + s.l) && s.kunci === s.p + s.l + s.p + s.l && s.p !== s.l, 'pl kunci 2 x (p + l)');
        cek(!s.opsi.some((v) => v === s.kunci && v === s.p + s.l), 'p + l bukan kunci');
        if (t === 1) cek(s.p <= 9 && s.l <= 9, 'pl t1 <= 9'); else cek(s.p <= 15 && s.l <= 10, 'pl t2 batas');
      } else if (s.jenis === 'persegi') {
        cek(idx === 4 && s.kunci === 4 * s.s && s.kunci === s.s + s.s + s.s + s.s, 'persegi kunci 4 x s');
      } else {
        cek(t === 3 && idx >= 2, 'hilang di tingkat 3 soal 3-5');
        if (s.tipe === 'pp') cek(2 * (s.p + s.kunci) === s.K && s.K % 2 === 0 && s.kunci > 0, 'hilang pp: 2 x (p + l) = K');
        else if (s.tipe === 'persegi') cek(4 * s.kunci === s.K, 'hilang persegi: 4 x s = K');
        else { cek(s.a + s.b + s.kunci === s.K, 'hilang segitiga: a + b + c = K'); const [x, y, z] = [s.a, s.b, s.kunci].sort((p, q) => p - q); cek(x + y > z, 'hilang segitiga bisa dibuat'); }
      }
      const m = JK.soalMirip(s, t);
      cek(m.jenis === s.jenis && m.kode !== s.kode && (m.tipe === s.tipe), 'jalan mirip');
    });
  }
  console.log('Jalan Keliling t' + t + ': ' + JSON.stringify(cacah));
}
{ // dugaan salah
  const s = JK.soalPL(1); const d = JK.dugaanSalah(s, s.p + s.l); cek(d && d.jenis === 'setengah', 'dugaan setengah (p + l)');
  const e = JK.soalPoli(1); const d2 = JK.dugaanSalah(e, e.kunci - e.lens[2]); cek(d2 && d2.jenis === 'lewat', 'dugaan lewat satu sisi');
}

// ---------- 🟦 Hitung Petak ----------
for (let t = 1; t <= 3; t++) {
  const cacah = {};
  for (let r = 0; r < RONDE; r++) {
    const ronde = HP.buatRonde(t);
    cek(ronde.length === 5 && unik(ronde.map((s) => s.kode)), 'petak ronde 5 soal berbeda t' + t);
    ronde.forEach((s, idx) => {
      cacah[s.jenis] = (cacah[s.jenis] || 0) + 1;
      cek(s.opsi.length === 4 && unik(s.opsi.map((o) => o.kode)) && unik(s.opsi.map((o) => o.teks)), 'petak opsi 4 unik ' + s.kode);
      cek(s.opsi.filter((o) => HP.periksa(s, o.kode).benar).length === 1 && s.opsi.some((o) => o.kode === s.kunci), 'petak tepat satu benar ' + s.kode);
      if (s.jenis !== 'satuan') cek(s.opsi.every((o) => Number.isInteger(o.v) && o.v > 0), 'petak opsi bilangan bulat');
      if (s.jenis === 'petak') {
        const luas = cekBangun(s.pts, 'petak ' + s.bentuk, false);
        cek(Number.isInteger(luas) && s.kunci === luas + '|petak' && s.luas === luas, 'petak kunci = luas ' + luas);
        cek(s.penuh + s.setengah / 2 === luas && s.setengah % 2 === 0, 'penuh + setengah/2 = luas');
        const uru = HP.urutanIsi(s.pts), pakai = uru.flatMap((u) => u.sel.map((x) => x.i + ',' + x.j));
        cek(unik(pakai) && pakai.length === L.selDari(s.pts).length && uru.length === luas, 'urutan isi menutup semua petak; jumlah langkah = luas');
        cek(uru.every((u) => (u.sel.length === 2 ? u.sel.every((x) => x.q === 2) : u.sel[0].q === 4)), 'setengah berpasangan');
        cek(idx < 3 && s.wajib === (t === 1), 'petak: soal 1-3, wajib ketuk hanya tingkat 1');
        if (t === 1) cek(s.setengah === 0 && s.W * s.H <= 20 + 6, 'petak t1 utuh & kecil');
        if (t === 2 && idx < 2) cek(s.setengah > 0, 'petak t2: soal 1-2 ada setengah petak');
        if (t === 3) cek(s.setengah > 0, 'petak t3: setengah petak');
        cek(s.opsi.every((o) => o.u === 'petak'), 'petak satuan petak');
      } else if (s.jenis === 'rumus') {
        cek(s.p > s.l && s.luas === s.p * s.l && s.kunci === s.luas + '|' + L.kuadrat(s.satuan) && s.keliling === 2 * (s.p + s.l), 'rumus p x l');
        cek(!s.opsi.some((o) => o.v === s.p + s.l && o.kode === s.kunci), 'p + l bukan kunci');
        if (t < 3) cek(s.opsi.every((o) => o.u === L.kuadrat(s.satuan)), 'satuan tidak dinilai di tingkat 1-2');
        else cek(s.opsi.some((o) => o.v === s.luas && o.u === s.satuan), 'tingkat 3: ada pengecoh satuan (48 cm vs 48 cm²)');
        cek((t === 1) === (s.grid === 'tepi'), 'rumus grid tepi hanya tingkat 1');
      } else if (s.jenis === 'persegi') {
        cek(s.luas === s.s * s.s && s.kunci === s.luas + '|' + L.kuadrat(s.satuan), 'persegi s x s');
      } else if (s.jenis === 'cari') {
        cek(s.luasSoal === s.p * s.l && s.luasSoal / s.p === s.l && s.kunci === s.l + '|' + s.satuan, 'cari: luas : p = l');
        cek(s.opsi.some((o) => o.v === s.l && o.u === L.kuadrat(s.satuan)), 'cari: pengecoh satuan');
      } else if (s.jenis === 'persegiLuas') {
        cek(s.luasSoal === s.s * s.s && s.kunci === s.s + '|' + s.satuan, 'persegi dari luas');
      } else {
        const b = HP.BENDA_SATUAN.find((x) => x.id === s.benda);
        cek(s.opsi.length === 4 && s.kunci === b.kunci && /luas/i.test(b.teks) === /2$/.test(b.kunci) && (/(keliling|panjang)/i.test(b.teks) === !/2$/.test(b.kunci)), 'satuan: luas -> persegi, keliling/panjang -> garis');
      }
      const m = HP.soalMirip(s, t);
      cek(m.jenis === s.jenis && m.kode !== s.kode, 'petak mirip');
    });
  }
  console.log('Hitung Petak t' + t + ': ' + JSON.stringify(cacah));
}
{ // contoh satuan dari rencana
  const ket = Object.fromEntries(HP.BENDA_SATUAN.map((b) => [b.id, b.kunci]));
  cek(ket.sampul === 'cm2' && ket.voli === 'm2' && ket.pagar === 'm' && ket.meja === 'cm' && ket.kamar === 'm2', 'satuan contoh rencana');
  HP.BENDA_SATUAN.filter((b) => /×/.test(b.ket)).forEach((b) => { // angka di keterangan dihitung ulang
    const m = b.ket.match(/^(2 × \()?(\d+) (?:cm|m)(?: [×+] )(\d+) (?:cm|m)\)? = (\d+)/);
    if (!m) return;
    const a = Number(m[2]), c = Number(m[3]), hasil = Number(m[4]);
    cek(m[1] ? 2 * (a + c) === hasil : a * c === hasil, 'keterangan ' + b.id);
  });
}

// ---------- ✂️ Potong Bangun ----------
for (let t = 1; t <= 3; t++) {
  const cacah = {}, jb = {};
  for (let r = 0; r < RONDE; r++) {
    const ronde = PB.buatRonde(t);
    cek(ronde.length === 5 && unik(ronde.map((s) => s.kode)), 'potong ronde 5 soal berbeda t' + t);
    cek(ronde.slice(0, 3).every((s) => s.jenis === 'potong') && ronde.slice(3).every((s) => s.jenis !== 'potong'), 'potong: soal 1-3 potong, 4-5 jebakan');
    ronde.forEach((s, idx) => {
      cacah[s.jenis + (s.nama || '')] = (cacah[s.jenis + (s.nama || '')] || 0) + 1;
      if (s.jenis === 'potong') {
        const b = s.bentuk, luas = cekBangun(b.pts, 'potong ' + b.jenis);
        cek(s.kunci === luas && luasSampel(b.pts) === luas, 'potong kunci = luas');
        cek(s.grid === (t === 1) && (t === 1) === (s.satuan === 'petak'), 'potong: kertas petak hanya tingkat 1');
        cek(b.cuts.length === 2 && b.cuts.every((c) => c.garis.length >= 1 && c.bagian.length >= 2), 'dua cara potong');
        b.cuts.forEach((c) => {
          const opT = PB.opsiTotal(s, c);
          cek(opT.length === 4 && unik(opT) && opT.includes(luas) && opT.filter((v) => v === luas).length === 1, 'opsi total memuat kunci satu kali');
          c.bagian.forEach((g) => {
            const o = PB.opsiBagian(g);
            cek(o.length === 4 && unik(o) && o.includes(g.w * g.h), 'opsi bagian memuat kunci');
            cek(g.w > 0 && g.h > 0 && L.luasPts(L.persegiPanjang(g.w, g.h)) === g.w * g.h, 'bagian persegi panjang');
          });
          // garis potong berada di dalam bangun (bukan di tepi luar): titik tengah garis harus di dalam atau pada batas dua bagian
          c.garis.forEach((g) => { const mx = (g[0] + g[2]) / 2, my = (g[1] + g[3]) / 2; cek(L.luasPts(b.pts) > 0 && lilitan(b.pts, mx + 0.01, my + 0.01) || lilitan(b.pts, mx - 0.01, my - 0.01) || lilitan(b.pts, mx + 0.01, my - 0.01) || lilitan(b.pts, mx - 0.01, my + 0.01), 'garis potong di dalam bangun'); });
        });
        if (t === 1) cek(L.lebarTinggi(b.pts)[0] <= 6 && b.jenis === 'L', 'potong t1: L kecil');
        if (t === 2) cek(b.jenis === 'L' || b.jenis === 'T', 'potong t2: L atau T');
        if (t === 3) cek(L.lebarTinggi(b.pts)[0] <= 10 && L.lebarTinggi(b.pts)[1] <= 8, 'potong t3: sampai 10 x 8');
      } else if (s.jenis === 'jebakan') {
        jb[s.tipe + '>' + s.kunci] = (jb[s.tipe + '>' + s.kunci] || 0) + 1;
        const [a, c] = s.pts, la = cekBangun(a, 'jebakan A'), lc = cekBangun(c, 'jebakan B'), ka = L.kelilingPts(a), kc = L.kelilingPts(c);
        const jawab = la === lc && ka === kc ? 'sama' : la === lc ? 'luasSama' : ka === kc ? 'kelSama' : 'beda';
        cek(s.kunci === jawab && s.ukur[0].luas === la && s.ukur[1].luas === lc && s.ukur[0].keliling === ka && s.ukur[1].keliling === kc, 'jebakan kunci ' + jawab);
        cek(s.opsi.length === 4 && unik(s.opsi.map((o) => o.kode)) && s.opsi.filter((o) => PB.periksa(s, o.kode).benar).length === 1, 'jebakan satu benar');
        cek((s.tipe === 'geser' ? 'luasSama' : s.tipe) === jawab, 'jebakan tipe = jawaban');
        if (t === 1) cek(s.tipe === 'luasSama' || s.tipe === 'kelSama', 'jebakan t1: luas sama / keliling sama');
        if (t === 3) cek(s.tipe === 'geser', 'jebakan t3: geser 1 petak');
      } else {
        cek(idx === 3 && t === 3, 'pendek di tingkat 3 soal 4');
        cek(s.bangun.length === 3 && s.bangun.every((x) => x.w * x.h === s.luas && x.keliling === 2 * (x.w + x.h) && L.luasPts(x.pts) === s.luas && L.kelilingPts(x.pts) === x.keliling), 'pendek: luas sama, keliling dihitung');
        const kel = s.bangun.map((x) => x.keliling), min = Math.min(...kel);
        cek(unik(kel) && s.kunci === 'b' + kel.indexOf(min) && s.opsi.filter((o) => PB.periksa(s, o.kode).benar).length === 1, 'pendek: keliling terkecil tunggal');
        const m = s.bangun[Number(s.kunci.slice(1))];
        cek(Math.abs(m.w - m.h) === Math.min(...s.bangun.map((x) => Math.abs(x.w - x.h))), 'pendek: yang paling mirip persegi');
      }
      const m = PB.soalMirip(s, t);
      cek(m.jenis === s.jenis && m.kode !== s.kode, 'potong mirip');
    });
  }
  console.log('Potong Bangun t' + t + ': ' + JSON.stringify(cacah) + ' ' + JSON.stringify(jb));
}
{ // jebakan 'sama' (L dan persegi panjang) hanya muncul di tingkat 2 dan benar-benar sama
  for (let i = 0; i < 50; i++) { const p = PB.pasangan('sama'); cek(p.kunci === 'sama' && p.ukur[0].luas === p.ukur[1].luas && p.ukur[0].keliling === p.ukur[1].keliling, 'pasangan sama'); }
}

console.log(gagal ? gagal + ' GAGAL' : 'Semua cek Bab 11 lulus.');
process.exit(gagal ? 1 : 0);
