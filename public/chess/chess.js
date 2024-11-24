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
			document.getElementById("turnTxt").innerHTML = "Black";
		}
		else {
			turn = "W";
			document.getElementById("turnTxt").innerHTML = "White";
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

function validMoves(piece,origin) {
	moves = []
	x = parseInt(origin.charAt(0))
	y = parseInt(origin.charAt(1))
	if (piece.charAt(1) == "p") {
		if (piece.charAt(0) == "W") {
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
		if (piece.charAt(0) == "B") {
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
	if (piece.charAt(1) == "r" || piece.charAt(1) == "q") {
		if (x != 7) {
			xOffset = 1;
			while (board[y][x+xOffset] == "") {
				if (x+xOffset == 7) {
					break;
				}
				moves.push("" + (x+xOffset)+ ""+y)
				xOffset += 1;
			}
			if (board[y][x+xOffset].charAt(0) != piece.charAt(0)){
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
			if (board[y][x+xOffset].charAt(0) != piece.charAt(0)){
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
			if (board[y+yOffset][x].charAt(0) != piece.charAt(0)){
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
			if (board[y+yOffset][x].charAt(0) != piece.charAt(0)){
				moves.push(""+x+""+(y+yOffset));
			}
		}
	}
	if (piece.charAt(1) == "b" || piece.charAt(1) == "q") {
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
			if (board[y+yOffset][x+xOffset].charAt(0) != piece.charAt(0)){
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
			if (board[y+yOffset][x+xOffset].charAt(0) != piece.charAt(0)){
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
			if (board[y+yOffset][x+xOffset].charAt(0) != piece.charAt(0)){
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
			if (board[y+yOffset][x+xOffset].charAt(0) != piece.charAt(0)){
				moves.push(""+(x+xOffset)+""+(y+yOffset));
			}
		}
	}
	return moves;
}
