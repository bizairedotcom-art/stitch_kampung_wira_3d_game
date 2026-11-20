(function() {
      // Category Tab Switching
      const tabs = document.querySelectorAll('.category-tab');
      const panels = document.querySelectorAll('.palette-panel');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.getAttribute('data-tab');
          
          tabs.forEach(t => {
            t.classList.remove('bg-primary', 'text-on-primary', 'shadow-[0_3px_0_#002113]');
            t.classList.add('bg-surface-container-high', 'text-on-surface', 'shadow-[0_3px_0_#855300]');
          });

          tab.classList.remove('bg-surface-container-high', 'text-on-surface', 'shadow-[0_3px_0_#855300]');
          tab.classList.add('bg-primary', 'text-on-primary', 'shadow-[0_3px_0_#002113]');

          panels.forEach(p => p.classList.add('hidden'));
          const activePanel = document.getElementById('panel-' + target);
          if (activePanel) activePanel.classList.remove('hidden');
        });
      });

      // Item selection highlights
      document.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('click', function() {
          const parent = this.parentElement;
          parent.querySelectorAll('.item-card').forEach(c => {
            c.classList.remove('shadow-[0_3px_0_#006947]');
            c.classList.add('shadow-[0_3px_0_#855300]');
          });
          this.classList.remove('shadow-[0_3px_0_#855300]');
          this.classList.add('shadow-[0_3px_0_#006947]');
        });
      });

      // 3D Pedestal Interactive Rotations
      const pedestal = document.getElementById('avatar-pedestal');
      let currentDeg = 0;

      document.getElementById('btn-rot-left')?.addEventListener('click', () => {
        currentDeg -= 35;
        pedestal.style.transform = `rotateY(${currentDeg}deg)`;
      });

      document.getElementById('btn-rot-right')?.addEventListener('click', () => {
        currentDeg += 35;
        pedestal.style.transform = `rotateY(${currentDeg}deg)`;
      });

      document.getElementById('btn-rot-360')?.addEventListener('click', () => {
        currentDeg += 360;
        pedestal.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        pedestal.style.transform = `rotateY(${currentDeg}deg)`;
        setTimeout(() => {
          pedestal.style.transition = 'transform 0.3s ease';
        }, 800);
      });

      // Randomize Button Juice
      document.getElementById('btn-randomize')?.addEventListener('click', function() {
        this.classList.add('scale-95');
        currentDeg += 180;
        pedestal.style.transform = `rotateY(${currentDeg}deg) scale(1.05)`;
        setTimeout(() => {
          pedestal.style.transform = `rotateY(${currentDeg}deg) scale(1)`;
          this.classList.remove('scale-95');
        }, 300);
      });

      // Cheer Sound Feedback
      document.getElementById('btn-cheer')?.addEventListener('click', function() {
        this.classList.add('scale-105');
        setTimeout(() => this.classList.remove('scale-105'), 200);
      });

      // Confirmation button squish
      document.getElementById('btn-confirm')?.addEventListener('click', function() {
        this.classList.add('scale-95');
        setTimeout(() => this.classList.remove('scale-95'), 150);
      });
    })();
