function playKoiAudio(btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined text-secondary animate-spin">graphic_eq</span><span>Memainkan: "Glup glup... Ikan bernafas guna insang!"</span>';
    setTimeout(() => {
      btn.innerHTML = originalText;
    }, 3000);
  }

  function playTerataiAudio(btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined text-primary animate-spin">graphic_eq</span><span>Memainkan: "Bunga teratai mekar pagi dan terapung indah!"</span>';
    setTimeout(() => {
      btn.innerHTML = originalText;
    }, 3000);
  }

  function selectAnswer(el, isCorrect) {
    const container = document.getElementById('quizContainer');
    const options = container.querySelectorAll('.quiz-option');
    options.forEach(opt => {
      opt.className = 'quiz-option cursor-pointer flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition-all';
      const icon = opt.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.innerText = 'radio_button_unchecked';
        icon.className = 'material-symbols-outlined text-outline-variant';
      }
    });

    if (isCorrect) {
      el.className = 'quiz-option cursor-pointer flex items-center justify-between p-3 rounded-xl bg-primary-fixed-dim/30 shadow-sm text-on-surface transition-all';
      const icon = el.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.innerText = 'check_circle';
        icon.className = 'material-symbols-outlined text-primary';
      }
    } else {
      el.className = 'quiz-option cursor-pointer flex items-center justify-between p-3 rounded-xl bg-error-container text-on-error-container transition-all';
      const icon = el.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.innerText = 'cancel';
        icon.className = 'material-symbols-outlined text-error';
      }
    }
  }

  function saveToJournal(btn) {
    btn.innerHTML = '<span class="material-symbols-outlined text-2xl animate-bounce">verified</span><span>BERJAYA DISIMPAN! BINTANG BERTAMBAH ⭐</span>';
    btn.classList.remove('bg-primary');
    btn.classList.add('bg-primary-container');
    setTimeout(() => {
      btn.innerHTML = '<span class="material-symbols-outlined text-2xl" style="font-variation-settings: \'FILL\' 1;">bookmark_added</span><span>KAD TELAH BERADA DALAM JURNAL</span>';
    }, 2000);
  }
