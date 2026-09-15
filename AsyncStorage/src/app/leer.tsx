import { router } from "expo-router";
import { View, Text, Button, StyleSheet, ScrollView, } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Leer() {

  // Guarda la lista de gastos
  const [gastos, setGastos] = useState<any[]>([]);

  // Guarda los mensajes que se muestran en pantalla
  const [mensaje, setMensaje] = useState("");

    // Función para leer los gastos guardados
  const leerGastos = async () => {

     // Buscar los gastos guardados en AsyncStorage
    const datos = await AsyncStorage.getItem("gastos");

    if (datos === null) {
      setGastos([]);  // Dejar la lista vacía
      setMensaje("No hay gastos guardados.");
      return;
    }

    // Convertir los datos de texto a un arreglo
    const lista = JSON.parse(datos);

        // Verificar si la lista está vacía
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