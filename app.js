const grid = document.getElementById('status-grid');

function renderCards() {
    grid.innerHTML = ''; 
    sites.forEach((site, index) => {
        const card = document.createElement('a');
        card.className = 'card';
        card.id = `card-${index}`;
        
        card.href = site.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="site-name">${site.name}</div>
                    <div class="site-url">${site.url}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </div>
            <div class="status-badge status-checking" id="badge-${index}">
                <span class="dot"></span>
                <span id="text-${index}">Checking...</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

async function checkAllSites() {
    sites.forEach((site, index) => {
        const badge = document.getElementById(`badge-${index}`);
        const text = document.getElementById(`text-${index}`);
        if(badge && text) {
            badge.className = 'status-badge status-checking';
            text.innerText = 'Checking...';
        }
    });

    sites.forEach((site, index) => {
        checkStatus(site.url, index);
    });
}

async function checkStatus(url, index) {
    const badge = document.getElementById(`badge-${index}`);
    const text = document.getElementById(`text-${index}`);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, { 
            method: 'GET',
            signal: controller.signal,
            redirect: 'follow' // Explicitly tell fetch to follow redirects
        });
        
        clearTimeout(timeoutId);

        // Check if status is between 200 and 399 (inclusive)
        if (response.status >= 200 && response.status < 400) {
            updateUI(badge, text, 'UP');
        } else {
            updateUI(badge, text, 'DOWN', `Status: ${response.status}`);
        }

    } catch (error) {
        console.error(`Error checking ${url}:`, error);
        updateUI(badge, text, 'DOWN', 'Network Error / CORS');
    }
}

function updateUI(badgeElement, textElement, status, detail) {
    if (status === 'UP') {
        badgeElement.className = 'status-badge status-up';
        textElement.innerText = 'Operational';
    } else {
        badgeElement.className = 'status-badge status-down';
        textElement.innerText = detail || 'System Down';
    }
}

renderCards();
checkAllSites();