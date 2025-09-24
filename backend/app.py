from flask import Flask, jsonify, request
from flask_cors import CORS
import bluetooth
import mysql.connector
import random

app = Flask(__name__)
CORS(app)

# ✅ MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="MeshResQ@2025",
    database="meshresq"
)
cursor = db.cursor()

@app.route('/')
def home():
    return '✅ MeshResQ Backend Running (Showing ALL nearby devices)'

# RSSI-based distance buckets (fake for demo, but realistic)
def estimate_distance():
    rssi = random.randint(-90, -30)  # simulate RSSI values
    if rssi > -50:
        return "Near (0-3m)"
    elif rssi > -70:
        return "Medium (4-8m)"
    else:
        return "Far (9m+)"

# Utility function → now show ALL devices (no filter)
def format_devices(nearby_devices):
    return [
        {
            'address': addr,
            'name': name,
            'distance': estimate_distance()
        }
        for addr, name in nearby_devices
    ]

# 🔍 Scan nearby devices
@app.route('/scan', methods=['GET'])
def scan_devices():
    try:
        nearby_devices = bluetooth.discover_devices(duration=6, lookup_names=True)
        devices_list = format_devices(nearby_devices)
        return jsonify({'devices': devices_list})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 🚨 SOS broadcast
@app.route('/sos', methods=['POST'])
def sos():
    try:
        payload = request.get_json() or {}
        sender = payload.get("sender", "Unknown User")

        nearby_devices = bluetooth.discover_devices(duration=6, lookup_names=True)
        devices_list = format_devices(nearby_devices)

       
        return jsonify({
            'status': 'SOS received',
            'device': sender,
        
            'message': f'🚨 SOS from {sender}',
            'devices': devices_list
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 💬 Chat with MySQL storage
@app.route('/chat', methods=['POST'])
def chat():
    try:
        payload = request.get_json() or {}
        message = payload.get('message', '')
        sender = payload.get("sender", "User")

        if not message.strip():
            return jsonify({'error': 'Empty message not allowed'}), 400

        nearby_devices = bluetooth.discover_devices(duration=6, lookup_names=True)
        devices_list = format_devices(nearby_devices)

        status = "delivered" if devices_list else "pending"
        cursor.execute(
            "INSERT INTO messages (msg_text, status) VALUES (%s, %s)",
            (f"{sender}: {message}", status)
        )
        db.commit()

        return jsonify({
            'status': "Message delivered" if devices_list else "No devices found, message stored",
            'from': sender,
            'distance': estimate_distance(),
            'message_sent': message,
            'devices': devices_list
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 🔄 Retry pending messages
@app.route('/resend', methods=['GET'])
def resend_pending():
    try:
        cursor.execute("SELECT id, msg_text FROM messages WHERE status = 'pending'")
        pending_messages = cursor.fetchall()

        if not pending_messages:
            return jsonify({'status': 'No pending messages'})

        nearby_devices = bluetooth.discover_devices(duration=6, lookup_names=True)
        devices_list = format_devices(nearby_devices)

        if not devices_list:
            return jsonify({'status': 'Still no devices found', 'pending_count': len(pending_messages)})

        for msg_id, msg_text in pending_messages:
            cursor.execute("UPDATE messages SET status = 'delivered' WHERE id = %s", (msg_id,))
        db.commit()

        return jsonify({
            'status': 'Pending messages delivered',
            'delivered_count': len(pending_messages),
            'devices': devices_list
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)