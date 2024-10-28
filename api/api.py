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
    # print("Request headers:", request.headers) 
    # print("Request method:", request.method)    
    # print("Files:", request.files)
    # print("Form Data:", request.form)
    
    if 'images' not in request.files:
        return jsonify({"error": "No image part in the request"}), 400
    
    images = request.files.getlist('images')
    
    for image in images:
        if image.filename == '':
            return jsonify({"error": "No selected file"}), 400
        img = Image.open(image)
        img.show()

    return jsonify({"message": f"Image '{image.filename}' uploaded successfully!"}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=1000)