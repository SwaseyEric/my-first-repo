// Portfolio Script
}

function prevSlide() {
  selectedSlide = (selectedSlide - 1 + slides.length) % slides.length;
  renderSlides();
}

// Shuffle the slides array in place and re-render
function shuffleSlides() {
  for (let i = slides.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slides[i], slides[j]] = [slides[j], slides[i]];
  }
  selectedSlide = 0;
  renderSlides();
}

document.addEventListener('DOMContentLoaded', () => {
  renderSlides();
  document.getElementById('nextBtn').addEventListener('click', nextSlide);
  document.getElementById('prevBtn').addEventListener('click', prevSlide);
  const shuffleBtn = document.getElementById('shuffleBtn');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', shuffleSlides);
  }

  // --- Image Upload Logic ---
  const uploadInput = document.getElementById('uploadInput');
  if (uploadInput) {
    uploadInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (evt) {
        // Replace the selected slide with the uploaded image
        slides[selectedSlide] = { type: 'image', src: evt.target.result };
        renderSlides();
      };
      reader.readAsDataURL(file);
    });
  }
});

// To add or edit slides, simply modify the 'slides' array above.
// You can use { type: 'image', src: 'your-image-url' } or { type: 'text', text: 'your text' }
