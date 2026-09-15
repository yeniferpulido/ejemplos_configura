import { router } from "expo-router";

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useState } from "react";

import * as SQLite from "expo-sqlite";


export default function Actualizar() {

  // Guardamos la lista de gastos
  const [gastos, setGastos] = useState<any[]>([]);

  // Guardamos el gasto que el usuario seleccionó
  const [seleccionado, setSeleccionado] = useState<any>(null);

  // Guardamos el nuevo concepto
  const [concepto, setConcepto] = useState("");

  // Guardamos el nuevo valor
  const [valor, setValor] = useState("");

  // Guardamos los mensajes que se muestran al usuario
  const [mensaje, setMensaje] = useState("");


  // Función para cargar los gastos desde SQLite
  const cargarGastos = async () => {

    // Abrimos la base de datos
    const db = await SQLite.openDatabaseAsync("gastos.db");

    // Creamos la tabla si todavía no existe
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS gastos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        concepto TEXT NOT NULL,
        valor INTEGER NOT NULL
      );
    `);

    // Buscamos todos los gastos guardados
    const lista = await db.getAllAsync(
      "SELECT * FROM gastos ORDER BY id DESC"
    );

    // Verificamos si no existen gastos
    if (lista.length === 0) {

      // Dejamos la lista vacía
      setGastos([]);

      // Mostramos un mensaje
      setMensaje("No hay gastos para actualizar.");

      return;
    }

    // Guardamos los gastos encontrados
    setGastos(lista);

    // Limpiamos el mensaje
    setMensaje("");
  };


  // Función para seleccionar un gasto
  const seleccionarGasto = (gasto: any) => {

    // Guardamos el gasto seleccionado
    setSeleccionado(gasto);

    // Colocamos el concepto actual en el campo de texto
    setConcepto(gasto.concepto);

    // Colocamos el valor actual en el campo de texto
    setValor(String(gasto.valor));

    // Limpiamos cualquier mensaje anterior
    setMensaje("");
  };


  // Función para guardar los cambios
  const guardarCambios = async () => {

    // Verificamos que primero se haya seleccionado un gasto
    if (seleccionado === null) {
      setMensaje("Selecciona un gasto.");
      return;
    }


    // VALIDACIONES DEL CONCEPTO

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


    // VALIDACIONES DEL VALOR

    // Verificamos que el valor no esté vacío
    if (valor === "") {
      setMensaje("Escribe el valor.");
      return;
    }

    // Verificamos que solamente tenga números
    if (!/^[0-9]+$/.test(valor)) {
      setMensaje("El valor solo debe tener números.");
      return;
    }

    // Convertimos el valor de texto a número
    const numero = Number(valor);

    // Verificamos que sea mayor que 0
    if (numero <= 0) {
      setMensaje("El valor debe ser mayor que 0.");
      return;
    }

    // Verificamos que no supere los $10.000.000
    if (numero > 10000000) {
      setMensaje("El valor no puede superar $10.000.000.");
      return;
    }


    // Abrimos la base de datos
    const db = await SQLite.openDatabaseAsync("gastos.db");


    // Actualizamos el gasto seleccionado
    // Los signos ? se reemplazan por los valores que enviamos
    await db.runAsync(
      "UPDATE gastos SET concepto = ?, valor = ? WHERE id = ?",
      concepto.trim(),
      numero,
      seleccionado.id
    );


    // Volvemos a consultar los gastos para mostrar los cambios
    const lista = await db.getAllAsync(
      "SELECT * FROM gastos ORDER BY id DESC"
    );


    // Actualizamos la lista en pantalla
    setGastos(lista);

    // Mostramos mensaje de confirmación
    setMensaje("Gasto actualizado correctamente.");


    // Quitamos el gasto seleccionado
    setSeleccionado(null);

    // Limpiamos el campo concepto
    setConcepto("");

    // Limpiamos el campo valor
    setValor("");
  };


  return (

    // KeyboardAvoidingView evita que el teclado tape los campos
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >

      {/* ScrollView permite desplazarse cuando aparece el teclado */}
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >

        {/* Título de la pantalla */}
        <Text style={styles.titulo}>
          ACTUALIZAR GASTO
        </Text>


        {/* Botón para cargar los gastos */}
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


        {/* Estos campos solamente aparecen cuando seleccionamos un gasto */}
        {seleccionado !== null && (

          <View>

            {/* Texto del campo concepto */}
            <Text>
              Nuevo concepto:
            </Text>


            {/* Campo para modificar el concepto */}
            <TextInput
              style={styles.input}
              value={concepto}
              onChangeText={setConcepto}
              placeholder="Nuevo concepto"
            />


            {/* Texto del campo valor */}
            <Text>
              Nuevo valor:
            </Text>


            {/* Campo para modificar el valor */}
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


        {/* Botón para regresar al inicio */}
        <View style={styles.volver}>

          <Button
            title="VOLVER AL INICIO"
            onPress={() => router.push("/")}
          />

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}


// ESTILOS
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: "#F3F8FF",
  },

  titulo: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#315B7D",
  },


  lista: {
    marginTop: 20,
    marginBottom: 10,
  },


  gasto: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 15,
    marginBottom: 10,
  },


  concepto: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "white",
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
  },



  mensaje: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 15,
  },


  
  volver: {
    marginTop: 10,
  },

});