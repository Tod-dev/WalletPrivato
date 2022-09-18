import React from "react";
import { AntDesign, FontAwesome, Entypo } from "@expo/vector-icons";

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
    default:
      return <AntDesign name={icona} size={dim} color={colore} />;
  }
};
