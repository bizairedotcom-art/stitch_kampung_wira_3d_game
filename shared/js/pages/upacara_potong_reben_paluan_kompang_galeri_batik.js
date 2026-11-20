let ceremonyCut = false;
  let rhythmScore = 0;

  const ribbonLeft = document.getElementById('ribbon-left');
  const ribbonRight = document.getElementById('ribbon-right');
  const ribbonKnot = document.getElementById('ribbon-knot');
  const scissorsBtn = document.getElementById('scissors-btn');
  const cutSuccessBadge = document.getElementById('cut-success-badge');
  const cutHint = document.getElementById('cut-hint');
  const scoreCounter = document.getElementById('score-counter');
  const rhythmFeedback = document.getElementById('rhythm-feedback');

  function triggerRibbonCut() {
    if (ceremonyCut) return;
    ceremonyCut = true;

    // 3D Split Animation for Left and Right Ribbon
    ribbonLeft.style.transform = "translateX(-80px) rotate(-25deg) scale(0.85)";
    ribbonLeft.style.opacity = "0.2";
    ribbonRight.style.transform = "translateX(80px) rotate(25deg) scale(0.85)";
    ribbonRight.style.opacity = "0.2";
    
    // Knot blast effect
    ribbonKnot.style.transform = "scale(1.8) rotate(360deg)";
    ribbonKnot.style.opacity = "0";

    // Show celebration banner
    setTimeout(() => {
      cutSuccessBadge.classList.remove('hidden');
      cutSuccessBadge.classList.add('flex');
      cutHint.innerHTML = '<span class="text-secondary font-bold">✨ Tahniah! Galeri Batik Rasmi Dibuka!</span>';
    }, 300);

    // Audio or feedback stimulation
    rhythmFeedback.innerText = "Reben dipotong! Teruskan paluan kompang!";
  }

  scissorsBtn?.addEventListener('click', triggerRibbonCut);
  ribbonKnot?.addEventListener('click', triggerRibbonCut);

  function playKompang(soundName, description) {
    rhythmScore += 1;
    scoreCounter.innerText = rhythmScore;
    
    // Change feedback text dynamically
    const praise = ["Hebat & Segak!", "Padu Iramanya!", "Merdu Sungguh!", "Cekap Kanak-Kanak Wira!"];
    const randomPraise = praise[Math.floor(Math.random() * praise.length)];
    rhythmFeedback.innerText = `${soundName} - ${randomPraise}`;

    // Pop animation on score
    scoreCounter.classList.add('scale-125');
    setTimeout(() => scoreCounter.classList.remove('scale-125'), 150);
  }

  function playAudioAnnouncement() {
    const originalText = rhythmFeedback.innerText;
    rhythmFeedback.innerText = "🔊 'Bismillah! Takbir berkumandang, kompang bergema!'";
    setTimeout(() => {
      rhythmFeedback.innerText = originalText;
    }, 3500);
  }

  function resetCeremony() {
    ceremonyCut = false;
    ribbonLeft.style.transform = "none";
    ribbonLeft.style.opacity = "1";
    ribbonRight.style.transform = "none";
    ribbonRight.style.opacity = "1";
    ribbonKnot.style.transform = "none";
    ribbonKnot.style.opacity = "1";
    cutSuccessBadge.classList.add('hidden');
    cutSuccessBadge.classList.remove('flex');
    cutHint.innerHTML = '<span class="material-symbols-outlined text-[16px] text-primary">touch_app</span> Sentuh gunting atau simpul reben emas di atas!';
    rhythmScore = 0;
    scoreCounter.innerText = "0";
    rhythmFeedback.innerText = "Sedia memalu bersama!";
  }
