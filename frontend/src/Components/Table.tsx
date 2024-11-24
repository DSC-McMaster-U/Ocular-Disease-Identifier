import React, { useState } from "react";
import { Patient } from "../Models/patient";

const Table: React.FC<{ patients: Patient[] }> = ({ patients }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredPatients = patients.filter((patient) =>
    patient.person.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="bg-white rounded-[15px] border-2 border-[#F1C40F] p-6 shadow-md w-full  mx-auto">
      {/* Title Row with Search */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          Client Profiles at a Glance
        </h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1 text-sm border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F1C40F]"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="bg-gradient-to-r from-[#F9F9F9] to-[#FFF9E6] text-gray-700">
              <th className="px-4 py-2 border border-gray-200 text-left font-semibold">
                #
              </th>
              <th className="px-4 py-2 border border-gray-200 text-left font-semibold">
                Person
              </th>
              <th className="px-4 py-2 border border-gray-200 text-left font-semibold">
                Condition
              </th>
              <th className="px-4 py-2 border border-gray-200 text-left font-semibold">
                Date
              </th>
              <th className="px-4 py-2 border border-gray-200 text-left font-semibold">
                Confidence
              </th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {filteredPatients.map((patient, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-[#FFF9E6]`}
              >
                <td className="px-4 py-2 border border-gray-200 text-center font-medium">
                  {index + 1}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {patient.person}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {patient.condition}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {patient.date}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {patient.confidence.toFixed(2)}
                </td>
              </tr>
            ))}
            {/* No Results Row */}
            {filteredPatients.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-2 border border-gray-200 text-center text-gray-500"
                >
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
