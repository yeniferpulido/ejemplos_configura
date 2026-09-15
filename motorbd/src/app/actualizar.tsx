import { router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState } from "react";
import * as SQLite from "expo-sqlite";

export default function Actualizar() {

  const [gastos, setGastos] = useState<any[]>([]);
  const [seleccionado, setSeleccionado] = useState<any>(null);

  const [concepto, setConcepto] = useState("");
  const [valor, setValor] = useState("");

  const [mensaje, setMensaje] = useState("");

  const cargarGastos = async () => {

    const db = await SQLite.openDatabaseAsync("gastos.db");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS gastos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        concepto TEXT NOT NULL,
        valor INTEGER NOT NULL
      );
    `);

    const lista = await db.getAllAsync(
      "SELECT * FROM gastos ORDER BY id DESC"
    );

    if (lista.length === 0) {
      setGastos([]);
      setMensaje("No hay gastos para actualizar.");
      return;
    }

    setGastos(lista);
    setMensaje("");
  };

  const seleccionarGasto = (gasto: any) => {

    setSeleccionado(gasto);
    setConcepto(gasto.concepto);
    setValor(String(gasto.valor));
    setMensaje("");
  };

  const guardarCambios = async () => {

    if (seleccionado === null) {
      setMensaje("Selecciona un gasto.");
      return;
    }

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

    const db = await SQLite.openDatabaseAsync("gastos.db");

    await db.runAsync(
      "UPDATE gastos SET concepto = ?, valor = ? WHERE id = ?",
      concepto.trim(),
      numero,
      seleccionado.id
    );

    const lista = await db.getAllAsync(
      "SELECT * FROM gastos ORDER BY id DESC"
    );

    setGastos(lista);
    setMensaje("Gasto actualizado correctamente.");

    setSeleccionado(null);
    setConcepto("");
    setValor("");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        ACTUALIZAR GASTO
      </Text>

      <Button
        title="VER GASTOS"
        onPress={cargarGastos}
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

            <Button
              title="SELECCIONAR"
              onPress={() => seleccionarGasto(gasto)}
            />

          </View>

        ))}

      </ScrollView>

      {seleccionado !== null && (

        <View>

          <Text>Nuevo concepto:</Text>

          <TextInput
            style={styles.input}
            value={concepto}
            onChangeText={setConcepto}
          />

          <Text>Nuevo valor:</Text>

          <TextInput
            style={styles.input}
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
          />

          <Button
            title="GUARDAR CAMBIOS"
            onPress={guardarCambios}
          />

        </View>

      )}

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