// Simple micro-interactions tailored for Year 1 kids (Cheer on Play button tap)
  document.getElementById('btnMulaBermain')?.addEventListener('click', function() {
    this.classList.add('scale-95');
    setTimeout(() => {
      this.classList.remove('scale-95');
    }, 150);
  });

  // Audio Toggle feedback
  const audioBtn = document.getElementById('audioToggleBtn');
  if (audioBtn) {
    let isSpeaking = false;
    audioBtn.addEventListener('click', function() {
      isSpeaking = !isSpeaking;
      const icon = this.querySelector('.material-symbols-outlined');
      const text = this.querySelector('span:last-child');
      if (isSpeaking) {
        icon.textContent = 'record_voice_over';
        text.textContent = 'Bercakap...';
        this.classList.add('bg-secondary-container', 'text-on-secondary-container');
        this.classList.remove('bg-primary', 'text-on-primary');
      } else {
        icon.textContent = 'volume_up';
        text.textContent = 'Dengar Suara';
        this.classList.remove('bg-secondary-container', 'text-on-secondary-container');
        this.classList.add('bg-primary', 'text-on-primary');
      }
    });
  }

  // Cards tactile feedback
  document.querySelectorAll('.building-card').forEach(card => {
    card.addEventListener('click', function() {
      this.classList.add('ring-0', 'bg-surface-container');
      setTimeout(() => {
        this.classList.remove('bg-surface-container');
      }, 200);
    });
  });
