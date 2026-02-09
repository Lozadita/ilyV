const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('overlay');
const mainContent = document.getElementById('main-content');
const trunk = document.getElementById('trunk');
const seed = document.getElementById('seed');

startBtn.addEventListener('click', () => {
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
        mainContent.classList.remove('hidden');
        startAnimation();
    }, 1000);
});

function startAnimation() {
    // 1. Animación de la semilla
    seed.classList.remove('hidden');
    seed.animate([
        { top: '20%', opacity: 1 },
        { top: '90%', opacity: 0 }
    ], { duration: 1500, fill: 'forwards' }).onfinish = () => {
        // 2. Crecer el tronco
        trunk.style.height = '150px';
        setTimeout(createLeaves, 1500);
    };
}

function createLeaves() {
    const container = document.getElementById('leaves-container');
    const totalLeaves = 80;
    
    for (let i = 0; i < totalLeaves; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        
        // Ecuación matemática del corazón para posicionar las hojas
        const t = Math.random() * 2 * Math.PI;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        
        // Escalar y centrar
        const posX = x * 8 + 200; 
        const posY = y * 8 + 100;

        leaf.style.left = `${posX}px`;
        leaf.style.top = `${posY}px`;
        leaf.style.backgroundColor = `hsl(${340 + Math.random() * 20}, 100%, ${60 + Math.random() * 20}%)`;
        
        container.appendChild(leaf);
        
        // Aparecer con delay
        setTimeout(() => {
            leaf.style.transform = `rotate(-45deg) scale(${0.5 + Math.random()})`;
        }, i * 50);
    }
    typeWriter();
}

// Typewriter
const message = "Para mi amor:\nY si dudas de mi amor por ti, te buscaré y te amaré en cada una de mis vidas.💞\n-Te amo!!";
let charIndex = 0;
function typeWriter() {
    if (charIndex < message.length) {
        document.getElementById("typed-text").innerText += message.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 50);
    }
}

// Contador desde el 24-10-2025
const startDate = new Date("2025-10-24T00:00:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const diff = now - startDate;
    
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = d;
    document.getElementById("hours").innerText = h;
    document.getElementById("minutes").innerText = m;
    document.getElementById("seconds").innerText = s;
}, 1000);

// Estela de corazones
document.addEventListener('mousemove', (e) => {
    const heart = document.createElement('div');
    heart.className = 'trail-heart';
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
});