const chessboardhtml = document.getElementById("chessboard");
var board = [
	["Br","Bn","Bb","Bq","Bk","Bb","Bn","Br"],
	["Bp","Bp","Bp","Bp","Bp","Bp","Bp","Bp"],
	["","","","","","","",""],
	["","","","","","","",""],
	["","","","","","","",""],
	["","","","","","","",""],
	["Wp","Wp","Wp","Wp","Wp","Wp","Wp","Wp"],
	["Wr","Wn","Wb","Wq","Wk","Wb","Wn","Wr"]
]
var selectedPiece = false;
var selectedPieceLocation;
var turn = "W";
var whiteKingCastle = false;
var whiteQueenCastle = false;
var blackKingCastle = false;
var blackQueenCastle = false;
var playingBot = true;
if (playingBot) {
	stockfish({fen:fen()}).then((data)=>{
		console.log(data.move)
		conversionArray = ["a","b","c","d","e","f","g","h"]
		x1 = conversionArray.indexOf(data.move.charAt(0));
		y1 = 8-parseInt(data.move.charAt(1));
		x2 = conversionArray.indexOf(data.move.charAt(2));
		y2 = 8-parseInt(data.move.charAt(3));
		board[y2][x2] = board[y1][x1];
		board[y1][x1] = "";
		updateBoard();
		console.log("X1: " + x1 + ", Y1: " + y1 + ", X2: " + x2 + ", Y2: " + y2);
	})
	.catch((e)=> {
		console.log(e)
		alert("Stockfish broke for some reason, now its ur turn.");
	});
	turn = "B";
	document.getElementById("turnTxt").innerHTML = "Black";
}

chessboardhtml.addEventListener("click", (evt) => {
	console.log("Id: " + evt.target.id + " Piece: " + board[parseInt(evt.target.id.charAt(1))][parseInt(evt.target.id.charAt(0))])
	id = evt.target.id;
	pieceCode = board[parseInt(id.charAt(1))][parseInt(id.charAt(0))]
	if (!selectedPiece && turn == pieceCode.charAt(0)) {
		selectedPiece = pieceCode;
		selectedPieceLocation = id;
		for (const move of validMoves(selectedPiece,selectedPieceLocation)) {
			if (board[parseInt(move.charAt(1))][parseInt(move.charAt(0))] == "") {
				document.getElementById(move).style = "background-image:radial-gradient(circle at center,black 0%, rgba(0, 0, 0, 0) 40%);"
			}
			else {
				document.getElementById(move).style = "background-image:radial-gradient(circle at center,red 0%, rgba(0,0,0,0) 40%);"
			}
		}
	}
	else if (selectedPiece != false && isValidMove(selectedPiece,selectedPieceLocation,id)) {
		for (const move of validMoves(selectedPiece,selectedPieceLocation)) {
			document.getElementById(move).style = ""
		}
		board[parseInt(id.charAt(1))][parseInt(id.charAt(0))] = selectedPiece;
		board[parseInt(selectedPieceLocation.charAt(1))][parseInt(selectedPieceLocation.charAt(0))] = "";	
		document.getElementById(id).style = "";
		selectedPiece = false;
		if (turn == "W") {
			turn = "B";
			if (isKingInCheck("B")) {
				console.log("BLACK CHECK")
			}
			document.getElementById("turnTxt").innerHTML = "Black";
		}
		else {
			turn = "W";
			if (isKingInCheck("W")) {
				console.log("WHITE CHECK")
			}
			document.getElementById("turnTxt").innerHTML = "White";
			if (playingBot) {
				stockfish({fen:fen()}).then((data)=>{
					console.log(data)
					console.log(data.move)
					conversionArray = ["a","b","c","d","e","f","g","h"]
					x1 = conversionArray.indexOf(data.move.charAt(0));
					y1 = 8-parseInt(data.move.charAt(1));
					x2 = conversionArray.indexOf(data.move.charAt(2));
					y2 = 8-parseInt(data.move.charAt(3));
					board[y2][x2] = board[y1][x1];
					board[y1][x1] = "";
					updateBoard();
					console.log("X1: " + x1 + ", Y1: " + y1 + ", X2: " + x2 + ", Y2: " + y2);
				})
				.catch((e)=> {
					console.log(e)
					alert("Stockfish broke for some reason, now its ur turn.");
				});
				turn = "B";
				document.getElementById("turnTxt").innerHTML = "Black";
			}
		}
		updateBoard();
	}
	else if (selectedPiece != false && !isValidMove(selectedPiece,selectedPieceLocation,id)) {
		for (const move of validMoves(selectedPiece,selectedPieceLocation)) {
			document.getElementById(move).style = ""
		}
		selectedPiece = false;
	}
});

