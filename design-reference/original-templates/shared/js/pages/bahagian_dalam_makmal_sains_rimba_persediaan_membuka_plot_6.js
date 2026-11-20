function triggerScan() {
    const popup = document.getElementById('scan-popup');
    if (popup) {
      popup.classList.remove('hidden');
    }
  }

  function speakMentor() {
    const btn = document.getElementById('btn-voice');
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Selamat datang ke Makmal Sains Rimba, Wira Adam! Jom selesaikan cabaran botani untuk membuka plot enam!");
      utterance.lang = 'ms-MY';
      window.speechSynthesis.speak(utterance);
    }
    if (btn) {
      btn.classList.add('scale-95');
      setTimeout(() => btn.classList.remove('scale-95'), 200);
    }
  }

  function handleAnswer(btnElement, isCorrect) {
    const feedback = document.getElementById('quiz-feedback');
    const allButtons = document.querySelectorAll('#quiz-options button');
    
    allButtons.forEach(b => {
      b.classList.remove('bg-primary-fixed', 'text-on-primary-fixed', 'shadow-[0_3px_0_#006947]');
    });

    if (isCorrect) {
      btnElement.classList.add('bg-primary-fixed', 'text-on-primary-fixed', 'shadow-[0_3px_0_#006947]');
      if (feedback) feedback.classList.remove('hidden');
    } else {
      btnElement.classList.add('bg-surface-variant', 'text-error');
      setTimeout(() => {
        btnElement.classList.remove('bg-surface-variant', 'text-error');
      }, 1000);
    }
  }

  function celebrateUnlock() {
    const unlockBtn = document.getElementById('btn-unlock-plot');
    if (unlockBtn) {
      unlockBtn.innerHTML = '<span class="material-symbols-outlined text-[26px]">celebration</span> TAHNIAH! PLOT 6 TELAH DIBUKA! 🎊';
      unlockBtn.classList.remove('bg-primary-container');
      unlockBtn.classList.add('bg-secondary-container', 'shadow-[0_6px_0_#684000]');
    }
  }
