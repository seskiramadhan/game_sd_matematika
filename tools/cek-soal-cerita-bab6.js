// Cek logika 📖 Soal Cerita Kelas 4 Bab 6 (Desimal): node tools/cek-soal-cerita-bab6.js
// Kunci dihitung ulang dengan cara lain: data memakai bilangan bulat perseratus; tes ini memakai TEKS angka yang tampil di cerita:
// diratakan jadi "BB,ff" (nol di depan dan di belakang), dibandingkan huruf demi huruf, dan dikurangi digit demi digit dengan "pinjam".
// Pecahan diubah ke desimal dengan pembagian bersusun (digit demi digit). Juga: pilihan unik & bersebab benar, 3 gambar dengan tepat satu cocok
// (jumlah kotak berwarna / panjang batang sesuai nilai), cerita0 tanpa digit, angka pengecoh (tingkat 3), contoh video ~12%, jebakan "angka panjang".
const M = require('../js/soal-cerita.js');
const D = require('../js/kelas-4/bab-6/soal-cerita-data.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 60) console.log('GAGAL:', pesan); } };

// ---------- pembanding independen (berbasis teks) ----------
// "1,5" -> "01,50"; "0,60" -> "00,60"
const rata = (t) => { const [b, p = ''] = t.split(','); return b.padStart(2, '0') + ',' + (p + '00').slice(0, 2); };
const banding = (x, y) => (x === y ? 0 : x > y ? 1 : -1); // teks sama panjang: urutan huruf = urutan nilai
// pengurangan digit demi digit pada "BB,ff" (x >= y), hasil "BB,ff"
function kurang(x, y) {
  const a = x.replace(',', '').split('').map(Number), b = y.replace(',', '').split('').map(Number), r = [];
  let pinjam = 0;
  for (let i = a.length - 1; i >= 0; i--) { let v = a[i] - b[i] - pinjam; if (v < 0) { v += 10; pinjam = 1; } else pinjam = 0; r.unshift(v); }
  return r.slice(0, 2).join('') + ',' + r.slice(2).join('');
}
// pecahan a/b -> "BB,ff" lewat pembagian bersusun; harus habis dalam 2 angka
function bagi(a, b) {
  let sisa = a, hasil = '0';
  const dig = [];
  for (let i = 0; i < 2; i++) { sisa *= 10; dig.push(Math.floor(sisa / b)); sisa %= b; }
  cek(sisa === 0, 'pecahan ' + a + '/' + b + ' tidak habis dalam 2 angka');
  return hasil.padStart(2, '0') + ',' + dig.join('');
}
const teksAngka = (h) => h.replace(/<span class="pec-a">(\d+)<\/span><span class="pec-b">(\d+)<\/span>/g, '$1/$2').replace(/<[^>]+>/g, '');
const nilaiRata = (t) => { const m = t.match(/^(\d+)\/(\d+)$/); return m ? bagi(+m[1], +m[2]) : rata(t); };
const labelKe = (lab) => rata(lab.replace(/^0$/, '0')); // label opsi selisih: "0,25"
const hundred = (r) => Number(r.replace(',', ''));
const digitSaja = (t) => t.replace(/[^\d]/g, '');

// contoh video
cek(kurang(rata('1,5'), rata('1,25')) === '00,25' && banding(rata('1,5'), rata('1,25')) === 1, 'contoh botol 1,50 - 1,25 = 0,25');
cek(bagi(3, 4) === '00,75' && kurang(rata('0,8'), bagi(3, 4)) === '00,05' && banding(rata('0,8'), bagi(3, 4)) === 1, 'contoh lari 3/4 = 0,75, selisih 0,05');
cek(kurang(rata('0,6'), rata('0,45')) === '00,15', 'contoh tali 0,60 - 0,45 = 0,15');
// jebakan: dibaca sebagai bilangan bulat 125 > 15, padahal 1,25 < 1,5
cek(Number(digitSaja('1,25')) > Number(digitSaja('1,5')) && banding(rata('1,25'), rata('1,5')) === -1, 'jebakan angka panjang 1,25');
cek(Number(digitSaja('0,45')) > Number(digitSaja('0,6')) && banding(rata('0,45'), rata('0,6')) === -1, 'jebakan angka panjang 0,45');

const RONDE = 1500, stat = {};
const g = M.untuk(D);
const KODE_UJI = new Set();
for (let t = 1; t <= 3; t++) {
  const s = stat[t] = { soal: 0, sama: 0, trap: 0, beda: 0, contoh: 0, selisih: 0, tiga: 0, hi: 0, lo: 0, dua: 0, pecah: 0, kotak: 0, garis: 0, p1: 0, jumlah: 0, besarSaja: 0, koma: 0, tp: new Set() };
  for (let r = 0; r < RONDE; r++) {
    const ronde = g.buatRonde(t);
    cek(ronde.length === 5, 'ronde 5 soal');
    cek(new Set(ronde.map((x) => x.kode)).size === 5, 'soal kembar dalam ronde t' + t);
    const ids = D.jenisTingkat(t);
    ronde.forEach((x) => cek(ids.includes(x.jenis), 'jenis di luar tingkat t' + t));
    cek(new Set(ronde.map((x) => x.jenis)).size === new Set(ids).size, 'ronde harus memuat semua jenis tingkat t' + t);
    ronde.concat([g.soalMirip(ronde[0], t)]).forEach((so) => {
      const nama = 't' + t + ' ' + so.kode;
      s.soal++; s.tp.add(so.tp);
      // ----- nilai tampil di cerita, dihitung ulang dari TEKS -----
      const angka = so.segmen.filter((x) => x.k === 'angka');
      const penting = angka.filter((x) => x.penting), pengecoh = angka.filter((x) => !x.penting);
      const tk = penting.map((x) => teksAngka(x.t));
      const n = tk.length;
      cek(n === so.nama.length && (so.mode === 'tiga' ? n === 3 : n === 2), nama + ' jumlah tokoh');
      const nr = tk.map(nilaiRata);
      const pec = tk.map((x) => /\//.test(x));
      tk.forEach((x, i) => { cek(/^\d+,\d{1,2}$/.test(x) || /^\d+\/\d+$/.test(x), nama + ' format angka ' + x); cek(!/\./.test(x), nama + ' titik desimal ' + x); });
      // nilai data = nilai dari teks
      so.items.forEach((it, i) => cek(it.h === hundred(nr[i]), nama + ' nilai data ' + it.h + ' != teks ' + nr[i]));
      cek(JSON.stringify(so.hs) === JSON.stringify(so.items.map((x) => x.h)), nama + ' hs');
      // ----- aturan per tingkat -----
      const hasPec = pec.some(Boolean);
      if (hasPec) s.pecah++;
      const wholes = nr.map((v) => v.split(',')[0]);
      const pendekPanjang = tk.map((x) => (x.split(',')[1] || '').length); // 0 untuk pecahan
      if (t === 1) {
        cek(so.jenis === 'banding' && so.mode === 'dua' && !hasPec && new Set(wholes).size === 1, nama + ' T1 desimal sama bagian utuh');
        cek(pendekPanjang.every((p) => p >= 1 && p <= 2), nama + ' T1 maks 2 angka di belakang koma');
        cek(!(pendekPanjang[0] === 2 && pendekPanjang[1] === 2), nama + ' T1 tidak dua perseratusan');
      }
      if (t === 2) cek(!hasPec && new Set(wholes).size === 1 && pendekPanjang.every((p) => p >= 1 && p <= 2), nama + ' T2 desimal perseratusan, bagian utuh sama');
      if (t === 3) {
        cek(so.mode === 'tiga' || hasPec || (so.jenis === 'selisih' && new Set(wholes).size === 1), nama + ' T3 punya pecahan / tiga tokoh / selisih');
        if (hasPec) cek(wholes.every((w) => w === '00'), nama + ' pecahan hanya < 1');
      }
      cek(so.jenis === 'selisih' ? t >= 2 : true, nama + ' selisih hanya tingkat 2-3');
      cek(so.jenis === 'selisih' ? n === 2 : true, nama + ' selisih dua tokoh');

      // ----- kunci -----
      let benar;
      if (so.jenis === 'banding' && so.mode === 'dua') {
        s.dua++;
        const h = banding(nr[0], nr[1]);
        benar = h === 0 ? 3 : h > 0 ? 1 : 2;
        cek(so.hasil === h, nama + ' hasil');
        if (h === 0) s.sama++; else {
          s.beda++;
          // jebakan: bila dibaca sebagai bilangan tanpa koma, yang lebih besar justru yang lebih kecil
          const naif = banding(String(Number(digitSaja(tk[0]))).padStart(5, '0'), String(Number(digitSaja(tk[1]))).padStart(5, '0'));
          if (!pec.some(Boolean) && naif !== 0 && naif !== h) s.trap++;
        }
        cek(so.labelOpsi[3] && so.opsi.length === 3 && JSON.stringify(so.opsi.slice().sort()) === '[1,2,3]', nama + ' opsi 1 2 3');
        so.opsi.filter((o) => o !== so.kunci).forEach((o) => {
          const sb = teksAngka(so.sebab[o] || '');
          cek(sb.length > 20 && /Ratakan dulu/.test(sb), nama + ' pengecoh tanpa sebab ' + o);
        });
        cek(so.cek.includes('<b>' + so.labelOpsi[so.kunci] + '</b>'), nama + ' cek memuat label kunci');
        cek(so.labelOpsi[1] === so.nama[0] && so.labelOpsi[2] === so.nama[1], nama + ' label nama');
      } else if (so.mode === 'tiga') {
        s.tiga++;
        let terbesar = 0, terkecil = 0;
        for (let i = 1; i < 3; i++) { if (banding(nr[i], nr[terbesar]) > 0) terbesar = i; if (banding(nr[i], nr[terkecil]) < 0) terkecil = i; }
        benar = (so.paling === 'hi' ? terbesar : terkecil) + 1;
        so.paling === 'hi' ? s.hi++ : s.lo++;
        cek(so.paling === 'hi' || so.paling === 'lo', nama + ' paling');
        cek(JSON.stringify(so.opsi.slice().sort()) === '[1,2,3]', nama + ' opsi tiga');
        cek(new Set(nr).size === 3, nama + ' tiga nilai berbeda');
        so.opsi.filter((o) => o !== so.kunci).forEach((o) => cek(teksAngka(so.sebab[o] || '').length > 20, nama + ' sebab tiga'));
        cek(so.cek.includes('<b>' + so.labelOpsi[so.kunci] + '</b>'), nama + ' cek memuat label kunci');
        const naifUrut = [0, 1, 2].some((i) => [0, 1, 2].some((j) => i !== j && pendekPanjang[i] > pendekPanjang[j] && banding(nr[i], nr[j]) < 0));
        if (naifUrut) s.trap++; s.beda++;
      } else { // selisih
        s.selisih++;
        const h = banding(nr[0], nr[1]);
        cek(h !== 0, nama + ' selisih nol');
        const bes = h > 0 ? nr[0] : nr[1], kec = h > 0 ? nr[1] : nr[0];
        const sel = kurang(bes, kec); // "BB,ff"
        benar = hundred(sel);
        cek(so.kunci === benar, nama + ' kunci ' + so.kunci + ' != ' + benar);
        cek(hundred(sel) === Math.abs(hundred(nr[0]) - hundred(nr[1])), nama + ' selisih digit vs bilangan');
        cek(so.s === benar, nama + ' s tersimpan');
        cek(so.opsi.length === 4 && new Set(so.opsi).size === 4, nama + ' 4 opsi unik');
        // label: koma Indonesia, nilai sama dengan kode
        so.opsi.forEach((o) => {
          const lb = so.labelOpsi[o];
          cek(/^\d+(,\d{1,2})?$/.test(lb) && hundred(rata(lb)) === o, nama + ' label opsi ' + o + ' ' + lb);
        });
        // cek memuat penjumlahan kecil + selisih = besar yang benar (diperiksa dengan cara lain)
        const lbKunci = so.labelOpsi[so.kunci];
        cek(so.cek.includes('<b>' + lbKunci + '</b>') && /Cek:/.test(so.cek), nama + ' cek');
        cek(hundred(kec) + hundred(rata(lbKunci)) === hundred(bes), nama + ' kecil + selisih = besar');
        // pengecoh: tidak bernilai sama dengan kunci, sebab sesuai bentuk salahnya
        so.opsi.filter((o) => o !== so.kunci).forEach((o) => {
          const sb = teksAngka(so.sebab[o] || '');
          cek(sb.length > 15, nama + ' pengecoh tanpa sebab ' + o);
          cek(o !== benar, nama + ' pengecoh sama dengan kunci');
          if (/menjumlah/.test(sb)) { cek(o === hundred(nr[0]) + hundred(nr[1]), nama + ' sebab menjumlah'); s.jumlah++; }
          if (/Koma salah tempat/.test(sb)) { cek(o === benar * 10, nama + ' sebab koma salah tempat'); s.koma++; }
          if (/lebih besar saja/.test(sb)) { cek(o === hundred(bes), nama + ' sebab besar saja'); s.besarSaja++; }
          if (/tanpa meratakan/.test(sb)) {
            // bilangan tanpa koma dikurangkan: |125 - 15| dst (diperiksa lewat digit teks)
            cek(o === Math.abs(Number(digitSaja(tk[0])) - Number(digitSaja(tk[1]))), nama + ' sebab tanpa meratakan ' + o); s.p1++;
          }
          if (/persepuluhan, bukan perseratusan/.test(sb)) {
            const f = tk.map((x) => x.split(',')[1]); cek(o === Math.abs(Number(f[0]) - Number(f[1])), nama + ' sebab belakang koma ' + o); s.p1++;
          }
          if (/mengubah/.test(sb)) { cek(/0,\d\d/.test(sb), nama + ' sebab pecahan salah ubah'); s.p1++; }
        });
        // satu pengecoh "jumlah" / "koma" / "besar saja" cukup sering (dicek di akhir)
      }
      cek(so.kunci === benar, nama + ' kunci ' + so.kunci + ' != ' + benar);
      cek(so.opsi.filter((o) => o === so.kunci).length === 1, nama + ' kunci tepat satu');
      cek(!so.sebab[so.kunci], nama + ' kunci punya sebab salah');
      Object.keys(so.sebab).forEach((k) => cek(so.opsi.includes(Number(k)), nama + ' sebab non-opsi ' + k));
      cek(so.cek.length > 40 && /Ratakan/.test(so.cek) && /1 kotak besar = 1 utuh = 100 kotak kecil/.test(so.cek), nama + ' cek');
      // sebab / cek tidak memakai titik desimal (kecuali akhir kalimat)
      cek(!/\d\.\d/.test(teksAngka(so.cek)) && !/\d\.\d/.test(teksAngka(Object.values(so.sebab).join(' '))), nama + ' titik desimal di cek/sebab');

      // ----- cerita & segmen -----
      cek(!/\d/.test(so.cerita0), nama + ' cerita0 ada digit');
      so.kata.forEach((k) => cek(so.cerita0.includes(k), nama + ' kata kunci tidak ada: ' + k));
      so.segmen.filter((x) => x.k !== 'angka').forEach((x) => cek(!/\d/.test(x.t), nama + ' teks segmen ada digit: ' + x.t));
      cek(so.segmen.filter((x) => x.k === 'tanya').length === 1 && so.segmen[so.segmen.length - 1].k === 'tanya', nama + ' satu kalimat tanya di akhir');
      cek(so.segmen[so.segmen.length - 1].t === so.tanya4.teks && so.cerita0.endsWith(so.tanya4.teks), nama + ' tanya = tanya4 = akhir cerita0');
      if (t < 3) cek(pengecoh.length === 0, nama + ' tingkat <3 tanpa pengecoh');
      else cek(pengecoh.length >= 1 && pengecoh.length <= 2, nama + ' tingkat 3 butuh 1-2 pengecoh: ' + pengecoh.length);
      const pn = pengecoh.map((x) => x.nilai);
      const dilarang = new Set(so.hs.concat(tk.flatMap((x) => (/\//.test(x) ? x.split('/').map(Number) : [])), [so.s]).filter((v) => v));
      pn.forEach((p) => cek(Number.isInteger(p) && !dilarang.has(p) && p >= 13 && p <= 45, nama + ' pengecoh bermasalah ' + p));
      cek(new Set(pn).size === pn.length && JSON.stringify(so.angkaPengecoh) === JSON.stringify(pn), nama + ' pengecoh kembar / tidak cocok');
      cek(new Set(so.nama).size === so.nama.length, nama + ' nama kembar');

      // ----- gambar: tepat satu cocok, dihitung dari svg -----
      const gp = so.gambar.pilihan;
      cek(gp.length === 3 && new Set(gp.map((p) => p.id)).size === 3, nama + ' 3 pilihan gambar');
      cek(so.gambar.benar === 'b6-benar' && gp.filter((p) => p.id === 'b6-benar').length === 1, nama + ' gambar benar tepat satu');
      cek(new Set(gp.map((p) => p.svg)).size === 3, nama + ' svg kembar');
      const maks = Math.max(...nr.map(hundred));
      const model = maks >= 100 ? 'garis' : 'kotak';
      model === 'kotak' ? s.kotak++ : s.garis++;
      const baca = (svg) => [...svg.matchAll(/<g data-n="([^"]*)" data-v="(\d+)"(?: data-per="([\d.]+)")?>([\s\S]*?)<\/g>/g)].map((m) => ({ nama: m[1], v: Number(m[2]), per: m[3] && Number(m[3]), isi: m[4] }));
      const seratusDariGambar = (b, k) => { // jumlah kotak berwarna (kotak) atau panjang batang berwarna (garis); selisih: + bagian ditandai
        if (model === 'kotak') {
          const warna = (b.isi.match(/<rect [^>]*rx="1.5" fill="#(?:3A86FF|FF8A3D|2BB673)"/g) || []).length;
          const arsir = (b.isi.match(/<rect [^>]*rx="1.5" fill="url\(#ht\d+\)"/g) || []).length;
          return warna + arsir;
        }
        const rects = [...b.isi.matchAll(/<rect x="20" y="[\d.]+" width="([\d.]+)" height="\d+" rx="4"/g)].map((m) => Number(m[1]));
        return Math.round((rects[0] / b.per) * 100);
      };
      gp.forEach((p) => {
        cek(p.svg.startsWith('<svg') && p.svg.endsWith('</svg>') && !/\d/.test(p.ket), nama + ' svg ' + p.id);
        cek((p.model || model) === model && p.ket === (model === 'kotak' ? 'Kotak seratus' : 'Garis bilangan'), nama + ' model gambar');
        const bs = baca(p.svg);
        cek(bs.length === n && bs.every((b, i) => b.nama === so.nama[i]), nama + ' jumlah/nama tokoh di gambar ' + p.id);
        if (p.id === 'b6-benar') bs.forEach((b, i) => cek(b.v === hundred(nr[i]) && seratusDariGambar(b, i) === b.v, nama + ' gambar benar ' + b.nama + ' ' + b.v + ' vs ' + hundred(nr[i]) + ' (' + seratusDariGambar(b, i) + ')'));
        else cek(bs.some((b, i) => b.v !== hundred(nr[i])), nama + ' pengecoh gambar sama dengan benar ' + p.id);
        bs.forEach((b) => cek(b.v >= 1 && (model === 'garis' || b.v <= 100), nama + ' nilai gambar ' + b.v));
        if (so.jenis === 'selisih') cek(p.svg.includes('>?</text>') || bs.every((b) => b.v === bs[0].v), nama + ' selisih ditandai');
        else cek(!p.svg.includes('>?<'), nama + ' banding tanpa tanda ?');
      });
      // pecahan/desimal di gambar tidak boleh membocorkan jawaban sebagai teks
      cek(gp.every((p) => !p.svg.includes(',')), nama + ' koma di svg (bocor angka)');

      // ----- statistik -----
      const ct = D.CONTOH.some((c) => c.jenis === so.jenis && c.tingkat.includes(t) && c.tp === so.tp && JSON.stringify(c.nama) === JSON.stringify(so.nama) && c.mk().every((x) => so.hs.includes(x.h)));
      if (ct) s.contoh++;
      KODE_UJI.add(so.kode);
    });
  }
}
// ---------- ringkasan statistik ----------
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
for (let t = 1; t <= 3; t++) {
  const s = stat[t];
  console.log('Tingkat ' + t + ': ' + s.soal + ' soal | banding2 ' + s.dua + ' (sama ' + pct(s.sama, s.dua) + '%, jebakan angka panjang ' + pct(s.trap, s.beda) + '%) | tiga ' + s.tiga + ' | selisih ' + s.selisih + ' | pecahan ' + pct(s.pecah, s.soal) + '% | kotak ' + s.kotak + ' garis ' + s.garis + ' | contoh video ' + pct(s.contoh, s.soal) + '% | templat ' + s.tp.size);
}
cek(stat[1].selisih === 0 && stat[1].tiga === 0 && stat[1].dua === stat[1].soal && stat[1].pecah === 0, 'tingkat 1 hanya banding dua tokoh desimal');
cek(stat[2].tiga === 0 && stat[2].selisih > 0 && stat[2].dua > 0 && stat[2].pecah === 0, 'tingkat 2 banding + selisih perseratusan');
cek(stat[3].tiga > 0 && stat[3].selisih > 0 && stat[3].pecah > 0 && stat[3].hi > 0 && stat[3].lo > 0, 'tingkat 3 tiga tokoh + selisih + pecahan');
cek(stat[1].sama / stat[1].dua > 0.05 && stat[2].sama / stat[2].dua > 0.05, '"sama" cukup sering');
cek(stat[1].trap / stat[1].beda > 0.3 && stat[2].trap / stat[2].beda > 0.2, 'jebakan angka panjang cukup sering');
cek(stat[2].jumlah > 0 && stat[3].jumlah > 0 && stat[2].koma > 0 && stat[2].p1 > 0 && stat[2].besarSaja > 0, 'ragam pengecoh selisih muncul');
cek(stat[3].p1 > 0, 'pengecoh pecahan salah ubah muncul');
cek(stat[1].garis > 0 && stat[1].kotak > 0 && stat[2].garis > 0 && stat[3].garis > 0, 'kedua model gambar muncul');
cek(KODE_UJI.size > 300, 'variasi soal cukup: ' + KODE_UJI.size);
const j = (a, b) => pct(a, b) >= 6 && pct(a, b) <= 25;
cek(j(stat[1].contoh, stat[1].soal) && j(stat[2].contoh, stat[2].soal) && j(stat[3].contoh, stat[3].soal), 'contoh video ~12%');

if (gagal) { console.log('\n' + gagal + ' pemeriksaan GAGAL'); process.exit(1); }
console.log('\nSemua pemeriksaan Soal Cerita Bab 6 LULUS (' + (3 * RONDE * 6) + ' soal, ' + KODE_UJI.size + ' kode berbeda).');
