(function() {
    const cards = document.querySelectorAll('.choice-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => {
          c.classList.remove('bg-surface-container-lowest', 'shadow-[0_4px_0_#006947]');
          c.classList.add('bg-surface-container-low', 'shadow-[0_4px_0_#6d7a72]');
          const badge = c.querySelector('.status-badge');
          if (badge) {
            badge.classList.add('hidden');
            badge.classList.remove('flex', 'bg-primary-fixed', 'text-on-primary-fixed-variant');
          }
        });
        card.classList.remove('bg-surface-container-low', 'shadow-[0_4px_0_#6d7a72]');
        card.classList.add('bg-surface-container-lowest', 'shadow-[0_4px_0_#006947]');
        const activeBadge = card.querySelector('.status-badge');
        if (activeBadge) {
          activeBadge.classList.remove('hidden');
          activeBadge.classList.add('flex', 'bg-primary-fixed', 'text-on-primary-fixed-variant');
          activeBadge.innerHTML = '<span class="material-symbols-outlined text-[16px]">check_circle</span><span>Terpilih</span>';
        }
      });
    });

    const btnVoice = document.getElementById('btnVoiceGuide');
    if (btnVoice) {
      btnVoice.addEventListener('click', () => {
        btnVoice.classList.add('scale-95');
        setTimeout(() => btnVoice.classList.remove('scale-95'), 150);
      });
    }

    const btnSubmit = document.getElementById('btnSubmitDecision');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        btnSubmit.classList.add('scale-95');
        setTimeout(() => {
          btnSubmit.classList.remove('scale-95');
        }, 200);
      });
    }
  })();
