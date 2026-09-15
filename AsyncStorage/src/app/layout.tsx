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
          title: "Crear nota",
        }}
      />

      <Stack.Screen
        name="leer"
        options={{
          title: "Leer nota",
        }}
      />

      <Stack.Screen
        name="actualizar"
        options={{
          title: "Actualizar nota",
        }}
      />

      <Stack.Screen
        name="eliminar"
        options={{
          title: "Eliminar nota",
        }}
      />
    </Stack>
  );
}