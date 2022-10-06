import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Categoria from "../components/Categoria";
import Importo from "../components/Importo";
import GlobalContext from "../context/GlobalContext";
import { restApiUrl } from "../config";
import { AntDesign } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import GestureRecognizer from "react-native-swipe-gestures";
import CustomForm from "../components/CustomFormContiCategorie";

import { getTranslateMonth as getTranslate } from "../utils/generic";

export default function CategorieScreen({ isRefreshCat, setIsRefreshCat }) {
  const [isLoading, setLoading] = useState(true);
  const [isSpese, setIsSpese] = useState(true);
  const { categorie, config, annomese } = useContext(GlobalContext);
  const { configGestureHandler } = config;
  //console.log(categorie);
  const { data, setData, refRBSheet } = categorie;
  const { mese, anno, setMese, setAnno, nextAnnoMese, previousAnnoMese } =
    annomese;
  const [operationType, setOperationType] = useState("INSERT");
  const [catState, setCatState] = useState({});

  const getCategories = async () => {
    try {
      const speseEntrate = isSpese ? "uscite" : "entrate";
      const response = await fetch(
        `${restApiUrl}/conticategorie/categorie/${speseEntrate}?anno=${anno}&mese=${mese}`
      );
      const json = await response.json();
      //console.log("JSON", json);
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFormInsertUpdate = async (
    id,
    amount,
    nome,
    color,
    icon,
    descrizione,
    isDelete,
    isSpesa
  ) => {
    const method = isDelete ? "DELETE" : "POST";
    let err = false;
    if (!nome) err = true;
    //console.log({ id, amount, nome, color, icon, descrizione, isDelete, err });
    if (err) {
      Alert.alert("Categoria non valida", "Inserire un nome valido", [
        {
          text: "ok",
          style: "cancel",
        },
      ]);
    } else {
      //console.warn("IN");
      let updateDelete = "";
      if (operationType !== "INSERT") {
        updateDelete = "/" + id;
      }
      try {
        const response = await fetch(
          `${restApiUrl}/conticategorie/categorie${updateDelete}`,
          {
            method: method,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nome: nome,
              colore: color,
              icona: icon.icon,
              iconFamily: icon.family,
              descrizione: descrizione,
              isSpesa: isSpesa,
            }),
          }
        );
        if (!response.ok) {
          Alert.alert(
            "Categoria non valida",
            "Errore nell'operazione sulla categoria",
            [
              {
                text: "ok",
                style: "cancel",
              },
            ]
          );
        } else {
          getCategories();
          closeFormCategorie();
        }
      } catch (error) {
        console.error(error);
      } finally {
      }
    }
  };

  useEffect(() => {
    getCategories();
  }, [isSpese, mese, anno]);

  useEffect(() => {
    if (isRefreshCat) {
      getCategories();
      setIsRefreshCat(false);
    }
  }, [isRefreshCat]);

  const dettaglioCategoria = (cat) => {
    //console.log(cat);
    setOperationType("UPDATE");
    setCatState({ ...cat, spesa: isSpese });
    if (refRBSheet.current) refRBSheet.current.open();
  };

  const closeFormCategorie = () => {
    //console.log("closerModalCategoria");
    setOperationType("INSERT");
    setCatState({});
    if (refRBSheet.current) refRBSheet.current.close();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View
      style={{ flex: 1, justifyContent: isLoading ? "center" : "flex-start" }}
    >
      <GestureRecognizer
        onSwipeLeft={(state) => nextAnnoMese(state)}
        onSwipeRight={(state) => previousAnnoMese(state)}
        config={configGestureHandler}
        style={styles.container}
      >
        <TouchableOpacity
          style={{ justifyContent: "center", alignItems: "center" }}
          onPress={() => setIsSpese(!isSpese)}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 40,
            }}
          >
            {isSpese ? "Spese" : "Entrate"}
          </Text>
          <Importo
            size={40}
            amount={isSpese ? data.totOutMonth : data.totInMonth}
            color={isSpese ? "red" : "green"}
          />
          <Importo
            size={20}
            amount={isSpese ? data.totInMonth : data.totOutMonth}
            color={!isSpese ? "red" : "green"}
          />
        </TouchableOpacity>
        <View style={styles.containerAnnoMese}>
          <TouchableOpacity
            onPress={() => previousAnnoMese()}
            style={styles.arrow}
          >
            <AntDesign name="caretleft" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.annoMese}>
            {getTranslate(data.mese)} {data.anno}
          </Text>
          <TouchableOpacity onPress={() => nextAnnoMese()} style={styles.arrow}>
            <AntDesign name="caretright" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <FlatList
            data={data.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Categoria categoria={item} handleTouch={dettaglioCategoria} />
            )}
            showsHorizontalScrollIndicator={false}
            numColumns={2}
          />
        </ScrollView>
      </GestureRecognizer>
      <RBSheet
        ref={refRBSheet}
        height={700}
        openDuration={400}
        closeOnPressMask={false}
        customStyles={{
          container: {
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <CustomForm
          handleCancelForm={closeFormCategorie}
          handleSubmitForm={handleSubmitFormInsertUpdate}
          operationType={operationType}
          initalState={catState}
          isCat={true}
        />
      </RBSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  containerAnnoMese: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 30,
    marginVertical: 30,
  },
  annoMese: {
    fontSize: 30,
  },
  arrow: {
    fontSize: 30,
  },
});
