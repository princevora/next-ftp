import React, { useState } from "react";
import { Card } from "@material-tailwind/react";

const Upload = () => {
    const [file, setFile] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault(); // Prevent the default behavior
    };

    const handleDrop = (e) => {
        e.preventDefault();
        let files = e.dataTransfer.files;
        if (files && files[0]) {
            setFile(files[0]);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className="container mx-auto p-5">
            <Card className="p-10">
                <div 
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-gray-400 rounded-md p-10 text-center"
                >
                    {file ? (
                        <p>File: {file.name}</p>
                    ) : (
                        <p>Drag and drop your file here, or click to select a file.</p>
                    )}
                    <input
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="fileInput"
                    />
                    <label htmlFor="fileInput" className="mt-2 cursor-pointer text-blue-500">
                        Click to select a file
                    </label>
                </div>
            </Card>
        </div>
    );
};

export default Upload;
