document.getElementById('langSelect').addEventListener('change', function() {
  const selectedLang = this.value;
  const baseUrl = this.getAttribute('data-base-url').replace('_LANG_', selectedLang);
  window.location.href = baseUrl;
});

function updateFileName(input) {
  const fileName = input.files[0]?.name;
  const fileDisplay = document.getElementById('selected-file');
  
  if (fileName) {
    fileDisplay.textContent = `Selected file: ${fileName}`;
    fileDisplay.style.color = '#4fc3f7';
  } else {
    fileDisplay.textContent = 'No file selected';
    fileDisplay.style.color = '#f44336';
  }
}

document.getElementById('careerForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  
  const form = event.target; 
  const formData = new FormData(form);
  
  try {
    Swal.fire({
      title: 'Submitting Application',
      html: 'Please wait while we process your application...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const response = await fetch(form.action, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.text();
    
    if (!response.ok) {
      throw new Error(result || 'Failed to submit application');
    }
    
    Swal.fire({
      icon: 'success',
      title: 'Application Submitted!',
      text: result || 'Thank you for your application. We will contact you soon.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#4fc3f7'
    });
    
    form.reset();
    document.getElementById('selected-file').textContent = '';
    
  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
      text: error.message || 'There was an error submitting your application. Please try again.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#f44336'
    });
  }
});

window.addEventListener('scroll', function() {
  const header = document.getElementById('mainHeader');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

const formElements = document.querySelectorAll('.form-group, .submit-btn');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

formElements.forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
