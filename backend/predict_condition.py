import numpy as np
import cv2
from tensorflow import keras

model_path = '4_conv.keras'
model = keras.models.load_model(model_path)

labels = ['cataract', 'mild nonproliferative retinopathy', 'moderate non proliferative retinopathy',
                   'normal fundus', 'pathological myopia']

def predict(image_path):
    img = cv2.imread(image_path)

    if img is None:
        raise ValueError("Image not found")
    
    img = cv2.resize(img, (100, 100))
    img = img / 255.0

    input_arr = np.array([img])
    predictions = model.predict(input_arr)

    prediction = np.argmax(predictions)

    return labels[prediction]

test_image_path = '0_left.jpg'
print(predict(test_image_path))
