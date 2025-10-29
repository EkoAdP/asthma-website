// Global variables
let currentSection = 0;
const sections = ['intro', 'cells-basics', 'healthy-airways', 'asthma-effects', 'interactive', 'quiz', 'resources'];
let animationStage = 0;
let matchingPairs = [];
let selectedMatchItems = [];
let quizAnswers = {
    q1: 'b', // Mitochondria
    q2: 'b', // Cell → Tissue → Organ → System
    q3: 'b', // They contract and squeeze
    q4: 'b', // Cilia
    q5: ['a', 'c', 'd'], // Multiple correct answers
    q6: 'b', // Control what enters/leaves
    q7: 'c', // Goblet cells
    q8: 'a', // Controls activities and contains DNA
    q9: 'c', // Drinking water (NOT a trigger)
    q10: 'b' // Tissues become red, swollen, irritated
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initCellInteraction();
    initDragAndDrop();
    updateProgress();
});

// Navigation Functions
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            showSection(targetSection);
        });
    });
    
    // Show first section
    showSection('intro');
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Update navigation active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
    
    // Update current section index
    currentSection = sections.indexOf(sectionId);
    updateProgress();
}

function nextSection() {
    if (currentSection < sections.length - 1) {
        currentSection++;
        showSection(sections[currentSection]);
    }
}

function updateProgress() {
    const progress = ((currentSection + 1) / sections.length) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
}

// ENHANCED INTERACTIVE CELL EXPLORER
let cellTourActive = false;
let cellTourIndex = 0;

// Initialize cell explorer on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('interactive-cell-svg')) {
        initCellExplorer();
    }
});

function initCellExplorer() {
    const organelles = document.querySelectorAll('.cell-organelle');
    
    organelles.forEach(organelle => {
        organelle.addEventListener('click', function() {
            const organelleType = this.getAttribute('data-organelle');
            showOrganelleInfo(organelleType);
            highlightOrganelle(this);
        });
    });
}

function highlightOrganelle(element) {
    // Remove highlight from all organelles
    document.querySelectorAll('.cell-organelle').forEach(org => {
        org.classList.remove('highlighted');
    });
    
    // Add highlight to clicked organelle
    element.classList.add('highlighted');
}

function showOrganelleInfo(organelleType) {
    const infoPanel = document.getElementById('cell-info-panel');
    
    const organelleData = {
        nucleus: {
            title: '🧬 Nucleus - The Control Center',
            icon: '🟣',
            description: 'The nucleus is like the boss or brain of the cell! It\'s the most important organelle because it controls everything the cell does.',
            details: [
                '<strong>What it does:</strong> Contains DNA (your genetic instructions - like a recipe book for making you!)',
                '<strong>How it works:</strong> Sends instructions to other organelles telling them what proteins to make and when',
                '<strong>Protection:</strong> Has a double-layer membrane (nuclear envelope) with tiny pores to control what goes in and out',
                '<strong>Inside:</strong> Contains the nucleolus (dark spot) where ribosomes are made'
            ],
            asthmaConnection: '⚠️ <strong>During an asthma attack:</strong> The nucleus in airway cells gets signals that there\'s a problem. It responds by telling the cell to make inflammation chemicals and proteins to help defend against the trigger. Unfortunately, this defensive response actually makes breathing harder!'
        },
        
        membrane: {
            title: '🛡️ Cell Membrane - The Gatekeeper',
            icon: '🔵',
            description: 'The cell membrane is like a flexible security guard that surrounds and protects the entire cell. It decides what can come in and what must stay out!',
            details: [
                '<strong>Structure:</strong> Made of a double layer of fatty molecules (phospholipids) with proteins embedded in it',
                '<strong>Selective barrier:</strong> Lets helpful things like oxygen, water, and nutrients in, keeps harmful things out',
                '<strong>Communication:</strong> Has special receptor proteins that receive signals from outside the cell',
                '<strong>Flexibility:</strong> Can change shape and even form pockets to bring things inside'
            ],
            asthmaConnection: '⚠️ <strong>During an asthma attack:</strong> Receptors on the cell membrane detect asthma triggers (like pollen or smoke). These receptors send warning signals into the cell, starting the whole inflammatory response. The membrane also becomes more "leaky," allowing inflammation chemicals to escape into the airways!'
        },
        
        mitochondria: {
            title: '⚡ Mitochondria - The Powerhouse',
            icon: '🔴',
            description: 'Mitochondria are the cell\'s power plants! They\'re like tiny batteries that turn food into energy the cell can actually use. You have THOUSANDS of them in each cell!',
            details: [
                '<strong>Energy production:</strong> Convert glucose (sugar) and oxygen into ATP (cellular energy currency)',
                '<strong>Special features:</strong> Have their own DNA and double membranes with folded inner layers (cristae)',
                '<strong>Numbers matter:</strong> Active cells (like muscle or brain cells) have MORE mitochondria because they need more energy',
                '<strong>Fun fact:</strong> Mitochondria were once separate bacteria that joined our cells billions of years ago!'
            ],
            asthmaConnection: '⚠️ <strong>During an asthma attack:</strong> Airway cells are under MAJOR stress! Their mitochondria have to work overtime - like running at full speed - to provide enough energy for the cell to survive, make mucus, release chemicals, and try to fight off the trigger. If they can\'t keep up, the cell can get damaged or even die!'
        },
        
        cytoplasm: {
            title: '💧 Cytoplasm - The Cell\'s Workspace',
            icon: '💧',
            description: 'Cytoplasm is the jelly-like fluid that fills the inside of the cell. It\'s NOT just empty space - it\'s a busy workshop where thousands of chemical reactions happen every second!',
            details: [
                '<strong>Composition:</strong> Mostly water (about 70-80%) plus dissolved salts, nutrients, and proteins',
                '<strong>Function:</strong> Holds all the organelles in place and provides a medium for chemical reactions',
                '<strong>Movement:</strong> Constantly flowing and moving (called cytoplasmic streaming) to distribute nutrients',
                '<strong>Storage:</strong> Stores food molecules, waste products, and building materials the cell needs'
            ],
            asthmaConnection: '⚠️ <strong>During an asthma attack:</strong> The cytoplasm becomes more crowded and chaotic! It fills with stress proteins, inflammation chemicals, and waste products. The normal smooth flow gets disrupted, making it harder for the cell to work properly. Think of it like trying to work in a messy, overcrowded room!'
        },
        
        ribosomes: {
            title: '🏭 Ribosomes - The Protein Factories',
            icon: '🟠',
            description: 'Ribosomes are tiny protein-making machines! They read the instructions from DNA (delivered by RNA messengers) and build proteins piece by piece. Each cell has MILLIONS of them!',
            details: [
                '<strong>What they make:</strong> All proteins the cell needs - from enzymes to structural proteins to signaling molecules',
                '<strong>Size:</strong> Super tiny! They\'re some of the smallest organelles - you need a powerful microscope to see them',
                '<strong>Location:</strong> Can float freely in cytoplasm or attach to another organelle called the endoplasmic reticulum',
                '<strong>Speed:</strong> Can make a complete protein in just seconds to minutes!'
            ],
            asthmaConnection: '⚠️ <strong>During an asthma attack:</strong> Ribosomes go into overdrive! They have to make TONS of proteins quickly - mucus proteins (to trap triggers), inflammation chemicals (to fight invaders), and stress proteins (to help the cell survive). It\'s like a factory switching from normal production to emergency crisis mode!'
        }
    };
    
    const data = organelleData[organelleType];
    
    if (data) {
        let html = `
            <h4>${data.title}</h4>
            <p><strong>${data.description}</strong></p>
            <ul>
                ${data.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
            <div class="asthma-connection">
                ${data.asthmaConnection}
            </div>
        `;
        
        infoPanel.innerHTML = html;
    }
}

// Cell Tour Functionality
const tourSequence = [
    { selector: '#membrane-group', name: 'membrane', duration: 3000 },
    { selector: '#cytoplasm-group', name: 'cytoplasm', duration: 3000 },
    { selector: '#nucleus-group', name: 'nucleus', duration: 3500 },
    { selector: '#mito1-group', name: 'mitochondria', duration: 3500 },
    { selector: '#ribosomes-group', name: 'ribosomes', duration: 3000 }
];

function startCellTour() {
    if (cellTourActive) return;
    
    cellTourActive = true;
    cellTourIndex = 0;
    
    const btn = document.getElementById('tour-btn');
    btn.disabled = true;
    btn.textContent = '🎯 Tour in Progress...';
    
    // Start the tour
    showNextTourStop();
}

function showNextTourStop() {
    if (cellTourIndex >= tourSequence.length) {
        // Tour complete
        completeTour();
        return;
    }
    
    const currentStop = tourSequence[cellTourIndex];
    const element = document.querySelector(currentStop.selector);
    
    if (element) {
        // Highlight the organelle
        highlightOrganelle(element);
        
        // Show its info
        showOrganelleInfo(currentStop.name);
        
        // Move to next stop after duration
        setTimeout(() => {
            cellTourIndex++;
            showNextTourStop();
        }, currentStop.duration);
    } else {
        cellTourIndex++;
        showNextTourStop();
    }
}

function completeTour() {
    cellTourActive = false;
    cellTourIndex = 0;
    
    const btn = document.getElementById('tour-btn');
    btn.disabled = false;
    btn.textContent = '🎯 Start Guided Tour';
    
    // Remove all highlights
    document.querySelectorAll('.cell-organelle').forEach(org => {
        org.classList.remove('highlighted');
    });
    
    // Show completion message
    const infoPanel = document.getElementById('cell-info-panel');
    infoPanel.innerHTML = `
        <h4>✅ Tour Complete!</h4>
        <p><strong>Great job!</strong> You've explored all the major organelles in a cell.</p>
        <p>Now you understand how each part works together and how they're affected during an asthma attack.</p>
        <p class="tip">💡 <strong>Try this:</strong> Click on any organelle again to review its information, or start another tour to reinforce your learning!</p>
    `;
}

// Old cell interaction (keeping for backwards compatibility)
function initCellInteraction() {
    // This function is now handled by initCellExplorer
    initCellExplorer();
}

function showCellInfo(partId) {
    // Legacy function - redirect to new system
    const mapping = {
        'nucleus': 'nucleus',
        'membrane': 'membrane',
        'mitochondria1': 'mitochondria',
        'mitochondria2': 'mitochondria'
    };
    
    const organelleType = mapping[partId] || 'cytoplasm';
    showOrganelleInfo(organelleType);
    
    // Add highlighting effect
    setTimeout(() => {
        infoPanel.classList.remove('active');
    }, 100);
}

