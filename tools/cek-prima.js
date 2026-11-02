// Cek logika mini game Prima atau Bukan: node tools/cek-prima.js
const L = require('../js/kelas-4/bab-3/prima.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 20) console.log('GAGAL:', pesan); } };

// 1. isPrime dibandingkan dengan saringan Eratosthenes
const N = 200, saring = Array(N + 1).fill(true); saring[0] = saring[1] = false;
for (let i = 2; i * i <= N; i++) if (saring[i]) for (let j = i * i; j <= N; j += i) saring[j] = false;
for (let n = 0; n <= N; n++) cek(L.isPrime(n) === saring[n], 'isPrime(' + n + ')');
cek(L.isPrime(1) === false && L.isPrime(2) === true, '1 bukan prima, 2 prima');
const prima100 = []; for (let n = 1; n <= 100; n++) if (L.isPrime(n)) prima100.push(n);
cek(prima100.length === 25, 'ada 25 prima <= 100');

// 2. pasanganFaktor
for (let n = 1; n <= 100; n++) {
  const [p, q] = L.pasanganFaktor(n);
  cek(p * q === n && p <= q, 'pasangan ' + n);
  cek((p === 1) === (n === 1 || L.isPrime(n)), 'persegi panjang hanya untuk bukan prima: ' + n);
}

// 3. 200 ronde per tingkat
const statistik = {};
for (const t of [1, 2, 3]) {
  let penekanan = 0, tanya = 0, primaCount = 0;
  for (let r = 0; r < 200; r++) {
    const ronde = L.buatRonde(t);
    cek(ronde.length === 5, 'ronde 5 soal');
    cek(ronde.slice(0, 3).every((s) => s.jenis === 'tanya') && ronde.slice(3).every((s) => s.jenis === 'ketuk'), 'urutan jenis');
    const ns = ronde.slice(0, 3).map((s) => s.n);
    cek(new Set(ns).size === 3, 'tanpa angka kembar: ' + ns);
    for (const s of ronde.concat(ronde.map((x) => L.soalMirip(x, t)))) {
      if (s.jenis === 'tanya') {
        tanya++;
        cek(s.n >= 1 && s.n <= L.MAKS[t], 'batas tingkat ' + t + ': ' + s.n);
        cek(s.prima === saring[s.n], 'kunci tanya ' + s.n);
        if (s.prima) primaCount++;
        if (L.PENEKANAN.some((a) => s.n % a === 0 && s.n > a)) penekanan++;
      } else {
        cek(s.a >= 1 && s.b <= L.MAKS[t] && s.b - s.a === 10 && s.angka.length === 11, 'rentang ' + s.a + '-' + s.b);
        cek(s.primaList.length >= 1, 'ada prima di ' + s.a + '-' + s.b);
        cek(JSON.stringify(s.primaList) === JSON.stringify(s.angka.filter((n) => saring[n])), 'kunci ketuk ' + s.a);
        cek(L.periksaKetuk(s, s.primaList).benar === true, 'jawaban benar diterima');
        cek(L.periksaKetuk(s, []).benar === false, 'kosong ditolak');
        cek(L.periksaKetuk(s, s.angka).benar === (s.angka.every((n) => saring[n])), 'semua dipilih ditolak');
      }
    }
  }
  statistik[t] = { tanya, persenPrima: Math.round(100 * primaCount / tanya), persenKelipatan_6_7_8_12: Math.round(100 * penekanan / tanya) };
}
// 4. soal mirip: 1 -> khusus, prima -> prima
const m = L.soalMirip({ jenis: 'tanya', n: 1, prima: false }, 1); cek(m.n === 2, 'mirip dari 1 adalah 2');
console.log('Statistik:', JSON.stringify(statistik));
console.log('Contoh hasil kali 6/7/8/12 tingkat 3:', L.hasilKaliPenekanan(20, 100).join(' '));
console.log(gagal ? 'GAGAL: ' + gagal + ' cek' : 'SEMUA CEK LULUS');
process.exit(gagal ? 1 : 0);
