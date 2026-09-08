import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { sanitizeInput } from "../../../components/utils/SanitizeInput";

import { borrowEquipmentAction } from "../../../store/actions/EquipmentThunks";

import { searchNameProjectAction } from "../../../store/actions/ProjectThunks";

import InputFormComponent from "../../../components/FormInputComponent";
import SelectFormComponent from "../../../components/FormSelectComponent";

const BorrowEquipmentModal = ({ equipment, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // AUTH

  const { token } = useSelector((state) => state.auth);

  // PROJECTS

  const { projectsName, isPending } = useSelector((s) => s.project);

  // FORM ERRORS

  const [formError, setFormError] = useState({});

  // FORM DATA

  const [formData, setFormData] = useState({
    project_id: "",
    condition: "",
    note: "",
    image: null,
  });

  // PROJECT SEARCH

  const [projectSearch, setProjectSearch] = useState("");

  // FETCH PROJECTS

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Load initial projects
    dispatch(searchNameProjectAction(""));
  }, [dispatch, token, navigate]);

  // SEARCH PROJECTS

  useEffect(() => {
    if (!token) {
      return;
    }

    const timeout = setTimeout(() => {
      dispatch(searchNameProjectAction(projectSearch));
    }, 1300);

    return () => clearTimeout(timeout);
  }, [projectSearch, dispatch, token]);

  // INPUT CHANGE

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

  // IMAGE CHANGE

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFormError((prev) => ({
        ...prev,
        image: "Please select an image file.",
      }));

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError((prev) => ({
        ...prev,
        image: "Image must be smaller than 5MB.",
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

  // VALIDATION

  const validateInput = (name, value) => {
    // IMAGE
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

    // REQUIRED
    if (!value || value.trim() === "") {
      return "This field is required";
    }

    // TEXT VALIDATION
    if (!sanitizeInput.isValid.text(value)) {
      console.log("Invalid text input:", name, value);
      return "Invalid Text";
    }

    return "";
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
      console.log("Form validated unsuccessfully", newErrors);

      setFormError(newErrors);

      return false;
    }

    console.log("Form validated successfully");

    setFormError({});

    return true;
  };

  // SUBMIT

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Authentication
    if (!token) {
      navigate("/login");
      return;
    }

    // Add authenticated user
    const submitData = {
      ...formData,
      user_id: equipment?.created_by,
      id: equipment.id,
    };

    // Validate
    if (!validateInputs()) {
      console.log("invalidated inputes");
      console.log("equipment", equipment);
      console.log("submitData", submitData);
      return;
    }

    try {
      console.log("Submitting borrow request:", submitData);
      const resultAction = await dispatch(borrowEquipmentAction(submitData));

      if (borrowEquipmentAction.fulfilled.match(resultAction)) {
        console.log("Equipment borrowed successfully");
        // Close modal after success
        onClose();

        // Optional: go back to equipment page
        // navigate(`/equipment/${equipment.id}`);
      } else {
        setFormError({
          submit: resultAction.payload || "Failed to borrow equipment.",
        });
      }
    } catch (error) {
      console.error("Borrow equipment error:", error);

      setFormError({
        submit: "Something went wrong while borrowing equipment.",
      });
    } finally {
      navigate(`/equipment/${submitData.id}`);
    }
  };

  // RENDER
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
          p-6
          w-full
          max-w-lg
          max-h-[90vh]
          overflow-y-auto
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            justify-between
            items-center
            mb-6
          "
        >
          <div>
            <h2 className="text-xl font-bold">Borrow Equipment</h2>

            <p className="text-sm text-gray-500">{equipment?.equipment_name}</p>
          </div>

          <button
              type="button"
              onClick={onClose}
              className="
              text-gray-700
              hover:text-gray-800
              text-xl
              w-10 h-10
              bg-warning/60 rounded-full
            "
            >
              X
            </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 p-2 py-4 shadow-2xl bg-primary-hover/15 rounded-2xl"
        >
          <p className="text-sm text-gray-500">
            Fill out the borrowing request form.
          </p>

          {/* PROJECT SEARCH */}

          <div className="flex flex-row gap-2 w-full">
            {/* Search */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Search Project
              </label>

              <input
                type="text"
                value={projectSearch}
                onChange={(e) => {
                  setProjectSearch(sanitizeInput.sanitize.text(e.target.value));
                }}
                placeholder="Search..."
                className="
                  w-full
                  px-3 py-2
                  border border-gray-300
                  rounded-md
                  outline-none
                  focus:border-gray-500
                "
              />
            </div>

            {/* Project */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Project
              </label>

              <select
                name="project_id"
                value={formData.project_id}
                onChange={handleChange}
                className="
                  w-full
                  px-3 py-2
                  border border-gray-300
                  rounded-md
                  bg-white
                  outline-none
                  focus:border-gray-500
                "
              >
                <option value="">Select project</option>

                {projectsName.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.project_name}
                  </option>
                ))}
              </select>

              {isPending && (
                <p className="text-[14px] scale-80 text-gray-500 mt-1">
                  Loading projects...
                </p>
              )}

              {formError.project_id && (
                <p className="text-[14px] scale-80 text-red-500 mt-1">
                  {formError.project_id}
                </p>
              )}
            </div>
          </div>

          {/* CONDITION */}

          <SelectFormComponent
            label="Condition"
            name="condition"
            value={formData.condition}
            values={["excellent", "good", "fair", "poor"]}
            onChange={handleChange}
            error={formError.condition}
            helper=""
          />

          {/* NOTE */}

          <InputFormComponent
            label="Note"
            type="text"
            name="note"
            value={formData.note}
            onChange={handleChange}
            error={formError.note}
            helper="Optional note about the equipment"
          />

          {/* IMAGE */}

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
            <div className="mb-6">
              <p className="text-gray-700 font-bold mb-2">Image Preview</p>

          {formData.image ? (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Equipment preview"
                className="h-48 w-full object-cover rounded-md border"
              />
          ): (
            <div className="flex w-full h-48 items-center justify-center border-2 border-black">
              No Image
            </div>
          )}
            </div>
          {/* BUTTONS */}

          <div
            className="
              flex
              justify-end
              gap-3
              pt-4
            "
          >
            <button
              type="button"
              onClick={onClose}
              className="
                px-4
                py-2
                border
                bg-white
                min-w-[120px]
                border-gray-300
                rounded-md
                hover:bg-gray-100
              "
            >
              Cancel
            </button>

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
              Borrow Equipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowEquipmentModal;
