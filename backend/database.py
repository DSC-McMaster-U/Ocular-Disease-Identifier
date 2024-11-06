
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi
from pymongo import MongoClient
from datetime import datetime
#mongo db is basically like a document so we can store different types of data
#which is good for a healthcare database

uri = "mongodb+srv://iainhmacdonald:iain1234@cluster0.aew76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# connect to the server
client = MongoClient(uri, tlsCAFile=certifi.where())


# confirm connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


db = client["patients"]
patients_collection = db["patients"]


# record
patient_data = {
    "patient_id": "0001",
    "name": "John Doe",
    "dob": datetime(1985, 4, 12),
    "gender": "Male",
    "contact_info": {
        "phone": "555-1234",
        "email": "john@example.com"
    },
    "medical_history": [
        {"condition": "Cataracts", "diagnosed_on": datetime(2005, 2, 20)}
    ],
    "prescriptions": [
        {"medication": "Advil", "dosage": "500mg", "frequency": "2x daily"}
    ]
}

# insert
try:
    patient_id = patients_collection.insert_one(patient_data).inserted_id
    print(f"Inserted patient with ID: {patient_id}")
except Exception as e:
    print(f"An error occurred: {e}")


# get all patients
all_patients = patients_collection.find()

for patient in all_patients:
    print(patient)
    print("")


# close connection
client.close()
