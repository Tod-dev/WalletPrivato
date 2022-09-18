import React from "react";
import { View, ActivityIndicator } from "react-native";
import { mainColor } from "../config";

export default Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator color={mainColor} size={30} />
    </View>
  );
};
