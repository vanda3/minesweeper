var http=require('http');
var url=require('url');
var key=0;
var sal;
var name="";
var pass="";
var accepted=0;
var level="";
var key="";
var game=[];
var gamenum;

var chance = require('chance').Chance();
var check = require('validator').check;
var express = require('express');
var connectRoute = require('connect-route');
var crypto = require('crypto');
var bodyParser=require("body-parser");
var mysql=require('mysql');
var board = new Array(30);
var hiddenboard = new Array(30);

var app=express();

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



//////////////////////// REGISTER ////////////////////////

app.post('/register', function (request, response){
	response.writeHead(200, {
		'Content-Type':"application/json",
		'Connection':'keep-alive'});
	console.log("User wants to register");
	sal = chance.string({length:4});
	name = request.body.name;
	pass = request.body.pass;
	if(validation(name)==0 || pass==undefined || name==undefined){
		if(validation(name)==0)
			response.end(JSON.stringify({"error":"Name must contain numbers and letters"}));
		else
			response.end(JSON.stringify({"error":e}));
		return 0;
	}
	//HASH
	var hash=crypto.createHash('md5').update(pass.concat(sal)).digest('hex');
	var conn= mysql.createConnection({
		host: 'localhost',
		user: 'up201305778',
		password: 'password',
		database: 'up201305778'
	});
	conn.connect(function(err){
		if(err){
			setTimeout(handleDisconnect,2000);
		} else{
			console.log('Connected to database!');
		}
	});
	conn.query("SELECT salt,pass FROM Users WHERE name=?", [name],
		function(err, rows) {
			//nenhum utilizador com este nome - regista
			if (rows.length==0) {
				response.end("{}");
				conn.query("INSERT INTO Users VALUES(?,?,?)",[name,hash,sal], 
					function(err){
						if(err==null)
							console.log("Successfully registered!");
					}
				);
			}
			else if(err!=null){
				console.log(err);
				response.end(JSON.stringify({"error":err}));
			}
			//compara passwords para confirmação
			else if(rows.length!=0){
				console.log("Matching passwords");
				var sal_saved = rows[0].salt;
				var hash_saved = crypto.createHash('md5').update(pass.concat(sal_saved)).digest('hex');
				if (hash_saved==rows[0].pass){
					console.log("Hash matches!");
					response.end("{}");
					console.log("Confirmation sent. User logged in.");
				}
				else{
					console.log("Hash mismatch!");
					response.end(JSON.stringify({"error":"User registered using a different PASSWORD"}));
					console.log("Confirmation sent.");
				}
			}
	});
});



//////////////////////// RANKING ////////////////////////////

app.post('/ranking', function (request, response){
	response.writeHead(200, {
		'Content-Type':"application/json",
		'Connection':'keep-alive'});
	console.log("Ranking request");
	level=request.body.level;
	if(level!="beginner" && level!="intermediate" && level!="expert")
		response.end("Invalid request");
	else{
		var conn = mysql.createConnection({
			host : 'localhost',
			user : 'up201305778',
			password : 'password',
			database : 'up201305778'
		});
		conn.connect(function(err){
			if(err){
				setTimeout(handleDisconnect,2000);
			} else{
				console.log('Connected to database!');
			}
		});
		conn.query("SELECT name, score FROM Rankings WHERE level=? ORDER BY score DESC, timestamp ASC LIMIT 10", [level],
			function(err,rows){
				if (err){
					console.log(err);
				}
				else
				{
					console.log("SQL:table found!");
					var i=0;
					response.write("{\"ranking\":[");
					for(i=0;i<10;i++){
						try{
							response.write("{\"name\":\""+rows[i].name+"\",\"score\":"+rows[i].score+"}");
						}
						catch(e){ 
							response.write("{\"name\":\"null"+"\",\"score\":0"+"}");
						}
						if (i!=9) 
							response.write(",");
					}
					response.end("]}");
					console.log("Ranking done.");
				}
			});

		conn.end(function(err) {
			console.log("MySQL connection ended.");
		});
	}
});



////////////////////// SCORE ///////////////////////////////

