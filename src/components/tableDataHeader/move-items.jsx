import {
    Button,
    Typography,
} from "@material-tailwind/react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { useBulkSelectContext } from "@/context/bulk-select";
import { useEffect } from "react";

function MoveItemsBulk() {
    const context = useBulkSelectContext();

    // useEffect(() => {
    //     if(Object.keys(context.items).length < 1){
    //         context.setIsItemsMoving(false);
    //     }
    // }, [context.items]);

    const handleClick = () => {
        const selectedItems = context.items;
        context.setIsItemsMoving(true);
        context.setMovableItems(selectedItems);
    }       
    
    return (
        <Button 
            variant="text" 
            onClick={handleClick} 
            disabled={!context.isItemsMoving && Object.keys(context.movableItems).length < 1 && Object.keys(context.items).length < 1} 
            className="rounded text-xl p-2 font-medium bg-gray-200"
        >
            <Typography as="a" href="#" variant="small" color="blue-gray">
                <ArrowRightOnRectangleIcon
                    height={15}
                    width={15}
                />
            </Typography>
        </Button>
    )
}

export default MoveItemsBulk;