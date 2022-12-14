import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { restApiUrl, secondaryColor } from "../config";
import MyCCPicker from "./MyCCPicker";
import Calculator from "./Calculator";
import { parseDateyyyymmdd, formatDate } from "../utils/generic";

const CustomFormMovimento = ({ closeForm, setIsRefreshMov, movimento }) => {
  //TODO: movimento da update
  // if (movimento) mode = "UPDATE"; else mode = "INSERT";
  const [isLoading, setLoading] = useState(true);
  const [cc, setCC] = useState(null);
  const [catEntrate, setCatEntrate] = useState(null);
  const [catSpese, setCatSpese] = useState(null);
  const operationTypes = { spesa: 1, entrata: 2, trasferimento: 3 };
  const [opType, setOpType] = useState(
    movimento ? movimento.tipo : operationTypes.spesa
  );
  const [currentIdFrom, setCurrentIdFrom] = useState(
    movimento ? movimento.idfrom : null
  );
  const [currentIdTo, setCurrentIdTo] = useState(
    movimento ? movimento.idto : null
  );
  const [note, setNote] = useState(movimento ? movimento.descrizione : null);
  const [val, setVal] = useState(movimento ? movimento.amount : null);
  const oggi = new Date();
  const [date, setDate] = useState(
    movimento ? parseDateyyyymmdd(movimento.datamov).dd : oggi
  );
  const isOggi =
    date.getFullYear() == oggi.getFullYear() &&
    date.getMonth() == oggi.getMonth() &&
    date.getDate() == oggi.getDate()
      ? true
      : false;

  const color =
    opType == operationTypes.trasferimento
      ? secondaryColor
      : opType == operationTypes.entrata
      ? "green"
      : "red";

  const colorDescribtion =
    opType == operationTypes.trasferimento
      ? "Trasferimento"
      : opType == operationTypes.entrata
      ? "Entrata"
      : "Spesa";

  const getCCData = async () => {
    try {
      const response = await fetch(`${restApiUrl}/movimenti/ccdata`);
      const json = await response.json();
      if (!json.cc.length || !json.catEntrate.length || !json.catSpese.length) {
        Alert.alert(
          "Errore",
          "Inserire almeno un conto, una categoria di entrate e una di spese",
          [
            {
              text: "ok",
              style: "cancel",
            },
          ]
        );
        closeForm();
      }
      //console.log(json);

      setCC(json.cc);
      setCatEntrate(json.catEntrate);
      setCatSpese(json.catSpese);
      if (!movimento) {
        setCurrentIdFrom(json.cc[0].id);
        setCurrentIdTo(
          opType == operationTypes.trasferimento
            ? json.cc[1].id
            : opType == operationTypes.entrata
            ? json.catEntrate[0].id
            : json.catSpese[0].id
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCCData();
  }, []);

  const handleOpChange = (v) => {
    setCurrentIdTo(
      v == operationTypes.trasferimento
        ? cc[1].id
        : v == operationTypes.entrata
        ? catEntrate[0].id
        : catSpese[0].id
    );
    setOpType(v);
  };

  const handleSubmit = async () => {
    console.log("SUBMIT");
    const params = {
      da: currentIdFrom,
      a: currentIdTo,
      amount: val,
      tipomovid: opType,
      descrizione: note,
      datamov: formatDate(date),
    };
    //console.log(params);
    const method = "POST";
    try {
      const response = await fetch(
        `${restApiUrl}/movimenti${movimento ? "/" + movimento.id : ""}`,
        {
          method: method,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        }
      );
      if (!response.ok) {
        Alert.alert(
          "Errore",
          "Impossibile completare l'operazione sul movimento!",
          [
            {
              text: "ok",
              style: "cancel",
            },
          ]
        );
      } else {
        closeForm();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshMov(true);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.menuOp}>
        <View style={styles.menuOpView}>
          <TouchableOpacity
            onPress={() => handleOpChange(operationTypes.spesa)}
          >
            <Text style={{ ...styles.menuOpText, backgroundColor: "red" }}>
              Spesa
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menuOpView}>
          <TouchableOpacity
            onPress={() => handleOpChange(operationTypes.entrata)}
          >
            <Text style={{ ...styles.menuOpText, backgroundColor: "green" }}>
              Entrata
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menuOpView}>
          <TouchableOpacity
            onPress={() => handleOpChange(operationTypes.trasferimento)}
          >
            <Text style={styles.menuOpText}>Trasferimento</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text
        style={{
          ...styles.textOpTranslate,
          color: color,
          borderBottomColor: color,
        }}
      >
        {colorDescribtion}
      </Text>
      <View style={styles.fromToContainer}>
        <MyCCPicker
          isFrom={true}
          isConto={true}
          arrayPicker={cc}
          currentId={currentIdFrom}
          setCurrentId={setCurrentIdFrom}
        />
        <MyCCPicker
          isFrom={false}
          isConto={opType == operationTypes.trasferimento ? true : false}
          arrayPicker={
            opType == operationTypes.trasferimento
              ? cc
              : opType == operationTypes.entrata
              ? catEntrate
              : catSpese
          }
          currentId={currentIdTo}
          setCurrentId={setCurrentIdTo}
        />
      </View>
      <Calculator
        color={color}
        note={note}
        setNote={setNote}
        val={val}
        setVal={setVal}
        date={date}
        setDate={setDate}
        isOggi={isOggi}
        submit={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  menuOp: {
    flexDirection: "row",
    width: "100%",
  },
  menuOpView: {
    flex: 1,
  },
  menuOpText: {
    color: "white",
    fontSize: 20,
    backgroundColor: secondaryColor,
    textAlign: "center",
    padding: 8,
  },
  menuOpTextActive: {
    color: "white",
    fontSize: 20,
    backgroundColor: secondaryColor,
    textAlign: "center",
    padding: 8,
  },
  textOpTranslate: {
    textAlign: "center",
    fontSize: 25,
    marginVertical: 10,
    borderBottomWidth: 2,
  },
  fromToContainer: {
    flexDirection: "row",
    width: "100%",
  },
});

export default CustomFormMovimento;
