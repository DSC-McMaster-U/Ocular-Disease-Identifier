from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi
from datetime import datetime

def Appointment(doctor_name, patient_name):
    uri = "mongodb+srv://iainhmacdonald:iain1234@cluster0.aew76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = MongoClient(uri, tlsCAFile=certifi.where())

    try:
        client.admin.command('ping')
        print("Pinged your deployment. Successfully connected to MongoDB!")
    except Exception as e:
        print(e)
        return

    # Access database and collection
    db = client["patients"]
    patients_collection = db["patients"]

    date = datetime.now().strftime("%Y-%m-%d")
    # date = "2022-01-10"

    new_scan_entry = {
        "date": date,
        "time": datetime.now().strftime("%H:%M:%S"),
        "Notes": "Patient is healthy!"
    }

    # Check if the doctor exists
    doctor = patients_collection.find_one({"doctor_name": doctor_name})

    if not doctor:
        # If doctor doesn't exist, create a new document for the doctor
        patients_collection.insert_one({
            "doctor_name": doctor_name,
            "patients": {
                patient_name: {date: [new_scan_entry]}
            }
        })
        print(f"Created new doctor {doctor_name} and added first scan for {patient_name}.")
    else:
        print("doc exists")
        # If doctor exists, check if patient exists
        if patient_name in doctor.get("patients", {}):
            print("patient exists!")
            # Patient exists, append the new scan entry
            patients_collection.update_one(
                {"doctor_name": doctor_name},
                {"$set": {f"patients.{patient_name}.{date}": [new_scan_entry]}}
            )
            print(f"Added new scan entry for existing patient {patient_name} under {doctor_name}.")
        else:
            print('patient doesnt exist')
            # Patient does not exist, create a new entry for the patient
            patients_collection.update_one(
                {"doctor_name": doctor_name},
                {"$set": {f"patients.{patient_name}": {date: [new_scan_entry]}}}
            )
            print(f"Created new folder for {patient_name} under {doctor_name} and added first scan.")

    # Close connection
    client.close()

# Test cases
Appointment("Dr Sarah", "Georgee")
Appointment("Dr Sarah", "Iain")
