/* eslint-disable react-native/no-raw-text */
import { TouchableHighlight, StyleSheet, Text, View } from "react-native";
import React, { Component } from "react";

export default class Square extends Component {
  render() {
    const color =
      this.props.column % 2 === 1
        ? this.props.row % 2 === 1
          ? "#cfd7db"
          : "#8ca2ac"
        : this.props.row % 2 === 1
        ? "#8ca2ac"
        : "#cfd7db";

    const styles = {
      backgroundColor: this.props.selected ? "#376060" : color,
      width: 375 / 8,
      height: 375 / 8
    };

    const onPress = () => {
      this.props.onSquareSelect(this.props.row, this.props.column);
    };

    if (this.props.selectable) {
      return (
        <TouchableHighlight style={styles} onPress={onPress}>
          <View />
        </TouchableHighlight>
      );
    } else {
      return <View style={styles} />;
    }
  }
}
