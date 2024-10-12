"""
- comments regarding model design choices - 

* conv2d: the amount of filters increase as the model goes deeper, this helps with detecting more complex patterns in the data
* conv2d: chose a kernel size of 3x3 as it is computationally efficient
* conv2d: relu is used again for computational efficiency

* maxpooling2d: reduces dimensions by half and helps prevent overfitting

* dense: sigmoid function is used for binary classification
"""

import tensorflow as tf
from tensorflow.keras import layers, models

input_size = (0, 0, 0) # size of input data 

# model for binary classification of ocular disease
model = models.Sequential([
    layers.Input(input_shape=input_size),
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=input_size),
    layers.MaxPooling2D((2, 2)), 
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Flatten(),
    layers.Dense(1, activation='sigmoid')
])

# compile model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy', 'loss'])

# train model (data is needed for this step)
# model.fit(x_train, y_train, epochs=10, batch_size=32, validation_data=(x_test, y_test))