// Scramble Effect Logic
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
        console.log('TextScramble initialized for:', el);
    }

    setText(newText) {
        console.log('TextScramble.setText called with:', newText);
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 80);
            const end = start + Math.floor(Math.random() * 80);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// System Map Data & Logic
const nodes = [
    // Center
    { id: 'center', type: 'center', label: 'Eric Swasey', title: 'AI Systems Builder', x: 0, y: 0 },

    // Inner Ring: Capabilities (Radius: 250px)
    // Inner Ring: Capabilities (Radius: 250px)
    {
        id: 'cap1', type: 'capability', label: 'Customer Signal\nSystems', angle: 225,
        data: {
            title: 'Customer Signal Systems',
            description: 'Designing systems that turn raw customer feedback into structured signal.',
            bullets: [
                'Survey architecture and design',
                'Qualitative theme extraction',
                'Sentiment and priority weighting',
                'Mission-aligned feedback modeling'
            ]
        }
    },
    {
        id: 'cap2', type: 'capability', label: 'AI Product\nDesign', angle: 315,
        data: {
            title: 'AI Product Design',
            description: 'Building AI products that are usable, explainable, and outcome-driven.',
            bullets: [
                'Prompt logic and workflow design',
                'Human-in-the-loop systems',
                'UX for AI interaction',
                'Structured output frameworks'
            ]
        }
    },
    {
        id: 'cap3', type: 'capability', label: 'Operational\nAutomation', angle: 45,
        data: {
            title: 'Operational Automation',
            description: 'Automating workflows to reduce friction and increase clarity.',
            bullets: [
                'Workflow automation',
                'AI-assisted task execution',
                'Process optimization',
                'Cross-tool integrations'
            ]
        }
    },
    {
        id: 'cap4', type: 'capability', label: 'Insight to Impact\nFrameworks', angle: 135,
        data: {
            title: 'Insight to Impact Frameworks',
            description: 'Translating analysis into clear, prioritized action.',
            bullets: [
                'Prioritization models',
                'Impact scoring',
                'Decision mapping',
                'Action-ready reporting'
            ]
        }
    },

    // Outer Ring: Projects (Radius: 450px)
    {
        id: 'proj1', type: 'project', label: 'PointTaken', angle: 200,
        data: {
            title: 'PointTaken',
            problem: 'Survey completion rates were dropping due to fatigue and poor UX.',
            signal: 'User drop-off points and open-ended feedback analysis.',
            system: 'Context-aware AI survey engine that adapts questions in real-time.',
            impact: '35% increase in completion rates; 2x improvement in data quality.',
            stack: ['Next.js', 'OpenAI API', 'Postgres', 'Tailwind']
        }
    },
    {
        id: 'proj2', type: 'project', label: 'RoleFit', angle: 340,
        data: {
            title: 'RoleFit',
            problem: 'Recruiters spent 80% of time screening unqualified candidates.',
            signal: 'Resume data points vs. job description requirements.',
            system: 'Semantic matching algorithm scoring candidates on potential fit.',
            impact: 'Reduced screening time by 60%; improved candidate placement rate.',
            stack: ['Python', 'FastAPI', 'Vector DB', 'React']
        }
    },
    {
        id: 'proj3', type: 'project', label: 'DayWell', angle: 20,
        data: {
            title: 'DayWell',
            problem: 'Users struggled to build consistent wellness habits.',
            signal: 'Daily activity logs and mood tracking patterns.',
            system: 'Personalized nudge engine based on behavioral psychology.',
            impact: 'Active daily users grew by 40% in 3 months.',
            stack: ['React Native', 'Node.js', 'Firebase', 'ML Kit']
        }
    },
    {
        id: 'proj4', type: 'project', label: 'Pingful', angle: 160,
        data: {
            title: 'Pingful',
            problem: 'Customer support costs were skyrocketing with scale.',
            signal: 'Support ticket transcripts and call logs.',
            system: 'Hybrid AI/Human voice bot handling tier-1 queries.',
            impact: '$200k annual savings; reduced wait times by 90%.',
            stack: ['Twilio', 'GPT-4', 'Google Cloud', 'Python']
        }
    }
];

