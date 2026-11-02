// Suara: efek kecil (Web Audio) + frasa TTS (audio/umum/*.mp3).
// Safari iPad: AudioContext baru boleh berbunyi setelah sentuhan pertama -> buka() dipanggil di pointerdown pertama.
(function () {
  const FRASA = ['benar', 'hebat', 'pintar', 'coba-lagi', 'hampir', 'ayo-mulai', 'semangat',
    'bintang-0', 'bintang-1', 'bintang-2', 'bintang-3'];
  let ctx = null;
  const buffer = {};
  let nyala = true;
  try { if (window.Simpan && Simpan.pengaturan('suara') === false) nyala = false; } catch (e) {}

  function buatCtx() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    return ctx;
  }

  function muatFrasa() {
    FRASA.forEach((nama) => {
      fetch('audio/umum/' + nama + '.mp3')
        .then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then((ab) => new Promise((ok, gagal) => ctx.decodeAudioData(ab, ok, gagal)))
        .then((buf) => { buffer[nama] = buf; })
        .catch(() => { /* fallback ke <audio> saat diputar */ });
    });
  }

  let terbuka = false;
  function buka() {
    if (terbuka) { if (ctx && ctx.state === 'suspended') ctx.resume(); return; }
    terbuka = true;
    const c = buatCtx();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    // bunyi kosong untuk "membuka kunci" audio di iOS
    const b = c.createBuffer(1, 1, 22050);
    const s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(0);
    muatFrasa();
  }
  document.addEventListener('pointerdown', buka, true);
  document.addEventListener('touchend', buka, true);

  function nada(frek, mulai, durasi, tipe, vol, frekAkhir) {
    if (!ctx || !nyala) return;
    const t = ctx.currentTime + mulai;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipe || 'sine';
    o.frequency.setValueAtTime(frek, t);
    if (frekAkhir) o.frequency.exponentialRampToValueAtTime(frekAkhir, t + durasi);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.25, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + durasi);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + durasi + 0.05);
  }

  let sumberSekarang = null;
  window.Suara = {
    efek(nama) {
      if (nama === 'ding') { nada(880, 0, 0.18, 'sine', 0.25); nada(1320, 0.1, 0.3, 'sine', 0.22); }
      else if (nama === 'boing') { nada(320, 0, 0.35, 'triangle', 0.25, 140); }
      else if (nama === 'pop') { nada(600, 0, 0.08, 'sine', 0.18, 900); }
      else if (nama === 'tada') { [523, 659, 784, 1047].forEach((f, i) => nada(f, i * 0.12, 0.3, 'triangle', 0.2)); }
    },
    frasa(nama, jeda) {
      if (!nyala) return;
      const putar = () => {
        if (sumberSekarang) { try { sumberSekarang.stop(); } catch (e) {} sumberSekarang = null; }
        if (ctx && buffer[nama]) {
          const s = ctx.createBufferSource(); s.buffer = buffer[nama]; s.connect(ctx.destination); s.start(0);
          sumberSekarang = s;
        } else {
          try { const a = new Audio('audio/umum/' + nama + '.mp3'); a.play().catch(() => {}); } catch (e) {}
        }
      };
      if (jeda) setTimeout(putar, jeda); else putar();
    },
    get nyala() { return nyala; },
    set nyala(v) { nyala = !!v; try { Simpan.pengaturan('suara', nyala); } catch (e) {} },
  };
})();
