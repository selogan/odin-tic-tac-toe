const Square = function (position) {
    let token = "";
    const addToken = (player) => {
        token = player;
    };

    const getToken = () => token;
    const getPosition = () => position;

    return { addToken, getToken, getPosition };
}

const Gameboard = (function () {
    let gameboard = [];
    let position = 0;
    for (let i = 0; i < 3; i++) {
        gameboard[i] = [];
        for (let j = 0; j < 3; j++) {
            gameboard[i].push(Square(position++))
        }
    }

    const getGameboard = () => gameboard;

    const playTurn = (player, position) => {
        let validMove = false;
        if (!gameboard.flat()[position].getToken()) {
            gameboard.flat()[position].addToken(player);
            validMove = true;
        }
        return validMove;
    };

    const printGameBoard = () => console.table(getGameboard().map((row) => row.map((square) => square.getToken())));

    const clearGameBoard = () => {
        for (let square of getGameboard().flat()) {
            square.addToken("");
        }
    }

    return { getGameboard, playTurn, printGameBoard, clearGameBoard };
})()

const GameController = (function () {
    const playerOne = {
        name: "Player One",
        token: "X"
    };
    const playerTwo = {
        name: "Player Two",
        token: "O"
    };

    const winCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let turns = 0;

    let activePlayer = playerOne;

    const switchActivePlayer = () => activePlayer = activePlayer === playerOne ? playerTwo : playerOne;

    const getActivePlayer = () => activePlayer;

    const changePlayerOneName = (value) => playerOne.name = value;
    const changePlayerTwoName = (value) => playerTwo.name = value;

    const playTurn = (position) => {
        let validMove = Gameboard.playTurn(getActivePlayer().token, position);
        if (validMove && checkWinner()) {
            Gameboard.printGameBoard();
            console.log(`${getActivePlayer().name} won!`);
        } else {
            if (validMove) {
                switchActivePlayer();
                turns++;
                Gameboard.printGameBoard();
                console.log(`It's ${getActivePlayer().name}'s turn!`);
            } else {
                Gameboard.printGameBoard();
                console.log(`Square taken! It's still ${getActivePlayer().name}'s turn!`);
            }
        }
    };

    const checkWinner = () => {
        let roundWon = false;
        for (let combo of winCombinations) {
            let [a, b, c] = combo;
            const flatGameboard = Gameboard.getGameboard().flat();
            let positionOne = flatGameboard[a].getToken();
            let positionTwo = flatGameboard[b].getToken();
            let positionThree = flatGameboard[c].getToken();
            if ((positionOne != "" && positionTwo != "" && positionThree != "") &&
                (positionOne == positionTwo && positionTwo == positionThree)) {
                roundWon = true;
            }
        }
        return roundWon;
    }

    const checkTie = () => {
        return turns == 9;
    }

    const restart = () => {
        activePlayer = playerOne;
        turns = 0;
        Gameboard.clearGameBoard();
    }

    return { getActivePlayer, playTurn, restart, checkWinner, checkTie, changePlayerOneName, changePlayerTwoName };

})()

const displayController = (function () {
    const playerTurn = document.querySelector(".turn");
    const board = document.querySelector(".board");
    const restart = document.querySelector(".restart");
    const playerOne = document.querySelector("#playerOne");
    const playerTwo = document.querySelector("#playerTwo");

    const updateDisplay = () => {
        board.textContent = "";

        Gameboard.getGameboard().flat().forEach(square =>{
            const squareButton = document.createElement("button");
            squareButton.setAttribute("class", "square");
            squareButton.dataset.position = square.getPosition();
            squareButton.textContent = square.getToken();
            board.appendChild(squareButton);
        })

        if (GameController.checkWinner()) {
            playerTurn.textContent = `${GameController.getActivePlayer().name} won!`;
            const squareBtn = document.querySelectorAll(".square");
            squareBtn.forEach((square) => square.disabled = true);
            playerOne.disabled = true;
            playerTwo.disabled = true;
        } else if (GameController.checkTie()) {
            playerTurn.textContent = "It's a tie!";
            const squareBtn = document.querySelectorAll(".square");
            squareBtn.forEach((square) => square.disabled = true);
            playerOne.disabled = true;
            playerTwo.disabled = true;
        } else {
            playerTurn.textContent = `It's ${GameController.getActivePlayer().name}'s turn!`;
        }

    }

    const boardClickHandler = (e) => {
        const position = e.target.dataset.position;
        GameController.playTurn(position);
        updateDisplay();
    }

    const restartClickHandler = () => {
        GameController.restart();
        playerOne.disabled = false;
        playerTwo.disabled = false;
        updateDisplay();
    }

    const changePlayerOneName = (e) => {
        GameController.changePlayerOneName(e.target.value);
        playerTurn.textContent = `It's ${GameController.getActivePlayer().name}'s turn!`;
    }

    const changePlayerTwoName = (e) => {
        GameController.changePlayerTwoName(e.target.value);
        playerTurn.textContent = `It's ${GameController.getActivePlayer().name}'s turn!`;
    }

    board.addEventListener("click", boardClickHandler);
    restart.addEventListener("click", restartClickHandler);
    playerOne.addEventListener("input", changePlayerOneName);
    playerTwo.addEventListener("input", changePlayerTwoName);

    updateDisplay();
})();