// Zoom Levels Functions
function showZoomLevel(level) {
    // Remove active class from all zoom cards
    document.querySelectorAll('.zoom-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to clicked card
    event.currentTarget.classList.add('active');
    
    // Hide all zoom contents
    document.querySelectorAll('.zoom-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected zoom level
    const zoomContent = document.getElementById('zoom-' + level);
    if (zoomContent) {
        zoomContent.classList.add('active');
    }
}

// Asthma Animation Functions
function startAsthmaAnimation() {
    const animateBtn = document.getElementById('animate-btn');
    animateBtn.disabled = true;
    animateBtn.textContent = '▶️ Playing...';
    
    animationStage = 0;
    playAnimationStage();
}

function playAnimationStage() {
    const stages = [
        {
            title: 'Stage 1: Normal Airway',
            description: '✓ Everything is calm and wide open\n✓ Air flows easily through the airway\n✓ Muscles are relaxed\n✓ Thin protective fluid layer\n✓ Breathing feels easy and natural',
            svg: createNormalAirwaySVG()
        },
        {
            title: 'Stage 2: Trigger Detected!',
            description: '⚠️ An asthma trigger enters the airway\n• Could be pollen, smoke, dust, or cold air\n• Your body\'s defense system spots it\n• The body gets ready to respond\n• Airways start preparing to react',
            svg: createTriggerAirwaySVG()
        },
        {
            title: 'Stage 3: Swelling Begins',
            description: '🔴 Guard cells rush in and release chemicals\n• The airway walls start to get puffy\n• Blood vessels expand (inflammation)\n• Tissue becomes red and swollen\n• Airway space starts getting smaller',
            svg: createInflammationAirwaySVG()
        },
        {
            title: 'Stage 4: Muscles Squeeze',
            description: '💪 Smooth muscles around the airway squeeze tight\n• The airway gets much narrower\n• Like squeezing a straw!\n• Muscles contract in response to chemicals\n• Air has less room to flow through',
            svg: createConstrictionAirwaySVG()
        },
        {
            title: 'Stage 5: Too Much Sticky Goop',
            description: '🟢 Special cells make way too much thick, sticky fluid\n• The goop blocks the narrow airway\n• It\'s super thick and hard to cough up\n• The airway is now super narrow\n• Breathing becomes very difficult',
            svg: createMucusAirwaySVG()
        },
        {
            title: 'Stage 6: Asthma Attack',
            description: '🚨 ALL THREE PROBLEMS AT ONCE:\n1. Puffy, swollen walls\n2. Squeezed tight muscles\n3. Full of sticky goop\nReally hard to breathe!\n⚠️ This is an emergency - get help NOW!',
            svg: createAttackAirwaySVG()
        }
    ];
    
    if (animationStage < stages.length) {
        const stage = stages[animationStage];
        document.getElementById('stage-title').textContent = stage.title;
        document.getElementById('stage-description').innerHTML = stage.description.replace(/\n/g, '<br>');
        document.getElementById('animation-stage').innerHTML = stage.svg;
        
        animationStage++;
        setTimeout(playAnimationStage, 4000); // 4 seconds per stage for better readability
    } else {
        const animateBtn = document.getElementById('animate-btn');
        animateBtn.disabled = false;
        animateBtn.textContent = '🔄 Play Again';
    }
}

// SVG Creation Functions for Animation
function createNormalAirwaySVG() {
    return `
        <svg viewBox="0 0 400 350" class="animation-svg">
            <!-- Smooth muscle layer (relaxed) -->
            <circle cx="200" cy="175" r="120" fill="none" stroke="#FFB6C1" stroke-width="8" opacity="0.8"/>
            
            <!-- Airway wall (healthy pink) -->
            <circle cx="200" cy="175" r="110" fill="#FFE4E1" stroke="#FF69B4" stroke-width="4">
                <animate attributeName="r" values="110;113;110" dur="2s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Airway lumen (open space) -->
            <circle cx="200" cy="175" r="85" fill="#FFF8DC"/>
            
            <!-- Happy face emoji (inside but clear) -->
            <text x="200" y="185" text-anchor="middle" font-size="32">😊</text>
            
            <!-- Arrow marker definitions -->
            <defs>
                <marker id="arrowblue" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="#87CEEB"/>
                </marker>
            </defs>
            
            <!-- Airflow indicators -->
            <path d="M 40 80 L 40 130" stroke="#87CEEB" stroke-width="4" stroke-dasharray="8,5" opacity="0.7" marker-end="url(#arrowblue)">
                <animate attributeName="stroke-dashoffset" from="0" to="-13" dur="1s" repeatCount="indefinite"/>
            </path>
            <path d="M 70 90 L 70 140" stroke="#87CEEB" stroke-width="4" stroke-dasharray="8,5" opacity="0.7" marker-end="url(#arrowblue)">
                <animate attributeName="stroke-dashoffset" from="0" to="-13" dur="1.2s" repeatCount="indefinite"/>
            </path>
            <path d="M 330 80 L 330 130" stroke="#87CEEB" stroke-width="4" stroke-dasharray="8,5" opacity="0.7" marker-end="url(#arrowblue)">
                <animate attributeName="stroke-dashoffset" from="0" to="-13" dur="0.9s" repeatCount="indefinite"/>
            </path>
        </svg>
    `;
}

function createTriggerAirwaySVG() {
    return `
        <svg viewBox="0 0 400 350" class="animation-svg">
            <!-- Smooth muscle layer -->
            <circle cx="200" cy="175" r="120" fill="none" stroke="#FFB6C1" stroke-width="8" opacity="0.8"/>
            
            <!-- Airway wall (starting to react) -->
            <circle cx="200" cy="175" r="110" fill="#FFE4E1" stroke="#FF8C8C" stroke-width="4"/>
            
            <!-- Airway lumen -->
            <circle cx="200" cy="175" r="85" fill="#FFF8DC"/>
            
            <!-- Neutral face emoji -->
            <text x="200" y="185" text-anchor="middle" font-size="32">😐</text>
            
            <!-- Trigger particles (pollen/allergens) floating in -->
            <circle cx="120" cy="70" r="10" fill="#FFD700" opacity="0.9" stroke="#FFA500" stroke-width="2">
                <animate attributeName="cy" from="70" to="150" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="170" cy="60" r="8" fill="#FFD700" opacity="0.9" stroke="#FFA500" stroke-width="2">
                <animate attributeName="cy" from="60" to="140" dur="2.3s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="250" cy="65" r="9" fill="#FFD700" opacity="0.9" stroke="#FFA500" stroke-width="2">
                <animate attributeName="cy" from="65" to="145" dur="1.8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="290" cy="75" r="11" fill="#FFD700" opacity="0.9" stroke="#FFA500" stroke-width="2">
                <animate attributeName="cy" from="75" to="155" dur="2.1s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.1s" repeatCount="indefinite"/>
            </circle>
        </svg>
    `;
}

function createInflammationAirwaySVG() {
    return `
        <svg viewBox="0 0 400 350" class="animation-svg">
            <!-- Smooth muscle layer (starting to contract) -->
            <circle cx="200" cy="175" r="125" fill="none" stroke="#FF9EC1" stroke-width="9" opacity="0.9"/>
            
            <!-- Airway wall (inflamed - getting red and puffy) -->
            <circle cx="200" cy="175" r="118" fill="#FFCCCC" stroke="#FF6B6B" stroke-width="4">
                <animate attributeName="r" values="118;120;118" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Airway lumen (getting smaller) -->
            <circle cx="200" cy="175" r="80" fill="#FFF8DC"/>
            
            <!-- Concerned face emoji -->
            <text x="200" y="185" text-anchor="middle" font-size="30">😕</text>
            
            <!-- Immune cells (small red dots) animated -->
            <circle cx="130" cy="150" r="5" fill="#FF0000" opacity="0.8">
                <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="155" cy="165" r="5" fill="#FF0000" opacity="0.8">
                <animate attributeName="r" values="5;7;5" dur="1.2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="245" cy="155" r="5" fill="#FF0000" opacity="0.8">
                <animate attributeName="r" values="5;7;5" dur="0.9s" repeatCount="indefinite"/>
            </circle>
            <circle cx="270" cy="170" r="5" fill="#FF0000" opacity="0.8">
                <animate attributeName="r" values="5;7;5" dur="1.1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="200" cy="240" r="5" fill="#FF0000" opacity="0.8">
                <animate attributeName="r" values="5;7;5" dur="1.3s" repeatCount="indefinite"/>
            </circle>
        </svg>
    `;
}

function createConstrictionAirwaySVG() {
    return `
        <svg viewBox="0 0 400 350" class="animation-svg">
            <!-- Smooth muscle layer (tight and thick) -->
            <circle cx="200" cy="175" r="130" fill="none" stroke="#FF1493" stroke-width="14" opacity="0.9">
                <animate attributeName="r" values="130;128;130" dur="1s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Airway wall (inflamed and constricted) -->
            <circle cx="200" cy="175" r="120" fill="#FF9999" stroke="#FF4444" stroke-width="5"/>
            
            <!-- Airway lumen (much narrower) -->
            <circle cx="200" cy="175" r="65" fill="#FFFFCC"/>
            
            <!-- Worried face emoji -->
            <text x="200" y="185" text-anchor="middle" font-size="28">😰</text>
            
            <!-- Arrow marker definition -->
            <defs>
                <marker id="arrowpink" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="#FF1493"/>
                </marker>
            </defs>
            
            <!-- Squeeze indicators with arrows -->
            <path d="M 50 175 L 90 175" stroke="#FF1493" stroke-width="5" marker-end="url(#arrowpink)"/>
            <path d="M 350 175 L 310 175" stroke="#FF1493" stroke-width="5" marker-end="url(#arrowpink)"/>
        </svg>
    `;
}

function createMucusAirwaySVG() {
    return `
        <svg viewBox="0 0 400 350" class="animation-svg">
            <!-- Smooth muscle layer (very tight) -->
            <circle cx="200" cy="175" r="132" fill="none" stroke="#FF1493" stroke-width="15" opacity="0.9"/>
            
            <!-- Airway wall (very inflamed) -->
            <circle cx="200" cy="175" r="122" fill="#FF9999" stroke="#FF4444" stroke-width="5"/>
            
            <!-- Airway lumen (very narrow) -->
            <circle cx="200" cy="175" r="60" fill="#FFFFCC"/>
            
            <!-- Distressed face emoji -->
            <text x="200" y="185" text-anchor="middle" font-size="28">😫</text>
            
            <!-- Mucus blobs (green, sticky-looking) -->
            <ellipse cx="165" cy="140" rx="18" ry="14" fill="#90EE90" opacity="0.85" stroke="#228B22" stroke-width="2">
                <animate attributeName="ry" values="14;16;14" dur="2s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="240" cy="145" rx="20" ry="17" fill="#90EE90" opacity="0.85" stroke="#228B22" stroke-width="2">
                <animate attributeName="ry" values="17;19;17" dur="1.8s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="200" cy="215" rx="19" ry="15" fill="#90EE90" opacity="0.85" stroke="#228B22" stroke-width="2">
                <animate attributeName="ry" values="15;17;15" dur="2.2s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="160" cy="195" rx="16" ry="12" fill="#90EE90" opacity="0.85" stroke="#228B22" stroke-width="2">
                <animate attributeName="ry" values="12;14;12" dur="1.9s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="245" cy="190" rx="17" ry="13" fill="#90EE90" opacity="0.85" stroke="#228B22" stroke-width="2">
                <animate attributeName="ry" values="13;15;13" dur="2.1s" repeatCount="indefinite"/>
            </ellipse>
        </svg>
    `;
}

function createAttackAirwaySVG() {
    return `
        <svg viewBox="0 0 400 350" class="animation-svg">
            <!-- Smooth muscle layer (maximally constricted) -->
            <circle cx="200" cy="175" r="140" fill="none" stroke="#CC0000" stroke-width="18" opacity="0.95">
                <animate attributeName="stroke-width" values="18;20;18" dur="0.8s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Airway wall (severely inflamed - bright red) -->
            <circle cx="200" cy="175" r="128" fill="#FF9999" stroke="#CC0000" stroke-width="6">
                <animate attributeName="fill" values="#FF9999;#FF6666;#FF9999" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Airway lumen (critically narrow) -->
            <circle cx="200" cy="175" r="45" fill="#FFEEAA"/>
            
            <!-- Very distressed face emoji -->
            <text x="200" y="185" text-anchor="middle" font-size="24">😨</text>
            
            <!-- Lots of mucus everywhere -->
            <ellipse cx="165" cy="145" rx="20" ry="17" fill="#90EE90" opacity="0.9" stroke="#228B22" stroke-width="2"/>
            <ellipse cx="240" cy="150" rx="22" ry="20" fill="#90EE90" opacity="0.9" stroke="#228B22" stroke-width="2"/>
            <ellipse cx="200" cy="210" rx="21" ry="18" fill="#90EE90" opacity="0.9" stroke="#228B22" stroke-width="2"/>
            <ellipse cx="175" cy="190" rx="19" ry="16" fill="#90EE90" opacity="0.9" stroke="#228B22" stroke-width="2"/>
            <ellipse cx="225" cy="185" rx="17" ry="14" fill="#90EE90" opacity="0.9" stroke="#228B22" stroke-width="2"/>
            <ellipse cx="155" cy="165" rx="14" ry="12" fill="#90EE90" opacity="0.9" stroke="#228B22" stroke-width="2"/>
            <ellipse cx="245" cy="175" rx="15" ry="13" fill="#90EE90" opacity="0.9" stroke="#228B22" stroke-width="2"/>
        </svg>
    `;
}

// Drag and Drop Functions
function initDragAndDrop() {
    const draggableItems = document.querySelectorAll('.draggable-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    
    draggableItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.getAttribute('data-value'));
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
    return false;
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    this.classList.remove('drag-over');
    
    const draggedValue = e.dataTransfer.getData('text/html');
    const correctValue = this.getAttribute('data-correct');
    
    // Find the dragged item
    const draggedItem = document.querySelector(`.draggable-item[data-value="${draggedValue}"]`);
    
    if (draggedItem) {
        // Clear the zone first
        const existingItem = this.querySelector('.draggable-item');
        if (existingItem) {
            document.querySelector('.draggable-items').appendChild(existingItem);
        }
        
        // Add item to zone
        this.appendChild(draggedItem);
        this.classList.add('filled');
    }
    
    return false;
}

function checkHierarchy() {
    const dropZones = document.querySelectorAll('.drop-zone');
    let correct = true;
    
    dropZones.forEach(zone => {
        const correctValue = zone.getAttribute('data-correct');
        const placedItem = zone.querySelector('.draggable-item');
        
        if (!placedItem || placedItem.getAttribute('data-value') !== correctValue) {
            correct = false;
        }
    });
    
    const feedback = document.getElementById('hierarchy-feedback');
    feedback.classList.add('show');
    
    if (correct) {
        feedback.className = 'feedback show success';
        feedback.innerHTML = '🎉 Perfect! You got it right! <br><strong>Cell → Tissue → Organ → System</strong> is how your body is organized!';
    } else {
        feedback.className = 'feedback show error';
        feedback.innerHTML = '❌ Not quite right. Try again! <br><em>Hint: Start with the tiniest (Cell) and work your way up to the biggest (System).</em>';
    }
}

// Matching Game Functions
function selectMatchItem(element) {
    const id = element.getAttribute('data-id');
    const match = element.getAttribute('data-match');
    
    // If item is already matched, don't allow re-selection
    if (element.classList.contains('correct')) {
        return;
    }
    
    // Toggle selection
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        selectedMatchItems = selectedMatchItems.filter(item => item.element !== element);
    } else {
        element.classList.add('selected');
        selectedMatchItems.push({
            element: element,
            id: id || null,
            match: match || null
        });
    }
    
    // Check if we have two items selected
    if (selectedMatchItems.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [item1, item2] = selectedMatchItems;
    const feedback = document.getElementById('match-feedback');
    
    // Check if it's a valid match
    if ((item1.id && item2.match && item1.id === item2.match) ||
        (item2.id && item1.match && item2.id === item1.match)) {
        // Correct match!
        item1.element.classList.remove('selected');
        item2.element.classList.remove('selected');
        item1.element.classList.add('correct');
        item2.element.classList.add('correct');
        
        feedback.className = 'match-feedback show success';
        feedback.textContent = '✅ Perfect match! Awesome job!';
        
        // Check if all matches are complete
        setTimeout(() => {
            const allMatched = document.querySelectorAll('.match-item.correct').length === 8;
            if (allMatched) {
                feedback.textContent = '🎉 You did it! You matched all the cell parts with their jobs!';
            }
        }, 1000);
    } else {
        // Incorrect match
        item1.element.classList.add('incorrect');
        item2.element.classList.add('incorrect');
        
        feedback.className = 'match-feedback show error';
        feedback.textContent = '❌ Not a match. Try again!';
        
        setTimeout(() => {
            item1.element.classList.remove('selected', 'incorrect');
            item2.element.classList.remove('selected', 'incorrect');
        }, 1000);
    }
    
    selectedMatchItems = [];
    
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 3000);
}

function resetMatching() {
    const matchItems = document.querySelectorAll('.match-item');
    matchItems.forEach(item => {
        item.classList.remove('selected', 'correct', 'incorrect');
    });
    
    selectedMatchItems = [];
    
    const feedback = document.getElementById('match-feedback');
    feedback.classList.remove('show');
}

// Simulator Functions
function simulateTrigger(triggerType) {
    const simOuter = document.getElementById('sim-outer');
    const simInner = document.getElementById('sim-inner');
    const simEmoji = document.getElementById('sim-emoji');
    const simLabel = document.getElementById('sim-label');
    const simInfo = document.getElementById('simulator-info');
    
    let info = '';
    
    switch(triggerType) {
        case 'pollen':
            simOuter.setAttribute('r', '120');
            simOuter.setAttribute('fill', '#FFCCCC');
            simOuter.setAttribute('stroke', '#FF6B6B');
            simInner.setAttribute('r', '60');
            simInner.setAttribute('fill', '#FFFFCC');
            simEmoji.textContent = '😰';
            simLabel.textContent = 'Pollen Exposure';
            info = '<h4>Pollen Trigger</h4><p><strong>What happens:</strong> Your body\'s defense cells think pollen is dangerous and release chemicals. This makes airways swell up and produce tons of sticky fluid.</p><p><strong>Cell effects:</strong> Airway lining cells get puffy, goblet cells make too much sticky fluid, muscles squeeze tight.</p>';
            break;
            
        case 'exercise':
            simOuter.setAttribute('r', '115');
            simOuter.setAttribute('fill', '#FFE4E1');
            simOuter.setAttribute('stroke', '#FF8C8C');
            simInner.setAttribute('r', '65');
            simInner.setAttribute('fill', '#FFF8DC');
            simEmoji.textContent = '😮‍💨';
            simLabel.textContent = 'Exercise-Induced';
            info = '<h4>Exercise Trigger</h4><p><strong>What happens:</strong> When you breathe fast, it dries out your airways and changes their temperature. This bugs the airway cells.</p><p><strong>Cell effects:</strong> Smooth muscle cells squeeze up because of the dry air, making airways narrower.</p>';
            break;
            
        case 'cold':
            simOuter.setAttribute('r', '118');
            simOuter.setAttribute('fill', '#E6F3FF');
            simOuter.setAttribute('stroke', '#6BA3D4');
            simInner.setAttribute('r', '62');
            simInner.setAttribute('fill', '#F0F8FF');
            simEmoji.textContent = '🥶';
            simLabel.textContent = 'Cold Air';
            info = '<h4>Cold Air Trigger</h4><p><strong>What happens:</strong> Cold air bothers the airways and makes them get narrow.</p><p><strong>Cell effects:</strong> Smooth muscles squeeze to keep heat in, airway tissues get irritated and puffy.</p>';
            break;
            
        case 'smoke':
            simOuter.setAttribute('r', '125');
            simOuter.setAttribute('fill', '#D3D3D3');
            simOuter.setAttribute('stroke', '#696969');
            simInner.setAttribute('r', '50');
            simInner.setAttribute('fill', '#C0C0C0');
            simEmoji.textContent = '😫';
            simLabel.textContent = 'Smoke Exposure';
            info = '<h4>Smoke Trigger</h4><p><strong>What happens:</strong> Smoke bits irritate and hurt airway cells directly.</p><p><strong>Cell effects:</strong> Lots of swelling, damaged tiny hairs can\'t sweep away sticky fluid, goblet cells make extra sticky fluid, muscles squeeze really hard.</p>';
            break;
            
        case 'normal':
            simOuter.setAttribute('r', '100');
            simOuter.setAttribute('fill', '#FFE4E1');
            simOuter.setAttribute('stroke', '#FF69B4');
            simInner.setAttribute('r', '80');
            simInner.setAttribute('fill', '#FFF8DC');
            simEmoji.textContent = '😊';
            simLabel.textContent = 'Normal Airway';
            info = '<p><strong>Back to normal!</strong> In a healthy airway, cells work like a team: thin layer of slippery fluid, relaxed muscles, and normal-sized cells let you breathe easy.</p>';
            break;
    }
    
    simInfo.innerHTML = info;
}

// ENHANCED TRIGGER SIMULATOR
let currentScenario = 0;
let score = 0;
let answered = 0;

const scenarios = [
    {
        situation: "🏠 You're visiting a friend's house, and they have 3 fluffy cats. The cats are running around and you can see cat hair in the air.",
        isTrigger: true,
        correctFeedback: "Excellent! You're absolutely right! 🎉",
        correctExplanation: "Pet dander (tiny flakes of skin) and fur from cats and dogs are common asthma triggers. When you breathe them in, your body's defense system can overreact, causing your airways to swell up and make it hard to breathe.",
        wrongExplanation: "Actually, this IS a trigger! Pet dander (tiny skin flakes) and fur are super common asthma triggers. Many people with asthma have to be careful around furry pets because breathing in the dander makes their airways get narrow and puffy.",
        avatar: "😰",
        breathing: 2,
        severity: "moderate"
    },
    {
        situation: "❄️ It's a cold winter morning (about -10°C) and you're walking to school. Every breath you take feels icy in your throat.",
        isTrigger: true,
        correctFeedback: "That's right! Great thinking! ✨",
        correctExplanation: "Cold air is a sneaky trigger! When you breathe in really cold air, it can irritate your airways and cause the muscles around them to squeeze tight. This is why people with asthma often wear scarves over their nose and mouth in winter!",
        wrongExplanation: "Oops! Cold air IS actually a trigger. When super cold air rushes into your lungs, it bothers the airway tissues and makes the smooth muscles squeeze up. That's why many people with asthma have more trouble breathing in winter!",
        avatar: "🥶",
        breathing: 2,
        severity: "mild"
    },
    {
        situation: "🌸 It's a beautiful spring day and you're playing outside. The weather forecast says the pollen count is very high today, and you can see yellow dust on cars.",
        isTrigger: true,
        correctFeedback: "Perfect! You really know your triggers! 🌟",
        correctExplanation: "High pollen counts are a major trigger for many people with asthma! When you breathe in pollen, your body's immune system can mistake it for something dangerous. This causes inflammation (swelling) in your airways and makes them produce tons of sticky mucus.",
        wrongExplanation: "Actually, high pollen IS a trigger! Even though pollen is natural, your body's defense system can overreact to it. This causes your airways to swell up and fill with sticky goop, making it really hard to breathe.",
        avatar: "😵",
        breathing: 2,
        severity: "moderate"
    },
    {
        situation: "⚽ You're playing soccer on a dusty field. Every time someone kicks the ball or runs by, clouds of dust fly up into the air.",
        isTrigger: true,
        correctFeedback: "Yes! You've got it! 👏",
        correctExplanation: "Dust is definitely a trigger! When you breathe in dust particles, they irritate your airways. Plus, if you're exercising hard at the same time, that's TWO triggers at once (dust + exercise), which can make asthma symptoms even worse!",
        wrongExplanation: "This IS a trigger! Dust particles irritate your airways, and when you combine that with hard exercise (which dries out your airways), you've got a double whammy! That's why it's important to avoid dusty areas when you have asthma.",
        avatar: "😫",
        breathing: 1,
        severity: "severe",
        combination: true
    },
    {
        situation: "🚬 Your neighbor is smoking a cigarette outside, and you can smell the smoke drifting over to where you're standing.",
        isTrigger: true,
        correctFeedback: "Absolutely correct! 💯",
        correctExplanation: "Smoke is one of the WORST asthma triggers! Whether it's from cigarettes, campfires, or burning wood, smoke contains harmful chemicals that directly damage your airway cells. This causes massive inflammation, extra mucus production, and tight squeezing of the airway muscles.",
        wrongExplanation: "This is definitely a trigger! Smoke (from cigarettes, vaping, or fires) is super dangerous for people with asthma. The chemicals in smoke irritate and damage airway cells, causing major swelling and mucus production. Always stay away from smoke!",
        avatar: "😖",
        breathing: 1,
        severity: "severe"
    },
    {
        situation: "📚 You're sitting in your classroom on a normal day. The room temperature is comfortable, the air is clean, and you're just doing your regular schoolwork.",
        isTrigger: false,
        correctFeedback: "Exactly right! Well done! 🎯",
        correctExplanation: "Great job! Not everything is a trigger. Normal, everyday activities in a clean environment are perfectly safe for most people with asthma. It's important to know that you can live a normal life with asthma - you just need to avoid specific triggers and use your medication when needed.",
        wrongExplanation: "Actually, this is NOT a trigger! Normal activities in a clean, comfortable environment are safe. People with asthma can do regular activities just fine - they just need to watch out for specific triggers like pollen, smoke, cold air, or exercise. Don't worry about normal stuff!",
        avatar: "😊",
        breathing: 5,
        severity: "none"
    },
    {
        situation: "🏃‍♀️ It's gym class and you're doing an intense workout. You're running hard, your heart is pounding, and you're breathing fast and deep.",
        isTrigger: true,
        correctFeedback: "Yes! You know your stuff! 🏆",
        correctExplanation: "Exercise can trigger asthma, but here's the good news: with proper medication and preparation, most people with asthma CAN exercise safely! When you breathe hard during exercise, you dry out your airways and cool them down, which can trigger symptoms. That's why athletes with asthma often use their inhaler before exercise.",
        wrongExplanation: "This IS a trigger! Hard exercise makes you breathe fast and deep, which dries out and cools down your airways. This can trigger symptoms. BUT - don't give up on exercise! Many Olympic athletes have asthma. With the right medication before exercise, you can stay active and healthy!",
        avatar: "😮‍💨",
        breathing: 2,
        severity: "moderate"
    }
];

// Initialize simulator on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('scenario-container')) {
        loadScenario();
    }
});

