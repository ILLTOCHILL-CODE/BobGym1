// src/js/test-gallery.js

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // CONCEPT A: MONOLITHIC MASK ANIMATION
    // ==========================================

    // Create the intense scale effect for the mask
    // We scale it massively so the empty space of the "A" swallows the viewport
    gsap.to(".mask-shape", {
        scale: 60, // Massive scale multiplier
        transformOrigin: "50% 50%",
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: ".monolith-container",
            start: "top top", // When container hits top of viewport
            end: "+=2000px",   // Scroll distance
            scrub: 1,         // Smooth scrubbing
            pin: ".monolith-sticky", // Pin the container while animating
        }
    });

    // Fade in the interior text content as we go deeper into the shape
    gsap.to(".monolith-content", {
        opacity: 1,
        ease: "power1.inOut",
        scrollTrigger: {
            trigger: ".monolith-container",
            start: "top -800px", // Delay the fade in until we are "inside"
            end: "+=800px",
            scrub: true
        }
    });

    // Option: darken the background slightly as we enter
    gsap.to(".monolith-bg", {
        filter: "brightness(0.3) contrast(1.2) grayscale(0.5)",
        scrollTrigger: {
            trigger: ".monolith-container",
            start: "top top",
            end: "+=1500px",
            scrub: true
        }
    });


    // ==========================================
    // CONCEPT B: OBSIDIAN BENTO MATRIX TILT
    // ==========================================

    const bentoCells = document.querySelectorAll('.bento-cell');

    // Check if device supports hover before applying complex physics
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (!isTouchDevice) {
        bentoCells.forEach(cell => {
            const glare = cell.querySelector('.cell-glare');

            cell.addEventListener('mousemove', (e) => {
                // Get cell dimensions and bounds
                const rect = cell.getBoundingClientRect();

                // Get mouse coordinates relative to cell
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Calculate percentage from center (-1 to 1)
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;

                // Max rotation angles (degrees)
                const maxTilt = 8;

                // Calculate tilt angles based on mouse position
                // Reverse Y so tilting follows physical intuition
                const tiltX = deltaY * -maxTilt;
                const tiltY = deltaX * maxTilt;

                // Apply 3D transform tracking the cursor
                cell.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;

                // Move the glare opposite to the mouse to simulate reflection curvature
                if (glare) {
                    glare.style.transform = `translate(${-deltaX * 30}%, ${-deltaY * 30}%)`;
                }
            });

            // Re-center physics on mouseleave
            cell.addEventListener('mouseleave', () => {
                // Return to flat state with the same transition duration as CSS hover
                cell.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                cell.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

                if (glare) {
                    glare.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';
                    glare.style.transform = `translate(0%, 0%)`;
                }

                // Remove inline transition after it finishes so standard hover rules take over again
                setTimeout(() => {
                    cell.style.transition = '';
                    if (glare) glare.style.transition = '';
                }, 800);
            });

            // Remove transition during movement for zero-latency tracking
            cell.addEventListener('mouseenter', () => {
                cell.style.transition = 'none';
                if (glare) {
                    glare.style.transition = 'opacity 0.3s ease'; // keep opacity transition
                }
            });
        });
    }

    // Optional: Stagger entrance of the Bento cells on scroll
    gsap.from(".bento-cell", {
        y: 60,
        opacity: 0,
        rotationX: -15,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".bento-section",
            start: "top 75%", // Trigger when section is 25% into view
        }
    });

    // ==========================================
    // CONCEPT C: HORIZONTAL PARALLAX TIMELINE
    // ==========================================

    // 1. Horizontal Scroll for the track
    const track = document.querySelector('.timeline-track');

    // Calculate how far to move the track to the left
    function getScrollAmount() {
        let trackWidth = track.scrollWidth;
        return -(trackWidth - window.innerWidth);
    }

    const tween = gsap.to(track, {
        x: getScrollAmount,
        duration: 3,
        ease: "none"
    });

    ScrollTrigger.create({
        trigger: ".timeline-container",
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`,
        pin: ".timeline-sticky",
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true
    });

    // 2. Internal Image Parallax Setup
    // As the container scrolls, the images move slightly to the right inside their wrappers
    // to create a 3D depth effect.
    const timelineImages = gsap.utils.toArray('.timeline-img');

    timelineImages.forEach(img => {
        gsap.to(img, {
            xPercent: 15, // Move image to the right inside its container
            ease: "none",
            scrollTrigger: {
                trigger: ".timeline-container",
                start: "top top",
                end: () => `+=${getScrollAmount() * -1}`,
                scrub: 1,
            }
        });
    });

    // 3. Optional: Internal text parallax
    const timelineContents = gsap.utils.toArray('.timeline-content');

    timelineContents.forEach(content => {
        gsap.fromTo(content,
            { x: -50 },
            {
                x: 50,
                ease: "none",
                scrollTrigger: {
                    trigger: ".timeline-container",
                    start: "top top",
                    end: () => `+=${getScrollAmount() * -1}`,
                    scrub: 1,
                }
            }
        );
    });

});
