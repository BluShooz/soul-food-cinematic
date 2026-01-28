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

  // Random configurations for explosion
  // x/y are percentage of viewport width/height relative to center
  const explosionDestinations = [
    { x: -30, y: -20, rotate: -45 },  // Top Left
    { x: 30, y: -25, rotate: 45 },    // Top Right
    { x: -35, y: 10, rotate: -90 },   // Mid Left
    { x: 40, y: 15, rotate: 90 },     // Mid Right
    { x: -20, y: 35, rotate: -135 },  // Bot Left
    { x: 25, y: 30, rotate: 135 }     // Bot Right
  ];

  // Staggered particle explosion
  particles.forEach((p, i) => {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 80 + 20; // Distance
    const endX = Math.cos(angle) * velocity;
    const endY = Math.sin(angle) * velocity;

    tl.to(p, {
      xPercent: endX,
      yPercent: endY,
      opacity: { value: 0, duration: 2 }, // Fade out eventually
      startAt: { opacity: 1, xPercent: 0, yPercent: 0 },
      scale: 0,
      duration: Math.random() * 2 + 1,
      ease: 'power4.out'
    }, 0);
  });

  ingredients.forEach((ing, index) => {
    // Get destination or default if we have more ingredients than configs
    const dest = explosionDestinations[index] || { x: (Math.random() - 0.5) * 60, y: (Math.random() - 0.5) * 60, rotate: Math.random() * 360 };

    tl.to(ing, {
      xPercent: dest.x * 2, // Multiply for distance
      yPercent: dest.y * 2,
      scale: 1.2, // Grow slightly
      rotation: dest.rotate,
      opacity: 1,
      duration: 3, // Relative duration in timeline
      ease: 'power2.out'
    }, 0); // Start at time 0
  });

  // Fade out intro text quickly
  tl.to(introText, {
    opacity: 0,
    scale: 0.8,
    duration: 1
  }, 0);

  // --- Phase 2: Hero Reveal (20% - 60%) ---
  // Overlapping with explosion slightly

  tl.fromTo(heroDish,
    { scale: 0.5, opacity: 0, rotation: -10 },
    { scale: 1, opacity: 1, rotation: 0, duration: 4, ease: 'power2.out' },
    1 // Start a bit after explosion starts
  );

  // --- Phase 3: Ingredients Fade & Blur (50% - 80%) ---
  tl.to(ingredients, {
    opacity: 0,
    scale: 1.5, // Continue growing as they fade
    filter: 'blur(10px)',
    duration: 3
  }, 5); // Start after hero is mostly visible

  // --- Phase 4: Final Hero Scale & Text (70% - 100%) ---
  tl.to(heroDish, {
    scale: 1.2,
    filter: 'contrast(1.1)',
    duration: 3
  }, 7);

  tl.to(finalText, {
    opacity: 1,
    y: 0,
    duration: 2
  }, 8); // Final text fades in
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
