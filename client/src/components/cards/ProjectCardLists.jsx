import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UpdateProjectModal from "../../pages/ProjectPage/component/UpdateProjectModal";

const ProjectsCardList = ({ key, project }) => {
  const navigate = useNavigate();

  const [isUpdateProjectModalOpen, setIsUpdateProjectModalOpen] =
    useState(false);

  const handleOpenCloseUpdateProjectModal = () => {
    setIsUpdateProjectModalOpen((prev) => !prev);
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
        bg-white/60
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
          flex items-center justify-center">
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
        <div className="w-1/5 min-w-0">
          <h3>{project.project_name}</h3>
          <span className="text-sm text-gray-600">{project.location}</span>
        </div>

        
        <div className="w-1/5 min-w-0">
          <h3>Project Status:</h3>
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
        </div>

        <button
          onClick={handleOpenCloseUpdateProjectModal}
          className="
              px-3 py-2
              border-2 border-gray-300
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

        <button
          onClick={() => navigate(`/project/${project.id}`)}
          className="
              px-3 py-2
              border-2 border-gray-300
              rounded-md
              text-sm
              bg-button/60
              w-[120px]
              hover:bg-primary-hover
              hover:text-white
            "
        >
          View
        </button>
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

export default ProjectsCardList;
