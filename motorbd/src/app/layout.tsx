import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Inicio",
        }}
      />

      <Stack.Screen
        name="crear"
        options={{
          title: "Crear gasto",
        }}
      />

      <Stack.Screen
        name="leer"
        options={{
          title: "Ver gastos",
        }}
      />

      <Stack.Screen
        name="actualizar"
        options={{
          title: "Actualizar gasto",
        }}
      />

      <Stack.Screen
        name="eliminar"
        options={{
          title: "Eliminar gasto",
        }}
      />
    </Stack>
  );
}