import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getProjectsAction,
  getSearchProjectsAction,
} from "../../store/actions/ProjectThunks";
import PaginationComponent from "../../components/utils/PaginationsComponent";
import ProjectCards from "../../components/cards/ProjectCards";
import ProjectsCardList from "../../components/cards/ProjectCardLists";
import { FaPlusCircle } from "react-icons/fa";

const ProjectsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);

  const [viewCardMode, setViewCardMode] = useState(true);

  const { projects, pagination, isPending, isRejected, error } = useSelector(
    (state) => state.project,
  );

  const [searchFilters, setSearchFilters] = useState({
    search: "",
    status: "",
    location: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Get first page
  useEffect(() => {
    if (token) {
      dispatch(getProjectsAction(1));
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

    const { search, status, location } = searchFilters;

    if (!search && !status && !location) {
      dispatch(getProjectsAction(page));
    } else {
      dispatch(
        getSearchProjectsAction({
          page,
          search,
          status,
          location,
        }),
      );
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 h-[15vh] justify-between md:justify-start px-4">
        {/** utilities bar */}

        <div className="flex flex-col px-4 gap-2 text-xl md:text-2xl">
          PROJECTS
        </div>

        <Link
          to="/addProject"
          className="flex flex-row p-2 text-[14px] items-center justify-center gap-2 px-4 py-2 bg-button rounded-md hover:bg-success"
        >
          <FaPlusCircle /> Add Projects
        </Link>
      </div>

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

      {/* Projects */}
      {!isPending && !isRejected && (
        <div className="flex flex-col w-full p-4 bg-primary">
          <div className="flex text-white flex-col w-full justify-start items-start p-2 bg-primary-hover">
            <div className="flex flex-col lg:flex-row w-full gap-3 lg:items-center lg:justify-between">
              {/** Title + View Toggle */}
              <h2 className="text-lg font-medium">Project List</h2>

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

              {/** Search */}

              <div className="grid grid-cols-3 md:flex md:flex-row gap-2 w-full lg:w-auto">
                <input
                  type="text"
                  value={searchFilters.search}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                  placeholder="Search projects..."
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

                <input
                  type="text"
                  value={searchFilters.location}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Search location..."
                  className="
                    px-3 py-2
                    rounded-md
                    bg-white text-black
                    text-gray-800
                    border-2 border-gray-300
                    outline-none
                    focus:border-gray-500
                  "
                />

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
                    text-[13px]
                    rounded-md
                    bg-white text-black
                    text-gray-800
                    border-2 border-gray-300
                    outline-none
                    focus:border-gray-500
                  "
                >
                  <option value="">All Status</option>
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="onhold">OnHold</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => {
                    dispatch(
                      getSearchProjectsAction({
                        ...searchFilters,
                        page: 1,
                      }),
                    );
                  }}
                  className="
                    px-5 py-2
                    text-[13px]
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
            <p className="text-sm">
              {pagination.totalUnits} projects
              {searchFilters.search
                ? ` with "${searchFilters.search}" name or location`
                : ""}
              {searchFilters.location
                ? ` with "${searchFilters.location}" specific location`
                : ""}
              {searchFilters.status
                ? ` with "${searchFilters.status.toUpperCase()}" status`
                : ""}
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="border border-gray-200 rounded-lg p-10 text-center">
              <p className="text-gray-500">No projects found.</p>
            </div>
          ) : (
            <>
              <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-2 p-2 min-h-screen rounded-2xl bg-surface/40">
                {projects.map((project) => (
                  <ProjectCards key={project.id} project={project} />
                ))}
              </div>

              <div className="hidden lg:block">
                {viewCardMode ? (
                  <div className="grid grid-cols-1 gap-2 lg:grid-cols-4 p-2 items-start">
                    {projects.map((project, index) => (
                      <ProjectCards key={index} project={project} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 p-2 min-h-screen rounded-2xl bg-surface/40">
                    {projects.map((project, index) => (
                      <ProjectsCardList key={index} project={project} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <PaginationComponent
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
