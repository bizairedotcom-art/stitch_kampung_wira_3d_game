// Interactive Option Toggle for 7-year old math learners
  document.querySelectorAll('#pola-options-group button').forEach(button => {
    button.addEventListener('click', function() {
      // Toggle tactile squash sensation
      this.classList.add('scale-95');
      setTimeout(() => this.classList.remove('scale-95'), 180);
    });
  });
