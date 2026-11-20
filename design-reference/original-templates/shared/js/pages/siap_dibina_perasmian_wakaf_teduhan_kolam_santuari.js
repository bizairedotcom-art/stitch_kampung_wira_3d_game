(function() {
    const kompangBtn = document.getElementById('kompang-btn');
    const enterBtn = document.getElementById('enter-wakaf-btn');
    const ttsBtn = document.getElementById('tts-btn');
    const particleBox = document.getElementById('particle-canvas');

    function spawnBurst(emoji) {
      if (!particleBox) return;
      for (let i = 0; i < 6; i++) {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.className = 'absolute text-xl pointer-events-none transition-all duration-700 ease-out';
        span.style.left = (Math.random() * 80 + 10) + '%';
        span.style.top = (Math.random() * 40 + 20) + '%';
        span.style.transform = 'translateY(0) scale(0.6)';
        span.style.opacity = '1';
        particleBox.appendChild(span);

        setTimeout(() => {
          span.style.transform = `translateY(-${Math.random() * 60 + 40}px) scale(1.4) rotate(${Math.random() * 90 - 45}deg)`;
          span.style.opacity = '0';
        }, 50);

        setTimeout(() => {
          span.remove();
        }, 800);
      }
    }

    if (kompangBtn) {
      kompangBtn.addEventListener('click', () => {
        spawnBurst('🥁');
        spawnBurst('🎶');
      });
    }

    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        spawnBurst('🌸');
        spawnBurst('⭐');
      });
    }

    if (ttsBtn) {
      ttsBtn.addEventListener('click', () => {
        ttsBtn.classList.add('scale-110');
        setTimeout(() => ttsBtn.classList.remove('scale-110'), 300);
        spawnBurst('🔊');
      });
    }
  })();
