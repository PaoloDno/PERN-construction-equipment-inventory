import React from "react";
import { useNavigate } from "react-router-dom";

const EquipmentActivityList = ({ equipment }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/equipment/${equipment.equipment_id}`)
      }
      className="
        flex flex-row
        items-center
        w-full
        min-h-[110px]
        p-3
        gap-4
        border-b-2
        border-gray-700/30
        bg-white/70
        hover:bg-primary-hover/20
        cursor-pointer
        transition
      "
    >
      {/* Image */}
      <div
        className="
          w-24 h-20
          shrink-0
          overflow-hidden
          rounded-md
          bg-black/10
          flex items-center justify-center
        "
      >
        {equipment?.equipment_image ? (
          <img
            src={`http://localhost:5000${equipment.equipment_image}`}
            alt={equipment.equipment_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-xs text-gray-500 text-center">
            Image not found
          </p>
        )}
      </div>

      {/* Equipment */}
      <div className="w-1/5 min-w-0">
        <p className="font-bold text-sm truncate">
          {equipment.equipment_name}
        </p>

        <p className="text-xs text-gray-600 capitalize">
          {equipment.equipment_status}
        </p>
      </div>

      {/* Project */}
      <div className="w-1/5 min-w-0">
        <p className="text-[11px] text-gray-500">
          Project
        </p>

        <p className="text-sm font-medium truncate">
          {equipment.project_name}
        </p>

        <p className="text-xs text-gray-600 truncate">
          {equipment.location}
        </p>
      </div>

      {/* Project Status */}
      <div className="w-28 shrink-0">
        <p className="text-[11px] text-gray-500">
          Project Status
        </p>

        <p className="text-sm capitalize">
          {equipment.project_status}
        </p>
      </div>

      {/* Condition Before */}
      <div className="w-28 shrink-0">
        <p className="text-[11px] text-gray-500">
          Before
        </p>

        <p className="text-sm capitalize">
          {equipment.condition_before}
        </p>

        <p className="text-[10px] text-gray-500 mt-1">
          {new Date(
            equipment.borrowed_at
          ).toLocaleString()}
        </p>
      </div>

      {/* Condition After */}
      <div className="w-28 shrink-0">
        <p className="text-[11px] text-gray-500">
          After
        </p>

        <p className="text-sm capitalize">
          {equipment.condition_after || "—"}
        </p>

        <p className="text-[10px] text-gray-500 mt-1">
          {equipment.returned_at
            ? new Date(
                equipment.returned_at
              ).toLocaleString()
            : "Not Returned"}
        </p>
      </div>

      {/* Responsible User */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-gray-500">
          Responsible User
        </p>

        <p className="text-sm font-medium truncate">
          {equipment.username || "Unknown"}
        </p>
      </div>
    </div>
  );
};

export default EquipmentActivityList;