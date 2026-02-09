// ============================================
// CONFIGURACIÓN
// ============================================

// Fecha de inicio: 24 de octubre de 2025
const START_DATE = new Date('2025-10-24T00:00:00');

// Mensajes a mostrar
const MESSAGES = [
    "Para mi amor:",
    "Gracias por existir en mi vida y hacerla más hermosa.",
    "Y si dudas de mi amor por ti, te buscaré y te amaré en cada una de mis vidas.",
    "— Te amo!"
];

// Colores para los corazones del árbol
const HEART_COLORS = [
    '#c41e3a', // rojo oscuro
    '#dc143c', // crimson
    '#e63946', // rojo
    '#f4a4a4', // rosa claro
    '#ffb3c1', // rosa
    '#ff758f', // coral
    '#c9184a', // burdeos
    '#ff4d6d'  // rosa fuerte
];

// ============================================
// VARIABLES GLOBALES
// ============================================

let started = false;
let typingTimeout = null;
let fallingHeartsInterval = null;
let counterInterval = null;

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

/**
 * Inicia toda la animación al hacer clic en el botón
 */
function startAnimation() {
    if (started) return;
    started = true;

    // Ocultar pantalla inicial con fade
    const startScreen = document.getElementById('start-screen');
    startScreen.style.opacity = '0';
    
    setTimeout(() => {
        startScreen.style.display = 'none';
        showSeedAnimation();
    }, 600);
}

/**
 * Muestra la animación de la semilla cayendo
 */
function showSeedAnimation() {
    const seedAnimation = document.getElementById('seed-animation');
    seedAnimation.style.display = 'flex';
    
    // Después de que cae la semilla, crece el árbol
    setTimeout(() => {
        seedAnimation.style.display = 'none';
        growTree();
    }, 1800);
}

/**
 * Crea y anima el árbol completo, luego lo mueve a la derecha
 */
function growTree() {
    const treeContainer = document.getElementById('tree-container');
    treeContainer.style.display = 'block';
    
    // Crear tronco
    setTimeout(() => {
        document.getElementById('trunk').style.animation = 'growTrunk 1s ease-out forwards';
    }, 100);
    
    // Crear copa de corazones (sin ramas)
    setTimeout(() => {
        createHeartLeaves();
    }, 800);
    
    // Esperar a que el árbol esté completo, luego moverlo a la derecha
    setTimeout(() => {
        treeContainer.classList.add('moved-right');
        
        // Iniciar corazones cayendo después de que se mueve
        setTimeout(startFallingHearts, 800);
        
        // Mostrar mensaje y contador
        setTimeout(showMessageAndCounter, 1200);
    }, 3500);
}

/**
 * Crea los corazones que forman la copa del árbol
 */
function createHeartLeaves() {
    const container = document.getElementById('tree-container');
    const positions = generateHeartShapePositions();
    
    // Mezclar posiciones para aparición aleatoria
    const shuffled = positions.sort(() => Math.random() - 0.5);
    
    shuffled.forEach((pos, index) => {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-leaf';
            
            const size = 6 + Math.random() * 8;
            const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
            
            heart.style.cssText = `
                left: ${pos.x}px;
                bottom: ${pos.y}px;
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                animation-delay: ${index * 0.005}s;
            `;
            
            container.appendChild(heart);
        }, index * 8);
    });
}

/**
 * Genera posiciones en forma de corazón - CORREGIDO: más abajo
 * centerY reducido para que el corazón quede más cerca del tronco
 */
function generateHeartShapePositions() {
    const positions = [];
    const centerX = 175;
    const centerY = 180; // REDUCIDO: antes era 280, ahora 180 para que quede más abajo
    const scale = 110;
    
    // Ecuación paramétrica del corazón
    for (let t = 0; t < Math.PI * 2; t += 0.06) {
        const xBase = 16 * Math.pow(Math.sin(t), 3);
        const yBase = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        
        // Múltiples capas para densidad
        for (let layer = 0; layer < 3; layer++) {
            const randomOffset = (Math.random() - 0.5) * 30;
            const layerScale = 1 - (layer * 0.12);
            
            positions.push({
                x: centerX + (xBase * scale / 16 * layerScale) + randomOffset,
                y: centerY + (yBase * scale / 16 * layerScale) + Math.abs(randomOffset) * 0.3
            });
        }
    }
    
    // Añadir corazones extra alrededor para volumen
    for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 60;
        const x = 16 * Math.pow(Math.sin(angle), 3) * r / 16;
        const y = (13 * Math.cos(angle) - 5 * Math.cos(2*angle) - 2 * Math.cos(3*angle) - Math.cos(4*angle)) * r / 16;
        
        positions.push({
            x: centerX + x + (Math.random() - 0.5) * 20,
            y: centerY + y + (Math.random() - 0.5) * 20
        });
    }
    
    return positions;
}

