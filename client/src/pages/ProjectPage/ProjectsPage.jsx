import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate} from "react-router-dom";
import { getProjectsAction } from "../../store/actions/ProjectThunks";

const ProjectsPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);

  const {
    projects,
    pagination,
    isPending,
    isRejected,
    error,
  } = useSelector((state) => state.project);

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

    dispatch(getProjectsAction(page));
  };

  return (
    <div className="flex flex-col w-full min-h-screen">

      {/* Header */}
      <div className="flex flex-col w-full p-4 gap-2">

        <div className="flex justify-between items-center">

          <h1 className="text-2xl font-semibold">
            Projects
          </h1>

          <Link
            to="/AddProject"
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            Add Project
          </Link>

        </div>

      </div>


      {isPending && (
        <div className="flex justify-center items-center p-10">
          <p className="text-gray-500">
            Loading...
          </p>
        </div>
      )}

      {/* Error */}
      {isRejected && (
        <div className="p-4">
          <p className="text-red-500">
            {error || "Failed to load projects."}
          </p>
        </div>
      )}

      {/* Projects */}
      {(!isPending && !isRejected) && (
        <div className="flex flex-col w-full p-4">

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-lg font-medium">
              Project List
            </h2>

            <p className="text-sm text-gray-500">
              {pagination.totalProjects} projects
            </p>

          </div>


          {projects.length === 0 ? (

            <div className="border border-gray-200 rounded-lg p-10 text-center">
              <p className="text-gray-500">
                No projects found.
              </p>
            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              a
              {projects.map((project) => (

                <div
                  key={project.id}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                >

                  {/* Image */}
                  <div className="w-full h-48 bg-gray-100">

                    {project.image ? (

                      <img
                        src={`http://localhost:5000${project.image}`}
                        alt={project.project_name}
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">
                          No Image
                        </span>
                      </div>

                    )}

                  </div>


                  {/* Project information */}
                  <div className="p-4">

                    <div className="flex justify-between items-start gap-2">

                      <h3 className="font-semibold text-gray-800">
                        {project.project_name}
                      </h3>

                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {project.status}
                      </span>

                    </div>


                    <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                      {project.description || "No description"}
                    </p>


                    <div className="mt-4">

                      <p className="text-xs text-gray-400">
                        LOCATION
                      </p>

                      <p className="text-sm text-gray-700">
                        {project.location || "No location"}
                      </p>

                    </div>


                    <div className="mt-3">

                      <p className="text-xs text-gray-400">
                        CREATED BY
                      </p>

                      <p className="text-sm text-gray-700">
                        {project.username}
                      </p>

                    </div>


                    <button
                      onClick={() => navigate(`/project/${project.id}`)}
                      className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
                    >
                      View Project
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}


          {/* Pagination */}
          {pagination.totalPages > 1 && (

            <div className="flex justify-center items-center gap-2 mt-8">

              {/* Previous */}
              <button
                onClick={() =>
                  handlePageChange(
                    pagination.currentPage - 1
                  )
                }
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>


              {/* Page numbers */}
              {Array.from(
                {
                  length: pagination.totalPages,
                },
                (_, index) => index + 1
              ).map((page) => (

                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`
                    w-9 h-9 rounded-md text-sm
                    ${
                      pagination.currentPage === page
                        ? "bg-gray-800 text-white"
                        : "border border-gray-300 hover:bg-gray-100"
                    }
                  `}
                >
                  {page}
                </button>

              ))}


              {/* Next */}
              <button
                onClick={() =>
                  handlePageChange(
                    pagination.currentPage + 1
                  )
                }
                disabled={
                  pagination.currentPage ===
                  pagination.totalPages
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>

            </div>

          )}

        </div>
      )} 

    </div>
  );
};

export default ProjectsPage;