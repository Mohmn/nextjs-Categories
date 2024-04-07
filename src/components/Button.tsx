import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    showLoader?: boolean,
    children: ReactNode;
}

const CustomButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
    const { showLoader, children, className, ...rest } = props;
    return (
        <button
            className='w-full bg-black text-white font-bold  py-4 px-[18px] rounded-md focus:outline-none focus:shadow-outline'
            ref={ref}
            {...rest}
        >
            {children}
        </button>
    );
});

CustomButton.displayName = 'CustomButton';
export default CustomButton;

