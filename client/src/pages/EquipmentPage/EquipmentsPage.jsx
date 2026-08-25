import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getEquipmentsAction } from "../../store/actions/EquipmentThunks";

const EquipmentsPage = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);

  const { equipments, pagination, isPending, isRejected, error } = useSelector(
    (state) => state.equipment,
  );

  useEffect(() => {
    if (token) {
      dispatch(getEquipmentsAction(1));
    }
  }, [dispatch, token]);

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.currentPage
    ) {
      return;
    }

    dispatch(getEquipmentsAction(page));
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex flex-col w-full p-4 gap-2">EQUIPMENTS</div>

      <div className="flex justify-between items-center">
        {/** utilities bar */}
        <div className="flex flex-row justify-between items-center">
          Equipments
        </div>

        <Link
          to="/addEquip"
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          Add Equipment
        </Link>
      </div>

      {/** grid */}

      {isPending && (
        <div className="flex justify-center items-center p-10">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}

      {/* Error */}
      {isRejected && (
        <div className="p-4">
          <p className="text-red-500">{error || "Failed to load projects."}</p>
        </div>
      )}

      {!isPending && !isRejected && (
        <div className="flex flex-col w-full p-4">
          <div className="flex justify-between items-center p-4">
            <h2>Equipment List</h2>

            <p>{pagination.totalEquipments} equipments</p>

            {equipments.length === 0 ? (
              <div>
                <p className="text-gray-500">No projects found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {equipments.map((equipment) => (
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

                    {/** equipment details */}
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

                        {/** widgets */}
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
                ))}
              </div>
            )}


            {/*pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentsPage;
