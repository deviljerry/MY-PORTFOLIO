// Qasim Naveed Portfolio - Main JS

document.addEventListener("DOMContentLoaded", () => {
    
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. Loader Animation ---
    const loader = document.getElementById('loader');
    const progressText = document.getElementById('loader-progress');
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 1;
        if (progress > 100) progress = 100;
        progressText.innerText = `${progress}%`;

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                gsap.to(loader, {
                    yPercent: -100,
                    duration: 1,
                    ease: "power4.inOut",
                    onComplete: initAnimations // Start other animations after loader
                });
            }, 500);
        }
    }, 50);

    // --- 2. Custom Cursor ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    
    // Check if device supports hover
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    if (!isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Move dot instantly
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
            
            // Update CSS variables for radial gradients on cards
            document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
        });

        // Lerp loop for the ring
        const loop = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);

        // Hover states
        const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .service-card, input, textarea');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                const type = el.getAttribute('data-cursor');
                if (type === 'view') {
                    cursorRing.style.width = '60px';
                    cursorRing.style.height = '60px';
                    cursorRing.style.backgroundColor = 'rgba(0, 255, 102, 0.1)';
                    cursorRing.innerText = 'VIEW';
                    cursorDot.style.opacity = '0';
                } else {
                    cursorRing.style.width = '50px';
                    cursorRing.style.height = '50px';
                    cursorRing.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
                }
            });
            
            el.addEventListener('mouseleave', () => {
                cursorRing.style.width = '40px';
                cursorRing.style.height = '40px';
                cursorRing.style.backgroundColor = 'transparent';
                cursorRing.innerText = '';
                cursorDot.style.opacity = '1';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    // --- 3. Navbar Morphing ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // --- 4. Mobile Menu ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.innerText = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                menuBtn.innerText = '☰';
            }
        });
    });

    // --- 5. 3D Tilt Effect on Services ---
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    tiltCards.forEach(card => {
        if (isTouchDevice) return; // Disable on mobile

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // --- 6. Form Chips ---
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
        });
    });

    // --- 7. GSAP Animations (Called after loader) ---
    function initAnimations() {
        
        // Character-by-character split for Hero Title
        const heroTitles = document.querySelectorAll('.hero-title .char-wrap');
        heroTitles.forEach(title => {
            const text = title.innerText;
            title.innerHTML = '';
            text.split('').forEach(char => {
                const span = document.createElement('span');
                span.innerText = char === ' ' ? '\u00A0' : char;
                span.style.display = 'inline-block';
                span.style.paddingBottom = '0.2em'; // descender-safe
                title.appendChild(span);
            });
        });

        const chars = document.querySelectorAll('.hero-title .char-wrap span');
        gsap.from(chars, {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "power4.out"
        });

        gsap.from('.hero-subtitle, .hero-ctas, .hero-status', {
            y: 20,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            delay: 0.6,
            ease: "power2.out"
        });

        // Slider Logic for Projects
        const projectsWrapper = document.getElementById('projects-wrapper');
        const projPrev = document.getElementById('proj-prev');
        const projNext = document.getElementById('proj-next');

        if (projectsWrapper && projPrev && projNext) {
            projNext.addEventListener('click', () => {
                projectsWrapper.scrollBy({ left: 648, behavior: 'smooth' }); // 600px width + 48px gap
            });
            projPrev.addEventListener('click', () => {
                projectsWrapper.scrollBy({ left: -648, behavior: 'smooth' });
            });
        }

        // About Stats/Skills Shimmer
        gsap.from('.skill-item', {
            scrollTrigger: {
                trigger: "#about",
                start: "top 70%"
            },
            opacity: 0,
            y: 20,
            stagger: 0.05,
            duration: 0.6,
            ease: "power2.out"
        });

        // Wordmark Parallax Scaling
        gsap.to('#wordmark', {
            scrollTrigger: {
                trigger: "footer",
                start: "top bottom",
                end: "bottom bottom",
                scrub: 1
            },
            scale: 1.1,
            opacity: 1,
            ease: "none"
        });
    }
});

// --- 8. Form Submission Simulation ---
window.handleFormSubmit = function() {
    const btn = document.getElementById('submit-btn');
    const originalText = btn.innerText;
    
    // Simulate terminal loader
    btn.innerHTML = '<span style="font-family: var(--font-mono)">> AUTHENTICATING...</span>';
    btn.style.pointerEvents = 'none';
    
    setTimeout(() => {
        btn.innerHTML = '<span style="font-family: var(--font-mono); color: var(--bg-carbon)">> UPLOADING_PAYLOAD [||||||||||] 100%</span>';
        
        setTimeout(() => {
            btn.innerHTML = 'CONNECTION ESTABLISHED ✓';
            btn.style.background = 'var(--accent-neon)';
            btn.style.color = 'var(--bg-carbon)';
            
            // Reset form
            document.getElementById('contact-form').reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = 'var(--text-primary)';
                btn.style.pointerEvents = 'auto';
            }, 3000);
            
        }, 800);
    }, 600);
};

// --- 9. Chatbot Logic ---
document.addEventListener("DOMContentLoaded", () => {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    if (chatbotToggle && chatbotWindow) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.add('open');
        });
        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.remove('open');
        });
    }

    const botResponses = [
        { keywords: ["hi", "hello", "hey", "salam", "assalam", "oie"], response: "Hello there! I'm Qasim's AI Assistant. How can I help you today?" },
        { keywords: ["price", "cost", "budget", "money"], response: "My rates vary depending on the scope of the project. I usually work on Fiverr or Upwork. Feel free to check out my gigs linked in the footer!" },
        { keywords: ["skill", "tech", "stack", "know", "experience"], response: "I specialize in Full Stack Development (MERN & .NET), AI/LLM Integrations, Cloud DevOps (AWS/Azure), and secure scalable architectures." },
        { keywords: ["fiverr", "upwork", "hire", "work", "project"], response: "You can hire me through my Fiverr gigs or Upwork profile linked in the footer. Let's build something bulletproof!" },
        { keywords: ["contact", "email", "phone", "number"], response: "You can email me at contact@sqnza.software or call me at +92 326 7933996." },
        { keywords: ["name", "who", "are you"], response: "I am the digital assistant for Qasim Naveed, a Full Stack AI Developer & DevOps Engineer!" }
    ];

    if (chatbotForm) {
        chatbotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg = chatbotInput.value.trim();
            if (!msg) return;

            // User message
            addMessage(msg, 'user-msg');
            chatbotInput.value = '';

            // Bot typing simulation
            setTimeout(() => {
                const reply = getBotResponse(msg.toLowerCase());
                addMessage(reply, 'bot-msg');
            }, 800);
        });
    }

    function addMessage(text, className) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${className}`;
        msgDiv.innerText = text;
        chatbotMessages.appendChild(msgDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function getBotResponse(msg) {
        for (let item of botResponses) {
            if (item.keywords.some(word => msg.includes(word))) {
                return item.response;
            }
        }
        return "That's interesting! If you have a specific project in mind, the best way to reach me is via my contact form or email (contact@sqnza.software).";
    }

    // --- 10. Back to Top Button ---
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.style.opacity = '1';
                backToTop.style.pointerEvents = 'auto';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.pointerEvents = 'none';
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
