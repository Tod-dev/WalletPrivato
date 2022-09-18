import React from "react";
import { Text } from "react-native";

const currencyFormat = (num) => {
  //console.log("num", num);
  return (
    new Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "€"
  );
};

exports.currencyFormat = currencyFormat;

export default Importo = ({ size, amount, color, isAbs }) => {
  if (!amount || isNaN(amount) || amount.length == 0) amount = 0;
  //console.log("AMOUNT:", amount);
  if (isAbs && amount < 0) amount *= -1;
  return (
    <Text
      style={{
        fontWeight: "bold",
        fontSize: size,
        color: color ? color : amount < 0 ? "red" : "green",
      }}
    >
      {currencyFormat(amount)}
    </Text>
  );
};
