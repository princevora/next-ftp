'use client';

import PropTypes from 'prop-types';
import { Button, Typography } from "@material-tailwind/react";
import Link from "next/link";

export default function ConnectionError(props) {
    return (
        <div className="max-w-full mx-auto my-56">
            <Typography variant="paragraph" className="text-center">
                Please use Ftp Details Form To Submit The data you can navigate through the button Below
            </Typography>
            <div className="flex justify-center py-5">
                <Button variant="gradient" color="gray">
                    <Link href="/">
                        Go Home
                    </Link>
                </Button>
            </div>
        </div>
    );
}

ConnectionError.propTypes = {
    messageText: PropTypes.string,
};