function updateBoard() {
	for (var i = 0; i < 8; i++ ) {
		for (var j = 0; j < 8; j++ ) {
			id = "" + j + "" + i;
			//document.getElementById(id).innerHTML = board[j][i]
			if (board[i][j] == "Br") {
				document.getElementById(id).innerHTML = "♜";
			} else if (board[i][j] == "Bn") {
				document.getElementById(id).innerHTML = "♞";
			} else if (board[i][j] == "Bb") {
				document.getElementById(id).innerHTML = "♝";
			} else if (board[i][j] == "Bk") {
				document.getElementById(id).innerHTML = "♚";
			} else if (board[i][j] == "Bq") {
				document.getElementById(id).innerHTML = "♛";
			} else if (board[i][j] == "Bp") {
				document.getElementById(id).innerHTML = "♟";
			} else if (board[i][j] == "Wr") {
				document.getElementById(id).innerHTML = "♖";
			} else if (board[i][j] == "Wn") {
				document.getElementById(id).innerHTML = "♘";
			} else if (board[i][j] == "Wb") {
				document.getElementById(id).innerHTML = "♗";
			} else if (board[i][j] == "Wk") {
				document.getElementById(id).innerHTML = "♔";
			} else if (board[i][j] == "Wq") {
				document.getElementById(id).innerHTML = "♕";
			} else if (board[i][j] == "Wp") {
				document.getElementById(id).innerHTML = "♙";
			} else if (board[i][j] == "") {
				document.getElementById(id).innerHTML = "";
			}
		}
	}
}

function isValidMove(piece, origin, destination) {
	return validMoves(piece,origin).includes(destination);
}

