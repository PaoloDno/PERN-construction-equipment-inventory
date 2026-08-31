
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProjectAction } from "../../store/actions/ProjectThunks";

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
    <div className="flex flex-col w-full min-h-screen">

      {/* Navigation */}
      <div className="flex flex-col w-full p-4">
        <div className="flex flex-row items-center gap-3">
          <Link to="/AddProject">
            Add Project
          </Link>

          <Link to="/projects">
            To Projects
          </Link>
        </div>
      </div>

      {/* Project Details */}
      <div className="flex flex-col w-full p-4">

        {project.image ? (
          <img
            src={`http://localhost:5000${project.image}`}
            alt={project.project_name}
            className="object-cover w-32 h-32"
          />
        ) : (
          <div className="w-32 h-32 flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">
              No Image
            </span>
          </div>
        )}

        <h1>
          {project.project_name} - {project.id}
        </h1>

        <p>
          Location: {project.location}
        </p>

        <p>
          Status: {project.status}
        </p>

        <p>
          Description: {project.description}
        </p>

      </div>

      {/* Equipment Header */}
      <div className="p-4">
        <p>Equipment</p>

        <span>

        <Link to={"/equipments"}>
          To Equipments
        </Link>

        <Link to="/addEquip">
          Add Equipment
        </Link>
        </span>
      </div>

      {/* Active Equipment */}
      <div className="flex flex-col w-full bg-gray-200 p-4">

        <h3 className="text-lg font-semibold mb-4">
          Active Equipment
        </h3>

        {activeEquipment.length === 0 ? (

          <div>
            <p>
              No Active Equipments in the project
            </p>
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">

            {activeEquipment.map((e) => (

              <div
                key={e.id}
                className="bg-white rounded-lg overflow-hidden"
              >

                {/* Image */}
                <div className="w-full h-48 bg-gray-100">

                  {e.image ? (

                    <img
                      src={`http://localhost:5000${e.image}`}
                      alt={e.equipment_name}
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

                {/* Details */}
                <div className="p-4">

                  <div className="flex justify-between items-center">

                    <h3 className="font-semibold">
                      {e.equipment_name}
                    </h3>

                    <span>
                      {e.status}
                    </span>

                  </div>

                  {/* Buttons */}
                  <div className="mt-4">

                    <Link to={`/equipment/${e.equipment_id}`}>
                      View Equipment
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* Equipment History */}
      <div className="p-4">

        <h3 className="text-lg font-semibold mb-4">
          Equipment History
        </h3>

        {equipmentHistory.length === 0 ? (

          <div className="border border-gray-200 rounded-lg p-10 text-center">
            <p className="text-gray-500">
              No equipment history found.
            </p>
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {equipmentHistory.map((e) => (

              <div
                key={e.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >

                <h3 className="font-semibold">
                  {e.equipment_name}
                </h3>

                <p>
                  Status: {e.status}
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default ProjectPage;