app.post('/score', function (request, response){
	response.writeHead(200, {
		'Content-Type':"application/json",
		'Connection':'keep-alive'});
	name=request.body.name;
	level=request.body.level;
	console.log("User wants to check score");
	var conn = mysql.createConnection({
		host : 'localhost',
		user : 'up201305778',
		password : 'password',
		database : 'up201305778'
	});
	conn.connect(function(err){
		if(err){
			setTimeout(handleDisconnect,2000);
		} else{
			console.log('Connected to database!');
		}
	});
	conn.query("SELECT score FROM Rankings WHERE name=? AND level=?", [name, level],
		function(err,rows){
			if (err){
				console.log(err);
			}
			else
			{
				console.log("SQL:table found!");
				response.end({"score":rows[0].score});
				console.log("Ranking done.");
			}
		});
	conn.end(function(err) {
		console.log("MySQL connection ended.");
	});
});



////////////////////  JOIN /////////////////////////////

app.post('/join', function (request, response){
	response.writeHead(200, {
		'Content-Type':"application/json"});
	name=request.body.name;
	pass=request.body.pass;
	level=request.body.level;
	group=request.body.group;
	if(validation(name)==0 || pass==undefined || name==undefined){
		if(validation(name)==0)
			response.end(JSON.stringify({"error":"Name must contain numbers and letters"}));
		else
			response.end(JSON.stringify({"error":e}));
		return 0;
	}
	var conn= mysql.createConnection({
		host: 'localhost',
		user: 'up201305778',
		password: 'password',
		database: 'up201305778'
	});
	conn.connect(function(err){
		if(err){
			setTimeout(handleDisconnect,2000);
		} else{
			console.log('Connected to database!');
		}
	});
	conn.query("SELECT salt,pass FROM Users WHERE name=?", [name],
		function(err, rows) {
			if (rows.length==0) {
				response.end(JSON.stringify({"error":"User doesn't exist"}));
			}
			else if(err!=null){
				console.log(err);
				response.end(JSON.stringify({"error":err}));
			}
			//compara passwords para confirmação
			else if(rows.length!=0){
				console.log("Matching passwords");
				var sal_saved = rows[0].salt;
				var hash_saved = crypto.createHash('md5').update(pass.concat(sal_saved)).digest('hex');
				if(hash_saved!=rows[0].pass){
					console.log("Hash mismatch!");
					response.end(JSON.stringify({"error":"Passwords don't match"}));
				}
				else{
					console.log("Hash matches!");
					gamenum=0;
					for(gamenum=0; game[gamenum]!=null; gamenum++){
						if(game[gamenum].level==level && game[gamenum].group==2){
                            
                            var h = 0, w=0, m=0;
                            if(level === "beginner")
                            {
                                h=9;
                                w=9;
                                m=10;
                            }
                            else if(level === "intermediate")
                            {
                                h=16;
                                w=16;
                                m=40;
                            }
                            else
                            {
                                w=30;
                                h=16;
                                m=70;
                            }
                            board = new Array(h);
	                        hiddenboard = new Array(h);
                            for(var i=0; i<h; i++){
                                board[i] = new Array(w);
                                hiddenboard = new Array(w);
                            }
                            for(var i=0; i<h; i++){
                                for(var j=0; j<w; j++){
                                    board[i][j]=0;
                                    hiddenboard[i][j] = 0;
                                }
                            }
                            //colocar minas
                            var placedMines = 0;
                            var randomRow,randomCol;
                            while(placedMines < m){
                                   randomRow = Math.floor(Math.random() * h); //nr entre 0 e height
                                   randomCol = Math.floor(Math.random() * w); //nr entre 0 e width  
                                   if(board[randomRow][randomCol] == 0){
                                    board[randomRow][randomCol] = 9;
                                    for(i = randomRow -1; i<=randomRow + 1; i++)
                                    {
                                        for(j = randomCol -1; j<=randomCol + 1; j++)
                                        {
                                            if((j != randomCol || i != randomRow) && i >= 0 && j >=0 && i < h && j < w)
                                            {
                                                board[i][j]=board[i][j]+1;
                                            }    
                                        }
                                    }
                                    placedMines++;
                                   }
                            }
                            game[gamenum].board = board;
                            game[gamenum].hiddenboard = hiddenboard;
                            game[gamenum].begin = true;
							game[gamenum].p2 = name;
                            game[gamenum].minesToWin = (m+1)/2;
							game[gamenum].playable = true;
							console.log("Found game match!");
							break;
						}
					}
					if(game[gamenum]==null){
						var gameobj={
							key: chance.string({length:32, pool:"abcdef0123456789"}),
							game: gamenum,
							level: level,
							board: [],
                            hiddenboard : [],
							p1: name,
							p2: "",
                            p1Score: 0,
                            p2Score: 0,
                            minesToWin : 0,
                            turn : name,
                            winner: "",
                            loser: "",
							playable: false,
							begin: false,
							move: "",
							group: group
						};
						game.push(gameobj);
					}
				}
				response.end(JSON.stringify({"game":gamenum, "key":game[gamenum].key}));
				console.log("game: "+gamenum,"key: "+game[gamenum].key);
			}
	});
});



