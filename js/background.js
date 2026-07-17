/**
 * Neural Network Particle Background (Refactored)
 * A calm, minimal, and cinematic particle system.
 * Optimized for performance and elegance.
 */

export function setupNeuralBackground() {
    // Configuration - Calm & Minimal
    const config = {
        particleCount: window.innerWidth < 768 ? 30 : 60, // Significantly reduced count
        connectionDistance: 140,
        mouseDistance: 150,
        baseSpeed: 0.15, // Very slow movement
        maxSpeed: 0.4,
        friction: 0.99, // Velocity damping
        baseColor: 'rgba(56, 189, 248, ', // Light blue
        lineColor: 'rgba(56, 189, 248, '
    };

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'neural-bg';
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '-1',
        pointerEvents: 'none',
        background: 'transparent'
    });

    // Remove existing if present (cleanup)
    const existingCanvas = document.getElementById('neural-bg');
    if (existingCanvas) existingCanvas.remove();

    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    // Mouse state
    const mouse = {
        x: null,
        y: null,
        radius: config.mouseDistance
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    document.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            // Initial random low velocity
            this.vx = (Math.random() - 0.5) * config.baseSpeed;
            this.vy = (Math.random() - 0.5) * config.baseSpeed;
            this.size = Math.random() * 1.5 + 0.5; // Smaller particles
        }

        update() {
            // Apply friction/damping to naturalize movement
            if (Math.abs(this.vx) > config.baseSpeed) {
                this.vx *= config.friction;
            }
            if (Math.abs(this.vy) > config.baseSpeed) {
                this.vy *= config.friction;
            }

            // Move
            this.x += this.vx;
            this.y += this.vy;

            // Bounce with energy loss (damping)
            if (this.x < 0) {
                this.x = 0;
                this.vx *= -0.8;
            } else if (this.x > canvas.width) {
                this.x = canvas.width;
                this.vx *= -0.8;
            }

            if (this.y < 0) {
                this.y = 0;
                this.vy *= -0.8;
            } else if (this.y > canvas.height) {
                this.y = canvas.height;
                this.vy *= -0.8;
            }

            // Mouse interaction (Subtle repulsion)
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;

                    // Very subtle push
                    const directionX = forceDirectionX * force * 0.05;
                    const directionY = forceDirectionY * force * 0.05;

                    this.vx -= directionX;
                    this.vy -= directionY;
                }
            }
        }

        draw() {
            ctx.fillStyle = `${config.baseColor}0.4)`; // Lower opacity
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    // Initialize
    function init() {
        particles = [];
        resizeCanvas();
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        config.particleCount = window.innerWidth < 768 ? 30 : 60;
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect particles (optimized check)
            for (let j = i + 1; j < particles.length; j++) { // j = i + 1 avoids double check & self check
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                // Quick check before sqrt
                if (Math.abs(dx) > config.connectionDistance || Math.abs(dy) > config.connectionDistance) continue;

                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance) {
                    ctx.beginPath();
                    let opacity = 1 - (distance / config.connectionDistance);
                    // Very faint lines
                    ctx.strokeStyle = `${config.lineColor}${opacity * 0.15})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        init();
    });

    init();
    animate();
}
