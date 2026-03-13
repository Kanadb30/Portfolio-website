// ========== CUSTOM CURSOR ==========
const cursor = document.querySelector('.cursor');
const links = document.querySelectorAll('a, button, .hover-target');

if (window.innerWidth > 768 && cursor) {
  // Move cursor
  window.addEventListener('mousemove', (e) => {
    // Small delay for smooth physics via CSS translation
    cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
  });

  // Hover states
  links.forEach(link => {
    link.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    link.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });
}

// ========== SMOOTH SCROLL (LENIS) ==========
// Lenis is imported via CDN in index.html
if (typeof Lenis !== 'undefined') {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Handle anchor links with Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target);
      }
    });
  });
}

// ========== GSAP-STYLE REVEAL ANIMATIONS ==========
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal-text, .fade-up');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add minimal delay staggering if they are sibling tags
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  /* Add staggered delays to children if they share a container (like marquee or list) */
  const containers = document.querySelectorAll('.stagger-container');
  containers.forEach(container => {
    const children = container.querySelectorAll('.reveal-text, .fade-up');
    children.forEach((child, index) => {
      child.style.transitionDelay = `${index * 0.1}s`;
    });
  });

  revealElements.forEach(el => observer.observe(el));
});
