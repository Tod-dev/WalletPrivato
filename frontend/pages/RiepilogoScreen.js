import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { mainColor } from "../config";

import { restApiUrl } from "../config";

const screenWidth = Dimensions.get("window").width;

export default function RiepilogoScreen({
  isRefreshRiepilogo,
  setIsRefreshRiepilogo,
}) {
  const [isLoading, setLoading] = useState(true);

  const da = "20220101";
  const a = "20221231";

  const [data, setData] = useState({
    entrate: [],
    spese: [],
    differenze: [],
    tot: 0,
  });

  const getRiepilogo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${restApiUrl}/riepilogo?da=${da}&a=${a}`);
      const json = await response.json();
      setData(json);
      console.log(json.entrate.map((k) => k.tot));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRiepilogo();
  }, []);

  useEffect(() => {
    if (isRefreshRiepilogo) {
      getRiepilogo();
      setIsRefreshRiepilogo(false);
    }
  }, [isRefreshRiepilogo]);

  const chartConfig = {
    backgroundGradientFrom: "white",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "white",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => mainColor,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };
  const chartData = {
    labels: [
      "Gen.",
      "Feb.",
      "Mar.",
      "Apr.",
      "Mag.",
      "Giu.",
      "Lug.",
      "Ago.",
      "Sett.",
      "Ott.",
      "Nov.",
      "Dic.",
    ],
    datasets: [
      {
        data: data.entrate.map((k) => k.tot),
        color: (opacity = 1) => "green", // optional
        strokeWidth: 2, // optional
      },
      {
        data: data.spese.map((k) => k.tot),
        color: (opacity = 1) => "red", // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ["Entrate", "Uscite"], // optional
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Importo size={20} amount={data.tot} />

      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
