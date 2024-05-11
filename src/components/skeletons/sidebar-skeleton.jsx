import { Typography } from "@material-tailwind/react";

export default function SidebarSkeleton() {
    return (
        Array.from([1, 2, 3]).map((i1) => {
            return <div key={i1} className="max-w-full animate-pulse p-8">
                <Typography
                    as="div"
                    variant="h1"
                    className="mb-4 h-3 w-56 rounded-full bg-gray-300"
                >
                    &nbsp;
                </Typography>
                {Array.from([1, 2, 3]).map((i2) => {
                    return (
                        <Typography
                            key={i2}
                            as="div"
                            variant="paragraph"
                            className="mb-2 h-5 rounded-lg w-auto ml-5 bg-gray-300"
                        >
                            {Array.from([1, 2, 3]).map((i3) => {
                                return (
                                    <Typography
                                        key={i3}
                                        as="div"
                                        variant="paragraph"
                                        className="mb-2 h-5 rounded-lg w-auto ml-6 bg-gray-300"
                                    >
                                        &nbsp;
                                    </Typography>
                                )
                            })}
                            &nbsp;
                        </Typography>
                    )
                })}
            </div>
        })
    );
}