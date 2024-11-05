import cv2
import numpy as np

def preprocess(filename):
    if (filename.endswith('.jpg') or filename.endswith('.png')):
        # Load the image using OpenCV (returns the image as a NumPy array)
        img = cv2.imread(filename)

        # Resize the image
        img_resized = cv2.resize(img, (100, 100))

        # Normalize
        img_normalized = img_resized / 255.0
        return img_normalized