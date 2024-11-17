import Header from "./Header";

const UserDashboard = () => {
  return (
    <>
      <Header></Header>

      <div className="w-[95%] h-[90vh] m-auto mt-[80px] bg-[#F1EFEF] flex flex-row align-middle rounded-[20px] border-[#FFFFFF]">
        <div className="w-[20%] h-[95%] mx-10 mt-auto">
          <div className="w-[90%] h-[100px] bg-[#FFFFFF]  rounded-[15px] flex ">
            <div className="min-w-[50px] h-[50px]  bg-[#F1EFEF] mx-4 self-center rounded-full"></div>
            <div className="w-full flex flex-col justify-center">
              <h2 className="text-[#5d6166] font-google text-[20px]">
                Username
              </h2>
              <h3 className="text-[#5d6166] font-google text-[14px]">
                User Email
              </h3>
            </div>
          </div>
        </div>
        <div className="flex-grow h-[90%] m-auto flex flex-col mr-10">
          <div className="w-full h-[50px] rounded-t-[20px] bg-[#FFFFFF] flex">
            <h3 className=" self-center m-10 text-[16px] font-google">
              Client profiles
            </h3>
          </div>
          <div className="w-full flex-grow bg-[#FFFFFF] rounded-b-[20px] mt-[2px]">
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
