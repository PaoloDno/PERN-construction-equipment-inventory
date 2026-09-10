import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sanitizeInput } from "../../components/utils/SanitizeInput";
import { useNavigate } from "react-router-dom";
import { createProjectAction } from "../../store/actions/ProjectThunks";
import InputFormComponent from "../../components/FormInputComponent";
import SelectFormComponent from "../../components/FormSelectComponent";
import { FaBackward } from "react-icons/fa";

const AddProjectPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((s) => s.auth);
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  const { user } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
    location: "",
    status: "",
    image: null,
  });

  const [formError, setFormError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizeInput.sanitize.text(value),
    }));

    setFormError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Optional: restrict image types
    if (!file.type.startsWith("image/")) {
      setFormError((prev) => ({
        ...prev,
        image: "Please select an image file.",
      }));
      return;
    }

    // Optional: limit image size to 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setFormError((prev) => ({
        ...prev,
        image: "Image must be smaller than 5 MB.",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setFormError((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const validateInput = (name, value) => {
    if (name === "image") {
      if (!value) {
        return "Image is required";
      }

      if (!value.type.startsWith("image/")) {
        return "Please select a valid image";
      }

      if (value.size > 5 * 1024 * 1024) {
        return "Image must be smaller than 5MB";
      }

      return "";
    }

    if (!value || value.trim() === "") {
      return "This field is required";
    }

    switch (name) {
      case "project_name":
      case "description":
      case "location":
      case "status":
        return sanitizeInput.isValid.text(value) ? "" : "Invalid Text";

      default:
        return "";
    }
  };

  const validateInputs = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateInput(key, formData[key]);

      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setFormError(newErrors);
      return false;
    }

    setFormError({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    setFormError({});
    if (validateInputs()) {
      try {
        const resultAction = await dispatch(createProjectAction(formData));

        if (createProjectAction.fulfilled.match(resultAction)) {
          console.log("Project added");
          navigate("/home");
        } else {
          console.log("Failed to add project");
        }
      } catch (error) {
        console.log(error);
      }
      console.log("Project:", formData);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen p-6 gap-6 items-center justify-center">
      <div className="fixed inset-0 -z-10 min-h-screen w-full bg-gradient-to-br from-blue-300/80 via-indigo-500 to-purple-600 opacity-70" />

      <button
        onClick={() => navigate("/projects")}
        className="flex hover:underline flex-row text-md lg:text-2xl text-white items-center gap-2 h-[10vh] lg:h-[12vh] bg-primary-hover/70 w-full max-w-3xl justify-between md:justify-start px-4"
      >
        <FaBackward size={24} />
        <span>Go back to Projects Page</span>
      </button>

      <div className="flex flex-col border border-gray-700/80 rounded-lg p-6 w-full max-w-3xl bg-white/70 gap-2">
        <div className=" text-md lg:text-2xl">ADD a PROJECT</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <span>
            <label
              htmlFor="image"
              className="block text-gray-700 font-bold mb-2"
            >
              Project Image
            </label>

            <span className="flex flex-col-reverse gap-1 md:grid md:grid-cols-2">
              <div className="flex flex-row mb-4 items-start justify-start">
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="px-3 py-1  rounded-md border-2 border-black bg-gray-400/40"
                />

                {formError.image && (
                  <p className="mt-1 text-sm text-red-500">{formError.image}</p>
                )}
              </div>
              {/* Image Preview */}
              <div className="flex mx-auto h-48 w-48 border-2 border-black/40 items-center justify-center">
                {formData.image ? (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Equipment preview"
                    className="h-48 w-full object-cover rounded-md border"
                  />
                ) : (
                  <p className="text-gray-700 font-bold mb-2">Image Preview</p>
                )}
              </div>
            </span>
          </span>
          <h3>Project Details</h3>
          <span className="flex flex-col md:grid md:grid-cols-2 gap-2">
            <InputFormComponent
              label="Project Name"
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              error={formError.project_name}
              helper=""
            />
            <InputFormComponent
              label="Description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={formError.description}
              helper=""
            />
            <InputFormComponent
              label="Location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={formError.location}
              helper=""
            />
          </span>
          <span className="my-4 w-full lg:w-1/2 gap-2">
            <SelectFormComponent
              label="Status"
              name="status"
              value={formData.status}
              values={[
                "planning",
                "active",
                "completed",
                "onhold",
                "cancelled",
              ]}
              onChange={handleChange}
              error={formError.status}
              helper=""
            />
          </span>
          {/* Image Upload */}
          <span className="flex w-full items-center justify-center mt-8">
            {/* Submit */}
            <button
              type="submit"
              className="min-w-[120px] w-fit  bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Add Project
            </button>
          </span>
        </form>
      </div>
    </div>
  );
};

export default AddProjectPage;
