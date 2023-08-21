import { useEffect } from "react";

const Input = ({
  icon,
  type,
  placeholder,
  value,
  onChange,
  currentRef,
  autoComplete,
  disabled,
  required,
  size,
  id
}) => {
  useEffect(() => {
    if (currentRef) {
      currentRef.current.focus();
    }
  }, []);

  return (
    <div
      className={`border border-grey-300 max-w-[280px] ${
        size ? size : "w-5/6"
      } h-8 rounded-full shadow-md my-2 flex justify-around items-center overflow-hidden py-2 ${
        icon ? "" : "px-5"
      } bg-white`}
    >
      {icon ? icon : null}
      <input
        className={`${
          size ? size : "w-full"
        } h-8 bg-transparent outline-none pr-2 text-sm`}
        id={id}
        type={type}
        required={required ? required : null}
        disabled={disabled ? disabled : null}
        autoComplete={autoComplete ? autoComplete : null}
        ref={currentRef ? currentRef : null}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
