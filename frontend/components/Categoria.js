import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import ElementoIcona from "./ElementoIcona";
import Importo from "./Importo";

export default Categoria = (props) => {
  //console.log(props);
  const { categoria, handleTouch, isActive } = props;
  const { id, nome, sum, colore, icona, iconfamily } = categoria;
  return (
    <TouchableOpacity
      onPress={() => handleTouch(categoria)}
      style={{
        ...styles.container,
        borderWidth: isActive ? 2 : null,
        borderColor: colore,
        borderRadius: 10,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700", flexWrap: "nowrap" }}>
        {nome}
      </Text>
      <ElementoIcona
        icona={icona}
        family={iconfamily}
        colore={colore}
        size={40}
        width={58}
        height={50}
      />
      {sum && <Importo amount={sum} isAbs={true} color="black" size={15} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: 20,
    paddingBottom: 10,
    paddingHorizontal: 5,
    marginTop: 20,
    borderColor: "black",
    width: 120,
    height: 100,
    flexWrap: "nowrap",
  },
});
