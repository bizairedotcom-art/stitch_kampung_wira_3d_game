// Simple kinetic feedback for 7-year-olds
  const submitBtn = document.getElementById('btn-submit-answer');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      submitBtn.classList.add('scale-95');
      setTimeout(() => {
        submitBtn.classList.remove('scale-95');
        alert('🎉 Tahniah Wira Adam! Jawapan RAM-BU-TAN betul! +15 Bintang Ilmu!');
      }, 120);
    });
  }

  const audioBtn = document.getElementById('btn-audio-kancil');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      audioBtn.classList.add('bg-secondary-fixed');
      setTimeout(() => {
        audioBtn.classList.remove('bg-secondary-fixed');
      }, 400);
    });
  }
