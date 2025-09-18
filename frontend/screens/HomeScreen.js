import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>🚀 MeshResQ</Text>
      <Text style={styles.subtitle}>Offline Emergency Communication System</Text>

      {/* Scan Devices Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Scan')}
      >
        <Text style={styles.buttonText}>🔍 Scan Devices</Text>
      </TouchableOpacity>

      {/* SOS Alert Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('SOS')}
      >
        <Text style={styles.buttonText}>📡 Send SOS Alert</Text>
      </TouchableOpacity>

      {/* Chat Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Chat')}
      >
        <Text style={styles.buttonText}>💬 Start Chat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a', // Dark background
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#06b6d4',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#06b6d4',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 10,
    width: 230,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});