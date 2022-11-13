import React, { useState, useEffect, useContext } from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import GestureRecognizer from 'react-native-swipe-gestures'
import { mainColor } from '../config'
import GlobalContext from '../context/GlobalContext'
import { restApiUrl } from '../config'
import Loading from '../components/Loading'

const screenWidth = Dimensions.get('window').width

export default function RiepilogoScreen({
  isRefreshRiepilogo,
  setIsRefreshRiepilogo,
  navigation
}) {
  const { config } = useContext(GlobalContext)
  const { configGestureHandler } = config
  const [isLoading, setLoading] = useState(true)
  const [year, setYear] = useState(new Date().getFullYear())

  const da = year + '0101'
  const a = year + '1231'

  const [data, setData] = useState({
    entrate: [],
    spese: [],
    differenze: [],
    tot: 0,
  })

  const getRiepilogo = async () => {
    try {
      setLoading(true)
      console.log("call on year:" + year)
      const response = await fetch(`${restApiUrl}/riepilogo?da=${da}&a=${a}`)
      if (!response.ok) return;
      const json = await response.json()

      console.log(json)
      setData(json)
      console.log(json.entrate.map((k) => k.tot))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getRiepilogo()
  }, [year])

  useEffect(() => {
    if (isRefreshRiepilogo) {
      getRiepilogo()
      setIsRefreshRiepilogo(false)
    }
  }, [isRefreshRiepilogo])

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
  const chartData = {
    labels: [
      'Gen.',
      'Feb.',
      'Mar.',
      'Apr.',
      'Mag.',
      'Giu.',
      'Lug.',
      'Ago.',
      'Sett.',
      'Ott.',
      'Nov.',
      'Dic.',
    ],
    datasets: [
      {
        data: data.entrate.map((k) => k.tot),
        color: (opacity = 1) => 'green', // optional
        strokeWidth: 2, // optional
      },
      {
        data: data.spese.map((k) => k.tot),
        color: (opacity = 1) => 'red', // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ['Entrate', 'Uscite'], // optional
  }

  const switchYear = (newYear) => {
    setYear(newYear)
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <GestureRecognizer
      onSwipeLeft={(state) => switchYear(year + 1)}
      onSwipeRight={(state) => switchYear(year - 1)}
      config={configGestureHandler}
      style={styles.container}
    >
      <View style={styles.container}>
        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Anno: {year}</Text>
        <Importo size={30} amount={data.tot} />

        <LineChart
          data={chartData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Mese', {
            year: year,

            screenWidth: screenWidth
          })}>
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
            Dettaglio Mesi
          </Text>
        </TouchableOpacity>
      </View>
    </GestureRecognizer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
