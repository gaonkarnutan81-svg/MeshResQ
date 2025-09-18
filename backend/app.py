from flask import Flask, jsonify
import bluetooth  # ✅ from pybluez2

app = Flask(__name__)

# Default route just to check if backend is running
@app.route('/')
def home():
    return 'MeshResQ Backend Running!'

# Bluetooth scan route
@app.route('/scan')
def scan_devices():
    try:
        # Scan for nearby Bluetooth devices
        nearby_devices = bluetooth.discover_devices(duration=8, lookup_names=True)
        devices_list = [{'address': addr, 'name': name} for addr, name in nearby_devices]
        return jsonify({'devices': devices_list})  # Returns JSON { "devices": [...] }
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run server on all IPs in your network, port 5000
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)