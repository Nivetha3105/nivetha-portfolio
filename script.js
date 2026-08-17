/* ==========================================
   NIVETHA R — PREMIUM PORTFOLIO
   Interactive Script
   ========================================== */

// ==========================================
// LOADING SCREEN
// ==========================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initAllAnimations();
    }, 1800);
});

document.body.style.overflow = 'hidden';

// ==========================================
// CURSOR EFFECTS (Desktop only)
// ==========================================
const cursorGlow = document.getElementById('cursor-glow');
const cursorDot = document.getElementById('cursor-dot');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;
let dotX = 0, dotY = 0;
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        dotX += (mouseX - dotX) * 0.15;
        dotY += (mouseY - dotY) * 0.15;

        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover detection for interactive elements
    const hoverTargets = 'a, button, .project-card, .cert-card, .stat-card, .achievement-card, .contact-link, input, textarea';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverTargets)) {
            cursorDot.classList.add('hovering');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverTargets)) {
            cursorDot.classList.remove('hovering');
        }
    });
} else {
    if (cursorGlow) cursorGlow.style.display = 'none';
    if (cursorDot) cursorDot.style.display = 'none';
}

// ==========================================
// MAGNETIC BUTTONS
// ==========================================
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    if (isTouchDevice) return;

    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ==========================================
// PARTICLE CANVAS (Hero Background)
// ==========================================
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() > 0.5 ? 260 : 220; // purple or blue
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse attraction (subtle)
            if (!isTouchDevice) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    this.x += dx * 0.001;
                    this.y += dy * 0.001;
                }
            }

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 70%, ${this.opacity})`;
            ctx.fill();
        }
    }

    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        animId = requestAnimationFrame(animate);
    }
    animate();
}

// ==========================================
// SKILLS CONSTELLATION (Neural Network)
// ==========================================
function initSkillsConstellation() {
    const container = document.getElementById('skills-nodes');
    const canvas = document.getElementById('skills-canvas');
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    const skills = [
        { name: 'Python', x: 0.5, y: 0.35, core: true },
        { name: 'Java', x: 0.3, y: 0.25, core: true },
        { name: 'SQL', x: 0.7, y: 0.25, core: false },
        { name: 'C', x: 0.15, y: 0.5, core: false },
        { name: 'C++', x: 0.2, y: 0.7, core: false },
        { name: 'NumPy', x: 0.6, y: 0.55, core: false },
        { name: 'Pandas', x: 0.75, y: 0.45, core: false },
        { name: 'Tableau', x: 0.85, y: 0.65, core: false },
        { name: 'Excel', x: 0.4, y: 0.7, core: false },
        { name: 'Data Analysis', x: 0.55, y: 0.78, core: true },
        { name: 'Problem Solving', x: 0.35, y: 0.45, core: true },
    ];

    // Connections (index pairs)
    const connections = [
        [0, 1], [0, 2], [0, 5], [0, 6], [0, 10],
        [1, 3], [1, 4], [1, 10],
        [2, 6], [2, 7],
        [3, 4],
        [5, 6], [5, 9],
        [6, 7], [6, 9],
        [7, 8],
        [8, 9],
        [9, 10],
        [0, 9],
    ];

    let nodeElements = [];
    let nodePositions = [];

    function resize() {
        const rect = container.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        updatePositions();
    }

    function updatePositions() {
        const w = canvas.width;
        const h = canvas.height;
        const pad = 60;

        nodePositions = skills.map(s => ({
            x: pad + s.x * (w - pad * 2),
            y: pad + s.y * (h - pad * 2)
        }));

        nodeElements.forEach((el, i) => {
            el.style.left = nodePositions[i].x + 'px';
            el.style.top = nodePositions[i].y + 'px';
        });
    }

    // Create DOM nodes
    skills.forEach((skill, i) => {
        const node = document.createElement('div');
        node.className = 'skill-node' + (skill.core ? ' core' : '');
        node.textContent = skill.name;
        node.style.transform = 'translate(-50%, -50%)';
        container.appendChild(node);
        nodeElements.push(node);
    });

    resize();
    window.addEventListener('resize', resize);

    // Animate connections
    let phase = 0;
    function drawConnections() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        phase += 0.005;

        connections.forEach(([a, b], idx) => {
            const posA = nodePositions[a];
            const posB = nodePositions[b];
            if (!posA || !posB) return;

            const pulse = Math.sin(phase + idx * 0.5) * 0.5 + 0.5;
            const opacity = 0.08 + pulse * 0.12;

            ctx.beginPath();
            ctx.moveTo(posA.x, posA.y);
            ctx.lineTo(posB.x, posB.y);

            const gradient = ctx.createLinearGradient(posA.x, posA.y, posB.x, posB.y);
            gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity})`);
            gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity})`);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Traveling dot
            const t = (phase * 2 + idx * 0.7) % 1;
            const dotPosX = posA.x + (posB.x - posA.x) * t;
            const dotPosY = posA.y + (posB.y - posA.y) * t;
            ctx.beginPath();
            ctx.arc(dotPosX, dotPosY, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(167, 139, 250, ${0.3 + pulse * 0.4})`;
            ctx.fill();
        });

        requestAnimationFrame(drawConnections);
    }
    drawConnections();
}

// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
}

// ==========================================
// ANIMATED COUNTERS
// ==========================================
function initCounters() {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.target);
                const isDecimal = el.dataset.decimal === 'true';
                const duration = 2000;
                const start = performance.now();

                // Animate parent card's bar fill
                const card = el.closest('.stat-card');
                if (card) card.classList.add('animated');

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 4); // ease-out-quart
                    const current = eased * target;
                    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));
}

// ==========================================
// NAVIGATION
// ==========================================
function initNavigation() {
    const nav = document.getElementById('main-nav');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Active section highlighting
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.section === id);
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(section => sectionObserver.observe(section));

    // Nav background on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 100) {
            nav.style.opacity = '1';
        }
        lastScroll = scrollY;
    });

    // Mobile Menu
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ==========================================
// COMMAND CENTER
// ==========================================
function initCommandCenter() {
    const commandCenter = document.getElementById('command-center');
    const commandBtn = document.getElementById('command-center-btn');
    const commandClose = document.getElementById('command-close');
    const commandOverlay = commandCenter.querySelector('.command-overlay');
    const commandSearch = document.getElementById('command-search');
    const commandItems = document.querySelectorAll('.command-item');

    function openCommand() {
        commandCenter.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => commandSearch.focus(), 200);
    }

    function closeCommand() {
        commandCenter.classList.remove('active');
        document.body.style.overflow = '';
        commandSearch.value = '';
        filterCommands('');
    }

    commandBtn.addEventListener('click', openCommand);
    commandClose.addEventListener('click', closeCommand);
    commandOverlay.addEventListener('click', closeCommand);

    // Keyboard shortcut: Ctrl+K
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (commandCenter.classList.contains('active')) {
                closeCommand();
            } else {
                openCommand();
            }
        }
        if (e.key === 'Escape' && commandCenter.classList.contains('active')) {
            closeCommand();
        }
    });

    // Search filtering
    function filterCommands(query) {
        const q = query.toLowerCase();
        commandItems.forEach(item => {
            const text = item.querySelector('.cmd-text').textContent.toLowerCase();
            item.style.display = text.includes(q) ? 'flex' : 'none';
        });
    }

    commandSearch.addEventListener('input', (e) => {
        filterCommands(e.target.value);
    });

    // Command actions
    commandItems.forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            closeCommand();

            switch (action) {
                case 'navigate':
                    const target = document.querySelector(item.dataset.target);
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'project':
                    const projectId = item.dataset.project;
                    setTimeout(() => {
                        const projectSection = document.getElementById('projects');
                        if (projectSection) projectSection.scrollIntoView({ behavior: 'smooth' });
                        setTimeout(() => openProjectModal(projectId), 600);
                    }, 300);
                    break;
                case 'resume':
                    window.open('resume.pdf', '_blank');
                    break;
                case 'link':
                    window.open(item.dataset.url, '_blank');
                    break;
            }
        });
    });

    // Keyboard navigation within command list
    let activeIndex = -1;
    commandSearch.addEventListener('keydown', (e) => {
        const visibleItems = [...commandItems].filter(i => i.style.display !== 'none');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, visibleItems.length - 1);
            visibleItems.forEach((item, i) => item.classList.toggle('active', i === activeIndex));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, 0);
            visibleItems.forEach((item, i) => item.classList.toggle('active', i === activeIndex));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && visibleItems[activeIndex]) {
                visibleItems[activeIndex].click();
            }
        }
    });
}

