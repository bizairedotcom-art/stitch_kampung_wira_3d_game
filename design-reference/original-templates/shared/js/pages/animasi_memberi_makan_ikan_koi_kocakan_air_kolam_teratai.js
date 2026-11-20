(function() {
    const rippleSurface = document.getElementById('rippleSurface');
    const toast = document.getElementById('toastFeedback');
    const toastMsg = document.getElementById('toastMsg');
    const koiStatusText = document.getElementById('koiStatusText');

    let pelletsCount = 5;

    function showToast(msg) {
      if (!toast) return;
      toastMsg.textContent = msg;
      toast.classList.remove('opacity-0');
      toast.classList.add('opacity-100');
      setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
      }, 2200);
    }

    function createRipple(x, y) {
      if (!rippleSurface) return;
      const ripple = document.createElement('div');
      ripple.className = 'absolute rounded-full pointer-events-none border border-tertiary-fixed';
      ripple.style.width = '24px';
      ripple.style.height = '24px';
      ripple.style.left = (x - 12) + 'px';
      ripple.style.top = (y - 12) + 'px';
      ripple.style.backgroundColor = 'rgba(172, 237, 255, 0.4)';
      ripple.style.transition = 'transform 0.75s ease-out, opacity 0.75s ease-out';
      ripple.style.transform = 'scale(0.5)';
      ripple.style.opacity = '1';

      rippleSurface.appendChild(ripple);

      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(4.5)';
        ripple.style.opacity = '0';
      });

      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 800);
    }

    if (rippleSurface) {
      rippleSurface.addEventListener('click', function(e) {
        const rect = rippleSurface.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        createRipple(x, y);
      });
    }

    const quickFeedBtn = document.getElementById('quickFeedBtn');
    if (quickFeedBtn) {
      quickFeedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        pelletsCount++;
        koiStatusText.textContent = `${Math.min(pelletsCount, 10)}/5 🍱`;
        showToast('✨ Palet keemasan bertabur! Ikan Koi melompat riang!');
        if (rippleSurface) {
          const rect = rippleSurface.getBoundingClientRect();
          createRipple(rect.width / 2, rect.height / 2);
          setTimeout(() => createRipple(rect.width * 0.45, rect.height * 0.55), 150);
        }
      });
    }

    const actionFeed = document.getElementById('actionFeed');
    if (actionFeed) {
      actionFeed.addEventListener('click', () => {
        pelletsCount++;
        koiStatusText.textContent = `${Math.min(pelletsCount, 10)}/5 🍱`;
        showToast('🌾 Palet harum disebarkan dengan kasih sayang!');
      });
    }

    const actionSplash = document.getElementById('actionSplash');
    if (actionSplash) {
      actionSplash.addEventListener('click', () => {
        showToast('🌊 Kocakan air jernih menghasilkan gelombang riang!');
      });
    }

    const actionLotus = document.getElementById('actionLotus');
    if (actionLotus) {
      actionLotus.addEventListener('click', () => {
        showToast('🪷 Kelopak teratai berayun lembut ditiup angin sepoi-sepoi!');
      });
    }

    const voiceBtn = document.getElementById('voiceAdviceBtn');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        showToast('🔊 Memainkan audio pesanan berhemah Ustazah Melur...');
      });
    }

    const claimReward = document.getElementById('claimRewardBtn');
    if (claimReward) {
      claimReward.addEventListener('click', () => {
        showToast('🌟 Tahniah Wira Adam! +100 XP & Pahala Ihsan dikumpulkan!');
      });
    }
  })();
