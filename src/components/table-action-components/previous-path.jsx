import { useSearchPathContext } from "@/context/search-path";

const { ArrowUturnLeftIcon } = require("@heroicons/react/20/solid");
const { Typography, Tooltip } = require("@material-tailwind/react");

function PreviousPath({ previousPath }) {

    const searchContext = useSearchPathContext();

    const handleClick = () => {
        const event = new CustomEvent("files:fetch", {
            detail: {
                path: previousPath,
                ignoreRootsUpdate: true
            }
        });
        
        // Update the Context
        searchContext.setState(previousPath);

        window.dispatchEvent(event);
    }

    return (
        <tr className="hover:bg-blue-gray-50 duration-[1.1s]" >
            <td>{/* Empty Row */}</td>
            <td className="py-3 flex">
                <Tooltip content="Go back">
                    <Typography variant="small" as="a" href="#" color="blue-gray" onClick={handleClick}>
                        <i className="fa fa-chevron-circle-left go-back"></i>
                        &nbsp; ...
                    </Typography>
                </Tooltip>
            </td>
            <td>{/* Empty Row */}</td>
            <td>{/* Empty Row */}</td>
            <td>{/* Empty Row */}</td>
            <td>{/* Empty Row */}</td>
        </tr>
    )
}

export default PreviousPath;