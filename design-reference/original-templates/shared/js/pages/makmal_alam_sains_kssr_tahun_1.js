// Interactive answer selection feedback for Year 1 pupils
  (function initScienceLabQuiz() {
    const choiceButtons = document.querySelectorAll('section:nth-of-type(3) .space-y-2\\.5 button');
    choiceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        choiceButtons.forEach(b => {
          b.className = 'w-full flex items-center justify-between p-3.5 rounded-xl bg-surface-container text-on-surface shadow-[0_4px_0_#ffdbcc] active:translate-y-1 active:shadow-none transition-all';
          const radioIcon = b.querySelector('.material-symbols-outlined:last-child');
          if (radioIcon) radioIcon.textContent = 'radio_button_unchecked';
        });
        btn.className = 'w-full flex items-center justify-between p-3.5 rounded-xl bg-primary-container text-on-primary-container shadow-[0_5px_0_#005236] relative transition-transform active:translate-y-1 active:shadow-[0_1px_0_#005236] ring-2 ring-primary-fixed';
        const radioIcon = btn.querySelector('.material-symbols-outlined:last-child');
        if (radioIcon) radioIcon.textContent = 'check';
      });
    });
  })();
