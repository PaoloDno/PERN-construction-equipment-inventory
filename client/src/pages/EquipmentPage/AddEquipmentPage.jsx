import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import InputFormComponent from "../../components/FormInputComponent.jsx";
import SelectFormComponent from "../../components/FormSelectComponent.jsx";
import { sanitizeInput } from "../../components/utils/SanitizeInput.jsx";
import { createEquipmentAction } from "../../store/actions/EquipmentThunks.jsx";
import { FaBackward } from "react-icons/fa";

const AddEquipmentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    equipment_name: "",
    category: "",
    condition: "good",
    serial_number: "",
    note: "",
    status: "Available",
    image: null,
  });

  const [formError, setFormError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizeInput.sanitize.text(value),
    }));

    // Remove error when user changes the field
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

    // validation
    if (!value || value.trim() === "") {
      return "This field is required";
    }

    switch (name) {
      case "equipment_name":
      case "serial_number":
      case "note":
        return sanitizeInput.isValid.text(value) ? "" : "Invalid text";

      default:
        return "";
    }
  };

  const validateInputs = () => {
    let newErrors = {};

    Object.keys(formData).forEach((key) => {
      const newError = validateInput(key, formData[key]);

      if (newError) {
        newErrors[key] = newError;
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
        const resultAction = await dispatch(createEquipmentAction(formData));

        if (createEquipmentAction.fulfilled.match(resultAction)) {
          console.log("equipment added");
          navigate("/home");
        }
      } catch (error) {
        console.log(error);
      }

      console.log("Equipment:", formData);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen p-6 gap-6 items-center justify-center">
      <div className="fixed inset-0 -z-10 min-h-screen w-full bg-gradient-to-br from-blue-300/80 via-indigo-500 to-purple-600 opacity-70" />

      <button
        onClick={() => navigate("/equipments")}
        className="flex hover:underline flex-row text-md lg:text-2xl text-white items-center gap-2 h-[10vh] lg:h-[12vh] bg-primary-hover/70 w-full max-w-3xl justify-between md:justify-start px-4"
      >
        <FaBackward size={24} />
        <span>Go back to Projects Page</span>
      </button>

      <div className="flex flex-col border border-gray-700/80 rounded-lg p-6 w-full max-w-3xl bg-white/70 gap-2">
        <div className=" text-md lg:text-2xl">ADD an Equipment</div>

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
            {/* Equipment Name */}
            <InputFormComponent
              label="Equipment Name"
              type="text"
              name="equipment_name"
              value={formData.equipment_name}
              onChange={handleChange}
              error={formError.equipment_name}
              helper=""
            />

            {/* Category */}

            {/* Serial Number */}
            <InputFormComponent
              label="Serial Number"
              type="text"
              name="serial_number"
              value={formData.serial_number}
              onChange={handleChange}
              error={formError.serial_number}
              helper=""
            />

            {/* Note */}
            <InputFormComponent
              label="Note"
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
              error={formError.note}
              helper=""
            />
          </span>
          <span className="w-full md:w-1/2 gap-3 flex flex-col">
            {/* Status */}
            <SelectFormComponent
              label="Status"
              name="status"
              value={formData.status}
              values={["available", "borrowed", "maintenance", "retire"]}
              onChange={handleChange}
              error={formError.status}
              helper=""
            />

            <SelectFormComponent
              label="Category"
              name="category"
              value={formData.category}
              values={["Heavy Equipment", "Power Tools", "Hand Tools"]}
              onChange={handleChange}
              error={formError.category}
              helper=""
            />

            {/* Condition */}
            <SelectFormComponent
              label="Condition"
              name="condition"
              value={formData.condition}
              values={["excellent", "good", "fair", "poor"]}
              onChange={handleChange}
              error={formError.condition}
              helper=""
            />
          </span>
          <span className="flex w-full items-center justify-center mt-8">
            {/* Submit */}
            <button
              type="submit"
              className="min-w-[120px] w-fit  bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Add Equipment
            </button>
          </span>
        </form>
      </div>
    </div>
  );
};

export default AddEquipmentPage;