function pseudoValidMoves(piece,origin) {
	moves = []
	x = parseInt(origin.charAt(0))
	y = parseInt(origin.charAt(1))
	pieceColour = piece.charAt(0)
	pieceType = piece.charAt(1)	
	if (pieceType == "p") {
		if (pieceColour == "W") {
			if (board[y-1][x] == "") {
				moves.push(""+x+""+(y-1));
			}
			if (y == 6 && board[y-2][x] == "") {
				moves.push(""+x+""+(y-2));
			}
			if (x != 7) {
				if (board[y-1][x+1].charAt(0)=="B") {
					moves.push(""+(x+1)+""+(y-1));
				}
			}
			if (x != 0) {
				if (board[y-1][x-1].charAt(0)=="B") {
					moves.push(""+(x-1)+""+(y-1));
				}
			}
		}
		if (pieceColour == "B") {
			if (board[y+1][x] == ""){
				moves.push(""+x+""+(y+1));
			}
			if (y == 1 && board[y+2][x] == "") {
				moves.push(""+x+""+(y+2));
			}
			if (x != 7) {
				if (board[y+1][x+1].charAt(0)=="W") {
					moves.push(""+(x+1)+""+(y+1));
				}
			}
			if (x != 0) {
				if (board[y+1][x-1].charAt(0)=="W") {
					moves.push(""+(x-1)+""+(y+1));
				}
			}
		}
	}
	if (pieceType == "k") {
		xOffset = 0;
		yOffset = -1;
		if (x+xOffset >= 0 && y+yOffset >= 0 && x+xOffset <= 7 && y+yOffset <= 7 && pieceColour != board[y+yOffset][x+xOffset].charAt(0)) moves.push(""+(x+xOffset)+""+(y+yOffset));
		xOffset = 1;
		yOffset = -1;
		if (x+xOffset >= 0 && y+yOffset >= 0 && x+xOffset <= 7 && y+yOffset <= 7 && pieceColour != board[y+yOffset][x+xOffset].charAt(0)) moves.push(""+(x+xOffset)+""+(y+yOffset));
		xOffset = 1;
		yOffset = 0;
		if (x+xOffset >= 0 && y+yOffset >= 0 && x+xOffset <= 7 && y+yOffset <= 7 && pieceColour != board[y+yOffset][x+xOffset].charAt(0)) moves.push(""+(x+xOffset)+""+(y+yOffset));
		xOffset = 1;
		yOffset = 1;
		if (x+xOffset >= 0 && y+yOffset >= 0 && x+xOffset <= 7 && y+yOffset <= 7 && pieceColour != board[y+yOffset][x+xOffset].charAt(0)) moves.push(""+(x+xOffset)+""+(y+yOffset));
		xOffset = 0;
		yOffset = 1;
		if (x+xOffset >= 0 && y+yOffset >= 0 && x+xOffset <= 7 && y+yOffset <= 7 && pieceColour != board[y+yOffset][x+xOffset].charAt(0)) moves.push(""+(x+xOffset)+""+(y+yOffset));
		xOffset = -1;
		yOffset = 1;
		if (x+xOffset >= 0 && y+yOffset >= 0 && x+xOffset <= 7 && y+yOffset <= 7 && pieceColour != board[y+yOffset][x+xOffset].charAt(0)) moves.push(""+(x+xOffset)+""+(y+yOffset));
		xOffset = -1;
		yOffset = 0;
		if (x+xOffset >= 0 && y+yOffset >= 0 && x+xOffset <= 7 && y+yOffset <= 7 && pieceColour != board[y+yOffset][x+xOffset].charAt(0)) moves.push(""+(x+xOffset)+""+(y+yOffset));
		xOffset = -1;
		yOffset = -1;
		if (x+xOffset >= 0 && y+yOffset >= 0 && x+xOffset <= 7 && y+yOffset <= 7 && pieceColour != board[y+yOffset][x+xOffset].charAt(0)) moves.push(""+(x+xOffset)+""+(y+yOffset));

	}
	if (pieceType == "n") {
		xOffset = 1;
		yOffset = -2;
		if (x+xOffset >= 0 && y+yOffset >= 0 && x+xOffset <= 7 && y+yOffset <= 7 && pieceColour != board[y+yOffset][x+xOffset].charAt(0)) moves.push(""+(x+xOffset)+""+(y+yOffset));
		xOffset = 2;
		yOffset = -1;
		if (x+xOffset >= 0 && y+yOffset >= 0 && x+xOffset <= 7 && y+yOffset <= 7 && pieceColour != board[y+yOffset][x+xOffset].charAt(0)) moves.push(""+(x+xOffset)+""+(y+yOffset));
		xOffset = 2;
		yOffset = 1;
		if (x+xOffset >= 0 && y+yOffset >= 0 && x+xOffset <= 7 && y+yOffset <= 7 && pieceColour != board[y+yOffset][x+xOffset].charAt(0)) moves.push(""+(x+xOffset)+""+(y+yOffset));
		xOffset = 1;
		yOffset = 2;
		if (x+xOffset >= 0 && y+yOffset >= 0 && x+xOffset <= 7 && y+yOffset <= 7 && pieceColour != board[y+yOffset][x+xOffset].charAt(0)) moves.push(""+(x+xOffset)+""+(y+yOffset));
		xOffset = -1;
		yOffset = 2;
		if (x+xOffset >= 0 && y+yOffset >= 0 && x+xOffset <= 7 && y+yOffset <= 7 && pieceColour != board[y+yOffset][x+xOffset].charAt(0)) moves.push(""+(x+xOffset)+""+(y+yOffset));
		xOffset = -2;
		yOffset = 1;
		if (x+xOffset >= 0 && y+yOffset >= 0 && x+xOffset <= 7 && y+yOffset <= 7 && pieceColour != board[y+yOffset][x+xOffset].charAt(0)) moves.push(""+(x+xOffset)+""+(y+yOffset));
		xOffset = -2;
		yOffset = -1;
		if (x+xOffset >= 0 && y+yOffset >= 0 && x+xOffset <= 7 && y+yOffset <= 7 && pieceColour != board[y+yOffset][x+xOffset].charAt(0)) moves.push(""+(x+xOffset)+""+(y+yOffset));
		xOffset = -1;
		yOffset = -2;
		if (x+xOffset >= 0 && y+yOffset >= 0 && x+xOffset <= 7 && y+yOffset <= 7 && pieceColour != board[y+yOffset][x+xOffset].charAt(0)) moves.push(""+(x+xOffset)+""+(y+yOffset));
	}
	if (pieceType == "r" || pieceType == "q") {
		if (x != 7) {
			xOffset = 1;
			while (board[y][x+xOffset] == "") {
				if (x+xOffset == 7) {
					break;
				}
				moves.push("" + (x+xOffset)+ ""+y)
				xOffset += 1;
			}
			if (board[y][x+xOffset].charAt(0) != pieceColour){
				moves.push(""+(x+xOffset)+""+y);
			}
		}
		if (x != 0) {
			xOffset = -1;
			while (board[y][x+xOffset] == "") {
				if (x+xOffset == 0) {
					break;
				}
				moves.push("" + (x+xOffset)+ ""+y)
				xOffset -= 1;
			}
			if (board[y][x+xOffset].charAt(0) != pieceColour){
				moves.push(""+(x+xOffset)+""+y);
			}
		}
		if (y != 7) {
			yOffset = 1;
			while (board[y+yOffset][x] == "") {
				if (y+yOffset == 7) {
					break;
				}
				moves.push("" + x+ ""+(y+yOffset))
				yOffset += 1;
			}
			if (board[y+yOffset][x].charAt(0) != pieceColour){
				moves.push(""+x+""+(y+yOffset));
			}
		}
		if (y != 0) {
			yOffset = -1;
			while (board[y+yOffset][x] == "") {
				if (y+yOffset == 0) {
					break;
				}
				moves.push("" + x+ ""+(y+yOffset))
				yOffset -= 1;
			}
			if (board[y+yOffset][x].charAt(0) != pieceColour){
				moves.push(""+x+""+(y+yOffset));
			}
		}
	}
	if (pieceType == "b" || pieceType == "q") {
		if (x != 7 && y != 0 ) {
			xOffset = 1;
			yOffset = -1;
			while (board[y+yOffset][x+xOffset] == "") {
				if (x+xOffset == 7 || y+yOffset == 0) {
					break;
				}
				moves.push("" + (x+xOffset)+ ""+(y+yOffset))
				xOffset += 1;
				yOffset -= 1;
			}
			if (board[y+yOffset][x+xOffset].charAt(0) != pieceColour){
				moves.push(""+(x+xOffset)+""+(y+yOffset));
			}
		}
		if (x != 0 && y != 0) {
			xOffset = -1;
			yOffset = -1;
			while (board[y+yOffset][x+xOffset] == "") {
				if (x+xOffset==0||y+yOffset==0) {
					break;
				}
				moves.push("" + (x+xOffset)+ ""+(y+yOffset))
				xOffset -= 1;
				yOffset -= 1;
			}
			if (board[y+yOffset][x+xOffset].charAt(0) != pieceColour){
				moves.push(""+(x+xOffset)+""+(y+yOffset));
			}
		}
		if (x != 7 && y != 7) {
			xOffset = 1;
			yOffset = 1;
			while (board[y+yOffset][x+xOffset] == "") {
				if (x+xOffset == 7 || y+yOffset == 7) {
					break;
				}
				moves.push("" + (x+xOffset)+ ""+(y+yOffset))
				xOffset += 1;
				yOffset += 1;
			}
			if (board[y+yOffset][x+xOffset].charAt(0) != pieceColour){
				moves.push(""+(x+xOffset)+""+(y+yOffset));
			}
		}
		if (x != 0 && y != 7) {
			xOffset = -1;
			yOffset = 1;
			while (board[y+yOffset][x+xOffset] == "") {
				if (x+xOffset == 0 || y+yOffset == 7) {
					break;
				}
				moves.push("" + (x+xOffset)+ ""+(y+yOffset))
				xOffset -= 1;
				yOffset += 1;
			}
			if (board[y+yOffset][x+xOffset].charAt(0) != pieceColour){
				moves.push(""+(x+xOffset)+""+(y+yOffset));
			}
		}
	}
	return moves;
}

