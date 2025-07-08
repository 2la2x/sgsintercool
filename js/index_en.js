  document.getElementById('langSelect').addEventListener('change', function() {
    const selectedLang = this.value;
    const baseUrl = this.getAttribute('data-base-url').replace('_LANG_', selectedLang);
    window.location.href = baseUrl;
  });
  // Scroll effect for header
  window.addEventListener('scroll', () => {
    const header = document.getElementById('mainHeader');
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }
  });

  // Animation for elements
  const animateElements = document.querySelectorAll('.feature-card, .service-card, .stat-card, .contact-card');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target); // Stop observing after animation
        }
      });
    },
    { threshold: 0.1 }
  );

  animateElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
