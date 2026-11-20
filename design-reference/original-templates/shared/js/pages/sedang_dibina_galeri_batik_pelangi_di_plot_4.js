// Simple interactive micro-interactions for 7-year old learners
  const audioBtn = document.getElementById('btn-audio-merbok');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      audioBtn.classList.add('scale-95');
      const originalText = audioBtn.innerHTML;
      audioBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">graphic_eq</span><span class="font-label-sm text-label-sm">Memainkan suara burung...</span>';
      setTimeout(() => {
        audioBtn.classList.remove('scale-95');
        audioBtn.innerHTML = originalText;
      }, 1800);
    });
  }

  // Mini color mixing quiz logic
  const feedback = document.getElementById('quiz-feedback');
  const optJingga = document.getElementById('color-opt-jingga');
  const optUngu = document.getElementById('color-opt-ungu');

  if (optJingga && feedback) {
    optJingga.addEventListener('click', () => {
      feedback.textContent = 'Tahniah! Merah campur Kuning jadi Jingga! ⭐ +10 XP';
      feedback.className = 'text-center font-label-sm text-label-sm text-primary font-bold';
      optJingga.classList.add('bg-primary', 'text-on-primary');
    });
  }

  if (optUngu && feedback) {
    optUngu.addEventListener('click', () => {
      feedback.textContent = 'Cuba lagi! Ungu ialah Merah campur Biru 🎨';
      feedback.className = 'text-center font-label-sm text-label-sm text-error font-medium';
    });
  }

  // Speedup Button Action
  const speedBtn = document.getElementById('btn-speedup');
  if (speedBtn) {
    speedBtn.addEventListener('click', () => {
      speedBtn.innerHTML = '<span class="material-symbols-outlined text-headline-sm animate-spin">auto_awesome</span><span class="font-label-lg text-label-lg">Membina Galeri Cantik...</span>';
      setTimeout(() => {
        alert('Syabas! Galeri Batik Pelangi telah siap dibina bersama Cikgu Merbok! 🎉');
      }, 600);
    });
  }

  // Loceng Desa notification confirmation
  const notifyBtn = document.getElementById('btn-notify');
  if (notifyBtn) {
    notifyBtn.addEventListener('click', () => {
      notifyBtn.innerHTML = '<span class="material-symbols-outlined text-primary text-headline-sm">check</span><span class="font-label-md text-label-md text-primary">Loceng Desa Ditetapkan!</span>';
    });
  }
