import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, Button, TouchableHighlight, Alert, ScrollView } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from 'react-native-element-dropdown';
import shortid from 'shortid';
import colors from '../utils/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Formulario = ({ reservas, setReservas, guardarMostrarForm, guardarReservasStorage }) => {
    const [nombre, guardarNombre] = useState('');
    const [fecha, guardarFecha] = useState('');
    const [hora, guardarHora] = useState('');
    const [seccion, guardarSeccion] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const data = [
        { label: 'No Fumadores', value: 'No Fumadores' },
        { label: 'Fumadores', value: 'Fumadores' },
      ];

    const showDatePicker = () => { setDatePickerVisibility(true); };
    const hideDatePicker = () => { setDatePickerVisibility(false); };
    const confirmarFecha = date => {
        const opciones = {
            year: 'numeric',
            month: 'long',
            day: "2-digit"
        };
        guardarFecha(date.toLocaleDateString('es-ES', opciones));
        hideDatePicker();
    };
    const formatAMPM = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
      }
      
    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };
    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };
    const confirmarHora = hora => {
        const opciones = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false
        };
        var hour = new Date(hora.toLocaleString('es-ES'));
        guardarHora(formatAMPM(hour));
        hideTimePicker();
    };
    const crearNuevaReserva = () => {
        if (nombre.trim() === '' || fecha.trim() === '' || hora.trim() === '' || seccion.trim() === '') {
            mostrarAlerta();
            return;
        }
        const reserva = { nombre, fecha, hora, seccion };
        reserva.id = shortid.generate();
        const reservasNuevo = [...reservas, reserva];
        setReservas(reservasNuevo);
        guardarReservasStorage(JSON.stringify(reservasNuevo));
        guardarMostrarForm(false);
        guardarNombre('');
        guardarHora('');
        guardarFecha('');
        guardarSeccion('');
    }
    const mostrarAlerta = () => {
        Alert.alert('Error',
            'Todos los campos son obligatorios',
            [{
                text: 'OK'
            }]
        )
    }
    return (
        <>
            <ScrollView style={styles.formulario}>
                <View>
                    <Text style={styles.label}>Nombre:</Text>
                    <TextInput style={styles.input} onChangeText={texto => guardarNombre(texto)} />
                </View>
                <View>
                    <Text style={styles.label}>Fecha:</Text>
                    <Button title="Seleccionar Fecha" onPress={showDatePicker} />
                    <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={confirmarFecha} onCancel={hideDatePicker} locale='es_ES' headerTextIOS="Elige la fecha" cancelTextIOS="Cancelar" confirmTextIOS="Confirmar" />
                    <Text>{fecha}</Text>
                </View>
                <View>
                    <Text style={styles.label}>Hora:</Text>
                    <Button title="Seleccionar Hora" onPress={showTimePicker} />
                    <DateTimePickerModal isVisible={isTimePickerVisible} mode="time" onConfirm={confirmarHora} onCancel={hideTimePicker} locale='es_ES' headerTextIOS="Elige una Hora" cancelTextIOS="Cancelar" confirmTextIOS="Confirmar" />
                    <Text>{hora}</Text>
                </View>
                <View>
                    <Text style={styles.label}>Sección:</Text>
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={data}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Seleccionar' : '...'}
                        searchPlaceholder="Buscar..."
                        value={seccion}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            guardarSeccion(item.value);
                            setIsFocus(false);
                        }}
                        renderLeftIcon={() => (
                            <AntDesign
                                style={styles.icon}
                                color={isFocus ? 'blue' : 'black'}
                                name="Safety"
                                size={20}
                            />
                        )}
                    />
                </View>
                <View>
                    <TouchableHighlight onPress={() => crearNuevaReserva()} style={styles.btnSubmit}>
                        <Text style={styles.textoSubmit}>Crear Nueva Reserva</Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>
        </>
    );
}
const styles = StyleSheet.create({
    formulario: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        flex: 1
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20
    },
    input: {
        marginTop: 10,
        height: 50,
        borderColor: '#e1e1e1',
        borderWidth: 1,
        borderStyle: 'solid'
    },
    btnSubmit: {
        padding: 10,
        backgroundColor: colors.BUTTON_COLOR,
        marginVertical: 10
    },
    textoSubmit: {
        color: '#FFF',
        fontWeight: 'bold',
        textAlign: 'center'
    }
})
export default Formulario;