import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ElementoIcona from "./ElementoIcona";
import Importo from "./Importo";

const Movimento = ({ item, styles: s, onLongPress, onPress }) => {
  //console.log("item:", item);
  const isTransfer = item.tipo == 3;
  const isSpesa = item.tipo == 1;
  const isEntrata = item.tipo == 2;

  let from = {
    icon: item.iconafrom,
    family: item.iconafamilyfrom,
    colore: item.colorefrom,
    nome: item.nomefrom,
  };
  let to = {
    icon: item.iconato,
    family: item.iconfamilyto,
    colore: item.coloreto,
    nome: item.nometo,
  };
  //console.log(from, to);

  return (
    <TouchableOpacity
      style={{ ...s, ...styles.container }}
      onLongPress={() => onLongPress(item)}
      onPress={() => onPress(item)}
    >
      <View style={styles.leftContainer}>
        <>
          <ElementoIcona
            icona={from.icon}
            family={from.family}
            colore={from.colore}
            size={40}
            width={58}
            height={50}
            styles={{ marginRight: 14 }}
          />
        </>
        <View style={{ justifyContent: "space-evenly" }}>
          <Text style={{ fontWeight: "bold", fontSize: 21 }}>{from.nome}</Text>
          <View style={{ flexDirection: "row" }}>
            <MyIcon
              icona={to.icon}
              family={to.family}
              size={24}
              color={to.colore}
            />
            <Text
              style={{
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: 18,
                marginLeft: 5,
              }}
            >
              {to.nome}
            </Text>
          </View>
        </View>
      </View>
      <Importo
        amount={isSpesa ? item.amount * -1 : item.amount}
        isAbs={isTransfer}
        color={isTransfer ? "darkgray" : null}
        size={18}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "ghostwhite",
    height: 80,
    paddingHorizontal: 30,
    borderColor: "gainsboro",
    borderBottomWidth: 1,
  },
  leftContainer: {
    flexDirection: "row",
  },
});

export default Movimento;
