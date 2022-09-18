import React from "react";
import { View } from "react-native";
import MyIcon from "./MyIcon";

/* 
  MANDATORY: icona, colore
  OPTIONAL: size,width,height
*/
export default ElementoIcona = ({
  icona,
  family,
  colore,
  size,
  width,
  height,
  styles,
}) => {
  return (
    <View
      style={{
        backgroundColor: colore,
        width: width || 50,
        height: height || 45,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        ...styles,
      }}
    >
      <MyIcon icona={icona} family={family} size={size} color={"white"} />
    </View>
  );
};
