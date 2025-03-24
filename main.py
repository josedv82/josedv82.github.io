#!/usr/bin/env python3
"""
Flask app to serve the static website.
"""

from flask import Flask, send_from_directory, redirect, url_for

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)