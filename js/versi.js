// Cek versi baru: bandingkan <meta name="versi"> dengan versi.json di server (tanpa cache).
// Bila beda, tampilkan tombol "Perbarui" (tidak saat ronde berjalan). Progres di localStorage tetap aman.
(function () {
  const sekarang = (document.querySelector('meta[name="versi"]') || {}).content || '';
  const tombol = document.getElementById('tombol-perbarui');
  let versiBaru = null;

  function sedangRonde() {
    const r = document.getElementById('layar-ronde');
    return r && r.classList.contains('aktif');
  }

  function tampilkan() {
    tombol.hidden = !versiBaru || sedangRonde();
  }

  function cek() {
    fetch('versi.json?t=' + Date.now(), { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j && j.versi && sekarang && j.versi !== sekarang) versiBaru = j.versi;
        tampilkan();
      })
      .catch(() => { /* offline: abaikan */ });
  }

  tombol.onclick = () => {
    // alamat baru memaksa Safari mengambil index.html (dan css/js ?v=) yang baru
    location.replace(location.pathname + '?v=' + encodeURIComponent(versiBaru));
  };

  cek();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) cek(); });
  setInterval(cek, 5 * 60 * 1000);
  // sembunyikan saat ronde, munculkan lagi sesudahnya
  new MutationObserver(tampilkan).observe(document.getElementById('layar-ronde'), { attributes: true, attributeFilter: ['class'] });
})();