function loadScenario() {
    if (currentScenario >= scenarios.length) {
        showFinalResults();
        return;
    }
    
    const scenario = scenarios[currentScenario];
    
    // Update progress
    updateProgress();
    
    // Reset display
    document.getElementById('scenario-situation').textContent = scenario.situation;
    document.getElementById('feedback-panel').style.display = 'none';
    document.getElementById('scenario-choices').style.display = 'flex';
    
    // Reset avatar
    document.getElementById('avatar-expression').textContent = '🤔';
    document.getElementById('avatar-expression').className = 'avatar-expression';
    updateBreathingMeter(5, 'Easy 🌟');
    
    // Enable buttons
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.disabled = false;
    });
}

function updateProgress() {
    const progressPercent = (currentScenario / scenarios.length) * 100;
    document.getElementById('progress-fill').style.width = progressPercent + '%';
    document.getElementById('progress-text').textContent = `Scenario ${currentScenario + 1} of ${scenarios.length}`;
    document.getElementById('score-display').textContent = `Score: ${score} / ${answered}`;
}

function updateBreathingMeter(level, status) {
    const bars = document.querySelectorAll('.meter-bar');
    bars.forEach((bar, index) => {
        bar.classList.remove('active', 'warning', 'danger');
        if (index < level) {
            if (level <= 2) {
                bar.classList.add('danger');
            } else if (level <= 3) {
                bar.classList.add('warning');
            } else {
                bar.classList.add('active');
            }
        }
    });
    document.querySelector('.meter-status').textContent = status;
}

