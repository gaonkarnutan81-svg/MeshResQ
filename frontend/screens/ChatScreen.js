import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      setMessages([...messages, { id: Date.now().toString(), text: message }]);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💬 Offline Chat</Text>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        style={{ flex: 1, marginBottom: 10 }}
      />

      {/* Input & Send Button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#0f172a', // Dark background
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#06b6d4',
  },
  messageBox: {
    backgroundColor: '#1e293b',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  messageText: {
    fontSize: 16,
    color: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    color: '#fff',
  },
  sendButton: {
    backgroundColor: '#06b6d4',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 5,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});