////////////////////  LEAVE /////////////////////////////

app.post('/leave', function (request, response){
	response.writeHead(200, {
		'Content-Type':"application/json"});
	name=request.body.name;
	gamenum=request.body.game;
	key=request.body.key;
	if(game[gamenum].key==key){
		//name é o unico jogador na sala
		if(game[gamenum].p1==name){
			game[gamenum]=null;
			console.log("Player left queue!");
		}
		//name já foi posto numa sala com outro jogador
		else if(game[gamenum].p2==name){
			game[gamenum].p2="";
			game[gamenum].playable=false;
			game[gamenum].begin=false;
		}
	}
});




////////////////////  UPDATE /////////////////////////////

app.get('/update', function (request, response){
	response.writeHead(200, {
		"Access-Control-Allow-Origin": "*",
		"Content-Type":"text/event-stream",
		"Cache-Control": "no-cache"
	});
    var parsedUrl = url.parse(request.url, true); // true to get query as object
	var myObj = parsedUrl.query;
    gameX = myObj.game;
    key = myObj.key;
    name = myObj.name;
    if(game[gameX].playable == false)
	{
	   console.log("not playable");
    } 
    else{
    	var opponent="";
    	if(game[gamenum].p2==name)
    		opponent=game[gamenum].p1;
    	else
    		opponent=game[gamenum].p2;
    	if(game[gamenum].begin==true && game[gamenum].p2!="" && game[gamenum].p2!=null)
    		response.end({"opponent": opponent, "turn": game[gamenum].turn});
    	if(game[gameX].key==key && game[gamenum].begin==true){
    		if(game[gameX].winner!="")
    			response.end(JSON.stringify({"move":game[gamenum].move,"winner":game[gamenum].winner}));
    		else
    			response.end(JSON.stringify({"move":game[gamenum].move,"turn":game[gamenum].turn}));
    	}
    	else (game[gameX].key!=key && game[gamenum].begin==true)
    		response.end(JSON.stringify({"error":"Game key doesn't match"}));

    }                      
});




////////////////////  NOTIFY /////////////////////////////

