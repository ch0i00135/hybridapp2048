const nextText = document.getElementById("text");
const nextArrow = document.getElementById("arrow");
const table = document.getElementById("table");
const currentText = document.getElementById("current");
const bestText = document.getElementById("best");
const usernameDisplay = document.getElementById('username-display');
const retryBtn = document.getElementById('retry');
var loggedinUsername;
var bestScore;
var tile = [];
var ga = [];
var ranMoveCount = 0;
var ranMoveDir;
var dontMove;
var moveChk;
var score = 0;
var touchStartX, touchStartY;
var touchEndX, touchEndY;
var isRan = false;

class Tile {
    constructor(n, r, c) {
        this.n = n;
        this.row = r;
        this.col = c;
        this.chk = false;
        this.bgColor = "#CDC1B4";
        this.fontSize = "70px";
    }
    setTile() {
        this.chk = false;
        if (this.n > 7) ga[this.row][this.col].style.color = "#f9f6f2";
        else ga[this.row][this.col].style.color = "#776E65";
        switch (this.n) {
            case 2: this.bgColor = "#EEE4DA"; break;
            case 4: this.bgColor = "#EEE1C9"; break;
            case 8: this.bgColor = "#F3B27A"; break;
            case 16: this.bgColor = "#F69664"; break;
            case 32: this.bgColor = "#F77C5F"; break;
            case 64: this.bgColor = "#F75F3B"; break;
            case 128: this.bgColor = "#EDD073"; this.fontSize = "65px"; break;
            case 256: this.bgColor = "#EDCC62"; this.fontSize = "65px"; break;
            case 512: this.bgColor = "#EDC950"; this.fontSize = "65px"; break;
            case 1024: this.bgColor = "#EDC53F"; this.fontSize = "55px"; break;
            case 2048: this.bgColor = "#EDC22E"; this.fontSize = "55px"; break;
        }
        if (this.n == 0) {
            ga[this.row][this.col].innerText = "";
            ga[this.row][this.col].style.backgroundColor = "#CDC1B4";
        }
        else {
            ga[this.row][this.col].innerText = this.n;
            ga[this.row][this.col].style.backgroundColor = this.bgColor;
            ga[this.row][this.col].style.fontSize = this.fontSize;
        }
    }
}

for (let i = 0; i < 4; i++) {
    let temp = [];
    for (let j = 0; j < 4; j++) {
        temp.push(document.getElementById(i + "" + j));
    }
    ga.push(temp);
}

for (let i = 0; i < 4; i++) {
    let temp = [];
    for (let j = 0; j < 4; j++) {
        temp.push(new Tile(0, i, j));
    }
    tile.push(temp);
}

function ranTileNum() {
    return Math.random() > 0.9 ? 4 : 2;
}

function genTile(n) {
    let blankSpaces = [];

    for (let i = 0; i < tile.length; i++) {
        for (let j = 0; j < tile[i].length; j++) {
            if (tile[i][j].n === 0) {
                blankSpaces.push({ row: i, col: j });
            }
        }
    }

    if (blankSpaces.length > 0) {
        let randomIndex = Math.floor(Math.random() * blankSpaces.length);
        let newPos = blankSpaces[randomIndex];
        tile[newPos.row][newPos.col].n = n;
        highlight(newPos.row, newPos.col);
    } else if (blankSpaces.length === 0) {
        if (!canMove()) {
            retryBtn.style.display = 'block';
        }
    }
}

function canMove() {
    for (let i = 0; i < tile.length; i++) {
        for (let j = 0; j < tile[i].length - 1; j++) {
            if (tile[i][j].n === tile[i][j + 1].n) {
                return true;
            }
        }
    }

    for (let i = 0; i < tile.length - 1; i++) {
        for (let j = 0; j < tile[i].length; j++) {
            if (tile[i][j].n === tile[i + 1][j].n) {
                return true;
            }
        }
    }

    return false;
}

function refresh() {
    window.location.replace('http://localhost:3000');
}