function makeChoice(userAnswer) {
    const scenario = scenarios[currentScenario];
    const isCorrect = userAnswer === scenario.isTrigger;
    
    answered++;
    if (isCorrect) {
        score++;
    }
    
    // Disable buttons
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.disabled = true;
    });
    
    // Hide choices
    document.getElementById('scenario-choices').style.display = 'none';
    
    // Show feedback
    showFeedback(isCorrect, scenario);
    
    // Update progress
    updateProgress();
}

function showFeedback(isCorrect, scenario) {
    const feedbackPanel = document.getElementById('feedback-panel');
    const feedbackIcon = document.getElementById('feedback-icon');
    const feedbackMessage = document.getElementById('feedback-message');
    const feedbackExplanation = document.getElementById('feedback-explanation');
    
    // Update avatar
    document.getElementById('avatar-expression').textContent = scenario.avatar;
    if (scenario.isTrigger) {
        document.getElementById('avatar-expression').classList.add('struggling');
        updateBreathingMeter(scenario.breathing, scenario.breathing <= 2 ? 'Hard! 😰' : 'Okay 😐');
    } else {
        updateBreathingMeter(5, 'Easy 🌟');
    }
    
    // Update feedback panel
    if (isCorrect) {
        feedbackPanel.classList.remove('incorrect');
        feedbackIcon.textContent = '✅';
        feedbackMessage.textContent = scenario.correctFeedback;
        feedbackExplanation.textContent = scenario.correctExplanation;
    } else {
        feedbackPanel.classList.add('incorrect');
        feedbackIcon.textContent = '❌';
        feedbackMessage.textContent = "Not quite! Let's learn why:";
        feedbackExplanation.textContent = scenario.wrongExplanation;
    }
    
    // Animate airways
    animateAirways(scenario.isTrigger, scenario.severity);
    
    // Show combination trigger info if applicable
    if (scenario.combination && isCorrect) {
        feedbackExplanation.innerHTML += '<br><br><strong>⚠️ COMBINATION TRIGGER ALERT!</strong> When multiple triggers happen at once (like dust + exercise), the effects can be even worse! That\'s why it\'s important to be extra careful in situations with more than one trigger.';
    }
    
    feedbackPanel.style.display = 'block';
}

function animateAirways(isTrigger, severity) {
    const outer = document.getElementById('fb-outer');
    const inner = document.getElementById('fb-inner');
    const emoji = document.getElementById('fb-emoji');
    
    if (!isTrigger) {
        // Normal airways
        outer.setAttribute('r', '70');
        outer.setAttribute('fill', '#FFE4E1');
        outer.setAttribute('stroke', '#FF69B4');
        inner.setAttribute('r', '55');
        inner.setAttribute('fill', '#FFF8DC');
        emoji.textContent = '😊';
    } else {
        // Triggered airways - severity affects animation
        switch(severity) {
            case 'mild':
                outer.setAttribute('r', '75');
                outer.setAttribute('fill', '#FFD4D4');
                inner.setAttribute('r', '50');
                emoji.textContent = '😐';
                break;
            case 'moderate':
                outer.setAttribute('r', '80');
                outer.setAttribute('fill', '#FFAAAA');
                inner.setAttribute('r', '45');
                emoji.textContent = '😰';
                break;
            case 'severe':
                outer.setAttribute('r', '85');
                outer.setAttribute('fill', '#FF8888');
                inner.setAttribute('r', '35');
                emoji.textContent = '😫';
                // Add pulsing animation for severe
                outer.style.animation = 'pulse-danger 1s ease-in-out infinite';
                break;
        }
    }
}

function nextScenario() {
    currentScenario++;
    loadScenario();
}

function showFinalResults() {
    document.getElementById('scenario-container').style.display = 'none';
    const resultsDiv = document.getElementById('final-results');
    resultsDiv.style.display = 'block';
    
    document.getElementById('final-score').textContent = score;
    
    const percentage = (score / scenarios.length) * 100;
    let message = '';
    let badges = [];
    
    if (percentage === 100) {
        message = '🌟 PERFECT SCORE! 🌟<br>You\'re an absolute asthma trigger EXPERT! You got every single question right. You really understand what can trigger asthma and what\'s safe. Amazing work!';
        badges = ['🏆 Perfect Score', '🎓 Trigger Expert', '⭐ All-Star'];
    } else if (percentage >= 85) {
        message = '🎉 EXCELLENT! 🎉<br>You did fantastic! You really understand asthma triggers. You know what to watch out for and what\'s safe. Keep up the great work!';
        badges = ['🏆 Expert Level', '⭐ Super Star'];
    } else if (percentage >= 70) {
        message = '👍 GREAT JOB! 👍<br>You did really well! You understand most asthma triggers. Keep learning and you\'ll be a trigger expert in no time!';
        badges = ['⭐ Great Work', '📚 Quick Learner'];
    } else if (percentage >= 50) {
        message = '😊 GOOD START! 😊<br>You\'re learning! You got some right, but there\'s more to discover about asthma triggers. Try again to improve your score!';
        badges = ['📚 Learning'];
    } else {
        message = '💪 KEEP TRYING! 💪<br>Asthma triggers can be tricky! Don\'t worry - try again and pay close attention to the explanations. You\'ll get better with practice!';
        badges = ['💪 Keep Going'];
    }
    
    document.getElementById('results-message').innerHTML = message;
    
    const badgesContainer = document.getElementById('results-badges');
    badgesContainer.innerHTML = badges.map(badge => `<div class="badge">${badge}</div>`).join('');
}

function restartSimulator() {
    currentScenario = 0;
    score = 0;
    answered = 0;
    
    document.getElementById('final-results').style.display = 'none';
    document.getElementById('scenario-container').style.display = 'block';
    
    loadScenario();
}

function updateSeverity(value) {
    const descriptions = {
        '1': '<strong>Mild trigger:</strong> Airways narrow just a little bit. You might cough or feel slightly short of breath, but it\'s manageable. Usually you can handle this without emergency medication.',
        '2': '<strong>Moderate trigger:</strong> Airways narrow more significantly. You\'ll definitely feel it - harder to breathe, maybe wheezing. This is when you\'d use your rescue inhaler to open up your airways.',
        '3': '<strong>Severe trigger:</strong> Airways narrow a LOT. Breathing becomes very difficult and scary. This is an emergency situation where you need your inhaler right away and might need to get medical help. All three problems happen: swelling, muscle squeezing, AND mucus filling the airways.'
    };
    
    document.getElementById('severity-description').innerHTML = descriptions[value];
    
    // Animate the airways based on severity
    const outer = document.getElementById('fb-outer');
    const inner = document.getElementById('fb-inner');
    const emoji = document.getElementById('fb-emoji');
    
    const sizes = {
        '1': { outer: 75, inner: 50, emoji: '😐' },
        '2': { outer: 80, inner: 45, emoji: '😰' },
        '3': { outer: 85, inner: 35, emoji: '😫' }
    };
    
    const size = sizes[value];
    outer.setAttribute('r', size.outer);
    inner.setAttribute('r', size.inner);
    emoji.textContent = size.emoji;
}

// Quiz Functions
function submitQuiz() {
    let score = 0;
    let totalQuestions = 10;
    let results = [];
    
    // Question 1
    const q1 = document.querySelector('input[name="q1"]:checked');
    if (q1 && q1.value === quizAnswers.q1) {
        score++;
        document.querySelector('[data-question="1"]').classList.add('correct');
        results.push({ q: 1, correct: true });
    } else {
        document.querySelector('[data-question="1"]').classList.add('incorrect');
        results.push({ q: 1, correct: false, answer: 'Mitochondria' });
    }
    
    // Question 2
    const q2 = document.querySelector('input[name="q2"]:checked');
    if (q2 && q2.value === quizAnswers.q2) {
        score++;
        document.querySelector('[data-question="2"]').classList.add('correct');
        results.push({ q: 2, correct: true });
    } else {
        document.querySelector('[data-question="2"]').classList.add('incorrect');
        results.push({ q: 2, correct: false, answer: 'Cell → Tissue → Organ → System' });
    }
    
    // Question 3
    const q3 = document.querySelector('input[name="q3"]:checked');
    if (q3 && q3.value === quizAnswers.q3) {
        score++;
        document.querySelector('[data-question="3"]').classList.add('correct');
        results.push({ q: 3, correct: true });
    } else {
        document.querySelector('[data-question="3"]').classList.add('incorrect');
        results.push({ q: 3, correct: false, answer: 'They contract and squeeze the airways' });
    }
    
    // Question 4
    const q4 = document.querySelector('input[name="q4"]:checked');
    if (q4 && q4.value === quizAnswers.q4) {
        score++;
        document.querySelector('[data-question="4"]').classList.add('correct');
        results.push({ q: 4, correct: true });
    } else {
        document.querySelector('[data-question="4"]').classList.add('incorrect');
        results.push({ q: 4, correct: false, answer: 'Cilia' });
    }
    
    // Question 5 (multiple choice)
    const q5 = Array.from(document.querySelectorAll('input[name="q5"]:checked')).map(cb => cb.value);
    const q5Correct = quizAnswers.q5.every(ans => q5.includes(ans)) && q5.length === quizAnswers.q5.length;
    if (q5Correct) {
        score++;
        document.querySelector('[data-question="5"]').classList.add('correct');
        results.push({ q: 5, correct: true });
    } else {
        document.querySelector('[data-question="5"]').classList.add('incorrect');
        results.push({ q: 5, correct: false, answer: 'Swollen and inflamed, Muscles tighten, Extra mucus produced' });
    }
    
    // Question 6
    const q6 = document.querySelector('input[name="q6"]:checked');
    if (q6 && q6.value === quizAnswers.q6) {
        score++;
        document.querySelector('[data-question="6"]').classList.add('correct');
        results.push({ q: 6, correct: true });
    } else {
        document.querySelector('[data-question="6"]').classList.add('incorrect');
        results.push({ q: 6, correct: false, answer: 'Control what enters and leaves the cell' });
    }
    
    // Question 7
    const q7 = document.querySelector('input[name="q7"]:checked');
    if (q7 && q7.value === quizAnswers.q7) {
        score++;
        document.querySelector('[data-question="7"]').classList.add('correct');
        results.push({ q: 7, correct: true });
    } else {
        document.querySelector('[data-question="7"]').classList.add('incorrect');
        results.push({ q: 7, correct: false, answer: 'Goblet cells' });
    }
    
    // Question 8
    const q8 = document.querySelector('input[name="q8"]:checked');
    if (q8 && q8.value === quizAnswers.q8) {
        score++;
        document.querySelector('[data-question="8"]').classList.add('correct');
        results.push({ q: 8, correct: true });
    } else {
        document.querySelector('[data-question="8"]').classList.add('incorrect');
        results.push({ q: 8, correct: false, answer: 'Controls cell activities and contains DNA' });
    }
    
    // Question 9
    const q9 = document.querySelector('input[name="q9"]:checked');
    if (q9 && q9.value === quizAnswers.q9) {
        score++;
        document.querySelector('[data-question="9"]').classList.add('correct');
        results.push({ q: 9, correct: true });
    } else {
        document.querySelector('[data-question="9"]').classList.add('incorrect');
        results.push({ q: 9, correct: false, answer: 'Drinking water (NOT a trigger)' });
    }
    
    // Question 10
    const q10 = document.querySelector('input[name="q10"]:checked');
    if (q10 && q10.value === quizAnswers.q10) {
        score++;
        document.querySelector('[data-question="10"]').classList.add('correct');
        results.push({ q: 10, correct: true });
    } else {
        document.querySelector('[data-question="10"]').classList.add('incorrect');
        results.push({ q: 10, correct: false, answer: 'When tissues get red, puffy, and irritated' });
    }
    
    // Display results
    displayQuizResults(score, totalQuestions, results);
}

