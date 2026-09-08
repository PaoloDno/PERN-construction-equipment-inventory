import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaBackward } from "react-icons/fa";

import { getProjectAction } from "../../store/actions/ProjectThunks";
import UpdateProjectModal from "./component/UpdateProjectModal";

const ProjectPage = () => {
  const { projectId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

  const {
    project,
    activeEquipment,
    equipmentHistory,
    isPending,
    isRejected,
    error,
  } = useSelector((state) => state.project);

  const [isUpdateProjectModalOpen, setIsUpdateProjectModalOpen] =
    useState(false);

  const handleOpenCloseUpdateProjectModal = () => {
    setIsUpdateProjectModalOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!projectId) {
      return;
    }

    dispatch(getProjectAction(projectId));
  }, [dispatch, token, projectId, navigate]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center p-10">
        <p className="text-gray-500">Loading project...</p>
      </div>
    );
  }

  if (isRejected || error) {
    return (
      <div className="flex justify-center items-center p-10">
        <p className="text-red-500">
          ERROR: {error || "Failed to load project."}
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center p-10">
        <p className="text-gray-500">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen p-6 gap-6 items-center justify-center">
      <div className="fixed inset-0 -z-10 min-h-screen w-full bg-gradient-to-br from-blue-300/80 via-indigo-500 to-purple-600 opacity-70" />

      {/* Back Button */}
      <button
        onClick={() => navigate("/projects")}
        className="
          flex
          hover:underline
          flex-row
          text-md
          lg:text-2xl
          text-white
          items-center
          gap-2
          h-[10vh]
          lg:h-[12vh]
          bg-primary-hover/70
          w-full
          max-w-3xl
          justify-between
          md:justify-start
          px-4
        "
      >
        <FaBackward size={24} />

        <span>Go back to Projects Page</span>
      </button>

      {/* Project Details */}
      <div
        className="
          grid
          col-span-1
          md:grid-cols-2
          border
          rounded-lg
          p-6
          w-full
          max-w-3xl
          bg-white/70
          gap-4
        "
      >
        {/* Project Image */}
        <div
          className="
            w-full
            h-full
            min-h-[200px]
            shrink-0
            overflow-hidden
            rounded-md
            bg-black/10
            flex
            items-center
            justify-center
          "
        >
          {project.image ? (
            <img
              src={`http://localhost:5000${project.image}`}
              alt={project.project_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-600">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>

        {/* Project Information */}
        <div className="flex flex-col gap-3">
          <h1 className="font-semibold">
            Project Name: {project.project_name} - {project.id}
          </h1>

          <p>Location: {project.location}</p>

          <div className="flex items-center gap-2">
            <h3>Project Status:</h3>

            <span
              className={`
                flex
                items-center
                justify-center
                w-[100px]
                text-xs
                px-2
                py-1
                rounded-md
                ${
                  project.status === "planning"
                    ? "bg-gray-300 text-black"
                    : project.status === "active"
                      ? "bg-green-500 text-white"
                      : project.status === "completed"
                        ? "bg-blue-500 text-white"
                        : project.status === "onhold"
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-200 text-black"
                }
              `}
            >
              {project.status}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="col-span-2">
          <p>Description:</p>

          <p className="italic text-[13px] w-full">"{project.description}"</p>
        </div>

        {/* Update */}
        <div>
          <button
            onClick={handleOpenCloseUpdateProjectModal}
            className="
              px-3
              py-2
              border-2
              border-gray-300
              rounded-md
              text-sm
              bg-button/60
              w-[120px]
              hover:bg-primary-hover
              hover:text-white
            "
          >
            Update
          </button>
        </div>
      </div>

      {/* Equipment */}
      <div
        className="
          flex
          flex-col
          gap-4
          border
          rounded-lg
          p-6
          w-full
          max-w-3xl
          bg-white/70
          min-h-[25vh]
        "
      >
        {/* Equipment Header */}
        <div
          className="
            flex
            flex-col
            md:flex-row
            p-3
            bg-primary-hover
            text-white
            w-full
            items-center
            gap-2
          "
        >
          <h1 className="mr-auto">Equipment</h1>

          <div className="flex flex-col md:flex-row gap-2">
            <Link
              className="
                w-[120px]
                p-1
                px-2
                py-2
                bg-button
                text-black
                my-1
                rounded-md
                hover:bg-primary-hover
                hover:text-white
                text-center
              "
              to="/equipments"
            >
              To Equipments
            </Link>

            <Link
              className="
                w-[120px]
                p-1
                px-2
                py-2
                bg-button
                text-black
                my-1
                rounded-md
                hover:bg-primary-hover
                hover:text-white
                text-center
              "
              to="/addEquip"
            >
              Add Equipment
            </Link>
          </div>
        </div>

        {/* Active Equipment */}
        <h3 className="text-lg font-semibold">Active Equipment</h3>

        <div className="flex flex-col w-full bg-gray-400/70 p-2 pb-6">
          {activeEquipment.length === 0 ? (
            <div className="p-3">
              <p>No Active Equipments in the project</p>
            </div>
          ) : (
            <div className="flex flex-col w-full gap-2">
              {activeEquipment.map((e) => (
                <div
                  key={e.id}
                  className="
                    flex
                    flex-col
                    lg:flex-row
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
                  <div className="w-24 h-24 shrink-0 bg-gray-100">
                    {e.image ? (
                      <img
                        src={`http://localhost:5000${e.image}`}
                        alt={e.equipment_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="w-full lg:w-1/5">
                    <h3 className="font-semibold">{e.equipment_name}</h3>

                    <div className="mt-4 hidden lg:flex">
                      <Link
                        className="
                          px-3
                          py-2
                          border-2
                          border-gray-300
                          rounded-md
                          text-sm
                          bg-button
                          hover:bg-primary-hover
                          hover:text-white
                          flex
                          w-[120px]
                          justify-center
                          items-center
                        "
                        to={`/equipment/${e.equipment_id}`}
                      >
                        View Equipment
                      </Link>
                    </div>
                  </div>

                  {/* Status */}
                  <div
                    className="
                    w-full  
                    lg:w-1/5
                      p-2
                      flex
                      flex-col
                      gap-2
                      justify-center
                      items-center
                      bg-primary-hover/40
                    "
                  >
                    <span className="flex items-center justify-start py-1">
                      Status:
                    </span>

                    <span
                      className={`
                        flex
                        w-full
                        justify-center
                        text-xs
                        px-2
                        py-1
                        ${
                          e.status === "available"
                            ? "text-success"
                            : e.status === "borrowed"
                              ? "text-white"
                              : e.status === "retire"
                                ? "text-danger"
                                : e.status === "maintenance"
                                  ? "text-yellow-500"
                                  : "text-black"
                        }
                      `}
                    >
                      {e.status}
                    </span>
                  </div>
                  <span className="flex w-full lg:hidden">
                    <Link
                      className="
                          px-3
                          py-2
                          border-2
                          border-gray-300
                          rounded-md
                          text-sm
                          bg-button
                          hover:bg-primary-hover
                          hover:text-white
                          flex
                          w-[120px]
                          justify-center
                          items-center
                        "
                      to={`/equipment/${e.equipment_id}`}
                    >
                      View Equipment
                    </Link>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Equipment History */}
        <h3 className="text-lg font-semibold">Equipment History</h3>

        <div className="flex flex-col w-full bg-gray-400/70 p-2">
          {equipmentHistory.length === 0 ? (
            <div className="p-3">
              <p>No equipment history found.</p>
            </div>
          ) : (
            <div className="flex flex-col w-full gap-2">
              {equipmentHistory.map((e) => (
                <div
                  key={e.id}
                  className="
                    flex
                    flex-col
                    lg:flex-row
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
                  <div className="w-24 h-24 shrink-0 bg-gray-100">
                    {e.image ? (
                      <img
                        src={`http://localhost:5000${e.image}`}
                        alt={e.equipment_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-col w-full lg:w-1/5">
                    <h3 className="font-semibold">{e.equipment_name}</h3>

                    <div className="mt-4 hidden lg:flex ">
                      <Link
                        className="
                          px-3
                          py-2
                          border-2
                          border-gray-300
                          rounded-md
                          text-sm
                          bg-button
                          hover:bg-primary-hover
                          hover:text-white
                          flex
                          w-[120px]
                          justify-center
                          items-center
                        "
                        to={`/equipment/${e.equipment_id}`}
                      >
                        View Equipment
                      </Link>
                    </div>
                  </div>

                  {/* Status */}
                  <div
                    className="
                    w-full  
                    lg:w-1/5
                      p-2
                      flex
                      flex-col
                      gap-2
                      justify-center
                      items-center
                      bg-primary-hover/40
                    "
                  >
                    <span className="flex items-center justify-start py-1">
                      Status:
                    </span>

                    <span
                      className={`
                        flex
                        w-full
                        justify-center
                        text-xs
                        px-2
                        py-1
                        ${
                          e.status === "available"
                            ? "text-success"
                            : e.status === "borrowed"
                              ? "text-white"
                              : e.status === "retire"
                                ? "text-danger"
                                : e.status === "maintenance"
                                  ? "text-yellow-500"
                                  : "text-black"
                        }
                      `}
                    >
                      {e.status}
                    </span>
                  </div>
                  <span className="flex w-full lg:hidden">
                    <Link
                      className="
                          px-3
                          py-2
                          border-2
                          border-gray-300
                          rounded-md
                          text-sm
                          bg-button
                          hover:bg-primary-hover
                          hover:text-white
                          flex
                          w-[120px]
                          justify-center
                          items-center
                        "
                      to={`/equipment/${e.equipment_id}`}
                    >
                      View Equipment
                    </Link>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Update Project Modal */}
      {isUpdateProjectModalOpen && (
        <UpdateProjectModal
          project={project}
          onClose={handleOpenCloseUpdateProjectModal}
        />
      )}
    </div>
  );
};

export default ProjectPage;
