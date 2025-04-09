// Inicializaci�n de variables
let baseCostMultiplier = 10;
let baseCostAutoclick = 50;
let costMultiplier = 1.1;
let costAutoclick = 1.5;
let score = 0;
let multiplier = 1;
let autoclick = 0;
let autoclickRate = 1000; // Milisegundos entre cada autoclick
let characterPurchased = 0; // Contador de personajes comprados
const characterImages = ['Modelo_de_personaje_Tartaglia.webp', 'Arte_de_personaje_Mavuika.webp'];
let lastCharacterImageIndex = -1; // Para evitar im�genes repetidas

// Elementos del DOM
const scoreDisplay = document.getElementById('score');
const multiplierDisplay = document.getElementById('multiplier');
const autoclickDisplay = document.getElementById('autoclick');
const clickButton = document.getElementById('clickButton');
const multiplierUpgradeButton = document.getElementById('multiplierUpgrade');
const autoclickUpgradeButton = document.getElementById('autoclickUpgrade');
const pointsPerClickDisplay = document.getElementById('pointsPerClick');
const buyCharacterButton = document.getElementById('buyCharacter');
const characterContainer = document.getElementById('characterContainer');
// Arreglo de sonidos
const sounds = [
    new Audio('sounds/Basicos.mp3'),
    new Audio('sounds/Cargado.mp3'),  // Agrega m�s sonidos aqu�
    new Audio('sounds/Elemental.mp3'),
    new Audio('sounds/Ulti.mp3')
];

function updateButtonCosts() {
    // C�lculo de costos din�micos
    let currentCostMultiplier = baseCostMultiplier * Math.pow(costMultiplier, multiplier - 1);
    let currentCostAutoclick = baseCostAutoclick * Math.pow(costAutoclick, autoclick - 1);

    // Actualizando los textos de los botones
    multiplierUpgradeButton.textContent = `Mejorar multiplicador (Costo: ${Math.floor(currentCostMultiplier)} Protogemas)`;
    autoclickUpgradeButton.textContent = `Mejorar autoclic (Costo: ${Math.floor(currentCostAutoclick)} Protogemas)`;
}

// Pre-cargar los sonidos
sounds.forEach(sound => sound.preload = 'auto');


// Funci�n para reproducir el sonido
function playClickSound() {
    // Si el sonido no est� en reproducci�n, lo reproducimos
    if (clickSound.paused || clickSound.ended) {
        clickSound.play().catch((error) => {
            console.error('Error al reproducir el sonido:', error);
        });
    }
}
// Funci�n para reproducir un sonido aleatorio
function playRandomClickSound() {
    // Elegir un sonido aleatorio de la lista
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];

    // Verificar si el sonido est� en reproducci�n
    if (randomSound.paused || randomSound.ended) {
        randomSound.play().catch((error) => {
            console.error('Error al reproducir el sonido:', error);
        });
    }
}

// Funci�n de clic
clickButton.addEventListener('click', () => {
     playRandomClickSound();

    // Aqu� solo aplicamos el multiplicador normal
    score += multiplier; // Ya se cuenta el multiplicador correctamente
    updateDisplay();
});

// Funci�n para actualizar la pantalla
function updateDisplay() {
    scoreDisplay.innerText = Math.round(score);
    multiplierDisplay.innerText = multiplier;
    autoclickDisplay.innerText = autoclick;
    pointsPerClickDisplay.innerText = `Protogemas por clic: ${multiplier}`; // Actualizar puntos por clic
}

// Mejoras: Multiplicador
multiplierUpgradeButton.addEventListener('click', () => {
    let currentCostMultiplier = baseCostMultiplier * Math.pow(costMultiplier, multiplier - 1);
    
    if (score >= currentCostMultiplier) { // Verifica si tiene suficientes puntos
        // No restamos puntos aqu�, solo mostramos el costo y actualizamos el texto
        score -= currentCostMultiplier
        updateDisplay();
        multiplier += 1000;
        // Actualiza el costo del bot�n
        updateButtonCosts();
        updateDisplay();
    } else {
        alert('No tienes suficientes puntos para mejorar el multiplicador.');
    }
});

// Mejoras: Autoclics
autoclickUpgradeButton.addEventListener('click', () => {
    let currentCostAutoclick = baseCostAutoclick * Math.pow(costAutoclick, autoclick - 1);
    
    if (score >= currentCostAutoclick) { // Verifica si tiene suficientes puntos
        // No restamos puntos aqu�, solo mostramos el costo y actualizamos el texto
        score -= currentCostAutoclick;
        updateDisplay();
        autoclick += 1;
        // Actualiza el costo del bot�n
        updateButtonCosts();
        updateDisplay();
    } else {
        alert('No tienes suficientes puntos para mejorar el autoclic.');
    }
});

updateButtonCosts();

// Funci�n para autoclics autom�ticos
setInterval(() => {
    if (autoclick > 0) {
        score += autoclick * multiplier;
        updateDisplay();
    }
}, autoclickRate);

// Funcionalidad para comprar el personaje
buyCharacterButton.addEventListener('click', () => {
    // El precio del personaje empieza en 1000 y se duplica con cada compra
    let price = 1000 * Math.pow(2, characterPurchased); // El precio aumenta con cada compra

    if (score >= price) {
        // Restamos los puntos al comprar el personaje
        score -= price;
        autoclick = 0; // Restablecemos los autoclicks a 0

        characterPurchased++;

        // Reiniciamos el multiplicador al valor inicial (2) y luego lo duplicamos con cada compra
        multiplier = 2 * characterPurchased; // Empezamos en 2, luego 4, luego 8, etc.

         // Aumentamos el contador de personajes comprados
        updateDisplay();
        updateButtonCosts();

        // Elegimos una imagen aleatoria sin repetir
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * characterImages.length);
        } while (randomIndex === lastCharacterImageIndex);  // Evitar la repetici�n
        lastCharacterImageIndex = randomIndex;

        // Creamos la nueva imagen del personaje
        const newCharacterImage = document.createElement('div');
        newCharacterImage.style.backgroundImage = `url('images/${characterImages[randomIndex]}')`; 
        newCharacterImage.style.width = '100px'; // Tama�o de la imagen del personaje
        newCharacterImage.style.height = '200px';
        newCharacterImage.style.backgroundSize = 'contain';
        newCharacterImage.style.backgroundPosition = 'center';
        newCharacterImage.style.backgroundRepeat = 'no-repeat';
        newCharacterImage.style.marginLeft = '10px'; // Espacio entre Ganyu y el personaje

        // A�adimos la nueva imagen del personaje al contenedor de personajes
        characterContainer.appendChild(newCharacterImage);

        // Actualizamos el bot�n para permitir m�s compras de personajes
        buyCharacterButton.textContent = `Comprar otro personaje (Costo: ${1000 * Math.pow(2, characterPurchased)} Protogemas)`; // Muestra el precio actual
    } else {
        alert('No tienes suficientes puntos para comprar el personaje.');
    }
});