function displayQuizResults(score, total, results) {
    const percentage = (score / total) * 100;
    const resultsDiv = document.getElementById('quiz-results');
    const scoreDisplay = document.getElementById('score-display');
    const resultsDetails = document.getElementById('results-details');
    
    // Show results section
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
    
    // Display score
    let emoji = '';
    let message = '';
    
    if (percentage >= 90) {
        emoji = '🌟';
        message = 'Amazing! You\'re an asthma expert!';
    } else if (percentage >= 80) {
        emoji = '🎉';
        message = 'Great job! You really get it!';
    } else if (percentage >= 70) {
        emoji = '👍';
        message = 'Good work! You\'ve learned tons!';
    } else if (percentage >= 60) {
        emoji = '📚';
        message = 'Not bad! Read through the sections again to do even better!';
    } else {
        emoji = '💪';
        message = 'Keep learning! Go back and review the material, then try again!';
    }
    
    scoreDisplay.innerHTML = `${emoji}<br>${score} / ${total}<br>${percentage.toFixed(0)}%<br>${message}`;
    
    // Display detailed results
    let detailsHTML = '<h4>Your Answers:</h4><ul>';
    results.forEach(result => {
        if (result.correct) {
            detailsHTML += `<li>✅ Question ${result.q}: Correct!</li>`;
        } else {
            detailsHTML += `<li>❌ Question ${result.q}: Incorrect. Answer: ${result.answer}</li>`;
        }
    });
    detailsHTML += '</ul>';
    
    resultsDetails.innerHTML = detailsHTML;
    
    // Disable submit button
    const submitBtn = document.querySelector('.btn-submit-quiz');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Quiz Completed';
}

function retryQuiz() {
    // Reset all selections
    document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
        input.checked = false;
    });
    
    // Remove correct/incorrect classes
    document.querySelectorAll('.quiz-question').forEach(question => {
        question.classList.remove('correct', 'incorrect');
    });
    
    // Hide results
    document.getElementById('quiz-results').style.display = 'none';
    
    // Enable submit button
    const submitBtn = document.querySelector('.btn-submit-quiz');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Quiz';
    
    // Scroll to top of quiz
    document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' });
}

// Scroll progress tracking
window.addEventListener('scroll', function() {
    // Optional: Could add scroll-based progress updates here
});

// Prevent accidental page refresh during quiz
window.addEventListener('beforeunload', function(e) {
    const quizStarted = document.querySelector('input[type="radio"]:checked') || 
                        document.querySelector('input[type="checkbox"]:checked');
    
    if (quizStarted && document.getElementById('quiz').classList.contains('active')) {
        e.preventDefault();
        e.returnValue = 'You have an unfinished quiz. Are you sure you want to leave?';
    }
});

// ====================================
// TRIGGER ANIMATIONS - Part 2
// ====================================

let triggerAnimationTimers = {};

function playTriggerAnimation(triggerType) {
    // Disable button during animation
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = '⏸️ Playing...';
    
    // Clear any existing animation for this trigger
    if (triggerAnimationTimers[triggerType]) {
        clearTimeout(triggerAnimationTimers[triggerType]);
    }
    
    // Get the SVG container
    const svgContainer = document.querySelector(`#${triggerType}-animation svg`);
    
    // Play the appropriate animation sequence
    switch(triggerType) {
        case 'pollen':
            animatePollenTrigger(svgContainer, btn);
            break;
        case 'exercise':
            animateExerciseTrigger(svgContainer, btn);
            break;
        case 'cold':
            animateColdAirTrigger(svgContainer, btn);
            break;
        case 'smoke':
            animateSmokeTrigger(svgContainer, btn);
            break;
        case 'dust':
            animateDustTrigger(svgContainer, btn);
            break;
        case 'pet':
            animatePetDanderTrigger(svgContainer, btn);
            break;
    }
}

// POLLEN TRIGGER ANIMATION
function animatePollenTrigger(container, btn) {
    const stages = [
        {
            delay: 0,
            svg: `
                <g id="stage1">
                    <!-- TOP LABEL - Clear space above -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#FF6B00">You're Outside</text>
                    
                    <!-- Person outdoors -->
                    <circle cx="100" cy="160" r="35" fill="#FFE4C4" stroke="#8B4513" stroke-width="2"/>
                    <circle cx="90" cy="155" r="4" fill="#000"/>
                    <circle cx="110" cy="155" r="4" fill="#000"/>
                    <path d="M 85 170 Q 100 175 115 170" fill="none" stroke="#000" stroke-width="2"/>
                    <text x="100" y="225" text-anchor="middle" font-size="16" fill="#333" font-weight="bold">Person</text>
                    
                    <!-- Pollen particles floating -->
                    <circle cx="220" cy="100" r="8" fill="#FFD700" opacity="0.8" stroke="#FFA500" stroke-width="2">
                        <animateTransform attributeName="transform" type="translate" values="0,0; 10,20; 0,0" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="270" cy="120" r="7" fill="#FFD700" opacity="0.8" stroke="#FFA500" stroke-width="2">
                        <animateTransform attributeName="transform" type="translate" values="0,0; -15,25; 0,0" dur="2.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="320" cy="110" r="9" fill="#FFD700" opacity="0.8" stroke="#FFA500" stroke-width="2">
                        <animateTransform attributeName="transform" type="translate" values="0,0; 12,18; 0,0" dur="2.2s" repeatCount="indefinite"/>
                    </circle>
                    <text x="270" y="75" text-anchor="middle" font-size="18" fill="#FFA500" font-weight="bold">Pollen bits floating</text>
                    
                    <!-- BOTTOM LABEL - Clear space below -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#555">Pollen is everywhere in spring!</text>
                </g>
            `
        },
        {
            delay: 2000,
            svg: `
                <g id="stage2">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#FF6B00">You Breathe In</text>
                    
                    <!-- Pollen entering nose -->
                    <circle cx="100" cy="160" r="35" fill="#FFE4C4" stroke="#8B4513" stroke-width="2"/>
                    <circle cx="90" cy="155" r="4" fill="#000"/>
                    <circle cx="110" cy="155" r="4" fill="#000"/>
                    <path d="M 85 170 Q 100 173 115 170" fill="none" stroke="#000" stroke-width="2"/>
                    
                    <!-- Arrow showing inhalation -->
                    <path d="M 160 160 L 135 160" stroke="#2196F3" stroke-width="4" marker-end="url(#arrowblue)">
                        <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
                    </path>
                    
                    <!-- Pollen particles moving toward person -->
                    <circle cx="180" cy="150" r="8" fill="#FFD700" stroke="#FFA500" stroke-width="2">
                        <animate attributeName="cx" from="280" to="135" dur="1.5s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" from="1" to="0" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="190" cy="165" r="7" fill="#FFD700" stroke="#FFA500" stroke-width="2">
                        <animate attributeName="cx" from="300" to="135" dur="1.8s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" from="1" to="0" dur="1.8s" repeatCount="indefinite"/>
                    </circle>
                    
                    <text x="240" y="120" text-anchor="middle" font-size="18" fill="#2196F3" font-weight="bold">Air flowing in</text>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#555">Pollen goes into your nose and throat</text>
                    
                    <defs>
                        <marker id="arrowblue" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L9,3 z" fill="#2196F3"/>
                        </marker>
                    </defs>
                </g>
            `
        },
        {
            delay: 4000,
            svg: `
                <g id="stage3">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#CC0000">Your Body Fights Back!</text>
                    
                    <!-- Airway with pollen -->
                    <circle cx="200" cy="160" r="85" fill="#FFE4E1" stroke="#FF69B4" stroke-width="3"/>
                    <circle cx="200" cy="160" r="65" fill="#FFF8DC"/>
                    
                    <!-- Pollen particles inside -->
                    <circle cx="180" cy="150" r="7" fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
                    <circle cx="215" cy="165" r="8" fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
                    <circle cx="195" cy="175" r="7" fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
                    
                    <!-- Immune cells appearing -->
                    <circle cx="160" cy="155" r="6" fill="#FF0000" opacity="0.7">
                        <animate attributeName="r" values="0;6;6" dur="1s"/>
                    </circle>
                    <circle cx="230" cy="160" r="6" fill="#FF0000" opacity="0.7">
                        <animate attributeName="r" values="0;6;6" dur="1.2s"/>
                    </circle>
                    <text x="150" y="135" font-size="16" fill="#FF0000" font-weight="bold">Guard cells</text>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#CC0000">Guard cells rush in to attack the pollen</text>
                </g>
            `
        },
        {
            delay: 6000,
            svg: `
                <g id="stage4">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#CC0000">⚠️ Hard to Breathe!</text>
                    
                    <!-- Swollen, narrowed airway -->
                    <circle cx="200" cy="160" r="100" fill="#FFCCCC" stroke="#FF6B6B" stroke-width="5">
                        <animate attributeName="r" values="85;100;100" dur="1s"/>
                    </circle>
                    <circle cx="200" cy="160" r="50" fill="#FFFFCC">
                        <animate attributeName="r" values="65;50;50" dur="1s"/>
                    </circle>
                    
                    <!-- Mucus blobs -->
                    <ellipse cx="180" cy="140" rx="15" ry="12" fill="#90EE90" opacity="0.85" stroke="#228B22" stroke-width="2">
                        <animate attributeName="ry" values="0;12;12" dur="1s"/>
                    </ellipse>
                    <ellipse cx="220" cy="175" rx="17" ry="14" fill="#90EE90" opacity="0.85" stroke="#228B22" stroke-width="2">
                        <animate attributeName="ry" values="0;14;14" dur="1.2s"/>
                    </ellipse>
                    
                    <!-- Sad face -->
                    <text x="200" y="168" text-anchor="middle" font-size="28">😰</text>
                    
                    <text x="285" y="150" font-size="16" fill="#FF6B6B" font-weight="bold">Swollen</text>
                    <text x="95" y="175" font-size="16" fill="#228B22" font-weight="bold">Sticky goop</text>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#CC0000">Airways puff up and fill with goop = can't breathe well</text>
                </g>
            `
        }
    ];
    
    animateStages(stages, container, btn, 'pollen');
}

