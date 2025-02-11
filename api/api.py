import json
import uuid
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
import sys
import os
from google.cloud import storage
from dotenv import load_dotenv
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.preprocess import preprocess_image
from backend.database import register_doctor, login_doctor, patient_list
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
import numpy as np
import cv2
from tensorflow import keras


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

load_dotenv()

BUCKET_NAME = os.getenv("BUCKET_NAME")
MODEL_NAME = os.getenv("MODEL_NAME")
LOCAL_DESTINATION = os.getenv("LOCAL_DESTINATION")

# load the pre-trained model
# model_path = '../backend/4_conv.keras'
# model_path = os.path.join(os.getcwd(), '../backend', '4_conv.keras')

# labels that correspond to the prediction
labels = ['cataract', 'mild nonproliferative retinopathy', 'moderate non proliferative retinopathy',
          'normal fundus', 'pathological myopia']

# SA_KEY_PATH = "/tmp/gcp-key.json"
# if not os.path.exists(SA_KEY_PATH): 
#     sa_key_json = os.getenv("SERVICE_ACCOUNT_KEY")
    
#     if not sa_key_json:
#         raise ValueError("Missing Google Cloud credentials in environment variables!")

#     with open(SA_KEY_PATH, "w") as f:
#         f.write(sa_key_json)

# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = SA_KEY_PATH

# credentials_dict = json.loads(sa_key_json)
# storage_client = storage.Client.from_service_account_info(credentials_dict)

def download_model(bucket_name, model_name, destination,storage_client):
    client = storage_client
    bucket = client.get_bucket(bucket_name)
    blob = bucket.blob(model_name)
    blob.download_to_filename(destination)
    print(f"model {model_name} downloaded to {destination}")
    
# download_model(BUCKET_NAME, MODEL_NAME, LOCAL_DESTINATION,storage_client) 
    
# model = keras.models.load_model(LOCAL_DESTINATION)

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



@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')
    
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400
        
    if register_doctor(email, password):
        return jsonify({"message": "Signup successful"}), 201
    else:
        return jsonify({"error": "Email already exists"}), 409


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if login_doctor(email, password):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@app.route('/get_profiles', methods=['POST'])
def get_profiles():
    print("tried to get profiles")
    data = request.get_json()
    email = data.get('username')

    return jsonify(patient_list(email)), 200




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
    # Use the PORT environment variable, default to 8080 if not set
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0',port=port)