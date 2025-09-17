from flask import Flask, jsonify
import bluetooth  # from pybluez2

app = Flask(__name__)

@app.route('/')
def home():
    return 'MeshResQ Backend Running!'

@app.route('/scan')
def scan_devices():
    try:
        nearby_devices = bluetooth.discover_devices(duration=8, lookup_names=True)
        devices_list = [{'address': addr, 'name': name} for addr, name in nearby_devices]
        return jsonify({'devices': devices_list})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
