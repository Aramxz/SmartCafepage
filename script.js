// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// 1. Interactive Coffee Background (Canvas)
const canvas = document.getElementById('coffee-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
let mouse = { x: null, y: null };

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class CoffeeBean {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 8 + 4;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
        // Retro blue and beige tones
        const tones = ['#0F2C59', '#1E3A8A', '#2563EB', '#60A5FA', '#d3a971'];
        this.color = tones[Math.floor(Math.random() * tones.length)];
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > height + this.size) {
            this.y = -this.size;
            this.x = Math.random() * width;
        }

        // Interaction with mouse
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                this.x -= dx * 0.02;
                this.y -= dy * 0.02;
            }
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.3; // subtle background
        
        // Draw a simple bean shape (ellipse with a line)
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 1.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(15, 44, 89, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.2, -this.size);
        ctx.quadraticCurveTo(this.size * 0.5, 0, -this.size * 0.2, this.size);
        ctx.stroke();

        ctx.restore();
    }
}

function initParticles() {
    particles = [];
    let numberOfParticles = (width * height) / 15000; // density
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new CoffeeBean());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// 2. Welcome Screen Presentation
const welcomeTl = gsap.timeline();

welcomeTl.to(".welcome-text", {
    opacity: 1,
    y: 0,
    scale: 1.1,
    duration: 1.2,
    ease: "back.out(1.7)"
})
.to(".welcome-sub", {
    opacity: 1,
    y: -10,
    duration: 1,
    ease: "power3.out"
}, "-=0.6")
.to(".welcome-screen", {
    yPercent: -100,
    duration: 1.2,
    ease: "power4.inOut",
    delay: 1.5
})
.set(".welcome-screen", { display: "none" })
.to(".main-content", {
    opacity: 1,
    duration: 0.1
}, "-=1.2");

// 3. Custom Text Splitter for Hero Title Animation (By Character)
const title = document.querySelector('#interactive-title');
if(title) {
    const text = title.innerText;
    title.innerHTML = '';
    
    text.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.className = 'char';
        if(char === ' ') {
            charSpan.innerHTML = '&nbsp;';
        } else {
            charSpan.innerText = char;
        }
        title.appendChild(charSpan);
    });

    // Animate characters bouncing in
    welcomeTl.to(".char", {
        y: 0,
        opacity: 1,
        rotation: () => Math.random() * 20 - 10,
        duration: 0.8,
        stagger: 0.05,
        ease: "back.out(2)"
    }, "-=0.6")
    .to(".char", { // Straighten them out
        rotation: 0,
        duration: 0.5,
        ease: "power2.out"
    }, "-=0.2")
    .from(".hero-subtitle", {
        opacity: 0,
        x: -40,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.6")
    .from(".hero-buttons", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "back.out(1.5)"
    }, "-=0.6")
    .from(".hero-coffee-cup", {
        opacity: 0,
        x: 100,
        scale: 0.8,
        rotation: 20,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)"
    }, "-=1")
    .from(".navbar", {
        opacity: 0,
        y: -30,
        duration: 1,
        ease: "power2.out"
    }, "-=1.2");

    // Add Interactive Physics to Letters
    const chars = document.querySelectorAll('.char');
    chars.forEach(char => {
        if(char.innerText.trim() !== '') {
            char.addEventListener('mouseenter', () => {
                gsap.to(char, {
                    y: -30,
                    color: 'var(--accent)',
                    scale: 1.3,
                    rotation: Math.random() * 40 - 20,
                    textShadow: '8px 8px 0px rgba(15, 44, 89, 0.5)',
                    duration: 0.3,
                    ease: "power2.out",
                    zIndex: 10
                });
            });
            char.addEventListener('mouseleave', () => {
                gsap.to(char, {
                    y: 0,
                    color: 'var(--primary)',
                    scale: 1,
                    rotation: 0,
                    textShadow: '4px 4px 0px rgba(15, 44, 89, 0.8)',
                    duration: 0.8,
                    ease: "elastic.out(1, 0.3)",
                    zIndex: 1
                });
            });
        }
    });
}

// 4. Video Facade Click Handler
const videoFacade = document.getElementById('video-facade');
if(videoFacade) {
    videoFacade.addEventListener('click', () => {
        const wrapper = document.getElementById('video-container');
        wrapper.innerHTML = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/VVL455VUBfs?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="border-radius: 8px;"></iframe>';
    });
}

// 5. Scroll Animations with GSAP

// Video Section Parallax & Reveal
gsap.from(".video-wrapper", {
    scrollTrigger: {
        trigger: ".video-section",
        start: "top 80%",
    },
    y: 100,
    rotationX: 15,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out",
    transformPerspective: 1000
});

// Title animations on scroll
gsap.utils.toArray('.retro-title-sm').forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: "top 85%"
        },
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.5)"
    });
});

// Timeline Items Staggering with dramatic retro drop
gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 85%"
        },
        x: -80,
        y: 40,
        opacity: 0,
        rotation: -5,
        duration: 1.2,
        ease: "back.out(1.2)"
    });
});

// 6. Minimal NFC Animation looping in step 3
const nfcTl = gsap.timeline({
    repeat: -1,
    repeatDelay: 1
});

nfcTl.to(".phone", { x: 15, rotation: 5, duration: 0.6, ease: "power2.inOut" })
     .to(".pos", { x: -15, rotation: -5, duration: 0.6, ease: "power2.inOut" }, "-=0.6")
     .fromTo(".waves span", 
         { opacity: 0, scaleY: 0.5 },
         { opacity: 1, scaleY: 1.8, duration: 0.3, stagger: 0.1, yoyo: true, repeat: 3 }
     )
     .to([".phone", ".pos"], { x: 0, rotation: 0, duration: 0.6, ease: "back.out(1.5)" });

// CTA Animation
gsap.from(".cta-card", {
    scrollTrigger: {
        trigger: ".cta-section",
        start: "top 80%"
    },
    scale: 0.9,
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: "elastic.out(1, 0.7)"
});

// 7. Navbar Links Hover Animation (GSAP)
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, { y: -3, duration: 0.2, ease: "power1.out" });
    });
    link.addEventListener('mouseleave', () => {
        gsap.to(link, { y: 0, duration: 0.4, ease: "bounce.out" });
    });
});
