import { useFtpDetailsContext } from "@/context/ftp-details-context";
import { useSearchPathContext } from "@/context/search-path";
import {
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import {
    Popover,
    PopoverHandler,
    PopoverContent,
    Button,
    Input,
    Typography,
} from "@material-tailwind/react";

export default function SearchPath() {

    const context = useSearchPathContext();
    const { currentPath } = useFtpDetailsContext().state;

    const handleClick = (e) => {
        // Prevent the page from load.
        e.preventDefault();

        const query = context.state;

        if (query == "") {
            return toast.error("The search path cannot be empty");
        }

        if (currentPath !== query) { //Prevent refresh of files if the query is similar to ftp path.
            const event = new CustomEvent("files:fetch", {
                detail: {
                    path: query
                }
            });

            window.dispatchEvent(event);
        }
    }

    const handleChange = (e) => {
        context.setState(e.target.value);
    }

    return (
        <Popover placement="left-end">
            <PopoverHandler>
                <Button variant="text" className="rounded text-xl p-2 font-medium bg-gray-200">
                    <MagnifyingGlassIcon className="h-15 w-4 hover:cursor-pointer" />
                </Button>
            </PopoverHandler>
            <PopoverContent className="w-auto z-50">
                <div className="flex">
                    {/* <Typography as="a" href="#" variant="small" color="blue-gray">
                        <PlusIcon
                            height={15}
                            width={15}
                        />
                    </Typography> */}
                    <form onSubmit={handleClick}>
                        <Input
                            onChange={handleChange}
                            label="Enter File Path"
                            defaultValue={context.state}
                        />
                    </form>
                </div>
            </PopoverContent>
        </Popover>
    )
}
