// Images
const allImages = [
    'apple.png',
    'banana.png',
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
        const numDuplicates = isDecoy ? Math.floor(Math.random() * 3) + 1 : 1;
        
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


        //click
        img.addEventListener('click', function () {
            if (img.dataset.item === findList[currentCorrectIndex].split('.')[0]) {
                img.style.display = 'none';
                const itemText = document.getElementById(img.dataset.item);
                if (itemText) {
                    itemText.style.textDecoration = 'line-through';
                }

                currentCorrectIndex++;

                //reward
                remainingTime += 2;
                document.getElementsByClassName('timerDisplay')[0].innerHTML = '00:' + (remainingTime < 10 ? '0' : '') + remainingTime;

                if (currentCorrectIndex === findList.length) {
                    gameWin();
                }
            } else {
                alert('Wrong item or wrong order! Try again.');
            }
        });
        gameContainer.appendChild(img);
        }
        });
    }


// Game Over
function gameOver(){
    clearInterval(timer);
    document.querySelector('h2').innerHTML = 'GAME OVER';

    const gameImages = document.getElementsByClassName('game-image');
    
    for (let i = 0; i < findList.length; i++) {
        const imageName = findList[i];
        const image = document.querySelector(`img[data-item="${imageName.split('.')[0]}"]`);
    
        if (image && image.style.display !== 'none') {
            image.style.pointerEvents = 'none';
            image.style.transform = 'scale(1.5)';
            image.style.animation = 'blink 2s infinite';
        }
    }
}

// Game Win
function gameWin(){
    clearInterval(timer);
    document.querySelector('h2').innerHTML = 'YOU WIN';

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