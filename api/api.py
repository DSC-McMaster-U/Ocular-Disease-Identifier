import json
import uuid
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.preprocess import preprocess_image
from backend.database import register_doctor, login_doctor


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')

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
    print(f"Signup Info - Email: {email}, Password: {password}, Confirm Password: {confirm_password}")
    if (register_doctor(email,password)):
        print("register success")
    else:
        print("email exists already")

    return jsonify({"message": "Signup data received!"}), 200


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')
    print(f"Signup Info - Email: {email}, Password: {password}, Confirm Password: {confirm_password}")
    if (login_doctor(email,password)):
        print("login success")
    else:
        print("login unsuccessful due to wrong password or account does not exist")

    return jsonify({"message": "Login successful"}), 200




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
        
        # print(UPLOAD_FOLDER)
        
        file_name = f"{uuid.uuid4()}_{image.filename}"
        file_path = os.path.join(UPLOAD_FOLDER, file_name)
        
        try:
            img = Image.open(image.stream)
            img.save(file_path)
            print(f"Image saved to {file_path}")
            
            data = preprocess_image(file_path)
            print(data)
        
        except Exception as e:
            print(f"Failed to save or process image {file_name}: {e}")
            return jsonify({"error": f"Failed to save image {file_name}"}), 500

    return jsonify({"message": f"Image '{image.filename}' uploaded successfully!"}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=1000)