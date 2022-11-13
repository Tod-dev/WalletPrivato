import React, { useEffect, useState, useContext } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native'
import { PieChart } from 'react-native-chart-kit'
import GestureRecognizer from 'react-native-swipe-gestures'
import GlobalContext from '../context/GlobalContext'
import { restApiUrl } from '../config'
import { getTranslateMonth } from '../utils/generic';
import Loading from '../components/Loading';
import { mainColor } from '../config'
import { ScrollView } from 'react-native-gesture-handler';



const RiepilogoMeseScreen = ({ navigation, route }) => {
    const { year, screenWidth } = route.params;
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const { config, annomese } = useContext(GlobalContext);
    const {setAnno, setMese} = annomese;
    const { configGestureHandler } = config;
    const [isLoading, setLoading] = useState(true)

    const [data, setData] = useState({
        sums: {},
        movements: {}
    })

    const dataChartsSpese = !data.sums.anno ? [] :
        data.sums.spese.data.map(k => {
            return {
                name: k.nome,
                population: k.tot_categoria,
                color: k.colore,
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            }
        }).sort((a, b) => a.population < b.population)
    const dataChartsEntrate = !data.sums.anno ? [] :
        data.sums.entrate.data.map(k => {
            return {
                name: k.nome,
                population: k.tot_categoria,
                color: k.colore,
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            }
        }).sort((a, b) => a.population < b.population)
    const getRiepilogoMese = async () => {
        //ajax call for year-month recap category per category
        try {
            setLoading(true)
            console.log("month: " + month)
            if (month < 1 || month > 12) return
            console.log("call on year-month:" + year + ' ' + month)
            const response = await fetch(`${restApiUrl}/riepilogo/mese?anno=${year}&mese=${month}`)
            if (!response.ok) return;
            const json = await response.json()
            //console.log(json)
            setData(json)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getRiepilogoMese();
    }, [year, month]);

    const onDetailMovements = () => {
        setAnno(year);
        setMese(month);
        navigation.navigate('Movimenti',{})
    }

    const chartConfig = {
        backgroundGradientFrom: 'white',
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: 'white',
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => mainColor,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
    }

    const switchMonth = (newMonth) => {
        console.log("in")
        let newState = newMonth;
        if (newMonth == 13) newState = 1
        if (newMonth == 0) newState = 12
        setMonth(newState)
    }

    if (isLoading) {
        return <Loading />
    }

    if (!data.sums.spese || data.sums.entrate.tot == 0 && data.sums.spese.tot == 0) {
        return (
            <GestureRecognizer
                onSwipeLeft={(state) => switchMonth(month + 1)}
                onSwipeRight={(state) => switchMonth(month - 1)}
                config={configGestureHandler}
                style={styles.container}
            >
                <View style={styles.container}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', textAlig: "center" }}>
                        {getTranslateMonth(month)} {year}
                    </Text>
                    <Text style={{ fontSize: 20 }}>
                        {'<-'} Nessun grafico disponibile!{'->'}
                    </Text>
                </View>
            </GestureRecognizer>);
    }

    return (
        <ScrollView >
            {data.sums.spese && data.sums.spese.tot > 0 && <View style={{ margin: 20, padding: 10 }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', textAlig: "center", }}>Spese {getTranslateMonth(month)} {year}</Text>
                <GestureRecognizer
                    onSwipeLeft={(state) => switchMonth(month + 1)}
                    onSwipeRight={(state) => switchMonth(month - 1)}
                    config={configGestureHandler}
                    style={styles.container}
                >
                    <View style={styles.container}>


                        <Importo size={30} amount={data.sums.spese.tot} color='red' />

                        <PieChart
                            data={dataChartsSpese}
                            width={screenWidth}
                            height={240}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            padding={"18"}
                            absolute
                        />

                        <TouchableOpacity
                            onPress={onDetailMovements}
                            style={{ marginBottom: 20 }}
                        >
                            <Text
                                style={{
                                    marginTop: 30,
                                    fontSize: 20,
                                    color: mainColor,
                                    borderColor: mainColor,
                                    borderWidth: 1,
                                    padding: 5,
                                    borderRadius: 10,
                                }}
                            >
                                Dettaglio Movimenti
                            </Text>
                        </TouchableOpacity>
                    </View>
                </GestureRecognizer>
            </View>}
            {data.sums.entrate && data.sums.entrate.tot > 0 && <View style={{ margin: 20, padding: 10 }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', textAlig: "center", }}>Entrate {getTranslateMonth(month)} {year}</Text>
                <GestureRecognizer
                    onSwipeLeft={(state) => switchMonth(month + 1)}
                    onSwipeRight={(state) => switchMonth(month - 1)}
                    config={configGestureHandler}
                    style={styles.container}
                >
                    <View style={styles.container}>


                        <Importo size={30} amount={data.sums.entrate.tot} color='green' />

                        <PieChart
                            data={dataChartsEntrate}
                            width={screenWidth}
                            height={240}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            padding={"18"}
                            absolute
                        />

                        <TouchableOpacity
                            onPress={onDetailMovements}
                            style={{ marginBottom: 20 }}
                        >
                            <Text
                                style={{
                                    marginTop: 30,
                                    fontSize: 20,
                                    color: mainColor,
                                    borderColor: mainColor,
                                    borderWidth: 1,
                                    padding: 5,
                                    borderRadius: 10,
                                }}
                            >
                                Dettaglio Movimenti
                            </Text>
                        </TouchableOpacity>
                    </View>
                </GestureRecognizer>
            </View>}
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default RiepilogoMeseScreen;
