// Simple playful micro-interactions for 7-year-old Malaysian students
  let tapScore = 0;
  let remainingSeconds = 15;
  const timerElem = document.getElementById('timer-display');
  const hammerBtn = document.getElementById('hammer-tap-btn');
  const counterBubble = document.getElementById('tap-counter-bubble');
  const progressBar = document.getElementById('dynamic-progress-fill');
  const completeBtn = document.getElementById('complete-now-btn');
  const audioBtn = document.getElementById('audio-quote-btn');
  const feedbackElem = document.getElementById('mini-action-feedback');
  const feedbackText = document.getElementById('feedback-text');

  // Countdown timer simulation
  const countdownInterval = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      timerElem.textContent = '0:' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
    } else {
      timerElem.textContent = 'SIAP!';
      timerElem.className = 'font-headline-sm text-primary font-black animate-bounce';
      clearInterval(countdownInterval);
    }
  }, 1000);

  // Tap hammer button action
  if (hammerBtn) {
    hammerBtn.addEventListener('click', () => {
      tapScore += 10;
      counterBubble.classList.remove('hidden');
      counterBubble.textContent = '+' + tapScore;
      
      // Reduce countdown faster
      if (remainingSeconds > 1) {
        remainingSeconds--;
        timerElem.textContent = '0:' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
      }

      // Visual progress nudge
      let currentWidth = parseInt(progressBar.style.width) || 65;
      if (currentWidth < 95) {
        progressBar.style.width = (currentWidth + 2) + '%';
      }

      // Play soft tactile feedback vibration if supported
      if (navigator.vibrate) navigator.vibrate(40);
    });
  }

  // Mini actions trigger
  window.triggerMiniAction = function(btn, message) {
    feedbackText.textContent = message;
    feedbackElem.classList.remove('opacity-0');
    feedbackElem.classList.add('opacity-100');

    // Visual button bounce
    btn.classList.add('scale-95');
    setTimeout(() => btn.classList.remove('scale-95'), 150);

    // Hide message after short delay
    setTimeout(() => {
      feedbackElem.classList.remove('opacity-100');
      feedbackElem.classList.add('opacity-0');
    }, 2000);

    if (navigator.vibrate) navigator.vibrate(30);
  };

  // Complete instantly button
  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      progressBar.style.width = '100%';
      timerElem.textContent = 'SIAP!';
      remainingSeconds = 0;
      clearInterval(countdownInterval);
      
      feedbackText.textContent = '🎉 Tahniah Wira! Wakaf & Kolam Siap Dibina Sepenuhnya!';
      feedbackElem.classList.remove('opacity-0');
      feedbackElem.classList.add('opacity-100');

      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    });
  }

  // Audio speech narration toggle feedback
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      audioBtn.classList.toggle('ring-4');
      audioBtn.classList.toggle('ring-secondary-fixed');
      feedbackText.textContent = '🔊 Memainkan Suara Nasihat Pak Salleh...';
      feedbackElem.classList.remove('opacity-0');
      feedbackElem.classList.add('opacity-100');

      setTimeout(() => {
        feedbackElem.classList.remove('opacity-100');
        feedbackElem.classList.add('opacity-0');
        audioBtn.classList.remove('ring-4', 'ring-secondary-fixed');
      }, 3000);
    });
  }
