import tensorflow as tf
from tensorflow.keras import layers, models

input_size = (0, 0, 0) # size of input data 

# build model (work in progress)
model = models.Sequential([
    layers.Input(input_shape=input_size), # input layer
    
    # add hidden layers here
    
    layers.Dense(1, activation='sigmoid') # output layer, sigmoid function for binary classification
])

# compile model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# train model, data is needed for this step
# model.fit(x_train, y_train, epochs=10, batch_size=32, validation_data=(x_test, y_test))