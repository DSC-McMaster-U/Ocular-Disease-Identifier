import Header from "../Header";
import defaultProfilePic from "../../vendor/img/UserDashboard/userDefault.svg";
import addPatient from "../../vendor/img/UserDashboard/add_patient_icon.svg";
import recentScans from "../../vendor/img/UserDashboard/recent_scans_icon.svg";
import dashboardIcon from "../../vendor/img/UserDashboard/dashboard_icon.svg";
import currentPatients from "../../vendor/img/UserDashboard/current_patients_icon.svg";
import rightArrow from "../../vendor/img/UserDashboard/right_arrow.svg";
import leftArrow from "../../vendor/img/UserDashboard/left_arrow.svg";
import { Profile } from "../../Models/user";
import { Patient } from "../../Models/patient";
import Card from "./Card";
import Table from "./Table";
import SubMenuTab from "./SubMenuTab";
import { useState, useEffect, ProfilerOnRenderCallback } from 'react';
import { getProfiles } from "../utils/auth";

const UserDashboard = () => {

  interface Profiled {
    accuracy: string;
    disease: string;
    date: string;
    name: string;
    // Add other properties as needed
  }


  const [profileData, setProfileData] = useState<Profiled[] | null>(null);  // Add this state



  useEffect(() => {
    const userStr = localStorage.getItem('user');
    console.log("here");
    console.log(userStr);

    if (userStr) {
      const user = JSON.parse(userStr);
      console.log("user");
      console.log(user);

      const displayName = user.email.split('@')[0]; // Extract username from email
      console.log("name");
      console.log(displayName);

      // Call the /get_profiles endpoint
      fetch('http://localhost:8080/get_profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.email }),
      })
        .then(response => response.json())
        .then(data => {
          console.log("Profiles received:", data);
          setProfileData(data); // Assuming the response is an array of profiles
        })
        .catch(error => {
          console.error("Error fetching profiles:", error);
        });
    }
  }, []);

  console.log("here!!")
  if (profileData != null){
    console.log(profileData[0]["accuracy"])
  }




  // Submenu tab constants + useStates
  const numGeneralTabs = 4;
  const numPersonalTabs = 1;
  const [subMenuTab, setSubMenuTab] = useState<boolean[]>([
    true,
    ...Array(numGeneralTabs + numPersonalTabs - 1).fill(false),
  ]);

  const [profile, setProfile] = useState<Profile | null>(null);



  // Temporary placeholder data for recent scans
  let scans: Patient[]; // Declare scans outside the if-else blocks

  if (profileData != null) {
    scans = []
    for (const pat of profileData) {
      scans.push({person: pat["name"],condition: pat["disease"],date: pat["date"],confidence: Number((pat["accuracy"]).slice(0, -1))})
    }
  } else {
    scans = [
      {
        person: "null",
        condition: "null",
        date: "null",
        confidence: 0.00,
      },
      {
        person: "null",
        condition: "null",
        date: "null",
        confidence: 0.00,
      },
      {
        person: "null",
        condition: "null",
        date: "null",
        confidence: 0.00,
      },
    ];
  }

  // State to track the currently displayed card
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardAnim, setCardAnim] = useState("");

  // Handler for navigation buttons
  const handlePrev = async () => {
    setCardAnim("slide-left-exit-anim");
    await new Promise((resolve) => setTimeout(resolve, 250));

    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? scans.length - 1 : prevIndex - 1
    );

    setCardAnim("slide-right-enter-anim");
  };

  const handleNext = async () => {
    setCardAnim("slide-right-exit-anim");
    await new Promise((resolve) => setTimeout(resolve, 250));

    setCurrentIndex((prevIndex) =>
      prevIndex === scans.length - 1 ? 0 : prevIndex + 1
    );

    setCardAnim("slide-left-enter-anim");
  };

  // Handler for switching submenu tabs & body content
  const handleTabClick = (index: number) => {
    if (index < 0 || index >= numGeneralTabs + numPersonalTabs) {
      console.log(
        "Error: Invalid index provided for selection of submenu tabs... defaulting to first menu"
      );
      setSubMenuTab([
        true,
        ...Array(numGeneralTabs + numPersonalTabs - 1).fill(false),
      ]);
    } else {
      setSubMenuTab([
        ...Array(index).fill(false),
        true,
        ...Array(numGeneralTabs + numPersonalTabs - (index + 1)).fill(false),
      ]);
    }
  };

  // Main dashboard body component (you can probably move this into a separate component file)
  const MainDashboard = () => {
    const [username, setUsername] = useState<string>(""); // Add this state

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            // Assuming email is something like "doctor@email.com", this will show just "doctor"
            const displayName = user.email.split('@')[0];
            setUsername(displayName);
        }
    }, []);
    return (
      <>
        {/* Header text */}
        <div className="mt-[71px]">
          <h1 className="text-[45px] font-bold text-[#2c2c2c] font-google tracking-wide">
            Welcome, Dr. {username}!
          </h1>
          <p className="text-2xl font-body mt-[12px] text-[#666666]">
            Look over your most{" "}
            <a
              href="#"
              className="text-[#387EED] underline"
              onClick={() => {
                handleTabClick(1);
              }}
            >
              recent scans
            </a>{" "}
            or view{" "}
            <a
              href="#"
              className="text-[#387EED] underline"
              onClick={() => {
                handleTabClick(2);
              }}
            >
              patients by profile
            </a>
            .
          </p>
        </div>

        <div
          className="
            xl:grid xl:grid-cols-2 xl:gap-8 mt-[42px]
            flex flex-col gap-[42px]
          "
        >
          {/* Card 1 */}
          <div className="flex flex-col bg-white rounded-[20px] border-2 border-[#00B894] py-[25px] px-[32px] shadow-sm items-center relative">
            <h2 className="self-start text-[#2d2d2d] text-[23px] ml-[10px] font-normal font-google">
              Latest Five Scans
            </h2>
            {/* Content Wrapper */}
            <div className="relative flex items-center justify-center w-full mt-[20px]">
              {/* Left Arrow */}
              <button
                onClick={handlePrev}
                className="absolute left-0 text-gray-400 hover:text-gray-600 hover:scale-[110%] transition-all z-10"
              >
                <img src={leftArrow} alt="" />
              </button>

              {/* Card Content */}
              <Card patient={scans[currentIndex]} anim={cardAnim}></Card>

              {/* Right Arrow */}
              <button
                onClick={handleNext}
                className="absolute right-0 text-gray-400 hover:text-gray-600 hover:scale-[110%] transition-all z-10"
              >
                <img src={rightArrow} alt="" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex space-x-2 mt-4">
              {scans.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all duration-200 cursor-pointer hover:scale-[125%] ${
                    currentIndex === index
                      ? "bg-[#387EED] scale-125"
                      : "bg-gray-300 scale-100"
                  }`}
                  onClick={async () => {
                    if (index == currentIndex) {
                      return;
                    }

                    // CurrentIndex - index < 0 => switching to next card (play enter from left animation);
                    // CurrentIndex - index > 0 => switching to prev. card (play enter from right animation)
                    setCardAnim(
                      currentIndex - index < 0
                        ? "slide-right-exit-anim"
                        : "slide-left-exit-anim"
                    );
                    await new Promise((resolve) => setTimeout(resolve, 250));
                    setCurrentIndex(index);

                    setCardAnim(
                      currentIndex - index < 0
                        ? "slide-left-enter-anim"
                        : "slide-right-enter-anim"
                    );
                  }}
                ></span>
              ))}
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col justify-between bg-[#FFFFFF] rounded-[20px] border-2 border-[#D63031] py-[25px] px-[42px] shadow-sm">
            <h2 className="self-start text-[#2d2d2d] text-[23px] font-normal font-google">
              This Week's Total Uploads
            </h2>
            <p className="text-[92px] font-bold font-google">14</p>
            <p className="text-[#666666] text-[16px] font-light font-body mb-[21px] mt-[10px]">
              Some sort of short body text here, or maybe an external
              link/button to the upload image page?
            </p>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="mt-12">
          <Table patients={scans}></Table>
        </div>
      </>
    );
  };

  // All dashboard bodies, accessible through their selected index (equal to their submenu tab index number)
  // Note: Most of the submenu ideas are placeholders for now; feel free to replace them with better ideas
  //       down the line, or create the related components for them
  const dashboardBodies = [
    <MainDashboard />, // Submenu tab #1 - Dashboard
    <div />, // Submenu tab #2 - Recent Scans
    <div />, // Submenu tab #3 - Current Patients
    <div />, // Submenu tab #4 - Add a Patient
    <div />, // Submenu tab #5 - My Profile
  ];

  // Function to select and display dashboard body, based on subtab selected
  const getDashboardBody = () => {

    for (const [index, tabStatus] of subMenuTab.entries()) {
      console.log(`Index ${index}: ${tabStatus}`);
      if (tabStatus) {
        console.log(`Switching to dashboard menu #${index}...`);
        return dashboardBodies[index];
      }
    }

    // In case of an error state where no true values are detected, return top dashboard menu by default
    console.log(
      "Error: No selected tab detected! (Check for an issue with 'subMenuTab' indices)"
    );
    return dashboardBodies[0];
  };
  const [username, setUsername] = useState<string>(""); // Add this state
  const [email, setEmail] = useState<string>(""); // Add this state

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        setEmail(user.email)
        // Assuming email is something like "doctor@email.com", this will show just "doctor"
        const displayName = user.email.split('@')[0];
        setUsername(displayName);
    }
  }, []);


  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header></Header>

      <div className="flex flex-1 h-full pt-[57px] relative">
        {/* Sidebar */}
        <aside
          className="
            fixed h-full w-[345px] bg-[#FFFFFF] shadow-md pt-[40px] border-r-2 border-[#d2d2d2]
            flex flex-col justify-between gap-[20px]
          "
        >
          {/* Wrapper around profile tile and submenu for formatting - separate from logout button */}
          <div className="h-full max-h-[calc(100%-(50px+25px+51px))] overflow-y-auto border-b border-[#d2d2d2]">
            <div className="flex flex-col items-center justify-center mb-[30px] border border-[#c0c0c0] min-h-[240px] w-full max-w-[80%] mx-auto px-[30px] rounded-lg">
              <img
                src={defaultProfilePic}
                alt="User"
                className="w-[104px] h-auto rounded-full"
              />
              <h2 className="mt-[20px] text-center text-[#2d2d2d] text-[23px] font-bold font-google tracking-tight">
                {profile
                  ? profile.username
                    ? profile.username
                    : profile.user.email
                  : username}
              </h2>
              <p className="mt-[5px] text-center text-[#898989] text-sm font-light font-body break-all">
                {profile
                  ? profile.username
                    ? profile.user.email
                    : ""
                  : email}
              </p>
            </div>

            <nav className="relative">
              {/* General Submenu */}
              <div className="mb-[28px]">
                <h3 className="text-[13px] font-body font-extralight text-[#2d2d2d] uppercase mx-auto mb-[11px] max-w-[80%]">
                  General
                </h3>
                <SubMenuTab
                  onInteract={handleTabClick}
                  index={0}
                  isSelected={subMenuTab[0]}
                  img={dashboardIcon}
                  name={"Dashboard"}
                  href="#"
                ></SubMenuTab>
                <SubMenuTab
                  onInteract={handleTabClick}
                  index={1}
                  isSelected={subMenuTab[1]}
                  img={recentScans}
                  name={"Recent Scans"}
                  href="#"
                ></SubMenuTab>
                <SubMenuTab
                  onInteract={handleTabClick}
                  index={2}
                  isSelected={subMenuTab[2]}
                  img={currentPatients}
                  name={"Current Patients"}
                  href="#"
                ></SubMenuTab>
                <SubMenuTab
                  onInteract={handleTabClick}
                  index={3}
                  isSelected={subMenuTab[3]}
                  img={addPatient}
                  name={"Add Patients"}
                  href="#"
                ></SubMenuTab>
              </div>

              {/* Personal Submenu */}
              <div>
                <h3 className="text-[13px] font-body font-extralight text-[#2d2d2d] uppercase mx-auto mb-[11px] max-w-[80%]">
                  Personal
                </h3>
                <SubMenuTab
                  onInteract={handleTabClick}
                  index={4}
                  isSelected={subMenuTab[4]}
                  img={addPatient}
                  name={"My Profile"}
                  href="#"
                ></SubMenuTab>
              </div>
            </nav>
          </div>

          <button className="mb-[calc(50px+25px)] w-[90%] mx-auto py-[12px] rounded-[5px] bg-[#faf2f2] hover:bg-[#ffe1e1] transition-all">
            <div className="w-full h-full text-left pl-[calc((6/90)*100%)] text-[#cd2727] text-[17px] font-google font-normal">
              Log Out
            </div>
          </button>
        </aside>

        {/* Main Content */}
        <main className="absolute right-0 top-0 w-[calc(100%-345px)] px-[80px] py-11 bg-[#FAFAFA]">
          {/* Based on the subtab selected, a different body component will be rendered from the function below */}
          {getDashboardBody()}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
