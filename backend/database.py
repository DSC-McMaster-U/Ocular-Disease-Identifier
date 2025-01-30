from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi
from datetime import datetime
import bcrypt
import os
import gridfs


uri = "mongodb+srv://iainhmacdonald:iain1234@cluster0.aew76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, tlsCAFile=certifi.where())


db = client["patients"]
doctors_collection = db["doctors"]
patients_collection = db["patients"]
fs = gridfs.GridFS(db)  # Initialize GridFS


def register_doctor(doctor_name : str, password : str) -> bool:
    """Registers a new doctor."""
    existing_doctor = doctors_collection.find_one({"doctor_name": doctor_name})
    if existing_doctor:
        print(f"Doctor {doctor_name} already exists.")
        return False
    
    hashed_pw = bcrypt.hashpw(password.encode('utf-8', bcrypt.gensalt()))
    doctors_collection.insert_one({"doctor_name": doctor_name, "password": hashed_pw})
    print(f"Doctor {doctor_name} successfully registered.")
    return True


def login_doctor(doctor_name : str, password : str) -> bool:
    """Logs in an existing doctor."""
    doctor = doctors_collection.find_one({"doctor_name": doctor_name})
    if not doctor:
        print(f"Doctor {doctor_name} does not exist.")
        return False
    
    if bcrypt.checkpw(password.encode('utf-8'), doctor[password]):
        print(f"Doctor {doctor_name} successfully logged in.")
        return True
    
    else:
        print("Invalid password.")
        return False



def add_patient_entry(doctor_name, patient_name, disease, accuracy, scan_name):
    """

    doctor_name -> str -> "Dr Sarah"
    patient_name -> str -> "Harry Potter"
    disease -> str  -> "Cataracts"
    accuracy -> str -> "84.7"
    scan_name -> str -> "uploadedscan.png" -> This needs to be the file name that is in the uploaded folder

    returns nothing

    """
    # Get the directory of the current file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    uploads_dir = os.path.join(script_dir, '../api/uploads')
    file_path = os.path.join(uploads_dir, scan_name)

    # Save the scan to GridFS
    with open(file_path, "rb") as scan_file:
        scan_id = fs.put(scan_file, filename=scan_name)

    # Create the scan entry
    date = datetime.now().strftime("%Y-%m-%d")
    time = datetime.now().strftime("%H:%M:%S")

    new_scan_entry = {
        "date": date,
        "time": time,
        "disease": disease,
        "accuracy": accuracy + "%",
        "scan_id": scan_id  # Store the GridFS file ID
    }

    # Check if the doctor exists
    doctor = patients_collection.find_one({"doctor_name": doctor_name})
    if not doctor:
        # Create a new doctor entry
        patients_collection.insert_one({
            "doctor_name": doctor_name,
            "patients": {
                patient_name: {date: [new_scan_entry]}
            }
        })
        print(f"Created new doctor {doctor_name} and added first scan for {patient_name}.")
    else:
        if patient_name in doctor.get("patients", {}):
            # Add a new scan entry for the existing patient
            patients_collection.update_one(
                {"doctor_name": doctor_name},
                {"$push": {f"patients.{patient_name}.{date}": new_scan_entry}}
            )
            print(f"Added new scan entry for existing patient {patient_name} under {doctor_name}.")
        else:
            # Create a new patient folder
            patients_collection.update_one(
                {"doctor_name": doctor_name},
                {"$set": {f"patients.{patient_name}": {date: [new_scan_entry]}}}
            )
            print(f"Created new folder for {patient_name} under {doctor_name} and added first scan.")





def patient_list(doctor_name):
    """
    
    doctor_name -> str -> "Dr Sarah"

    Retrieves all patients under the specified doctor 
    and saves their scans to the 'doctor_scans' folder in 'api' folder

    return -> list of dictionaries

    ex: [{'name': 'Johann', 'date': '2025-01-28', 'disease': 'cataracts', 'accuracy': '98.5%', 'time': '14:53:56', 
    'img_name': 'Johann*2025-01-28*14:53:56*testimage.jpg'}, 
    {'name': 'Aiden', 'date': '2025-01-29', 'disease': 'cataracts', 'accuracy': '98.5%', 'time': '18:55:35', 
    'img_name': 'Aiden*2025-01-29*18:55:35*testimage.jpg'}]
    
    """
    list_patient = []


    # Find the doctor record in the database
    doctor = patients_collection.find_one({"doctor_name": doctor_name})

    if not doctor:
        print(f"No records found for Dr. {doctor_name}.")
        return None

    # Define the directory for saving scans
    script_dir = os.path.dirname(os.path.abspath(__file__))
    doctor_scans_dir = os.path.join(script_dir, '../api/doctor_scans', doctor_name)

    # Ensure the directory exists
    os.makedirs(doctor_scans_dir, exist_ok=True)

    # Retrieve and save scans for each patient
    patients = doctor.get("patients", {})
    
    for patient_name, records in patients.items():
        p_info = {}
        p_info['name'] = patient_name

        print(f"Patient: {patient_name}")
        
        # Create a folder for the patient within the doctor's folder
        patient_dir = os.path.join(doctor_scans_dir, patient_name)
        os.makedirs(patient_dir, exist_ok=True)

        for date, scans in records.items():
            print(f"  Date: {date}")
            p_info['date'] = date
            
            for scan in scans:
                p_info['disease'] = scan['disease']
                p_info['accuracy'] = scan['accuracy']

                print(f"    Disease: {scan['disease']}, Accuracy: {scan['accuracy']}, Time: {scan['time']}")
                p_info['time'] = scan['time']

                # Retrieve the scan from GridFS using the scan ID
                scan_id = scan.get("scan_id")
                if not scan_id:
                    print("    No scan ID found for this entry.")
                    continue

                try:
                    # Fetch the file from GridFS
                    gridfs_file = fs.get(scan_id)
                    file_name = str(patient_name) + "*" + str(date) + "*" + str(scan['time']) + "*" + gridfs_file.filename
                    p_info['img_name'] = file_name


                    # Save the file to the patient's folder
                    file_path = os.path.join(patient_dir, file_name)
                    with open(file_path, "wb") as output_file:
                        output_file.write(gridfs_file.read())

                    print(f"    Saved scan to: {file_path}")

                except Exception as e:
                    print(f"    Error retrieving scan: {e}")
        list_patient.append(p_info)
    return list_patient






register_doctor("Dr Iain", "123456789")
login_doctor("Dr Iain", "123456789")
add_patient_entry("Dr Iain", "Aiden", "cataracts","98.5", "testimage2.jpg")
print(patient_list("Dr Iain"))
