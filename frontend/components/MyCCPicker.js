import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  FlatList,
  ScrollView,
} from "react-native";
import MyIcon from "./MyIcon";
import Modal from "react-native-modal";
import Categoria from "./Categoria";

const MyCCPicker = (props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  //console.log("picker props: ", props);
  const { isConto, isFrom, arrayPicker, currentId, setCurrentId } = props;
  //console.log(arrayPicker, currentId);
  const {
    id,
    nome,
    colore,
    icona,
    amount,
    tipocontoid,
    descrizione,
    conto,
    iconfamily,
  } = arrayPicker.filter((k) => k.id == currentId)[0];

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleChange = (k) => {
    setCurrentId(k.id);
    toggleModal();
  };

  return (
    <View style={{ ...styles.fromToView, backgroundColor: colore }}>
      <TouchableOpacity style={styles.fromToViewButton} onPress={toggleModal}>
        <Modal isVisible={isModalVisible}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              padding: 10,
            }}
          >
            <Text style={{ fontSize: 30 }}>
              Scegli {isConto ? "Conto" : "Categoria"}
            </Text>
            <ScrollView
              horizontal
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: "row",
                flexWrap: "nowrap",
              }}
            >
              <FlatList
                data={arrayPicker}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Categoria
                    categoria={item}
                    handleTouch={(k) => handleChange(k)}
                    isActive={item.id == currentId}
                  />
                )}
                showsHorizontalScrollIndicator={false}
                numColumns={2}
              />
            </ScrollView>
          </View>
        </Modal>
        <View>
          <Text style={styles.fromToDescribtion}>
            {isFrom ? "Da" : "A"} {isConto ? "Conto" : "Categoria"}
          </Text>
          <Text style={styles.fromToName}>{nome}</Text>
        </View>
        <View style={styles.iconContainer}>
          <MyIcon icona={icona} family={iconfamily} size={30} color={"white"} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fromToView: {
    flex: 1,
    flexDirection: "row",
  },
  fromToViewButton: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fromToName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 25,
  },
  fromToDescribtion: {
    color: "white",
    fontSize: 15,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyCCPicker;
