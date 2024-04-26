"use client";

import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import { Button, Typography } from "@material-tailwind/react";
import Link from "next/link";

export default function Connect() {
    return (
        <div className="max-w-full mx-auto my-56">
            <Typography variant="p" className="text-center">
                Please use Ftp Details Form To Submit The data you can navigate through the button Below
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