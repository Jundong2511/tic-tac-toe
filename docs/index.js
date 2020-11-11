import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" id={props.id} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        id={"square" + i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let boardSquares = [];
    for (let row = 0; row < 3; row++) {
      let boardRow = [];
      for (let col = 0; col < 3; col++) {
        boardRow.push(
          <span key={row * 3 + col}>{this.renderSquare(row * 3 + col)}</span>
        );
      }
      boardSquares.push(
        <div className="board-row" key={row}>
          {boardRow}
        </div>
      );
    }

    return <div>{boardSquares}</div>;
  }
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          position: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      order: "Chang order to descending",
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const a = document.getElementsByClassName("button");
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    if (a) {
      for (let i = 0; i < a.length; i++) {
        a[i].style.fontWeight = "500";
      }
    }
    let x = 0;
    let y = 0;
    if (i > 2) {
      x = (i % 3) + 1;
      y = parseInt(i / 3) + 1;
    } else {
      x = i + 1;
      y = 1;
    }
    const position = [x, y];

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          position: position,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });

    const buttons = document.getElementsByClassName("button");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].style.fontWeight = "500";
    }
    for (let i = 0; i < 9; i++) {
      document.getElementById("square" + [i]).style = null;
    }
    document.getElementById(step).style.fontWeight = "900";
  }
  changeOrder() {
    // after click, if order is ascending change to descending
    // vice versa
    const orderCopy =
      this.state.order === "Change order to ascending"
        ? "Chang order to descending"
        : "Change order to ascending";
    this.setState({
      order: orderCopy,
    });
    var ol = document.getElementById("ol");

    var i = ol.childNodes.length;
    while (i--) {
      ol.appendChild(ol.childNodes[i]);
    }
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const position = history[move].position;
      const desc = move
        ? "Go to move #" + move + " position at " + position
        : "Go to game start";
      return (
        <li key={move}>
          <button
            style={{ fontWeight: 900 }}
            className="button"
            id={move}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });
    const nextAvailable = () => {
      return current.squares.includes(null);
    };
    nextAvailable();

    let status;
    if (winner) {
      for (let i = 0; i < winner[1].length; i++) {
        document.getElementById("square" + winner[1][i]).style =
          "background: #2980B9;background: -webkit-linear-gradient(to right, #FFFFFF, #6DD5FA, #2980B9);background: linear-gradient(to right, #FFFFFF, #6DD5FA, #2980B9) ";
      }
      status = "Winner: " + winner[0];
    } else if (nextAvailable()) {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    } else {
      status = "Tie !";
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <button onClick={() => this.changeOrder()}>{this.state.order}</button>
          <div>{status}</div>
          <ol id="ol">{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let winnerLine = [];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winnerLine = lines[i];
      return [squares[a], winnerLine];
    }
  }
  return null;
}
