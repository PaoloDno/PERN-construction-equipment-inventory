import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";

import {
  getEquipmentAction,
  getHistoryEquipmentAction,
} from "../../store/actions/EquipmentThunks";
import BorrowEquipmentModal from "./components/BorrowEquipmentModal.jsx";
import ReturnedEquipmentModal from "./components/ReturnedEquipmentModal.jsx";
import { FaBackspace, FaBackward } from "react-icons/fa";

const EquipmentPage = () => {
  const { equipmentId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // modal state
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const { token } = useSelector((state) => state.auth);

  const { equipment, history, isPending, isRejected, error } = useSelector(
    (state) => state.equipment,
  );

  // FETCH EQUIPMENT + HISTORY

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!equipmentId) {
      return;
    }

    dispatch(getEquipmentAction(equipmentId));

    dispatch(getHistoryEquipmentAction(equipmentId));
  }, [
    dispatch,
    token,
    equipmentId,
    navigate,
    isBorrowModalOpen,
    isReturnModalOpen,
  ]);

  // LOADING

  if (isPending) {
    return (
      <div className="flex justify-center items-center p-10">
        <p className="text-gray-500">Loading equipment...</p>
      </div>
    );
  }

  // ERROR

  if (isRejected) {
    return (
      <div className="p-10">
        <p className="text-red-500">{error || "Failed to load equipment."}</p>
      </div>
    );
  }

  // EQUIPMENT NOT FOUND

  if (!equipment) {
    return (
      <div className="p-10">
        <p className="text-gray-500">Equipment not found.</p>
      </div>
    );
  }

  // CURRENT PROJECT

  const currentProject = history?.find((item) => item.returned_at === null);

  const handleOpenCloseBorrowModal = () => {
    setIsBorrowModalOpen(!isBorrowModalOpen);
  };

  const handleOpenCloseReturnModal = () => {
    setIsReturnModalOpen(!isReturnModalOpen);
  };

  return (
    <div className="flex flex-col w-full min-h-screen p-6 gap-6 items-center justify-center">
      {/* EQUIPMENT INFORMATION */}

      <div className="fixed inset-0 -z-10 min-h-screen w-full bg-gradient-to-br from-blue-300/80 via-indigo-500 to-purple-600 opacity-70" />

      <button
        onClick={() => navigate("/equipments")}
        className="flex hover:underline flex-row text-md lg:text-2xl text-white items-center gap-2 h-[10vh] lg:h-[12vh] bg-primary-hover/70 w-full max-w-3xl justify-between md:justify-start px-4"
      >
        <FaBackward size={24} />
        <span>Go back to Equipments Page</span>
      </button>

      <div className="grid col-span-1 md:grid-cols-2 border rounded-lg p-6 w-full max-w-3xl bg-white/70 gap-2">
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

        <span>
          <h1 className="text-2xl font-bold mb-4">
            {equipment.equipment_name}
            <p className="flex flex-row gap-2 items-center justify-start">
              <strong>Status:</strong>{" "}
              <span
                className={`flex w-full justify-center text-[16px] px-2 py-1 max-w-[120px] items-center justify-center ${
                  equipment.status === "available"
                    ? "text-success/80"
                    : equipment.status === "borrowed"
                      ? "text-primary-hover"
                      : equipment.status === "retire"
                        ? "text-danger"
                        : equipment.status === "maintenance"
                          ? "text-yellow-500 "
                          : "text-black"
                }`}
              >
                {equipment.status}
              </span>
            </p>
          </h1>
        </span>
        <div className="flex flex-col gap-2">
          <p>
            <strong>Category:</strong> {equipment.category}
          </p>

          <p>
            <strong>Condition:</strong> {equipment.condition}
          </p>
          {equipment.note && (
            <p>
              <strong>Note:</strong> {equipment.note}
            </p>
          )}
        </div>
      </div>

      {/* CURRENT PROJECT */}

      <div className="flex flex-col border rounded-lg p-6 w-full max-w-3xl bg-white/70 gap-2 min-h-[25vh]">
        <h2 className="text-xl font-bold mb-4">Current Project</h2>

        {equipment.status === "borrowed" && currentProject ? (
          <div className="flex flex-col gap-2">
            <p>
              <strong>Project:</strong> {currentProject.project_name}
            </p>

            <p>
              <strong>Borrowed by:</strong> {currentProject.username}
            </p>

            <p>
              <strong>Borrowed at:</strong> {currentProject.borrowed_at}
            </p>

            <p>
              <strong>Condition before:</strong>{" "}
              {currentProject.condition_before}
            </p>

            <button
              type="button"
              onClick={() => handleOpenCloseReturnModal()}
              className="w-[120px] p-1 px-2 py-2 bg-button my-1 rounded-md hover:bg-primary-hover hover:text-white"
           >
              Return
            </button>
          </div>
        ) : (
          <p className="text-gray-500">Equipment is currently available.</p>
        )}

        {equipment.status === "available" && (
          <button
            type="button"
            onClick={() => handleOpenCloseBorrowModal()}
            className="w-[120px] p-1 px-2 py-2 bg-button my-1 rounded-md hover:bg-primary-hover hover:text-white"
          >
            BORROW
          </button>
        )}
      </div>

      {/* HISTORY */}

      <div className="flex flex-col border rounded-lg p-6 w-full max-w-3xl bg-white/70 gap-2 min-h-[25vh]">
        <h2 className="text-xl font-bold mb-4">Equipment History</h2>

        {!history || history.length === 0 ? (
          <p className="text-gray-500">No equipment history.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {/* history.length > 0 */}

            {history.map((item) => (
              <div key={item.id} className="border rounded-md p-4">
                <p>
                  <strong>Project:</strong>{" "}
                  {item.project_name || "Unknown project"}
                </p>

                <p>
                  <strong>User:</strong> {item.username || "Unknown user"}
                </p>

                <p>
                  <strong>Status:</strong> {item.status}
                </p>

                <p>
                  <strong>Condition before:</strong> {item.condition_before}
                </p>

                <p>
                  <strong>Condition after:</strong>{" "}
                  {item.condition_after || "—"}
                </p>

                <p>
                  <strong>Borrowed:</strong> {item.borrowed_at}
                </p>

                <p>
                  <strong>Returned:</strong>{" "}
                  {item.returned_at || "Currently borrowed"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isBorrowModalOpen && (
        <BorrowEquipmentModal
          equipment={equipment}
          onClose={() => handleOpenCloseBorrowModal()}
        />
      )}

      {isReturnModalOpen && (
        <ReturnedEquipmentModal
          equipment={equipment}
          onClose={() => handleOpenCloseReturnModal()}
        />
      )}
    </div>
  );
};

export default EquipmentPage;
