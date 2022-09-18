import React, { useRef, useState } from "react";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();

import ContiScreen from "./pages/ContiScreen";
import CategorieScreen from "./pages/CategorieScreen";
import MovimentiScreen from "./pages/MovimentiScreen";
import RiepilogoScreen from "./pages/RiepilogoScreen";
import { mainColor, secondaryColor } from "./config";
import GlobalContext from "./context/GlobalContext";

function MyTabs({ refRBSheetConti, refRBSheetCat }) {
  return (
    <Tab.Navigator
      initialRouteName="Movimenti"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          iconName = "add-circle-outline";

          switch (route.name) {
            case "Conti":
              iconName = "card-outline";
              break;
            case "Categorie":
              iconName = "apps-outline";
              break;
            case "Movimenti":
              iconName = "move-outline";
              break;
            case "Riepilogo":
              iconName = "analytics-outline";
              break;
            default:
              iconName = "add-circle-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: 5,
        },
        tabBarActiveTintColor: mainColor,
        tabBarInactiveTintColor: secondaryColor,
      })}
    >
      <Tab.Screen
        name="Conti"
        component={ContiScreen}
        options={{
          headerRight: () => (
            <Ionicons
              name="md-add"
              size={30}
              color="black"
              onPress={() => refRBSheetConti.current.open()}
              style={{ marginRight: 15 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Categorie"
        component={CategorieScreen}
        options={{
          headerRight: () => (
            <Ionicons
              name="md-add"
              size={30}
              color="black"
              onPress={() => refRBSheetCat.current.open()}
              style={{ marginRight: 15 }}
            />
          ),
        }}
      />
      <Tab.Screen name="Movimenti" component={MovimentiScreen} />
      <Tab.Screen name="Riepilogo" component={RiepilogoScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [contiData, setContiData] = useState([]);
  const [catData, setCatData] = useState([]);
  const [movData, setMovData] = useState([]);
  const refRBSheetConti = useRef();
  const refRBSheetCat = useRef();
  const [anno, setAnno] = useState(new Date().getFullYear());
  const [mese, setMese] = useState(new Date().getMonth() + 1);
  const DateFiltersValues = {
    ANNOMESE: "ANNOMESE",
    ANNO: "ANNO",
  };
  const [dateFiltersType, setDateFiltersType] = useState(
    DateFiltersValues.ANNOMESE
  );

  const previousAnnoMese = (s) => {
    //console.log("previous annomese");
    if (dateFiltersType === DateFiltersValues.ANNOMESE) {
      if (mese == 1) {
        setMese(12);
        setAnno(anno - 1);
        return;
      }
      setMese(mese - 1);
    } else if (dateFiltersType === DateFiltersValues.ANNO) {
      setAnno(anno - 1);
    }
  };

  const nextAnnoMese = (s) => {
    //console.log("next annomese");
    if (dateFiltersType === DateFiltersValues.ANNOMESE) {
      if (mese == 12) {
        setMese(1);
        setAnno(anno + 1);
        return;
      }
      setMese(mese + 1);
    } else if (dateFiltersType === DateFiltersValues.ANNO) {
      setAnno(anno + 1);
    }
  };

  Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [
      this.getFullYear(),
      (mm > 9 ? "" : "0") + mm,
      (dd > 9 ? "" : "0") + dd,
    ].join("");
  };

  const getDateParams = () => {
    let da, a;
    if (dateFiltersType === DateFiltersValues.ANNOMESE) {
      da = new Date(anno, mese - 1, 1);
      a = new Date(anno, mese, 0);
    } else if (dateFiltersType === DateFiltersValues.ANNO) {
      da = new Date(anno, 0, 1);
      a = new Date(anno, 11, 0);
    } else {
      da = null;
      a = null;
    }
    return {
      da: da.yyyymmdd(),
      a: a.yyyymmdd(),
    };
  };

  const configGestureHandler = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const globalState = {
    conti: {
      data: contiData,
      setData: setContiData,
      refRBSheet: refRBSheetConti,
    },
    categorie: {
      data: catData,
      setData: setCatData,
      refRBSheet: refRBSheetCat,
    },
    movimenti: {
      data: movData,
      setData: setMovData,
    },
    annomese: {
      mese: mese,
      anno: anno,
      setMese: setMese,
      setAnno: setAnno,
      nextAnnoMese: nextAnnoMese,
      previousAnnoMese: previousAnnoMese,
      getDateParams,
    },
    config: {
      configGestureHandler: configGestureHandler,
    },
  };

  return (
    <GlobalContext.Provider value={globalState}>
      <NavigationContainer>
        <MyTabs
          refRBSheetConti={refRBSheetConti}
          refRBSheetCat={refRBSheetCat}
        />
      </NavigationContainer>
    </GlobalContext.Provider>
  );
}
