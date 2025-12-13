// Wait for DOM
// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {

  // --- 0. Initialize Smooth Scroll (Lenis) & Custom Scrollbar ---
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
  });

  // Inject Scrollbar UI
  const scrollContainer = document.createElement('div');
  scrollContainer.className = 'scroll-progress-container';
  const scrollBar = document.createElement('div');
  scrollBar.className = 'scroll-progress-bar';
  scrollContainer.appendChild(scrollBar);
  document.body.appendChild(scrollContainer);

  // Sync scrollbar with Lenis
  lenis.on('scroll', ({ progress }) => {
    // progress is 0 to 1
    scrollBar.style.height = `${progress * 100}%`;
  });

  // Connect Lenis to requestAnimationFrame
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Handle Anchor Links with Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      lenis.scrollTo(targetId);
    });
  });

  // --- 1. Preloader Animation ---
  const tl = gsap.timeline();

  tl.to('.loading-bar .bar-fill', {
    width: '100%',
    duration: 1.5,
    ease: "power2.inOut"
  })
    .to('.preloader', {
      y: '-100%',
      duration: 1,
      ease: "expo.inOut"
    }, "+=0.2")
    .from('.reveal-text', {
      y: 100,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power3.out"
    }, "-=0.5");

  // --- 2. Custom Cursor Logic ---
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorGlow = document.querySelector('.cursor-glow');

  document.addEventListener('mousemove', (e) => {
    // Immediate dot movement (responsive)
    gsap.to(cursorDot, {
      x: e.clientX - 4, // Center the 8px dot
      y: e.clientY - 4,
      duration: 0.1,
      overwrite: true
    });

    // Delayed glow movement (trail effect)
    gsap.to(cursorGlow, {
      x: e.clientX - 20, // offset half width
      y: e.clientY - 20,
      duration: 0.8, // Increased from 0.3
      ease: "power2.out",
      overwrite: true
    });
  });

  // Magnetic Button Effect
  const magnets = document.querySelectorAll('.magnetic-btn');
  magnets.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3
      });
      gsap.to(cursorGlow, { scale: 1.5 });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.3 });
      gsap.to(cursorGlow, { scale: 1 });
    });
  });

  // --- 3. Scroll Animations (ScrollTrigger) ---
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('[data-scroll]').forEach(element => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
  });

  // --- 4. Particle System (The "Lumina" Effect) ---
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.opacity = Math.random();
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > width) this.x = 0;
      if (this.x < 0) this.x = width;
      if (this.y > height) this.y = 0;
      if (this.y < 0) this.y = height;

      // Pulse effect
      this.opacity += (Math.random() - 0.5) * 0.05;
      if (this.opacity < 0) this.opacity = 0;
      if (this.opacity > 1) this.opacity = 1;
    }
    draw() {
      ctx.fillStyle = `rgba(0, 242, 255, ${this.opacity})`; // Cyan glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  // --- 5. Theme Switcher ---
  const toggleBtn = document.getElementById('theme-toggle');
  const html = document.documentElement;

  toggleBtn.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);

    // Slight rotation animation for button
    gsap.from(toggleBtn, { rotation: 360, duration: 0.5 });
  });
});