export function initPricingInteractions() {
    // 1. Audio Jolt Simulator 
    // Real site would use new Audio('rumble.mp3').play();
    const playJoltAudio = () => {
        console.log("[AUDIO] - Low Rumble Heartbeat Played");
    };

    const cpZones = Array.from(document.querySelectorAll('.cp-zone'));
    const cpNavItems = Array.from(document.querySelectorAll('.cp-nav-item'));
    const cpBg = document.getElementById('cp-bg');
    const cpPriceVal = document.getElementById('cp-price-val');

    // Only init if elements exist on page
    if (!cpBg || cpZones.length === 0) return;

    const cpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = cpZones.indexOf(entry.target);
                // Update Nav
                cpNavItems.forEach(n => {
                    if (n) n.classList.remove('active');
                });
                if (cpNavItems[index]) cpNavItems[index].classList.add('active');

                // Math Liquid Counter 
                if (cpPriceVal && entry.target.dataset.price) {
                    const targetPrice = parseInt(entry.target.dataset.price);
                    let currentPrice = parseInt(cpPriceVal.innerText);
                    const diff = targetPrice - currentPrice;
                    const steps = 20;
                    let step = 0;

                    const interval = setInterval(() => {
                        step++;
                        cpPriceVal.innerText = Math.round(currentPrice + (diff * (step / steps)));
                        if (step >= steps) {
                            clearInterval(interval);
                            cpPriceVal.innerText = targetPrice;
                        }
                    }, 20);
                }

                // Elite Trigger Jolt
                if (entry.target.classList.contains('elite')) {
                    if (!cpBg.classList.contains('elite-active')) {
                        // Only play audio on first entry from top
                        playJoltAudio();
                    }
                    cpBg.classList.add('elite-active');
                } else {
                    cpBg.classList.remove('elite-active');
                }
            }
        });
    }, { threshold: 0.6 });

    cpZones.forEach(zone => { if (zone) cpObserver.observe(zone); });

    // 2 & 3. Morphing Cursor & Magnetic Button
    const cpEliteZones = document.querySelectorAll('.cp-zone.elite');
    const cpCursor = document.getElementById('cp-cursor');
    const cpMatrixItems = document.querySelectorAll('.cp-matrix-item');
    // Using QSA to support multiple elite zones if needed
    const cpMagBtns = document.querySelectorAll('.cp-magnetic-btn');

    if (cpEliteZones.length > 0 && cpCursor && window.innerWidth > 900) {

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let isHoveringMatrix = false;
        let isHoveringBtn = false;
        let currentScale = 0;
        let targetScale = 0;

        // Mouse Tracker
        cpEliteZones.forEach(zone => {
            zone.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                targetScale = 1;
            });

            zone.addEventListener('mouseleave', () => {
                targetScale = 0;
            });
        });

        // Data-Viz Matrix Hover Logic
        cpMatrixItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                cpCursor.classList.add('matrix-hover');
                isHoveringMatrix = true;

                // Show background if mapped
                const targetBgId = e.target.dataset.bg;
                if (targetBgId) {
                    const bgEl = document.getElementById(targetBgId);
                    if (bgEl) bgEl.style.opacity = '1';
                }
            });

            item.addEventListener('mouseleave', (e) => {
                cpCursor.classList.remove('matrix-hover');
                isHoveringMatrix = false;

                const targetBgId = e.target.dataset.bg;
                if (targetBgId) {
                    const bgEl = document.getElementById(targetBgId);
                    if (bgEl) bgEl.style.opacity = '0';
                }
            });
        });

        // Magnetic Button Logic
        cpMagBtns.forEach(cpMagBtn => {
            cpMagBtn.addEventListener('mousemove', (e) => {
                cpCursor.classList.add('btn-hover');
                isHoveringBtn = true;

                // physics math for magnet pull
                const rect = cpMagBtn.getBoundingClientRect();
                const btnX = rect.left + rect.width / 2;
                const btnY = rect.top + rect.height / 2;

                // distance from center of button
                const distanceX = e.clientX - btnX;
                const distanceY = e.clientY - btnY;

                // apply pull (magnet strength)
                cpMagBtn.style.transform = `translate3d(${distanceX * 0.3}px, ${distanceY * 0.3}px, 0)`;
            });

            cpMagBtn.addEventListener('mouseleave', () => {
                cpCursor.classList.remove('btn-hover');
                isHoveringBtn = false;
                // Snap back
                cpMagBtn.style.transform = `translate3d(0px, 0px, 0)`;
            });
        });

        // Hardware-Accelerated Render Loop
        const renderCursor = () => {
            // Smooth lerp for buttery trailing effect
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;

            let finalScale = targetScale;
            if (isHoveringBtn) finalScale = 0;
            else if (isHoveringMatrix) finalScale = 1.33;

            currentScale += (finalScale - currentScale) * 0.15;

            // Apply hardware-accelerated transforms instead of layout-thrashing left/top
            cpCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate3d(-50%, -50%, 0) scale(${currentScale})`;

            // Manage opacity for entering/leaving bounds
            cpCursor.style.opacity = currentScale > 0.05 ? 1 : 0;

            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);
    }
}
