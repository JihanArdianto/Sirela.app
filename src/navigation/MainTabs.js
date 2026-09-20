import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import RuanganScreen from "../screens/RuanganScreen";
import JadwalScreen from "../screens/JadwalScreen";
import JurusanScreen from "../screens/JurusanScreen";
import KelasScreen from "../screens/KelasScreen";
import AturScreen from "../screens/AturScreen";
import { useTheme } from "../theme/ThemeContext";

const Tab = createBottomTabNavigator();

const ICONS = {
  Ruangan: "square-outline",
  Jadwal: "calendar-outline",
  Jurusan: "diamond-outline",
  Kelas: "albums-outline",
  Atur: "ellipse-outline",
};

export default function MainTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.purple,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarStyle: {
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name]} size={size ? size - 2 : 20} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Ruangan" component={RuanganScreen} />
      <Tab.Screen name="Jadwal" component={JadwalScreen} />
      <Tab.Screen name="Jurusan" component={JurusanScreen} />
      <Tab.Screen name="Kelas" component={KelasScreen} />
      <Tab.Screen name="Atur" component={AturScreen} />
    </Tab.Navigator>
  );
}
