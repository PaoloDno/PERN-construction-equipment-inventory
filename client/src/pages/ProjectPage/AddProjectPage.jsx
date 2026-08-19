import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sanitizeInput } from "../../components/utils/SanitizeInput";
import { useNavigate } from "react-router-dom";
import { createProjectAction } from "../../store/actions/ProjectThunks";
import InputFormComponent from "../../components/FormInputComponent";
import SelectFormComponent from "../../components/FormSelectComponent";

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
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex flex-col">ADD a PROJECT</div>
      <div className="">
        <form onSubmit={handleSubmit}>
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
          <SelectFormComponent
            label="Status"
            name="status"
            value={formData.status}
            values={["planning", "active", "completed", "onhold", "cancelled"]}
            onChange={handleChange}
            error={formError.status}
            helper=""
          />
          {/* Image Upload */}
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-gray-700 font-bold mb-2"
            >
              Equipment Image
            </label>

            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />

            {formError.image && (
              <p className="mt-1 text-sm text-red-500">{formError.image}</p>
            )}
          </div>
          {/* Image Preview */}
          {formData.image && (
            <div className="mb-6">
              <p className="text-gray-700 font-bold mb-2">Image Preview</p>

              <img
                src={URL.createObjectURL(formData.image)}
                alt="Equipment preview"
                className="h-48 w-full object-cover rounded-md border"
              />
            </div>
          )}
          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Add Equipment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProjectPage;
