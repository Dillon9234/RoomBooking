"use client";

import { useTransition } from "react";

const LogoutForm = () => {
    const [isPending, startTransition] = useTransition();

    return (
        <button
            onClick={() => {}}
            disabled={isPending}
            className="btn btn-danger"
        >
            {isPending ? "Logging out..." : "Logout"}
        </button>
    );
};

export default LogoutForm;
