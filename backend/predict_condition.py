import numpy as np
import cv2
from tensorflow import keras
import argparse
from google.cloud import storage
import os
from dotenv import load_dotenv

"""

First, you need to set up the environment variables for the GCP model path.
ML_MODEL_PATH=<gcp_path_to_model>

Then, to run the python script, use the following command:
python predict_condition.py <path_to_image>

"""

load_dotenv()

# labels that correspond to the prediction
labels = ['cataract', 'mild nonproliferative retinopathy', 'moderate non proliferative retinopathy',
          'normal fundus', 'pathological myopia']

def predict(image_path, model):
    img = cv2.imread(image_path)

    if img is None:
        raise ValueError("Image not found")
    
    # preprocess the image
    img = cv2.resize(img, (100, 100))
    img = img / 255.0
    
    # make prediction
    predictions = model.predict(np.array([img]))
    prediction = np.argmax(predictions)  # most likely prediction (ex. [0.1, 0.7, 0.2] -> index 1)
    
    # return the right format for the prediction
    return labels[prediction]

def load_model_from_cloud(gcs_model_path):
    model = keras.models.load_model(gcs_model_path)
    return model

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Predict the eye condition from a fundus image.")
    parser.add_argument('image_path', type=str, help="Path to the image file.")
    
    # GCP model path (no local download, directly load from GCP)
    gcs_model_path = os.getenv("ML_MODEL_PATH")

    args = parser.parse_args()

    # load the model directly from GCP
    model = load_model_from_cloud(gcs_model_path)
    
    try:
        result = predict(args.image_path, model)
        print(f"Predicted condition: {result}")
    except ValueError as e:
        print(e)