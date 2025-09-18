import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function SosScreen() {
  const [sending, setSending] = useState(true);
  const [status, setStatus] = useState("🚨 Sending SOS...");

  useEffect(() => {
    // Simulate SOS sending (3s delay)
    setTimeout(() => {
      setSending(false);
      setStatus("✅ SOS Sent Successfully!");
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{status}</Text>
      {sending ? (
        <>
          <ActivityIndicator size="large" color="#d32f2f" style={{ marginTop: 20 }} />
          <Text style={styles.text}>Sending distress signal to nearby devices...</Text>
        </>
      ) : (
        <Text style={styles.text}>Nearby devices have been notified 🚀</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
});