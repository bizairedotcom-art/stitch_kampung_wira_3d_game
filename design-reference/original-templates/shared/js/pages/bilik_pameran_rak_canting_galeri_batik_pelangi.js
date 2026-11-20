(function() {
    const feedbackBox = document.getElementById('hotspot-feedback');
    const feedbackText = document.getElementById('feedback-text');

    function showHotspotInfo(message) {
      if (!feedbackBox || !feedbackText) return;
      feedbackText.textContent = message;
      feedbackBox.classList.remove('hidden');
      feedbackBox.classList.add('animate-bounce');
      setTimeout(() => {
        feedbackBox.classList.remove('animate-bounce');
      }, 500);
    }

    const btnCanting = document.getElementById('hotspot-canting');
    if (btnCanting) {
      btnCanting.addEventListener('click', () => {
        showHotspotInfo('✨ Canting Tembaga: Pegang seperti pensel warna untuk melakar garis lilin licin!');
      });
    }

    const btnLilin = document.getElementById('hotspot-lilin');
    if (btnLilin) {
      btnLilin.addEventListener('click', () => {
        showHotspotInfo('🔥 Kuali Lilin: Suhu suam dan selamat. Lilin lebah wangi sedia dicekup!');
      });
    }

    const btnKain = document.getElementById('hotspot-kain');
    if (btnKain) {
      btnKain.addEventListener('click', () => {
        showHotspotInfo('🌸 Kain Bunga Raya: Corak kebangsaan Malaysia sedia untuk diwarnakan!');
      });
    }

    const btnAudio = document.getElementById('audio-cikgu');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        showHotspotInfo('📢 Cikgu Merbok: "Hebat Wira Adam! Mari kita pilih canting di rak!"');
      });
    }

    const btnCollect = document.getElementById('btn-collect-coins');
    if (btnCollect) {
      btnCollect.addEventListener('click', () => {
        showHotspotInfo('🪙 Tahniah! 15 Syiling Emas daripada pelawat telah berjaya dikumpulkan!');
      });
    }

    const btnStart = document.getElementById('btn-start-canting');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        showHotspotInfo('🎨 Membuka Kanvas Melukis Batik Pelangi... Sedia beraksi!');
      });
    }
  })();
