import {
    Typography,
} from "@material-tailwind/react";
import {
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useBulkDeleteContext } from "../../context/bulk-delete";
import { useConfirmationContext } from "../../context/confirmation";
import path from "path";

function DeleteSelected() {
    const context = useBulkDeleteContext();
    const confirmationContext = useConfirmationContext();
    const files = context.items.map((file) => {
        return path.basename(file);
    })

    const handleClick = () => {

        const message = `You Are deleting The Following File(s) or Folder(s) Please confirm your Action. files: ${files.join(", ")}`;

        confirmationContext.setState(prev => ({
            ...prev,
            isVisible: true,
            modalTitle: "Delete Confirmation!",
            modalDesc: message,
            callback: handleOnConfirm
        }));
    }

    return (
        !context.isBtnHidden && context.items.length !== 0 && (
            <Typography as="a" href="#" variant="small" color="blue-gray" className="duration-700  text-xl p-2 font-medium bg-gray-200 rounded" >
                <TrashIcon
                    onClick={handleClick}
                    height={15}
                    width={15}
                />
            </Typography >
        )
    )
}

export default DeleteSelected;