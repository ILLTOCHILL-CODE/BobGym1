export async function fetchDummyData(endpoint) {
    try {
        const response = await fetch(`/data/${endpoint}.json`);
        if (!response.ok) throw new Error('Data not found');
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return [];
    }
}

export async function renderTrainers(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const trainers = await fetchDummyData('dummy-trainers');
    container.innerHTML = '';

    if (trainers.length === 0) {
        container.innerHTML = `<div class="empty-state"><h3>Our Elite Roster Core is Building Up!</h3><p>Stay tuned for updates.</p></div>`;
        return;
    }

    trainers.forEach(trainer => {
        const card = document.createElement('div');
        card.className = 'bento-card gsap-bento-card';
        card.innerHTML = `
            ${trainer.image ? `<img src="${trainer.image}" alt="${trainer.name}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 4px; margin-bottom: 1rem;">` : ''}
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h3>${trainer.name}</h3>
                <span style="background: rgba(249, 115, 22, 0.1); color: var(--accent-secondary); padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">Elite</span>
            </div>
            <p class="text-accent" style="display: flex; align-items: center; gap: 0.5rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                ${trainer.specialty}
            </p>
            <p style="margin-top: 1rem; color: var(--text-secondary);">${trainer.bio}</p>
        `;
        container.appendChild(card);
    });
}

export async function renderZones(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const zonesData = await fetchDummyData('dummy-zones');

    if (zonesData.length === 0) {
        container.innerHTML = `<div class="empty-state"><h3>Zones Undefined</h3><p>Please update dummy-zones.json</p></div>`;
        return;
    }

    container.innerHTML = '';

    zonesData.forEach(zone => {
        const card = document.createElement('div');
        card.className = 'bento-card c2-card';
        card.style.flex = '1 1 350px';
        card.style.maxWidth = '450px';
        card.style.minWidth = '300px';

        let detailsHtml = '';
        zone.specs.forEach(spec => {
            detailsHtml += `<div>${spec}</div>`;
        });

        card.innerHTML = `
            <img src="${zone.image}" alt="${zone.name}" class="c2-img">
            <div class="c2-content">
                <h3 class="c2-title">${zone.name}</h3>
                <div class="c2-details">
                    ${detailsHtml}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

export async function renderPricing() {
    const navContainer = document.getElementById('pricing-nav-container');
    const bgContainer = document.getElementById('cp-bg');
    const zonesContainer = document.getElementById('pricing-zones-container');

    if (!navContainer || !bgContainer || !zonesContainer) return;

    const pricingData = await fetchDummyData('dummy-pricing');

    if (pricingData.length === 0) {
        zonesContainer.innerHTML = `<div class="empty-state"><h3>Pricing Data Missing</h3></div>`;
        return;
    }

    navContainer.innerHTML = '';
    bgContainer.innerHTML = '';
    zonesContainer.innerHTML = '';

    let navHtml = '';
    let bgHtml = '';
    let zonesHtml = '';

    pricingData.forEach((tier, index) => {
        const num = String(index + 1).padStart(2, '0');
        const isFirst = index === 0;

        // 1. Build Nav Item
        navHtml += `
            <li class="cp-nav-item ${isFirst ? 'active' : ''}" id="cp-nav-${num}">
                ${num}. ${tier.title}
            </li>
        `;

        // 2. Build Zone
        // Determine structure based on isElite
        let featuresHtml = '';
        if (tier.isElite && tier.matrixFeatures) {
            // Split features into two columns
            const half = Math.ceil(tier.matrixFeatures.length / 2);
            const col1 = tier.matrixFeatures.slice(0, half);
            const col2 = tier.matrixFeatures.slice(half);

            const renderCol = (items) => {
                return items.map(f => {
                    const bgAttr = f.bgId ? `data-bg="${f.bgId}"` : '';
                    return `<span class="cp-matrix-item" ${bgAttr}>${f.text}</span>`;
                }).join('');
            };

            featuresHtml = `
                <div class="cp-elite-features">
                    <div class="cp-elite-feature-col">
                        ${renderCol(col1)}
                    </div>
                    <div class="cp-elite-feature-col">
                        ${renderCol(col2)}
                    </div>
                </div>
            `;

            // Build Matrix Backgrounds for this tier's features
            tier.matrixFeatures.forEach(f => {
                if (f.bgId && f.bgImage) {
                    bgHtml += `
                        <div class="cp-data-viz-bg" id="${f.bgId}"
                            style="background-image: url('${f.bgImage}')">
                        </div>
                    `;
                }
            });
        }

        const eliteClass = tier.isElite ? 'elite' : '';
        const magneticId = tier.isElite ? 'id="cp-mag-btn"' : '';
        const magneticClass = tier.isElite ? 'cp-magnetic-btn' : 'cp-zone-btn';

        zonesHtml += `
            <div class="cp-zone ${eliteClass}" id="cp-zone-${num}" data-price="${tier.price}">
                <div class="cp-zone-header">${num}. ${tier.title}</div>
                <div class="cp-zone-price">${tier.price}<span class="cp-zone-price-cents">.00</span></div>
                <p class="cp-zone-desc">${tier.desc}</p>
                
                ${featuresHtml}
                
                <a href="/pages/membership.html" class="${magneticClass}" ${magneticId}>${tier.btnText} ${!tier.isElite ? '&rarr;' : ''}</a>
            </div>
        `;
    });

    navContainer.innerHTML = navHtml;
    bgContainer.innerHTML = bgHtml;
    zonesContainer.innerHTML = zonesHtml;
}
