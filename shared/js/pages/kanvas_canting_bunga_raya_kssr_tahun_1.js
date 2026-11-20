(function() {
      let currentColor = '#d61f3d';
      const colorButtons = document.querySelectorAll('.color-bowl');
      const canvasRegions = document.querySelectorAll('.canvas-region');

      colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          colorButtons.forEach(b => {
            b.classList.remove('bg-surface-container-lowest', 'scale-105', 'shadow-[0_4px_0_#ba1a1a]', 'shadow-[0_4px_0_#855300]');
            b.classList.add('bg-surface-container', 'shadow-[0_2px_0_#855300]');
            const check = b.querySelector('.material-symbols-outlined');
            if (check) check.classList.add('opacity-0');
          });

          btn.classList.remove('bg-surface-container', 'shadow-[0_2px_0_#855300]');
          btn.classList.add('bg-surface-container-lowest', 'scale-105', 'shadow-[0_4px_0_#855300]');
          const icon = btn.querySelector('.material-symbols-outlined');
          if (icon) icon.classList.remove('opacity-0');

          currentColor = btn.getAttribute('data-color') || '#d61f3d';
        });
      });

      canvasRegions.forEach(region => {
        region.addEventListener('click', () => {
          region.setAttribute('fill', currentColor);
          region.classList.add('scale-[1.02]');
          setTimeout(() => region.classList.remove('scale-[1.02]'), 150);
        });
      });

      const voiceBtn = document.getElementById('voiceBtn');
      if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
          voiceBtn.classList.add('scale-110');
          setTimeout(() => voiceBtn.classList.remove('scale-110'), 200);
        });
      }

      const cleanBtn = document.getElementById('cleanBtn');
      if (cleanBtn) {
        cleanBtn.addEventListener('click', () => {
          document.getElementById('petal-left-bottom').setAttribute('fill', '#ffffff');
          document.getElementById('petal-right-bottom').setAttribute('fill', '#ffffff');
        });
      }
    })();
