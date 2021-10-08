cnv = document.getElementById('canvas');
ctx = cnv.getContext('2d');
document.addEventListener('keydown', keyPush);
var tail = 3;

var xVelocity=yVelocity=0;
var xPlayer=yPlayer=10;
var gridSize=tileCount=20;
var xApple=yApple=15;
var trail=[];

var store = window.localStorage;

var initialArray = [];
var btnNewGameEl = document.getElementById('new-game');
var btnSaveInitials = document.getElementById('store-initials');
var btnClearScores = document.getElementById('clear-scores');
var inpInitials = document.getElementById('initials');
var lblInitials = document.getElementById('label');
var listingEl = document.getElementById('listing');

var newGameHandler = () => {
    inpInitials.style.display = 'none';
    lblInitials.style.display = 'none';
    btnSaveInitials.style.display = 'none';
    running = true;
    tail = 3;
    interval = setInterval(game, 1000/tail);
}

var saveInitialsHandler = () => {
    initialArray = JSON.parse(store.getItem('scores'));
    if (initialArray == null) {
        initialArray = [];
    }
    initialArray.push({initial:inpInitials.value, score:tail});
    store.setItem('scores', JSON.stringify(initialArray));
    inpInitials.value = '';
    updateHighScores();
}

var clearScoresHandlers = () => {
    store.setItem('scores', JSON.stringify([]));
    initialArray = [];
    updateHighScores();
}

btnNewGameEl.addEventListener('click', newGameHandler);
btnClearScores.addEventListener('click', clearScoresHandlers);
btnSaveInitials.addEventListener('click', saveInitialsHandler);

function updateHighScores() {
    initialArray = JSON.parse(store.getItem('scores'));
    listingEl.textContent = '';
    initialArray.forEach((value)=> {
        var node = document.createElement('li');
        var textNode = document.createTextNode(value.initial + ':' + value.score);
        node.appendChild(textNode);
        listingEl.appendChild(node);
    });
}

function game() {
    running = true;
    xPlayer+=xVelocity;
    yPlayer+=yVelocity;
    if (xPlayer<0) {
        xPlayer=tileCount - 1;
    }
    if (xPlayer>tileCount - 1) {
        xPlayer=0;
    }
    if (yPlayer<0) {
        yPlayer=tileCount - 1;
    }
    if (yPlayer>tileCount - 1) {
        yPlayer=0;
    }

    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,cnv.width,cnv.height);

    ctx.fillStyle = 'lime';
    for (var i=0; i<trail.length; i++) {
        ctx.fillRect(trail[i].x*gridSize,trail[i].y*gridSize,gridSize-2,gridSize-2);
        if (trail[i].x==xPlayer&&trail[i].y==yPlayer) {
            endGame();
        }
    }
    trail.push({x:xPlayer,y:yPlayer});
    while(trail.length>tail) {
        trail.shift();
    }

    if (xPlayer==xApple&&yPlayer==yApple) {
        console.log('eat that apple');
        clearInterval(interval);
        interval = setInterval(game, 1000/tail);
        tail++;
        xApple=Math.floor(Math.random()*tileCount);
        yApple=Math.floor(Math.random()*tileCount);
    }
    
    ctx.fillStyle = 'red';
    ctx.fillRect(xApple*gridSize,yApple*gridSize,gridSize-2,gridSize-2);
}

function endGame() {
    running = false; 
    clearInterval(interval);
    lblInitials.style.display = 'block';
    inpInitials.style.display = 'block';
    btnSaveInitials.style.display = 'block';
}

function keyPush(event) {
    switch(event.keyCode) {
        case 32:
            if (running) {
                running = false;
                clearInterval(interval);
            } else {
                interval = setInterval(game, 1000/tail);
            }
            break;
        case 37:
            xVelocity=-1;
            yVelocity=0;
            break;
        case 38:
            xVelocity=0;
            yVelocity=-1;
            break;
        case 39:
            xVelocity=1;
            yVelocity=0;
            break;
        case 40:
            xVelocity=0;
            yVelocity=1;
            break;
    }
}

xVelocity = -1;
inpInitials.style.display = 'none';
lblInitials.style.display = 'none';
btnSaveInitials.style.display = 'none';
updateHighScores();
interval = setInterval(game, 1000/tail);