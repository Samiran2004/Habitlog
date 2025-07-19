import "@/global.css";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarShowLabel: false,
      tabBarActiveTintColor: "coral",
      headerStyle: {
        backgroundColor: "coral",
      },
      headerShadowVisible: false,
      tabBarStyle: {
        backgroundColor: "coral",
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
      },
    }}>
      <Tabs.Screen name="index" options={{
        title: "🌱 Today's Habits 🌱", tabBarIcon: ({ color, focused }) => {
          return focused ? (
            <Ionicons name="home-outline" size={25} color={"white"} />
          ) : (
            <AntDesign name="home" size={25} color="black" />
          )
        },
        headerTitleStyle: {
          color: 'white',
          fontSize: 25,
          fontWeight: "bold",
          fontFamily: 'monospace'
        }
      }} />

      <Tabs.Screen
        name="add-habit"
        options={{
          title: "➕ Add Habit ➕",
          tabBarLabel: "", // hides the label under the icon
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="add-circle-outline" size={25} color="white" />
            ) : (
              <AntDesign name="pluscircleo" size={25} color="black" />
            ),
          headerTitleStyle: {
            color: "white",
            fontSize: 24,
            fontWeight: "bold",
            fontFamily: "monospace",
          },
          headerStyle: {
            backgroundColor: "coral",
          },
        }}
      />

    </Tabs >
  )
}
