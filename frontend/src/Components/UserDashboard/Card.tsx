import React from "react";
import { Patient } from "../../Models/patient";
import goToImg from "../../vendor/img/UserDashboard/go-to.png";

interface CardProps {
  patient: Patient;
  anim: string;
}

const Card = ({ patient, anim }: CardProps) => {
  const { person, condition, date, confidence } = patient;
  return (
    <div
      className={`${anim} bg-white rounded-[20px] shadow-[1px_1px_4px_0_rgba(0,0,0,0.2)] border-[1.5px] border-[#c0c0c0] p-6 w-[80%]`}
    >
      <p className="text-[#727272] text-base font-light font-body">{person}</p>
      <p className="text-[#2c2c2c] text-2xl font-bold font-google tracking-wide mt-[7px]">
        {condition}
      </p>
      <p className="text-[#727272] text-xs font-light font-body mt-[11px]">
        Date: {date}
      </p>
      <p className="text-[#727272] text-xs font-light font-body mt-[4px]">
        Confidence Value: {confidence}
      </p>
      <button
        className="
          flex justify-center align-middle gap-[6px] mt-[19px] w-[134px] h-[38px] 
          px-4 py-2 text-white text-xs font-semibold rounded-[20px] 
          bg-[#387EED] hover:bg-[#2471ec] active:bg-[#154fad] transition-all
        "
      >
        <img src={goToImg} alt="" className="w-[12px] h-auto my-auto" />
        <span className="self-center text-white font-bold font-google text-[13px]">
          Go to Scan
        </span>
      </button>
    </div>
  );
};

export default Card;
