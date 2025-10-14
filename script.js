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

// Cell Interaction Functions
function initCellInteraction() {
    const cellParts = document.querySelectorAll('.cell-part');
    
    cellParts.forEach(part => {
        part.addEventListener('click', function() {
            showCellInfo(this.id);
        });
    });
}

function showCellInfo(partId) {
    const infoPanel = document.getElementById('cell-info');
    infoPanel.classList.add('active');
    
    let title = '';
    let description = '';
    
    switch(partId) {
        case 'nucleus':
            title = '🧬 Nucleus - The Control Center';
            description = '<p><strong>The nucleus is like the brain of the cell!</strong></p>' +
                         '<ul>' +
                         '<li>Contains DNA (your genetic instructions)</li>' +
                         '<li>Controls all cell activities</li>' +
                         '<li>Tells the cell what to do and when</li>' +
                         '<li>Protected by a double membrane</li>' +
                         '</ul>' +
                         '<p><em>Fun fact:</em> If you stretched out all the DNA in one cell, it would be about 2 meters long!</p>';
            break;
            
        case 'membrane':
            title = '🛡️ Cell Membrane - The Security Guard';
            description = '<p><strong>The cell membrane is the outer boundary of the cell!</strong></p>' +
                         '<ul>' +
                         '<li>Controls what enters and exits the cell</li>' +
                         '<li>Protects cell contents</li>' +
                         '<li>Made of a double layer of lipids (fats)</li>' +
                         '<li>Has special channels and gates</li>' +
                         '</ul>' +
                         '<p><em>Think of it as:</em> A security checkpoint that decides who gets in and out!</p>';
            break;
            
        case 'mitochondria1':
        case 'mitochondria2':
            title = '⚡ Mitochondria - The Powerhouse';
            description = '<p><strong>Mitochondria are the energy producers!</strong></p>' +
                         '<ul>' +
                         '<li>Convert food (glucose) into energy (ATP)</li>' +
                         '<li>Cells can have hundreds or thousands</li>' +
                         '<li>Have their own DNA!</li>' +
                         '<li>More mitochondria = more energy</li>' +
                         '</ul>' +
                         '<p><em>Why it matters:</em> During an asthma attack, cells need extra energy to respond, so mitochondria work overtime!</p>';
            break;
            
        default:
            title = '💧 Cytoplasm - The Workspace';
            description = '<p><strong>Cytoplasm is the jelly-like substance filling the cell!</strong></p>' +
                         '<ul>' +
                         '<li>Holds all organelles in place</li>' +
                         '<li>Where many chemical reactions happen</li>' +
                         '<li>Mostly made of water</li>' +
                         '<li>Contains nutrients, salts, and proteins</li>' +
                         '</ul>' +
                         '<p><em>Think of it as:</em> The factory floor where all the work happens!</p>';
    }
    
    infoPanel.innerHTML = '<h4>' + title + '</h4>' + description;
    
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
            description: 'Everything is calm and open. Air flows freely through the wide airway.',
            svg: createNormalAirwaySVG()
        },
        {
            title: 'Stage 2: Trigger Detected!',
            description: 'An asthma trigger (like pollen or smoke) enters the airway. The immune system detects it.',
            svg: createTriggerAirwaySVG()
        },
        {
            title: 'Stage 3: Inflammation Begins',
            description: 'Immune cells rush to the area and release chemicals. The airway walls start to swell and become inflamed.',
            svg: createInflammationAirwaySVG()
        },
        {
            title: 'Stage 4: Muscle Contraction',
            description: 'Smooth muscles around the airway tighten (bronchoconstriction). The airway becomes narrower.',
            svg: createConstrictionAirwaySVG()
        },
        {
            title: 'Stage 5: Mucus Production',
            description: 'Goblet cells produce excess thick, sticky mucus. The airway is now very narrow and partially blocked.',
            svg: createMucusAirwaySVG()
        },
        {
            title: 'Stage 6: Asthma Attack',
            description: 'All three problems together: inflammation + muscle tightness + mucus = difficulty breathing!',
            svg: createAttackAirwaySVG()
        }
    ];
    
    if (animationStage < stages.length) {
        const stage = stages[animationStage];
        document.getElementById('stage-title').textContent = stage.title;
        document.getElementById('stage-description').textContent = stage.description;
        document.getElementById('animation-stage').innerHTML = stage.svg;
        
        animationStage++;
        setTimeout(playAnimationStage, 3000);
    } else {
        const animateBtn = document.getElementById('animate-btn');
        animateBtn.disabled = false;
        animateBtn.textContent = '🔄 Play Again';
    }
}

