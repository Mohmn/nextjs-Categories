import InputField from "~/components/InputField";
import CustomButton from "~/components/Button";
import Navbar from "~/components/Navbar";
import { useState, type FormEvent } from "react";
import { api } from "~/utils/api";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from 'next/router';
import Link from 'next/link';


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
function SignupForm() {

    const router = useRouter();

    const signupQuery = api.signup.create.useMutation()

    const [errors, setErrors] = useState<Record<string, string>>({});


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const username = formData.get('username') as string;
        console.log('fomdata', email, password, username)
        try {
            await signupQuery.mutateAsync({
                email: email,
                password: password,
                username: username,
            },
            );
            await router.push('/login');
            // If successful, you might want to redirect the user or clear the form
        } catch (error) {
            if (error instanceof TRPCClientError)
                setErrors(extractErrorMessages(error))
        }
    };
    return (
        <>
            <Navbar />
            <div className="max-w-xl mx-auto mt-5 max-h-fit">
                <form onSubmit={handleSubmit} className="border-gray border-2 border-rad shadow-lg rounded-[20px] px-8 pt-6 pb-8 mb-4">
                    <h1 className="text-xl font-bold mb-2 text-center">Create your account</h1>
                    <InputField
                        name="username"
                        label="Name"
                        placeholder="Enter"
                        required
                        minLength={4}
                        error={errors.username ?? ''}
                    />
                    <InputField
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Enter"
                        required
                        error={errors.email ?? ''}
                    />
                    <InputField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Enter"
                        required
                        minLength={8}
                        error={errors.password ?? ''}
                    />
                    <div className="flex items-center justify-between mt-4">
                        <CustomButton type="submit">
                            Create Account
                        </CustomButton>
                    </div>
                    <div className="text-center mt-4">
                        <p className="text-sm">
                            Have an Account? <Link href="/login">Login</Link>
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
};

export default SignupForm;
