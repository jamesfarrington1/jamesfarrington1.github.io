// Sounds
const correctSound = new Audio("correct.wav");
const incorrectSound = new Audio("wrong.wav");
const victoryMusic = new Audio("victory.wav");
const gameOverMusic = new Audio("gameOver.mp3");
const beachMusic = new Audio("beach.wav");
beachMusic.currentTime = 0;
beachMusic.play();
beachMusic.loop = true;
beachMusic.volume = 0.3;

// Images
const allImages = [
    'shell.png',
    'oyster.png',
    'beach Ball.png',
    'palm Tree.png',
    'beach Chair.png',
    'umbrella.png',
    'sand Castle.png',
    'clownfish.png',
    'starfish.png',
    'sunglasses.png',
    'jellyfish.png',
    'flip Flop.png',
    'bucket & Shovel.png',
    'kite.png',
    'snorkel Mask.png',
    'sunscreen.png',
    'coconut.png',
    'flamingo Floatie.png'
];

let findList = [];
let currentCorrectIndex = 0;

// Shuffle function
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function setupFindList() {
    findList = shuffle([...allImages]).slice(0,5);
    currentCorrectIndex = 0;

    const findListContainer = document.querySelector('.subheading');
    findListContainer.innerHTML = '<u><b>Find In Order:<b></u><br>';
    findList.forEach(item => {
        const itemName = item.split('.')[0];
        findListContainer.innerHTML += `<span id="${itemName}">${itemName.charAt(0).toUpperCase() + itemName.slice(1)}</span><br>`;
    });
}

// Spawn Images
function spawnImages() {
    const gameContainer = document.getElementsByClassName('gameContainer')[0];
    gameContainer.innerHTML = ""; // Clear previous images

    const shuffledImages = shuffle([...allImages]);

    shuffledImages.forEach(imageSrc => {
        const isDecoy = !findList.includes(imageSrc.split('.')[0]);
        const numDuplicates = isDecoy ? Math.floor(Math.random() * 4) + 1 : 1;
        
        for (let i = 0; i < numDuplicates; i++) {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.classList.add('image', 'game-image');
            img.dataset.item = imageSrc.split('.')[0];

            const imgHeight = 50;  
            const imgWidth = 50;   
            img.style.top = `${Math.random() * (gameContainer.clientHeight - imgHeight - 40)}px`;  
            img.style.left = `${Math.random() * (gameContainer.clientWidth - imgWidth - 40)}px`;  

            // Scale
            const randomScale = (Math.random() * 0.6) + 0.8;
            img.style.transform = `scale(${randomScale})`;

            // Rotation
            const randomRotation = Math.floor(Math.random() * 360);
            img.style.transform += ` rotate(${randomRotation}deg)`;

            // Mirror
            const randomMirror = Math.random() > 0.5 ? -1 : 1;
            img.style.transform += ` scaleX(${randomMirror})`;

            // Click Event
            img.addEventListener('click', function () {
                if (img.dataset.item === findList[currentCorrectIndex].split('.')[0]) {
                    img.classList.add('grow-fade');
                    
                    // Correct Sound Effect
                    correctSound.currentTime = 0;
                    correctSound.play();

                    setTimeout(() => {
                        img.style.display = 'none';
                    }, 1000);

                    const itemText = document.getElementById(img.dataset.item);
                    if (itemText) {
                        itemText.style.textDecoration = 'line-through';
                        itemText.style.color = 'rgb(76, 119, 156)';
                    }

                    currentCorrectIndex++;

                    // Reward
                    remainingTime += 2;
                    document.getElementsByClassName('timerDisplay')[0].innerHTML = '00:' + (remainingTime < 10 ? '0' : '') + remainingTime;

                    showRewardEffect(img);

                    img.classList.add('grow-fade');

                    if (currentCorrectIndex === findList.length) {
                        gameWin();
                    }
                } else {
                    showWrongEffect(img);
                    
                    // Wrong Sound Effect
                    incorrectSound.currentTime = 0;
                    incorrectSound.play();
                }
            });
            gameContainer.appendChild(img);
        }
    });
}

// Reward Effect
function showRewardEffect(img) {
    const rewardText = document.createElement('div');
    rewardText.innerText = "+1 Sec";
    rewardText.classList.add('reward-text');

    const timerRect = document.querySelector('.timerMain').getBoundingClientRect();

    rewardText.style.left = `${timerRect.left + timerRect.width + 45}px`; // Center horizontally under the timer
    rewardText.style.top = `${timerRect.bottom - 50}px`; // 10px below the timer
    rewardText.style.transform = 'translateX(-50%)'; // Center the text
    rewardText.style.opacity = "1";
    rewardText.style.transition = "opacity 1s ease-out";

    document.body.appendChild(rewardText);

    setTimeout(() => {
        rewardText.style.opacity = "0";
        setTimeout(() => rewardText.remove(), 500);
    }, 1000);
}

// Wrong Effect
function showWrongEffect(img) {
    img.style.animation = 'blinkRed 0.5s 3';
}

// Game Over
function gameOver() {
    clearInterval(timer);
    document.querySelector('h2').innerHTML = 'GAME OVER';
    document.querySelector('h2').classList.add('blink-lose-text');

    // Play Game Over Music
    gameOverMusic.currentTime = 0;
    gameOverMusic.play();
    gameOverMusic.loop = true;

    for (let i = 0; i < findList.length; i++) {
        const imageName = findList[i];
        const image = document.querySelector(`img[data-item="${imageName.split('.')[0]}"]`);

        if (image && image.style.display !== 'none') {
            image.style.pointerEvents = 'none';
            image.style.transform = 'scale(1.5)';
            image.style.animation = 'blinkLose 1s infinite';
        }
    }
}

// Game Win
function gameWin() {
    clearInterval(timer);
    document.querySelector('h2').innerHTML = 'YOU WIN';
    document.querySelector('h2').classList.add('dance');

    // Play Victory Music
    victoryMusic.currentTime = 0;
    victoryMusic.play();
    victoryMusic.loop = true;

    const gameImages = document.getElementsByClassName('game-image');

    for (let i = 0; i < gameImages.length; i++) {
        if (gameImages[i].style.display !== 'none') {
            gameImages[i].classList.add('dance');
        }
    }
}

let timer;
let remainingTime = 8;

// Timer
function startTimer() {
    timer = setInterval(function () {
        document.getElementsByClassName('timerDisplay')[0].innerHTML = '00:' + (remainingTime < 10 ? '0' : '') + remainingTime;
        remainingTime--;

        if (remainingTime < 0 && currentCorrectIndex < findList.length) {
            clearInterval(timer);
            gameOver();
        }
    }, 1000);
}

// Run on page load
document.addEventListener('DOMContentLoaded', function () {
    setupFindList();
    spawnImages();
    startTimer();
});

// Refresh Button (Reloads page)
document.getElementsByClassName('refreshButton')[0].addEventListener('click', function () {
    location.reload();
});