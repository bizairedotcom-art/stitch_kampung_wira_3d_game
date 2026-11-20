function tunjukNotifikasi(mesej) {
    const toast = document.getElementById('toast-notif');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;
    toastText.textContent = mesej;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');
    setTimeout(() => {
      toast.classList.remove('opacity-100');
      toast.classList.add('opacity-0', 'pointer-events-none');
    }, 2400);
  }

  function pilihHotspot(nama) {
    tunjukNotifikasi('🔍 Meneliti: ' + nama);
  }

  function pilihNombor(nilai, elemen) {
    const kotak = document.getElementById('kotak-jawapan-aktif');
    if (kotak) kotak.textContent = nilai;

    // Kemaskini gaya butang sentuhan
    document.querySelectorAll('.btn-jawapan').forEach(btn => {
      btn.className = 'btn-jawapan h-16 rounded-2xl bg-surface text-on-surface font-headline-lg-mobile text-headline-lg-mobile flex flex-col items-center justify-center shadow-[0_4px_0_#bccac0] active:translate-y-1 active:shadow-none transition-all';
      btn.innerHTML = btn.textContent.trim().replace(/[^0-9]/g, '');
    });

    elemen.className = 'btn-jawapan h-16 rounded-2xl bg-secondary-container text-on-secondary font-headline-lg-mobile text-headline-lg-mobile flex flex-col items-center justify-center shadow-[0_4px_0_#684000] translate-y-0.5 transition-all';
    elemen.innerHTML = nilai + '<span class="material-symbols-outlined text-[16px] -mt-1">check_circle</span>';

    if (nilai === 12) {
      tunjukNotifikasi('⭐ Tepat sekali! 7 + 5 = 12!');
    } else {
      tunjukNotifikasi('💡 Cuba kira semula: 7 simpan di kepala, sambung 5!');
    }
  }

  function bukaModalAbakus() {
    tunjukNotifikasi('🧮 Abakus Nilam Dibuka: Manik dinaikkan!');
  }

  // Interaksi butang audio dan hantar
  const btnAudio = document.getElementById('btn-ambient-audio');
  if (btnAudio) {
    btnAudio.addEventListener('click', () => {
      tunjukNotifikasi('🔊 Suara detikan gear dimainkan merdu');
    });
  }

  const btnRimau = document.getElementById('btn-suara-rimau');
  if (btnRimau) {
    btnRimau.addEventListener('click', () => {
      tunjukNotifikasi('🐯 Si Rimau: "7 tambah 5 jadi 12 kawan-kawan!"');
    });
  }

  const btnHantar = document.getElementById('btn-putar-hantar');
  if (btnHantar) {
    btnHantar.addEventListener('click', () => {
      tunjukNotifikasi('🎉 Hebat Wira! Gear berputar ke Tingkat 5!');
    });
  }
