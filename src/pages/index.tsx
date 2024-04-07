import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import InterestSelection from "~/components/Checkbox";
import Navbar from "~/components/Navbar";
import { db } from '~/server/db';
import { getPaginatedCategories } from '~/utils/categories';
import validateSession from '~/utils/session';


type Category = {
    id: number
    name: string
    checked: boolean
}


export default function SelectedItems({
    categories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <>
            <Navbar />
            <InterestSelection categories={categories as Category[]} />
        </>
    )
}


export const getServerSideProps: GetServerSideProps = (async (context) => {
    const { req } = context;

    const sessionToken = req.cookies?.session;

    if (!sessionToken)
    return {
        redirect: {
            destination: '/login',
            permanent: false, 
        },
    };
    if (!(await validateSession(db, sessionToken)))
        return {
            redirect: {
                destination: '/login',
                permanent: false, // This is usually false for login redirects
            },
        };
    // Now you can access `req` and `res` here
    // For example, to get cookies: req.cookies

    const userId = sessionToken.split(':')[0]!

    // Simulate fetching categories, replace this with your actual data fetching logic
    const categories =  await getPaginatedCategories(db,userId)
    return {
        props: {
            categories,
        },
    };
}) satisfies GetServerSideProps<{ categories: Category[] }>;