// EXERCISE TRIGGER ANIMATION
function animateExerciseTrigger(container, btn) {
    const stages = [
        {
            delay: 0,
            svg: `
                <g id="stage1">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#1976D2">You're Running Fast! 🏃</text>
                    
                    <!-- Person running -->
                    <circle cx="100" cy="150" r="30" fill="#FFE4C4" stroke="#8B4513" stroke-width="2"/>
                    <circle cx="92" cy="145" r="3" fill="#000"/>
                    <circle cx="108" cy="145" r="3" fill="#000"/>
                    <path d="M 90 158 Q 100 162 110 158" fill="none" stroke="#000" stroke-width="2"/>
                    <line x1="100" y1="180" x2="100" y2="215" stroke="#8B4513" stroke-width="4"/>
                    <line x1="100" y1="190" x2="85" y2="205" stroke="#8B4513" stroke-width="4"/>
                    <line x1="100" y1="190" x2="115" y2="205" stroke="#8B4513" stroke-width="4"/>
                    <line x1="100" y1="215" x2="85" y2="240" stroke="#8B4513" stroke-width="4"/>
                    <line x1="100" y1="215" x2="115" y2="240" stroke="#8B4513" stroke-width="4"/>
                    
                    <!-- Motion lines -->
                    <line x1="70" y1="150" x2="50" y2="150" stroke="#2196F3" stroke-width="3" opacity="0.5">
                        <animate attributeName="x1" values="70;50;70" dur="0.5s" repeatCount="indefinite"/>
                    </line>
                    <line x1="70" y1="165" x2="50" y2="165" stroke="#2196F3" stroke-width="3" opacity="0.5">
                        <animate attributeName="x1" values="70;50;70" dur="0.6s" repeatCount="indefinite"/>
                    </line>
                    
                    <text x="100" y="265" text-anchor="middle" font-size="16" fill="#1976D2" font-weight="bold">Moving fast</text>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#555">Your heart beats fast and you breathe hard</text>
                </g>
            `
        },
        {
            delay: 2000,
            svg: `
                <g id="stage2">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#FF6B00">Airways Getting Dry</text>
                    
                    <!-- Fast breathing visualization -->
                    <circle cx="100" cy="150" r="30" fill="#FFE4C4" stroke="#8B4513" stroke-width="2"/>
                    <circle cx="92" cy="145" r="3" fill="#000"/>
                    <circle cx="108" cy="145" r="3" fill="#000"/>
                    <path d="M 88 158 Q 100 164 112 158" fill="none" stroke="#000" stroke-width="2"/>
                    
                    <!-- Rapid air flow arrows -->
                    <path d="M 140 140 L 165 140" stroke="#87CEEB" stroke-width="4" marker-end="url(#arrowblue)">
                        <animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="indefinite"/>
                    </path>
                    <path d="M 140 160" L 165 160" stroke="#87CEEB" stroke-width="4" marker-end="url(#arrowblue)">
                        <animate attributeName="opacity" values="0;1;0" dur="0.6s" begin="0.2s" repeatCount="indefinite"/>
                    </path>
                    <path d="M 140 125 L 165 125" stroke="#87CEEB" stroke-width="4" marker-end="url(#arrowblue)">
                        <animate attributeName="opacity" values="0;1;0" dur="0.55s" begin="0.4s" repeatCount="indefinite"/>
                    </path>
                    
                    <!-- Airways getting dry -->
                    <circle cx="260" cy="160" r="75" fill="#FFE4E1" stroke="#FF8C8C" stroke-width="3"/>
                    <circle cx="260" cy="160" r="58" fill="#FFF8DC"/>
                    <text x="260" y="168" text-anchor="middle" font-size="22">😮‍💨</text>
                    
                    <text x="180" y="110" font-size="18" fill="#87CEEB" font-weight="bold">Lots of air</text>
                    <text x="260" y="245" text-anchor="middle" font-size="16" fill="#FF8C8C" font-weight="bold">Drying out</text>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#555">Fast air dries out the inside of your airways</text>
                    
                    <defs>
                        <marker id="arrowblue" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L9,3 z" fill="#87CEEB"/>
                        </marker>
                    </defs>
                </g>
            `
        },
        {
            delay: 4000,
            svg: `
                <g id="stage3">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#C71585">Muscles Squeeze!</text>
                    
                    <!-- Airway muscles reacting -->
                    <circle cx="200" cy="160" r="95" fill="none" stroke="#FF1493" stroke-width="12" opacity="0.8">
                        <animate attributeName="r" values="95;90;95" dur="1s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="200" cy="160" r="85" fill="#FFE4E1" stroke="#FF8C8C" stroke-width="3"/>
                    <circle cx="200" cy="160" r="55" fill="#FFF8DC"/>
                    
                    <text x="200" y="168" text-anchor="middle" font-size="24">😰</text>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#C71585">Muscles squeeze to protect the dry airways</text>
                </g>
            `
        }
    ];
    
    animateStages(stages, container, btn, 'exercise');
}

// COLD AIR TRIGGER ANIMATION
function animateColdAirTrigger(container, btn) {
    const stages = [
        {
            delay: 0,
            svg: `
                <g id="stage1">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#1565C0">❄️ Cold Winter Day ❄️</text>
                    
                    <!-- Snowflakes -->
                    <text x="60" y="90" font-size="26" opacity="0.7">❄️</text>
                    <text x="120" y="110" font-size="24" opacity="0.6">❄️</text>
                    <text x="300" y="100" font-size="28" opacity="0.8">❄️</text>
                    <text x="350" y="120" font-size="25" opacity="0.7">❄️</text>
                    
                    <!-- Person -->
                    <circle cx="200" cy="160" r="35" fill="#FFE4C4" stroke="#8B4513" stroke-width="2"/>
                    <circle cx="192" cy="155" r="4" fill="#000"/>
                    <circle cx="208" cy="155" r="4" fill="#000"/>
                    <circle cx="200" cy="165" r="3" fill="#000"/>
                    
                    <!-- Temperature indicator -->
                    <rect x="310" y="150" width="24" height="70" fill="#E3F2FD" stroke="#1976D2" stroke-width="2" rx="12"/>
                    <rect x="315" y="198" width="14" height="18" fill="#1976D2"/>
                    <text x="345" y="190" font-size="16" fill="#1565C0" font-weight="bold">-10°C</text>
                    <text x="325" y="235" text-anchor="middle" font-size="16" fill="#1565C0" font-weight="bold">Freezing!</text>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#555">It's super cold outside!</text>
                </g>
            `
        },
        {
            delay: 2000,
            svg: `
                <g id="stage2">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#1565C0">Cold Air Goes In</text>
                    
                    <!-- Cold air particles -->
                    <circle cx="90" cy="140" r="5" fill="#B3E5FC" stroke="#0277BD" stroke-width="2">
                        <animate attributeName="cx" from="90" to="200" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="100" cy="155" r="5" fill="#B3E5FC" stroke="#0277BD" stroke-width="2">
                        <animate attributeName="cx" from="100" to="200" dur="1.7s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="95" cy="170" r="5" fill="#B3E5FC" stroke="#0277BD" stroke-width="2">
                        <animate attributeName="cx" from="95" to="200" dur="1.6s" repeatCount="indefinite"/>
                    </circle>
                    
                    <!-- Airway -->
                    <circle cx="200" cy="160" r="75" fill="#FFE4E1" stroke="#FF69B4" stroke-width="3"/>
                    <circle cx="200" cy="160" r="58" fill="#E3F2FD"/>
                    <text x="200" y="168" text-anchor="middle" font-size="22">🥶</text>
                    
                    <!-- Cold indicators -->
                    <text x="270" y="115" font-size="22" opacity="0.7">❄️</text>
                    <text x="150" y="120" font-size="20" opacity="0.6">❄️</text>
                    <text x="130" y="190" font-size="18" fill="#0277BD" font-weight="bold">Icy air</text>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#1565C0">Cold air makes your airways cold inside</text>
                </g>
            `
        },
        {
            delay: 4000,
            svg: `
                <g id="stage3">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#C71585">Squeezing to Stay Warm!</text>
                    
                    <!-- Airways reacting to cold -->
                    <circle cx="200" cy="160" r="90" fill="none" stroke="#FF1493" stroke-width="12" opacity="0.8">
                        <animate attributeName="r" values="90;85;90" dur="1s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="200" cy="160" r="80" fill="#E3F2FD" stroke="#6BA3D4" stroke-width="4"/>
                    <circle cx="200" cy="160" r="53" fill="#F0F8FF"/>
                    
                    <!-- Cold + irritation -->
                    <text x="200" y="168" text-anchor="middle" font-size="24">😣</text>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#C71585">Muscles squeeze tight trying to keep you warm</text>
                </g>
            `
        }
    ];
    
    animateStages(stages, container, btn, 'cold');
}

// SMOKE TRIGGER ANIMATION
function animateSmokeTrigger(container, btn) {
    const stages = [
        {
            delay: 0,
            svg: `
                <g id="stage1">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#616161">Smoke Near You</text>
                    
                    <!-- Smoke source -->
                    <rect x="75" y="175" width="50" height="70" fill="#8B4513" stroke="#5D4037" stroke-width="2" rx="6"/>
                    <text x="100" y="265" text-anchor="middle" font-size="22">🔥</text>
                    
                    <!-- Smoke particles rising -->
                    <circle cx="100" cy="145" r="10" fill="#9E9E9E" opacity="0.7">
                        <animate attributeName="cy" from="175" to="60" dur="3s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" from="0.7" to="0.1" dur="3s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="95" cy="125" r="12" fill="#757575" opacity="0.6">
                        <animate attributeName="cy" from="175" to="50" dur="3.5s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" from="0.6" to="0.1" dur="3.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="105" cy="105" r="11" fill="#9E9E9E" opacity="0.7">
                        <animate attributeName="cy" from="175" to="55" dur="3.2s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" from="0.7" to="0.1" dur="3.2s" repeatCount="indefinite"/>
                    </circle>
                    
                    <text x="100" y="90" text-anchor="middle" font-size="18" fill="#757575" font-weight="bold">Smoke clouds</text>
                    
                    <!-- Person -->
                    <circle cx="270" cy="160" r="35" fill="#FFE4C4" stroke="#8B4513" stroke-width="2"/>
                    <circle cx="262" cy="155" r="4" fill="#000"/>
                    <circle cx="278" cy="155" r="4" fill="#000"/>
                    <path d="M 260 170 Q 270 173 280 170" fill="none" stroke="#000" stroke-width="2"/>
                    
                    <text x="270" y="230" text-anchor="middle" font-size="16" fill="#616161" font-weight="bold">Person nearby</text>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#616161">Smoke is floating around</text>
                </g>
            `
        },
        {
            delay: 2000,
            svg: `
                <g id="stage2">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#D32F2F">Smoke Goes Into Lungs</text>
                    
                    <!-- Smoke particles moving toward airways -->
                    <circle cx="130" cy="145" r="8" fill="#757575" opacity="0.8">
                        <animate attributeName="cx" from="110" to="200" dur="1.5s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" from="0.8" to="0.2" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="140" cy="160" r="9" fill="#9E9E9E" opacity="0.7">
                        <animate attributeName="cx" from="110" to="200" dur="1.7s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" from="0.7" to="0.2" dur="1.7s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="135" cy="175" r="7" fill="#757575" opacity="0.8">
                        <animate attributeName="cx" from="110" to="200" dur="1.6s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" from="0.8" to="0.2" dur="1.6s" repeatCount="indefinite"/>
                    </circle>
                    
                    <text x="140" y="125" font-size="18" fill="#757575" font-weight="bold">Bad stuff</text>
                    
                    <!-- Airway -->
                    <circle cx="200" cy="160" r="75" fill="#FFE4E1" stroke="#FF69B4" stroke-width="3"/>
                    <circle cx="200" cy="160" r="58" fill="#D3D3D3"/>
                    
                    <!-- Warning indicators -->
                    <text x="200" y="168" text-anchor="middle" font-size="24">😷</text>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#616161">Smoke hurts the cells in your airways</text>
                </g>
            `
        },
        {
            delay: 4000,
            svg: `
                <g id="stage3">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#CC0000">⚠️ Really Bad Reaction!</text>
                    
                    <!-- Heavily inflamed airway -->
                    <circle cx="200" cy="160" r="105" fill="none" stroke="#CC0000" stroke-width="14" opacity="0.9">
                        <animate attributeName="r" values="105;110;105" dur="1s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="200" cy="160" r="95" fill="#FF9999" stroke="#CC0000" stroke-width="4">
                        <animate attributeName="fill" values="#FF9999;#FF6666;#FF9999" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="200" cy="160" r="45" fill="#C0C0C0"/>
                    
                    <!-- Lots of mucus -->
                    <ellipse cx="180" cy="140" rx="17" ry="14" fill="#90EE90" opacity="0.85" stroke="#228B22" stroke-width="2"/>
                    <ellipse cx="220" cy="175" rx="18" ry="15" fill="#90EE90" opacity="0.85" stroke="#228B22" stroke-width="2"/>
                    <ellipse cx="195" cy="185" rx="16" ry="13" fill="#90EE90" opacity="0.85" stroke="#228B22" stroke-width="2"/>
                    
                    <!-- Damaged cilia indicators -->
                    <line x1="160" y1="130" x2="165" y2="120" stroke="#8B0000" stroke-width="3" opacity="0.7"/>
                    <line x1="240" y1="135" x2="245" y2="125" stroke="#8B0000" stroke-width="3" opacity="0.7"/>
                    <text x="270" y="130" font-size="16" fill="#8B0000" font-weight="bold">Damaged!</text>
                    
                    <text x="200" y="165" text-anchor="middle" font-size="24">😫</text>
                    
                    <text x="115" y="180" font-size="16" fill="#228B22" font-weight="bold">Tons of goop</text>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#CC0000">Huge swelling + tons of sticky goop</text>
                </g>
            `
        }
    ];
    
    animateStages(stages, container, btn, 'smoke');
}

