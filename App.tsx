"use client"

import { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Alert, TouchableOpacity, Text, Image, View, StyleSheet, StatusBar, TextInput } from "react-native"
import { VehicleProvider } from "./src/context/VehicleContext"
import IntakeFormScreen from "./src/screens/IntakeFormScreen"
import VehicleBodyScreen from "./src/screens/VehicleBodyScreen"
import NotesSignatureScreen from "./src/screens/NotesSignatureScreen"
import HistoryScreen from "./src/screens/HistoryScreen"
import IntakeDetailsScreen from "./src/screens/IntakeDetailsScreen"
import DatabaseService from "./src/services/DatabaseService"
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { theme } from "./src/styles/theme"
import Icon from "./src/components/ui/Icon"

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

function IntakeStack({ navigation: _navigation }: { navigation: any }) {
  return (
    <Stack.Navigator
      initialRouteName="IntakeForm"
      screenOptions={{
        headerStyle: { 
          backgroundColor: theme.colors.primary[500],
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#fff",
        headerTitleStyle: { 
          fontWeight: "700",
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="IntakeForm"
        component={IntakeFormScreen}
                  options={({ navigation }) => ({
            title: "AL-FAZAA",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => (navigation as any).openDrawer()} 
                style={styles.headerButton}
                activeOpacity={0.7}
              >
                <Icon name="menu" size="lg" color="#ffffff" />
              </TouchableOpacity>
            ),
          })}
      />
      <Stack.Screen 
        name="VehicleBody" 
        component={VehicleBodyScreen} 
        options={{ 
          title: "Vehicle Inspection",
          headerTitleAlign: "center",
        }} 
      />
      <Stack.Screen
        name="NotesSignature"
        component={NotesSignatureScreen}
        options={{ 
          title: "Notes & Signature",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  )
}

function HistoryStack() {
  return (
    <Stack.Navigator
      initialRouteName="HistoryList"
      screenOptions={{
        headerStyle: { 
          backgroundColor: theme.colors.primary[500],
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#fff",
        headerTitleStyle: { 
          fontWeight: "700",
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="HistoryList"
        component={HistoryScreen}
                  options={({ navigation }) => ({
            title: "History",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => (navigation as any).openDrawer()} 
                style={styles.headerButton}
                activeOpacity={0.7}
              >
                <Icon name="menu" size="lg" color="#ffffff" />
              </TouchableOpacity>
            ),
          })}
      />
      <Stack.Screen
        name="IntakeDetails"
        component={IntakeDetailsScreen}
        options={{ 
          title: "Intake Details",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  )
}

function CustomDrawerContent(props: any) {
  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.drawerHeaderContent}>
          <Image 
            source={require('./assets/logo.png')} 
            style={styles.drawerLogo} 
          />
          <Text style={styles.drawerTitle}>AL-FAZAA</Text>
          <Text style={styles.drawerSubtitle}>Vehicle Intake System</Text>
        </View>
      </View>
      
      <DrawerContentScrollView 
        {...props}
        style={styles.drawerScrollView}
        contentContainerStyle={styles.drawerScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.drawerSection}>
          <Text style={styles.drawerSectionTitle}>MAIN MENU</Text>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      
      <View style={styles.drawerFooter}>
        <View style={styles.drawerFooterDivider} />
        <View style={styles.drawerFooterContent}>
          <Text style={styles.drawerFooterText}>Al-Fazaa Company</Text>
          <Text style={styles.drawerVersionText}>Version 1.0.0</Text>
        </View>
      </View>
    </View>
  );
}

function PasswordScreen({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const correctPassword = "Abdel@ziz44983927";

  const handleSubmit = () => {
    if (password === correctPassword) {
      setError("");
      onUnlock();
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}>
      <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 32, elevation: 4, minWidth: 300 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#767c28", textAlign: "center", marginBottom: 18 }}>Enter App Password</Text>
        <Text style={{ fontSize: 14, color: "#888", textAlign: "center", marginBottom: 18 }}>This app is protected. Please enter the password to continue.</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#fafafa', marginBottom: 12 }}>
          <TextInput
            style={{ flex: 1, padding: 12, fontSize: 16 }}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={!show}
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={handleSubmit}
          />
          <TouchableOpacity onPress={() => setShow(s => !s)} style={{ padding: 8 }}>
            <Text style={{ color: '#767c28', fontWeight: 'bold' }}>{show ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        {error ? <Text style={{ color: '#cf2b24', marginBottom: 8, textAlign: 'center' }}>{error}</Text> : null}
        <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: '#767c28', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Unlock</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false);

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

  if (!unlocked) {
    return <PasswordScreen onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <VehicleProvider>
      <StatusBar backgroundColor={theme.colors.primary[500]} barStyle="light-content" />
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Intake"
          screenOptions={{
            headerShown: false,
            drawerActiveTintColor: theme.colors.primary[700],
            drawerInactiveTintColor: theme.colors.neutral[600],
            drawerLabelStyle: { 
              fontWeight: '600',
              fontSize: 16,
              marginLeft: -16,
            },
            drawerItemStyle: {
              borderRadius: theme.borderRadius.xl,
              marginHorizontal: 0,
              marginVertical: theme.spacing.xs,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.md,
              minHeight: 56,
            },
            drawerActiveBackgroundColor: theme.colors.primary[100],
            drawerInactiveBackgroundColor: 'transparent',
            drawerType: 'front',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
          }}
          drawerContent={props => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen
            name="Intake"
            component={IntakeStack}
            options={{
              drawerLabel: 'New Intake',
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

const styles = StyleSheet.create({
  headerButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  
  drawerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  drawerHeader: {
    backgroundColor: theme.colors.primary[500],
    paddingTop: theme.spacing['6xl'],
    paddingBottom: theme.spacing['3xl'],
    ...theme.shadows.lg,
  },
  
  drawerHeaderContent: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  
  drawerLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: theme.spacing.sm,
  },
  
  drawerTitle: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
    letterSpacing: 1,
  },
  
  drawerSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  
  drawerScrollView: {
    flex: 1,
  },
  
  drawerScrollContent: {
    paddingTop: theme.spacing['2xl'],
  },
  
  drawerSection: {
    paddingHorizontal: theme.spacing.lg,
  },
  
  drawerSectionTitle: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '700' as const,
    color: theme.colors.neutral[500],
    letterSpacing: 1.5,
    marginBottom: theme.spacing.lg,
    marginLeft: theme.spacing.md,
    textTransform: 'uppercase' as const,
  },
  
  drawerFooter: {
    backgroundColor: theme.colors.neutral[50],
    paddingVertical: theme.spacing.lg,
  },
  
  drawerFooterDivider: {
    height: 1,
    backgroundColor: theme.colors.neutral[200],
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  
  drawerFooterContent: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  
  drawerFooterText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600' as const,
    color: theme.colors.neutral[700],
    marginBottom: theme.spacing.xs,
  },
  
  drawerVersionText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[500],
  },
});
