
let game=false;
let fx=0;
let fy=0;
const gameoversound = new Audio('deadth.wav')
const foodsound = new Audio('beep.wav')
const highscoresound = new Audio('highscoresound.wav')
const gamesound = new Audio('gamecontisound.mp3')
let sx=Math.floor(Math.random()*31);;
let intervalid;
let sy=Math.floor(Math.random()*31);;
let velx=0;
let vely=0;
let sb=[];
let score=0;

const pboard=document.getElementsByClassName("board")[0];
const scoreelem=document.getElementsByClassName("sc")[0];
const highscoreelem=document.getElementsByClassName("hsc")[0];
let highscore = localStorage.getItem("high-score") || 0;

highscoreelem.innerText = `High Score: ${highscore}`;
gamesound.play()

const startNormalGlow = () => {
    document.querySelector('.main').classList.remove('celebrate-glow');
    document.querySelector('.heaad').classList.remove('celebrate-glow');
};

const startCelebrateGlow = () => {
    document.querySelector('.main').classList.add('celebrate-glow');
    document.querySelector('.heaad').classList.add('celebrate-glow');
    setTimeout(startNormalGlow, 3000);
}
const overdo = () => {
    
    startCelebrateGlow();
    setTimeout(() => {
        location.reload();
    }, 1000);
    gameoversound.play()
    gamesound.pause()
    alert("Game over! Press OK to replay");
    clearInterval(intervalid);
};
const changefpos=()=>{
    fx=Math.floor(Math.random()*31);
    fy=Math.floor(Math.random()*31);
}
const changeD = (e) => {
    if (e.keyCode === 65 && vely !== 1) { // W key
        velx = 0;
        vely = -1;
    } else if (e.keyCode === 68 && vely !== -1) { // S key
        velx = 0;
        vely = 1;
    } else if (e.keyCode === 87 && velx !== 1) { // A key
        velx = -1;
        vely = 0;
    } else if (e.keyCode === 83 && velx !== -1) { // D key
        velx = 1;
        vely = 0;
    }
    initg();
}
document.addEventListener("DOMContentLoaded", () => {
    const controls = document.querySelectorAll(".controls i");
    
    controls.forEach(button => {
        button.addEventListener("click", () => {
            const key = button.dataset.key;
            const fakeEvent = { keyCode: key.charCodeAt(0) };
            changeD(fakeEvent);
            clearInterval(intervalid);
            intervalid = setInterval(initg, 125);
        });
    });
});



const initg = () => {
    if (game) {
        overdo();
        return;
    }

    // Updating snake's segments positions
    for (let i = sb.length - 1; i > 0; i--) {
        sb[i] = sb[i - 1];
    }
    sb[0] = [sx, sy];

    // Checking collision with food
    if (sx === fx && sy === fy) {
        changefpos();
        sb.push([fx, fy]);
        foodsound.play()
        score = score + 1;
        highscore = score >= highscore ? score : highscore;
        localStorage.setItem("high-score", highscore);
        scoreelem.innerText = `Score: ${score}`;
        
        if (score > highscore) {
            highscore = score;
            highscoresound.play()
            localStorage.setItem("high-score", highscore);
            highscoreelem.innerText = `High Score: ${highscore}`;
            startCelebrateGlow(); 
    }
}

    // Updating the snake's head position
    sx += velx;
    sy += vely;

    // Checking for collision with walls
    if (sx <= 0 || sx > 30 || sy <= 0 || sy > 30) {
        game = true;
    }

    // Checking for  collision with own body
    for (let i = 1; i < sb.length; i++) {
        if (sb[0][0] === sb[i][0] && sb[0][1] === sb[i][1]) {
            game = true;
        }
    }

    // adding HTML for the game board
    let htmltext = `<div class="food" style="grid-area:${fx}/${fy}"></div>`;
    for (let i = 0; i < sb.length; i++) {
        htmltext += `<div class="head" style="grid-area:${sb[i][0]}/${sb[i][1]}; animation: glow 0.5s ${0.2 * i}s infinite;"></div>`;
    }

    pboard.innerHTML = htmltext;
};

changefpos();
intervalid=setInterval(initg,125);
document.addEventListener("keydown", changeD)