// DUST TRIGGER ANIMATION
function animateDustTrigger(container, btn) {
    const stages = [
        {
            delay: 0,
            svg: `
                <g id="stage1">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#795548">Dusty Place</text>
                    
                    <!-- Dust particles floating -->
                    <circle cx="80" cy="105" r="5" fill="#A1887F" opacity="0.6">
                        <animateTransform attributeName="transform" type="translate" values="0,0; 15,20; 0,0" dur="3s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="120" cy="95" r="6" fill="#8D6E63" opacity="0.7">
                        <animateTransform attributeName="transform" type="translate" values="0,0; -10,25; 0,0" dur="3.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="280" cy="115" r="5" fill="#A1887F" opacity="0.6">
                        <animateTransform attributeName="transform" type="translate" values="0,0; 12,18; 0,0" dur="3.2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="320" cy="100" r="6" fill="#8D6E63" opacity="0.7">
                        <animateTransform attributeName="transform" type="translate" values="0,0; -8,22; 0,0" dur="3.3s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="200" cy="90" r="5" fill="#A1887F" opacity="0.6">
                        <animateTransform attributeName="transform" type="translate" values="0,0; 10,15; 0,0" dur="3.1s" repeatCount="indefinite"/>
                    </circle>
                    
                    <text x="200" y="75" text-anchor="middle" font-size="18" fill="#8D6E63" font-weight="bold">Dust bits floating</text>
                    
                    <!-- Dust mites (microscopic view) -->
                    <ellipse cx="150" cy="210" rx="15" ry="10" fill="#6D4C41" opacity="0.8"/>
                    <circle cx="145" cy="208" r="3" fill="#000"/>
                    <circle cx="155" cy="208" r="3" fill="#000"/>
                    <line x1="135" y1="210" x2="125" y2="215" stroke="#6D4C41" stroke-width="2"/>
                    <line x1="165" y1="210" x2="175" y2="215" stroke="#6D4C41" stroke-width="2"/>
                    <text x="150" y="235" text-anchor="middle" font-size="14" fill="#6D4C41" font-weight="bold">Tiny dust bug</text>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#795548">Dust and tiny bugs are all around</text>
                </g>
            `
        },
        {
            delay: 2000,
            svg: `
                <g id="stage2">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#FF6B00">Dust Goes In Your Nose</text>
                    
                    <!-- Dust particles entering airway -->
                    <circle cx="155" cy="145" r="5" fill="#8D6E63" opacity="0.8">
                        <animate attributeName="cx" from="125" to="200" dur="1.5s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" from="0.8" to="0.2" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="165" cy="160" r="6" fill="#A1887F" opacity="0.7">
                        <animate attributeName="cx" from="135" to="200" dur="1.7s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" from="0.7" to="0.2" dur="1.7s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="160" cy="175" r="5" fill="#8D6E63" opacity="0.8">
                        <animate attributeName="cx" from="130" to="200" dur="1.6s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" from="0.8" to="0.2" dur="1.6s" repeatCount="indefinite"/>
                    </circle>
                    
                    <text x="145" y="130" font-size="18" fill="#8D6E63" font-weight="bold">Moving in</text>
                    
                    <!-- Airway with dust -->
                    <circle cx="200" cy="160" r="78" fill="#FFE4E1" stroke="#FF69B4" stroke-width="3"/>
                    <circle cx="200" cy="160" r="61" fill="#FFF8DC"/>
                    
                    <!-- Dust inside -->
                    <circle cx="190" cy="155" r="5" fill="#8D6E63"/>
                    <circle cx="210" cy="168" r="6" fill="#A1887F"/>
                    <circle cx="195" cy="175" r="5" fill="#8D6E63"/>
                    
                    <text x="200" y="168" text-anchor="middle" font-size="22">😐</text>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#795548">Dust goes into your airways</text>
                </g>
            `
        },
        {
            delay: 4000,
            svg: `
                <g id="stage3">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#CC0000">Your Body Goes Crazy!</text>
                    
                    <!-- Swollen airway -->
                    <circle cx="200" cy="160" r="100" fill="#FFCCCC" stroke="#FF6B6B" stroke-width="4">
                        <animate attributeName="r" values="78;100;100" dur="1s"/>
                    </circle>
                    <circle cx="200" cy="160" r="52" fill="#FFFFCC">
                        <animate attributeName="r" values="61;52;52" dur="1s"/>
                    </circle>
                    
                    <!-- Immune response -->
                    <circle cx="170" cy="145" r="6" fill="#FF0000" opacity="0.8">
                        <animate attributeName="r" values="6;8;6" dur="1s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="230" cy="155" r="6" fill="#FF0000" opacity="0.8">
                        <animate attributeName="r" values="6;8;6" dur="1.2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="195" cy="180" r="6" fill="#FF0000" opacity="0.8">
                        <animate attributeName="r" values="6;8;6" dur="0.9s" repeatCount="indefinite"/>
                    </circle>
                    
                    <text x="145" y="140" font-size="16" fill="#FF0000" font-weight="bold">Fighting!</text>
                    
                    <!-- Mucus production -->
                    <ellipse cx="185" cy="138" rx="15" ry="12" fill="#90EE90" opacity="0.85" stroke="#228B22" stroke-width="2">
                        <animate attributeName="ry" values="0;12;12" dur="1s"/>
                    </ellipse>
                    <ellipse cx="215" cy="175" rx="16" ry="13" fill="#90EE90" opacity="0.85" stroke="#228B22" stroke-width="2">
                        <animate attributeName="ry" values="0;13;13" dur="1.2s"/>
                    </ellipse>
                    
                    <text x="200" cy="165" text-anchor="middle" font-size="24">😰</text>
                    
                    <text x="270" cy="175" font-size="16" fill="#228B22" font-weight="bold">Goop</text>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#CC0000">Puffs up and fills with goop</text>
                </g>
            `
        }
    ];
    
    animateStages(stages, container, btn, 'dust');
}

// PET DANDER TRIGGER ANIMATION
function animatePetDanderTrigger(container, btn) {
    const stages = [
        {
            delay: 0,
            svg: `
                <g id="stage1">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#FF6F00">Playing with Pets 🐾</text>
                    
                    <!-- Cat/dog -->
                    <ellipse cx="100" cy="170" rx="45" ry="35" fill="#D7CCC8" stroke="#8D6E63" stroke-width="2"/>
                    <circle cx="85" cy="152" r="18" fill="#D7CCC8" stroke="#8D6E63" stroke-width="2"/>
                    <circle cx="80" cy="150" r="4" fill="#000"/>
                    <circle cx="90" cy="150" r="4" fill="#000"/>
                    <circle cx="85" cy="158" r="3" fill="#000"/>
                    <line x1="70" y1="158" x2="52" y2="156" stroke="#8D6E63" stroke-width="2"/>
                    <line x1="70" y1="163" x2="52" y2="165" stroke="#8D6E63" stroke-width="2"/>
                    
                    <text x="100" y="235" text-anchor="middle" font-size="16" fill="#8D6E63" font-weight="bold">Cute pet!</text>
                    
                    <!-- Dander particles (skin flakes) -->
                    <rect x="160" y="125" width="10" height="8" fill="#BCAAA4" opacity="0.7" rx="1">
                        <animateTransform attributeName="transform" type="translate" values="0,0; 20,30; 0,0" dur="3s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="190" y="135" width="8" height="7" fill="#A1887F" opacity="0.6" rx="1">
                        <animateTransform attributeName="transform" type="translate" values="0,0; -15,25; 0,0" dur="3.5s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="210" y="115" width="9" height="8" fill="#BCAAA4" opacity="0.7" rx="1">
                        <animateTransform attributeName="transform" type="translate" values="0,0; 10,20; 0,0" dur="3.2s" repeatCount="indefinite"/>
                    </rect>
                    
                    <text x="185" y="110" font-size="18" fill="#A1887F" font-weight="bold">Skin flakes</text>
                    
                    <!-- Person -->
                    <circle cx="290" cy="160" r="30" fill="#FFE4C4" stroke="#8B4513" stroke-width="2"/>
                    <circle cx="283" cy="155" r="3" fill="#000"/>
                    <circle cx="297" cy="155" r="3" fill="#000"/>
                    <path d="M 282 168 Q 290 172 298 168" fill="none" stroke="#000" stroke-width="2"/>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#795548">Tiny bits of pet skin float around</text>
                </g>
            `
        },
        {
            delay: 2000,
            svg: `
                <g id="stage2">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#FF6B00">Skin Flakes Go In</text>
                    
                    <!-- Dander particles moving -->
                    <rect x="145" y="145" width="8" height="7" fill="#A1887F" opacity="0.8" rx="1">
                        <animate attributeName="x" from="145" to="200" dur="1.5s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" from="0.8" to="0.2" dur="1.5s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="155" y="160" width="9" height="8" fill="#BCAAA4" opacity="0.7" rx="1">
                        <animate attributeName="x" from="155" to="200" dur="1.7s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" from="0.7" to="0.2" dur="1.7s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="150" y="175" width="8" height="7" fill="#A1887F" opacity="0.8" rx="1">
                        <animate attributeName="x" from="150" to="200" dur="1.6s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" from="0.8" to="0.2" dur="1.6s" repeatCount="indefinite"/>
                    </rect>
                    
                    <text x="145" y="130" font-size="18" fill="#A1887F" font-weight="bold">Floating in</text>
                    
                    <!-- Airway with dander -->
                    <circle cx="200" cy="160" r="78" fill="#FFE4E1" stroke="#FF69B4" stroke-width="3"/>
                    <circle cx="200" cy="160" r="61" fill="#FFF8DC"/>
                    
                    <!-- Dander inside -->
                    <rect x="188" y="153" width="7" height="6" fill="#A1887F" rx="1"/>
                    <rect x="208" y="166" width="8" height="7" fill="#BCAAA4" rx="1"/>
                    
                    <text x="200" y="168" text-anchor="middle" font-size="22">😕</text>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#795548">Pet skin bits go into your airways</text>
                </g>
            `
        },
        {
            delay: 4000,
            svg: `
                <g id="stage3">
                    <!-- TOP LABEL -->
                    <text x="200" y="25" text-anchor="middle" font-size="20" font-weight="bold" fill="#CC0000">Your Body Freaks Out!</text>
                    
                    <!-- Highly inflamed airway -->
                    <circle cx="200" cy="160" r="103" fill="none" stroke="#FF1493" stroke-width="12" opacity="0.9">
                        <animate attributeName="r" values="103;107;103" dur="1s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="200" cy="160" r="97" fill="#FFCCCC" stroke="#FF6B6B" stroke-width="4">
                        <animate attributeName="r" values="78;97;97" dur="1s"/>
                    </circle>
                    <circle cx="200" cy="160" r="50" fill="#FFFFCC">
                        <animate attributeName="r" values="61;50;50" dur="1s"/>
                    </circle>
                    
                    <!-- Strong immune response -->
                    <circle cx="165" cy="140" r="7" fill="#FF0000" opacity="0.8">
                        <animate attributeName="r" values="7;9;7" dur="0.8s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="235" cy="150" r="7" fill="#FF0000" opacity="0.8">
                        <animate attributeName="r" values="7;9;7" dur="1s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="190" cy="185" r="7" fill="#FF0000" opacity="0.8">
                        <animate attributeName="r" values="7;9;7" dur="0.9s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="210" cy="178" r="7" fill="#FF0000" opacity="0.8">
                        <animate attributeName="r" values="7;9;7" dur="1.1s" repeatCount="indefinite"/>
                    </circle>
                    
                    <text x="145" y="135" font-size="16" fill="#FF0000" font-weight="bold">Fighting hard!</text>
                    
                    <!-- Lots of mucus -->
                    <ellipse cx="180" cy="135" rx="16" ry="13" fill="#90EE90" opacity="0.85" stroke="#228B22" stroke-width="2">
                        <animate attributeName="ry" values="0;13;13" dur="1s"/>
                    </ellipse>
                    <ellipse cx="220" cy="175" rx="17" ry="14" fill="#90EE90" opacity="0.85" stroke="#228B22" stroke-width="2">
                        <animate attributeName="ry" values="0;14;14" dur="1.2s"/>
                    </ellipse>
                    <ellipse cx="195" cy="188" rx="15" ry="12" fill="#90EE90" opacity="0.85" stroke="#228B22" stroke-width="2">
                        <animate attributeName="ry" values="0;12;12" dur="1.1s"/>
                    </ellipse>
                    
                    <text x="200" y="163" text-anchor="middle" font-size="22">😫</text>
                    
                    <text x="270" y="185" font-size="16" fill="#228B22" font-weight="bold">Lots of goop</text>
                    
                    <!-- BOTTOM LABEL -->
                    <text x="200" y="305" text-anchor="middle" font-size="16" fill="#CC0000">Big swelling + hard to breathe!</text>
                </g>
            `
        }
    ];
    
    animateStages(stages, container, btn, 'pet');
}

// HELPER FUNCTION: Animate through stages
function animateStages(stages, container, btn, triggerType) {
    let currentStage = 0;
    
    function showStage(index) {
        if (index < stages.length) {
            container.innerHTML = stages[index].svg;
            currentStage = index;
            
            if (index < stages.length - 1) {
                triggerAnimationTimers[triggerType] = setTimeout(() => {
                    showStage(index + 1);
                }, stages[index + 1].delay - stages[index].delay);
            } else {
                // Animation complete - re-enable button
                triggerAnimationTimers[triggerType] = setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = '▶️ Play Again';
                }, 2000);
            }
        }
    }
    
    showStage(0);
}

