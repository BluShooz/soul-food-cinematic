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
  const particleCount = 100; // Increased for "Cocoa Dust" density
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    // Style directly: smaller, golden, subtle
    p.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 1}px;
      height: ${Math.random() * 4 + 1}px;
      background: radial-gradient(circle, #ffd700, transparent);
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
      pointer-events: none;
      filter: blur(1px); /* Softness */
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


  // Fade out intro text quickly
  tl.to(introText, {
    opacity: 0,
    scale: 0.8,
    duration: 1
  }, 0);


  // --- Phase 1: The Setup (Dish Visible) ---
  gsap.set(heroDish, { scale: 1, opacity: 1, rotation: 0, zIndex: 100 });
  // Ingredients start "inside" or slightly behind the dish
  gsap.set(ingredients, { scale: 0, opacity: 0, x: 0, y: 0, zIndex: 90 });

  // --- Animation Sequence ---

  // 1. Anticipation (0% - 5%) - Subtle contraction
  tl.to(heroDish, {
    scale: 0.95,
    duration: 0.5,
    ease: 'power1.in'
  }, 0);

  // 2. The Explosion (5% - 35%) - Fast burst outwards
  const explosionDestinations = [
    { x: -60, y: -40, rotate: -60, scale: 1.2 }, // Top Left
    { x: 60, y: -50, rotate: 60, scale: 0.8 },   // Top Right
    { x: -70, y: 10, rotate: -120, scale: 1.1 }, // Mid Left
    { x: 75, y: 20, rotate: 90, scale: 0.9 },    // Mid Right
    { x: -40, y: 60, rotate: -160, scale: 1.3 }, // Bot Left
    { x: 50, y: 55, rotate: 140, scale: 1.0 }    // Bot Right
  ];

  ingredients.forEach((ing, index) => {
    const dest = explosionDestinations[index] || { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100, rotate: Math.random() * 360, scale: 1 };

    // Initial burst (fast)
    tl.to(ing, {
      xPercent: dest.x * 2.5,
      yPercent: dest.y * 2.5,
      rotation: dest.rotate + 180,
      scale: dest.scale,
      opacity: 1,
      duration: 3, // Fast duration relative to scroll
      ease: 'power3.out'
    }, 0.5);

    // Depth of field blur based on "depth" (scale)
    const blurAmount = Math.abs(1 - dest.scale) * 10;
    if (blurAmount > 2) {
      tl.to(ing, { filter: `blur(${blurAmount}px)`, duration: 3 }, 0.5);
    }
  });

  // Particle Burst (Concurrent with explosion)
  particles.forEach((p, i) => {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 200 + 50;
    const endX = Math.cos(angle) * velocity;
    const endY = Math.sin(angle) * velocity;

    tl.to(p, {
      xPercent: endX,
      yPercent: endY,
      opacity: { value: 0, duration: 2 },
      startAt: { opacity: 0.8, xPercent: 0, yPercent: 0, scale: Math.random() * 0.5 },
      scale: 0,
      duration: Math.random() * 2 + 1,
      ease: 'expo.out'
    }, 0.5);
  });

  // 3. Suspension (35% - 60%) - The "Hang Time"
  // Ingredients continue to drift slowly (linear or soft ease) to simulate weightlessness
  ingredients.forEach((ing, index) => {
    const dest = explosionDestinations[index] || { x: 0, y: 0, rotate: 0 };
    tl.to(ing, {
      xPercent: `+=${dest.x * 0.2}`, // Drift slightly further
      yPercent: `+=${dest.y * 0.2}`,
      rotation: `+=${dest.rotate * 0.1}`,
      duration: 3,
      ease: 'none' // Linear drift
    }, 3.5);
  });

  // 4. Fade & Focus Shift (60% - 80%)
  tl.to(ingredients, {
    opacity: 0,
    filter: 'blur(20px)',
    scale: '+=0.2',
    duration: 2
  }, 6.5);

  // 5. Hero Cinematic Push-in (40% - 100%)
  // Starts overlapping with suspension, fully takes over
  tl.to(heroDish, {
    scale: 1.8, // Dramatic zoom
    yPercent: 10, // Move slightly down to center the best part? or keep centered.
    rotation: 5, // Subtle tilt
    duration: 6,
    filter: 'contrast(1.2) saturate(1.1)', // Enhance visual appeal
    ease: 'power2.inOut'
  }, 3);

  // Text Reveal
  tl.to(introText, { opacity: 0, scale: 1.5, filter: 'blur(10px)', duration: 1 }, 0.5);

  tl.to(finalText, {
    opacity: 1,
    y: 0,
    duration: 2,
    ease: 'power2.out'
  }, 8);
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
