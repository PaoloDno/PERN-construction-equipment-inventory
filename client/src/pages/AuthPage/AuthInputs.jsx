const AuthInputs = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  helper,
}) => {
  return (
    <div className="flex flex-col justify-center items-start bg-secondary/10 p-2 rounded-xl container">
      <div className="relative w-full h-14 bg-primary/20 rounded-lg">
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
      px-2
      md:px-4
      pt-6
      pb-2
      text-text
      outline-none
      bg-white/60
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
          className={`text-[0.8rem] scale-y-75 transition-opacity duration-200
            ${helper ? "opacity-80" : "opacity-0"}`}
        >
          {helper || " "}
        </p>
      </div>

      <div className="min-h-4">
        <p
          className={`text-[1.2rem] text-red-500 scale-80 transition-opacity duration-200
            ${error ? "opacity-100" : "opacity-0"}`}
        >
          {error || " "}
        </p>
      </div>
    </div>
  );
};

export default AuthInputs;
