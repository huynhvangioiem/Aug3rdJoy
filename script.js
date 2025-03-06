// Initialize messages array
let messages = [];
let currentMessageTimeout;

// Load messages from messages.json
fetch('messages.json')
    .then(response => response.json())
    .then(data => {
        messages = data.messages;
        console.log('Messages loaded successfully:', messages.length, 'messages');
    })
    .catch(error => {
        console.error('Error loading messages:', error);
        // Fallback message in case JSON fails to load
        messages = [
            "Happy Women's Day, [Name]! You are amazing! 💖",
            "Celebrating you, [Name]! Happy International Women's Day! ✨"
        ];
    });

function createFirework() {
    // Reduce particle count on mobile
    const isMobile = window.innerWidth <= 480;
    confetti({
        particleCount: isMobile ? 50 : 100,
        spread: isMobile ? 50 : 70,
        origin: { y: 0.6 },
        colors: ['#FF69B4', '#DA70D6', '#9370DB', '#FF1493', '#9B4F96'],
    });
}

function createSparkles() {
    confetti({
        particleCount: 30,
        spread: 280,
        startVelocity: 15,
        gravity: 0.8,
        scalar: 0.7,
        drift: 0,
        ticks: 150,
        colors: ['#FF69B4', '#DA70D6', '#9370DB', '#FF1493'],
        shapes: ['heart', 'circle'],
        zIndex: 100,
    });
}

function createMagicSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'magic-sparkle';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    document.body.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 1000);
}

function createFloatingElement(type) {
    const elements = {
        flower: ['🌺', '🌸', '🌷', '💮', '🌹', '💐'],
        gift: ['👑', '💝', '💖', '✨', '💫', '💎'],
        emoji: ['✨', '💖', '🌟', '💫', '👑', '💝']
    };

    const emoji = document.createElement('div');
    emoji.className = 'floating-element';
    emoji.textContent = elements[type][Math.floor(Math.random() * elements[type].length)];

    // Adjust positioning for mobile
    const isMobile = window.innerWidth <= 480;
    emoji.style.left = Math.random() * (isMobile ? 90 : 100) + (isMobile ? '5' : '0') + 'vw';
    emoji.style.animationDuration = (Math.random() * 2 + (isMobile ? 2 : 3)) + 's';
    document.body.appendChild(emoji);

    setTimeout(() => {
        document.body.removeChild(emoji);
    }, 4000); // Reduced from 5000ms for better performance
}

function celebrationEffect() {
    // Initial firework
    createFirework();

    // Create floating elements - reduced for mobile
    const isMobile = window.innerWidth <= 480;
    const count = isMobile ? 3 : 4;

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            createFloatingElement('flower');
            createFloatingElement('gift');
        }, i * (isMobile ? 400 : 300));
    }

    // Add celebration overlay effect
    const overlay = document.querySelector('.celebration-overlay');
    overlay.classList.add('active');
    setTimeout(() => overlay.classList.remove('active'), 2000);
}

function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    const colors = ['#FF69B4', '#DA70D6', '#9370DB', '#FF1493'];
    let colorIndex = 0;
    const isMobile = window.innerWidth <= 480;

    function type() {
        if (i < text.length) {
            const span = document.createElement('span');
            span.textContent = text.charAt(i);
            span.style.color = colors[colorIndex];
            span.style.opacity = '0';
            span.style.transform = 'translateY(10px)';
            element.appendChild(span);

            requestAnimationFrame(() => {
                span.style.transition = 'all 0.3s ease';
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            });

            if (i % (isMobile ? 4 : 3) === 0) {
                colorIndex = (colorIndex + 1) % colors.length;
            }
            i++;
            currentMessageTimeout = setTimeout(type, isMobile ? speed * 1.2 : speed);
        } else {
            celebrationEffect();
        }
    }

    type();
}

function showMessage() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();

    if (name === '') {
        nameInput.classList.add('shake');
        setTimeout(() => nameInput.classList.remove('shake'), 500);
        return;
    }

    // Clear any existing timeout
    if (currentMessageTimeout) {
        clearTimeout(currentMessageTimeout);
    }

    const messageDisplay = document.getElementById('messageDisplay');
    messageDisplay.classList.remove('show');

    // Initial celebration
    createFirework();
    createSparkles();

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * messages.length);
        const message = messages[randomIndex].replace('[Name]', name);

        messageDisplay.classList.add('show');
        typeWriter(messageDisplay, message);

        // Create more celebration effects
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                if (i % 2 === 0) createFirework();
                createFloatingElement(i % 3 === 0 ? 'emoji' : i % 3 === 1 ? 'flower' : 'gift');
            }, i * 300);
        }
    }, 300);
}

// Add input animations
const nameInput = document.getElementById('nameInput');
nameInput.addEventListener('focus', () => {
    createFloatingElement('flower');
});

// Add keypress support
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        showMessage();
    }
});

// Add CSS animation for shake effect and floating elements
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }

    .shake {
        animation: shake 0.5s ease-in-out;
    }

    .floating-element {
        position: fixed;
        font-size: 2em;
        pointer-events: none;
        animation: floatUp 5s ease-in infinite;
        z-index: 1000;
        filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));
    }

    @keyframes floatUp {
        0% {
            transform: translateY(100vh) scale(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
            transform: translateY(80vh) scale(1) rotate(180deg);
        }
        90% {
            opacity: 1;
            transform: translateY(20vh) scale(1.5) rotate(270deg);
        }
        100% {
            transform: translateY(-20vh) scale(0.5) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Optimize animation frame rate for mobile
let lastTime = 0;
const minFrameTime = 1000 / 30; // Cap at 30fps for mobile

function animateDecorations(currentTime) {
    if (currentTime - lastTime >= minFrameTime) {
        const decorations = document.querySelectorAll('.flower, .gift');
        decorations.forEach(element => {
            const randomX = (Math.random() - 0.5) * 15;
            const randomY = (Math.random() - 0.5) * 15;
            element.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 15 - 7.5}deg)`;
        });
        lastTime = currentTime;
    }
    requestAnimationFrame(animateDecorations);
}

// Add touch event handling
document.addEventListener('touchstart', function (e) {
    if (e.target.classList.contains('clickable')) {
        e.preventDefault();
        e.target.click();
    }
}, { passive: false });

// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', function (e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Start animations
animateDecorations(0);
