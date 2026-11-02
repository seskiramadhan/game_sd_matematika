// Penyimpanan progres di localStorage (selalu dibungkus try/catch).
(function () {
  const KUNCI = 'msd-progres-v1';
  let data = {};
  try { data = JSON.parse(localStorage.getItem(KUNCI)) || {}; } catch (e) { data = {}; }

  function tulis() {
    try { localStorage.setItem(KUNCI, JSON.stringify(data)); } catch (e) { /* mode privat: abaikan */ }
  }

  window.Simpan = {
    // progres satu pos: { bintang: terbaik (semua tingkat), bintangT: {tingkat: terbaik}, tingkat: tingkat sekarang (1-3), main: jumlah main }
    pos(babId, posId) {
      const b = data[babId] || {};
      const p = Object.assign({ bintang: 0, tingkat: 1, main: 0 }, b[posId] || {});
      if (!p.bintangT) {
        // progres lama tanpa bintangT: 3 bintang + sudah naik = didapat di tingkat sebelumnya
        p.bintangT = {};
        if (p.bintang === 3 && p.tingkat > 1) p.bintangT[p.tingkat - 1] = 3;
        else if (p.bintang > 0) p.bintangT[p.tingkat] = p.bintang;
      } else p.bintangT = Object.assign({}, p.bintangT);
      return p;
    },
    catatHasil(babId, posId, tingkatDimainkan, bintang) {
      const p = this.pos(babId, posId);
      p.main += 1;
      p.bintang = Math.max(p.bintang, bintang);
      p.bintangT[tingkatDimainkan] = Math.max(p.bintangT[tingkatDimainkan] || 0, bintang);
      let naik = false;
      if (bintang === 3 && tingkatDimainkan >= p.tingkat && tingkatDimainkan < 3) {
        p.tingkat = tingkatDimainkan + 1;
        naik = true;
      }
      data[babId] = data[babId] || {};
      data[babId][posId] = p;
      tulis();
      return { naik, tingkatBaru: p.tingkat };
    },
    pengaturan(nama, nilai) {
      data._atur = data._atur || {};
      if (nilai === undefined) return data._atur[nama];
      data._atur[nama] = nilai;
      tulis();
    },
  };
})();
