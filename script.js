gsap.registerPlugin(ScrollTrigger);

const getElement = (selector) => document.querySelector(selector);

const container = getElement(".container");
const content = getElement(".content");
const yesBtn = getElement("#yesBtn");
const noBtn = getElement("#noBtn");
const result = getElement("#result");
const emojiBackground = getElement("#emojiBackground");

let gameState = {
    noButtonAttempts: 0,
    isNoButtonMoving: false,
    gameCompleted: false,
    animationsEnabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

function animateElement(element, props, onComplete = null) {
    return gsap.to(element, { ...props, onComplete: onComplete });
}

function createFloatingEmojis() {
    const randEmojis = ['🔥', '🗣️', '🩵', '😈', '👅', '😎'];
    const emojiCount = window.innerWidth < 768 ? 10 : 15;
    emojiBackground.innerHTML = '';

    for (let i = 0; i < emojiCount; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji'; 
        emoji.textContent = randEmojis[Math.floor(Math.random() * randEmojis.length)];
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.top = Math.random() * 100 + '%';
        emoji.style.animationDelay = Math.random() * 6 + 's';
        emoji.style.animationDuration = (4 + Math.random() * 4) + 's';
        emojiBackground.appendChild(emoji);
    }
}

const handle3DTilt = (e) => {
    if (!container || !content || window.innerWidth < 768 || !gameState.animationsEnabled) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = Math.max(-15, Math.min(15, (y - centerY) / 15));
    const rotateY = Math.max(-15, Math.min(15, (centerX - x) / 15));
    animateElement(content, { rotationX: rotateX, rotationY: rotateY, transformPerspective: 1000, duration: 0.3, ease: "power2.out" });
};

function reset3DTilt() {
    if (!content) return;
    animateElement(content, { rotationX: 0, rotationY: 0, transformPerspective: 1000, duration: 0.3, ease: "power2.out" });
}

function createCelebration() {
    const celebrationElements = [];
    // confetti
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.top = "-50px";
        confetti.style.backgroundColor = `hsl(${300 + Math.random() * 60}, 80%, ${60 + Math.random() * 20}%)`;
        document.body.appendChild(confetti);
        celebrationElements.push(confetti);
        gsap.to(confetti, { y: "110vh", x: (Math.random() - 0.5) * 400, rotation: Math.random() * 720, duration: 2 + Math.random() * 3, ease: "power1.out", onComplete: () => confetti.remove() });
    }
    setTimeout(() => { celebrationElements.forEach(el => { if (el.parentNode) el.remove(); }); }, 6000);
}

function handleNoButtonInteraction() {
    if (gameState.isNoButtonMoving || gameState.gameCompleted) return;
    gameState.noButtonAttempts++;
    gameState.isNoButtonMoving = true;

    const messages = [
        "Oh, playing hard to get?", "Come on, it will be fun", "Is that your final answer?",
        "Don't make me ask again!", "You're making this harder! ", "I believe we can go gang.",
        "You know you want to...", "I'm not giving up!", "The yes button is getting lonely!"
    ];
    result.textContent = messages[Math.min(gameState.noButtonAttempts - 1, messages.length - 1)];

    const containerRect = container.getBoundingClientRect();
    const buttonRect = noBtn.getBoundingClientRect();
    const padding = 10;

    const currentAbsoluteX = buttonRect.left - containerRect.left;
    const currentAbsoluteY = buttonRect.top - containerRect.top;
    
    const targetAbsoluteX = padding + Math.random() * (containerRect.width - buttonRect.width - padding * 2);
    const targetAbsoluteY = padding + Math.random() * (containerRect.height - buttonRect.height - padding * 2);

    const deltaX = targetAbsoluteX - currentAbsoluteX;
    const deltaY = targetAbsoluteY - currentAbsoluteY;

    gsap.to(noBtn, { 
        x: `+=${deltaX}`, 
        y: `+=${deltaY}`, 
        duration: 0.4, 
        ease: "power2.out", 
        onComplete: () => { gameState.isNoButtonMoving = false; }
    });

    gsap.to(noBtn, { scale: Math.max(0.6, 1 - gameState.noButtonAttempts * 0.08), duration: 0.3, ease: "back.out(1.7)" });
    gsap.to(yesBtn, { scale: Math.min(1.4, 1 + gameState.noButtonAttempts * 0.1), duration: 0.3, ease: "back.out(1.7)" });

    if (gameState.noButtonAttempts >= 8) {
        gsap.to(noBtn, { opacity: 0, scale: 0.3, duration: 0.5, ease: "power2.out", onComplete: () => {
            noBtn.style.display = "none";
            result.innerHTML = `<div class="cute-message">You have no choice but YES! 🔥<br><small>I'll be waiting... 😎</small></div>`;
        }});
    }
}

function handleYesButton() {
    if (gameState.gameCompleted) return;
    gameState.gameCompleted = true;
    
    gsap.to(yesBtn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.inOut" });

    setTimeout(() => {
        result.innerHTML = `<div class="cute-message">Good choice! 🔥<br><small>Let's go! 😎</small></div>`;
        createCelebration();
        gsap.to([noBtn, yesBtn], { scale: 1, x: 0, y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
        noBtn.style.display = "flex";
        setTimeout(() => { gameState.noButtonAttempts = 0; gameState.gameCompleted = false; }, 3000);
    }, 500);
}

function addEventListeners() {
    yesBtn.addEventListener('click', handleYesButton);
    noBtn.addEventListener('mouseover', handleNoButtonInteraction);
    noBtn.addEventListener('click', handleNoButtonInteraction);
    if (window.innerWidth >= 768) {
        container.addEventListener('mousemove', handle3DTilt);
        container.addEventListener('mouseleave', reset3DTilt);
    }
    window.addEventListener('resize', createFloatingEmojis);
}

function init() {
    createFloatingEmojis();
    initializeAnimations();
    addEventListeners();
}

function initializeAnimations() {
    if (!gameState.animationsEnabled) {
        container.style.opacity = '1';
        return;
    }
    gsap.fromTo(container, { opacity: 0, y: 50, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" });
    gsap.fromTo(".title, .question, .btn", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, stagger: 0.2, ease: "back.out(1.7)" });
}

init();
