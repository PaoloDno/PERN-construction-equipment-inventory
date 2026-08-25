import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

const ProjectPage = (props) => {
  
  const {projectId} = useParams();
  // project is inside projects

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const {
    projects,
    isPending,
    isRejected,
    error,
  } = useSelector((s) => s.project);

  const project = projects?.find(
  (project) => String(project.id) === String(projectId)
  );

  console.log("project", project);
  
  useEffect(() => {
      if (!token) {
        navigate("/login");
      }
    }, [token, navigate]);
  
  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex flex-col w-full p-4">
        <div className="flex flex-row w-full items-center object-center gap-3">
        <Link to="/AddProject">
          Add Project
        </Link>
        <Link to="/projects">
          To Projects
        </Link>
        </div>
      </div>
      <div className="flex flex-col w-full p-4">
        {project.image ? (

                      <img
                        src={`http://localhost:5000${project.image}`}
                        alt={project.project_name}
                        className="object-cover w-32 h-32"
                      />

                    ) : (

                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">
                          No Image
                        </span>
                      </div>

                    )}
        <h1>{project.project_name} - {project.id}</h1>
        <p>Location: {project.location}</p>
        <p>Status: {project.status}</p>
        <p>Description: {project.description}</p>
      </div>
      <div>
        Equipment
        <Link to="/addEquip">Add Equipment</Link>
      </div>
    </div>
  )
};

export default ProjectPage;
