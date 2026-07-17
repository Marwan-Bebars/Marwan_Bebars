import { setupNeuralBackground } from './js/background.js';
import { projects } from './data/projects.js';
import { renderProjects, renderModalContent } from './js/renderer.js';

// ===== SMOOTH SCROLL TO SECTIONS =====
window.scrollToSection = function (sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== MAIN INITIALIZATION =====
function init() {
    // Render Projects First
    renderProjects(projects);

    // Initialize Effects
    setupNeuralBackground();

    // Initialize existing logic
    initProjectFiltering();
    initScrollReveal();
    initNavbarEffects();
    initContactForm();
    initSmoothScrollLinks();
    initProjectModal();
}

// ===== PROJECT FILTERING =====
function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filterValue = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter projects
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hidden');
                    // Reset transform before showing to avoid glitches
                    card.style.transform = 'none';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease-in-out, transform 0.1s ease-out'; // Restore transition
                        card.style.opacity = '1';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

// ===== SCROLL REVEAL ANIMATION =====
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== NAVBAR EFFECTS =====
function initNavbarEffects() {
    // Link Active State
    window.addEventListener('scroll', function () {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // const sectionHeight = section.clientHeight; // Unused
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Navbar Scroll Shadow
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile Nav Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navbarElement = document.querySelector('.navbar');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navbarElement.classList.toggle('nav-open');
        });
    }
}

// ===== CONTACT FORM SUBMISSION =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Validate form
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }

            // Create mailto link
            const mailtoLink = `mailto:marwan.bebars1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

            // Open email client
            window.location.href = mailtoLink;

            // Reset form
            contactForm.reset();
        });
    }
}

// ===== SMOOTH SCROLL NAVBAR LINKS =====
function initSmoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Close mobile menu if open
                    const navbar = document.querySelector('.navbar');
                    if (navbar.classList.contains('nav-open')) {
                        navbar.classList.remove('nav-open');
                        const navToggle = document.querySelector('.nav-toggle');
                        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    });
}

// ===== PROJECT DETAILS MODAL =====
function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modalContent');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalOverlay = document.getElementById('modalOverlay');

    if (!modal || !modalContent) return;

    // Use event delegation for Details buttons on cards
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-details');
        if (btn) {
            const projectId = btn.getAttribute('data-id');
            const project = projects.find(p => p.id === projectId);
            if (project) {
                openModal(project);
            }
        }
    });

    // Close Modal via button click
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    // Close Modal via overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close Modal via Escape key
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });

    function openModal(project) {
        // Populate modal content
        modalContent.innerHTML = renderModalContent(project);
        
        // Show modal
        modal.classList.add('modal-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock page scroll

        // Focus modal close button for accessibility
        setTimeout(() => {
            if (modalCloseBtn) modalCloseBtn.focus();
        }, 100);

        // Initialize slider actions if there are multiple images
        initModalSlider();
    }

    function closeModal() {
        modal.classList.remove('modal-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Unlock page scroll
        modalContent.innerHTML = ''; // Clear DOM to save memory
    }

    function initModalSlider() {
        const sliderContainer = modalContent.querySelector('.slider-container');
        if (!sliderContainer) return;

        const slides = sliderContainer.querySelectorAll('.slide');
        const prevBtn = sliderContainer.querySelector('#sliderPrevBtn');
        const nextBtn = sliderContainer.querySelector('#sliderNextBtn');
        const dots = sliderContainer.querySelectorAll('.slider-dot');

        if (slides.length <= 1) return;

        let currentIndex = 0;

        function showSlide(index) {
            // Bounds check
            if (index < 0) {
                currentIndex = slides.length - 1;
            } else if (index >= slides.length) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }

            // Update slide classes
            slides.forEach((slide, idx) => {
                slide.classList.toggle('active', idx === currentIndex);
            });

            // Update dot classes
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showSlide(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showSlide(currentIndex + 1);
            });
        }

        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const targetIdx = parseInt(this.getAttribute('data-index'), 10);
                showSlide(targetIdx);
            });
        });
    }
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
