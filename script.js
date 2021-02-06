mines = 0;
selectedMines = 0;
time = 0;
field = new Array(30);
field_hidden = new Array(30);
visited = new Array(30);
heigth=0;
width=0;
totalclicked=0;
gameOver = false;
timerID = null;
start=null;
reset=null;
myGameId="";
playerName="";
password="";
game=0;
key="";
opponent="";
turn= "";
winner="";
gamemod=0;
nivel="";
minas=0;
minas_total=0;
myArrayObject = localStorage.getItem("store") || [];

//Ecrã inicial
function initialize(){
	/*document.getElementById("form").style.display="block";
	setPlayerName(document.getElementById("user").value);
	setPassword(document.getElementById("password").value);
	if(playerName==""){
		hideall();
		message("Please choose your name!");
		document.getElementById("back").style.display="block";
	}
	else if(password==""){
		hideall();
		message("Please choose a password!");
		document.getElementById("back").style.display="block";
	}
	else if(playerName!=""){
		register(playerName,password);
	}
	/*
	else if(playerName!="" && passwordvalidation(password)==0)
		hideall();
		message("Your password must have 4 to 12 digits, contain at least one numeric digit, one uppercase and one lowercase letter.")
		document.getElementById("back").style.display="block";
	*/
	home();
}

//Verificar password
/*
function passwordvalidation(pass){
	var lower = /[a-z]/;
	var number = /[0-9]/;
	var reason = "";

	if ((pass.length < 4) || (pass.length > 12) || !lower.test(pass) || !number.test(pass)) {
		return 0;
	} 
	else{
		return 1;
	}
*/


//Registar jogador
function register(name,pw)
{
	//var url= 'http://twserver.alunos.dcc.fc.up.pt:8000/register';
var url= 'http://twserver.alunos.dcc.fc.up.pt:8000/register';

	var params = JSON.stringify({name: name, pass: pw});
	var req = new XMLHttpRequest();
	req.open("POST",url , true);

	req.setRequestHeader("Content-type", "application/json");

	req.onreadystatechange = function() {
		if (req.readyState != 4){
			return ;
		} else if (req.status != 200 ) {
			hideall();
			message("An unexpected error has occured. Please try again later.");
			document.getElementById("back").style.display="block";
		}else{
			var respServer = req.responseText;
			if (respServer != "{}"){
				hideall();
				message("error: name already registed using a different PASSWORD.");
				document.getElementById("back").style.display="block";
			}else{
				home();

			}
		}
	};
	req.send(params);   
}

function setPlayerName(n){
	playerName=n;
}
function setPassword(pw){
	password=pw;
}

function getPassword(){
	return password;
}

function getPlayerName(){
	return playerName;
}


//Esconde todas os elementos
function hideall(){
	document.getElementById("homepage").style.display="none";
	document.getElementById("Expert").style.display="none";
	document.getElementById("gameid").style.display="none";
	document.getElementById("Logout").style.display="none";
	document.getElementById("GameInfo").style.display="none";
	document.getElementById("jogo").style.display="none";
	document.getElementById("rst").style.display="none";
	document.getElementById("bck").style.display="none";
	document.getElementById("back").style.display="none";
	document.getElementById("str").style.display="none";
	document.getElementById("titulo").style.display="none";
	document.getElementById("form").style.display="none";
	document.getElementById("Play").style.display="none";
	document.getElementById("instructions").style.display="none";
	document.getElementById("honor_board").style.display="none";
	document.getElementById("Begin").style.display="none";
	document.getElementById("Interm").style.display="none";
	document.getElementById("message").style.display="none";
	document.getElementById("leave").style.display="none";
	document.getElementById("vs").style.display="none";
	document.getElementById("ownrank").style.display="none";
}

//volta ao ecrã inicial
function logoff(){
	myGameId="";
	playerName="";
	password="";
	hideall();
	document.getElementById("titulo").style.display="block";
	document.getElementById("form").style.display="block";
}


