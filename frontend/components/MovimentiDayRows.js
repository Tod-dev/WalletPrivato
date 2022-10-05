import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { secondaryColor } from "../config";
import { parseDateyyyymmdd, getTranslateMonth } from "../utils/generic";
import Movimento from "./Movimento";

const MovimentiDayRows = ({ items, date, onLongPress, onPress }) => {
  //console.log("items:", items);

  const dd = parseDateyyyymmdd(date);
  //console.log(dd);
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    let k = items[i];
    //console.log(k.tipo);
    if (k.tipo == 1) {
      sum -= k.amount;
    } else if (k.tipo == 2) {
      sum += k.amount;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>
            {dd.day + " "}
          </Text>
          <View>
            <Text style={{ color: "white" }}>{dd.dayWeek}</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "white" }}>
                {getTranslateMonth(dd.month) + " "}
              </Text>
              <Text style={{ color: "white" }}>{dd.year}</Text>
            </View>
          </View>
        </View>
        <Importo style={{ flex: 1 }} amount={sum} isAbs={false} size={30} />
      </View>
      <View style={styles.container}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Movimento
              styles={styles.row}
              item={item}
              onLongPress={onLongPress}
              onPress={onPress}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
  },
  row: {
    backgroundColor: secondaryColor,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
});

export default MovimentiDayRows;
