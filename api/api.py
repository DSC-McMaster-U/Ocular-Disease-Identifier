import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/test',methods=['GET'])
def test():
    return jsonify(text="Hello from the backend")

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=1000)