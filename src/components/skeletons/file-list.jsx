import { Card, Typography } from "@material-tailwind/react"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { IconButton } from "@material-tailwind/react";

export default function FileListSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-4 py-4">
            {
                [0, 1, 2, 3].map((i) => {
                    return (
                        <Card key={i} className="border border-gray-300 rounded-lg shadow-none overflow-hidden relative">
                            <div className="grid grid-cols-[30%_auto] gap-2">
                                <div className="w-20 h-20 max-w-full p-2">
                                    <Skeleton count={1} height="100%" width="100%" className="flex justify-center text-5xl" />
                                </div>
                                <div className="p-2">
                                    <Skeleton count={1} height="50%" className="" />
                                    <Skeleton count={1} className="" />
                                </div>
                            </div>
                            <div className="absolute right-1 top-4 transform -translate-y-1/2 cursor-pointer">
                                <Skeleton />
                            </div>
                        </Card>
                    )
                })
            }
        </div>
    )
}