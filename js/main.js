document.addEventListener('DOMContentLoaded', function() {
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
        }
    }

    // Initialize AOS (Animate On Scroll) with optimized settings for immediate visibility
    if (typeof AOS !== 'undefined') {
        // First, make all AOS elements immediately visible
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.style.opacity = '1';
            el.style.transition = 'opacity 0.5s ease';
        });

        // Then initialize AOS with minimal settings
        AOS.init({
            duration: 400,
            easing: 'ease-out',
            once: true,
            mirror: false,
            offset: 20,  // Trigger animation earlier
            delay: 50,   // Minimal delay between animations
            throttleDelay: 50,
            initClassName: 'aos-init',
            disable: false, // Never disable AOS
            startEvent: 'DOMContentLoaded' // Start immediately
        });

        // Force refresh to ensure elements are in view
        window.addEventListener('load', () => {
            AOS.refresh();
            // Force reflow to ensure animations trigger
            document.body.style.overflowX = 'hidden';
            void document.body.offsetHeight;
        });
    }

    // Initialize lazy loading for portfolio images
    lazyLoadImages();

    // Add active class to current nav link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Run once on load

    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });
        
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Form submission handling (example)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
            console.log('Form submitted!');
        });
    }

    // Mobile menu toggle functionality
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');

    if (navbarToggler && navbarCollapse) {
        // Create close icon element
        const closeIcon = document.createElement('span');
        closeIcon.classList.add('close-icon');
        closeIcon.innerHTML = '&times;'; // × symbol
        closeIcon.style.fontSize = '1.5rem';
        closeIcon.style.cursor = 'pointer';
        closeIcon.style.userSelect = 'none';
        closeIcon.style.display = 'none';
        navbarToggler.appendChild(closeIcon);

        navbarToggler.addEventListener('click', () => {
            const isShown = navbarCollapse.classList.contains('show');
            if (isShown) {
                // Hide the navbar by sliding it up and then removing 'show'
                navbarCollapse.style.transform = 'translateY(-100%)';
                setTimeout(() => {
                    navbarCollapse.classList.remove('show');
                    navbarCollapse.style.removeProperty('transform');
                }, 300); // match CSS transition duration

                // Show menu icon, hide close icon
                navbarToggler.querySelector('.navbar-toggler-icon').style.display = '';
                closeIcon.style.display = 'none';
            } else {
                // Show the navbar by adding 'show' and sliding down
                navbarCollapse.classList.add('show');
                navbarCollapse.style.transform = 'translateY(0)';

                // Hide menu icon, show close icon
                navbarToggler.querySelector('.navbar-toggler-icon').style.display = 'none';
                closeIcon.style.display = '';
            }
        });
    }
});
