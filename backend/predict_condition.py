import numpy as np
import cv2
from tensorflow import keras
import argparse

"""

to run the script use the following command:
    
`python predict_condition.py path/to/image.jpg`

"""

# load the pre-trained model
model_path = '4_conv.keras'
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

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Predict the eye condition from a fundus image.")
    parser.add_argument('image_path', type=str, help="Path to the image file.")
    
    args = parser.parse_args()
    
    try:
        result = predict(args.image_path)
        print(f"Predicted condition: {result}")
    except ValueError as e:
        print(e)