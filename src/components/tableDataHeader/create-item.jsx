import {
    Typography,
} from "@material-tailwind/react";
import {
    PlusIcon,
} from "@heroicons/react/24/outline";
import { useCreateItemContext } from "@/context/create-item/create-item";

function CreateItem() {
    const context = useCreateItemContext();

    const handleClick = () => {
        context.setState(prev => ({
            ...prev,
            isVisible: !prev.isVisible
        }))        
    }

    return (
        <Typography as="a" href="Javascript:void(0);" variant="small" color="blue-gray" className="text-xl font-medium">
            <PlusIcon
                onClick={handleClick}
                height={15}
                width={15}
            />
        </Typography>
    )
}

export default CreateItem;