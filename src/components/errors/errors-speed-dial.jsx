import { useContext } from "react"
import { ErrorContext } from "../../context/ftperrors-collapse/errors-collapse-context"

export default function Action() {
    const context = useContext(ErrorContext);

    const handleClick = () => {
        context.setState(!context.state);
    }

    return (
        <button
            className="fixed bottom-4 right-4 z-10 h-11 w-11 rounded-full bg-red-700 hover:bg-red-800 hover:scale-110 duration-300 text-white shadow-lg"
            onClick={handleClick}
        >
            <i className="fa fa-info"></i>
        </button>
    )
}