function showRadio(){
	document.getElementById("Play").style.display="block";
	document.getElementById("str").style.display="block";
	document.getElementById("instructions").style.display="none";
	document.getElementById("honor_board").style.display="none";
   // document.getElementById("titulo").style.display="none";
}

function showInstructions(){
	document.getElementById("Logout").style.display="inline-block";
	document.getElementById("gameid").style.display="inline-block";
	document.getElementById("Play").style.display="none";
	document.getElementById("instructions").style.display="block";
	document.getElementById("honor_board").style.display="none";
	document.getElementById("str").style.display="none";
	document.getElementById("form").style.display="none";
    //document.getElementById("titulo").style.display="none";
}


function showHonorBoard()
{   
	document.getElementById("Logout").style.display="inline-block";
	document.getElementById("gameid").style.display="inline-block";
	document.getElementById("Play").style.display="none";
	document.getElementById("honor_board").style.display="block";
	document.getElementById("instructions").style.display="none";
	document.getElementById("str").style.display="none";   
	document.getElementById("form").style.display="none";
    //document.getElementById("titulo").style.display="none"; 
}

//Verifica se são um ou dois jogadores
function letsPlay(){
	var radio1 = document.getElementsByClassName('radio1');
	for (var j = 0; j < radio1.length; j++) {
		if (radio1[j].checked && j==0)
		{
			letsPlay1();
			gamemod=1;
		}else if(radio1[j].checked && j==1)
		{	letsPlay2();
			gamemod=2;
		}
	}
}

//Single Player
function letsPlay1(){

    if (timerID != null) clearInterval(timerID);
    var radios = document.getElementsByClassName('radio');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].type === 'radio' && radios[i].checked) {
            levels(i+1);    
        }
    }
}

//Verifica o nivel escolhido
function levels(i){ 
	hideall();
    start = document.getElementById("str");
    reset = document.getElementById("rst");
    start.style.display = "none";
    reset.style.display = "block";
    document.getElementById("bck").style.display="block";
     document.getElementById("GameInfo").style.display="block";
     document.getElementById("turns").style.display="none";
     document.getElementById("Logout").style.display="inline-block";
	document.getElementById("gameid").style.display="inline-block";
 	if(i==1){
		startGame(9,9,10);
		nivel="beginner";
 	}
	else if(i==2){
		startGame(16,16,40);
		nivel="intermediate";
	}
	else if(i==3){
		startGame(30,16,70);
		nivel="expert";	
	}
}


//Reseta variáveis
function novoJogo()
{
	mines = 0;
	selectedMines = 0;
	time = 0;
	totalclicked=0;
	var tempoDiv = document.getElementById("time");
	tempoDiv.style.display = "none";
	gameOver=false;
		document.getElementById("GameInfo").style.display="block";
	document.getElementById("jogo").style.display="block";

}

