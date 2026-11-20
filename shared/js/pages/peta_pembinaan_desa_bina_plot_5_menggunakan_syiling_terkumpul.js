// Quick celebratory feedback micro-interaction for child builders
  document.getElementById('btn-build-plot5')?.addEventListener('click', function() {
    this.innerText = '✨ SEDANG MEMBINA... TAHNIAH WIRA! 🪵🏡';
    this.classList.remove('bg-primary');
    this.classList.add('bg-secondary-container', 'text-on-secondary');
    setTimeout(() => {
      alert('Tahniah Wira Adam! Wakaf Teduhan & Kolam Santuari berjaya dinaikkan di Plot 5!');
      this.innerHTML = '<span class="material-symbols-outlined text-[24px]">done_all</span> TELAH BERJAYA DIBINA! ✨';
    }, 700);
  });
