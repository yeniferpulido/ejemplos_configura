import { router } from "expo-router";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import * as SQLite from "expo-sqlite";

export default function Crear() {

  const [concepto, setConcepto] = useState("");
  const [valor, setValor] = useState("");
  const [mensaje, setMensaje] = useState("");

  const guardarGasto = async () => {

    // Validar concepto
    if (concepto.trim() === "") {
      setMensaje("Escribe el concepto.");
      return;
    }

    if (concepto.trim().length < 2) {
      setMensaje("El concepto debe tener mínimo 2 caracteres.");
      return;
    }

    if (concepto.trim().length > 50) {
      setMensaje("El concepto no puede tener más de 50 caracteres.");
      return;
    }

    // Validar valor
    if (valor === "") {
      setMensaje("Escribe el valor.");
      return;
    }

    if (!/^[0-9]+$/.test(valor)) {
      setMensaje("El valor solo debe tener números.");
      return;
    }

    const numero = Number(valor);

    if (numero <= 0) {
      setMensaje("El valor debe ser mayor que 0.");
      return;
    }

    if (numero > 10000000) {
      setMensaje("El valor no puede superar $10.000.000.");
      return;
    }

    // Abrir SQLite
    const db = await SQLite.openDatabaseAsync("gastos.db");

    // Crear tabla
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS gastos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        concepto TEXT NOT NULL,
        valor INTEGER NOT NULL
      );
    `);

    // Guardar gasto
    await db.runAsync(
      "INSERT INTO gastos (concepto, valor) VALUES (?, ?)",
      concepto.trim(),
      numero
    );

    setMensaje("Gasto guardado correctamente.");

    setConcepto("");
    setValor("");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        CREAR GASTO
      </Text>

      <Text>Concepto:</Text>

      <TextInput
        style={styles.input}
        value={concepto}
        onChangeText={setConcepto}
        placeholder="Ej: Almuerzo"
      />

      <Text>Valor:</Text>

      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={setValor}
        placeholder="Ej: 15000"
        keyboardType="numeric"
      />

      <Button
        title="GUARDAR"
        onPress={guardarGasto}
      />

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
    marginBottom: 30,
    color: "#315B7D",
  },

  input: {
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "white",
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
  },

  mensaje: {
    textAlign: "center",
    marginTop: 15,
    marginBottom: 15,
  },

  volver: {
    marginTop: 10,
  },
});