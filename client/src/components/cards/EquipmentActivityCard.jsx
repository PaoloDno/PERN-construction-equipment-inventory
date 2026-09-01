
import React from "react";
import { useNavigate } from "react-router-dom";

const EquipmentActivityCard = ({ key, equipment }) => {
  
  const navigate = useNavigate();
  
  return (
    <div key={`${equipment.id}${key}`} 
    onClick={() => navigate(`/equipment/${equipment.equipment_id}`)}
    className="flex flex-col min-w-[270px] gap-3 p-3 pb-5 rounded-xl border-2 border-gray-700/80 overflow-hidden w-full min-h-[30vh] bg-primary shadow-2xl">

      {/* Equipment Information */}
      <div className="flex flex-row w-full justify-between gap-3">

        {/* Image */}
        <div className="flex w-1/3 h-28 p-1 items-center justify-center overflow-hidden rounded-md bg-black/10">
          {equipment?.equipment_image ? (
            <img
              src={`http://localhost:5000${equipment.equipment_image}`}
              alt={equipment.equipment_name}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <p className="text-xs text-gray-500 text-center">
              Image not found
            </p>
          )}
        </div>

        {/* Details */}
        <div className="w-2/3 text-[14px] leading-snug">
          <p className="font-bold text-base">
            {equipment.equipment_name}
          </p>

          <p className="capitalize text-gray-700">
            {equipment.equipment_status}
          </p>

          <p className="text-[13px] mt-1">
            <span className="font-medium">Project:</span>{" "}
            {equipment.project_name}
          </p>

          <p className="text-[13px]">
            <span className="font-medium">Status:</span>{" "}
            <span className="capitalize">
              {equipment.project_status}
            </span>
          </p>

          <p className="text-[13px]">
            <span className="font-medium">Location:</span>{" "}
            {equipment.location}
          </p>
        </div>
      </div>

      {/* Activity Information */}
      <div className="w-full grid grid-cols-2 text-[13px] gap-1 rounded-md leading-snug">

        {/* Before / Borrowed */}
        <span className="flex flex-col p-2 bg-white/40 rounded-md">
          <p className="font-medium">
            Condition Before
          </p>

          <p className="capitalize">
            {equipment.condition_before}
          </p>

          <p className="mt-1 text-[11px] text-gray-600">
            Borrowed At
          </p>

          <p className="text-[12px]">
            {new Date(equipment.borrowed_at).toLocaleString()}
          </p>
        </span>

        {/* After / Returned */}
        <span className="flex flex-col p-2 bg-white/40 rounded-md">
          <p className="font-medium">
            Condition After
          </p>

          <p className="capitalize">
            {equipment.condition_after || "—"}
          </p>

          <p className="mt-1 text-[11px] text-gray-600">
            Returned At
          </p>

          <p className="text-[12px]">
            {equipment.returned_at
              ? new Date(equipment.returned_at).toLocaleString()
              : "Not Returned"}
          </p>
        </span>

        {/* User */}
        <span className="col-span-2 p-2 bg-white/20 rounded-md">
          <p>
            <span className="font-medium">
              Responsible User:
            </span>{" "}
            {equipment.username || "Unknown"}
          </p>
        </span>

      </div>
    </div>
  );
};

export default EquipmentActivityCard;
