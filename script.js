//Sounds
const correctSound = new Audio("correct.wav");
const incorrectSound = new Audio("wrong.wav");
const victoryMusic = new Audio("victory.wav");
const gameOverMusic = new Audio("gameOver.mp3");
const groceryMusic = new Audio("grocery.mp3")

groceryMusic.currentTime = 0;
groceryMusic.play();
groceryMusic.loop = true;
groceryMusic.volume = 1;

// Images
const allImages = [
    'green Apple.png',
    'bananas.png',
    'beet.png',
    'carrot.png',
    'eggplant.png',
    'pineapple.png',
    'lemon.png',
    'avocado.png',
    'corn.png',
    'tomato.png',
    'orange.png',
    'pumpkin.png',
    'broccoli.png'
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


//Spawn Images
function spawnImages() {
    const gameContainer = document.getElementsByClassName('gameContainer')[0];
    gameContainer.innerHTML = ""; // Clear previous images

    const shuffledImages = shuffle([...allImages]);

    shuffledImages.forEach(imageSrc => {
        const isDecoy = !findList.includes(imageSrc.split('.')[0]);
        const numDuplicates = isDecoy ? Math.floor(Math.random() * 5) + 1 : 1;
        
        for (let i = 0; i < numDuplicates; i++) {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.classList.add('image', 'game-image');
            img.dataset.item = imageSrc.split('.')[0];

        const imgHeight = 50;  
        const imgWidth = 50;   
        img.style.top = `${Math.random() * (gameContainer.clientHeight - imgHeight - 40)}px`;  
        img.style.left = `${Math.random() * (gameContainer.clientWidth - imgWidth - 40)}px`;  

        //scale
        const randomScale = (Math.random() * 0.6) + 0.8;
        img.style.transform = `scale(${randomScale})`;

        //rotation
        const randomRotation = Math.floor(Math.random() * 360);
        img.style.transform += ` rotate(${randomRotation}deg)`;

        //mirror
        const randomMirror = Math.random() > 0.5 ? -1 : 1;
        img.style.transform += ` scaleX(${randomMirror})`;


        //Click
        img.addEventListener('click', function () {
            if (img.dataset.item === findList[currentCorrectIndex].split('.')[0]) {
                img.classList.add('grow-fade');
                
                //Correct Sound Effect
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

                //reward
                remainingTime += 2;
                document.getElementsByClassName('timerDisplay')[0].innerHTML = '00:' + (remainingTime < 10 ? '0' : '') + remainingTime;

                showRewardEffect(img);

                img.classList.add('grow-fade');

                if (currentCorrectIndex === findList.length) {
                    gameWin();
                }
            } else {
                //alert('Wrong item or wrong order! Try again.');
                showWrongEffect(img);
                //Wrong Sound Effect
                incorrectSound.currentTime = 0;
                incorrectSound.play();
            }
        });
        gameContainer.appendChild(img);
        }
        });
    }

//Reward Effect
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

//Wrong Effect
function showWrongEffect(img) {
    img.style.animation = 'blinkRed 0.5s 3';
}


// Game Over
function gameOver(){
    clearInterval(timer);
    document.querySelector('h2').innerHTML = 'GAME OVER';
    document.querySelector('h2').classList.add('blink-lose-text');

    gameOverMusic.currentTime = 0;
    gameOverMusic.play();
    gameOverMusic.loop = true;

    const gameImages = document.getElementsByClassName('game-image');
    
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
function gameWin(){
    clearInterval(timer);
    document.querySelector('h2').innerHTML = 'YOU WIN';
    document.querySelector('h2').classList.add('dance');

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
let remainingTime = 10;

// Timer
function startTimer(){
    timer = setInterval(function() {
        document.getElementsByClassName('timerDisplay')[0].innerHTML = '00:' + (remainingTime < 10 ? '0' : '') + remainingTime;
        remainingTime--;

        if (remainingTime < 0 && currentCorrectIndex < findList.length) {
            clearInterval(timer);
            gameOver();
        }
    }, 1000);
}

//Run on page load
document.addEventListener('DOMContentLoaded', function() {
    setupFindList();
    spawnImages();
    startTimer();
});

// Refresh Button (Reloads page)
document.getElementsByClassName('refreshButton')[0].addEventListener('click', function() {
    location.reload();
});