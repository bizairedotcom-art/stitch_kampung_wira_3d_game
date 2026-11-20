// Simple responsive toyetic interactions
  const ambienceBtn = document.getElementById('ambienceBtn');
  let isPlayingAmbience = false;
  if (ambienceBtn) {
    ambienceBtn.addEventListener('click', () => {
      isPlayingAmbience = !isPlayingAmbience;
      ambienceBtn.classList.toggle('bg-primary-container', isPlayingAmbience);
      ambienceBtn.classList.toggle('text-on-primary-container', isPlayingAmbience);
      ambienceBtn.querySelector('span:last-child').textContent = isPlayingAmbience ? 'Bunyi Mengalir 💧' : 'Kocakan Air 🔊';
    });
  }

  const primaryBtn = document.getElementById('primaryActionBtn');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', () => {
      primaryBtn.classList.add('scale-95');
      setTimeout(() => {
        primaryBtn.classList.remove('scale-95');
        alert('✨ Tahniah Wira Cilik! Anda mengamalkan adab ihsan dan memelihara kolam teratai dengan cemerlang. +50 XP!');
      }, 150);
    });
  }

  const feedBtn = document.getElementById('feedFishPondBtn');
  if (feedBtn) {
    feedBtn.addEventListener('click', () => {
      feedBtn.textContent = 'Ikan Kenyang! 💖';
      feedBtn.classList.remove('bg-secondary-container');
      feedBtn.classList.add('bg-primary-container', 'text-on-primary-container');
      setTimeout(() => {
        feedBtn.innerHTML = '<span>Beri Makan Ikan</span> <span>🪱</span>';
        feedBtn.classList.add('bg-secondary-container');
        feedBtn.classList.remove('bg-primary-container', 'text-on-primary-container');
      }, 2500);
    });
  }

  const speakPromptBtn = document.getElementById('speakPromptBtn');
  if (speakPromptBtn) {
    speakPromptBtn.addEventListener('click', () => {
      speakPromptBtn.classList.add('bg-primary', 'text-on-primary');
      setTimeout(() => {
        speakPromptBtn.classList.remove('bg-primary', 'text-on-primary');
      }, 1800);
    });
  }
