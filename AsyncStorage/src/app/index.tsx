import { router } from "expo-router";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
         MIS GASTOS
      </Text>

      <View style={styles.boton}>
        <Button
          title="CREAR GASTO"
          onPress={() => router.push("/crear")}
        />
      </View>

      <View style={styles.boton}>
        <Button
          title="VER GASTOS"
          onPress={() => router.push("/leer")}
        />
      </View>

      <View style={styles.boton}>
        <Button
          title="ACTUALIZAR GASTO"
          onPress={() => router.push("/actualizar")}
        />
      </View>

      <View style={styles.boton}>
        <Button
          title="ELIMINAR GASTO"
          onPress={() => router.push("/eliminar")}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#F3F8FF",
  },

  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#315B7D",
  },

  boton: {
    marginBottom: 15,
  },
});