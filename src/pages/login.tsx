import InputField from "~/components/InputField";
import CustomButton from "~/components/Button";
import Navbar from "~/components/Navbar";
import { useState, type FormEvent } from "react";
import { api } from "~/utils/api";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/router";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractErrorMessages(error: TRPCClientError<any>): Record<string, string> {
    const errorsMap: Record<string, string> = {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    try {
        const errorMessages = JSON.parse(error.message) as object;
        // Check if error is an array and iterate through it
        Object.values(errorMessages).forEach((e) => {
            console.log('error', e)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            const key = e.path[0];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            errorsMap[key] = e.message;
        });

        return errorsMap;
    } catch (e) {
        const [key, val] = error.message.split(':')
        if (key && val)
            errorsMap[key] = val
    }


    return errorsMap;
}

function LoginForm() {
    const router = useRouter();
    const loginQuery = api.login.create.useMutation();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        try {
            await loginQuery.mutateAsync({
                email: email,
                password: password,
            });
            await router.push('/');
        } catch (error) {
            if (error instanceof TRPCClientError)
                setErrors(extractErrorMessages(error))
        }
    };
    return (
        <>
            <Navbar />
            <div className="max-w-xl mx-auto mt-5">
                <form onSubmit={handleSubmit} className="border-gray border-2 border-rad shadow-lg rounded-[20px] px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4 flex flex-col text-center gap-2">
                        <h1 className="text-xl font-bold mb-2">Login</h1>
                        <p className="text-md font-semibold ">Welcome back to ECOMMERCE</p>
                        <p className="text-xs ">The next gen business marketplace</p>
                    </div>
                    <InputField
                        label="Email"
                        type="email"
                        placeholder="Enter"
                        name="email"
                        required
                        error={errors.email ?? ''}
                    />
                    <InputField
                        label="Password"
                        type="password"
                        placeholder="Enter"
                        name="password"
                        required
                        minLength={8} 
                        error={errors.password ?? ''}
                    />
                    <div className="flex items-center justify-between mt-4">
                        <CustomButton type="submit">
                            LOGIN
                        </CustomButton>
                    </div>
                    <hr className="m-4 h-[1px]  bg-gray-500 border-0 rounded " />
                    <div className="text-center mt-4">
                        <p className="text-sm">
                            Don’t have an Account? <Link href="/signup">Sign up</Link>
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
};

export default LoginForm;
