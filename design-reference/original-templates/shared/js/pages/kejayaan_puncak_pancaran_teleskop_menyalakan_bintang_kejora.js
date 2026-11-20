function triggerSparkles() {
    const btn = document.getElementById('btn-inspect-sky');
    if (!btn) return;
    btn.classList.add('scale-110');
    setTimeout(() => btn.classList.remove('scale-110'), 200);

    // Bouncy toast mini
    const toast = document.createElement('div');
    toast.className = 'fixed top-24 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-full font-label-sm shadow-xl z-50 flex items-center gap-2 pointer-events-none transition-opacity duration-300';
    toast.innerHTML = '<span>🌟 Teleskop terkunci pada koordinat Bintang Kejora Desa!</span>';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 2200);
  }

  function playCelebrationAudio() {
    const btnVoice = document.getElementById('btn-voice-praise');
    if (btnVoice) {
      btnVoice.classList.add('bg-secondary-fixed');
      setTimeout(() => btnVoice.classList.remove('bg-secondary-fixed'), 800);
    }
    const toast = document.createElement('div');
    toast.className = 'fixed top-24 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-4 py-2 rounded-full font-label-sm shadow-xl z-50 flex items-center gap-2 pointer-events-none transition-opacity duration-300';
    toast.innerHTML = '<span>🥁 "Dum-tak! Sorakan gembira warga Kampung Wira bergema!"</span>';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  function goToVillageCelebration() {
    const toast = document.createElement('div');
    toast.className = 'fixed top-24 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-5 py-2.5 rounded-full font-headline-sm text-sm shadow-2xl z-50 flex items-center gap-2 pointer-events-none transition-opacity duration-300';
    toast.innerHTML = '<span>🎆 Meluncur ke Padang Kampung Wira! Pesta bermula!</span>';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  function openCertificateModal() {
    const toast = document.createElement('div');
    toast.className = 'fixed top-24 left-1/2 -translate-x-1/2 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full font-label-sm shadow-xl z-50 flex items-center gap-2 pointer-events-none transition-opacity duration-300';
    toast.innerHTML = '<span>📜 Sijil KSSR: "Jaguh Pola Nombor 5-5 Tahun 1" disimpan ke Beg Wira!</span>';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 2400);
  }
