import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BorrowEquipmentModal from "../../pages/EquipmentPage/components/BorrowEquipmentModal";

const EquipmentCardList = ({ equipment }) => {
  const navigate = useNavigate();

  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);

  const handleOpenCloseBorrowModal = () => {
    setIsBorrowModalOpen((prev) => !prev);
  };

  return (
    <>
      <div
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
        <div className="
          w-24 h-20
          shrink-0
          overflow-hidden
          rounded-md
          bg-black/10
          flex items-center justify-center
        ">
          {equipment.image ? (
            <img
              src={`http://localhost:5000${equipment.image}`}
              alt={equipment.equipment_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-600">
              <span className="text-gray-400 text-xs">
                Image not found
              </span>
            </div>
          )}
        </div>

        {/* Equipment Name */}
        <div className="w-1/5 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">
            {equipment.equipment_name}
          </h3>

          <span className="text-sm text-gray-500 truncate">
            {equipment.category || "No category"}
          </span>
        </div>

        {/* Status */}
        <div className="w-32">
          <span className="flex justify-center items-center text-xs px-3 py-1 bg-primary-hover text-white rounded w-[80px]">
            {equipment.status}
          </span>
        </div>

        {/* Condition */}
        <div className="w-32">
          <span className="flex justify-center items-center text-xs px-3 py-1 bg-primary-hover text-white rounded w-[80px]">
            {equipment.condition}
          </span>
        </div>

        {/* Project */}
        <div className="flex-1 min-w-0">
          {equipment.project_name ? (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">
                Current Project
              </span>

              <span className="text-sm font-medium truncate">
                {equipment.project_name}
              </span>

              {equipment.project_status && (
                <span className="text-xs text-gray-500">
                  {equipment.project_status}
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm text-green-600 font-medium">
              Available
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!equipment.project_name && (
            <button
              onClick={handleOpenCloseBorrowModal}
              className="
                px-3 py-2
                bg-button
                rounded-md
                text-sm
                hover:bg-primary-hover
                hover:text-white
              flex w-[80px]
              justify-center items-center
              "
            >
              Borrow
            </button>
          )}

          <button
            onClick={() =>
              navigate(`/equipment/${equipment.id}`)
            }
            className="
              px-3 py-2
              border-2 border-gray-300
              rounded-md
              text-sm
              hover:bg-primary-hover
              hover:text-white
              flex w-[80px]
              justify-center items-center
            "
          >
            View
          </button>
        </div>
      </div>

      {isBorrowModalOpen && (
        <BorrowEquipmentModal
          equipment={equipment}
          onClose={handleOpenCloseBorrowModal}
        />
      )}
    </>
  );
};

export default EquipmentCardList;