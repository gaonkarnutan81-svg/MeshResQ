import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Vibration, Alert } from 'react-native';

// 🔧 Backend server config
const SERVER_IP = "172.16.0.190";
const SERVER_PORT = "5000";

// sender name (later you can detect device name dynamically)
const SENDER_NAME = "MeshResQ-User";

export default function SosScreen() {
  const [sending, setSending] = useState(true);
  const [status, setStatus] = useState("🚨 Sending SOS...");
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    Vibration.vibrate(500);

    fetch(`http://${SERVER_IP}:${SERVER_PORT}/sos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: SENDER_NAME })
    })
      .then((res) => res.json())
      .then((data) => {
        setSending(false);
        if (data.error) {
          setStatus("⚠ Failed to send SOS!");
          Alert.alert("❌ SOS Failed", data.error || "Could not send SOS.");
        } else {
          setStatus(data.message || "✅ SOS Sent Successfully!");
          setDevices(data.devices || []);
          Alert.alert("✅ SOS Sent", `Nearby devices notified by ${SENDER_NAME}`);
          // vibrate pattern to show success
          Vibration.vibrate([300, 200, 300]);
        }
      })
      .catch((err) => {
        console.error("❌ Error sending SOS:", err);
        setSending(false);
        setStatus("⚠ Failed to send SOS! (Network)");
        Alert.alert("⚠ SOS Failed", "Network error while sending SOS.");
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{status}</Text>

      {sending ? (
        <>
          <ActivityIndicator size="large" color="#d32f2f" style={{ marginTop: 20 }} />
          <Text style={styles.text}>Sending distress signal to nearby devices...</Text>
        </>
      ) : devices.length > 0 ? (
        <FlatList
          data={devices}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.device}>
              📱 {item.name || "Unknown Devices"}
              {"  "} ({item.address || "No Address"})
              {"  "} ➝ {item.distance || "?"}

            </Text>
          )}
          style={{ marginTop: 20 }}
        />
      ) : (
        <Text style={styles.text}>❌ No nearby devices found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffe6e6', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#d32f2f', marginBottom: 20, textAlign: 'center' },
  text: { fontSize: 16, color: '#333', marginTop: 10, textAlign: 'center' },
  device: { fontSize: 16, color: '#000', marginTop: 8 }
});