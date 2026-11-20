(function() {
    const companions = {
      rimau: {
        name: 'RIMAU',
        species: 'Anak Harimau Malaya',
        desc: 'Pemberani & Tangkas! Gemar membimbing cabaran Matematik.',
        speech: '“Rawr! Saya sedia bantu wira kumpul 100 bintang ilmu!”',
        idle: 'Rimau melompat riang & mengibas ekor!',
        btn: 'JOM MENGEMBARA BERSAMA RIMAU!',
        img: '../shared/images/remote-646325e079ef8c04.jpg',
        intel: 4.5,
        courage: 5,
        cheer: 5
      },
      kancil: {
        name: 'KANCIL',
        species: 'Pelanduk Cerdik',
        desc: 'Pintar & Berakal! Pakar teka-teki Bahasa Melayu & pepatah.',
        speech: '“Akal yang bijak menewaskan gergasi! Mari berpantun!”',
        idle: 'Kancil mengetuk kuku & tersenyum nakal!',
        btn: 'JOM MENGEMBARA BERSAMA KANCIL!',
        img: null,
        intel: 5,
        courage: 3.5,
        cheer: 4.5
      },
      enggang: {
        name: 'ENGGANG',
        species: 'Anak Burung Kenyalang',
        desc: 'Ceria & Suka Menyanyi! Membantu pengembaraan Muzik & Seni.',
        speech: '“Kipaskan sayapmu! Mari bernyanyi lagu irama rimba!”',
        idle: 'Enggang mengepakkan sayap ceria!',
        btn: 'JOM MENGEMBARA BERSAMA ENGGANG!',
        img: null,
        intel: 4,
        courage: 4,
        cheer: 5
      },
      utan: {
        name: 'UTAN',
        species: 'Anak Orangutan Borneo',
        desc: 'Penuh Rasa Ingin Tahu! Menemani eksperimen Sains di Makmal.',
        speech: '“Wah, lihat daun ini! Kenapa ia berwarna hijau ya?”',
        idle: 'Utan berayun manja di dahan kayu!',
        btn: 'JOM MENGEMBARA BERSAMA UTAN!',
        img: null,
        intel: 5,
        courage: 4,
        cheer: 4.5
      },
      badak: {
        name: 'BADAK',
        species: 'Anak Badak Jawa / Sumatera',
        desc: 'Kuat & Berdisiplin! Juara Arena Pendidikan Jasmani (PJPK).',
        speech: '“Badan sihat, otak cergas! Satu, dua, lari laju-laju!”',
        idle: 'Badak bersedia dengan gaya juara gagah!',
        btn: 'JOM MENGEMBARA BERSAMA BADAK!',
        img: null,
        intel: 3.5,
        courage: 5,
        cheer: 4.5
      }
    };

    const cards = document.querySelectorAll('.companion-card');
    const heroImg = document.getElementById('companion-main-img');
    const heroVisual = document.getElementById('hero-companion-visual');
    const nameEl = document.getElementById('companion-name');
    const speciesEl = document.getElementById('companion-species');
    const descEl = document.getElementById('companion-desc');
    const speechEl = document.getElementById('speech-text');
    const idleEl = document.getElementById('idle-status');
    const btnLabel = document.getElementById('btn-label-text');
    const voiceBtn = document.getElementById('voice-btn');

    cards.forEach(card => {
      card.addEventListener('click', function() {
        const key = this.getAttribute('data-companion');
        const data = companions[key];
        if (!data) return;

        // Reset cards style
        cards.forEach(c => {
          c.classList.remove('bg-primary-container', 'text-on-primary-container', 'shadow-[0_4px_0_#005236]');
          c.classList.add('bg-surface-container', 'text-on-surface', 'shadow-[0_4px_0_#ffe2d6]');
          const badge = c.querySelector('.material-symbols-outlined.text-\\[12px\\]');
          if (badge && badge.parentElement) {
            badge.parentElement.remove();
          }
        });

        // Set active card style
        this.classList.remove('bg-surface-container', 'text-on-surface', 'shadow-[0_4px_0_#ffe2d6]');
        this.classList.add('bg-primary-container', 'text-on-primary-container', 'shadow-[0_4px_0_#005236]');

        // Update mascot data
        nameEl.textContent = data.name;
        speciesEl.textContent = data.species;
        descEl.textContent = data.desc;
        speechEl.textContent = data.speech;
        idleEl.textContent = data.idle;
        btnLabel.textContent = data.btn;

        // If card has img, use it
        const cardImg = this.querySelector('img');
        if (cardImg) {
          heroImg.src = cardImg.src;
          heroImg.alt = data.name;
        }

        // Bouncy character reaction
        heroVisual.classList.add('scale-110');
        setTimeout(() => heroVisual.classList.remove('scale-110'), 250);
      });
    });

    // Voice button microinteraction
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        speechEl.parentElement.parentElement.classList.add('bg-secondary-fixed');
        setTimeout(() => {
          speechEl.parentElement.parentElement.classList.remove('bg-secondary-fixed');
        }, 500);
      });
    }
  })();
