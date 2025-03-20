"use client";

import { useTransition } from "react";

const LogoutForm = () => {
    const [isPending, startTransition] = useTransition();

    return (
        <button
            onClick={() =>{}}
            disabled={isPending}
            className="block py-2 px-3 rounded-sm md:border-0 md:p-0 text-white md:hover:text-red-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent"
        >
            {isPending ? "Logging out..." : "Logout"}
        </button>
    );
};

export default LogoutForm;