function startGame(w, h, m){
	novoJogo();
	width=w;
	heigth=h;
	mines=m;
	minas_total=0;
	minas=1;
	gameOver = false;
	var minesDiv = document.getElementById("NMines");
	minesDiv.innerHTML = mines - selectedMines;
	field = new Array(h);
	field_hidden = new Array(h);
	visited = new Array(h);
	for(var i=0; i<heigth; i++){
		field[i] = new Array(width);	
		field_hidden[i]= new Array(width);
		visited[i] = new Array(width);
	}
	for(var i=0; i<heigth; i++){
		for(var j=0; j<width; j++){
			field[i][j]=0;
			field_hidden[i][j]=0;
			visited[i][j] = 0;
		}
	}
 	//colocar minas
 	var placedMines = 0;
 	var randomRow,randomCol;
 	while(placedMines < mines){

 	       randomRow = Math.floor(Math.random() * h); //nr entre 0 e height
 	       randomCol = Math.floor(Math.random() * w); //nr entre 0 e width  
 	       if(field_hidden[randomRow][randomCol] == 0){
 	       	field_hidden[randomRow][randomCol] = 9;
 	       	for(i = randomRow -1; i<=randomRow + 1; i++)
 	       	{
 	       		for(j = randomCol -1; j<=randomCol + 1; j++)
 	       		{
 	       			if((j != randomCol || i != randomRow) && i >= 0 && j >=0 && i < h && j < w)
 	       			{
 	       				field_hidden[i][j]=field_hidden[i][j]+1;
 	       			}    
 	       		}
 	       	}
 	       	placedMines++;
 	       }
 	   }
 	   var Gametable=document.getElementById("jogo");
 	   var fc = Gametable.firstChild;

 	   while( fc ) {
 	   	Gametable.removeChild( fc );
 	   	fc = Gametable.firstChild;
 	   }
 	   if(gamemod==2){
 	   	var table = document.createElement('table');
 	   	for (var i = 0; i < h; i++){
 	   		var tr = document.createElement('tr');   
 	   		for( var j=0;j < w; j++)
 	   		{
 	   			var td1 = document.createElement('td');
 	   			td1.setAttribute("id",i+"_"+j);
 	   			td1.innerHTML='<img width="32px" height="32px" src=\'unclicked.png\'>';
 	   			td1.onclick = clickHandler;
 	   			tr.appendChild(td1);
 	   		}
 	   		table.appendChild(tr);		
 	   	}
 	   	Gametable.appendChild(table);
 	   	tempoDiv = document.getElementById("time");
 	   	if(tempoDiv.style.display === "none")
 	   		initTime();
 	   }
 	   else{
 	   	var table = document.createElement('table');
 	   	for (var i = 0; i < h; i++){
 	   		var tr = document.createElement('tr');   
 	   		for( var j=0;j < w; j++)
 	   		{
 	   			var td1 = document.createElement('td');
 	   			td1.setAttribute("id",i+"_"+j);
 	   			td1.innerHTML='<img width="32px" height="32px" src=\'unclicked.png\'>';
 	   			td1.onclick = clickHandler;
 	   			td1.oncontextmenu = clickHandlerR;
 	   			tr.appendChild(td1);
 	   		}
 	   		table.appendChild(tr);		
 	   	}
 	   	Gametable.appendChild(table);
 	   	tempoDiv = document.getElementById("time");
 	   	if(tempoDiv.style.display === "none")
 	   		initTime();
 	   }
 	}


//Increments time by second
function initTime()
{
	tempoDiv = document.getElementById("time");
	tempoDiv.style.display = "inline";
	time=0;
	timeIncrement(time);
}

function timeIncrement(time)
{
	timerID = setTimeout(function(){
		tempoDiv = document.getElementById("time");	
		time++;
		tempoDiv.innerHTML = time + "s";
		timeIncrement(time);
	}, 1000);

}

//Left click handler
function isOver(){
	count1=0;
	for (k=0; k< heigth; k++)
		for(kk=0; kk<width; kk++){
			if (visited[k][kk]==1) count1++;
			if (field[k][kk]<=8 && field[k][kk] >0) count1++;
		}

		if(count1==(heigth*width) - mines) return true;
		return false;
}



