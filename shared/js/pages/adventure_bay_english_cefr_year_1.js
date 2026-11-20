// Interactive micro-interaction for CEFR Multiple Choice buttons
  document.querySelectorAll('.choice-btn').forEach((btn) => {
    btn.addEventListener('click', function() {
      // Clear active styles from siblings
      document.querySelectorAll('.choice-btn').forEach((el) => {
        el.className = 'choice-btn h-16 rounded-xl bg-surface-container text-on-surface flex items-center justify-between px-4 shadow-[0_5px_0_#ffd0bb] active:translate-y-1 active:shadow-[0_1px_0_#ffd0bb] transition-all';
        const icon = el.querySelector('.material-symbols-outlined');
        if (icon) {
          icon.textContent = 'volume_up';
          icon.className = 'material-symbols-outlined text-outline-variant text-[20px]';
        }
      });

      // Apply tactile selected state
      this.className = 'choice-btn active-choice h-16 rounded-xl bg-primary text-on-primary flex items-center justify-between px-4 shadow-[0_5px_0_#005236] transition-all relative';
      const icon = this.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = 'check';
        icon.className = 'material-symbols-outlined text-on-primary-fixed text-[16px]';
      }

      // Small bounce reaction on target-slot
      const slot = document.getElementById('target-slot');
      if (slot) {
        slot.classList.add('scale-105');
        setTimeout(() => slot.classList.remove('scale-105'), 200);
      }
    });
  });

  // Submit button celebratory feedback
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', function() {
      const origText = this.innerHTML;
      this.innerHTML = '<span class="text-xl">🎉</span><span>TAHNIAH! CORRECT! (+50 ⭐)</span><span class="text-xl">🌟</span>';
      this.classList.replace('bg-primary', 'bg-tertiary-container');
      setTimeout(() => {
        this.innerHTML = origText;
        this.classList.replace('bg-tertiary-container', 'bg-primary');
      }, 2500);
    });
  }
