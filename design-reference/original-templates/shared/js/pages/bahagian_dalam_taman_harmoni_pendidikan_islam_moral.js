// Simple kid-delight interactive choice selector
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-amalkan-adab');
    if (btn) {
      btn.addEventListener('click', () => {
        btn.classList.add('scale-95');
        setTimeout(() => {
          btn.classList.remove('scale-95');
          const originalContent = btn.innerHTML;
          btn.innerHTML = `<span class="material-symbols-outlined text-xl">favorite</span><span>Alhamdulillah! Adab Diamalkan! (+50 XP)</span>`;
          setTimeout(() => {
            btn.innerHTML = originalContent;
          }, 2400);
        }, 150);
      });
    }
  });
