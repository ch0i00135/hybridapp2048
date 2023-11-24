const nextText=document.getElementById("text");
        const nextArrow=document.getElementById("arrow");
        const table=document.getElementById("table");
        const currentText=document.getElementById("current");
        var tile=[];
        var ga=[];
        var ranMoveCount=0;
        var ranMoveDir;
        var dontMove;
        var moveChk;
        var score=0;

        class Tile{
            constructor(n,r,c){
                this.n=n;
                this.row=r;
                this.col=c;
                this.chk=false;
                this.bgColor="#CDC1B4";
                this.fontSize="70px";
            }            
            setTile(){
                this.chk=false;
                if(this.n>7)ga[this.row][this.col].style.color="#f9f6f2";
                else ga[this.row][this.col].style.color="#776E65";
                switch(this.n){
                    case 2: this.bgColor="#EEE4DA"; break;
                    case 4: this.bgColor="#EEE1C9"; break;
                    case 8: this.bgColor="#F3B27A"; break;
                    case 16: this.bgColor="#F69664"; break;
                    case 32: this.bgColor="#F77C5F"; break;
                    case 64: this.bgColor="#F75F3B"; break;
                    case 128: this.bgColor="#EDD073"; this.fontSize="65px"; break;
                    case 256: this.bgColor="#EDCC62"; this.fontSize="65px"; break;
                    case 512: this.bgColor="#EDC950"; this.fontSize="65px"; break;
                    case 1024: this.bgColor="#EDC53F"; this.fontSize="55px"; break;
                    case 2048: this.bgColor="#EDC22E"; this.fontSize="55px"; break;
                }
                if(this.n==0){
                    ga[this.row][this.col].innerText="";
                    ga[this.row][this.col].style.backgroundColor="#CDC1B4";
                }                
                else {
                    ga[this.row][this.col].innerText=this.n;
                    ga[this.row][this.col].style.backgroundColor=this.bgColor;
                    ga[this.row][this.col].style.fontSize=this.fontSize;
                }                                
            }
        }

        for(let i=0;i<4;i++){
            let temp=[];
            for(let j=0;j<4;j++){
                temp.push(document.getElementById(i+""+j));
            }
            ga.push(temp);
        }

        for(let i=0;i<4;i++){
            let temp=[];
            for(let j=0;j<4;j++){
                temp.push(new Tile(0,i,j));
            }
            tile.push(temp);
        }
        
        function ranPos(){
            let ran=Math.random()*16;
            let x=ran/4;
            let y=ran%4;

            return [parseInt(x), parseInt(y)];
        }
        
        function ranTileNum(){
            return Math.random()>0.9?4:2;
        }

        function genTile(n){
            let blank=false;
            for(let i=0;i<tile.length;i++){
                for(let j=0;j<tile[i].length;j++){
                    if(tile[i][j].n==0) blank=true;
                }
            }
            var newPos=ranPos();
            while(tile[newPos[0]][newPos[1]].n!=0&&blank){
                newPos=ranPos();
            }
            if(tile[newPos[0]][newPos[1]].n==0) {
                tile[newPos[0]][newPos[1]].n=n;
                highlight(newPos[0], newPos[1])
            }
        }

        function newGame(){
            genTile(2);
            genTile(2);
            ranMove();
        }
        newGame();
        function setAllTile(){
            for(let i=0;i<tile.length;i++){
                for(let j=0;j<tile[i].length;j++){
                    tile[i][j].setTile();
                }
            }
            setNextText();
            moveChk=false;
            currentText.innerText="Score: "+score;
        }
        setAllTile();

        function setNextText(){
            let dir;
            switch(ranMoveDir){
                case 0: dir= "↑"; break;
                case 1: dir= "→"; break;
                case 2: dir= "↓"; break;
                case 3: dir= "←"; break;                
            }
            nextText.innerText=ranMoveCount;
            nextArrow.innerText=dir;
        }

        function swap(a1, a2, b1, b2) {
            var temp=tile[a1][a2].n;
            tile[a1][a2].n=tile[b1][b2].n;
            tile[b1][b2].n=temp;        
            moveChk=true;
        }
        function merge(a1, a2, b1, b2) {            
            tile[a1][a2].chk=true;
            tile[a1][a2].n *= 2;
            tile[b1][b2].n = 0;
            score++;
            moveChk=true;
        }

        document.addEventListener('keyup', keyUp);
        function keyUp(e){
            if(!dontMove){
                switch(e.key){                
                    case "ArrowUp": 
                        MoveUp();             
                        genTile(ranTileNum());
                        break;
                    case "ArrowRight":  
                        MoveRight();             
                        genTile(ranTileNum());
                        break;
                    case "ArrowDown": 
                        MoveDown();             
                        genTile(ranTileNum());
                        break;
                    case "ArrowLeft": 
                        MoveLeft();             
                        genTile(ranTileNum());
                        break;
                } 
            }                       
        }

        function move(x, y){
            table.style.transform = `translate(${x}px, ${y}px)`;
            setTimeout(() => {
                table.style.transform = 'none';
            }, 200);
        }
        function highlight(x, y){
            ga[x][y].style.background = "#ffffff";
            setTimeout(() => {
                tile[x][y].setTile();
            }, 200);
        }       

        function ranMove(){
            ranMoveCount=Math.floor(Math.random()*16+6);
            ranMoveDir=Math.floor(Math.random()*4);            
            setNextText();
        } 

        function ranMoveTile(){
            dontMove=false;
            switch(ranMoveDir){
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
                        let k=i;
                        while(k>0){
                            if (tile[k - 1][j].n === 0) {                                
                                swap(k - 1, j, k, j);
                            }
                            if (tile[k - 1][j].n === tile[k][j].n&&!tile[k - 1][j].chk&&!tile[k][j].chk) {
                                merge(k - 1, j, k, j);
                            }
                            k--;
                        }
                    }
                }
            }
            if(!moveChk)return;
            ranMoveCount--;
            setAllTile();
            if(ranMoveCount==0){
                dontMove=true;
                setTimeout(() => {
                    ranMoveTile();
                }, 500);
            }
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
                            if (tile[k + 1][j].n === tile[k][j].n&&!tile[k + 1][j].chk&&!tile[k][j].chk) {
                                merge(k + 1, j, k, j);
                            }
                            k++;
                        }
                    }
                }
            }
            if(!moveChk)return;
            ranMoveCount--;
            setAllTile();
            if(ranMoveCount==0){
                dontMove=true;
                setTimeout(() => {
                    ranMoveTile();
                }, 500);
            }
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
                            if (tile[i][k - 1].n === tile[i][k].n&&!tile[i][k - 1].chk&&!tile[i][k].chk) {
                                merge(i, k - 1, i, k);
                            }
                            k--;
                        }
                    }
                }
            }
            if(!moveChk)return;
            ranMoveCount--;
            setAllTile();
            if(ranMoveCount==0){
                dontMove=true;
                setTimeout(() => {
                    ranMoveTile();
                }, 500);
            }
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
                            if (tile[i][k + 1].n === tile[i][k].n&&!tile[i][k + 1].chk&&!tile[i][k].chk) {
                                merge(i, k + 1, i, k);
                            }
                            k++;
                        }
                    }
                }
            }
            if(!moveChk)return;
            ranMoveCount--;
            setAllTile();
            if(ranMoveCount==0){
                dontMove=true;
                setTimeout(() => {
                    ranMoveTile();
                }, 500);
            }
        }