//Click esquerdo
function clickHandler (e){
	//Multiplayer
	if(gamemod==2){
		if(gameOver) 
			return;
		else{
			var x = parseInt(this.id.split('_')[0])+1;
			var y = parseInt(this.id.split('_')[1])+1;
			totalclicked++;
			notify(x,y, getPlayerName(),myGameId,key);
		}
	}
	// Single Player
	if(gamemod==1){
		if(gameOver) return;
		var x = this.id.split('_')[0];
		var y = this.id.split('_')[1];
		totalclicked++;
		if(field[x][y] == -1)
			return;
		if(field_hidden[x][y] == 9)
		{
			for(k=0;k<heigth;k++)
				for(kk=0;kk<width;kk++)
					if(field_hidden[k][kk] == 9){
						document.getElementById("jogo").firstChild.rows[k].cells[kk].innerHTML = '<img width="32px" height="32px" src=\'bomb.png\'>';
					}
					hideall();
					message("Sorry! Try again...");
					gameOver=true;
					var start = document.getElementById("str");
					var reset = document.getElementById("rst");
					start.style.display = "block";
					reset.style.display = "none";
					document.getElementById("bck").style.display="block";
					clearInterval(timerID);
				}
				else if (isOver()){
					hideall();
					message("You won!");
					pushStorage(playerName,time,nivel);
					document.getElementById("bck").style.display="block";
					var start = document.getElementById("str");
					var reset = document.getElementById("rst");
					start.style.display = "block";
					reset.style.display = "none";
					gameOver=true;
					clearInterval(timerID);
				}
				else{
					field[x][y] = field_hidden[x][y];
					this.innerHTML = '<img width="32px" height="32px" src=\'clicked'+field_hidden[x][y]+'.png\'>';
					if(isOver()){
						hideall();
						message("You won!");
						pushStorage(playerName,time,nivel);
						document.getElementById("bck").style.display="block";
						var start = document.getElementById("str");
						var reset = document.getElementById("rst");
						start.style.display = "block";
						reset.style.display = "none";
						gameOver=true;
						clearInterval(timerID);
					}
					if(field_hidden[x][y] === 0){
						managePlay(parseInt(x),parseInt(y)); 
						if(isOver()){
							hideall();
							message("You won!");
							pushStorage(playerName,time,nivel);
							document.getElementById("bck").style.display="block";
							var start = document.getElementById("str");
							var reset = document.getElementById("rst");
							start.style.display = "block";
							reset.style.display = "none";
							gameOver=true;
							clearInterval(timerID);
						}
					}
				}

			}
		}


//Click Direito
function clickHandlerR (e)
{
	if(gamemod==1){
		if(gameOver) return;
		var x = this.id.split('_')[0];
		var y = this.id.split('_')[1];
		if(field[x][y] === -1)
		{
			selectedMines--;
			var minesDiv = document.getElementById("NMines");
			minesDiv.innerHTML = mines - selectedMines;
			totalclicked--;
			field[x][y] = -2;
			this.innerHTML = '<img width="32px" height="32px" src=\'ask.png\'>';
		}
		else if(field[x][y] == -2)
		{
			field[x][y] = 0;
			this.innerHTML = '<img width="32px" height="32px" src=\'unclicked.png\'>';
		}
		else if(field[x][y] === 0)
		{
			field[x][y] = -1;
			selectedMines++;
			var minesDiv = document.getElementById("NMines");
			minesDiv.innerHTML = mines - selectedMines;
			totalclicked++;
			this.innerHTML = '<img width="32px" height="32px" src=\'Flag.png\'>';
		}
		return false;
	}
}


//Logica de Jogo
function managePlay(x,y)
{
	visited[x][y]=1;
    /*
    * N-1 N N+1
    * N-1 X N+1
    * N-1 N N+1
    */
    for(i=(x-1);i<=(x+1);i++)
    {
    	for(j =(y -1); j <= (y + 1); j++)
    	{
   			if((j != y || i != x) && i >= 0 && j >=0 && i < heigth && j < width) //check for self and out of bondaries
   			{
   				field[i][j] = field_hidden[i][j];
   				if( field[i][j] !== 9 && field[i][j] !== -1 && field[i][j] !== -2 && visited[i][j] === 0) {
   					var fieldelement = document.getElementById(i+"_"+j);
   					if(fieldelement !== undefined)
   						fieldelement.innerHTML = '<img width="32px" height="32px" src=\'clicked'+field_hidden[i][j]+'.png\'>';
   					if(field[i][j] == 0 )
   						managePlay(i,j);
   				}
   			}    
   		}
   	}
   }


//*********************************MULTIPLAYER*****************************************************************


