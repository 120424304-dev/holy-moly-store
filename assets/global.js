// Global JavaScript for Holy Moly Theme

// Mobile menu toggle
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
}

// Close menu when clicking on links
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navMenu = document.getElementById('navLinks');
      if (navMenu) {
        navMenu.classList.remove('active');
      }
    });
  });
});