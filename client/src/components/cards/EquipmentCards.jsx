import { useNavigate } from "react-router-dom";
import BorrowEquipmentModal from "../../pages/EquipmentPage/components/BorrowEquipmentModal";
import { useState } from "react";

const EquipmentCards = ({ key, equipment }) => {
  const navigate = useNavigate();

  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);

  const handleOpenCloseBorrowModal = () => {
    setIsBorrowModalOpen(!isBorrowModalOpen);
  };

  return (
    <div
      key={`${key}${equipment.id}`}
      className="flex flex-col min-w-[250px] bg-white/50 gap-3 p-2 pb-3 overflow-hidden w-full min-h-[30vh] shadow-2xl rounded-2xl"
    >
      <div className="flex overflow-hidden flex-col w-full min-h-[45vh] py-5 px-2 rounded-2xl bg-gradient-to-br from-cyan-400/40 to-indigo-600/65">
        {equipment.image ? (
          <img
            src={`http://localhost:5000${equipment.image}`}
            alt={equipment.equipment_name}
            className="w-full h-[18vh] md:h-[20vh] object-cover"
          />
        ) : (
          <div className="w-full h-[15vh] flex items-center justify-center bg-gray-600">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        {/** details */}
        <div className="flex flex-col w-full h-fit text-[14px]  leading-none py-2">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-gray-800 text-md">
              {equipment.equipment_name}
            </h3>
            <span className="w-full line-clamp-3 grid grid-cols-2 gap-1 justify-start items-center">
              <span className="flex items-center justify-start py-1">
                Status:
              </span>

              <span
                className={`flex w-full justify-center text-xs px-2 py-1 ${
                  equipment.status === "available"
                    ? "bg-success/80 text-white"
                    : equipment.status === "borrowed"
                      ? "bg-primary-hover text-white"
                      : equipment.status === "retire"
                        ? "bg-danger text-white"
                        : equipment.status === "maintenance"
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-200 text-black"
                }`}
              >
                {equipment.status}
              </span>
              <span className="flex items-center justify-start">
                Condition:
              </span>

              <span className="flex w-full justify-center text-xs px-2 py-1 bg-primary-hover text-white rounded">
                {equipment.condition}
              </span>
            </span>
            <p className="text-black mt-2 line-clamp-3 truncate">
              {equipment.category || "No notes"}
            </p>
            <p className=" text-gray-500 line-clamp-3 truncate italic">
              "{equipment.note || "No notes"}"
            </p>
            {equipment.project_name ? (
              <div
                className="p-2 grid grid-cols-2 h-[8vh] pb-4
                  w-full  bg-surface/60 border-2 overflow-hidden
                  border-gray-500 rounded-sm"
              >
                <span>project:</span>{" "}
                <span>
                  {equipment.project_name}-{equipment.location}
                </span>
                <span>p-status:</span> <span
                className={`flex w-full justify-center text-xs px-2 py-1 ${
                  equipment.project_status === "planning"
                    ? "bg-gray-300 text-black"
                    : equipment.project_status === "active"
                      ? "bg-green-500 text-black"
                      : equipment.project_status === "completed"
                        ? "bg-blue-500 text-white"
                        : equipment.project_status === "onhold"
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-200 text-black"
                }`}
              >
                {equipment.project_status}
              </span>
              </div>
            ) : (
              <div
                className="p-1 flex flex-col justify-start items-center w-full h-[8vh] bg-surface border-2
               border-gray-500 rounded-sm overflow-hidden"
              >
                <span>Equipment is avaible:</span>
                <button
                  onClick={() => handleOpenCloseBorrowModal()}
                  className="w-[120px] p-1 px-2 py-2 bg-button my-1 rounded-md hover:bg-primary-hover hover:text-white"
                >
                  Borrow
                </button>
              </div>
            )}
            <div className="w-full justify-center items-center p-2 flex">
              <button
                onClick={() => navigate(`/equipment/${equipment.id}`)}
                className="w-[120px] flex flex-row justify-center items-center bg-button 
                px-3 py-2 border-2 shadow-2xl border-gray-300 rounded-md text-sm hover:bg-primary-hover hover:text-white"
              >
                View Equipment
              </button>
            </div>
          </div>
        </div>
      </div>

      {isBorrowModalOpen && (
        <BorrowEquipmentModal
          equipment={equipment}
          onClose={() => handleOpenCloseBorrowModal()}
        />
      )}
    </div>
  );
};

export default EquipmentCards;

{
  /**
  <div>
                    <div
                      key={equipment.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="w-full h-48 bg-gray-100">
                        {equipment.image ? (
                          <img
                            src={`http://localhost:5000${equipment.image}`}
                            alt={equipment.equipment_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex flex-col p-4">
                        <h3 className="font-semibold text-gray-800">
                          {equipment.equipment_name}
                        </h3>

                        <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                          {equipment.status}
                        </span>

                        <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                          {equipment.condition}
                        </span>

                        <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                          {equipment.note || "No notes"}
                        </p>

                        {/** widgets 
                        <div className="w-full h-20 bg-gray-700/20 p-2">
                          <button
                            onClick={() =>
                              navigate(`/equipment/${equipment.id}`)
                            }
                            className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
                          >
                            View Equipment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                   */
}
