import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, FlatList, Alert } from "react-native";
import Conto from "../components/Conto";
import Importo from "../components/Importo";
import Loading from "../components/Loading";
import { restApiUrl } from "../config";
import GlobalContext from "../context/GlobalContext";
import RBSheet from "react-native-raw-bottom-sheet";
import CustomForm from "../components/CustomFormContiCategorie";

export default function ContiScreen({ isRefreshCC, setIsRefreshCC }) {
  const [isLoading, setLoading] = useState(true);
  const { conti } = useContext(GlobalContext);
  const { data, setData, refRBSheet } = conti;
  const [tot, setTot] = useState(0);
  const [operationType, setOperationType] = useState("INSERT");
  const [contoState, setContoState] = useState({});

  const getConti = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${restApiUrl}/conticategorie/conti`);
      const json = await response.json();
      setData(json.data);
      setTot(json.totConti);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConti();
  }, []);

  useEffect(() => {
    if (isRefreshCC) {
      getConti();
      setIsRefreshCC(false);
    }
  }, [isRefreshCC]);

  const handleSubmitFormInsertUpdate = async (
    id,
    amount,
    nome,
    color,
    icon,
    descrizione,
    isDelete
  ) => {
    const method = isDelete ? "DELETE" : "POST";
    let err = false;
    if (!amount || !nome || isNaN(amount)) err = true;
    //console.log({ id, amount, nome, color, icon, descrizione, isDelete, err });
    if (err) {
      Alert.alert("Conto non valido", "Inserire un nome e un saldo valido", [
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
          `${restApiUrl}/conticategorie/conti${updateDelete}`,
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
              amount: amount,
              descrizione: descrizione,
            }),
          }
        );
        if (!response.ok) {
          Alert.alert("Conto non valido", "Errore nell'operazione sul conto", [
            {
              text: "ok",
              style: "cancel",
            },
          ]);
        } else {
          getConti();
          closeFormConti();
        }
      } catch (error) {
        console.error(error);
      } finally {
      }
    }
  };

  const closeFormConti = () => {
    //console.log("closerModalCreaConto");
    setOperationType("INSERT");
    setContoState({});
    if (refRBSheet.current) refRBSheet.current.close();
  };

  const dettaglioConto = (conto) => {
    //console.log(conto);
    setOperationType("UPDATE");
    setContoState(conto);
    if (refRBSheet.current) refRBSheet.current.open();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Importo size={40} amount={tot} />
      <FlatList
        style={{ width: "100%", marginVertical: 20 }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Conto conto={item} handleTouch={dettaglioConto} />
        )}
      />
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
          handleCancelForm={closeFormConti}
          handleSubmitForm={handleSubmitFormInsertUpdate}
          operationType={operationType}
          initalState={contoState}
          isCat={false}
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
    paddingVertical: 10,
    width: "100%",
  },
});
