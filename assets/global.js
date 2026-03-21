/* ============================================================
   HOLY MOLY - Global JavaScript
   Navigation, mobile menu, smooth scroll, cart badge sync
   ============================================================ */

// ===== NAVBAR SCROLL EFFECT =====
(function() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  var menu = document.getElementById('mobileMenu');
  var hamburger = document.getElementById('hamburger');
  if (menu) menu.classList.toggle('active');
  if (hamburger) hamburger.classList.toggle('active');
}

// Close mobile menu when clicking a link
document.addEventListener('click', function(e) {
  var link = e.target.closest('.mobile-menu .navbar-link');
  if (link) {
    var menu = document.getElementById('mobileMenu');
    var hamburger = document.getElementById('hamburger');
    if (menu) menu.classList.remove('active');
    if (hamburger) hamburger.classList.remove('active');
  }
});

// ===== SMOOTH SCROLL =====
document.addEventListener('click', function(e) {
  var anchor = e.target.closest('a[href^="#"]');
  if (anchor) {
    e.preventDefault();
    var target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// ===== SCROLL TO TOP =====
function scrollToTop(e) {
  if (e) e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function smoothScroll(e, id) {
  e.preventDefault();
  var el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function scrollToSection(id) {
  var el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ===== CART BADGE SYNC =====
function openCart() {
  if (typeof window.openCartDrawer === 'function') {
    window.openCartDrawer();
  } else {
    window.location.href = '/cart';
  }
}

// ===== CART ICON ANIMATION =====
function animateCartIcon() {
  var icons = document.querySelectorAll('.navbar-cart');
  icons.forEach(function(icon) {
    icon.style.animation = 'none';
    icon.offsetHeight;
    icon.style.animation = 'cartShake 0.5s ease';
  });
}

// ===== NAV ACTIVE SECTION TRACKING =====
(function() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  
  var sections = ['products', 'features', 'custom', 'contact'];
  var navLinks = document.querySelectorAll('.navbar-menu .navbar-link');
  
  window.addEventListener('scroll', function() {
    var current = '';
    var navbarHeight = navbar ? navbar.offsetHeight : 0;
    
    sections.forEach(function(sectionId) {
      var section = document.getElementById(sectionId);
      if (section) {
        var sectionTop = section.offsetTop - navbarHeight - 100;
        if (window.scrollY >= sectionTop) current = sectionId;
      }
    });
    
    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
})();

// ===== SCROLL REVEAL =====
(function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  document.querySelectorAll('[data-reveal]').forEach(function(el) {
    observer.observe(el);
  });
})();
