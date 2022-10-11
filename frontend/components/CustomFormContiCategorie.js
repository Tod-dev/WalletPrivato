import React, { useState } from "react";
import { icons, mainColor, secondaryColor } from "../config";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  SafeAreaView,
  Switch,
} from "react-native";
import ColorPicker from "./ColorPicker";
import IconPicker from "react-native-icon-picker";
import ElementoIcona from "./ElementoIcona";

const generateRandomColor = () => {
  let color = "ffffff";
  while (color === "ffffff")
    color = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + color;
};

export default CustomFormConti = ({
  handleCancelForm,
  initalState,
  operationType,
  handleSubmitForm,
  isCat,
}) => {
  const {
    id,
    nome: name,
    amount: saldo,
    descrizione: descr,
    colore,
    icona,
    iconfamily,
    spesa,
  } = initalState;
  let isInsert;
  if (operationType === "INSERT") {
    //INSERT
    isInsert = true;
  } else {
    //UPDATE - DELETE - DETAIL
    isInsert = false;
    if (!id) handleCancelForm();
    //console.log(saldo);
  }
  //console.log("OPERATION TYPE:", operationType);
  const [nome, setNome] = useState(name || "");
  const [amount, setAmount] = useState(saldo ? saldo.toFixed(2) : 0);
  const [descrizione, setDescrizione] = useState(descr || "");
  const [color, setColor] = useState(colore || generateRandomColor());
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [isSpesa, setIsSpesa] = useState(spesa);

  const [icon, setIcon] = useState({
    icon: icona || "creditcard",
    family: iconfamily || "AntDesign",
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingVertical: 10,
        width: "100%",
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 40 }}>
        {isInsert ? "Crea" : "Modifica"} {isCat ? "Categoria" : "Conto"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder={isCat ? "Nome della categoria" : "Nome del conto"}
        onChangeText={setNome}
        value={nome}
      ></TextInput>

      {!isCat && (
        <TextInput
          style={styles.input}
          onChangeText={setAmount}
          value={amount}
          placeholder="Saldo del conto"
          keyboardType="numeric"
        />
      )}
      {isCat && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text>{isSpesa ? "Spesa" : "Entrata"}</Text>
          <Switch
            trackColor={{ false: "gray", true: "gray" }}
            thumbColor={isSpesa ? "red" : "green"}
            onValueChange={() => setIsSpesa((previousState) => !previousState)}
            value={isSpesa}
          />
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Descrizione"
        onChangeText={setDescrizione}
        value={descrizione}
        multiline
        numberOfLines={3}
      />
      <View style={styles.iconPickerContainer}>
        <IconPicker
          showIconPicker={showIconPicker}
          toggleIconPicker={() => setShowIconPicker(!showIconPicker)}
          iconDetails={icons}
          onSelect={(element) => {
            setShowIconPicker(false);
            setIcon(element);
            //console.log(element.icon);
          }}
          content={
            <ElementoIcona
              icona={icon.icon}
              family={icon.family}
              size={35}
              colore={color}
            />
          }
        />
      </View>
      <View style={styles.pickerContainer}>
        <ColorPicker
          color={color}
          onColorChange={setColor}
          thumbSize={20}
          sliderHidden={true}
          noSnap={false}
          swatches={false}
          discrete={false}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: secondaryColor }}
          onPress={() => handleCancelForm()}
        >
          <Text style={styles.buttonText}>Chiudi</Text>
        </TouchableOpacity>
        {isInsert && (
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: mainColor }}
            onPress={() =>
              handleSubmitForm(
                id,
                amount,
                nome,
                color,
                icon,
                descrizione,
                false,
                isSpesa
              )
            }
          >
            <Text style={styles.buttonText}>Crea</Text>
          </TouchableOpacity>
        )}
        {!isInsert && (
          <>
            <TouchableOpacity
              style={{ ...styles.button, backgroundColor: mainColor }}
              onPress={() =>
                handleSubmitForm(
                  id,
                  amount,
                  nome,
                  color,
                  icon,
                  descrizione,
                  false,
                  isSpesa
                )
              }
            >
              <Text style={styles.buttonText}>Modifica</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.button, backgroundColor: "white" }}
              onPress={() =>
                handleSubmitForm(
                  id,
                  amount,
                  nome,
                  color,
                  icon,
                  descrizione,
                  true,
                  isSpesa
                )
              }
            >
              <Text style={{ ...styles.buttonText, color: "red" }}>
                Elimina
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "90%",
    maxWidth: "90%",
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 3,
  },
  iconPickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    height: 30,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold", textAlign: "center" },
});
