// Dynamic tactile sound effect & visual tap burst feedback for 7-year-old interaction delight
  const scoopTrigger = document.getElementById('scoop-action-trigger');
  const mainScoopBtn = document.getElementById('main-scoop-btn');

  function handleScoopClick(e) {
    // Generate playful kinetic ripple
    const btn = e.currentTarget;
    btn.style.transform = 'scale(0.96)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 120);
  }

  if (scoopTrigger) {
    scoopTrigger.addEventListener('click', handleScoopClick);
  }
  if (mainScoopBtn) {
    mainScoopBtn.addEventListener('click', handleScoopClick);
  }
