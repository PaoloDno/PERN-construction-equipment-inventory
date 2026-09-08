import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { sanitizeInput } from "../../../components/utils/SanitizeInput";
import { updateProjectAction } from "../../../store/actions/ProjectThunks";

import InputFormComponent from "../../../components/FormInputComponent";
import SelectFormComponent from "../../../components/FormSelectComponent";

const UpdateProjectModal = ({ project, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, role } = useSelector((s) => s.auth);

  const [formError, setFormError] = useState({});

  const [formData, setFormData] = useState({
    project_name: project?.project_name || "",
    description: project?.description || "",
    location: project?.location || "",
    projStatus: project?.status || "planning",
    id: project?.id || "",
  });

  const statusOrder = [
    "planning",
    "active",
    "completed",
  ];

  const getAvailableStatuses = () => {
    const currentStatus = formData.projStatus;

    const currentIndex = statusOrder.indexOf(currentStatus);

    // Unknown status
    if (currentIndex === -1) {
      return [currentStatus];
    }

    // Project is completed.
    // No further changes are allowed.
    if (currentIndex === statusOrder.length - 1) {
      return [currentStatus];
    }

    // Allow the current status and ONLY the next status.
    return [
      currentStatus,
      statusOrder[currentIndex + 1],
    ];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizeInput.sanitize.text(value),
    }));

    setFormError((prev) => ({
      ...prev,
      [name]: "",
      submit: "",
    }));
  };

  const validateInput = (name, value) => {
    /*
      ID does not need text validation.
    */
    if (name === "id") {
      if (!value) {
        return "Invalid project ID";
      }

      return "";
    }

    /*
      Required fields
    */
    if (
      value === undefined ||
      value === null ||
      String(value).trim() === ""
    ) {
      return "This field is required";
    }

    /*
      Text validation
    */
    if (!sanitizeInput.isValid.text(String(value))) {
      console.log("Invalid text input:", name, value);

      return "Invalid Text";
    }

    return "";
  };

  const validateInputs = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateInput(
        key,
        formData[key]
      );

      if (error) {
        newErrors[key] = error;
      }
    });

    /*
      Make sure the status transition is valid.
    */
    const originalStatus = project?.status;
    const newStatus = formData.projStatus;

    const originalIndex =
      statusOrder.indexOf(originalStatus);

    const newIndex =
      statusOrder.indexOf(newStatus);

    /*
      Only allow:

      planning → planning
      planning → active

      active → active
      active → completed

      completed → completed
    */
    if (
      originalIndex !== -1 &&
      newIndex !== -1 &&
      newIndex > originalIndex + 1
    ) {
      newErrors.projStatus =
        "Project status can only move to the next stage.";
    }

    /*
      Never allow going backwards.
    */
    if (
      originalIndex !== -1 &&
      newIndex !== -1 &&
      newIndex < originalIndex
    ) {
      newErrors.projStatus =
        "Project status cannot move backwards.";
    }

    if (Object.keys(newErrors).length > 0) {
      console.log(
        "Form validated unsuccessfully",
        newErrors
      );

      setFormError(newErrors);

      return false;
    }

    console.log("Form validated successfully");

    setFormError({});

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
      Check authentication.
    */
    if (!token) {
      navigate("/login");
      return;
    }

    /*
      Validate form.
    */
    if (!validateInputs()) {
      return;
    }

    const submitData = {
      ...formData,
      id: project.id,
    };

    try {
      const resultAction = await dispatch(
        updateProjectAction(submitData)
      );

      /*
        Check the CORRECT thunk.
      */
      if (
        updateProjectAction.fulfilled.match(
          resultAction
        )
      ) {
        console.log("Project Updated");

        onClose();

        navigate(`/project/${submitData.id}`);

        return;
      }

      /*
        Redux thunk was rejected.
      */
      setFormError({
        submit:
          resultAction.payload ||
          "Failed to update project.",
      });
    } catch (error) {
      console.error(
        "Failed to update project:",
        error
      );

      setFormError({
        submit:
          error?.message ||
          "Failed to update project.",
      });
    }
  };

  /*
    Optional admin-only restriction.

    Uncomment this if only admins should update projects.

    if (role !== "admin") {
      return (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            flex
            items-center
            justify-center
            p-4
          "
        >
          <div
            className="
              bg-white
              rounded-2xl
              p-4
              w-full
              max-w-lg
              min-h-[40vh]
              max-h-[90vh]
              overflow-y-auto
            "
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">
                  Update Project
                </h2>

                <p className="text-sm text-gray-500">
                  {project?.project_name}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="
                  text-gray-600
                  hover:text-gray-700
                  text-xl
                  w-10
                  h-10
                  p-2
                "
              >
                X
              </button>
            </div>

            <div
              className="
                bg-primary
                py-6
                px-3
                rounded-2xl
                w-full
                flex
                flex-col
                items-center
                justify-center
              "
            >
              <p>
                Update project is reserved for admin only.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="
                  px-4
                  py-2
                  bg-gray-800
                  text-white
                  rounded-md
                  hover:bg-gray-700
                  m-2
                "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }
  */

  return (
    <div
      className="
        fixed
        inset-0
        z-40
        bg-black/50
        flex
        items-center
        justify-center
        p-4
      "
    >
      <div
        className="
          bg-white
          rounded-2xl
          p-4
          w-full
          max-w-lg
          max-h-[90vh]
          overflow-y-auto
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">
              Update Project
            </h2>

            <p className="text-sm text-gray-500">
              {project?.project_name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              text-gray-600
              hover:text-gray-700
              text-xl
              w-10
              h-10
              p-2
            "
          >
            X
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <p>
            Fill out the Update REQUEST form
          </p>

          {/* Project Name */}
          <InputFormComponent
            label="Project Name"
            type="text"
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
            error={formError.project_name || ""}
            helper=""
          />

          {/* Description */}
          <InputFormComponent
            label="Description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={formError.description || ""}
            helper=""
          />

          {/* Location */}
          <InputFormComponent
            label="Location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={formError.location || ""}
            helper=""
          />

          {/* Project Status */}
          <SelectFormComponent
            label="Project Status"
            name="projStatus"
            value={formData.projStatus}
            values={getAvailableStatuses()}
            onChange={handleChange}
            error={formError.projStatus || ""}
            helper=""
          />

          {/* Submit Error */}
          {formError.submit && (
            <p className="text-sm text-red-500">
              {formError.submit}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="
              px-4
              py-2
              bg-gray-800
              text-white
              rounded-md
              hover:bg-gray-700
            "
          >
            Update Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProjectModal;