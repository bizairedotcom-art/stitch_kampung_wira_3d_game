(function initAbacus() {
    let state = {
      p5: false,
      p1: 1, // 1 bead active by default (10)
      s5: false,
      s1: 2  // 2 beads active by default (2) -> Total 12
    };

    function updateAbacusUI() {
      const puluhVal = (state.p5 ? 5 : 0) + state.p1;
      const saVal = (state.s5 ? 5 : 0) + state.s1;
      const total = (puluhVal * 10) + saVal;

      // Update counters
      const elPuluh = document.getElementById('display-puluh');
      const elSa = document.getElementById('display-sa');
      const elTotal = document.getElementById('display-total');
      const elFormula = document.getElementById('formula-text');
      const elSubmitBtn = document.getElementById('submit-text-btn');

      if (elPuluh) elPuluh.textContent = puluhVal;
      if (elSa) elSa.textContent = saVal;
      if (elTotal) elTotal.textContent = total;
      if (elFormula) {
        elFormula.textContent = `${puluhVal} Puluh (${puluhVal * 10}) + ${saVal} Sa (${saVal}) = ${total} Kristal Nilam`;
      }
      if (elSubmitBtn) {
        elSubmitBtn.textContent = `✨ HANTAR NILAI ABAKUS (${total})! ✨`;
      }

      // Upper Beads UI (down to center beam when active)
      const beadP5 = document.getElementById('bead-p5');
      if (beadP5) {
        beadP5.style.transform = state.p5 ? 'translateY(36px)' : 'translateY(0px)';
      }

      const beadS5 = document.getElementById('bead-s5');
      if (beadS5) {
        beadS5.style.transform = state.s5 ? 'translateY(36px)' : 'translateY(0px)';
      }

      // Lower Beads Puluh UI (up towards center beam when active)
      for (let i = 1; i <= 4; i++) {
        const bead = document.getElementById(`bead-p1-${i}`);
        if (bead) {
          bead.style.transform = (i <= state.p1) ? 'translateY(-56px)' : 'translateY(0px)';
        }
      }

      // Lower Beads Sa UI
      for (let i = 1; i <= 4; i++) {
        const bead = document.getElementById(`bead-s1-${i}`);
        if (bead) {
          bead.style.transform = (i <= state.s1) ? 'translateY(-56px)' : 'translateY(0px)';
        }
      }
    }

    window.toggleBead = function(id) {
      if (id === 'p5') state.p5 = !state.p5;
      if (id === 's5') state.s5 = !state.s5;
      updateAbacusUI();
    };

    window.toggleLowerBead = function(rod, index) {
      if (rod === 'puluh') {
        state.p1 = (state.p1 === index) ? (index - 1) : index;
      } else if (rod === 'sa') {
        state.s1 = (state.s1 === index) ? (index - 1) : index;
      }
      updateAbacusUI();
    };

    const btnReset = document.getElementById('btn-reset-abacus');
    if (btnReset) {
      btnReset.addEventListener('click', function() {
        state = { p5: false, p1: 0, s5: false, s1: 0 };
        updateAbacusUI();
      });
    }

    const btnSubmit = document.getElementById('btn-submit-abacus');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', function() {
        const currentTotal = ((state.p5 ? 5 : 0) + state.p1) * 10 + ((state.s5 ? 5 : 0) + state.s1);
        if (currentTotal === 14) {
          alert("🎉 TAHNIAH WIRA! Nombor 14 berjaya dibentuk tepat mengikut piawaian KSSR!");
        } else {
          alert(`Nilai abakus sekarang: ${currentTotal}. Cuba bentukkan nombor sasaran misi iaitu 14! (1 Puluh + 4 Sa)`);
        }
      });
    }

    updateAbacusUI();
  })();