const links = [
    // Center to Capabilities
    ['center', 'cap1'],
    ['center', 'cap2'],
    ['center', 'cap3'],
    ['center', 'cap4'],

    // Projects to Capabilities
    ['proj1', 'cap1'], // PointTaken -> Signal
    ['proj1', 'cap2'], // PointTaken -> Design
    ['proj2', 'cap2'], // RoleFit -> Design
    ['proj2', 'cap3'], // RoleFit -> Automation
    ['proj3', 'cap2'], // DayWell -> Design
    ['proj3', 'cap3'], // DayWell -> Automation
    ['proj4', 'cap3'], // Pingful -> Automation
    ['proj4', 'cap1']  // Pingful -> Signal
];

document.addEventListener('DOMContentLoaded', () => {
    initSystemMap();
    initParallax();
    initPanel();
    initTheme();
});

function initSystemMap() {
    const mapContainer = document.getElementById('system-map');
    const nodesLayer = document.getElementById('nodes-layer');
    const connectionsLayer = document.getElementById('connections-layer');

    // Determine radii based on screen size
    const isMobile = window.innerWidth <= 900;

    const containerRect = mapContainer.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    // Responsive Radii
    const minDim = Math.min(containerRect.width, containerRect.height);
    // Use smaller of: fixed max or percentage of view
    // Inner: Max 300px, or 30% of min dimension (Zoomed in)
    const innerRadius = isMobile ? 150 : Math.min(300, minDim * 0.30);
    // Outer: Max 550px, or 55% of min dimension
    const outerRadius = isMobile ? 280 : Math.min(550, minDim * 0.55);

    // 1. Calculate Positions
    nodes.forEach(node => {
        if (node.type === 'center') {
            node.x = centerX;
            node.y = centerY;
        } else {
            const r = node.type === 'capability' ? innerRadius : outerRadius;
            const theta = (node.angle * Math.PI) / 180; // Degrees to Radians
            node.x = centerX + r * Math.cos(theta);
            node.y = centerY + r * Math.sin(theta);
        }
    });

    // 2. Render Links (SVG)
    connectionsLayer.innerHTML = ''; // Clear existing
    links.forEach(([sourceId, targetId]) => {
        const source = nodes.find(n => n.id === sourceId);
        const target = nodes.find(n => n.id === targetId);

        if (source && target) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', source.x);
            line.setAttribute('y1', source.y);
            line.setAttribute('x2', target.x);
            line.setAttribute('y2', target.y);
            line.classList.add('connection-line');
            line.dataset.source = sourceId;
            line.dataset.target = targetId;
            connectionsLayer.appendChild(line);
        }
    });

    // 3. Render Nodes (DOM)
    nodesLayer.innerHTML = ''; // Clear existing
    nodes.forEach(node => {
        const el = document.createElement('div');
        el.classList.add('node', `${node.type}-node`);
        el.dataset.id = node.id;
        el.style.left = `${node.x}px`;
        el.style.top = `${node.y}px`;

        // Content
        // Content
        if (node.type === 'center') {
            el.innerHTML = `<img src="headshot2.webp" alt="${node.label}" class="center-img">`;
            el.classList.add('has-image');
        } else {
            const span = document.createElement('span');
            span.innerHTML = node.label.replace(/\n/g, '<br>');
            el.appendChild(span);

            // Scramble Effect for Projects
            if (node.type === 'project') {
                const fx = new TextScramble(span);
                el.addEventListener('mouseenter', () => {
                    fx.setText(node.label);
                });
            }
        }

        // Event Listeners
        el.addEventListener('mouseenter', () => handleNodeHover(node.id));
        el.addEventListener('mouseleave', clearHover);

        // Click to Open Panel (All nodes)
        // Only open if not dragged
        el.addEventListener('click', (e) => {
            if (el.dataset.hasDragged === 'true') {
                // Reset flag and ignore click
                el.dataset.hasDragged = 'false';
                return;
            }

            if (node.type === 'capability') {
                e.stopPropagation(); // Prevent closing immediately
                showTooltip(node, el);
            } else {
                openProjectPanel(node);
            }
        });

        // Make Draggable
        makeNodeDraggable(el, node);

        nodesLayer.appendChild(el);
    });

    // Initialize Scramble on "AI Systems Builder" (Left Panel)
    const roleEl = document.querySelector('.role');
    if (roleEl) {
        const fx = new TextScramble(roleEl);
        // Scramble on load
        fx.setText('AI Systems Builder');

        // Scramble on hover
        roleEl.addEventListener('mouseenter', () => {
            fx.setText('AI Systems Builder');
        });
    }

    // Initialize Feedback
    initFeedback();
}

