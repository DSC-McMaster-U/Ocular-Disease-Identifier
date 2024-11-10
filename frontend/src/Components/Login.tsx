import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { User } from "../Models/user";
import { loginHandler } from "../Network/registerLogin";
import GoogleLogo from "../vendor/img/Global/GoogleLogo.svg";
import HidePassword from "../vendor/img/SignUp/eye (1).svg";
import Header from "./Header";

const Login = () => {
  const { register, handleSubmit } = useForm<User>();
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const onSubmit: SubmitHandler<User> = async (user: User) => {
    setButtonDisabled(true);
    const response = await loginHandler(user);
    if (!response || response.error) {
      console.error("Error:", response.error);
    } else {
      console.log("Response:", response);
    }
    setButtonDisabled(false);
  };

  return (
    <>
      <Header></Header>;
      <div className="mt-[60px] w-full h-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-[480px] h-fit border-[#585858] border rounded-[15px] m-auto mt-[155px] bg-white shadow-section">
            <div className="flex flex-row flex-wrap">
              <h2 className="w-full mt-8 font-thin font-google text-[20px] text-center">
                Login
              </h2>

              <div className="w-full h-[50px] flex mt-3">
                <div className="w-4/5 h-[40px] border-[2px] rounded-[20px] bg-white border-[#DADCE0] m-auto self-center flex items-center hover:cursor-pointer">
                  <img src={GoogleLogo} className="ml-[13px]" alt="" />
                  <h3 className="text-[14px] font-google text-center w-full mr-[35px]">
                    Sign in with Google
                  </h3>
                </div>
              </div>

              <div className="flex  items-center justify-center w-full space-x-2 mt-2 ">
                <div className="border-[#C2B9B9] h-[2px] bg-[#C2B9B9] border-[2px] rounded-[10px] w-[30%]"></div>
                <h4>Or</h4>
                <div className="border-[#C2B9B9] h-[2px]  bg-[#C2B9B9] border-[2px] rounded-[10px] w-[30%]"></div>
              </div>

              <div className="flex w-full items-center h-fit justify-center mt-5 flex-wrap space-y-5">
                <div className="border-[#C7C5C5] h-[40px] w-[300px] border-[2px] rounded-[4px] flex ">
                  {/* Fix the background color of the input text not matching the general background color later */}
                  <input
                    className="w-[95%] h-full  focus:outline-none focus:border-none ml-2 justify-self"
                    {...register("email", { required: true, minLength: 4 })}
                    placeholder="Email"
                    type="text"
                  />
                </div>
                <div className="border-[#C7C5C5] h-[40px] w-[300px] border-[2px] rounded-[4px] flex ">
                  {/* Fix the background color of the input text not matching the general background color later */}
                  <input
                    className="w-[95%] h-full  focus:outline-none focus:border-none ml-2 justify-self"
                    {...register("password", { required: true, minLength: 8 })}
                    placeholder="Password"
                    type="text"
                  />
                  <img
                    src={HidePassword}
                    className=" max-w-4  ml-2 mr-4"
                    alt=""
                  />
                </div>
              </div>

              <div className="w-full m-10 h-12 flex justify-center align-center ">
                <input
                  type="submit"
                  disabled={buttonDisabled}
                  className=" bg-[#4285F4] text-[#FFFF] w-[60%] border-[2px] rounded-[8px] text-[17px] hover:cursor-pointer"
                  name=""
                  id=""
                  value="Login"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
