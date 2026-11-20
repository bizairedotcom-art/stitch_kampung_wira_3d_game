// Playful confetti/stamp interaction on action button
  const rotateBtn = document.getElementById('btn-rotate-gear');
  if (rotateBtn) {
    rotateBtn.addEventListener('click', () => {
      rotateBtn.classList.add('scale-95');
      setTimeout(() => {
        rotateBtn.classList.remove('scale-95');
        alert('🎉 Tahniah Wira Adam! Gear nombor 8 berputar sempurna! Pintu Menara Langit kini semakin dekat! (+50 Bintang)');
      }, 150);
    });
  }
