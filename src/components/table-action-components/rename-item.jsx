import {
    Tooltip,
    Typography,
} from "@material-tailwind/react";
import {
    PencilIcon,
} from "@heroicons/react/24/outline";

function RenameItem({ fileName, setRenameElement, className = "" }) {
    return (
        <Typography as="a" href="#" variant="small" color="blue-gray" className={`font-medium ${className}`}>
            <Tooltip content={`Rename: ${fileName}`}>
                <PencilIcon
                    onClick={
                        (e) => setRenameElement(fileName, e)
                    }
                    height={15}
                    width={15}
                />
            </Tooltip>
        </Typography>
    )
}

export default RenameItem;