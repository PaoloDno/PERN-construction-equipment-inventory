import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UpdateProjectModal from "../../pages/ProjectPage/component/UpdateProjectModal";

const ProjectCards = ({ key, project }) => {

  const navigate = useNavigate();

  const [isUpdateProjectModalOpen, setIsUpdateProjectModalOpen] =
    useState(false);

  const handleOpenCloseUpdateProjectModal = () => {
    setIsUpdateProjectModalOpen((prev) => !prev);
  };

  return (
    <>
    <div
      key={`${key}${project.id}`}
      className="flex flex-col min-w-[250px] bg-white/50 gap-3 p-2 pb-3 overflow-hidden w-full min-h-[30vh] shadow-2xl rounded-2xl"
    >
      <div className="flex overflow-hidden flex-col w-full min-h-[45vh] py-5 px-2 rounded-2xl bg-gradient-to-br from-cyan-400/40 to-indigo-600/65">
        {project?.image ? (
          <img
            src={`http://localhost:5000${project.image}`}
            alt={project.project_name}
            className="w-full h-[18vh] md:h-[20vh] object-cover"
          />
        ) : (
          <div className="w-full h-[15vh] flex items-center justify-center bg-gray-600">
            <span className="text-gray-400">No Image</span>
          </div>
        )}

        {/** details */}
        <div className="flex flex-col w-full h-fit text-[14px] leading-none py-2">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-gray-800 text-md">
              {project.project_name}
            </h3>
            <span className="grid grid-cols-2 w-full h-fit text-[14px] gap-2 leading-none">
              <span className="flex justify-start items-center py-1">
                status:
              </span>
              <span
                className={`flex items-center justify-center w-[100px] justify-center text-xs px-2 py-1 rounded-md ${
                  project.status === "planning"
                    ? "bg-gray-300 text-black"
                    : project.status === "active"
                      ? "bg-green-500 text-white"
                      : project.status === "completed"
                        ? "bg-blue-500 text-white"
                        : project.status === "onhold"
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-200 text-black"
                }`}
              >
                {project.status}
              </span>
              <span className="flex justify-start items-center">location:</span>
              <span className="flex justify-start items-center p-2 rounded-2xl">
                {project?.location}
              </span>
            </span>
            <span>Description: </span>
            <span className="text-gray-800 text-[13px] italic truncate">
              "{project.description}"
            </span>
          </div>
          <div className="w-full justify-center items-center p-2 flex flex-row">
            <button
              onClick={handleOpenCloseUpdateProjectModal}
              className="w-[120px] flex flex-row justify-center items-center bg-button mx-auto
                    px-3 py-2 border-2 shadow-2xl border-gray-300 rounded-md text-sm hover:bg-primary-hover hover:text-white"
            >
              Update
            </button>
            <button
          onClick={() => navigate(`/project/${project.id}`)}
            
              className="w-[120px] flex flex-row justify-center items-center bg-button mx-auto
                    px-3 py-2 border-2 shadow-2xl border-gray-300 rounded-md text-sm hover:bg-primary-hover hover:text-white"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
    {isUpdateProjectModalOpen && (
        <UpdateProjectModal
          project={project}
          onClose={handleOpenCloseUpdateProjectModal}
        />
      )}
    </>
  );
};

export default ProjectCards;