/**
 * Inicia la lluvia de corazones cayendo desde el árbol
 */
function startFallingHearts() {
    const container = document.getElementById('container');
    const treeContainer = document.getElementById('tree-container');
    
    fallingHeartsInterval = setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'falling-heart';
        
        // Obtener posición actual del árbol (ahora a la derecha)
        const treeRect = treeContainer.getBoundingClientRect();
        
        // Posición de inicio: desde la copa del árbol
        const startX = treeRect.left + 80 + Math.random() * 120;
        const startY = treeRect.top + 50 + Math.random() * 100;
        const size = 8 + Math.random() * 10;
        const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
        
        heart.style.cssText = `
            left: ${startX}px;
            top: ${startY}px;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
        `;
        
        container.appendChild(heart);
        
        // Limpiar después de la animación
        setTimeout(() => {
            if (heart.parentNode) heart.remove();
        }, 4000);
        
    }, 400);
}

/**
 * Muestra el mensaje con efecto de máquina de escribir y el contador
 */
function showMessageAndCounter() {
    const messageContainer = document.getElementById('message-container');
    const counter = document.getElementById('counter');
    
    messageContainer.style.display = 'block';
    counter.style.display = 'block';
    
    // Iniciar efecto de escritura
    typeMessages();
    
    // Iniciar contador
    updateCounter();
    counterInterval = setInterval(updateCounter, 1000);
}

/**
 * Escribe los mensajes línea por línea con efecto de máquina de escribir
 */
function typeMessages() {
    const container = document.getElementById('message-text');
    let currentLine = 0;
    
    function typeNextLine() {
        if (currentLine >= MESSAGES.length) return;
        
        const lineDiv = document.createElement('div');
        lineDiv.style.opacity = '0';
        lineDiv.innerHTML = `
            <span class="typing-content"></span>
            <span class="typing-cursor"></span>
        `;
        container.appendChild(lineDiv);
        
        // Fade in de la línea
        requestAnimationFrame(() => {
            lineDiv.style.opacity = '1';
        });
        
        const content = lineDiv.querySelector('.typing-content');
        const cursor = lineDiv.querySelector('.typing-cursor');
        const text = MESSAGES[currentLine];
        let charIndex = 0;
        
        function typeChar() {
            if (charIndex < text.length) {
                content.textContent += text[charIndex];
                charIndex++;
                typingTimeout = setTimeout(typeChar, 45 + Math.random() * 30);
            } else {
                // Terminó esta línea
                cursor.style.display = 'none';
                currentLine++;
                
                // Pausa antes de la siguiente línea
                const pause = (text.includes('I Love You')) ? 2000 : 800;
                typingTimeout = setTimeout(typeNextLine, pause);
            }
        }
        
        typeChar();
    }
    
    typeNextLine();
}

/**
 * Actualiza el contador de tiempo transcurrido
 */
function updateCounter() {
    const now = new Date();
    const diff = now - START_DATE;
    const counterElement = document.getElementById('counter-time');
    
    if (diff < 0) {
        // Aún no llega la fecha
        const daysUntil = Math.ceil(Math.abs(diff) / (1000 * 60 * 60 * 24));
        counterElement.textContent = `Faltan ${daysUntil} días para el 24/10/2025`;
        return;
    }
    
    // Calcular tiempo transcurrido
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Formato: "XXX días XX horas XX minutos XX segundos"
    counterElement.textContent = 
        `${String(days).padStart(3, '0')} días ` +
        `${String(hours).padStart(2, '0')} horas ` +
        `${String(minutes).padStart(2, '0')} minutos ` +
        `${String(seconds).padStart(2, '0')} segundos`;
}

// ============================================
// LIMPIEZA
// ============================================

window.addEventListener('beforeunload', () => {
    if (typingTimeout) clearTimeout(typingTimeout);
    if (fallingHeartsInterval) clearInterval(fallingHeartsInterval);
    if (counterInterval) clearInterval(counterInterval);
});