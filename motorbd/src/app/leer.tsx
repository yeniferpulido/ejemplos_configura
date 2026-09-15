import { router } from "expo-router";
import { View, Text, Button, StyleSheet, ScrollView, } from "react-native";
import { useState } from "react";
import * as SQLite from "expo-sqlite";

  // Componente principal de la pantalla
export default function Leer() {

    // Estado donde se guardan los gastos que se leen de SQLite
  const [gastos, setGastos] = useState<any[]>([]);

  // Estado para mostrar mensajes al usuario
  const [mensaje, setMensaje] = useState("");

 // Función que se ejecuta cuando se presiona "MOSTRAR GASTOS"
  const leerGastos = async () => {

    // Abrimos o creamos la base de datos gastos.db
    const db = await SQLite.openDatabaseAsync("gastos.db");

    // Creamos la tabla gastos si todavía no existe
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS gastos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        concepto TEXT NOT NULL,
        valor INTEGER NOT NULL
      );
    `);


        // Consultamos todos los gastos guardados
    // ORDER BY id DESC hace que aparezcan primero los más recientes
    const lista = await db.getAllAsync(
      "SELECT * FROM gastos ORDER BY id DESC"
    );

    if (lista.length === 0) {
      setGastos([]);
      setMensaje("No hay gastos guardados.");
      return;
    }

    setGastos(lista);
    setMensaje("");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        VER GASTOS
      </Text>

      <Button
        title="MOSTRAR GASTOS"
        onPress={leerGastos}
      />

      <ScrollView style={styles.lista}>

        {gastos.map((gasto) => (

          <View
            key={gasto.id}
            style={styles.gasto}
          >

            <Text style={styles.concepto}>
              {gasto.concepto}
            </Text>

            <Text>
              Valor: ${gasto.valor}
            </Text>

          </View>

        ))}

      </ScrollView>

      <Text style={styles.mensaje}>
        {mensaje}
      </Text>

      <View style={styles.volver}>
        <Button
          title="VOLVER AL INICIO"
          onPress={() => router.push("/")}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },

  mensaje: {
    textAlign: "center",
    marginBottom: 15,
  },

  volver: {
    marginTop: 10,
  },
});