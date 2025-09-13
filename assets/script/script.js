// Navigasyon için parçacık animasyonu
const navCanvas = document.getElementById('nav-particles');
if (navCanvas) {
    const ctx = navCanvas.getContext('2d');
    let particles = [];
    const numParticles = 30;

    function resizeNavCanvas() {
        navCanvas.width = window.innerWidth;
        navCanvas.height = navCanvas.parentElement.offsetHeight;
    }

    resizeNavCanvas();
    window.addEventListener('resize', resizeNavCanvas);

    function Particle() {
        this.x = Math.random() * navCanvas.width;
        this.y = Math.random() * navCanvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 2 + 1;
        this.color = ['#99ccff', '#b3d1ff', '#d4e4ff'][Math.floor(Math.random() * 3)];

        this.move = function() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > navCanvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > navCanvas.height) this.vy = -this.vy;
        };

        this.show = function() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        };
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, navCanvas.width, navCanvas.height);
        for (let particle of particles) {
            particle.move();
            particle.show();
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
}

// Scroll ile header efekti
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Yıldızlı arka plan animasyonu
const canvas = document.getElementById('stars');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let numStars = 250;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function Star() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * canvas.width;
        this.baseSpeed = 7;
        this.speed = this.baseSpeed;
        this.color = ['#ffffff', '#99ccff', '#b3d1ff', '#d4e4ff'][Math.floor(Math.random() * 4)];

        this.move = function() {
            this.z -= this.speed;
            if (this.z <= 0) {
                this.z = canvas.width;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.color = ['#ffffff', '#99ccff', '#b3d1ff', '#d4e4ff'][Math.floor(Math.random() * 4)];
            }
        };

        this.show = function() {
            let x, y, radius, opacity;
            x = (this.x - canvas.width / 2) * (canvas.width / this.z);
            x = x + canvas.width / 2;
            y = (this.y - canvas.height / 2) * (canvas.width / this.z);
            y = y + canvas.height / 2;
            radius = canvas.width / this.z * 1.5;
            opacity = (canvas.width - this.z) / canvas.width;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `${this.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.fill();
        };
    }

    function initStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }
    }

    function animateStars() {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let star of stars) {
            star.move();
            star.show();
        }
        requestAnimationFrame(animateStars);
    }

    initStars();
    animateStars();
}

// Mobil menü toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isActive = navLinks.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive);
    });
}

// Form gönderimi
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.querySelector('input[type="text"]').value;
        const email = document.querySelector('input[type="email"]').value;
        const message = document.querySelector('textarea').value;

        if (name && email && message) {
            formMessage.textContent = 'Mesajınız gönderildi! 🚀 Teşekkür ederiz.';
            formMessage.classList.add('success');
            formMessage.classList.remove('error');
            this.reset();
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.classList.remove('success');
            }, 3000);
        } else {
            formMessage.textContent = 'Lütfen tüm alanları doldurun.';
            formMessage.classList.add('error');
            formMessage.classList.remove('success');
        }
    });
}

// Yumuşak kaydırma ve aktif navigasyon
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');

        document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
        this.classList.add('active');

        window.location.href = href;

        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

// Aktif sayfa vurgusu
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop() || 'index.html';
    if (linkPath === currentPath) {
        link.classList.add('active');
    }
});

// Görünüm animasyonları için Intersection Observer
const animateOnScroll = (elements, animationClass) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(animationClass);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));
};

const projectCards = document.querySelectorAll('.project-card');
const teamCards = document.querySelectorAll('.team-card');
const missionCards = document.querySelectorAll('.mission-card');

animateOnScroll(projectCards, 'fade-in');
animateOnScroll(teamCards, 'fade-in');
animateOnScroll(missionCards, 'fade-in');

const style = document.createElement('style');
style.innerHTML = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
`;
document.head.appendChild(style);

[projectCards, teamCards, missionCards].forEach(cardGroup => {
    cardGroup.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(40px)';
    });
});



// Klavye navigasyonu için kart tıklama
[projectCards, teamCards].forEach(cardGroup => {
    cardGroup.forEach(card => {
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
});
