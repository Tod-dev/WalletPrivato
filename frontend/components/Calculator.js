import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { mainColor, secondaryColor } from "../config";
import { getTranslateMonth } from "../utils/generic";
import CalculatorBox from "./CalculatorBox";
import Importo from "./Importo";

const Calculator = ({
  color,
  note,
  setNote,
  val,
  setVal,
  date,
  setDate,
  isOggi,
}) => {
  //TODO implementare setDate
  const [op, setOp] = useState(null);

  const handleOp = (value) => {
    console.log("New value Op:", val, value, op);
    let finalValue = new Number(val / 100);
    if (op == "+") {
      finalValue += value;
    } else if (op == "-") {
      finalValue -= value;
    } else if (op == "*") {
      finalValue *= value;
    } else if (op == "/") {
      finalValue /= value;
    }
    finalValue *= 100;
    finalValue = finalValue.toFixed(0);
    console.log("finalValue", finalValue);
    setValCheck(finalValue);
  };

  const effectiveValue = new Number(val / 100).toFixed(2);

  const setValCheck = (valore) => {
    const v = new Number(valore);
    console.log("num", v, valore);
    let value = v;
    if (v < 0) value = 0;
    if (v > 1000000000.0) value = 1000000000.0;
    setVal(new String(value));
  };

  const handleNewVal = (value) => {
    console.log("New Value:", val, value);
    if (op) {
      handleOp(value);
      setOp(null);
    } else {
      concatValue(value);
    }
  };

  const concatValue = (value) => {
    if (!val || val == 0) {
      setValCheck(value);
      return;
    }
    const s = new String(val);
    let newS = s.concat(value);
    if (s.length > 2) {
      const k = s.substring(0, s.length - 2);
      const last = s.substring(s.length - 2, s.length);
      newS = k.concat(value).concat(last);
    }
    console.log("stringa:", s, newS);
    setValCheck(newS);
  };

  const removeValue = () => {
    let n = new Number(val);
    let s = new String(n);
    if (s.length > 0) {
      let finalValue = s.substring(0, s.length - 1);
      if (s.length > 2) {
        const k = s.substring(0, s.length - 2);
        const last = s.substring(s.length - 2, s.length);
        finalValue = k.substring(0, k.length - 1).concat(last);
      }
      console.log(s, finalValue);
      setValCheck(finalValue);
    }
  };

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <View
        style={{
          height: 60,
          borderBottomWidth: 1,
          borderColor: secondaryColor,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Importo amount={effectiveValue} isAbs={true} color={color} size={30} />
      </View>
      <View
        style={{
          height: 40,
          borderBottomWidth: 1,
          borderColor: secondaryColor,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <TextInput
          style={{ textAlign: "center" }}
          onChangeText={(k) => setNote(k)}
          value={note}
          placeholder="Note..."
        />
      </View>
      <View
        style={{
          height: 40,
          borderBottomWidth: 1,
          borderColor: secondaryColor,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Text>
          {isOggi ? "OGGI, " : ""}
          {date.getDate()} {getTranslateMonth(date.getMonth() + 1)}{" "}
          {date.getFullYear()}
        </Text>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <CalculatorBox text="+" onPress={() => setOp("+")} />
          <CalculatorBox text="-" onPress={() => setOp("-")} />
          <CalculatorBox text="*" onPress={() => setOp("*")} />
          <CalculatorBox text="/" onPress={() => setOp("/")} />
        </View>
        <View style={{ flex: 3, flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <CalculatorBox text="7" onPress={() => handleNewVal(7)} />
            <CalculatorBox text="4" onPress={() => handleNewVal(4)} />
            <CalculatorBox text="1" onPress={() => handleNewVal(1)} />
            <CalculatorBox text="Date" onPress={() => {}} />
          </View>
          <View style={{ flex: 1 }}>
            <CalculatorBox text="8" onPress={() => handleNewVal(8)} />
            <CalculatorBox text="5" onPress={() => handleNewVal(5)} />
            <CalculatorBox text="2" onPress={() => handleNewVal(2)} />
            <CalculatorBox text="0" onPress={() => handleNewVal(0)} />
          </View>
          <View style={{ flex: 1 }}>
            <CalculatorBox text="9" onPress={() => handleNewVal(9)} />
            <CalculatorBox text="6" onPress={() => handleNewVal(6)} />
            <CalculatorBox text="3" onPress={() => handleNewVal(3)} />
            <CalculatorBox text="CANC" onPress={() => setValCheck("0")} />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <CalculatorBox text="<-" onPress={() => removeValue()} />
          <View
            style={{
              flex: 3,
              ...styles.box,
              backgroundColor: mainColor,
            }}
          >
            <Text style={{ ...styles.textBox, color: "white" }}>=</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Calculator;

const styles = StyleSheet.create({
  box: {
    borderWidth: 0.5,
    borderColor: secondaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  textBox: {
    fontSize: 20,
  },
});
