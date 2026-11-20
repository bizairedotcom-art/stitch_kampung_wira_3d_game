// Simple playful audio cue & interactive companion picker micro-interactions
  (function initVillageConfirmation() {
    const companionChips = document.querySelectorAll('.companion-chip');
    const effectText = document.getElementById('companion-effect');
    const confirmBtn = document.getElementById('btn-confirm-build');
    const voiceBtn = document.getElementById('btn-voice-prompt');
    const closeBtn = document.getElementById('btn-close-modal');
    const cancelBtn = document.getElementById('btn-cancel-plot');

    const companionData = {
      merbok: "Jimat 3 Minit (Seni)!",
      utan: "Bonus Kayu +10%!",
      kancil: "Jimat 2 Minit & XP!"
    };

    companionChips.forEach(chip => {
      chip.addEventListener('click', () => {
        companionChips.forEach(c => {
          c.classList.remove('bg-primary-fixed-dim/40', 'shadow-[0_3px_0_#006947]');
          c.classList.add('bg-surface-container', 'shadow-[0_3px_0_#bccac0]');
          const checkmark = c.querySelector('.checkmark');
          if (checkmark) checkmark.classList.add('hidden');
        });

        chip.classList.remove('bg-surface-container', 'shadow-[0_3px_0_#bccac0]');
        chip.classList.add('bg-primary-fixed-dim/40', 'shadow-[0_3px_0_#006947]');
        const activeCheck = chip.querySelector('.checkmark');
        if (activeCheck) activeCheck.classList.remove('hidden');

        const companion = chip.getAttribute('data-companion');
        if (companion && effectText) {
          effectText.textContent = companionData[companion] || "Bantu Membina!";
          effectText.classList.add('scale-110');
          setTimeout(() => effectText.classList.remove('scale-110'), 180);
        }
      });
    });

    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        voiceBtn.classList.add('scale-90');
        setTimeout(() => voiceBtn.classList.remove('scale-90'), 150);
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        confirmBtn.innerHTML = `
          <span class="material-symbols-outlined text-headline-sm animate-bounce text-secondary-fixed">done_all</span>
          <span class="tracking-wide uppercase">DIBINA! TAHNIAH WIRA!</span>
        `;
      });
    }

    const dismissAction = () => {
      const modal = document.querySelector('.max-w-md');
      if (modal) {
        modal.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
        modal.style.transform = 'scale(0.9)';
        modal.style.opacity = '0.4';
        setTimeout(() => {
          modal.style.transform = 'scale(1)';
          modal.style.opacity = '1';
        }, 800);
      }
    };

    if (closeBtn) closeBtn.addEventListener('click', dismissAction);
    if (cancelBtn) cancelBtn.addEventListener('click', dismissAction);
  })();
