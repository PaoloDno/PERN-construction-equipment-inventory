import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SelectFormComponent from "../../../components/FormSelectComponent";
import { sanitizeInput } from "../../../components/utils/SanitizeInput";
import { returnEquipmentAction } from "../../../store/actions/EquipmentThunks";

const ReturnedEquipmentModal = ({ equipment, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("sadasdas");

  const { token } = useSelector((state) => state.auth);

  const [formError, setFormError] = useState({});

  const [formData, setFormData] = useState({
    condition: "",
    image: null,
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  }, [dispatch, token, navigate]);

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

    // validation
    if (!value || value.trim() === "") {
      return "This field is required";
    }

    if (!sanitizeInput.isValid.text(value)) {
      return "Invalid text";
    }

    return "";
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

    setFormError({});
    if (validateInputs()) {
      try {
        console.log("ASdasdas");

        const resultAction = await dispatch(returnEquipmentAction(submitData));

        if (returnEquipmentAction.fulfilled.match(resultAction)) {
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
    }
  };
  return (
    <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-4 py-4 w-full max-w-lg max-h-[90vh] overflow-auto">
        <div
          className="
            flex
            w-full
            justify-between
            items-center
            mb-6 p-2 px-4
          "
        >
          <div>
            <h2 className="text-xl font-bold">Return Equipment</h2>

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
              hover:bg-gray-400
            "
          >
            X
          </button>
        </div>

        <form className="py-4 px-2 flex gap-2 w-full flex-col min-h-[70vh]  bg-primary-hover/15 rounded-2xl shadow-2xl">
          <p className="text-[18px] text-gray-500">
            Fill out the return request form.
          </p>

          <SelectFormComponent
            label="Condition"
            name="condition"
            value={formData.condition}
            values={["excellent", "good", "fair", "poor"]}
            onChange={handleChange}
            error={formError.condition}
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

          <div
            className="
              flex
              justify-end
              gap-3
              pt-4
              mt-auto
              w-full
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
              onClick={handleSubmit}
              className="
                px-4
                py-2
                bg-gray-800
                text-white
                rounded-md
                hover:bg-gray-700
              "
              >
              Return Equipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnedEquipmentModal;