function showTooltip(node, element) {
    // Remove existing
    const existing = document.querySelector('.framework-tooltip');
    if (existing) existing.remove();

    if (!node.data) return;

    const tooltip = document.createElement('div');
    tooltip.classList.add('framework-tooltip');

    let bulletsHtml = '';
    if (node.data.bullets) {
        bulletsHtml = `<ul>${node.data.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`;
    }

    tooltip.innerHTML = `
        <h3>${node.data.title}</h3>
        <p>${node.data.description}</p>
        ${bulletsHtml}
    `;

    document.body.appendChild(tooltip);

    // Positioning
    const rect = element.getBoundingClientRect();

    // Default: Top Right
    let top = rect.top;
    let left = rect.right + 20;

    // Adjust if off screen
    if (left + 300 > window.innerWidth) {
        left = rect.left - 320; // Show on left
    }

    if (top + 200 > window.innerHeight) {
        top = window.innerHeight - 220;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;

    // Animate In
    requestAnimationFrame(() => {
        tooltip.classList.add('visible');
    });

    // Close on click outside
    setTimeout(() => {
        const closeHandler = (e) => {
            if (!tooltip.contains(e.target) && e.target !== element) {
                tooltip.classList.remove('visible');
                setTimeout(() => tooltip.remove(), 200);
                window.removeEventListener('click', closeHandler);
            }
        };
        window.addEventListener('click', closeHandler);
    }, 10);
}

function initFeedback() {
    const input = document.getElementById('feedback-input');
    const container = document.getElementById('feedback-container');

    if (!input) return;

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const text = input.value.trim();
            if (!text) return;

            // Loading State
            input.disabled = true;
            container.style.opacity = '0.7';
            const originalPlaceholder = input.placeholder;
            input.placeholder = 'Sending...';
            input.value = '';

            // Mock Send (Replace with specific API endpoint when available)
            console.log('Feedback submitted:', text);

            // Success State
            setTimeout(() => {
                input.placeholder = 'Sent to Pingful!';

                // Reset
                setTimeout(() => {
                    input.disabled = false;
                    container.style.opacity = '1';
                    input.placeholder = originalPlaceholder;
                    input.focus();
                }, 2000);
            }, 800);
        }
    });
}

function makeNodeDraggable(el, nodeData) {
    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;

    el.addEventListener('mousedown', (e) => {
        isDragging = true;
        el.dataset.hasDragged = 'false'; // Reset
        startX = e.clientX;
        startY = e.clientY;

        // Get current visual position (using data model for accuracy)
        initialLeft = nodeData.x;
        initialTop = nodeData.y;

        el.classList.add('grabbing');
        document.body.style.cursor = 'grabbing';

        e.preventDefault(); // Prevent text selection
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // Threshold to consider it a drag (vs a sloppy click)
        if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
            el.dataset.hasDragged = 'true';
        }

        // Update Data Model
        nodeData.x = initialLeft + deltaX;
        nodeData.y = initialTop + deltaY;

        // Update Node DOM
        el.style.left = `${nodeData.x}px`;
        el.style.top = `${nodeData.y}px`;

        // Update Connections
        updateNodeConnections(nodeData.id, nodeData.x, nodeData.y);
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            el.classList.remove('grabbing');
            document.body.style.cursor = '';
        }
    });
}

