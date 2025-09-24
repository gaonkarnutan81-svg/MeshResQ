import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Vibration, Alert } from 'react-native';

// 🔧 Backend server config (set your laptop IP)
const SERVER_IP = "172.16.0.190";
const SERVER_PORT = "5000";

export default function ScanScreen() {
  const [scanning, setScanning] = useState(true);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const url = `http://${SERVER_IP}:${SERVER_PORT}/scan`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setDevices(data.devices || []);
        setScanning(false);

        if (data.devices && data.devices.length > 0) {
          // vibrate + alert for demo
          Vibration.vibrate([300, 200]);
          Alert.alert("📡 Devices Found", `${data.devices.length} nearby devices detected`);
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching devices:", err);
        setScanning(false);
        Alert.alert("Error", "Could not reach backend. Check IP and server status.");
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {scanning ? '🔍 Scanning Nearby Devices...' : '✅ Scan Results'}
      </Text>

      {scanning ? (
        <ActivityIndicator size="large" color="#06b6d4" style={{ marginTop: 20 }} />
      ) : devices.length > 0 ? (
        <FlatList
          data={devices}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (

            <Text style={styles.device}>
              📱 {item.name || "Unknown Device"}
              {"  "} ({item.address || "No Address"})
              {"  "} ➝ {item.distance || "?"}
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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#06b6d4' },
  device: { fontSize: 16, color: '#fff', marginTop: 10 }
});