// SVG Creation Functions for Animation
function createNormalAirwaySVG() {
    return `
        <svg viewBox="0 0 500 300" class="animation-svg">
            <circle cx="250" cy="150" r="100" fill="#FFE4E1" stroke="#FF69B4" stroke-width="2"/>
            <circle cx="250" cy="150" r="80" fill="#FFF8DC"/>
            <text x="250" y="155" text-anchor="middle" font-size="24">😊</text>
            <text x="250" y="260" text-anchor="middle" font-size="16" font-weight="bold">Normal - Wide Open</text>
        </svg>
    `;
}

function createTriggerAirwaySVG() {
    return `
        <svg viewBox="0 0 500 300" class="animation-svg">
            <circle cx="250" cy="150" r="100" fill="#FFE4E1" stroke="#FF69B4" stroke-width="2"/>
            <circle cx="250" cy="150" r="80" fill="#FFF8DC"/>
            <text x="250" y="155" text-anchor="middle" font-size="24">😐</text>
            
            <!-- Trigger particles -->
            <circle cx="150" cy="80" r="8" fill="#ff6b6b" opacity="0.7"/>
            <circle cx="200" cy="70" r="6" fill="#ff6b6b" opacity="0.7"/>
            <circle cx="300" cy="75" r="7" fill="#ff6b6b" opacity="0.7"/>
            <circle cx="350" cy="85" r="9" fill="#ff6b6b" opacity="0.7"/>
            
            <text x="250" y="260" text-anchor="middle" font-size="16" font-weight="bold">Trigger Detected!</text>
        </svg>
    `;
}

function createInflammationAirwaySVG() {
    return `
        <svg viewBox="0 0 500 300" class="animation-svg">
            <circle cx="250" cy="150" r="110" fill="#FFCCCC" stroke="#FF6B6B" stroke-width="3"/>
            <circle cx="250" cy="150" r="75" fill="#FFF8DC"/>
            <text x="250" y="155" text-anchor="middle" font-size="24">😕</text>
            
            <!-- Swelling indicated by thicker wall -->
            <circle cx="250" cy="150" r="105" fill="none" stroke="#FF4444" stroke-width="8" opacity="0.5"/>
            
            <text x="250" y="260" text-anchor="middle" font-size="16" font-weight="bold">Inflammation - Walls Swelling</text>
        </svg>
    `;
}

function createConstrictionAirwaySVG() {
    return `
        <svg viewBox="0 0 500 300" class="animation-svg">
            <circle cx="250" cy="150" r="115" fill="#FFCCCC" stroke="#FF4444" stroke-width="3"/>
            <circle cx="250" cy="150" r="60" fill="#FFFFCC"/>
            <text x="250" y="155" text-anchor="middle" font-size="20">😰</text>
            
            <!-- Thick muscle layer -->
            <circle cx="250" cy="150" r="120" fill="none" stroke="#FF1493" stroke-width="10"/>
            
            <text x="250" y="260" text-anchor="middle" font-size="16" font-weight="bold">Muscle Tightening!</text>
        </svg>
    `;
}

function createMucusAirwaySVG() {
    return `
        <svg viewBox="0 0 500 300" class="animation-svg">
            <circle cx="250" cy="150" r="120" fill="#FFCCCC" stroke="#FF4444" stroke-width="3"/>
            <circle cx="250" cy="150" r="55" fill="#FFFFCC"/>
            <text x="250" y="155" text-anchor="middle" font-size="18">😫</text>
            
            <!-- Mucus blobs -->
            <circle cx="220" cy="120" r="12" fill="#90EE90" opacity="0.8"/>
            <circle cx="280" cy="130" r="15" fill="#90EE90" opacity="0.8"/>
            <circle cx="250" cy="180" r="13" fill="#90EE90" opacity="0.8"/>
            <circle cx="200" cy="170" r="10" fill="#90EE90" opacity="0.8"/>
            
            <text x="250" y="260" text-anchor="middle" font-size="16" font-weight="bold">Excess Mucus!</text>
        </svg>
    `;
}