function updateNodeConnections(nodeId, x, y) {
    // Update lines where this node is source
    document.querySelectorAll(`.connection-line[data-source="${nodeId}"]`).forEach(line => {
        line.setAttribute('x1', x);
        line.setAttribute('y1', y);
    });

    // Update lines where this node is target
    document.querySelectorAll(`.connection-line[data-target="${nodeId}"]`).forEach(line => {
        line.setAttribute('x2', x);
        line.setAttribute('y2', y);
    });
}

// Interaction Logic
function handleNodeHover(activeId) {
    const container = document.querySelector('.system-map-container');
    container.classList.add('has-hover');

    // Find connected nodes
    const relatedIds = new Set([activeId]);
    const relatedLinks = [];

    links.forEach(([source, target]) => {
        if (source === activeId || target === activeId) {
            relatedIds.add(source);
            relatedIds.add(target);
            relatedLinks.push({ source, target });
        }
    });

    // Apply Highlight Classes
    document.querySelectorAll('.node').forEach(el => {
        if (relatedIds.has(el.dataset.id)) {
            el.classList.add('highlight');
            el.classList.remove('dimmed');
        } else {
            el.classList.add('dimmed');
            el.classList.remove('highlight');
        }
    });

    document.querySelectorAll('.connection-line').forEach(line => {
        const s = line.dataset.source;
        const t = line.dataset.target;
        if ((s === activeId || t === activeId)) {
            line.classList.add('highlight');
        } else {
            line.classList.remove('highlight');
        }
    });
}

function clearHover() {
    const container = document.querySelector('.system-map-container');
    container.classList.remove('has-hover');

    document.querySelectorAll('.node, .connection-line').forEach(el => {
        el.classList.remove('highlight', 'dimmed');
    });
}

// Parallax Logic
function initParallax() {
    const container = document.querySelector('.system-map-container');
    const map = document.getElementById('system-map');

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || window.innerWidth <= 900) return;

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        // Tilt range: -6deg to +6deg
        const lean = 6;
        const rotateY = (x - 0.5) * lean * 2; // Left/Right tilt
        const rotateX = (0.5 - y) * lean * 2; // Up/Down tilt (inverted)

        map.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
}