function validMoves(piece,origin) {
	movesToTest = pseudoValidMoves(piece,origin);
	vMoves = [];
	oldBoard = JSON.parse(JSON.stringify(board))
	for ( const testingMove of movesToTest) {
		board[testingMove.charAt(1)][testingMove.charAt(0)]=piece;
		board[origin.charAt(1)][origin.charAt(0)]="";
		if (!isKingInCheck(piece.charAt(0))) {
			vMoves.push(testingMove);
		}
		board = JSON.parse(JSON.stringify(oldBoard))
	}
	return vMoves;
}

function isKingInCheck(king) {
	if (king == "W") otherColour = "B"
	if (king == "B") otherColour = "W"
	for (i=0;i<8;i++) {
		for (j=0;j<8;j++) {
			if (board[j][i].charAt(0)==otherColour){
				for (const move of pseudoValidMoves(board[j][i],""+i+""+j)) {
					if (board[move.charAt(1)][move.charAt(0)] == (king + "" + "k")) {
						return true;
					}
				}
			}
		}
	}
	return false;
}

function fen() {
	fenString = "";
	counter = 0;
	for(i=0;i<8;i++) {
		for(j=0;j<8;j++) {
			if (board[i][j].charAt(0)=="W") {
				if (counter != 0) {
					fenString = fenString.concat(counter);
				}
				counter = 0;
				fenString = fenString.concat(board[i][j].charAt(1).toUpperCase());
			}
			else if (board[i][j].charAt(0)=="") {
				counter++;
			}
			else {
				if (counter != 0) {
					fenString = fenString.concat(counter);
				}
				counter = 0;
				fenString = fenString.concat(board[i][j].charAt(1).toLowerCase());
			}
		}
		if (counter != 0) {
			fenString = fenString.concat(counter);
		}
		counter = 0;
		fenString = fenString.concat("/");
	}
	fenString = fenString.substring(0,fenString.length-1);
	//fenString = fenString.concat(" "+turn.toLowerCase() + " " + (whiteKingCastle ? "K" : "") + (whiteQueenCastle ? "Q" : "") + (blackKingCastle ? "k" : "") + (blackQueenCastle ? "q" : "") + (!whiteKingCastle&&!whiteQueenCastle&&!blackKingCastle&&!blackQueenCastle ? "-" : "") + " " + "-" + " " + "0" + " " + "1")
	fenString = fenString.concat(" " + turn.toLowerCase() + " - - 0 1")
	return fenString;
}

