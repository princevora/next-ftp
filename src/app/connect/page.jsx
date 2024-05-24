"use client";

import { Button, Typography } from "@material-tailwind/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ConnectionError({ messageText }) {
    const [message, setMessage] = useState("Please use Ftp Details Form To Submit The data you can navigate through the button Below");

    useEffect(() => {
        if (messageText) {
            setMessage(messageText);
        }
    }, [])

    return (
        <div className="max-w-full mx-auto my-56">
            <Typography variant="paragraph" className="text-center">
                {message}
            </Typography>
            <div className="flex justify-center py-5">
                <Button variant="gradient" color="gray">
                    <Link color="indigo" href="/">
                        Go Home
                    </Link>
                </Button>
            </div>
        </div>
    )
}