// Panel Logic
// Gallary Data Source
const galleryData = {
    'proj1': { // PointTaken
        header: {
            title: 'PointTaken',
            subtitle: 'Intelligent survey engine.',
            meta: 'Prototype • 2024'
        },
        cards: [
            // Text: Problem (Top Left)
            { type: 'text', title: 'Problem', titleColor: 'orange', content: 'Static surveys have high drop-off rates and low data quality.', x: 60, y: 18, rotate: -2 },

            // Visual: Live Preview (Top Right)
            { type: 'iframe', src: 'https://survey-pv1.vercel.app', label: 'Live Preview', rotate: 2, x: 84, y: 18 },

            // Text: Solution (Center Right)
            { type: 'text', title: 'Solution', content: 'An AI-driven engine that adapts questions based on previous answers.', x: 72, y: 48, rotate: 2 },

            // Text: Stack (Bottom Left)
            { type: 'text', title: 'Stack', titleColor: 'orange', content: 'Next.js · OpenAI API · PostgreSQL', x: 60, y: 78, rotate: -1 },

            // Video: (Bottom Right)
            { type: 'video', src: 'pointtaken_backend.mp4', label: '', rotate: 4, x: 84, y: 78 }
        ]
    },
    'proj2': { // RoleFit
        header: {
            title: 'RoleFit',
            subtitle: 'Semantic candidate matching.',
            meta: 'Internal Tool • 2023'
        },
        cards: [
            // Text: Signal (Top Left)
            { type: 'text', title: 'Signal', titleColor: 'orange', content: 'Resume data points vs. Job Description requirements.', x: 60, y: 18, rotate: 2 },

            // Visual: Live Preview (Top Right)
            { type: 'iframe', src: 'https://rolefit-murex.vercel.app', label: 'Live Preview', rotate: -2, x: 84, y: 18 },

            // Text: System (Center)
            { type: 'text', title: 'System', content: 'Vector embeddings match candidates to roles based on semantic meaning.', x: 72, y: 48, rotate: -1 },

            // Text: Impact (Bottom Left)
            { type: 'text', title: 'Impact', titleColor: 'orange', content: 'Reduced initial screening time by 60%.', x: 60, y: 78, rotate: 2 },

            // Visual: Demo Video (Bottom Right)
            { type: 'video', src: 'Demo.mp4', label: '', rotate: -3, x: 84, y: 78 }
        ]
    },
    'proj3': { // DayWell
        header: {
            title: 'DayWell',
            subtitle: 'Habit formation companion.',
            meta: 'Mobile App • 2023'
        },
        cards: [
            // Under Construction GIF
            {
                type: 'image',
                bg: 'url(under-construction.gif)',
                label: 'Coming Soon',
                x: 72,
                y: 50,
                rotate: 0
            }
        ]
    },
    'center': { // Eric Swasey
        header: {
            title: 'Eric Swasey',
            subtitle: 'AI Systems Builder',
            meta: 'Brooklyn, NY'
        },
        cards: [
            {
                type: 'text',
                title: 'Experience',
                titleColor: 'orange', // Accent
                content: '20+ years leading Customer Experience teams and operational systems.',
                rotate: -2,
                x: 60,
                y: 18
            },
            {
                type: 'text',
                title: 'Evolution',
                content: 'Now building AI-native products that turn signal into structured insight.',
                rotate: 2,
                x: 60,
                y: 78
            },
            {
                type: 'text',
                title: 'Focus',
                titleColor: 'orange', // Accent
                content: 'Designing systems that translate feedback into action.',
                rotate: -1,
                x: 84,
                y: 48
            }
        ]
    },
    'proj4': { // Pingful
        header: {
            title: 'Pingful',
            subtitle: 'Enterprise uptime monitoring.',
            meta: 'SaaS • 2024'
        },
        cards: [
            // Text: Overview (Top Left)
            { type: 'text', title: 'Overview', titleColor: 'orange', content: 'Send smart prompts. Gather signal. Stay aligned.', x: 60, y: 18, rotate: -2 },

            // Visual: Live Preview (Top Right)
            { type: 'iframe', src: 'https://pingful.vercel.app', label: 'Live Preview', rotate: 2, x: 84, y: 18 },

            // Text: Audience (Center)
            { type: 'text', title: 'Audience', content: 'Built for teams, founders, and operators who need fast, meaningful feedback.', x: 72, y: 48, rotate: 1 },

            // Text: Stack (Bottom Left)
            { type: 'text', title: 'Stack', titleColor: 'orange', content: 'Next.js · Supabase · LLM-powered communication workflows', x: 60, y: 78, rotate: 3 },

            // Visual: Backend Architecture
            { type: 'image', bg: 'url(backend.webp)', label: 'Backend Architecture', rotate: -3, x: 84, y: 78 }
        ]
    }
};