function gameOver() {
    let newBestScore = parseInt(bestScore.replace(" ", ""));
    if (score > newBestScore) {
        newBestScore = score + "";
    } else {
        newBestScore = newBestScore + "";
    }
    fetch('/gameover', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loggedinUsername, newBestScore }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('gameover');
                refresh();
            } else {
                console.log("오류");
            }
        })
        .catch(error => console.error(error));
}

function newGame() {
    genTile(2);
    genTile(2);
    ranMove();
}
newGame();
function setAllTile() {
    for (let i = 0; i < tile.length; i++) {
        for (let j = 0; j < tile[i].length; j++) {
            tile[i][j].setTile();
        }
    }
    setNextText();
    moveChk = false;
    currentText.innerText = "Score: " + score;
}
setAllTile();

function setNextText() {
    let dir;
    switch (ranMoveDir) {
        case 0: dir = "↑"; break;
        case 1: dir = "→"; break;
        case 2: dir = "↓"; break;
        case 3: dir = "←"; break;
    }
    nextText.innerText = ranMoveCount;
    nextArrow.innerText = dir;
}

function swap(a1, a2, b1, b2) {
    var temp = tile[a1][a2].n;
    tile[a1][a2].n = tile[b1][b2].n;
    tile[b1][b2].n = temp;
    moveChk = true;
}
function merge(a1, a2, b1, b2) {
    tile[a1][a2].chk = true;
    tile[a1][a2].n *= 2;
    tile[b1][b2].n = 0;
    score++;
    if (tile[a1][a2].n === 2048) {
        score += 1000;
        gameOver();
    }
    moveChk = true;
}

document.addEventListener('keyup', keyUp);
function keyUp(e) {
    if (!dontMove) {
        switch (e.key) {
            case "ArrowUp":
                MoveUp();
                break;
            case "ArrowRight":
                MoveRight();
                break;
            case "ArrowDown":
                MoveDown();
                break;
            case "ArrowLeft":
                MoveLeft();
                break;
        }
    }
}


table.addEventListener('touchstart', function (event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

table.addEventListener('touchmove', function (event) {
    touchEndX = event.touches[0].clientX;
    touchEndY = event.touches[0].clientY;
});

table.addEventListener('touchend', function () {
    // 이동 방향 계산
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // 이동 방향에 따라 함수 호출
    if (!dontMove) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // 가로로 이동
            if (deltaX > 0) {
                MoveRight();
            } else {
                MoveLeft();
            }
        } else {
            // 세로로 이동
            if (deltaY > 0) {
                MoveDown();
            } else {
                MoveUp();
            }
        }
    }
});

function move(x, y) {
    table.style.transform = `translate(${x}px, ${y}px)`;
    setTimeout(() => {
        table.style.transform = 'none';
    }, 200);
}
function highlight(x, y) {
    ga[x][y].style.background = "#ffffff";
    setTimeout(() => {
        tile[x][y].setTile();
    }, 200);
}

function ranMove() {
    ranMoveCount = Math.floor(Math.random() * 16 + 6);
    ranMoveDir = Math.floor(Math.random() * 4);
    setNextText();
}

function ranMoveTile() {
    dontMove = false;
    isRan = true;
    switch (ranMoveDir) {
        case 0:
            MoveUp();
            move(0, -20);
            break;
        case 1:
            MoveRight();
            move(20, 0);
            break;
        case 2:
            MoveDown();
            move(0, 20);
            break;
        case 3:
            MoveLeft();
            move(-20, 0);
            break;
    }
    ranMove();
}

