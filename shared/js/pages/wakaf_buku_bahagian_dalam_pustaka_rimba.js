// Interactive micro-interactions for Year 1 pupils
  const targetSlot = document.getElementById('targetSlot');
  const slotLabel = document.getElementById('slotLabel');
  const syllableBtns = document.querySelectorAll('.syllable-btn');
  const audioToast = document.getElementById('audioToast');
  const audioToastText = document.getElementById('audioToastText');

  function showToast(text) {
    if (!audioToast) return;
    audioToastText.textContent = text;
    audioToast.classList.remove('hidden');
    setTimeout(() => {
      audioToast.classList.add('hidden');
    }, 2200);
  }

  syllableBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const syllable = btn.getAttribute('data-syllable');
      syllableBtns.forEach(b => {
        b.className = 'syllable-btn h-13 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-headline-sm text-headline-sm shadow-[0_3px_0_#ffd0bb] flex items-center justify-center active:translate-y-1 active:shadow-none transition-all';
      });

      if (syllable === 'ku') {
        btn.className = 'syllable-btn h-13 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-headline-sm shadow-[0_3px_0_#005236] flex items-center justify-center active:translate-y-1 active:shadow-none transition-all';
        slotLabel.textContent = 'ku';
        showToast('Hebat! "Bu" + "ku" = Buku 🌟');
      } else {
        btn.className = 'syllable-btn h-13 py-2.5 rounded-xl bg-error-container text-on-error-container font-headline-sm text-headline-sm shadow-[0_3px_0_#93000a] flex items-center justify-center active:translate-y-1 active:shadow-none transition-all';
        slotLabel.textContent = syllable;
        showToast('Cuba lagi ya! Cari suku kata yang tepat.');
      }
    });
  });

  document.getElementById('btnSpeechGuide')?.addEventListener('click', () => {
    showToast('Sang Kancil bersuara: "Mari membaca bersama-sama!"');
  });

  document.getElementById('btnAudioPhonic')?.addEventListener('click', () => {
    showToast('Fonik: B-U -> /bu/, K-U -> /ku/ = /bu.ku/');
  });

  document.getElementById('btnZoomDiorama')?.addEventListener('click', () => {
    showToast('Sudut bacaan wakaf diperbesarkan!');
  });

  document.getElementById('btnMainCta')?.addEventListener('click', () => {
    showToast('Membuka Bab 1: Hikayat Sang Kancil (+50 XP)!');
  });
