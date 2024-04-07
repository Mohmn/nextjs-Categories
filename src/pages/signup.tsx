import InputField from "~/components/InputField";
import CustomButton from "~/components/Button";
import Navbar from "~/components/Navbar";
import { type FormEvent } from "react";
import { api } from "~/utils/api";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from 'next/router';
import Link from 'next/link';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
// function checkError(error: any, pathToCheck: string) {

//     if(error instanceof TRPCClientError) {
//         if(Array.isArray(error)) {
//             const error.includes(e => e.path.includes(pathToCheck))
//         }
//     }

// } 
function SignupForm() {

    const router = useRouter();

    const signupQuery = api.signup.create.useMutation({
        onSuccess: async () => {
            await router.push('/login');
        }
    })


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const username = formData.get('username') as string;
        console.log('fomdata', email, password, username)
        try {
            signupQuery.mutate({
                email: email,
                password: password,
                username: username,
            },
            );
            // If successful, you might want to redirect the user or clear the form
        } catch (error) {
            if (error instanceof TRPCClientError)
                console.log('error', error.message)
            else console.log('erro2r', error)
            // Assuming the error object has a message property
            // setServerError(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };
    return (
        <>
            <Navbar />
            <div className="max-w-xl mx-auto mt-5 max-h-fit">
                <form onSubmit={handleSubmit} className="border-gray border-2 border-rad shadow-lg rounded-[20px] px-8 pt-6 pb-8 mb-4">
                    <h1 className="text-xl font-bold mb-2 text-center">Create your account</h1>
                    <InputField name="username" label="Name" placeholder="Enter" required minLength={4} />
                    <InputField name="email" label="Email" type="email" placeholder="Enter" required />
                    <InputField name="password" label="Password" type="password" placeholder="Enter" required minLength={8} />
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
