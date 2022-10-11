import React from "react";
import {
  AntDesign,
  FontAwesome,
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";

export default MyIcon = ({ icona, family, size, color }) => {
  let dim = size,
    colore = color;
  if (!dim) dim = 30;
  if (!colore) colore = "white";

  //console.log(icona, family, colore, dim);

  if (!family || !icona)
    return <AntDesign name="creditcard" size={dim} color={colore} />;

  switch (family) {
    case "FontAwesome":
      return <FontAwesome name={icona} size={dim} color={colore} />;
    case "Entypo":
      return <Entypo name={icona} size={dim} color={colore} />;
    case "MaterialIcons":
      return <MaterialIcons name={icona} size={dim} color={colore} />;
    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons name={icona} size={dim} color={colore} />;
    case "FontAwesome5":
      return <FontAwesome5 name={icona} size={dim} color={colore} />;
    case "Ionicons":
      return <Ionicons name={icona} size={dim} color={colore} />;
    default:
      return <AntDesign name={icona} size={dim} color={colore} />;
  }
};
