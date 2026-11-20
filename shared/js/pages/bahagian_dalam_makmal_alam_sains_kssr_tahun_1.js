// Simple micro-interaction for option selection
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', function() {
      // Gentle vibration if supported
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    });
  });

  const recordBtn = document.getElementById('btn-rekod-penemuan');
  if (recordBtn) {
    recordBtn.addEventListener('click', function() {
      this.classList.add('scale-95');
      setTimeout(() => {
        this.classList.remove('scale-95');
      }, 150);
    });
  }
