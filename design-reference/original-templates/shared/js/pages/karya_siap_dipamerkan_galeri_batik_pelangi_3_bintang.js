// Interaktiviti ringan untuk Butang Pujian Suara Cikgu Merbok
  const btnSuara = document.getElementById('btn-suara-pujian');
  if (btnSuara) {
    btnSuara.addEventListener('click', () => {
      const originalText = btnSuara.innerHTML;
      btnSuara.innerHTML = `
        <span class="material-symbols-outlined text-headline-sm animate-spin">graphic_eq</span>
        <span class="font-label-md text-label-md font-bold">Sedang Memainkan Suara Cikgu...</span>
      `;
      setTimeout(() => {
        btnSuara.innerHTML = originalText;
      }, 3000);
    });
  }
