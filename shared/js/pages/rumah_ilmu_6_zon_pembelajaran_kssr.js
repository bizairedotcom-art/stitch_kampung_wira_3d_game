// Simple playful audio feedback simulation for Rimau's advice button
  const voiceBtn = document.getElementById('voiceBtn');
  if (voiceBtn) {
    voiceBtn.addEventListener('click', function() {
      this.classList.add('scale-95');
      const icon = this.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.innerText = 'graphic_eq';
        setTimeout(() => {
          icon.innerText = 'volume_up';
          this.classList.remove('scale-95');
        }, 1500);
      }
    });
  }
