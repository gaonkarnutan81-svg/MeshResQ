import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList } from 'react-native';

// 🔧 Backend server config
const SERVER_IP = "10.62.71.210"; // Change if your laptop IP changes
const SERVER_PORT = "5000";

export default function ScanScreen() {
  const [scanning, setScanning] = useState(true);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const url = `http://${SERVER_IP}:${SERVER_PORT}/scan`;  // ✅ backticks

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setDevices(data.devices || []); // ✅ Expect { devices: [...] }
        setScanning(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching devices:", err);
        setScanning(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {scanning ? '🔍 Scanning Nearby Devices...' : '✅ Devices Found'}
      </Text>

      {scanning ? (
        <ActivityIndicator size="large" color="#06b6d4" style={{ marginTop: 20 }} />
      ) : devices.length > 0 ? (
        <FlatList
          data={devices}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.device}>
              {item.name && item.name.trim() !== "" 
                ? `📱 ${item.name} ` // ✅ backticks
                : `📱 Unknown Device (${item.address || "No Address"})`}  // ✅ backticks
            </Text>
          )}
          style={{ marginTop: 20 }}
        />
      ) : (
        <Text style={styles.device}>❌ No devices found</Text>
      )}
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#06b6d4',
  },
  device: {
    fontSize: 18,
    color: '#ffffff',
    marginTop: 10,
  },
});