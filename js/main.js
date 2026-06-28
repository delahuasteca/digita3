(function() {
    'use strict';

    // ==================== PARTICLES ====================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;
    const CONNECTION_DISTANCE = 150;

    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.vx = (Math.random() - 0.5) * 0.5; this.vy = (Math.random() - 0.5) * 0.5; this.radius = Math.random() * 1.5 + 0.5; this.opacity = Math.random() * 0.5 + 0.1; }
        update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > canvas.width) this.vx *= -1; if (this.y < 0 || this.y > canvas.height) this.vy *= -1; }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(16, 185, 129, ${this.opacity})`; ctx.fill(); }
    }

    function initParticles() { particles = []; for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle()); }
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DISTANCE) {
                    ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(16, 185, 129, ${(1 - dist / CONNECTION_DISTANCE) * 0.15})`; ctx.lineWidth = 0.5; ctx.stroke();
                }
            }
        }
    }
    function animateParticles() { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); drawConnections(); requestAnimationFrame(animateParticles); }
    initParticles(); animateParticles();

       // ==================== NAVBAR ====================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 80) { 
            navbar.style.background = 'rgba(10, 10, 10, 0.85)'; 
            navbar.style.backdropFilter = 'blur(16px)'; 
            navbar.style.borderBottom = '1px solid rgba(16, 185, 129, 0.3)'; // Borde esmeralda claro al hacer scroll
        } else { 
            navbar.style.background = 'transparent'; 
            navbar.style.backdropFilter = 'none'; 
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)'; // Borde blanco muy sutil al inicio
        }
    });
    
      // ==================== MOBILE MENU ====================
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburger = document.getElementById('hamburger');
    let menuOpen = false;

    mobileToggle.addEventListener('click', () => {
        menuOpen = !menuOpen; mobileMenu.classList.toggle('open', menuOpen);
        const spans = hamburger.querySelectorAll('span');
        if (menuOpen) { spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)'; spans[1].style.opacity = '0'; spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)'; spans[2].style.width = '1.5rem'; }
        else { spans[0].style.transform = ''; spans[1].style.opacity = '1'; spans[2].style.transform = ''; spans[2].style.width = '1rem'; }
    });
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            menuOpen = false; mobileMenu.classList.remove('open');
            const spans = hamburger.querySelectorAll('span'); spans[0].style.transform = ''; spans[1].style.opacity = '1'; spans[2].style.transform = ''; spans[2].style.width = '1rem';
        });
    });

    // ==================== REVEAL ANIMATIONS ====================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const revealObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); }); }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));

    // ==================== COUNTER ANIMATION ====================
    const counters = document.querySelectorAll('.counter-value');
    let countersAnimated = false;
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.target); const duration = 2000; const startTime = performance.now();
                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime; const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3); const current = Math.round(eased * target);
                        counter.textContent = current + (target === 98 ? '%' : target === 24 ? '/7' : '+');
                        if (progress < 1) requestAnimationFrame(updateCounter);
                    }
                    requestAnimationFrame(updateCounter);
                });
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    // ==================== FORM & WHATSAPP ====================
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const btnSpinner = document.getElementById('btn-spinner');

    function sanitize(str) { const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }
    function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
    function showError(fieldId, show) { const errorEl = document.getElementById(fieldId + '-error'); if (errorEl) errorEl.classList.toggle('hidden', !show); const input = document.getElementById(fieldId); if (input) input.style.borderColor = show ? 'rgba(239, 68, 68, 0.5)' : ''; }
    function showToast(message, type = 'success') { const toast = document.getElementById('toast'); const toastMessage = document.getElementById('toast-message'); toastMessage.textContent = message; toast.style.background = type === 'error' ? '#dc2626' : '#059669'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 4000); }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = sanitize(document.getElementById('name').value.trim());
        const phone = sanitize(document.getElementById('phone').value.trim());
        const email = sanitize(document.getElementById('email').value.trim());
        const service = document.getElementById('service').value;
        const message = sanitize(document.getElementById('message').value.trim());
        let hasErrors = false;

        if (!name) { showError('name', true); hasErrors = true; } else { showError('name', false); }
        if (!email || !isValidEmail(email)) { showError('email', true); hasErrors = true; } else { showError('email', false); }
        if (!service) { showError('service', true); hasErrors = true; } else { showError('service', false); }
        if (!message) { showError('message', true); hasErrors = true; } else { showError('message', false); }

        if (hasErrors) { showToast('Por favor completa todos los campos requeridos', 'error'); return; }

        btnText.textContent = 'Preparando...'; btnIcon.classList.add('hidden'); btnSpinner.classList.remove('hidden'); submitBtn.disabled = true;

        const whatsappMessage = encodeURIComponent(`🚀 *Nuevo contacto desde DIGITA3*\n\n👤 *Nombre:* ${name}\n📧 *Email:* ${email}\n📱 *Teléfono:* ${phone || 'No proporcionado'}\n🛠️ *Servicio:* ${service}\n\n💬 *Mensaje:*\n${message}`);
        
        // ⚠️ CAMBIA ESTE NÚMERO POR EL TUYO ⚠️
        const whatsappNumber = '5491100000000';

        setTimeout(() => {
            window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
            form.reset(); btnText.textContent = 'Enviar por WhatsApp'; btnIcon.classList.remove('hidden'); btnSpinner.classList.add('hidden'); submitBtn.disabled = false;
            showToast('¡Mensaje preparado! Complete el envío en WhatsApp.');
        }, 1000);
    });

    ['name', 'email', 'phone', 'service', 'message'].forEach(fieldId => {
        const el = document.getElementById(fieldId);
        if (el) { el.addEventListener('input', () => showError(fieldId, false)); el.addEventListener('change', () => showError(fieldId, false)); }
    });

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) { e.preventDefault(); const target = document.querySelector(this.getAttribute('href')); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    });
})();
