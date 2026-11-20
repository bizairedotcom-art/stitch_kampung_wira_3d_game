// Simple micro-interaction for child feedback
  const audioBtn = document.getElementById('btn-audio');
  if (audioBtn) {
    audioBtn.addEventListener('click', function() {
      const origText = audioBtn.innerHTML;
      audioBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] text-secondary animate-spin">graphic_eq</span> <span>Rimau Bercakap...</span>';
      setTimeout(() => {
        audioBtn.innerHTML = origText;
      }, 1500);
    });
  }

  const submitBtn = document.getElementById('btn-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', function() {
      submitBtn.classList.remove('bg-primary');
      submitBtn.classList.add('bg-primary-container');
      submitBtn.innerHTML = '<span class="material-symbols-outlined text-[28px] animate-bounce">celebration</span> <span>TAHNIAH! BETUL! +10 XP</span>';
      setTimeout(() => {
        submitBtn.classList.remove('bg-primary-container');
        submitBtn.classList.add('bg-primary');
        submitBtn.innerHTML = '<span class="material-symbols-outlined text-[28px]">arrow_forward</span> <span>SOALAN SETERUSNYA (4/5)</span>';
      }, 1200);
    });
  }