async function stockfish(data = {}) {
    const response = await fetch("https://chess-api.com/v1", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    });
    return response.json();
}
function stockfishPlays() {
	if (playingBot) {
		stockfish({fen:fen()}).then((data)=>{
			console.log(fen())
			console.log(data)
			console.log(data.move)
			conversionArray = ["a","b","c","d","e","f","g","h"]
			x1 = conversionArray.indexOf(data.move.charAt(0));
			y1 = 8-parseInt(data.move.charAt(1));
			x2 = conversionArray.indexOf(data.move.charAt(2));
			y2 = 8-parseInt(data.move.charAt(3));
			board[y2][x2] = board[y1][x1];
			board[y1][x1] = "";
			if (data.move == "e1g1") {
				whiteKingCastle = false;
				whiteQueenCastle = false;
				board[7][5] = "Wr";
				board[7][7] = "";
			}
			if (data.move == "e8g8") {
				blackQueenCastle = false;
				blackKingCastle = false;
				board[0][5] = "Br";
				board[0][7] = "";
			}
			updateBoard();
			console.log("X1: " + x1 + ", Y1: " + y1 + ", X2: " + x2 + ", Y2: " + y2);
			if (turn == "W") {
				turn = "B";
				document.getElementById("turnTxt").innerHTML = "Black";
			}
			else {
				turn = "W";
				document.getElementById("turnTxt").innerHTML = "White";
			}
			stockfishPlays()
		})
		.catch((e)=> {
			console.log(e)
			alert("Stockfish broke for some reason, now its ur turn.");
		});
		
	}
}
