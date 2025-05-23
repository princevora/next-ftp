import {
    Tooltip,
    Typography,
} from "@material-tailwind/react";
import {
    PencilIcon,
} from "@heroicons/react/24/outline";

function RenameItem({ fileName, setRenameElement, className = "", label = "" }) {
    return (
        <Typography
            onClick={
                (e) => setRenameElement(fileName, e)
            }
            as="a" href="#" variant="small" color="blue-gray" className={`font-medium ${className} ${label && 'flex gap-2 items-center w-full'}`}>
            <Tooltip content={`Rename: ${fileName}`}>
                <PencilIcon
                    height={15}
                    width={15}
                />
            </Tooltip>
            {label && (
                <Typography as="h3" variant="small" color="blue-gray" className="font-medium">
                    {label}
                </Typography>
            )}
        </Typography>
    )
}

export default RenameItem;