// ==========================================
// PROJECT MODALS
// ==========================================
const projectData = {
    ethicacode: {
        icon: '🤖',
        title: 'EthicaCode',
        desc: 'An AI ethics auditing platform designed to detect bias and improve transparency in machine learning models. Built during the TNWISE Hackathon, EthicaCode implements features for explainability and ethical scoring to ensure responsible AI decision-making.',
        details: [
            'AI bias detection engine that scans ML models for discriminatory patterns',
            'Explainability scoring system for transparent model behavior',
            'Ethical assessment dashboard with visual risk indicators',
            'Responsible AI compliance checker for industry standards',
            'Built during TNWISE Hackathon with a focus on practical impact'
        ],
        tech: ['Python', 'Machine Learning', 'AI Ethics', 'Explainable AI', 'Data Analysis']
    },
    expense: {
        icon: '💰',
        title: 'Expense Tracker',
        desc: 'A comprehensive application designed to track and categorize daily expenses with intelligent income-expense analysis for improved financial insights and better budget management.',
        details: [
            'Intuitive interface for logging and categorizing daily transactions',
            'Income vs. expense analysis with visual breakdowns',
            'Budget tracking with spending pattern recognition',
            'Financial insights and reporting dashboard',
            'Data persistence for long-term financial tracking'
        ],
        tech: ['Python', 'Data Analysis', 'Visualization', 'File I/O']
    },
    waste: {
        icon: '♻️',
        title: 'Waste Management System',
        desc: 'An Arduino-based intelligent system for automated dry and wet waste classification using sensor-based detection and real-time segregation capabilities.',
        details: [
            'Arduino-powered hardware system with multiple sensors',
            'Automated dry/wet waste classification using sensor data',
            'Real-time detection and segregation mechanism',
            'Sensor integration for moisture and material detection',
            'Eco-friendly automation reducing manual sorting effort'
        ],
        tech: ['Arduino', 'IoT', 'Sensors', 'Embedded Systems', 'Automation']
    }
};

function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    const modal = document.getElementById('project-modal');
    document.getElementById('modal-icon').textContent = data.icon;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-desc').textContent = data.desc;

    const detailsEl = document.getElementById('modal-details');
    detailsEl.innerHTML = `
        <h5>Key Features</h5>
        <ul>${data.details.map(d => `<li>${d}</li>`).join('')}</ul>
    `;

    const techEl = document.getElementById('modal-tech');
    techEl.innerHTML = data.tech.map(t => `<span class="tech-badge">${t}</span>`).join('');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function initProjectModals() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    document.querySelectorAll('.project-modal-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            openProjectModal(trigger.dataset.project);
        });
    });
}

// ==========================================
// 3D TILT EFFECT ON PROJECT CARDS
// ==========================================
function initTiltCards() {
    if (isTouchDevice) return;

    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateX = (0.5 - y) * 10;
            const rotateY = (x - 0.5) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ==========================================
// CONTACT FORM
// ==========================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    const success = document.getElementById('form-success');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate form submission
        const submitBtn = document.getElementById('form-submit');
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            success.classList.add('visible');
            setTimeout(() => {
                success.classList.remove('visible');
                form.reset();
                submitBtn.innerHTML = `
                    <span>Send Message</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                `;
                submitBtn.disabled = false;
            }, 3000);
        }, 1200);
    });
}

// ==========================================
// SECTION PARALLAX SUBTLE EFFECT
// ==========================================
function initParallax() {
    const orbs = document.querySelectorAll('.hero-ambient-orb');
    if (isTouchDevice) return;

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        orbs.forEach((orb, i) => {
            const speed = (i + 1) * 15;
            orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
}

// ==========================================
// CERTIFICATIONS MARQUEE PAUSE ON HOVER
// ==========================================
function initCertsMarquee() {
    const track = document.getElementById('certs-track');
    if (!track) return;

    // Already handled in CSS animation-play-state, but ensure smooth behavior
    track.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
    });
    track.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
    });
}

// ==========================================
// INIT ALL
// ==========================================
function initAllAnimations() {
    initParticles();
    initScrollReveal();
    initCounters();
    initNavigation();
    initCommandCenter();
    initProjectModals();
    initTiltCards();
    initContactForm();
    initSkillsConstellation();
    initParallax();
    initCertsMarquee();
}
