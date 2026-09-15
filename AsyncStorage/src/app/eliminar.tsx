import { router } from "expo-router";
import { View, Text, Button, StyleSheet, ScrollView, } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Eliminar() {

   // Guarda todos los gastos
  const [gastos, setGastos] = useState<any[]>([]);

   // Guarda los mensajes que se muestran en pantalla
  const [mensaje, setMensaje] = useState("");

  // Cargar los gastos guardados
  const cargarGastos = async () => {

      // Buscar los gastos en AsyncStorage
    const datos = await AsyncStorage.getItem("gastos");

    if (datos === null) {
      setGastos([]);
      setMensaje("No hay gastos para eliminar.");
      return;
    }

    // Convertir los datos de texto a un arreglo
    const lista = JSON.parse(datos);

     // Verificar si el arreglo está vacío
    if (lista.length === 0) {
      setGastos([]);
      setMensaje("No hay gastos para eliminar.");
      return;
    }

    setGastos(lista);
    setMensaje("");
  };

  const eliminarGasto = async (id: number) => {

     // Crear una nueva lista sin el gasto seleccionado
    const nuevosGastos = gastos.filter(
      (gasto) => gasto.id !== id
    );

    // Guardar la nueva lista en AsyncStorage
    await AsyncStorage.setItem(
      "gastos",
      JSON.stringify(nuevosGastos)
    );

     // Actualizar la lista que aparece en pantalla
    setGastos(nuevosGastos);

    setMensaje("Gasto eliminado correctamente.");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        ELIMINAR GASTO
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
              title="ELIMINAR"
              onPress={() => eliminarGasto(gasto.id)}
            />

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
    marginBottom: 5,
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