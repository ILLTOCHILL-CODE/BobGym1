import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText'; // Requires Club GreenSock, fallback to plain DOM splitting if unavailable

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // 1. Hero Parallax & Text Split
    const heroText = document.querySelector('.hero h1');
    if (heroText) {
        // Basic fallback character split
        const chars = heroText.innerText.split('');
        heroText.innerHTML = '';
        chars.forEach(char => {
            const span = document.createElement('span');
            span.style.display = 'inline-block';
            span.innerText = char === ' ' ? '\u00A0' : char;
            heroText.appendChild(span);
        });

        gsap.from(heroText.children, {
            y: 50,
            opacity: 0,
            stagger: 0.05,
            duration: 1,
            ease: 'power3.out'
        });
    }

    // Hero Background Parallax
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        gsap.to(heroBg, {
            scale: 1.1,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    // 2. The Vibe Pinned Horizontal Scroll
    const vibeContainer = document.querySelector('.vibe-container');
    const vibeWrapper = document.querySelector('.vibe-wrapper');
    if (vibeContainer && vibeWrapper) {
        // calculate total translation
        const xPercent = -100 * (vibeWrapper.scrollWidth - window.innerWidth) / vibeWrapper.scrollWidth;

        gsap.to(vibeWrapper, {
            xPercent: xPercent,
            ease: 'none',
            scrollTrigger: {
                trigger: vibeContainer,
                pin: true,
                scrub: 1.5, // Increased scrub for smoother, heavier inertia
                start: 'top top',
                end: () => `+=${vibeWrapper.scrollWidth}`
            }
        });
    }

    // 2.5 The Arsenal (Collision Gallery)
    const gallerySection = document.querySelector('.gallery-collision');
    if (gallerySection) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: gallerySection,
                start: 'top top',
                end: '+=400%', // 4 viewport heights of scrolling
                pin: true,
                scrub: 1.5 // Smoother interpolation
            }
        });

        const imgsLeft = document.querySelectorAll('.gallery-track-left .col-img');
        const imgsRight = document.querySelectorAll('.gallery-track-right .col-img');

        // Set initial positions off-screen with some random rotation
        gsap.set(imgsLeft, { xPercent: -150, rotation: -10, opacity: 0 });
        gsap.set(imgsRight, { xPercent: 150, rotation: 10, opacity: 0 });

        // Phase 1: Slam in images 1 and 2
        tl.to('.col-img-1', { xPercent: -15, rotation: -2, opacity: 1, duration: 1 }, 0)
            .to('.col-img-2', { xPercent: 15, rotation: 2, opacity: 1, duration: 1 }, 0);

        // Phase 2: Scale them down, bring in 3 and 4
        tl.to(['.col-img-1', '.col-img-2'], { scale: 0.8, duration: 1 }, 1)
            .to('.col-img-3', { xPercent: -5, yPercent: 10, rotation: 5, opacity: 1, duration: 1 }, 1)
            .to('.col-img-4', { xPercent: 5, yPercent: -10, rotation: -5, opacity: 1, duration: 1 }, 1);

        // Phase 3: Scale down all, bring in 5 and 6
        tl.to(['.col-img-1', '.col-img-2', '.col-img-3', '.col-img-4'], { scale: 0.6, yPercent: '+=5', duration: 1 }, 2)
            .to('.col-img-5', { xPercent: 0, yPercent: 0, rotation: -8, opacity: 1, duration: 1 }, 2)
            .to('.col-img-6', { xPercent: 0, yPercent: 5, rotation: 8, opacity: 1, duration: 1 }, 2);

        // Phase 4: Explode / Fall away
        tl.to(gallerySection.querySelectorAll('.col-img'), {
            scale: 2.5,
            opacity: 0,
            rotation: 0,
            duration: 1.5,
            stagger: 0.1,
            ease: 'power2.in'
        }, 3);

        // Watermark slow scale
        tl.fromTo('.gallery-watermark', { scale: 0.8 }, { scale: 1.2, duration: 4.5 }, 0);
    }

    // 3. Facility Zones Staggered Entrance
    gsap.from(".c2-card", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.c2-grid',
            start: 'top 80%',
        }
    });

    // 4. Magnetic CTA Button (Climax)
    const ctaButton = document.querySelector('.magnetic-btn');
    if (ctaButton) {
        // Wrap text for inner parallax
        if (!ctaButton.querySelector('.btn-text-content')) {
            const originalText = ctaButton.innerText;
            ctaButton.innerHTML = `<span class="btn-text-content" style="display:inline-block; pointer-events:none;">${originalText}</span>`;
        }
        const btnText = ctaButton.querySelector('.btn-text-content');

        ctaButton.addEventListener('mousemove', (e) => {
            const rect = ctaButton.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move the button shell
            gsap.to(ctaButton, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });

            // Move the text inside slightly slower for 3D depth
            gsap.to(btnText, {
                x: x * 0.15,
                y: y * 0.15,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        ctaButton.addEventListener('mouseleave', () => {
            gsap.to([ctaButton, btnText], {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    }
}

