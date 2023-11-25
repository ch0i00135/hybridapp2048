const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(__dirname + '/'));
app.use(cookieParser());

// 기본 라우트
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/2048.html');
});
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

// 로그아웃 처리 라우트
app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.clearCookie('best');
    res.redirect('/');
});

// 로그인 처리 라우트
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const accounts = loadAccounts();
    const user = accounts.find(account => account.username === username && account.password === password);
    if (user) {
        res.cookie('username', username);
        res.cookie('best', user.best);
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// 가입 처리 라우트
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    if (isUsernameTaken(username)) {
        res.status(400).json({ success: false });
    } else {
        const accounts = loadAccounts();
        accounts.push({ username, password, "best": "0" });
        saveAccounts(accounts);

        res.json({ success: true });
    }
});

// 게임오버
app.post('/gameover', (req, res) => {
    const { loggedinUsername, newBestScore } = req.body;

    let accounts = loadAccounts();
    const user = accounts.find(account => account.username === loggedinUsername );
    accounts=accounts.filter(account=> account!==user);
    accounts.push({username:user.username, password:user.password, best:newBestScore });
    saveAccounts(accounts);
    if (user) {
        //user.best=newBestScore;
        res.cookie('username', loggedinUsername);
        res.cookie('best', newBestScore);
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// 계정 정보를 JSON 파일에서 읽어오는 함수
function loadAccounts() {
    try {
        const data = fs.readFileSync('userdata.json', 'utf8');
        return JSON.parse(data) || [];
    } catch (error) {
        return [];
    }
}

// 계정 정보를 JSON 파일에 저장하는 함수
function saveAccounts(accounts) {
    fs.writeFileSync('userdata.json', JSON.stringify(accounts), 'utf8');
}

// 사용자 이름 중복 확인 함수
function isUsernameTaken(username) {
    const accounts = loadAccounts();
    return accounts.some(account => account.username === username);
}
