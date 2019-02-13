/* eslint-disable react-native/no-color-literals */
import React from "react";
import { TouchableHighlight, StyleSheet, Text, View } from "react-native";

import Square from "./square.ios";
import Piece from "./piece.ios";
const CONSTANTS = require("./constants.ios");

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedPiece: null };
  }

  render() {
    return <View style={styles.container}>{this.createTiles()}</View>;
  }

  pushHistory = pos => {
    let row = pos[0],
      col = pos[1];

    const currentSquare = {
      square: CONSTANTS.COLUMNS[col] + CONSTANTS.ROWS[row]
    };

    this.props.game.history.push(currentSquare.square);
  };

  createTiles = () => {
    const squares = [];
    const pieces = [];
    const moves = [];
    const currentColor = this.props.turn === "#FFFFFF" ? "white" : "black";
    const player = this.props.game.currentPlayer;
    const selectedPiece = this.state.selectedPiece;
    const board = this.props.game.board.grid;
    debugger;
    if (selectedPiece !== null) {
      this.startPos = [selectedPiece.row, selectedPiece.column];
    }

    board.forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        let key = parseInt(
          (rowIndex + 1).toString() + (colIndex + 1).toString()
        );

        squares.push(
          <Square
            column={colIndex}
            row={rowIndex}
            selectable={
              selectedPiece !== null &&
              this.state.piece.validMove([rowIndex, colIndex])
            }
            selected={
              selectedPiece !== null &&
              selectedPiece.row === rowIndex &&
              selectedPiece.column === colIndex
            }
            onSquareSelect={this.onSquareSelected}
            key={key}
          />
        );

        if (piece !== null) {
          let type = piece.toString(),
            color = piece.color;

          pieces.push(
            <Piece
              piece={type}
              key={key * 100}
              color={color}
              column={colIndex}
              row={rowIndex}
              selectable={
                currentColor === color ||
                (selectedPiece !== null &&
                  this.state.piece.validMove([rowIndex, colIndex]))
              }
              onPieceSelect={this.onPieceSelected}
            />
          );
        }
      });
    });

    return [...squares, ...pieces];
  };

  canCastle = piece => {
    let type = piece.constructor.name,
      king = this.state.piece,
      kingMoves = king.possibleMoves(),
      pos = piece.pos;

    if (type === "Rook" && !piece.moved && !king.moved) {
      for (var i = 0; i < kingMoves.length; i++) {
        let move = kingMoves[i];
        if (piece.pos[0] === move[0] && piece.pos[1] === move[1]) {
          return true;
        }
      }
    }

    return false;
  };

  onPieceSelected = (row, column, color) => {
    let currentColor = this.props.turn === "#FFFFFF" ? "white" : "black";
    let selectedPiece = this.state.selectedPiece;
    let piece = this.props.game.board.grid[row][column];

    if (selectedPiece !== null) {
      if (currentColor !== color || this.canCastle(piece)) {
        this.onSquareSelected(row, column);
      } else {
        if (selectedPiece.row !== row || selectedPiece.column !== column) {
          this.setState({
            selectedPiece: { row: row, column: column }
          });
        } else {
          this.setState({ selectedPiece: null });
        }
      }
    } else {
      this.setState({
        selectedPiece: { row: row, column: column },
        piece: piece
      });
    }
  };

  onSquareSelected = (row, column) => {
    if (this.state.selectedPiece === null) {
      return;
    }
    this.endPos = [row, column];
    this.pushHistory(this.startPos);
    this.pushHistory(this.endPos);
    this.props.game.move(this.startPos, this.endPos);
    this.turnComplete();
  };

  turnComplete = () => {
    this.startPos = null;
    this.endPos = null;
    this.props.turnComplete();
    this.setState({ selectedPiece: null });
  };
}

const styles = StyleSheet.create({
  container: {
    width: 375,
    height: 375,
    backgroundColor: "#F5FCFF",
    flexDirection: "row",
    flexWrap: "wrap"
  }
});