function letsPlay2(){
	if (timerID != null) clearInterval(timerID);
	var radios = document.getElementsByClassName('radio');
	document.getElementById("str").style.display="none";
	document.getElementById("bck").style.display="none";

	for (var i = 0; i < radios.length; i++) {
		if (radios[i].type === 'radio' && radios[i].checked) {
			if(i+1==1){
				nivel="beginner";  
			}
			else if(i+1==2){
				nivel="intermediate";
			}
			else if(i+1==3){
				nivel="expert";  
			}
		}

	}
	join(playerName, password, 2);
}

function join(name1, pw1, gp){
	var url1= "http://twserver.alunos.dcc.fc.up.pt:8000/join";
	var params1 = JSON.stringify({name: name1, pass: pw1, level: nivel, group: gp});
	var req1 = new XMLHttpRequest();
	req1.open("POST",url1 , true);
	req1.setRequestHeader("Content-type", "application/json");
	req1.onreadystatechange = function() {
		if (req1.readyState != 4){
			return ;
		} else if (req1.status != 200 ) {
			hideall();
			message("An unexpected error happened. Please try again later.");
			document.getElementById("bck").style.display="block";
		}else{
			var json = JSON.parse(req1.responseText);
			game = json.game;
			key = json.key;
			message("Looking for opponent...");
			update();
			document.getElementById("leave").style.display="block";
		}
	};
	req1.send(params1);
}

function update(){
	var hasGameStarted = false; //nao há indicaçao de jogo começar alem de mostrar o inimigo;
	url='http://twserver.alunos.dcc.fc.up.pt:8000/update?name='+getPlayerName()+'&game='+game+'&key='+key;
	source = new EventSource(url); // URL do script
	source.onmessage = function (event) { 
		var response = JSON.parse(event.data);
		var erro = response.error;
		var winner=response.winner;
		opponent = response.opponent;
		turn = response.turn;
		var lblturn = document.getElementById("playerturn");
		if(turn !== undefined)
			lblturn.innerHTML=turn;
		if(erro !== undefined){
			hideall();
			message(erro);
			document.getElementById("bck").style.display="block";
		}
		else if(winner !== undefined)
		{	var string = (winner+" wins! ");
			if(winner==playerName){
				var string2 = ("Your score is "+score(nivel)+" points!");
				message(string+string2);
			}
			else{
				message(string);
			}
			source.close();
			document.getElementById("str").style.display="block";
			document.getElementById("bck").style.display="block";
			clearInterval(timerID);
			gameOver=true;
			return;
		}
		else if(opponent !== "" && !hasGameStarted){
			document.getElementById("leave").style.display="none";
			hidemessage();
			document.getElementById("vs").style.display="block";
			document.getElementById("vs").innerHTML=(playerName+  "  vs.  " +opponent);
			hasGameStarted = true;
			act();
		}
		else 
		{
			cel = response.move.cells;	
			for(var i=0; i<cel.length; i++){
				var x = parseInt(cel[i][0])-1;
				var y = parseInt(cel[i][1])-1;    
				var n = cel[i][2];
				var btn = document.getElementById(x+"_"+y);

				if (n == "-1")
				{	
					minas_total=mines-minas;
					minas=minas+1;
					btn.innerHTML = '<img width="32px" height="32px" src=\'bomb.png\'>';
					document.getElementById("NMines").innerHTML=minas_total;

					/*minas descobertas por cada jogador*/
				}
				else if(n >= 0)
				{
					btn.innerHTML = '<img width="32px" height="32px" src=\'clicked'+n+'.png\'>';
				}
			}
		}
	};
}

function act(){
	document.getElementById("homepage").style.display="none";
	document.getElementById("Play").style.display="none";
	document.getElementById("honor_board").style.display="none";
	document.getElementById("titulo").style.display="none";
	document.getElementById("form").style.display="none";
	document.getElementById("jogo").style.display="flex";
	document.getElementById("GameInfo").style.display="block";
	tempoDiv = document.getElementById("time");
	if(tempoDiv.style.display === "none" && gamemod==1)
		initTime();
	if(nivel=="beginner")
		startGame(9,9,10);
	else if(nivel=="intermediate")
		startGame(16,16,40);
	else if(nivel=="expert")
		startGame(30,16,70);	
}