function MoveUp() {
    for (let i = 1; i < tile.length; i++) {
        for (let j = 0; j < tile.length; j++) {
            if (tile[i][j].n !== 0) {
                let k = i;
                while (k > 0) {
                    if (tile[k - 1][j].n === 0) {
                        swap(k - 1, j, k, j);
                    }
                    if (tile[k - 1][j].n === tile[k][j].n && !tile[k - 1][j].chk && !tile[k][j].chk) {
                        merge(k - 1, j, k, j);
                    }
                    k--;
                }
            }
        }
    }
    if (!moveChk) return;
    ranMoveCount--;
    setAllTile();
    if (isRan) {
        isRan = false;
        return;
    }
    if (ranMoveCount == 0) {
        dontMove = true;
        setTimeout(() => {
            ranMoveTile();
        }, 500);
    }
    genTile(ranTileNum());
}
function MoveDown() {
    for (let i = tile.length - 2; i >= 0; i--) {
        for (let j = 0; j < tile[i].length; j++) {
            if (tile[i][j].n !== 0) {
                let k = i;
                while (k < tile.length - 1) {
                    if (tile[k + 1][j].n === 0) {
                        swap(k + 1, j, k, j);
                    }
                    if (tile[k + 1][j].n === tile[k][j].n && !tile[k + 1][j].chk && !tile[k][j].chk) {
                        merge(k + 1, j, k, j);
                    }
                    k++;
                }
            }
        }
    }
    if (!moveChk) return;
    ranMoveCount--;
    setAllTile();
    if (isRan) {
        isRan = false;
        return;
    }
    if (ranMoveCount == 0) {
        dontMove = true;
        setTimeout(() => {
            ranMoveTile();
        }, 500);
    }
    genTile(ranTileNum());
}
function MoveLeft() {
    for (let i = 0; i < tile.length; i++) {
        for (let j = 1; j < tile[i].length; j++) {
            if (tile[i][j].n !== 0) {
                let k = j;
                while (k > 0) {
                    if (tile[i][k - 1].n === 0) {
                        swap(i, k - 1, i, k);
                    }
                    if (tile[i][k - 1].n === tile[i][k].n && !tile[i][k - 1].chk && !tile[i][k].chk) {
                        merge(i, k - 1, i, k);
                    }
                    k--;
                }
            }
        }
    }
    if (!moveChk) return;
    ranMoveCount--;
    setAllTile();
    if (isRan) {
        isRan = false;
        return;
    }
    if (ranMoveCount == 0) {
        dontMove = true;
        setTimeout(() => {
            ranMoveTile();
        }, 500);
    }
    genTile(ranTileNum());
}
function MoveRight() {
    for (let i = 0; i < tile.length; i++) {
        for (let j = tile[i].length - 2; j >= 0; j--) {
            if (tile[i][j].n !== 0) {
                let k = j;
                while (k < tile[i].length - 1) {
                    if (tile[i][k + 1].n === 0) {
                        swap(i, k + 1, i, k);
                    }
                    if (tile[i][k + 1].n === tile[i][k].n && !tile[i][k + 1].chk && !tile[i][k].chk) {
                        merge(i, k + 1, i, k);
                    }
                    k++;
                }
            }
        }
    }
    if (!moveChk) return;
    ranMoveCount--;
    setAllTile();
    if (isRan) {
        isRan = false;
        return;
    }
    if (ranMoveCount == 0) {
        dontMove = true;
        setTimeout(() => {
            ranMoveTile();
        }, 500);
    }
    genTile(ranTileNum());
}
// 로그인
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                bestScore = data.best;
                loggedinUsername = data.username;
                pageload();
            } else {
                document.getElementById("result").textContent = "아이디 또는 비밀번호를 확인해주세요.";
            }
        })
        .catch(error => console.error(error));
});

// 페이지 로드
window.onload = pageload;
function pageload() {
    const cookies = document.cookie.split(';');
    loggedinUsername = cookies.find(cookie => cookie.trim().startsWith('username='));
    bestScore = cookies.find(cookie => cookie.trim().startsWith('best='));
    if (loggedinUsername) {
        loggedinUsername = loggedinUsername.replace('username=', '');
        loggedinUsername = decodeURI(loggedinUsername, "UTF-8")
        bestScore = bestScore.replace('best=', '');
        document.getElementById('loginbox').style.display = 'none';
        document.getElementById('signup').style.display = 'none';
        document.getElementById('logout').style.display = 'block';
    } else {
        loggedinUsername = 'Guest';
        bestScore = "0";
        document.getElementById('loginbox').style.display = 'block';
        document.getElementById('signup').style.display = 'block';
        document.getElementById('logout').style.display = 'none';
    }
    document.getElementById("result").textContent = "";
    bestText.innerText = "Best: " + bestScore;
    usernameDisplay.textContent = "Username: " + loggedinUsername;
}