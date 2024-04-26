import {
    Typography,
} from "@material-tailwind/react";
import {
    PlusIcon,
} from "@heroicons/react/24/outline";
import { useCreateItemContext } from "@/context/create-item";

function CreateItem() {
    const context = useCreateItemContext();

    const handleClick = () => context.setIsVisible(prev => !prev.isVisible);        

    return (
        <Typography as="a" href="#" variant="small" color="blue-gray" className="text-xl p-2 font-medium bg-gray-200 rounded">
            <PlusIcon
                onClick={handleClick}
                height={15}
                width={15}
            />
        </Typography>
    )
}

export default CreateItem;