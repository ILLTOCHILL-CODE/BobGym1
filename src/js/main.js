import '../css/main.css';
import Lenis from '@studio-freight/lenis';

// Initialize global functionality
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Export lenis instance for GSAP ScrollTrigger if needed
    window.lenis = lenis;

    // 2. Custom Cursor Logic
    // Mobile menu toggle logic
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('active');

            if (!isExpanded) {
                document.body.style.overflow = 'hidden';
                window.lenis.stop();
            } else {
                document.body.style.overflow = '';
                window.lenis.start();
            }
        });
    }

    // 3. Custom Cursor Integration
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    // Disable custom cursor on touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        document.body.style.cursor = 'none';

        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
        });

        // Hover Effect on Actives
        const interactables = document.querySelectorAll('a, button, input, .magnetic-btn');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });
    }
});
