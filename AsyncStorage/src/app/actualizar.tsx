// Importamos router para poder cambiar de pantalla
import { router } from "expo-router";

// Importamos los componentes que vamos a utilizar de React Native
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// Importamos useState para guardar y actualizar información
import { useState } from "react";

// Importamos AsyncStorage para guardar los gastos de forma local
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Actualizar() {

  // Guardamos la lista de gastos
  const [gastos, setGastos] = useState<any[]>([]);

  // Guardamos el gasto que fue seleccionado
  const [seleccionado, setSeleccionado] = useState<any>(null);

  // Guardamos el concepto que se está modificando
  const [concepto, setConcepto] = useState("");

  // Guardamos el valor que se está modificando
  const [valor, setValor] = useState("");

  // Guardamos los mensajes de error o confirmación
  const [mensaje, setMensaje] = useState("");


  // Función para cargar los gastos guardados
  const cargarGastos = async () => {

    // Buscamos los gastos guardados en AsyncStorage
    const datos = await AsyncStorage.getItem("gastos");


    // Verificamos si no existen datos guardados
    if (datos === null) {

      // Dejamos la lista vacía
      setGastos([]);

      // Mostramos un mensaje
      setMensaje("No hay gastos para actualizar.");

      return;
    }


    // Convertimos los datos de texto a un arreglo
    const lista = JSON.parse(datos);


    // Verificamos si el arreglo está vacío
    if (lista.length === 0) {

      // Dejamos la lista vacía
      setGastos([]);

      // Mostramos un mensaje
      setMensaje("No hay gastos para actualizar.");

      return;
    }


    // Guardamos los gastos en el estado
    setGastos(lista);

    // Limpiamos el mensaje
    setMensaje("");
  };


  // Función para seleccionar un gasto
  const seleccionarGasto = (gasto: any) => {

    // Guardamos el gasto seleccionado
    setSeleccionado(gasto);

    // Mostramos el concepto actual en el campo
    setConcepto(gasto.concepto);

    // Mostramos el valor actual en el campo
    setValor(String(gasto.valor));

    // Limpiamos el mensaje anterior
    setMensaje("");
  };


  // Función para guardar los cambios realizados
  const guardarCambios = async () => {

    // Verificamos que exista un gasto seleccionado
    if (seleccionado === null) {
      setMensaje("Selecciona un gasto.");
      return;
    }


    // VALIDAR CONCEPTO

    // Verificamos que el concepto no esté vacío
    if (concepto.trim() === "") {
      setMensaje("Escribe el concepto.");
      return;
    }

    // Verificamos que tenga mínimo 2 caracteres
    if (concepto.trim().length < 2) {
      setMensaje("El concepto debe tener mínimo 2 caracteres.");
      return;
    }

    // Verificamos que no tenga más de 50 caracteres
    if (concepto.trim().length > 50) {
      setMensaje("El concepto no puede tener más de 50 caracteres.");
      return;
    }


    // VALIDAR VALOR

    // Verificamos que el valor no esté vacío
    if (valor === "") {
      setMensaje("Escribe el valor.");
      return;
    }

    // Verificamos que el valor solamente tenga números
    if (!/^[0-9]+$/.test(valor)) {
      setMensaje("El valor solo debe tener números.");
      return;
    }

    // Convertimos el valor de texto a número
    const numero = Number(valor);

    // Verificamos que el valor sea mayor que 0
    if (numero <= 0) {
      setMensaje("El valor debe ser mayor que 0.");
      return;
    }

    // Verificamos que no supere los $10.000.000
    if (numero > 10000000) {
      setMensaje("El valor no puede superar $10.000.000.");
      return;
    }


    // Recorremos todos los gastos
    // y modificamos solamente el que fue seleccionado
    const nuevosGastos = gastos.map((gasto) => {

      // Comparamos los ID para encontrar el gasto seleccionado
      if (gasto.id === seleccionado.id) {

        // Devolvemos el gasto con los nuevos datos
        return {
          id: gasto.id,
          concepto: concepto.trim(),
          valor: numero,
        };
      }


      // Si no es el seleccionado, lo dejamos igual
      return gasto;
    });


    // Guardamos nuevamente todos los gastos en AsyncStorage
    await AsyncStorage.setItem(
      "gastos",
      JSON.stringify(nuevosGastos)
    );


    // Actualizamos la lista que se muestra en pantalla
    setGastos(nuevosGastos);

    // Mostramos mensaje de confirmación
    setMensaje("Gasto actualizado correctamente.");


    // Quitamos la selección
    setSeleccionado(null);

    // Limpiamos el campo concepto
    setConcepto("");

    // Limpiamos el campo valor
    setValor("");
  };


  return (

    // Evita que el teclado tape los campos
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >

      {/* Permite desplazarse por toda la pantalla */}
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >

        {/* Título de la pantalla */}
        <Text style={styles.titulo}>
          ACTUALIZAR GASTO
        </Text>


        {/* Botón para mostrar los gastos */}
        <Button
          title="VER GASTOS"
          onPress={cargarGastos}
        />


        {/* Lista de gastos */}
        <View style={styles.lista}>

          {/* Recorremos todos los gastos */}
          {gastos.map((gasto) => (

            <View
              key={gasto.id}
              style={styles.gasto}
            >

              {/* Mostramos el concepto */}
              <Text style={styles.concepto}>
                {gasto.concepto}
              </Text>


              {/* Mostramos el valor */}
              <Text>
                Valor: ${gasto.valor}
              </Text>


              {/* Botón para seleccionar el gasto */}
              <Button
                title="SELECCIONAR"
                onPress={() => seleccionarGasto(gasto)}
              />

            </View>

          ))}

        </View>


        {/* Los campos aparecen solamente cuando seleccionamos un gasto */}
        {seleccionado !== null && (

          <View>

            {/* Texto del campo para cambiar el concepto */}
            <Text>
              Nuevo concepto:
            </Text>


            {/* Campo donde modificamos el concepto */}
            <TextInput
              style={styles.input}
              value={concepto}
              onChangeText={setConcepto}
              placeholder="Nuevo concepto"
            />


            {/* Texto del campo para cambiar el valor */}
            <Text>
              Nuevo valor:
            </Text>


            {/* Campo donde modificamos el valor */}
            <TextInput
              style={styles.input}
              value={valor}
              onChangeText={setValor}
              keyboardType="numeric"
              placeholder="Nuevo valor"
            />


            {/* Botón para guardar los cambios */}
            <Button
              title="GUARDAR CAMBIOS"
              onPress={guardarCambios}
            />

          </View>

        )}


        {/* Mostramos mensajes de error o confirmación */}
        <Text style={styles.mensaje}>
          {mensaje}
        </Text>


        {/* Contenedor del botón volver */}
        <View style={styles.volver}>

          {/* Botón para regresar al inicio */}
          <Button
            title="VOLVER AL INICIO"
            onPress={() => router.push("/")}
          />

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}


// ESTILOS DE LA PANTALLA
const styles = StyleSheet.create({

  // Estilo del contenedor principal
  container: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: "#F3F8FF",
  },


  // Estilo del título
  titulo: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#315B7D",
  },


  // Espacio de la lista
  lista: {
    marginTop: 20,
    marginBottom: 10,
  },


  // Estilo de cada gasto
  gasto: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 15,
    marginBottom: 10,
  },


  // Estilo del concepto
  concepto: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },


  // Estilo de los campos de texto
  input: {
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "white",
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
  },


  // Estilo de los mensajes
  mensaje: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 15,
  },


  // Estilo del botón volver
  volver: {
    marginTop: 10,
  },

});