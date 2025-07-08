document.getElementById('langSelect').addEventListener('change', function() {
  const selectedLang = this.value;
  const baseUrl = this.getAttribute('data-base-url').replace('_LANG_', selectedLang);
  window.location.href = baseUrl;
});

window.addEventListener('scroll', function() {
  const header = document.getElementById('mainHeader');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Global object to store all slideshows
const slideshows = {};

function initAllSlideshows() {
  const sliders = ['slider1', 'slider2', 'slider3', 'slider4', 'slider5', 'slider6','slider7'];
  
  sliders.forEach(sliderId => {
    // Only initialize if the slider exists on the page
    if (document.getElementById(sliderId)) {
      slideshows[sliderId] = initSlideshow(sliderId);
    }
  });
}

function initSlideshow(sliderId) {
  const slider = document.getElementById(sliderId);
  const slides = slider.querySelectorAll('.slide');
  const dotsContainerId = sliderId.replace('slider', 'dots');
  const dots = document.querySelectorAll(`#${dotsContainerId} .dot`);
  let currentSlide = 0;
  let intervalId;
  
  // Function to show specific slide
  function showSlide(n) {
    // Hide all slides
    slides.forEach(slide => {
      slide.classList.remove('active', 'prev', 'next');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Calculate slide indexes
    currentSlide = (n + slides.length) % slides.length;
    const prevSlideIndex = (currentSlide - 1 + slides.length) % slides.length;
    const nextSlideIndex = (currentSlide + 1) % slides.length;
    
    // Set classes for slides
    slides[prevSlideIndex].classList.add('prev');
    slides[currentSlide].classList.add('active');
    slides[nextSlideIndex].classList.add('next');
    
    // Set active dot
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
    }
  }
  
  // Navigation functions
  function nextSlide() {
    showSlide(currentSlide + 1);
    resetAutoPlay();
  }
  
  function prevSlide() {
    showSlide(currentSlide - 1);
    resetAutoPlay();
  }
  
  function goToSlide(n) {
    showSlide(n);
    resetAutoPlay();
  }
  
  // Auto-play functions
  function startAutoPlay() {
    stopAutoPlay();
    intervalId = setInterval(nextSlide, 5000);
  }
  
  function stopAutoPlay() {
    clearInterval(intervalId);
  }
  
  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }
  
  // Initialize the slideshow
  showSlide(0);
  startAutoPlay();
  
  // Event listeners for slider controls
  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);
  
  // Return public methods
  return {
    nextSlide,
    prevSlide,
    goToSlide,
    currentSlide: () => currentSlide
  };
}

// Global functions for button clicks
window.nextSlide = function(sliderId) {
  if (slideshows[sliderId]) {
    slideshows[sliderId].nextSlide();
  }
};

window.prevSlide = function(sliderId) {
  if (slideshows[sliderId]) {
    slideshows[sliderId].prevSlide();
  }
};

window.goToSlide = function(sliderId, n) {
  if (slideshows[sliderId]) {
    slideshows[sliderId].goToSlide(n);
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initAllSlideshows();
  
  // Animation for elements when they come into view
  const animatedElements = document.querySelectorAll('.album-slider');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.4 });

  animatedElements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
});