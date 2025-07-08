document.getElementById('langSelect').addEventListener('change', function() {
  const selectedLang = this.value;
  const baseUrl = this.getAttribute('data-base-url').replace('_LANG_', selectedLang);
  window.location.href = baseUrl;

  window.addEventListener('scroll', function() {
    const header = document.getElementById('mainHeader');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  const animatedElements = document.querySelectorAll('.about-text, .info-box, .download-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, 
  
  { threshold: 0.1 });


  
  animatedElements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  const languageToggle = document.getElementById('languageToggle');
  if (languageToggle) {
    languageToggle.addEventListener('click', function() {
      const elementsToTranslate = document.querySelectorAll('[data-en], [data-ar]');
      
      elementsToTranslate.forEach(element => {
        if (element.getAttribute('data-current') === 'en') {
          element.textContent = element.getAttribute('data-ar');
          element.setAttribute('data-current', 'ar');
        } else {
          element.textContent = element.getAttribute('data-en');
          element.setAttribute('data-current', 'en');
        }
      });
    });
  }
});