document.getElementById('langSelect').addEventListener('change', function() {
  const selectedLang = this.value;
  const baseUrl = this.getAttribute('data-base-url').replace('_LANG_', selectedLang);
  window.location.href = baseUrl;
});

// Header scroll effect
window.addEventListener('scroll', function() {
  const header = document.getElementById('mainHeader');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Add animation to elements on scroll
document.addEventListener('DOMContentLoaded', function() {
  const animatedElements = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
});
