(function() {
    const voiceBtn = document.getElementById('btn-voice');
    const openBtn = document.getElementById('btn-open-door');

    if (voiceBtn) {
      voiceBtn.addEventListener('click', function() {
        voiceBtn.classList.add('scale-95');
        setTimeout(() => voiceBtn.classList.remove('scale-95'), 150);
        
        const originalText = voiceBtn.innerHTML;
        voiceBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] text-primary animate-spin">graphic_eq</span> <span class="font-label-sm text-[11px] text-primary font-bold">Memainkan Suara Gong & Aummm...</span>';
        
        setTimeout(() => {
          voiceBtn.innerHTML = originalText;
        }, 2200);
      });
    }

    if (openBtn) {
      openBtn.addEventListener('click', function() {
        // Fun celebratory click particle surge
        openBtn.classList.add('brightness-125');
        setTimeout(() => openBtn.classList.remove('brightness-125'), 200);
      });
    }
  })();
