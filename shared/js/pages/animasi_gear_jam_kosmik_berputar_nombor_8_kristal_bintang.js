// Interactive Celebration Handler
  const claimBtn = document.getElementById('btn-claim-crystal');
  if (claimBtn) {
    claimBtn.addEventListener('click', () => {
      claimBtn.classList.add('scale-95');
      setTimeout(() => {
        claimBtn.classList.remove('scale-95');
        alert('🌌 Syabas Wira Adam! Kristal Bintang Nilam ke-4 selamat disimpan dalam Beg Wira! Pintu Puncak Menara Langit kini terbuka seluas-luasnya! 🚀⭐');
      }, 150);
    });
  }

  const audioBtn = document.getElementById('btn-audio-victory');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      audioBtn.classList.add('bg-primary-fixed');
      setTimeout(() => {
        audioBtn.classList.remove('bg-primary-fixed');
        alert('🎵 "Tik-tok... KELING! Roda masa berputar rancak mengikut irama gandaan 2! Gendang kejayaan bergema di puncak Kampung Wira!"');
      }, 200);
    });
  }

  const retryBtn = document.getElementById('btn-retry-spin');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      retryBtn.classList.add('scale-95');
      setTimeout(() => {
        retryBtn.classList.remove('scale-95');
        alert('🔄 Gear 4 berputar dengan nombor 8! Pola nombor 2, 4, 6, 8, 10 sentiasa tepat!');
      }, 150);
    });
  }
