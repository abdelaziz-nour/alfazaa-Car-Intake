"use client"

import { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Alert, TouchableOpacity, Text } from "react-native"
import { VehicleProvider } from "./src/context/VehicleContext"
import IntakeFormScreen from "./src/screens/IntakeFormScreen"
import VehicleBodyScreen from "./src/screens/VehicleBodyScreen"
import NotesSignatureScreen from "./src/screens/NotesSignatureScreen"
import HistoryScreen from "./src/screens/HistoryScreen"
import IntakeDetailsScreen from "./src/screens/IntakeDetailsScreen"
import DatabaseService from "./src/services/DatabaseService"

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

function IntakeStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="IntakeForm"
      screenOptions={{
        headerStyle: { backgroundColor: "#767c28" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="IntakeForm"
        component={IntakeFormScreen}
        options={({ navigation }) => ({
          title: "Vehicle Intake - Alfazaa Company",
          headerStyle: { backgroundColor: "#767c28" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 16 }}>
              <Text style={{ color: "#fff", fontSize: 24 }}>☰</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="VehicleBody" component={VehicleBodyScreen} options={{ title: "Vehicle Inspection" }} />
      <Stack.Screen
        name="NotesSignature"
        component={NotesSignatureScreen}
        options={{ title: "Notes & Signature" }}
      />
    </Stack.Navigator>
  )
}

function HistoryStack() {
  return (
    <Stack.Navigator
      initialRouteName="HistoryList"
      screenOptions={{
        headerStyle: { backgroundColor: "#767c28" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="HistoryList"
        component={HistoryScreen}
        options={({ navigation }) => ({
          title: "Intake History",
          headerStyle: { backgroundColor: "#767c28" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 16 }}>
              <Text style={{ color: "#fff", fontSize: 24 }}>☰</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="IntakeDetails"
        component={IntakeDetailsScreen}
        options={{ title: "Intake Details" }}
      />
    </Stack.Navigator>
  )
}

export default function App() {
  useEffect(() => {
    // Initialize database when app starts
    const initApp = async () => {
      try {
        await DatabaseService.initDatabase()
        console.log("App initialized successfully")
      } catch (error) {
        console.error("App initialization error:", error)
        Alert.alert("Error", "Failed to initialize app database")
      }
    }
    initApp()
  }, [])

  return (
    <VehicleProvider>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Intake"
          screenOptions={{
            headerShown: false,
            drawerActiveTintColor: '#767c28',
            drawerLabelStyle: { fontWeight: 'bold' },
          }}
        >
          <Drawer.Screen
            name="Intake"
            component={IntakeStack}
            options={{
              drawerLabel: 'Intake',
            }}
          />
          <Drawer.Screen
            name="History"
            component={HistoryStack}
            options={{
              drawerLabel: 'History',
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </VehicleProvider>
  )
}
