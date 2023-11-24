const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(__dirname + '/'));

// 기본 라우트
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/2048.html');
});

// 가입 페이지 라우트
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

// 로그인 페이지 라우트
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// 가입 처리 라우트
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // 가입 로직: 사용자 이름 중복 확인
    if (isUsernameTaken(username)) {
        res.status(400).send('Username is already taken. Please choose another username.');
    } else {
        // 사용자 이름이 중복되지 않으면 계정 정보를 JSON 파일에 저장
        const accounts = loadAccounts();
        accounts.push({ username, password });
        saveAccounts(accounts);

        res.redirect('/');
    }
});

// 로그인 처리 라우트
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 로그인 로직: 계정 정보를 JSON 파일에서 확인
    const accounts = loadAccounts();
    const user = accounts.find(account => account.username === username && account.password === password);

    if (user) {
        res.send(`User ${username} 로그인 성공`);
    } else {
        res.send('username 및 password를 확인하세요');
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// 계정 정보를 JSON 파일에서 읽어오는 함수
function loadAccounts() {
    try {
        const data = fs.readFileSync('accounts.json', 'utf8');
        return JSON.parse(data) || [];
    } catch (error) {
        return [];
    }
}

// 계정 정보를 JSON 파일에 저장하는 함수
function saveAccounts(accounts) {
    fs.writeFileSync('accounts.json', JSON.stringify(accounts), 'utf8');
}

// 사용자 이름 중복 확인 함수
function isUsernameTaken(username) {
    const accounts = loadAccounts();
    return accounts.some(account => account.username === username);
}
