// Playful micro-interaction for palette selection buttons
  const buttons = document.querySelectorAll('#palette-selection-grid button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('bg-surface-container-highest', 'shadow-[0_4px_0_#855300]');
        b.classList.add('bg-surface-container-lowest', 'shadow-[0_4px_0_#ffe2d6]');
        const check = b.querySelector('.material-symbols-outlined');
        if (check && check.innerText === 'check') {
          check.innerText = 'add';
          check.parentElement.classList.remove('bg-primary', 'text-on-primary');
          check.parentElement.classList.add('bg-surface-container', 'text-on-surface-variant');
        }
      });
      btn.classList.remove('bg-surface-container-lowest', 'shadow-[0_4px_0_#ffe2d6]');
      btn.classList.add('bg-surface-container-highest', 'shadow-[0_4px_0_#855300]');
      const activeCheck = btn.querySelector('.material-symbols-outlined');
      if (activeCheck) {
        activeCheck.innerText = 'check';
        activeCheck.parentElement.classList.remove('bg-surface-container', 'text-on-surface-variant');
        activeCheck.parentElement.classList.add('bg-primary', 'text-on-primary');
      }
    });
  });
