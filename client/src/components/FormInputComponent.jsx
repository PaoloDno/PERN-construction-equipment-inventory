const InputFormComponent = (
  {
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  helper,
  }
) => {
  return (
    <div className="flex flex-col justify-center items-start bg-secondary/20 p-2 px-3 rounded-2xl">
      <div className="relative w-full h-16 bg-primary/60 rounded-lg text-xl">
        <input
          type={type}
          name={name}
          placeholder=" "
          value={value}
          onChange={onChange}
          className="
      peer
      w-full
      h-full
      bg-transparent
      px-4
      pt-6
      pb-2
      text-text
      outline-none
      border-2 border-white/80
      rounded-lg
    "
        />

        <label
          className="
      absolute
      left-4
      top-1/2
      -translate-y-1/2
      text-text
      transition-all
      pointer-events-none

      peer-placeholder-shown:top-1/2
      peer-placeholder-shown:text-2xl
      peer-placeholder-shown:-translate-y-1/2

      peer-focus:top-2
      peer-focus:text-sm
      peer-focus:translate-y-0

      peer-not-placeholder-shown:top-2
      peer-not-placeholder-shown:text-sm
      peer-not-placeholder-shown:translate-y-0
    "
        >
          {label}
        </label>
      </div>

      <div className="min-h-4 px-1 mt-1 items-start justify-start w-full">
        <p
          className={`text-xl scale-y-75 transition-opacity duration-200
            ${helper ? "opacity-80" : "opacity-0"}`}
        >
          {helper || " "}
        </p>
      </div>

      <div className="min-h-4 px-1 mt-1 items-start justify-start w-full">
        <p
          className={`text-xl text-red-500/80 scale-80 transition-opacity duration-200
            ${error ? "opacity-100" : "opacity-0"}`}
        >
          {error || " "}
        </p>
      </div>
    </div>
  );
};
export default InputFormComponent;