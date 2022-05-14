import React, { ForwardRefRenderFunction } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const InputForm: ForwardRefRenderFunction<HTMLInputElement, Props> = (
  { ...props },
  ref
) => {
  return (
    <>
      <div className="rounded border border-gray-400 focus-within:ring-1 focus-within:ring-blue-500 relative mt-4">
        <input
          className="block bg-transparent outline-none w-full px-2 pb-1 text-gray-600 dark:text-gray-200 mt-4"
          placeholder=" "
          value={props.value}
          onChange={props.onChange}
          {...props}
          ref={ref}
        />
        {props.label && (
          <label className="px-2 text-sm absolute top-3 z-[-1] duration-300 origin-[0%]">
            {props.label}
          </label>
        )}
      </div>
      {props.error && <p className="error-label">{props.error}</p>}
    </>
  );
};

export default React.forwardRef(InputForm);
