from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi
from datetime import datetime


def Appointment(doctor_name, patient_name):
    uri = "mongodb+srv://iainhmacdonald:iain1234@cluster0.aew76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = MongoClient(uri, tlsCAFile=certifi.where())
    db = client["patients"]

    try:
        client.admin.command('ping')
        print("Pinged your deployment. Successfully connected to MongoDB!")
    except Exception as e:
        print(e)
        return

    patients_collection = db["patients"]
    date = datetime.now().strftime("%Y-%m-%d")
    date = "2010-01-01"

    new_scan_entry = {
        "date": date,
        "time": datetime.now().strftime("%H:%M:%S"),
        "Notes": "Patient is healthy!"
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
                {"$set": {f"patients.{patient_name}.{date}": [new_scan_entry]}}
            )
            print(f"Added new scan entry for existing patient {patient_name} under {doctor_name}.")
        else:
            patients_collection.update_one(
                {"doctor_name": doctor_name},
                {"$set": {f"patients.{patient_name}": {date: [new_scan_entry]}}}
            )
            print(f"Created new folder for {patient_name} under {doctor_name} and added first scan.")

    client.close()


Appointment("Dr Sarah", "George")
Appointment("Dr Sarah", "Iain")
Appointment("Dr Saah", "Iain")
