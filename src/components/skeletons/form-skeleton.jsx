import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
    Card,
    CardBody,
} from "@material-tailwind/react";

export default function FormSkeleton() {
    return (
        <Card className="w-96 shadow-2xl mt-4">
            <CardBody className="flex flex-col gap-4">
                
                {/* Form inputs */}
                <Skeleton className="rounded-full" height={42} />
                <Skeleton height={42} />
                <Skeleton height={42} />
                <Skeleton height={42} />
                
                {/* Submit button skeleton */}
                <div className="pt-3">
                    <Skeleton height={42} />
                </div>
            </CardBody>
        </Card>
    )
}