const SelectFormComponent = ({
  label,
  name,
  value,
  values,
  onChange,
  error,
  helper,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-gray-700 font-bold mb-2"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-md outline-none ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      >
        <option value="">Select {label}</option>

        {values.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}

      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helper}
        </p>
      )}
    </div>
  );
};

export default SelectFormComponent;