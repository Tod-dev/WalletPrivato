import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { mainColor, secondaryColor } from "../config";

const CalculatorBox = ({ text, onPress }) => {
  var [isPress, setIsPress] = React.useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressOut={() => setIsPress(false)}
      onPressIn={() => setIsPress(true)}
      style={{ flex: 1 }}
    >
      <View style={isPress ? styles.btnPress : styles.box}>
        <Text style={styles.textBox}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CalculatorBox;

const styles = StyleSheet.create({
  box: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: secondaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  btnPress: {
    flex: 1,
    backgroundColor: mainColor,
    borderWidth: 1,
    borderColor: secondaryColor,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.6,
  },
  textBox: {
    fontSize: 26,
  },
});