app.post('/notify', function (request, response){
	response.writeHead(200, {
		'Content-Type':"application/json"});
	gameX=request.body.game;
	key=request.body.key;
	name=request.body.name;
	row=request.body.row;
	col=request.body.col;
	var hasWon = false;
    
	if(game[gamenum].key !=key || game[gamenum].game != gameX){
        response.end(JSON.stringify( { "error" : "Game ID doesn't exist" } ));
        console.log("Game ID doesn't exist");
	}
    else{
        if( hiddenboard[col][row]==1){
            response.end(JSON.stringify( { "error" : "Position uncovered" } ));
        }
        else if(game[gameX].turn!=name){
            response.end(JSON.stringify( { "error" : "It's not your turn" } ));
        }
        else{
        	game[gameX].begin=false;
            if(game[gameX].board[col][row]==9){
                if(game[gameX].turn==game[gameX].p1){
                    game[gameX].p1Score++;
                    if(game[gameX].p1Score >= game[gameX].minesToWin){
                        game[gameX].winner=game[gameX].p1;
                        game[gameX].loser=game[gameX].p2;
                        hasWon=true;

                    }

                }
                else
                {
                    game[gameX].p2Score++;
                    if(game[gameX].p2Score >= game[gameX].minesToWin){
                        game[gameX].winner=game[gameX].p2;
                        game[gameX].loser=game[gameX].p1;
                        hasWon=true;
                    }
                }
                if(hasWon==true){
                	var timestamp = Math.floor(Date.now());
                	var new_score;
                	var conn= mysql.createConnection({
                		host: 'localhost',
                		user: 'up201305778',
                		password: 'password',
                		database: 'up201305778'
                	});
                	//winner
                	conn.query("SELECT score FROM Rankings WHERE name=? AND level=?", [game[gamenum].winner, level],
                		function(err,rows){
                			//primeira vitoria
                			if (rows.length==0) {
                				conn.query("INSERT INTO Rankings VALUES(?,?,?,?)",[game[gameX].winner, level, 1, timestamp], 
                					function(err){
                						if(err==null)
											console.log("Successfully scored!");
                					});
                			}
                			if(rows.length!=0){
                				console.log(rows[0].score);
                				new_score=rows[0].score+1;
                				conn.query("UPDATE Rankings SET score=?, timestamp=?; WHERE name=? AND level=?",[new_score, timestamp, game[gameX].winner, level], 
                					function(err){
                						if(err==null)
											console.log("Successfully updated!");
                					});
                			}
                		});
                	//loser
                	conn.query("SELECT score FROM Rankings WHERE name=? AND level=?", [game[gamenum].loser, level],
                		function(err,rows){
                			if (rows.length==0) {
                				conn.query("INSERT INTO Rankings VALUES(?,?,?,?)",[game[gameX].loser, level, 0, timestamp], 
                					function(err){
                						if(err==null)
											console.log("Successfully scored!");
                					});
                			}
                			if(rows.length!=0){
                				console.log(rows[0].score);
                				if(rows[0].score>0)
                					new_score=rows[0].score-1;
                				else
                					new_score=rows[0].score;
                				conn.query("UPDATE Rankings SET score=?, timestamp=?; WHERE name=? AND level=?",[new_score, timestamp, game[gameX].loser, level], 
                					function(err){
                						if(err==null)
											console.log("Successfully updated!");
                					});
                			}
                		});
                }
                game[gameX].move = JSON.stringify( { "name" : name ,"cells" : [row,col,-1]}) ;
            }
            else
            {
                var response = managePlay(row, col, gameX, []);
                if(game[gameX].turn == game[gameX].p1)
                    game[gameX].turn = game[gameX].p2;
                else
                    game[gameX].turn = game[gameX].p1;
                game[gameX].move = JSON.stringify( {"name" : name , "cells" : response } )
            }
            response.end("{}");
        }
    }
});

app.listen(8002);



/////////////////////// FUNÇÔES /////////////////////////////

function validation(things){
	var lower = /[a-z]/;
	var number = /[0-9]/;
	var upper = /[A-Z]/;

	if ((lower.test(things) || upper.test(things)) && number.test(things)) {
		console.log("Username APROVADO");
		return 1;
	} 
	else{
		console.log("Username REPROVADO");
		return 0;
	}
}

function handleDisconnect(){
	conn=mysql.createConnection(db_config);
	conn.connect(function(err){
		if(err){
			console.log('error when connecting to db: ', err);
			setTimeout(handleDisconnect,2000);
		}
	});
	conn.on('error', function(err){
		console.log('db error: ', err);
		if(err.code=== 'PROTOCOL_CONNECTION_LOST'){
			handleDisconnect();
		} else{
			throw err;
		}
	});	
}

                                          
function managePlay(x,y, indx,a)
{
	game[indx].hiddenboard[x][y]=1;
    var tmp = [x,y,game[i].board[x,y]];
   	game[indx].hiddenboard[x][y] = 1;//field_hidden[i][j];
    a.push(temp);   
    /*
    * N-1 N N+1
    * N-1 X N+1
    * N-1 N N+1
    */
    for(i=(x-1);i<=(x+1);i++)
    {
    	for(j =(y -1); j <= (y + 1); j++)
    	{
   			if((j != y || i != x) && i >= 0 && j >=0 && i < game[indx].board.length && j < game[indx].board[0].length) //check for self and out of bondaries
   			{
   				if( game[indx].board[i][j] !== 9 && game[indx].hiddenboard[i][j] ===0) 
                {
   					a = managePlay(i,j,indx,a);
   				}
   			}    
   		}
   	}
    return a;
}
