import { type InputHTMLAttributes, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string,
    error?: string,
}

const InputField = forwardRef<HTMLInputElement, Props>((props, ref) => {

    const { label, error, ...rest } = props;
    return (
        <div className="mb-4 h-20">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={label}>
                {props.label}
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...rest}
                ref={ref}
            />
            {error && (
                <span className="text-red-400 text-xs block mt-1">
                    {error}
                </span>
            )}
        </div>
    );
});

InputField.displayName = 'InputField';
export default InputField;