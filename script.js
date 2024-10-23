let character = document.getElementById("character");
let block = document.getElementById("block");
let scoreDisplay = document.getElementById("score");
let superPowerTimerDisplay = document.getElementById("superPowerTimer");
let superPowerTime = document.getElementById("superPowerTime");
let powerUpBar = document.getElementById("powerUpBar");
let powerUpFill = document.getElementById("powerUpFill");
let superPowerNotification = document.getElementById("superPowerNotification");
let highScoreDisplay = document.getElementById("highScore");

let score = 0;
let superPowerAvailable = false;
let superPowerActive = false;
let superPowerDuration = 3; // Duration of the super power in seconds
let superPowerCooldown = 3; // Cooldown period for the super power in seconds
let isJumping = false; // Flag to prevent multiple jumps

let highScore = getCookie("highScore") || 0;
highScoreDisplay.innerText = "High Score: " + highScore;

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie;
    console.log(ca)
        while (ca.charAt(0) == ' ') ca = ca.substring(1, ca.length);
        if (ca.indexOf(nameEQ) == 0) return ca.substring(nameEQ.length, ca.length);
    return null;
}

function jump() {
    if (!isJumping && !superPowerActive) {
        isJumping = true;
        character.classList.add("animate");
        setTimeout(() => {
            character.classList.remove("animate");
            isJumping = false;
        }, 500);
    }
}

function superjump() {
    console.log("Super jump activated");

    if (!superPowerActive) return;

    let initialBottom = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
    let maxBottom = initialBottom + 100; // Adjust this value for desired jump height

    let superJumpInterval = setInterval(() => {
        let currentBottom = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
        if (currentBottom < maxBottom) {
            character.style.bottom = (currentBottom + 2) + "px";
        } else {
            clearInterval(superJumpInterval);
        }
    }, 10);

    setTimeout(() => {
        clearInterval(superJumpInterval);
        let fallInterval = setInterval(() => {
            let currentBottom = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
            if (currentBottom > initialBottom) {
                character.style.bottom = (currentBottom - 2) + "px";
            } else {
                clearInterval(fallInterval);
                character.style.bottom = initialBottom + "px";
                superPowerActive = false;
            }
        }, 10);
    }, superPowerDuration * 1000);
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'KeyG') {
        console.log("G key pressed");
        activateSuperPower();
    }
});

function activateSuperPower() {
    console.log("Super power activated");

    if (superPowerAvailable && !superPowerActive && !isJumping) {
        superPowerActive = true;
        superPowerAvailable = false;
        superPowerTimerDisplay.classList.remove("hidden");
        superPowerNotification.classList.add("hidden");

        let superPowerTimer = superPowerDuration;
        superPowerTime.innerText = superPowerTimer;

        let superPowerInterval = setInterval(() => {
            superPowerTimer--;
            superPowerTime.innerText = superPowerTimer;

            if (superPowerTimer <= 0) {
                clearInterval(superPowerInterval);
                superPowerActive = false;
                superPowerTimerDisplay.classList.add("hidden");
                startPowerUpCooldown();
            }
        }, 1000);

        superjump(); // Initiate super jump
    }
}

function startPowerUpCooldown() {
    let cooldownTime = 0;
    powerUpBar.classList.remove("hidden");
    powerUpFill.style.width = "0%";

    let cooldownInterval = setInterval(() => {
        cooldownTime++;
        powerUpFill.style.width = `${(cooldownTime / superPowerCooldown) * 100}%`;

        if (cooldownTime >= superPowerCooldown) {
            clearInterval(cooldownInterval);
            powerUpBar.classList.add("hidden");
            superPowerAvailable = true;
            superPowerNotification.classList.remove("hidden");
        }
    }, 1000);
}

function resetBlockPosition() {
    block.style.display = "block";
    block.style.animation = "none";
    block.style.right = "0px"; // Reset position outside the right edge
    setTimeout(() => {
        block.style.animation = "blockMove 1.5s infinite linear";
    }, 100); // Small delay to ensure animation reset
}

function checkCollision() {
    let characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
    let characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    let characterRight = characterLeft + parseInt(window.getComputedStyle(character).getPropertyValue("width"));

    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    let blockRight = blockLeft + parseInt(window.getComputedStyle(block).getPropertyValue("width"));
    let blockBottom = parseInt(window.getComputedStyle(block).getPropertyValue("bottom"));
    let blockHeight = parseInt(window.getComputedStyle(block).getPropertyValue("height"));

    if (blockLeft < characterRight && blockRight > characterLeft && characterBottom < blockBottom + blockHeight && characterBottom + parseInt(window.getComputedStyle(character).getPropertyValue("height")) > blockBottom) {
        console.log("Collision detected!");
        block.style.animation = "none";
        block.style.display = "none";
        alert("Game over!");

        if (score > highScore) {
            highScore = score;
            setCookie("highScore", highScore, 365);
            highScoreDisplay.innerText = "High Score: " + highScore;
            saveHighScore(highScore);
        }

        location.reload();
    }

    if (blockRight <= 3) {
        score++;
        console.log("Score incremented: " + score);
        scoreDisplay.innerText = "Score: " + score;
        resetBlockPosition();
    }
}

setInterval(checkCollision, 10);

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        jump();
    } else if (event.code === 'KeyG') {
        activateSuperPower();
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Placeholder images for the games
    let game1Canvas = document.getElementById('game1');
    let game2Canvas = document.getElementById('game2');

    let game1Ctx = game1Canvas.getContext('2d');
    let game2Ctx = game2Canvas.getContext('2d');

    let game1Img = new Image();
    game1Img.src = 'path/to/game1.jpg';  // Path to the game 1 image
    game1Img.onload = function() {
        game1Ctx.drawImage(game1Img, 0, 0, game1Canvas.width, game1Canvas.height);
    };

    let game2Img = new Image();
    game2Img.src = 'path/to/game2.jpg';  // Path to the game 2 image
    game2Img.onload = function() {
        game2Ctx.drawImage(game2Img, 0, 0, game2Canvas.width, game2Canvas.height);
    };
});

function saveHighScore(highscore) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "save_highscore.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Highscore saved successfully");
        }
    };
    xhr.send("highscore=" + highscore);
}

startPowerUpCooldown();
resetBlockPosition();
