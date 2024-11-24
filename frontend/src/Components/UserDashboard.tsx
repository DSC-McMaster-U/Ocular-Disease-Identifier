import Header from "./Header";
import defaultProfilePic from "../vendor/img/UserDashboard/userDefault.svg";
import addPatient from "../vendor/img/UserDashboard/add_patient_icon.svg";
import recentScans from "../vendor/img/UserDashboard/recent_scans_icon.svg";
import dashboardIcon from "../vendor/img/UserDashboard/dashboard_icon.svg";
import currentPatients from "../vendor/img/UserDashboard/current_patients_icon.svg";
import rightArrow from "../vendor/img/UserDashboard/right_arrow.svg";
import leftArrow from "../vendor/img/UserDashboard/left_arrow.svg";
import { Profile } from "../Models/user";
import { useState } from "react";
import Card from "./Card";

const UserDashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  //Temperary placeholder data for recent scans
  const scans: {
    person: string;
    condition: string;
    date: string;
    confidence: number;
  }[] = [
    {
      person: "Adam Peterson",
      condition: "Pathological Myopia",
      date: "11/19/2024",
      confidence: 0.93,
    },
    {
      person: "Jane Doe",
      condition: "Glaucoma",
      date: "11/15/2024",
      confidence: 0.89,
    },
    {
      person: "John Smith",
      condition: "Cataract",
      date: "11/10/2024",
      confidence: 0.95,
    },
    {
      person: "Emily Davis",
      condition: "Diabetic Retinopathy",
      date: "11/05/2024",
      confidence: 0.91,
    },
    {
      person: "Michael Brown",
      condition: "Macular Degeneration",
      date: "11/01/2024",
      confidence: 0.92,
    },
  ];

  // State to track the currently displayed card
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handler for navigation buttons
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? scans.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === scans.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header></Header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-[20%] min-w-[300px] bg-[#FFFFFF] shadow-md p-6 pt-[5rem]">
          <div className="flex flex-col items-center justify-center mb-6 border min-h-[250px] max-w-[90%] mx-auto rounded-lg">
            <img
              src={defaultProfilePic}
              alt="User"
              className="w-24 h-24 rounded-full"
            />
            <h2 className="mt-4 text-lg font-bold">
              {profile
                ? profile.username
                  ? profile.username
                  : profile.user.email
                : "Unknown user"}
            </h2>
            <p className="text-sm text-[#666666] text-wrap">
              {profile
                ? profile.username
                  ? profile.user.email
                  : ""
                : "Unknown email"}
            </p>
          </div>

          <nav className="space-y-4">
            <h3 className="text-xs text-[#999999] uppercase">General</h3>
            <a
              href="#"
              className="flex items-center text-[#333333] p-2 rounded hover:bg-[#F1EFEF]"
            >
              <img src={dashboardIcon} alt="" />
              <span className="ml-2">Dashboard</span>
            </a>
            <a
              href="#"
              className="flex items-center text-[#333333] p-2 rounded hover:bg-[#F1EFEF]"
            >
              <img src={recentScans} alt="" />
              <span className="ml-2">Recent Scans</span>
            </a>
            <a
              href="#"
              className="flex items-center text-[#333333] p-2 rounded hover:bg-[#F1EFEF]"
            >
              <img src={currentPatients} alt="" />
              <span className="ml-2">Current Patients</span>
            </a>
            <a
              href="#"
              className="flex items-center text-[#333333] p-2 rounded hover:bg-[#F1EFEF]"
            >
              <img src={addPatient} alt="" />
              <span className="ml-2">Add a Patient</span>
            </a>
            <h3 className="text-xs text-[#999999] uppercase mt-4">Personal</h3>
            <a
              href="#"
              className="flex items-center text-[#333333] p-2 rounded hover:bg-[#F1EFEF]"
            >
              <img src={dashboardIcon} alt="" />
              <span className="ml-2">My Profile</span>
            </a>
          </nav>
          <button className="mt-10 w-full py-2 bg-[#FFE5E5] text-[#FF0000] rounded text-sm font-semibold">
            Log Out
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-grow px-24 py-10 bg-[#F1EFEF]">
          <h1 className="mt-16 text-[3rem] font-bold">Welcome, Dr. Sam!</h1>
          <p className="text-[1.5rem] text-[#666666]">
            Look over your most{" "}
            <a href="#" className="text-[#1D4ED8]">
              recent scans
            </a>{" "}
            or view{" "}
            <a href="#" className="text-[#1D4ED8]">
              patients by profile
            </a>
            .
          </p>
          <div className="grid grid-cols-2 gap-8 mt-10">
            {/* Card 1 */}
            <div className="bg-white rounded-[15px] border-2 border-[#00B894] p-6 shadow-sm flex flex-col items-center relative">
              <h2 className="text-[1.5rem] font-bold mb-4">
                Previous Five Scans
              </h2>
              {/* Content Wrapper */}
              <div className="relative flex items-center justify-center w-full">
                {/* Left Arrow */}
                <button
                  onClick={handlePrev}
                  className="absolute left-0 text-gray-400 hover:text-gray-600"
                >
                  <img src={leftArrow} alt="" />
                </button>

                {/* Card Content */}
                <Card
                  person={scans[currentIndex].person}
                  title={scans[currentIndex].condition}
                  date={scans[currentIndex].date}
                  confidence={scans[currentIndex].confidence}
                ></Card>

                {/* Right Arrow */}
                <button
                  onClick={handleNext}
                  className="absolute right-0 text-gray-400 hover:text-gray-600"
                >
                  <img src={rightArrow} alt="" />
                </button>
              </div>

              {/* Pagination Dots */}
              <div className="flex space-x-2 mt-4">
                {scans.map((_, index) => (
                  <span
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      currentIndex === index ? "bg-[#1D4ED8]" : "bg-gray-300"
                    }`}
                  ></span>
                ))}
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-[#FFFFFF]  rounded-[15px] border-2  border-[#D63031] p-6 shadow-sm">
              <h2 className="text-lg font-bold">
                Something here for a big #...
              </h2>
              <p className="text-6xl font-extrabold text-[#333333]">14</p>
              <p className="text-sm text-[#666666] mt-4">
                Some sort of short body text here, or maybe an external
                link/button to patient data?
              </p>
            </div>
          </div>
          {/* Bottom Section */}
          <div className="mt-12">
            <h2 className="text-lg font-bold">Client Profiles at a Glance</h2>
            <div className="mt-6 bg-[#FFFFFF] rounded-md shadow p-6">
              {/* Placeholder for table or content */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
