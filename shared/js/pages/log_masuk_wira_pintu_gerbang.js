// Rimau playful bounce micro-interaction
  function triggerRimauRoar() {
    const avatar = document.getElementById('rimauAvatar');
    if (avatar) {
      avatar.classList.add('rotate-12', 'scale-125');
      setTimeout(() => {
        avatar.classList.remove('rotate-12', 'scale-125');
      }, 400);
    }
  }

  // Toggle Parent Form Drawer
  let drawerOpen = true;
  function toggleParentDrawer() {
    const container = document.getElementById('parentFormContainer');
    const arrow = document.getElementById('drawerArrow');
    if (!container || !arrow) return;

    drawerOpen = !drawerOpen;
    if (drawerOpen) {
      container.classList.remove('hidden');
      arrow.classList.remove('-rotate-90');
    } else {
      container.classList.add('hidden');
      arrow.classList.add('-rotate-90');
    }
  }

  // Visual Enter Village Button Feedback
  function playEntranceAnimation(btn) {
    btn.classList.add('scale-95');
    setTimeout(() => {
      btn.classList.remove('scale-95');
    }, 180);
  }
