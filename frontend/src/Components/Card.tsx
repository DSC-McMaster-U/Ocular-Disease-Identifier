import React from "react";

interface CardProps {
  person: string;
  title: string;
  date: string;
  confidence: number;
}

const Card = ({ person, title, date, confidence }: CardProps) => {
  return (
    <div className="bg-[#F8F8F8] rounded-[15px] shadow-md border border-[#727272] p-6 w-[80%]">
      <p className="text-sm font-bold">{person}</p>
      <p className="text-base font-semibold text-[#333333] mt-2">{title}</p>
      <p className="text-xs text-[#999999] mt-2">Date: {date}</p>
      <p className="text-xs text-[#999999]">Confidence Value: {confidence}</p>
      <button className="mt-4 px-4 py-2 bg-[#1D4ED8] text-white text-xs font-semibold rounded">
        Go to Scan
      </button>
    </div>
  );
};

export default Card;
