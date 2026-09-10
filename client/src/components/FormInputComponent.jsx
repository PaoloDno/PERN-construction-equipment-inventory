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
    <div className="flex flex-col justify-center items-start p-2 w-full" >
      <div className="relative w-full bg-primary/75 rounded-md p-1">
        <input
          type={type}
          name={name}
          placeholder=" "
          value={value}
          onChange={onChange}
          className="
            peer
            w-full
            h-12
            px-4
            pt-6
            pb-2
            text-[16px]
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
          peer-placeholder-shown:text-[18px]
          peer-placeholder-shown:-translate-y-1/2

          peer-focus:-top-1
          peer-focus:text-[14px]
          peer-focus:translate-y-0

          peer-not-placeholder-shown:top-0
          peer-not-placeholder-shown:text-[14px]
          peer-not-placeholder-shown:translate-y-0
        "
        >
          {label}
        </label>
      </div>


      {helper && !error && (
      <div className="min-h-2 px-1 mt-1 items-start justify-start w-full">
        <p
          className={`text-[14px] text-gray-700 scale-y-75`}
        >
          {helper || ""}
        </p>
      </div>

      )}

      {error && (
      <div className="p-1 mt-1 items-start justify-start w-full">
        <p
          className={`text-[14px] text-red-500 scale-80`}
        >
          {error || ""}
        </p>
      </div>
      )}
    </div>
  );
};
export default InputFormComponent;