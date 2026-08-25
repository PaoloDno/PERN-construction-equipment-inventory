import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import InputFormComponent from "../../components/FormInputComponent.jsx";
import SelectFormComponent from "../../components/FormSelectComponent.jsx";
import { sanitizeInput } from "../../components/utils/SanitizeInput.jsx";
import { createEquipmentAction } from "../../store/actions/EquipmentThunks.jsx";

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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Equipment</h1>

      <form onSubmit={handleSubmit}>
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
        <SelectFormComponent
          label="Category"
          name="category"
          value={formData.category}
          values={["Heavy Equipment", "Power Tools", "Hand Tools"]}
          onChange={handleChange}
          error={formError.category}
          helper=""
        />

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

        {/* Image Upload */}
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 font-bold mb-2">
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
  );
};

export default AddEquipmentPage;