// Panel Logic
function initPanel() {
    const closeBtn = document.getElementById('close-panel');

    // Intercept click for animation
    closeBtn.addEventListener('click', () => {
        // 1. Heal the X (Remove exploded state)
        closeBtn.classList.remove('exploded');

        // 2. Wait for animation, then close
        setTimeout(() => {
            closeProjectPanel();
        }, 200);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        const panel = document.getElementById('detail-panel');
        const isClickInside = panel.contains(e.target);
        const isProjectNode = e.target.closest('.node'); // Updated to allow all nodes to open

        if (panel.classList.contains('open') && !isClickInside && !isProjectNode) {
            closeProjectPanel();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProjectPanel();
    });
}

function openProjectPanel(node) {
    console.log('Opening panel for node:', node.id);
    const panel = document.getElementById('detail-panel');
    const panelContent = document.getElementById('panel-content');

    // Trigger "Explode" animation
    setTimeout(() => {
        const closeBtn = document.getElementById('close-panel');
        if (closeBtn) closeBtn.classList.add('exploded');
    }, 400);

    // Clear previous
    panelContent.innerHTML = '';

    const data = galleryData[node.id];
    console.log('Gallery Data found:', data);

    if (!data) {
        console.warn('No gallery data for node:', node.id);
        // Fallback or return? 
        // If undefined, render fallback placeholder so we know it worked but data is missing
        panelContent.innerHTML = `<div style="padding:40px; color:white;">No data for ${node.id}</div>`;
        panel.classList.add('open');
        return;
    }

    // Header Removed per user request
    // const headerEl = document.createElement('div'); ...
    // panelContent.appendChild(headerEl);

    // Render Gallery Container
    const galleryContainer = document.createElement('div');
    galleryContainer.classList.add('gallery-container');

    // Render Cards
    data.cards.forEach((cardData, index) => {
        const card = createGalleryCard(cardData, index);
        galleryContainer.appendChild(card);
    });

    panelContent.appendChild(galleryContainer);
    panel.classList.add('open');
}

function createGalleryCard(data, index) {
    const card = document.createElement('div');
    card.classList.add('gallery-card', `card-${data.type}`);

    // Positioning
    // We use percentage-based positions from data, or random if missing
    const x = data.x || (Math.random() * 60 + 20);
    const y = data.y || (Math.random() * 60 + 20);
    const rot = data.rotate || (Math.random() * 10 - 5);

    // Set custom property for rotation so CSS keyframes can use it
    card.style.setProperty('--rot', `${rot}deg`);

    // Initial State for Animation (Hidden & Scaled Down)
    card.style.left = `${x}%`;
    card.style.top = `${y}%`;

    // Set initial transform
    // Re-enabled animation: start scaled down and invisible
    card.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0)`;
    card.style.opacity = '0';

    // Content
    if (data.type === 'text' || data.type === 'quote') {
        let contentHtml = '';
        if (data.title) {
            // Add custom color class if specified
            const colorClass = data.titleColor === 'orange' ? ' text-orange' : '';
            contentHtml += `<div class="card-title${colorClass}">${data.title}</div>`;
        }
        contentHtml += `<p>${data.content}</p>`;
        if (data.author) contentHtml += `<span class="author">— ${data.author}</span>`;
        card.innerHTML = contentHtml;

        // Initialize Scramble for Title AFTER adding to DOM
        if (data.title) {
            setTimeout(() => {
                const titleEl = card.querySelector('.card-title');
                if (titleEl) {
                    const fx = new TextScramble(titleEl);
                    fx.setText(data.title);

                    // Optional: Scramble on hover too
                    card.addEventListener('mouseenter', () => {
                        fx.setText(data.title);
                    });
                }
            }, 500 + (index * 100)); // Stagger slightly after pop animation
        }

    } else if (data.type === 'metric') {
        card.innerHTML = `<div class="value">${data.value}</div><div class="label">${data.label}</div>`;
    } else if (data.type === 'iframe') {
        card.classList.add('is-visual'); // Remove padding
        card.style.background = 'transparent'; // Ensure card base doesn't show white rim

        // Scale logic: Card is 280px wide. 
        // We use slightly larger dimensions to ensure "bleed" over edges.
        card.innerHTML = `
            <iframe src="${data.src}" style="
                position: absolute;
                top: -22px;
                left: -14px;
                width: 1100px; 
                height: 800px; 
                border: none; 
                transform: scale(0.28); 
                transform-origin: 0 0; 
                pointer-events: none;
                background: #151920; 
            "></iframe>
            <div style="position:absolute; top:0; left:0; width:100%; height:100%; cursor:grab; z-index:2;"></div>
        `;
    } else if (data.type === 'image') {
        if (data.bg) {
            card.style.background = data.bg;
            card.style.backgroundSize = data.bgSize || 'cover';
            card.style.backgroundPosition = data.bgPosition || 'center'; /* Center the image */
            card.style.backgroundRepeat = 'no-repeat';
            card.classList.add('is-visual');
        }
    } else if (data.type === 'video') {
        card.classList.add('is-visual');
        card.style.overflow = 'hidden';
        card.style.padding = '0';
        card.innerHTML = `
            <video src="${data.src}" autoplay loop muted playsinline style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%; 
                height: 100%; 
                object-fit: cover; 
                display: block;
            "></video>
         `;
        if (data.label) {
            card.innerHTML += `<div class="img-label" style="
                 position: absolute; 
                 bottom: 0; 
                 left: 0; 
                 width: 100%; 
                 padding: 8px 12px; 
                 background: rgba(0,0,0,0.6); 
                 color: white; 
                 font-size: 11px; 
                 font-weight: 600; 
                 text-transform: uppercase;
                 letter-spacing: 0.05em;
             ">${data.label}</div>`;
        }
    }

    // Draggable Logic
    makeGalleryDraggable(card, rot);

    // Trigger Animation
    requestAnimationFrame(() => {
        setTimeout(() => {
            // 1. Elastic Pop-in (Bouncier bezier)
            card.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease';
            card.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(1)`;
            card.style.opacity = '1';

            // 2. Pendulum Wiggle (Activate after entrance)
            setTimeout(() => {
                card.classList.add('wiggle');
                // Randomize wiggle start time so they don't sync
                card.style.animationDelay = `-${Math.random() * 5}s`;
            }, 800);

        }, 150 + (index * 150)); // 3. Waterfall Fade-in (Increased delay)
    });

    return card;
}


function closeProjectPanel() {
    document.getElementById('detail-panel').classList.remove('open');
}

// Handle resize redraw
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initSystemMap, 200);
});

// Theme Logic
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = toggleBtn.querySelector('span');

    // Check saved or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        document.body.classList.add('light-mode');
        icon.innerText = 'dark_mode';
    }

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');

        // Update Icon
        icon.innerText = isLight ? 'dark_mode' : 'light_mode';

        // Save Preference
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}


// Draggable Logic
function makeGalleryDraggable(card, rotation) {
    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;

    card.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        // Get current percentage positions to pixels for smooth drag
        const rect = card.getBoundingClientRect();
        const parentRect = card.parentElement.getBoundingClientRect();

        // Calculate initial offset from center of card
        initialLeft = rect.left - parentRect.left + (rect.width / 2);
        initialTop = rect.top - parentRect.top + (rect.height / 2);

        // Bring to front
        const allCards = document.querySelectorAll('.gallery-card');
        allCards.forEach(c => c.style.zIndex = '10');
        card.style.zIndex = '100';

        // Stop wiggle while dragging
        card.classList.remove('wiggle');

        card.style.cursor = 'grabbing';
        card.style.transition = 'none'; // Instant follow
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        // Apply new transform
        // We use translate to move it relative to its initial position
        // But since we are using left/top %, let's just update transform translate
        // Actually, easier to just update left/top if we convert to px, but let's stick to transform for performance
        // The card is positioned with left/top % and translate(-50%, -50%).
        // We can add the delta to the translate.

        card.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rotation}deg) scale(1.05)`;
    });

    window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;

        // We need to commit the new position so it doesn't snap back
        // But for this "scattered" feel, maybe snapping back IS okay? 
        // No, user wants to move them.
        // To commit, we needs to update left/top to new position and reset translate.

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        const parentRect = card.parentElement.getBoundingClientRect();

        // Convert dx/dy to percentages to update left/top ??
        // Or just leave it translated? Leaving it translated is easier but might get messy if resize.
        // Let's just leave it translated for now as per "scattered" physics usually just letting it drop.

        card.style.cursor = 'grab';
        card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        card.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rotation}deg) scale(1)`;
    });
}
