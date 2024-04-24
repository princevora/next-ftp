import {
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
    Input,
} from "@material-tailwind/react";

export default function SearchPath({ currentPath, handleChange, handleClick }) {
    return (
        <div className="mb-10 flex w-full shrink-0 gap-2 max-w-full">
            <div className="w-64 md:w-72 mx-auto sm:px-3">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleClick();
                }}>
                    <Input
                        onChange={handleChange}
                        label="Enter File Path"
                        value={currentPath}
                        icon={<MagnifyingGlassIcon className="h-5 w-5 hover:cursor-pointer" onClick={handleClick} />}
                    />
                </form>
            </div>
        </div>
    )
}
