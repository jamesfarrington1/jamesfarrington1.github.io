// Images
const imageSources = [
    'apple.png',
    'banana.png',
    'pineapple.png',
    'lemon.png',
    'avocado.png'
];

const backgroundImageSources = [
    'cloud (2).png',
    'mushroom.png',
    'orange.png',
    'pumpkin.png',
    'tree.png'
];

let shuffledImageSources = [];
let currentCorrectIndex = 0;

// Shuffle function
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function spawnImages() {
    const gameContainer = document.getElementsByClassName('gameContainer')[0];
    gameContainer.innerHTML = ""; // Clear previous images

    for (let i = 0; i < shuffledImageSources.length; i++) {
        const img = document.createElement('img');
        img.src = shuffledImageSources[i];
        img.classList.add('image', 'clickable-image');
        img.dataset.item = shuffledImageSources[i].split('.')[0];

        const imgHeight = 50;  
        const imgWidth = 50;   
        img.style.top = `${Math.random() * (gameContainer.clientHeight - imgHeight)}px`;  
        img.style.left = `${Math.random() * (gameContainer.clientWidth - imgWidth)}px`;  

        img.addEventListener('click', function () {
            if (img.dataset.item === shuffledImageSources[currentCorrectIndex].split('.')[0]) {
                img.style.display = 'none';
                const itemText = document.getElementById(img.dataset.item);
                if (itemText) {
                    itemText.style.textDecoration = 'line-through';
                }
                currentCorrectIndex++;
                if (currentCorrectIndex === shuffledImageSources.length) {
                    gameWin();
                }
            } else {
                alert('Wrong item! Try again.');
            }
        });

        gameContainer.appendChild(img);
    }

    // Background images
    const numBackgroundImages = 25;
    const guaranteedBackgroundImages = [...backgroundImageSources];
    const extraBackgroundImages = [];

    for (let i = 0; i < numBackgroundImages - backgroundImageSources.length; i++) {
        const randomIndex = Math.floor(Math.random() * backgroundImageSources.length);
        extraBackgroundImages.push(backgroundImageSources[randomIndex]);
    }
    const allBackgroundImages = [...guaranteedBackgroundImages, ...extraBackgroundImages];
    const shuffledBackgroundImages = shuffle(allBackgroundImages);

    for (let i = 0; i < shuffledBackgroundImages.length; i++) {
        const img = document.createElement('img');
        img.src = shuffledBackgroundImages[i];
        img.classList.add('image', 'background-image');
        img.style.top = `${Math.random() * (gameContainer.clientHeight - 50)}px`;
        img.style.left = `${Math.random() * (gameContainer.clientWidth - 50)}px`;

        gameContainer.appendChild(img);
    }
}

function setupFindList() {
    shuffledImageSources = shuffle([...imageSources]);
    currentCorrectIndex = 0; // Reset tracking
    const findList = document.querySelector('.subheading');
    findList.innerHTML = '<u><b>Find In Order:<b></u><br>';
    shuffledImageSources.forEach(item => {
        const itemName = item.split('.')[0];
        findList.innerHTML += `<span id="${itemName}">${itemName.charAt(0).toUpperCase() + itemName.slice(1)}</span><br>`;
    });
}

// Game Over
function gameOver(){
    clearInterval(timer);
    document.querySelector('h2').innerHTML = 'GAME OVER';
    const clickableImages = document.getElementsByClassName('clickable-image');
    for (let i = 0; i < clickableImages.length; i++) {
        clickableImages[i].style.pointerEvents = 'none';
        clickableImages[i].style.transform = 'scale(1.5)';
        clickableImages[i].style.animation = 'blink 2s infinite';
    }
}

// Game Win
function gameWin(){
    clearInterval(timer);
    document.querySelector('h2').innerHTML = 'YOU WIN';

}



let timer;

// Timer
function startTimer(){
    let sec = 10; // Increased for better gameplay
    timer = setInterval(function() {
        document.getElementsByClassName('timerDisplay')[0].innerHTML = '00:' + (sec < 10 ? '0' : '') + sec;
        sec--;

        if (sec < 0 && currentCorrectIndex < shuffledImageSources.length) {
            clearInterval(timer);
            gameOver();
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', function() {
    setupFindList();
    spawnImages();
    startTimer();
});

// Refresh Button (Reloads page)
document.getElementsByClassName('refreshButton')[0].addEventListener('click', function() {
    location.reload();
});