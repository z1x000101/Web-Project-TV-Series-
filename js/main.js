// Main Action JavaScript for Iron Fist Website
document.addEventListener('DOMContentLoaded', () => {
    // 0. Hamburger Menu Toggle
    setupHamburger();

    // 1. Live Interactive Canvas Chi Floating Energy
    createLiveParticles();

    // 2. Intersection Observer for scroll animations
    setupScrollAnimations();

    // 3. Smooth Chi Pulses replacing rigid horror glitches
    setupChiPulses();
});

function setupHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    // Close drawer when any link is tapped
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        }
    });
}

function createLiveParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.3;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * -0.8 - 0.2; // Upward chi drift

            // 60% Gold Chi, 40% Dragon Green Chi
            this.isGold = Math.random() > 0.4;
            this.alpha = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction: Chi traces / aligns slightly with the mouse rather than hard repelling
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                // Gentle swirl effect instead of harsh horror push
                const force = (150 - distance) / 150;
                this.x -= (dy / distance) * force * 1.5; // Perpendicular swirl
                this.y += (dx / distance) * force * 1.5;
            }

            // Loop back around the screen (soft respawns)
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
        }
        draw() {
            ctx.beginPath();
            if (this.isGold) {
                ctx.fillStyle = `rgba(255, 204, 0, ${this.alpha})`;
                ctx.shadowBlur = 6;
                ctx.shadowColor = 'rgba(255, 204, 0, 0.4)';
            } else {
                ctx.fillStyle = `rgba(0, 255, 102, ${this.alpha})`;
                ctx.shadowBlur = 6;
                ctx.shadowColor = 'rgba(0, 255, 102, 0.3)';
            }
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create 35 particles for a subtle chi atmosphere
    for (let i = 0; i < 35; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}

function setupScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        el.classList.remove('visible');
        observer.observe(el);
    });
}

function setupChiPulses() {
    const headings = document.querySelectorAll('h1:not(.hero-text-logo), h2');
    setInterval(() => {
        if (headings.length > 0) {
            const randomHeading = headings[Math.floor(Math.random() * headings.length)];
            randomHeading.classList.add('chi-active');

            setTimeout(() => {
                randomHeading.classList.remove('chi-active');
            }, 1500); // Smooth long pulse
        }
    }, 4000); // Pulse gently and periodically
}

const video = document.getElementById("intro-video");
const loader = document.getElementById("intro-loader");

video.onended = () => {
    loader.classList.add("fade-out");

    setTimeout(() => {
        loader.style.display = "none";
    }, 600);
};

localStorage.setItem("introPlayed", "true");
