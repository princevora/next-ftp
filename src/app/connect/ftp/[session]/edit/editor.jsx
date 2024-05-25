import { Button } from "@material-tailwind/react";
import { Editor as VsEditor } from "@monaco-editor/react";
import { useEffect } from "react";

export default function Editor({ code, lang, handleChange, handleClick }) {

    const saveHandler = (e) => {
        if (e.ctrlKey && e.key === 's') {
            // Prevent the event
            e.preventDefault();

            // Save file
            return handleClick();
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", saveHandler);

        return () => {
            document.removeEventListener("keydown", saveHandler);
        }
    }, []);

    return (
        <div className="relative h-[100vh]">
            <VsEditor onChange={handleChange} theme="vs-dark" language={lang || "textplain"} value={code} />
            <button
                onClick={handleClick}
                className="absolute z-10 top-7 right-36 bg-gradient-to-r from-black via-blue-gray-900-500 to-gray-900 btn text-white"

            >
                save
            </button>
        </div>
    )
}