function createAttackAirwaySVG() {
    return `
        <svg viewBox="0 0 500 300" class="animation-svg">
            <circle cx="250" cy="150" r="130" fill="#FF9999" stroke="#CC0000" stroke-width="4"/>
            <circle cx="250" cy="150" r="40" fill="#FFEEAA"/>
            <text x="250" y="155" text-anchor="middle" font-size="16">😨</text>
            
            <!-- Thick constricted muscle -->
            <circle cx="250" cy="150" r="135" fill="none" stroke="#CC0000" stroke-width="12"/>
            
            <!-- Lots of mucus -->
            <circle cx="210" cy="130" r="15" fill="#90EE90" opacity="0.9"/>
            <circle cx="290" cy="135" r="18" fill="#90EE90" opacity="0.9"/>
            <circle cx="250" cy="170" r="16" fill="#90EE90" opacity="0.9"/>
            <circle cx="230" cy="165" r="14" fill="#90EE90" opacity="0.9"/>
            <circle cx="270" cy="160" r="12" fill="#90EE90" opacity="0.9"/>
            
            <text x="250" y="260" text-anchor="middle" font-size="16" font-weight="bold" fill="#CC0000">ASTHMA ATTACK!</text>
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
        feedback.innerHTML = '🎉 Perfect! You got it right! <br><strong>Cell → Tissue → Organ → System</strong> is the correct biological hierarchy!';
    } else {
        feedback.className = 'feedback show error';
        feedback.innerHTML = '❌ Not quite right. Try again! <br><em>Hint: Start with the smallest (Cell) and work your way up to the largest (System).</em>';
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
        feedback.textContent = '✅ Perfect match! Great job!';
        
        // Check if all matches are complete
        setTimeout(() => {
            const allMatched = document.querySelectorAll('.match-item.correct').length === 8;
            if (allMatched) {
                feedback.textContent = '🎉 Congratulations! You matched all the cell parts with their functions!';
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
            info = '<h4>Pollen Trigger</h4><p><strong>What happens:</strong> Immune cells mistake pollen for a threat and release histamine. This causes inflammation and mucus production.</p><p><strong>Cellular effects:</strong> Epithelial cells swell, goblet cells overproduce mucus, smooth muscles tighten.</p>';
            break;
            
        case 'exercise':
            simOuter.setAttribute('r', '115');
            simOuter.setAttribute('fill', '#FFE4E1');
            simOuter.setAttribute('stroke', '#FF8C8C');
            simInner.setAttribute('r', '65');
            simInner.setAttribute('fill', '#FFF8DC');
            simEmoji.textContent = '😮‍💨';
            simLabel.textContent = 'Exercise-Induced';
            info = '<h4>Exercise Trigger</h4><p><strong>What happens:</strong> Rapid breathing dries out airways and changes temperature. This irritates airway cells.</p><p><strong>Cellular effects:</strong> Smooth muscle cells contract in response to dry air, causing mild to moderate constriction.</p>';
            break;
            
        case 'cold':
            simOuter.setAttribute('r', '118');
            simOuter.setAttribute('fill', '#E6F3FF');
            simOuter.setAttribute('stroke', '#6BA3D4');
            simInner.setAttribute('r', '62');
            simInner.setAttribute('fill', '#F0F8FF');
            simEmoji.textContent = '🥶';
            simLabel.textContent = 'Cold Air';
            info = '<h4>Cold Air Trigger</h4><p><strong>What happens:</strong> Cold air irritates the airways and causes them to narrow.</p><p><strong>Cellular effects:</strong> Smooth muscles contract to conserve heat, airway tissues become irritated and inflamed.</p>';
            break;
            
        case 'smoke':
            simOuter.setAttribute('r', '125');
            simOuter.setAttribute('fill', '#D3D3D3');
            simOuter.setAttribute('stroke', '#696969');
            simInner.setAttribute('r', '50');
            simInner.setAttribute('fill', '#C0C0C0');
            simEmoji.textContent = '😫';
            simLabel.textContent = 'Smoke Exposure';
            info = '<h4>Smoke Trigger</h4><p><strong>What happens:</strong> Smoke particles irritate and damage airway cells directly.</p><p><strong>Cellular effects:</strong> Severe inflammation, damaged cilia can\'t clear mucus, goblet cells produce excess mucus, smooth muscles tighten significantly.</p>';
            break;
            
        case 'normal':
            simOuter.setAttribute('r', '100');
            simOuter.setAttribute('fill', '#FFE4E1');
            simOuter.setAttribute('stroke', '#FF69B4');
            simInner.setAttribute('r', '80');
            simInner.setAttribute('fill', '#FFF8DC');
            simEmoji.textContent = '😊';
            simLabel.textContent = 'Normal Airway';
            info = '<p><strong>Back to normal!</strong> In a healthy airway, cells work in harmony: thin mucus layer, relaxed muscles, and normal-sized cells allow easy breathing.</p>';
            break;
    }
    
    simInfo.innerHTML = info;
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
        results.push({ q: 10, correct: false, answer: 'When tissues become red, swollen, and irritated' });
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
        message = 'Outstanding! You\'re an asthma expert!';
    } else if (percentage >= 80) {
        emoji = '🎉';
        message = 'Great job! You really understand asthma!';
    } else if (percentage >= 70) {
        emoji = '👍';
        message = 'Good work! You\'ve learned a lot!';
    } else if (percentage >= 60) {
        emoji = '📚';
        message = 'Not bad! Review the material to improve!';
    } else {
        emoji = '💪';
        message = 'Keep learning! Try reviewing the sections again!';
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
