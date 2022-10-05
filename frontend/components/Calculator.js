import React, { useState, useEffect } from "react";
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
import * as mathjs from "mathjs";
import DateTimePicker from "@react-native-community/datetimepicker";

const Calculator = ({
  color,
  note,
  setNote,
  val,
  setVal,
  date,
  setDate,
  isOggi,
  submit,
}) => {
  //TODO implementare setDate
  //console.log("VAL:", val);
  const [expression, setExpression] = useState();
  const [isImportValid, setIsImportValid] = useState();
  const [openDateModal, setOpenDateModal] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    checkNewExpression(val);
  }, []);

  const handleNewChar = (char) => {
    let newExpr = new String(expression);
    const valid = checkIfIsValidNewChar(newExpr, char);
    if (!valid) return;
    if (valid === "replace") {
      const toConcat = new String(char).toString();
      newExpr = newExpr.substring(0, newExpr.length - 1);
      newExpr = newExpr.concat(toConcat);
    } else if (char === "<-") {
      newExpr = newExpr.substring(0, newExpr.length - 1);
    } else if (char === "=") {
      //console.log(newExpr);
      try {
        const newExpression = mathjs.evaluate(newExpr.toString());
        //console.log("EVALUATE EXPRESSION:", newExpression);
        newExpr = newExpression;
        if (new Number(newExpression) < 0) {
          checkNewExpression(null);
          Alert.alert("Errore", "L'importo non può essere negativo", [
            {
              text: "ok",
              style: "cancel",
            },
          ]);
          return;
        }
      } catch (e) {
        Alert.alert("Errore", "Inserire un'operazione valida", [
          {
            text: "ok",
            style: "cancel",
          },
        ]);
      }
    } else {
      // DEFAULT
      //console.log("EXPRESSION:", expression, char);
      const toConcat = new String(char).toString();
      if (!expression) newExpr = toConcat;
      else {
        newExpr = newExpr.concat(toConcat);
      }
    }
    checkNewExpression(newExpr);
  };

  const checkIfIsValidNewChar = (exp, c) => {
    exp = new String(exp);
    if (isOperation(c)) {
      if (!exp || exp.length == 0) return false;
      if (isOperation(exp.charAt(exp.length - 1))) return "replace";
    } else if (c === ".") {
      if (!exp || exp.length == 0) return false;
      if (isOperation(exp.charAt(exp.length - 1))) return false;
      if (exp.charAt(exp.length - 1) === ".") return false;

      const piu = exp.lastIndexOf("+");
      const per = exp.lastIndexOf("*");
      const meno = exp.lastIndexOf("-");
      const div = exp.lastIndexOf("/");

      const lastIndex = Math.max(piu, per, meno, div);
      const lastNumber = "" + exp.substring(lastIndex + 1, exp.length);
      //console.log(lastNumber, typeof lastNumber, lastNumber.search(/\./));
      if (lastNumber.search(/\./) != -1) return false;
    } else if (isDigit(c)) {
      //check the number
      const piu = exp.lastIndexOf("+");
      const per = exp.lastIndexOf("*");
      const meno = exp.lastIndexOf("-");
      const div = exp.lastIndexOf("/");

      const lastIndex = Math.max(piu, per, meno, div);
      const lastNumber = exp.substring(lastIndex + 1, exp.length);
      const [int, dec] = lastNumber.split(".");
      //console.log(int, dec);
      if (dec && dec.length == 2) {
        return false;
      }
      //console.log("int", int, dec, lastNumber, lastNumber.search(/\./));
      if (int && lastNumber.search(/\./) === -1 && int.length > 8) return false;
    }
    return true;
  };

  const isOperation = (c) => {
    if (c === "+" || c === "-" || c === "*" || c === "/") {
      return true;
    }
    return false;
  };

  const isDigit = (c) => {
    if (
      c === "0" ||
      c === "1" ||
      c === "2" ||
      c === "3" ||
      c === "4" ||
      c === "5" ||
      c === "6" ||
      c === "7" ||
      c === "8" ||
      c === "9"
    ) {
      return true;
    }
    return false;
  };

  const splitExperssionOnOperations = () => {
    const array = [];
    let currentNumber = "";
    if (!expression) return [];
    let stringToIter = new String(expression);
    let i = 0;
    for (const c of stringToIter) {
      if (isOperation(c)) {
        array.push({ key: i++, value: currentNumber });
        currentNumber = "";
        array.push({ isOp: true, value: c, key: i++ });
      } else {
        currentNumber = currentNumber.concat(c);
      }
    }
    if (currentNumber) {
      array.push({ key: i++, value: currentNumber });
    }
    //console.log("ARRAY:", array);
    return array;
  };

  const checkNewExpression = (newExpr) => {
    if (newExpr && !isNaN(newExpr)) {
      //!IMPORT
      setIsImportValid(true);
    } else {
      //EXPRESSION
      setIsImportValid(false);
    }
    setExpression(newExpr);
  };

  useEffect(() => {
    if (isSubmit) {
      submit();
      setIsSubmit(false);
    }
  }, [isSubmit]);

  const handleSubmit = () => {
    if (!isImportValid) {
      return console.log("ERRORE: importo non valido");
    }
    setVal(new Number(expression).toFixed(2).toString());
    setIsSubmit(true);
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
        {splitExperssionOnOperations().map((k, i) => {
          //console.log(k);
          return (
            <Importo
              key={k.key}
              amount={k.value}
              isAbs={true}
              color={isImportValid ? color : "black"}
              size={30}
              isNotEuroSign={
                i == splitExperssionOnOperations().length - 1 ? false : true
              }
              isString={k.isOp}
            />
          );
        })}
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
          <CalculatorBox text="+" onPress={() => handleNewChar("+")} />
          <CalculatorBox text="-" onPress={() => handleNewChar("-")} />
          <CalculatorBox text="*" onPress={() => handleNewChar("*")} />
          <CalculatorBox text="/" onPress={() => handleNewChar("/")} />
        </View>
        <View style={{ flex: 3, flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <CalculatorBox text="7" onPress={() => handleNewChar("7")} />
            <CalculatorBox text="4" onPress={() => handleNewChar("4")} />
            <CalculatorBox text="1" onPress={() => handleNewChar("1")} />
            <CalculatorBox text="Date" onPress={() => setOpenDateModal(true)} />
          </View>
          <View style={{ flex: 1 }}>
            <CalculatorBox text="8" onPress={() => handleNewChar("8")} />
            <CalculatorBox text="5" onPress={() => handleNewChar("5")} />
            <CalculatorBox text="2" onPress={() => handleNewChar("2")} />
            <CalculatorBox text="0" onPress={() => handleNewChar("0")} />
          </View>
          <View style={{ flex: 1 }}>
            <CalculatorBox text="9" onPress={() => handleNewChar("9")} />
            <CalculatorBox text="6" onPress={() => handleNewChar("6")} />
            <CalculatorBox text="3" onPress={() => handleNewChar("3")} />
            <CalculatorBox text="." onPress={() => handleNewChar(".")} />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <CalculatorBox text="<-" onPress={() => handleNewChar("<-")} />
          <CalculatorBox
            text="CANC"
            onPress={() => {
              setExpression("0");
              setIsImportValid(true);
            }}
          />
          <TouchableOpacity
            style={{
              flex: 2,
              ...styles.box,
              backgroundColor: isImportValid ? mainColor : secondaryColor,
            }}
            onPress={() => {
              if (isImportValid) {
                return handleSubmit();
              }
              handleNewChar("=");
            }}
          >
            <Text style={{ ...styles.textBox, color: "white" }}>
              {isImportValid && "GO"}
              {!isImportValid && "="}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {openDateModal && (
        <DateTimePicker
          value={date}
          onChange={(e, selectedDate) => {
            setOpenDateModal(false);
            setDate(selectedDate);
          }}
        />
      )}
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
