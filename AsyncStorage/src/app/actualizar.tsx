import { router } from "expo-router";
import { View, Text, Button, TextInput, StyleSheet, ScrollView,} from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Actualizar() {

  const [gastos, setGastos] = useState<any[]>([]);
  const [seleccionado, setSeleccionado] = useState<any>(null);

  const [concepto, setConcepto] = useState("");
  const [valor, setValor] = useState("");

  const [mensaje, setMensaje] = useState("");

  const cargarGastos = async () => {

    const datos = await AsyncStorage.getItem("gastos");

    if (datos === null) {
      setGastos([]);
      setMensaje("No hay gastos para actualizar.");
      return;
    }

    const lista = JSON.parse(datos);

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

    const nuevosGastos = gastos.map((gasto) => {

      if (gasto.id === seleccionado.id) {

        return {
          id: gasto.id,
          concepto: concepto.trim(),
          valor: numero,
        };

      }

      return gasto;
    });

    await AsyncStorage.setItem(
      "gastos",
      JSON.stringify(nuevosGastos)
    );

    setGastos(nuevosGastos);
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