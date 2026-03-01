async function p(s){try{const e=await fetch(`/src/assets/data/${s}.json`);if(!e.ok)throw new Error("Data not found");return await e.json()}catch(e){return console.error(`Error fetching ${s}:`,e),[]}}async function H(s){const e=document.getElementById(s);if(!e)return;const i=await p("dummy-trainers");if(e.innerHTML="",i.length===0){e.innerHTML='<div class="empty-state"><h3>Our Elite Roster Core is Building Up!</h3><p>Stay tuned for updates.</p></div>';return}i.forEach(n=>{const a=document.createElement("div");a.className="bento-card gsap-bento-card",a.innerHTML=`
            ${n.image?`<img src="${n.image}" alt="${n.name}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 4px; margin-bottom: 1rem;">`:""}
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h3>${n.name}</h3>
                <span style="background: rgba(249, 115, 22, 0.1); color: var(--accent-secondary); padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">Elite</span>
            </div>
            <p class="text-accent" style="display: flex; align-items: center; gap: 0.5rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                ${n.specialty}
            </p>
            <p style="margin-top: 1rem; color: var(--text-secondary);">${n.bio}</p>
        `,e.appendChild(a)})}async function M(s){const e=document.getElementById(s);if(!e)return;const i=await p("dummy-zones");if(i.length===0){e.innerHTML='<div class="empty-state"><h3>Zones Undefined</h3><p>Please update dummy-zones.json</p></div>';return}e.innerHTML="",i.forEach(n=>{const a=document.createElement("div");a.className="bento-card c2-card",a.style.flex="1 1 350px",a.style.maxWidth="450px",a.style.minWidth="300px";let r="";n.specs.forEach(o=>{r+=`<div>${o}</div>`}),a.innerHTML=`
            <img src="${n.image}" alt="${n.name}" class="c2-img">
            <div class="c2-content">
                <h3 class="c2-title">${n.name}</h3>
                <div class="c2-details">
                    ${r}
                </div>
            </div>
        `,e.appendChild(a)})}async function T(){const s=document.getElementById("pricing-nav-container"),e=document.getElementById("cp-bg"),i=document.getElementById("pricing-zones-container");if(!s||!e||!i)return;const n=await p("dummy-pricing");if(n.length===0){i.innerHTML='<div class="empty-state"><h3>Pricing Data Missing</h3></div>';return}s.innerHTML="",e.innerHTML="",i.innerHTML="";let a="",r="",o="";n.forEach((t,m)=>{const l=String(m+1).padStart(2,"0");a+=`
            <li class="cp-nav-item ${m===0?"active":""}" id="cp-nav-${l}">
                ${l}. ${t.title}
            </li>
        `;let g="";if(t.isElite&&t.matrixFeatures){const u=Math.ceil(t.matrixFeatures.length/2),y=t.matrixFeatures.slice(0,u),b=t.matrixFeatures.slice(u),h=c=>c.map(d=>`<span class="cp-matrix-item" ${d.bgId?`data-bg="${d.bgId}"`:""}>${d.text}</span>`).join("");g=`
                <div class="cp-elite-features">
                    <div class="cp-elite-feature-col">
                        ${h(y)}
                    </div>
                    <div class="cp-elite-feature-col">
                        ${h(b)}
                    </div>
                </div>
            `,t.matrixFeatures.forEach(c=>{c.bgId&&c.bgImage&&(r+=`
                        <div class="cp-data-viz-bg" id="${c.bgId}"
                            style="background-image: url('${c.bgImage}')">
                        </div>
                    `)})}const v=t.isElite?"elite":"",$=t.isElite?'id="cp-mag-btn"':"",f=t.isElite?"cp-magnetic-btn":"cp-zone-btn";o+=`
            <div class="cp-zone ${v}" id="cp-zone-${l}" data-price="${t.price}">
                <div class="cp-zone-header">${l}. ${t.title}</div>
                <div class="cp-zone-price">${t.price}<span class="cp-zone-price-cents">.00</span></div>
                <p class="cp-zone-desc">${t.desc}</p>
                
                ${g}
                
                <a href="/pages/membership.html" class="${f}" ${$}>${t.btnText} ${t.isElite?"":"&rarr;"}</a>
            </div>
        `}),s.innerHTML=a,e.innerHTML=r,i.innerHTML=o}export{T as a,H as b,M as r};
