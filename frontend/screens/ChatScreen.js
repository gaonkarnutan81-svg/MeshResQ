import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';

// backend config
const SERVER_IP = "172.16.0.190";
const SERVER_PORT = "5000";
const SENDER_NAME = "MeshResQ-User";

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    const url = `http://${SERVER_IP}:${SERVER_PORT}/chat`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sender: SENDER_NAME }),
      });

      if (!response.ok) throw new Error(`Server error ${response.status}`);

      const data = await response.json();
      if (data.error) {
        Alert.alert("❌ Failed", data.error || "Message not sent");
      } else {
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), text: `${SENDER_NAME}: ${message}`},
          {
            id: (Date.now() + 1).toString(),
            text: data.status === "Message delivered"
              ? `✅ Delivered to: ${data.devices.map(d => d.name || "Unknown").join(", ") || "No devices"} (Approx: ${data.distance || "?"})`
              : `⏳ Stored in DB (no devices nearby).`
          }
        ]);
        setMessage('');
      }
    } catch (err) {
      console.error("Chat Error:", err);
      Alert.alert("Network Error", `Could not connect to backend.\n${err.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💬 Offline Chat</Text>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        style={{ flex: 1, marginBottom: 10 }}
      />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Type your message..." placeholderTextColor="#aaa"
          value={message} onChangeText={setMessage} />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}><Text style={styles.sendText}>Send</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#0f172a' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#06b6d4' },
  messageBox: { backgroundColor: '#1e293b', padding: 10, marginVertical: 5, borderRadius: 8 },
  messageText: { fontSize: 16, color: '#fff' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 8, padding: 5 },
  input: { flex: 1, padding: 10, color: '#fff' },
  sendButton: { backgroundColor: '#06b6d4', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, marginLeft: 5 },
  sendText: { color: '#fff', fontWeight: 'bold' }
});