function notify (x,y,n,g,k) {
	var url1= "http://twserver.alunos.dcc.fc.up.pt:8000/notify";
	var params1 = JSON.stringify({name: n, key: key, row: x, col: y,game:game});
	var req1 = new XMLHttpRequest();
	req1.open("POST",url1 , true);
	req1.setRequestHeader("Content-type", "application/json");
	req1.onreadystatechange = function() {
		if (req1.readyState != 4){
			return ;
		} else if (req1.status != 200 ) {
			hideall();
			message("An unexpected error happened. Please try again later.");
			document.getElementById("bck").style.display="block";
		}else{
			var json = JSON.parse(req1.responseText);

			var erro = json.erro;
			if(erro !== undefined){
				hideall();
				message(erro);
				document.getElementById("bck").style.display="block";
			}
		}
	};
	req1.send(params1);
}


/////////////////////////////////////////               RANKING                 ////////////////////////////////////////////////////


function beginner(){
	var url= 'http://twserver.alunos.dcc.fc.up.pt:8000/ranking';
	var req = new XMLHttpRequest();
	var params = JSON.stringify({level : "beginner"});
	req.open("POST",url , true);
	req.setRequestHeader("Content-type", "application/json");
	req.responseType='text';
	req.onload = function() {
		var serverQuestions = req.responseText;
		var questionAnswer = JSON.parse(serverQuestions);
		var erro=questionAnswer.error;
		if(erro!== undefined){
			hideall();
			message(erro);
			document.getElementById("bck").style.display="block";
		}
		else{
			workrank(0, questionAnswer);
		}
	};
	req.send(params);
}



function intermediate(){
	var url= 'http://twserver.alunos.dcc.fc.up.pt:8000/ranking';
	var req = new XMLHttpRequest();
	var params = JSON.stringify({level : "intermediate"});
	req.open("POST",url , true);
	req.setRequestHeader("Content-type", "application/json");
	req.responseType='text';
	req.onload = function() {
		var serverQuestions = req.responseText;
		var questionAnswer = JSON.parse(serverQuestions);
		var erro=questionAnswer.error;
		if(erro!== undefined){
			hideall();
			message(erro);
			document.getElementById("bck").style.display="block";
		}
		else{
			workrank(1, questionAnswer);
		}
	};
	req.send(params);
}


function expert(){
	var url= 'http://twserver.alunos.dcc.fc.up.pt:8000/ranking';
	var req = new XMLHttpRequest();
	var params = JSON.stringify({level : "expert"});
	req.open("POST",url , true);
	req.setRequestHeader("Content-type", "application/json");
	req.responseType='text';
	req.onload = function() {
		var serverQuestions = req.responseText;
		var questionAnswer = JSON.parse(serverQuestions);
		var erro=questionAnswer.error;
		if(erro!== undefined){
			hideall();
			message(erro);
			document.getElementById("bck").style.display="block";
		}
		else{
			workrank(2, questionAnswer);
		}
	};
	req.send(params);
}


function workrank(n, rank){
	var lvl="";
	var i=0; 
	var j=0;
	var list="";
	if(n==0){
		lvl="list_beginner";
		nv="Begin";
	}
	else if(n==1){
		lvl="list_intermediate";
		nv="Interm";
	}
	else{
		lvl="list_expert";
		nv="Expert";
	}
	hideall();
	document.getElementById(nv).style.display="block";
	document.getElementById("Logout").style.display="inline-block";
	document.getElementById("gameid").style.display="inline-block";
	document.getElementById("bck").style.display="block";
	var table2 = document.getElementById(lvl);
	for (var i = 0; i < 10; i++){
		var tr = document.createElement('tr');   

		var td1 = document.createElement('td');
		var td2 = document.createElement('td');

		var text1 = document.createTextNode(rank.ranking[i].name);
		var text2 = document.createTextNode(rank.ranking[i].score);

		td1.appendChild(text1);
		td2.appendChild(text2);
		tr.appendChild(td1);
		tr.appendChild(td2);

		table2.appendChild(tr);
	}
}

