import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

// Initial State Setup
function init() {
  const ingredients = document.querySelectorAll('.ingredient');
  const heroDish = document.querySelector('#hero-dish');
  const introText = document.querySelector('#intro-text');
  const finalText = document.querySelector('#final-text');
  const particlesContainer = document.querySelector('#particles');

  // --- Particle System ---
  const particleCount = 40;
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    // Random initial position (center-ish)
    const startX = (Math.random() - 0.5) * 20;
    const startY = (Math.random() - 0.5) * 20;

    // Style directly for simplicity
    p.style.cssText = `
      position: absolute;
      width: ${Math.random() * 6 + 2}px;
      height: ${Math.random() * 6 + 2}px;
      background: radial-gradient(circle, #ffd700, transparent);
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
      pointer-events: none;
    `;
    particlesContainer.appendChild(p);
  }
  const particles = document.querySelectorAll('.particle');


  // Create Main Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1, // Smooth scrubbing
      pin: false, // We pin via fixed position CSS, but could pin here.
      // Since .stage is fixed, we just scrub the timeline based on body scroll
    }
  });

  // --- Phase 1: Explosion (0% - 30% of scroll) ---
  // Animate ingredients OUTWARDS from center
  // We'll give each ingredient a specific "destination" based on its random-ish position



  // Fade out intro text quickly
  tl.to(introText, {
    opacity: 0,
    scale: 0.8,
    duration: 1
  }, 0);

  // --- Phase 2: Hero Reveal (20% - 60%) ---
  // Overlapping with explosion slightly

  // --- Phase 1: The Setup (Dish Visible) ---
  // Ensure Dish is fully visible at start (initially set by CSS, but good to enforce)
  gsap.set(heroDish, { scale: 1, opacity: 1, rotation: 0 });

  // Ingredients start "inside" the dish (center, scale 0, opacity 0 or 1 behind dish)
  gsap.set(ingredients, { scale: 0, opacity: 0, x: 0, y: 0 });

  // --- Phase 2: The Explosion (0% - 40% scroll) ---
  // Dish shakes/scales slightly to anticipate
  tl.to(heroDish, {
    scale: 0.9,
    rotation: -5,
    duration: 1,
    ease: 'power1.in'
  }, 0);

  // EXPLOSION! Ingredients fly out
  const explosionDestinations = [
    { x: -50, y: -40, rotate: -45 },
    { x: 50, y: -45, rotate: 45 },
    { x: -55, y: 20, rotate: -90 },
    { x: 60, y: 25, rotate: 90 },
    { x: -30, y: 55, rotate: -135 },
    { x: 45, y: 50, rotate: 135 }
  ];

  ingredients.forEach((ing, index) => {
    const dest = explosionDestinations[index] || { x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 80, rotate: Math.random() * 360 };

    tl.to(ing, {
      xPercent: dest.x * 3, // Further distance
      yPercent: dest.y * 3,
      scale: 1.5,
      rotation: dest.rotate + 360, // Spin while exploding
      opacity: 1,
      duration: 3,
      ease: 'power3.out' // Fast start, slow end (explosive)
    }, 1); // Start after anticipate
  });

  // Particles explode concurrently
  particles.forEach((p, i) => {
    // ... same particle logic kept mostly ...
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 150 + 50; // Increased velocity
    const endX = Math.cos(angle) * velocity;
    const endY = Math.sin(angle) * velocity;

    tl.to(p, {
      xPercent: endX,
      yPercent: endY,
      opacity: { value: 0, duration: 2.5 },
      startAt: { opacity: 1, xPercent: 0, yPercent: 0, scale: 0.5 }, // Start at center
      scale: 0,
      duration: Math.random() * 2 + 1,
      ease: 'power4.out'
    }, 1); // Sync with ingredients
  });

  // Main Dish interaction during explosion (Maybe it scales UP to fill gap?)
  tl.to(heroDish, {
    scale: 1.1,
    rotation: 0,
    duration: 3,
    ease: 'elastic.out(1, 0.5)'
  }, 1);

  // --- Phase 3 & 4: Settle (40% - 100%) ---
  // Camera zoom in/out or focus change

  // Fade out text early
  tl.to(introText, { opacity: 0, scale: 2, duration: 1 }, 0.5);

  // Final State
  tl.to(finalText, {
    opacity: 1,
    y: 0,
    duration: 2
  }, 5);
}

// Preloader Logic
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    gsap.to(preloader, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => preloader.remove(),
    });
    // Initialize animations after load
    init();
  } else {
    init();
  }
});
