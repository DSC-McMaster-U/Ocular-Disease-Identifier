import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

@app.route('/test',methods=['GET'])
def test():
    return jsonify(text="Hello from the backend")

@app.route('/test_post',methods=['POST'])
def test_post():
    data = request.get_json()
    input = data['message']
    return jsonify(text=f"{input} - Got this"), 200

@app.route('/image_posting',methods=['POST'])
def image_posting():
    image = request.files['image']
    display_image = Image.open(image)
    display_image.show()
    return jsonify(text=f"Image '{image.filename}' received"), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=1000)