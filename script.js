// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Get elements
const container = document.querySelector('.container');
const content = document.querySelector('.content');
const yesBtn = document.querySelector('.yes-btn');
const noBtn = document.querySelector('.no-btn');
const result = document.querySelector('.result');
const particlesContainer = document.getElementById('particles');

// No button evasion variables
let noButtonAttempts = 0;
let isNoButtonMoving = false;

// Initial animations
gsap.from('.title', {
  duration: 1,
  y: -50,
  opacity: 0,
  ease: 'power3.out'
});

gsap.from('.question', {
  duration: 1,
  y: 30,
  opacity: 0,
  delay: 0.3,
  ease: 'power3.out'
});

gsap.from('.buttons', {
  duration: 1,
  y: 30,
  opacity: 0,
  delay: 0.6,
  ease: 'power3.out'
});

// 3D tilt effect
container.addEventListener('mousemove', (e) => {
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (y - centerY) / 20;
  const rotateY = (centerX - x) / 20;
  
  content.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

container.addEventListener('mouseleave', () => {
  content.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
});

// Button animations
yesBtn.addEventListener('click', () => {
  gsap.to(yesBtn, {
    scale: 0.95,
    duration: 0.1,
    ease: 'power2.out'
  });
  
  setTimeout(() => {
    gsap.to(yesBtn, {
      scale: 1,
      duration: 0.2,
      ease: 'power2.out'
    });
  }, 100);
  
  result.textContent = 'Great choice! 🎉';
  createConfetti();
  
  // Reset no button attempts when yes is clicked
  noButtonAttempts = 0;
  noBtn.style.display = 'block';
  noBtn.style.opacity = '1';
  noBtn.style.transform = 'none';
});

// No button evasion behavior
noBtn.addEventListener('mouseover', () => {
  if (isNoButtonMoving) return;
  
  noButtonAttempts++;
  isNoButtonMoving = true;
  
  // Get button position and container bounds
  const buttonRect = noBtn.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  
  // Calculate new position
  let newX = Math.random() * (containerRect.width - buttonRect.width);
  let newY = Math.random() * (containerRect.height - buttonRect.height);
  
  // Ensure button stays within container bounds
  newX = Math.max(0, Math.min(newX, containerRect.width - buttonRect.width));
  newY = Math.max(0, Math.min(newY, containerRect.height - buttonRect.height));
  
  // Add some fun messages based on attempts
  const messages = [
    "Nice try! 😜",
    "Too slow! 🏃‍♂️",
    "Almost got me! 🎯",
    "You're persistent! 💪",
    "Why not try Yes? 🤔",
    "Yes is the way! ✨",
    "Give up yet? 😏",
    "Yes is waiting! 🎉"
  ];
  
  result.textContent = messages[Math.min(noButtonAttempts - 1, messages.length - 1)];
  
  // Animate button movement
  gsap.to(noBtn, {
    x: newX,
    y: newY,
    duration: 0.3,
    ease: 'power2.out',
    onComplete: () => {
      isNoButtonMoving = false;
    }
  });
  
  // Make button smaller with each attempt
  const scale = Math.max(0.5, 1 - (noButtonAttempts * 0.1));
  gsap.to(noBtn, {
    scale: scale,
    duration: 0.3,
    ease: 'power2.out'
  });
  
  // After 5 attempts, make the button very small and semi-transparent
  if (noButtonAttempts >= 5) {
    gsap.to(noBtn, {
      scale: 0.3,
      opacity: 0.5,
      duration: 0.3,
      ease: 'power2.out'
    });
  }
  
  // After 8 attempts, make the button disappear
  if (noButtonAttempts >= 8) {
    gsap.to(noBtn, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        noBtn.style.display = 'none';
        result.textContent = "You have no choice but to click Yes! 😄";
      }
    });
  }
});

// Confetti effect
function createConfetti() {
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    document.body.appendChild(confetti);
    
    gsap.to(confetti, {
      y: '100vh',
      rotation: Math.random() * 360,
      duration: 2 + Math.random() * 2,
      ease: 'power2.out',
      onComplete: () => confetti.remove()
    });
  }
}

// Particle effect
function createParticle() {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  const size = Math.random() * 3 + 1;
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';
  
  particle.style.left = Math.random() * 100 + 'vw';
  particle.style.top = '100vh';
  particle.style.opacity = Math.random() * 0.5 + 0.2;
  
  particlesContainer.appendChild(particle);
  
  gsap.to(particle, {
    y: '-100vh',
    x: (Math.random() - 0.5) * 200,
    opacity: 0,
    duration: 5 + Math.random() * 5,
    ease: 'none',
    onComplete: () => particle.remove()
  });
}

// Create particles periodically
setInterval(createParticle, 300);

// Background gradient animation
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX / window.innerWidth;
  mouseY = e.clientY / window.innerHeight;
  
  const gradient = `linear-gradient(135deg, 
    ${lerpColor('#6366f1', '#a855f7', mouseX)}, 
    ${lerpColor('#a855f7', '#ec4899', mouseY)}
  )`;
  
  document.body.style.background = gradient;
});

// Color interpolation helper
function lerpColor(color1, color2, factor) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  
  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);
  
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
