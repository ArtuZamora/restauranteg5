import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableHighlight, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import Reserva from './src/components/Reserva';
import Formulario from './src/components/Form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from './src/utils/colors';
const App = () => {
  // definir el state de reservas
  const [reservas, setReservas] = useState([]);
  const [mostrarform, guardarMostrarForm] = useState(false);
  useEffect(() => {
    const obtenerReservasStorage = async () => {
      try {
        const reservasStorage = await AsyncStorage.getItem('reservas');
        if (reservasStorage) {
          setReservas(JSON.parse(reservasStorage))
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    obtenerReservasStorage();
  }, []);
  // Elimina los pacientes del state 
  const eliminarReserva = id => {
    const reservasFiltradas = reservas.filter(reserva => reserva.id !== id);
    setReservas(reservasFiltradas);
    guardarReservasStorage(JSON.stringify(reservasFiltradas));
  }
  // Muestra u oculta el Formulario 
  const mostrarFormulario = () => {
    guardarMostrarForm(!mostrarform);
  }
  // Ocultar el teclado 
  const cerrarTeclado = () => {
    Keyboard.dismiss();
  } // Almacenar las reservas en storage
  const guardarReservasStorage = async (reservasJSON) => {
    try {
      await AsyncStorage.setItem('reservas', reservasJSON);
    }
    catch (error) {
      console.log(error);
    }
  }
  return (
    <TouchableWithoutFeedback onPress={() => cerrarTeclado()}>
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>Administrador de Reservas</Text>
        <View>
          <TouchableHighlight onPress={() => mostrarFormulario()} style={styles.btnMostrarForm}>
            <Text style={styles.textoMostrarForm}> {mostrarform ? 'Cancelar Crear Reserva' : 'Crear Nueva Reserva'} </Text>
          </TouchableHighlight>
        </View>
        <View style={styles.contenido}>
          {
            mostrarform ? (
              <>
                <Text style={styles.titulo}>Crear Nueva Reserva</Text>
                <Formulario reservas={reservas} setReservas={setReservas} guardarMostrarForm={guardarMostrarForm} guardarReservasStorage={guardarReservasStorage} />
              </>
            ) : (
              <>
                <Text style={styles.titulo}> {reservas.length > 0 ? 'Administra tus reservas' : 'No hay reservas, agrega una'} </Text>
                <FlatList style={styles.listado} data={reservas} renderItem={
                  ({ item }) =>
                    <Reserva item={item} eliminarReserva={eliminarReserva} />
                } keyExtractor={reserva => reserva.id} />
              </>
            )
          }
        </View>
      </View>
    </TouchableWithoutFeedback>);
};
const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: Colors.PRIMARY_COLOR,
    flex: 1
  },
  titulo: {
    color: '#FFF',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  contenido: {
    flex: 1,
    marginHorizontal: '2.5%',
  },
  listado: {
    flex: 1,
  },
  btnMostrarForm: {
    padding: 10,
    backgroundColor: Colors.BUTTON_COLOR,
    marginVertical: 10
  },
  textoMostrarForm: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
export default App;