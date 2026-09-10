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
    <div className="flex flex-col justify-center items-start p-2 w-full rounded-md bg-primary/30">
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
        className={`w-full bg-primary/75 rounded-md text-[16px] p-2 ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      >
        <option value="">Select {label}</option>

        {values.map((item, index) => {
          const optionValue =
            typeof item === "object" && item !== null
              ? item.key ?? item.value
              : item;

          const optionLabel =
            typeof item === "object" && item !== null
              ? item.value
              : item;

          return (
            <option
              key={
                typeof item === "object" && item !== null
                  ? item.key ?? index
                  : item
              }
              value={optionValue}
            >
              {optionLabel}
            </option>
          );
        })}
      </select>

      {error && (
        <p className="mt-1 text-[14px] text-red-500">
          {error}
        </p>
      )}

      {helper && !error && (
        <p className="mt-1 text-[14px] text-gray-500">
          {helper}
        </p>
      )}
    </div>
  );
};

export default SelectFormComponent;