function score(lvl){
	var url= 'http://twserver.alunos.dcc.fc.up.pt:8000/score';
	var req = new XMLHttpRequest();
	var params = JSON.stringify({name: playerName, level : lvl});
	req.open("POST",url , true);
	req.setRequestHeader("Content-type", "application/json");
	req.responseType='text';
	req.onload = function() {
		var serverQuestions = req.responseText;
		var questionAnswer = JSON.parse(serverQuestions);
		var points=questionAnswer.score;
		if(points!=0){
			var points=questionAnswer.score;
			message("Your score is "+points+" points!");
			document.getElementById("bck").style.display="block";
		}
	};
	req.send(params);
}

function leave(){
	var url='http://twserver.alunos.dcc.fc.up.pt:8000/leave';
	var req = new XMLHttpRequest();
	var params = JSON.stringify({name: playerName, game : game, key : key});
	req.open("POST", url , true);
	req.setRequestHeader("Content-type", "application/json");
	req.send(params);
	home();
	document.getElementById("message").style.display="none";
	document.getElementById("leave").style.display="none";
}


////////////////////////////////////////    Local Storage /////////////////////////////////////////


function pushStorage(name,time1,nivel){
	var myObject = new Object();
	myObject.name =name;
	myObject.temp =time1;
	myObject.nivel=nivel;
	myArrayObject.push(myObject);
	localStorage.setItem("score", JSON.stringify(myArrayObject));
}

function storage(){
	myArrayObject = JSON.parse(localStorage.getItem("score"));   
	hideall();
	document.getElementById("ownrank").style.display="block";
	document.getElementById("Logout").style.display="inline-block";
	document.getElementById("gameid").style.display="inline-block";
	document.getElementById("bck").style.display="block";
	var table1 = document.getElementById("ownrank1");
	for (var i = 0; i < 10; i++){
		var tr = document.createElement('tr');   

		var td1 = document.createElement('td');
		var td2 = document.createElement('td');
		var td3 = document.createElement('td');

		var text1 = document.createTextNode("Player: "+myArrayObject[i].name + " ; ");
		var text2 = document.createTextNode(" Level: "+myArrayObject[i].nivel + " ; ");
		var text3 = document.createTextNode(" Time: "+myArrayObject[i].temp + " s");

		td1.appendChild(text1);
		td2.appendChild(text2);
		td3.appendChild(text3);
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);

		table1.appendChild(tr);
	}

}

//Home
function home() {
	/*
	if(document.getElementById(ownrank1) !== null)
		clearBox(ownrank1);
	if(document.getElementById(list_beginner) !== null)
		clearBox(list_beginner);
	if(document.getElementById(list_expert) !== null)
		clearBox(list_expert);
	if(document.getElementById(list_intermediate) !== null)
		clearBox(list_intermediate);
	if(document.getElementById(message) !== null)
		clearBox(message);
	*/

	hideall();
	document.getElementById("homepage").style.display="block";
	document.getElementById("Logout").style.display="inline-block";
	document.getElementById("gameid").style.display="inline-block";
	document.getElementById("gameid").innerHTML = playerName;
	document.getElementById("titulo").style.display="block";
} 

///////////////////////////////////// EXTRAS //////////////////////////////////////////////////////
function message(string){
	hideall();
	document.getElementById("titulo").style.display="inline-block";
	document.getElementById("gameid").style.display="inline-block";
	document.getElementById("message").innerHTML=string;
	document.getElementById("message").style.display="block";
}

function hidemessage(){
	document.getElementById("message").style.display="none";
}

function back(){
	hideall();
	document.getElementById("titulo").style.display="block";
	document.getElementById("back").style.display="none";
	document.getElementById("form").style.display="block";
}

/*
function clearBox(elementID)
{
	var myNode = document.getElementById(elementID);
	if(myNode.hasChildNodes())
    	myNode.removeChild(myNode.childNodes;
}
*/
