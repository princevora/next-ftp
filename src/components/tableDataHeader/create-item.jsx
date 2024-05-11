import {
    Button,
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
        <Button variant="text" onClick={handleClick} className="rounded text-xl p-2 font-medium bg-gray-200">
            <Typography as="a" href="#" variant="small" color="blue-gray">
                <PlusIcon
                    height={15}
                    width={15}
                />
            </Typography>
        </Button>
    )
}

export default CreateItem;