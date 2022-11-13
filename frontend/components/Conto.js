import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Importo from './Importo'
import ElementoIcona from './ElementoIcona'

export default Conto = (props) => {
  const { conto, handleTouch } = props
  //console.log(conto);
  const {
    id,
    nome,
    amount,
    colore,
    icona,
    iconfamily,
    amount_effettivo,
  } = conto
  return (
    <TouchableOpacity
      onPress={() => handleTouch(conto)}
      style={styles.container}
    >
      <ElementoIcona icona={icona} family={iconfamily} colore={colore} />
      <View
        style={{
          borderBottomColor: '#666',
          borderBottomWidth: StyleSheet.hairlineWidth,
          paddingBottom: 10,
          marginHorizontal: 20,
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      >
        <Text style={{ fontSize: 20 }}>{nome}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '90%',
          }}
        >
          <Importo size={20} amount={amount} />
          {amount_effettivo && amount_effettivo != amount ? (
            <>
              <Importo
                size={20}
                amount={amount_effettivo-amount}
                color={amount_effettivo >= amount ? 'green' : 'red'}
                forceSing={true}
              />
            </>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 20,
    width: '100%',
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
})
