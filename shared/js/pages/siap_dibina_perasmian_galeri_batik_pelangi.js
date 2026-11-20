(function() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const colors = ['#fea619', '#006947', '#4cd7f6', '#ffddb8', '#ba1a1a', '#acedff'];
    const confettiCount = 50;
    const confetti = [];

    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        x: Math.random() * width,
        y: Math.random() * -height,
        r: Math.random() * 6 + 4,
        d: Math.random() * confettiCount,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleInc: (Math.random() * 0.07) + 0.05,
        tiltAngle: 0
      });
    }

    let animationFrame;
    function draw() {
      ctx.clearRect(0, 0, width, height);
      let remaining = false;

      for (let i = 0; i < confetti.length; i++) {
        const p = confetti[i];
        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) * 0.75;
        p.tilt = Math.sin(p.tiltAngle - (i / 3)) * 12;

        if (p.y < height) {
          remaining = true;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + (p.r / 4), p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + (p.r / 4));
        ctx.stroke();
      }

      if (remaining) {
        animationFrame = requestAnimationFrame(draw);
      }
    }

    draw();

    // Sound feedback simulation & additional burst on CTA click
    const ctaBtn = document.getElementById('btn-primary-action');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => {
        for (let i = 0; i < confetti.length; i++) {
          confetti[i].y = Math.random() * -100;
          confetti[i].x = Math.random() * width;
        }
        cancelAnimationFrame(animationFrame);
        draw();
      });
    }
  })();
