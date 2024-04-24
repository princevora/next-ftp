import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';

export default function SearchPathSkeleton() {
    return (
        <div className="mb-10 flex w-full shrink-0 gap-2 md:w-max]">
            <div className="w-full md:w-72 mx-auto">
                <Skeleton height={20}/>
            </div>
        </div>
    )
}