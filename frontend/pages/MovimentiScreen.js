import React, { useState, useEffect, useContext, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { mainColor, restApiUrl, secondaryColor } from "../config";
import Importo from "../components/Importo";
import { AntDesign } from "@expo/vector-icons";
import { getTranslateMonth as getTranslate } from "../utils/generic";
import RBSheet from "react-native-raw-bottom-sheet";

import GestureRecognizer from "react-native-swipe-gestures";

import GlobalContext from "../context/GlobalContext";
import MovimentiDayRows from "../components/MovimentiDayRows";
import CustomFormMovimento from "../components/CustomFormMovimento";

export default function MovimentiScreen({
  setIsRefreshMov,
  isRefreshMov,
  setIsRefreshCat,
  setIsRefreshCC,
  setIsRefreshRiepilogo,
}) {
  const [isLoading, setLoading] = useState(true);
  const { movimenti, config, annomese } = useContext(GlobalContext);
  const { data, setData } = movimenti;
  const { mese, anno, nextAnnoMese, previousAnnoMese, getDateParams } = annomese;
  const { da, a } = getDateParams();
  const [movimento, setMovimento] = useState(null);
  //console.log("annomese:", anno, mese);

  //MODAL
  const refRBSheet = useRef();

  const getMovements = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${restApiUrl}/movimenti?da=${da}&a=${a}`);
      const json = await response.json();
      console.log("JSON", json);
      //setData(json);
      //console.log(json);
      const dates = [];
      Object.keys(json.data).map(function (date) {
        dates.unshift(json.data[date]);
      });
      json.data = dates;

      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("movimento", movimento);
    if (movimento) refRBSheet.current.open();
  }, [movimento]);

  useEffect(() => {
    getMovements();
  }, [mese, anno]);

  useEffect(() => {
    if (isRefreshMov) {
      getMovements();
      setIsRefreshMov(false);
      setIsRefreshCC(true);
      setIsRefreshCat(true);
      setIsRefreshRiepilogo(true);
    }
  }, [isRefreshMov]);

  const handleUpdate = (mov) => {
    //console.log("UPDATE", mov.id);
    setMovimento(mov);
  };

  const handleDelete = async (mov) => {
    console.log("DELETE", mov.id);

    Alert.alert("Attenzione", "Sei sicuro di voler eliminare il movimento!", [
      {
        text: "Annulla",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          const method = "DELETE";
          try {
            const response = await fetch(`${restApiUrl}/movimenti/${mov.id}`, {
              method: method,
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({}),
            });
            if (!response.ok) {
              Alert.alert("Errore", "Impossibile eliminare il movimento!", [
                {
                  text: "ok",
                  style: "cancel",
                },
              ]);
            } else {
              setIsRefreshMov(true);
            }
          } catch (error) {
            console.error(error);
          } finally {
          }
        },
      },
    ]);
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
        config={config}
        style={styles.container}
      >
        <View style={styles.containerAnnoMese}>
          <TouchableOpacity
            onPress={() => previousAnnoMese()}
            style={styles.arrow}
          >
            <AntDesign name="caretleft" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.annoMese}>
            {getTranslate(mese)} {anno}
          </Text>
          <TouchableOpacity onPress={() => nextAnnoMese()} style={styles.arrow}>
            <AntDesign name="caretright" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.sumsContainer}>
          <Importo
            size={30}
            amount={data.totIn}
            color={"green"}
            isAbs={false}
          />
          <Importo
            size={30}
            amount={data.totOut * -1}
            color={"red"}
            isAbs={false}
          />
        </View>
        <View
          style={{ borderWidth: 1, width: "100%", marginVertical: 0 }}
        ></View>
        {data.data && data.data.length ? (
          <View style={{ flex: 1, width: "100%", marginBottom: 8 }}>
            <FlatList
              data={data.data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <MovimentiDayRows
                  items={item.data}
                  date={item.id}
                  onLongPress={(k) => handleDelete(k)}
                  onPress={(k) => handleUpdate(k)}
                />
              )}
            />
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 20, color: secondaryColor }}>
              Nessun movimento presente
            </Text>
          </View>
        )}
      </GestureRecognizer>
      <TouchableOpacity
        onPress={() => refRBSheet.current.open()}
        style={styles.buttonAdd}
      >
        <Text
          style={{
            textAlign: "center",
            textAlignVertical: "center",
            fontSize: 30,
            color: "white",
          }}
        >
          +
        </Text>
      </TouchableOpacity>
      <RBSheet
        ref={refRBSheet}
        height={600}
        openDuration={400}
        closeOnPressMask={true}
        onClose={() => setMovimento(null)}
        customStyles={{
          container: {
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <CustomFormMovimento
          closeForm={() => {
            refRBSheet.current.close();
          }}
          movimento={movimento}
          setIsRefreshMov={setIsRefreshMov}
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
    width: "100%",
  },
  containerAnnoMese: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 30,
    marginVertical: 10,
  },
  annoMese: {
    fontSize: 30,
  },
  sumsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonAdd: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: mainColor,
    position: "absolute",
    bottom: 30,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
