import cv2
import numpy as np

def preprocess_image(uploaded_image_path):
    # Load the uploaded image 
    img = cv2.imread(uploaded_image_path)
    
    # Resize image
    img_resized = cv2.resize(img, (64, 64))
    
    # Normalize
    img_normalized = img_resized / 255.0
    
    # Expand dimensions to add batch size
    img_final = np.expand_dims(img_normalized, axis=0)

    #now it will be (1, 64, 64, 3) which means 1 image 64 height and width and 3 colour channels rgb
    
    return img_final
