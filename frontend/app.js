import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import SosScreen from './screens/SosScreen';
import ChatScreen from './screens/ChatScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        
        {/* Home Screen */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        {/* Scan Screen */}
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{ title: "🔍 Scan Devices" }}
        />

        {/* SOS Screen */}
        <Stack.Screen
          name="SOS"
          component={SosScreen}
          options={{ title: "🚨 SOS Alert" }}
        />

        {/* Chat Screen */}
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ title: "💬 Offline Chat" }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}