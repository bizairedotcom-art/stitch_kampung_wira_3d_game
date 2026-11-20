// Simple playful micro-interaction handler for Year 1 pupils
  function selectPlot(plotId) {
    const card = document.getElementById('catalog-section');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function openBuildDrawer() {
    const catalog = document.getElementById('catalog-section');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Toggle 3D perspective feedback
  const toggleBtn = document.getElementById('btn-toggle-view');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('bg-primary');
      toggleBtn.classList.toggle('text-on-primary');
    });
  }