// INTERACTIVE LUNG DIAGRAM
let breatheAnimationActive = false;

// Initialize lung diagram interactivity
document.addEventListener('DOMContentLoaded', function() {
    const clickableParts = document.querySelectorAll('.clickable-part');
    
    clickableParts.forEach(part => {
        part.addEventListener('click', function() {
            const partName = this.getAttribute('data-part');
            showLungInfo(partName);
            highlightPart(this);
        });
    });
});

function highlightPart(element) {
    // Remove highlight from all parts
    document.querySelectorAll('.clickable-part').forEach(part => {
        part.classList.remove('highlighted');
    });
    
    // Add highlight to clicked part
    element.classList.add('highlighted');
}

function showLungInfo(partName) {
    const infoPanel = document.getElementById('lung-info-panel');
    
    const partInfo = {
        trachea: {
            title: '🫁 Trachea (Windpipe)',
            description: 'Your windpipe is like a highway for air! It\'s the main tube that carries air from your nose and mouth down to your lungs.',
            details: [
                'About 4 inches long and 1 inch wide',
                'Has rings of cartilage (tough tissue) to keep it open',
                'Lined with sticky mucus to trap dust and germs',
                'Tiny hairs (cilia) sweep the mucus up and out'
            ]
        },
        bronchus: {
            title: '🌿 Bronchi (Main Airways)',
            description: 'The bronchi are two big tubes that branch off from your windpipe - one goes to each lung. Think of them like the trunk of a tree splitting into two main branches!',
            details: [
                'Left bronchus goes to your left lung',
                'Right bronchus goes to your right lung',
                'Each one is about 1-1.5 inches long',
                'They keep splitting into smaller and smaller tubes'
            ]
        },
        bronchioles: {
            title: '🌳 Bronchioles (Small Airways)',
            description: 'Bronchioles are smaller tubes that branch out from the bronchi - just like tree branches! In asthma, these are the tubes that get narrow and swollen, making it hard to breathe.',
            details: [
                'There are about 30,000 bronchioles in your lungs!',
                'They get smaller and smaller as they branch out',
                'The smallest ones are thinner than a strand of hair',
                '⚠️ ASTHMA ALERT: These are what squeeze tight during an attack!'
            ]
        },
        alveoli: {
            title: '🫧 Alveoli (Air Sacs)',
            description: 'Alveoli are tiny balloon-like sacs at the end of the bronchioles. This is where the magic happens - oxygen from the air moves into your blood, and carbon dioxide moves out!',
            details: [
                'You have about 300-500 MILLION alveoli!',
                'Each one is super tiny - smaller than a grain of salt',
                'They\'re surrounded by tiny blood vessels called capillaries',
                'If you spread them all out flat, they\'d cover a tennis court!'
            ]
        }
    };
    
    const info = partInfo[partName];
    
    if (info) {
        infoPanel.innerHTML = `
            <h4>${info.title}</h4>
            <p><strong>${info.description}</strong></p>
            <ul>
                ${info.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
        `;
    }
}

function animateBreathe() {
    if (breatheAnimationActive) return;
    
    breatheAnimationActive = true;
    const btn = document.getElementById('breathe-btn');
    btn.disabled = true;
    btn.textContent = '💨 Breathing...';
    
    const svg = document.getElementById('interactive-lung-svg');
    const airflowGroup = document.getElementById('airflow-group');
    const diagramArea = document.querySelector('.lung-diagram-area');
    
    // Create breathing status text overlay
    const statusText = document.createElement('div');
    statusText.className = 'breathing-status breathing-in';
    statusText.textContent = '💨 Breathing IN...';
    diagramArea.appendChild(statusText);
    
    // Show airflow animation
    airflowGroup.style.display = 'block';
    
    // Add breathing-in class to SVG for lung expansion
    svg.classList.add('breathing-in');
    
    // Create DRAMATIC oxygen particles (breathing in - BLUE) - 12 particles for visibility
    const oxygenParticles = [
        { start: {x: 250, y: 50}, path: [{x: 250, y: 50}, {x: 250, y: 100}, {x: 230, y: 150}, {x: 170, y: 200}, {x: 150, y: 280}] },
        { start: {x: 250, y: 55}, path: [{x: 250, y: 55}, {x: 250, y: 110}, {x: 270, y: 150}, {x: 330, y: 200}, {x: 350, y: 280}] },
        { start: {x: 245, y: 60}, path: [{x: 245, y: 60}, {x: 245, y: 120}, {x: 220, y: 160}, {x: 160, y: 220}, {x: 140, y: 320}] },
        { start: {x: 255, y: 58}, path: [{x: 255, y: 58}, {x: 255, y: 115}, {x: 280, y: 160}, {x: 340, y: 220}, {x: 360, y: 320}] },
        { start: {x: 248, y: 52}, path: [{x: 248, y: 52}, {x: 248, y: 105}, {x: 225, y: 155}, {x: 165, y: 210}, {x: 145, y: 300}] },
        { start: {x: 252, y: 54}, path: [{x: 252, y: 54}, {x: 252, y: 108}, {x: 275, y: 155}, {x: 335, y: 210}, {x: 355, y: 300}] },
        { start: {x: 246, y: 56}, path: [{x: 246, y: 56}, {x: 246, y: 112}, {x: 218, y: 165}, {x: 155, y: 230}, {x: 135, y: 340}] },
        { start: {x: 254, y: 57}, path: [{x: 254, y: 57}, {x: 254, y: 113}, {x: 282, y: 165}, {x: 345, y: 230}, {x: 365, y: 340}] },
        { start: {x: 249, y: 59}, path: [{x: 249, y: 59}, {x: 249, y: 118}, {x: 222, y: 170}, {x: 158, y: 240}, {x: 138, y: 360}] },
        { start: {x: 251, y: 61}, path: [{x: 251, y: 61}, {x: 251, y: 122}, {x: 278, y: 170}, {x: 342, y: 240}, {x: 362, y: 360}] },
        { start: {x: 247, y: 53}, path: [{x: 247, y: 53}, {x: 247, y: 107}, {x: 215, y: 158}, {x: 152, y: 215}, {x: 132, y: 310}] },
        { start: {x: 253, y: 55}, path: [{x: 253, y: 55}, {x: 253, y: 109}, {x: 285, y: 158}, {x: 348, y: 215}, {x: 368, y: 310}] }
    ];
    
    // Animate breathing in (oxygen - BRIGHT BLUE - LARGER)
    setTimeout(() => {
        oxygenParticles.forEach((particle, index) => {
            setTimeout(() => {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('class', 'air-particle oxygen');
                circle.setAttribute('r', '12'); // MUCH LARGER - was 5
                circle.setAttribute('fill', '#2196F3');
                circle.setAttribute('cx', particle.start.x);
                circle.setAttribute('cy', particle.start.y);
                circle.setAttribute('opacity', '0');
                
                const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animate.setAttribute('attributeName', 'cy');
                animate.setAttribute('values', particle.path.map(p => p.y).join(';'));
                animate.setAttribute('dur', '2s');
                animate.setAttribute('repeatCount', '1');
                
                const animateX = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animateX.setAttribute('attributeName', 'cx');
                animateX.setAttribute('values', particle.path.map(p => p.x).join(';'));
                animateX.setAttribute('dur', '2s');
                animateX.setAttribute('repeatCount', '1');
                
                const animateOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animateOpacity.setAttribute('attributeName', 'opacity');
                animateOpacity.setAttribute('values', '0;1;1;1;0.5');
                animateOpacity.setAttribute('dur', '2s');
                animateOpacity.setAttribute('repeatCount', '1');
                
                circle.appendChild(animate);
                circle.appendChild(animateX);
                circle.appendChild(animateOpacity);
                airflowGroup.appendChild(circle);
                
                setTimeout(() => circle.remove(), 2000);
            }, index * 80); // Stagger the particles for continuous flow effect
        });
    }, 100);
    
    // Switch to breathing out after 2 seconds
    setTimeout(() => {
        svg.classList.remove('breathing-in');
        svg.classList.add('breathing-out');
        statusText.className = 'breathing-status breathing-out';
        statusText.textContent = '💨 Breathing OUT...';
    }, 2000);
    
    // Animate breathing out (CO2 - BRIGHT RED - LARGER) after breathing in
    setTimeout(() => {
        const co2Particles = [
            { start: {x: 150, y: 300}, path: [{x: 150, y: 300}, {x: 170, y: 210}, {x: 230, y: 160}, {x: 250, y: 110}, {x: 250, y: 40}] },
            { start: {x: 350, y: 300}, path: [{x: 350, y: 300}, {x: 330, y: 210}, {x: 270, y: 160}, {x: 250, y: 105}, {x: 250, y: 35}] },
            { start: {x: 140, y: 340}, path: [{x: 140, y: 340}, {x: 160, y: 230}, {x: 220, y: 170}, {x: 245, y: 115}, {x: 245, y: 45}] },
            { start: {x: 360, y: 340}, path: [{x: 360, y: 340}, {x: 340, y: 230}, {x: 280, y: 170}, {x: 255, y: 112}, {x: 255, y: 42}] },
            { start: {x: 145, y: 320}, path: [{x: 145, y: 320}, {x: 165, y: 220}, {x: 225, y: 165}, {x: 248, y: 108}, {x: 248, y: 38}] },
            { start: {x: 355, y: 320}, path: [{x: 355, y: 320}, {x: 335, y: 220}, {x: 275, y: 165}, {x: 252, y: 105}, {x: 252, y: 36}] },
            { start: {x: 135, y: 360}, path: [{x: 135, y: 360}, {x: 155, y: 240}, {x: 218, y: 175}, {x: 246, y: 112}, {x: 246, y: 43}] },
            { start: {x: 365, y: 360}, path: [{x: 365, y: 360}, {x: 345, y: 240}, {x: 282, y: 175}, {x: 254, y: 113}, {x: 254, y: 44}] },
            { start: {x: 138, y: 380}, path: [{x: 138, y: 380}, {x: 158, y: 250}, {x: 222, y: 180}, {x: 249, y: 118}, {x: 249, y: 46}] },
            { start: {x: 362, y: 380}, path: [{x: 362, y: 380}, {x: 342, y: 250}, {x: 278, y: 180}, {x: 251, y: 122}, {x: 251, y: 48}] },
            { start: {x: 132, y: 350}, path: [{x: 132, y: 350}, {x: 152, y: 235}, {x: 215, y: 172}, {x: 247, y: 107}, {x: 247, y: 39}] },
            { start: {x: 368, y: 350}, path: [{x: 368, y: 350}, {x: 348, y: 235}, {x: 285, y: 172}, {x: 253, y: 109}, {x: 253, y: 41}] }
        ];
        
        co2Particles.forEach((particle, index) => {
            setTimeout(() => {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('class', 'air-particle co2');
                circle.setAttribute('r', '12'); // MUCH LARGER - was 5
                circle.setAttribute('fill', '#F44336');
                circle.setAttribute('cx', particle.start.x);
                circle.setAttribute('cy', particle.start.y);
                circle.setAttribute('opacity', '0');
                
                const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animate.setAttribute('attributeName', 'cy');
                animate.setAttribute('values', particle.path.map(p => p.y).join(';'));
                animate.setAttribute('dur', '2s');
                animate.setAttribute('repeatCount', '1');
                
                const animateX = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animateX.setAttribute('attributeName', 'cx');
                animateX.setAttribute('values', particle.path.map(p => p.x).join(';'));
                animateX.setAttribute('dur', '2s');
                animateX.setAttribute('repeatCount', '1');
                
                const animateOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animateOpacity.setAttribute('attributeName', 'opacity');
                animateOpacity.setAttribute('values', '0;1;1;1;0.5');
                animateOpacity.setAttribute('dur', '2s');
                animateOpacity.setAttribute('repeatCount', '1');
                
                circle.appendChild(animate);
                circle.appendChild(animateX);
                circle.appendChild(animateOpacity);
                airflowGroup.appendChild(circle);
                
                setTimeout(() => circle.remove(), 2000);
            }, index * 80); // Stagger the particles
        });
    }, 2100);
    
    // Re-enable button after animation completes (4 seconds total)
    setTimeout(() => {
        airflowGroup.style.display = 'none';
        svg.classList.remove('breathing-out');
        statusText.remove();
        btn.disabled = false;
        btn.textContent = '💨 Breathe In/Out';
        breatheAnimationActive = false;
    }, 4500);
}
