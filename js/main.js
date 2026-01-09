document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Elements
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navbarCollapse = document.getElementById('navbarNav');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.nav-link');
    const faBars = mobileMenuToggle?.querySelector('.fa-bars');
    const faTimes = mobileMenuToggle?.querySelector('.fa-times');
    
    // Initialize menu state
    let isMenuOpen = false;
    
    // Function to set initial state
    function initMobileMenu() {
        if (window.innerWidth <= 991.98) {
            closeMobileMenu();
        } else {
            // Reset for desktop
            if (navbarCollapse) navbarCollapse.classList.remove('show');
            if (mobileMenuOverlay) mobileMenuOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    }
    
    function openMobileMenu() {
        if (!navbarCollapse || !mobileMenuOverlay || !mobileMenuToggle) return;
        
        isMenuOpen = true;
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        navbarCollapse.classList.add('show');
        mobileMenuOverlay.style.display = 'block';
        setTimeout(() => mobileMenuOverlay.classList.add('show'), 10);
        document.body.style.overflow = 'hidden';
        
        // Update icons
        if (faBars) faBars.style.opacity = '0';
        if (faTimes) faTimes.style.opacity = '1';
    }
    
    function closeMobileMenu() {
        if (!navbarCollapse || !mobileMenuOverlay || !mobileMenuToggle) return;
        
        isMenuOpen = false;
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        navbarCollapse.classList.remove('show');
        mobileMenuOverlay.classList.remove('show');
        document.body.style.overflow = '';
        
        // Update icons
        if (faBars) faBars.style.opacity = '1';
        if (faTimes) faTimes.style.opacity = '0';
        
        // Hide overlay after transition
        setTimeout(() => {
            if (!isMenuOpen && mobileMenuOverlay) {
                mobileMenuOverlay.style.display = 'none';
            }
        }, 300);
    }
    
    // Initialize event listeners
    function initEventListeners() {
        // Toggle menu
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleMobileMenu();
            });
        }
        
        // Close menu when clicking on overlay
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        }
        
        // Close menu when clicking on nav links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 991.98) {
                    closeMobileMenu();
                }
            });
        });
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 991.98) {
                    closeMobileMenu();
                } else {
                    initMobileMenu();
                }
            }, 100);
        });
    }
    
    // Initialize everything
    initMobileMenu();
    initEventListeners();

    // Preloader
    function hidePreloader() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) return;
        
        // Start fade out
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        preloader.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
        
        // Force a reflow/repaint to ensure the transition starts
        void preloader.offsetHeight;
        
        // Remove preloader from DOM after animation completes
        setTimeout(() => {
            if (preloader && preloader.parentNode) {
                preloader.style.display = 'none';
                preloader.parentNode.removeChild(preloader);
            }
        }, 500);
    }
    
    // Hide preloader when everything is loaded
    window.addEventListener('load', () => {
        // Use a small delay to ensure everything is ready
        setTimeout(hidePreloader, 300);
    });
    
    // Fallback: hide preloader after 3 seconds no matter what
    setTimeout(hidePreloader, 3000);

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lazy load images when they come into view
    function lazyLoadImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // Initialize AOS (Animate On Scroll) with optimized settings for immediate visibility
    if (typeof AOS !== 'undefined') {
        // First, make all AOS elements immediately visible
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.style.opacity = '1';
            el.style.transition = 'opacity 0.5s ease';
        });

        // Then initialize AOS with custom settings
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            disable: window.innerWidth < 768,
            initClassName: 'aos-init',
            animatedClassName: 'aos-animate',
            useClassNames: false,
            disableMutationObserver: false,
            debounceDelay: 50,
            throttleDelay: 99,
            startEvent: 'DOMContentLoaded'
        });
    }

    // Add active class to current nav link
    const sections = document.querySelectorAll('section');
    const desktopNavLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = '#' + section.getAttribute('id');
            }
        });
        
        desktopNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Run once on load

    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Initialize lazy loading for images
    lazyLoadImages();
});
