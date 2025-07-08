import "@/global.css";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "coral" }}>
      <Tabs.Screen name="index" options={{
        title: "Home", tabBarIcon: ({ color, focused }) => {
          return focused ? (
            <Ionicons name="home-outline" size={25} color={color} />
          ) : (
            <AntDesign name="home" size={25} color="black" />
          )
        }
      }} />
      <Tabs.Screen name="login" options={{ title: "Login" }} />
    </Tabs>
  )
}
