/*const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/chinook.db');

// insert one row into the student table
db.run(`INSERT INTO student(name, email) VALUES('이종현', '1428ksu@gmail.com')`, function (err){
    if (err){
        return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
});

// close the database connection
db.close();
*/




const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
//172.18.27.190
app.use(bodyParser.json());

// 가상의 사용자 데이터베이스
const users = [
    { username: "elflee", password: "ihateyou" },
    { username: "사용자2", password: "비밀번호2" }
];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/../index.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    let user = null;

    for (let i = 0; i < users.length; i++) {
        const u = users[i];
        if (u.username === username && u.password === password) {
            user = u;
            break;
        }
    }

    //const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ success: true , name: username});
    } else {
        res.json({ success: false });
    }
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});