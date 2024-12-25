from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi
from datetime import datetime

uri = "mongodb+srv://iainhmacdonald:iain1234@cluster0.aew76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, tlsCAFile=certifi.where())
db = client["patients"]
doctors_collection = db["doctors"]
patients_collection = db["patients"]

def register_doctor(doctor_name, password):
    """Registers a new doctor."""
    existing_doctor = doctors_collection.find_one({"doctor_name": doctor_name})
    if existing_doctor:
        print(f"Doctor {doctor_name} already exists.")
        return False
    
    doctors_collection.insert_one({"doctor_name": doctor_name, "password": password})
    print(f"Doctor {doctor_name} successfully registered.")
    return True


def login_doctor(doctor_name, password):
    """Logs in an existing doctor."""
    doctor = doctors_collection.find_one({"doctor_name": doctor_name})
    if not doctor:
        print(f"Doctor {doctor_name} does not exist.")
        return False
    
    if doctor["password"] == password:
        print(f"Doctor {doctor_name} successfully logged in.")
        return True
    
    else:
        print("Invalid password.")
        return False


def add_patient_entry(doctor_name, patient_name, notes):
    """Adds a new patient entry under the logged-in doctor."""
    date = datetime.now().strftime("%Y-%m-%d")
    time = datetime.now().strftime("%H:%M:%S")

    new_scan_entry = {
        "date": date,
        "time": time,
        "Notes": notes,
    }

    doctor = patients_collection.find_one({"doctor_name": doctor_name})

    if not doctor:
        patients_collection.insert_one({
            "doctor_name": doctor_name,
            "patients": {
                patient_name: {date: [new_scan_entry]}
            }
        })
        print(f"Created new doctor {doctor_name} and added first scan for {patient_name}.")
    else:
        if patient_name in doctor.get("patients", {}):
            patients_collection.update_one(
                {"doctor_name": doctor_name},
                {"$push": {f"patients.{patient_name}.{date}": new_scan_entry}}
            )
            print(f"Added new scan entry for existing patient {patient_name} under {doctor_name}.")
        else:
            patients_collection.update_one(
                {"doctor_name": doctor_name},
                {"$set": {f"patients.{patient_name}": {date: [new_scan_entry]}}}
            )
            print(f"Created new folder for {patient_name} under {doctor_name} and added first scan.")



register_doctor("Dr Sarah", "abcdefghijk")
login_doctor("Dr Sarah", "abcdefghijk")
add_patient_entry("Dr Sarah", "Iain", "Healthy!")