document.addEventListener('DOMContentLoaded', () => {
  // Tema değiştirme işlevi
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';

  if (currentTheme === 'dark') {
    document.body.classList.add('dark');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });

  // Hamburger menu toggle functionality
  const navLinks = document.querySelector('.nav-links');
  window.toggleNav = function() {
    navLinks.classList.toggle('active');
  }

  // Projelerle ilgili işlemler
  const projectContainer = document.getElementById('project-details');
  if (projectContainer) {
    document.querySelectorAll('.project-btn').forEach(button => {
      button.addEventListener('click', () => {
        const projectName = button.dataset.project;
        let pdfFile = '';

        // PDF dosyasını seçiyoruz
        if (projectName === 'haberlesme') {
          pdfFile = 'assets/pdf/haberlesme.pdf';
        } else if (projectName === 'telemetrium') {
          pdfFile = 'assets/pdf/telemetrium.pdf';
        }

        // PDF dosyasını iframe ile gösterme
        projectContainer.innerHTML = `
          <iframe src="${pdfFile}" width="100%" height="600px" frameborder="0"></iframe>
        `;
      });
    });
  }
});
