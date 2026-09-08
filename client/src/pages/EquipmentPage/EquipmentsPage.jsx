import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getEquipmentsAction, getEquipmentSearchAction } from "../../store/actions/EquipmentThunks";
import EquipmentCards from "../../components/cards/EquipmentCards";
import {
  FaBox,
  FaBoxes,
  FaFoursquare,
  FaList,
  FaPlus,
  FaPlusCircle,
} from "react-icons/fa";
import PaginationComponent from "../../components/utils/PaginationsComponent";
import EquipmentCardList from "../../components/cards/EquipmentCardList";
import { MdCardTravel, MdSdCard } from "react-icons/md";

const EquipmentsPage = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const [viewCardMode, setViewCardMode] = useState(true);

  const [searchFilters, setSearchFilters] = useState({
    search: "",
    status: "",
    condition: "",
  });

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

    const { search, status, condition } = searchFilters;

    if (!search && !status && !condition) {
      dispatch(getEquipmentsAction(page));
    } else {
      dispatch(
        getEquipmentSearchAction({
          page,
          search,
          status,
          condition,
        }),
      );
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex items-center gap-2 h-[15vh] justify-between md:justify-start px-4">
        {/** utilities bar */}

        <div className="flex flex-col px-4 gap-2 text-xl md:text-2xl">
          EQUIPMENTS
        </div>

        <Link
          to="/addEquip"
          className="flex flex-row p-2 text-[14px] items-center justify-center gap-2 px-4 py-2 bg-button rounded-md hover:bg-success"
        >
          <FaPlusCircle /> Add Equipment
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
        <div className="flex flex-col w-full py-4 bg-primary">
          <div className="flex text-white flex-col w-full justify-start items-start p-2 bg-primary-hover">
            <div className="flex flex-col lg:flex-row w-full gap-3 lg:items-center lg:justify-between">
              {/* Title + View Toggle */}
              <div className="flex flex-row gap-2 text-xl items-center">
                <h2>Equipment List</h2>

                <button
                  onClick={() => setViewCardMode((prev) => !prev)}
                  className="
                    hidden lg:flex
                    items-center justify-center
                    px-2 text-black
                    min-w-[120px]
                    rounded-md
                    bg-button
                    hover:bg-primary-hover
                    border-white/30
                    border-2
                    text-sm
                  "
                >
                  {viewCardMode ? "List" : "Cards"}
                </button>
              </div>

              {/* Search */}
              <div className="grid grid-cols-3 md:flex md:flex-row gap-2 w-full lg:w-auto">
                {/* Search */}
                <input
                  type="text"
                  value={searchFilters.search}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                  placeholder="Search equipment..."
                  className="
                  w-full lg:w-64
                  px-4 py-2 col-span-3
                  rounded-md
                  bg-white
                  text-gray-800
                  border-2 border-gray-300
                  outline-none
                  focus:border-gray-500
                  "
                />

                {/* Status */}
                <select
                  value={searchFilters.status}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="
                    px-3 py-2
                    rounded-md
                    bg-white text-black
                    text-gray-800
                    border-2 border-gray-300
                    outline-none
                    focus:border-gray-500
                  "
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="borrowed">Borrowed</option>
                  <option value="maintenance">Maintenance</option>
                </select>

                {/* Condition */}
                <select
                  value={searchFilters.condition}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      condition: e.target.value,
                    }))
                  }
                  className="
                    px-3 py-2
                    rounded-md
                    bg-white
                    text-gray-800
                    border-2 border-gray-300
                    outline-none
                    focus:border-gray-500
                  "
                >
                  <option value="">All Conditions</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>

                {/* Search Button */}
                <button
                  onClick={() => {
                    dispatch(
                      getEquipmentSearchAction({
                        ...searchFilters,
                        page: 1,
                      }),
                    );
                  }}
                  className="
                    px-5 py-2
                    rounded-md
                    bg-button text-black
                    border-2 border-white/30
                    hover:bg-primary-hover
                    hover:text-white
                    transition
                  "
                >
                  Search
                </button>
              </div>
            </div>
            <p className="flex justify-start text-sm">
              {pagination.totalUnits} projects
              {searchFilters.search
                ? ` with "${searchFilters.search}" name or location`
                : ""}
              {searchFilters.location
                ? ` with "${searchFilters.condition}" specific location`
                : ""}
              {searchFilters.status
                ? ` with "${searchFilters.status.toUpperCase()}" status`
                : ""}
            </p>

            <div className="flex w-full items-center justify-between mt-2">
              
              <PaginationComponent
                pagination={pagination}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
          <div>
            {equipments.length === 0 ? (
              <div className="p-2 min-h-screen bg-primary/80 flex justify-center items-center w-full">
                <p className="text-gray-500">No Equipments found.</p>
              </div>
            ) : (
              <>
                {/* Mobile / tablet — always cards */}
                <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-2 p-2 min-h-screen bg-surface">
                  {equipments.map((equipment) => (
                    <EquipmentCards key={equipment.id} equipment={equipment} />
                  ))}
                </div>

                {/* Desktop — user can switch views */}
                <div className="hidden lg:block">
                  {viewCardMode ? (
                    <div className="grid grid-cols-1 gap-2 lg:grid-cols-4 p-2 items-start">
                      {equipments.map((equipment) => (
                        <EquipmentCards
                          key={equipment.id}
                          equipment={equipment}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 p-2">
                      {equipments.map((equipment) => (
                        <EquipmentCardList
                          key={equipment.id}
                          equipment={equipment}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/*pagination */}
            <PaginationComponent
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentsPage;
