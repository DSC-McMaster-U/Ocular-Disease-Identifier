import json
import uuid
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from preprocess import preprocess_image
import numpy as np
import cv2
from tensorflow import keras

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')


# load the pre-trained model
model_path = '../backend/4_conv.keras'
model = keras.models.load_model(model_path)

# labels that correspond to the prediction
labels = ['cataract', 'mild nonproliferative retinopathy', 'moderate non proliferative retinopathy',
          'normal fundus', 'pathological myopia']

def predict(image_path):
    img = cv2.imread(image_path)

    if img is None:
        raise ValueError("Image not found")
    
    # preprocess the image
    img = cv2.resize(img, (100, 100))
    img = img / 255.0
    
    # make prediction
    predictions = model.predict(np.array([img]))
    prediction = np.argmax(predictions) # most likely prediction (ex. [0.1, 0.7, 0.2] -> 1)
    
    # return the right format for the prediction
    return labels[prediction]


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
    
    results = []
    for image in images:
        if image.filename == '':
            return jsonify({"error": "No selected file"}), 400
        
        # print(UPLOAD_FOLDER)
        
        file_name = f"{uuid.uuid4()}_{image.filename}"
        file_path = os.path.join(UPLOAD_FOLDER, file_name)
        
        try:
            img = Image.open(image.stream)
            img.save(file_path)
            print(f"Image saved to {file_path}")
            

            # data = preprocess_image(file_path)
            # print(data)

            try:
                result = predict(file_path)
                print(f"Predicted condition: {result}")

                results.append({"name": image.filename, "label": result})

            except ValueError as e:
                print(e)
        
        except Exception as e:
            print(f"Failed to save or process image {file_name}: {e}")
            return jsonify({"error": f"Failed to save image {file_name}"}), 500
    print("********")
    print(results)
    return jsonify({"message": results}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=1000)