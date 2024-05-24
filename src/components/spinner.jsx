import { Button, Progress, Spinner, Typography } from "@material-tailwind/react";

export default function PreviewSpinner({ progress }) {
    return (
        <>
            <div className="max-w-full mx-auto my-56 grid place-items-center">
                <Spinner className=" h-16 w-16 text-gray-900/50 " />
                <Typography variant="h4" color="blue-gray" className="py-4">
                    {progress || 0}%
                </Typography>
            </div>
            <div className="grid mx-auto place-items-center shadow-lg max-w-[50%]">
                {
                    progress == null
                        ? <h5>Starting Download..</h5>
                        : <Progress value={progress} size="lg" label="Downloaded" />
                }
            </div>
        </>
    )
}