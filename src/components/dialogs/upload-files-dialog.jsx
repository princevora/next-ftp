/**
 * Uploading files directly from user to ftp server, we cannot fetch the progress of file upload 
 * so we will just directly show the progress to 90% and when the file will be uploaded we will insert the file name 
 * in uploaded.
 */

import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Button,
    Dialog,
    Card,
    CardBody,
    Typography,
    DialogHeader,
    DialogBody,
    DialogFooter,
    IconButton,
    Tooltip,
    Badge,
} from "@material-tailwind/react";
import { useUploadFileContext } from "../../context/file-upload";
import { ArrowUpTrayIcon, FilmIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import ItemIcon from "../item-icons";
import { useFtpDetailsContext } from "@/context/ftp-details-context";
import FileListSkeleton from "../skeletons/file-list"
import axios from "axios";
import toast from "react-hot-toast";
import { Blob, File } from "buffer";

export default function UploadFilesDialog() {

    const context = useUploadFileContext();
    const [isDropping, setIsDropping] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [fileNames, setFilesNames] = useState({});
    let [files, setFiles] = useState(null);
    const [uploadDetails, setUploadDetails] = useState({
        fileName: null,
        isUploading: false,
    });
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const uploadBtnRef = useRef();
    const ftp = useFtpDetailsContext();

    const handleOpen = () => {
        context.setIsVisible(!context.isVisible);

        setFilesNames({});
    };

    // useEffect(() => {

    // }, [])


    const getFileSize = (intSize) => {
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        let unitIndex = 0;

        while (intSize >= 1024 && unitIndex < sizes.length - 1) {
            intSize /= 1024;
            unitIndex++;

        }

        return Math.round(Number(intSize).toFixed(2)) + " " + sizes[unitIndex];
    }

    const handleChange = (e) => {
        const files = e.target.files;

        handleFiles(files);
    }

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDropping(false);

        const data = e.dataTransfer;
        const files = data.files

        handleFiles(files);
    }


    const handleFiles = (items) => {
        setIsLoaded(false)

        const names = Array.from(items).map((file, index) => {
            // formData.append("file", file);
            return {
                id: index,
                name: file.name,
                size: getFileSize(file.size)
            }
        });

        // set files and names.
        setFiles(items);

        setFilesNames(names);

        const tmId = setTimeout(() => {
            setIsLoaded(true);
        }, 800);

        return () => {
            clearTimeout(tmId)
        };
    }

    const handleUpload = async () => {

        // Set to empty array
        setUploadedFiles([]);

        const { host, user, pass, currentPath } = ftp.state;
        let formData = new FormData();
        let isSuccess = false;

        formData.append("host", host);
        formData.append("user", user);
        formData.append("pass", pass);
        formData.append("path", currentPath);
        formData.append("action", "upload");

        for(const file of files){

            // Check if the "file" key already exists in formData
            if(!formData.has("file")){
                // Append the file.
                formData.append("file", file);
            } else {
                formData.set("file", file)
            }

            const rsp =  await axios.post("/api/ftp", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: (e) => {
                    setUploadDetails({
                        isUploading: true,
                        fileName: file.name,
                    });
                }, 
            })
            .then((rsp) => {
                setUploadedFiles(prev => ([...prev, file.name]));
                isSuccess = true;
            })
            .catch((error) => {
                context.setIsVisible(false);
                toast.error(error.response?.data?.data?.message || "Unable to upload the files please try again later");

                isSuccess = false;
            });
            
            if(!isSuccess){
                // break the loop.
                break;
            }
        }

        if(isSuccess){
            toast.success("file(s) has been successfully uploaded.");
            setUploadedFiles([]);

            const event = new CustomEvent("files:fetch", {detail: {path: currentPath}});
            window.dispatchEvent(event);
        }

        context.setIsVisible(false);
        setUploadDetails(prev => ({ ...prev, isUploading: false }));
    }

    const handleRemove = (fileId) => {
        setFilesNames(fileNames.filter((f, i) => f.id !== fileId))
    }

    return (
        <>
            <Dialog
                className="max-h-screen overflow-auto"
                open={context.isVisible}
                size="sm"
                handler={handleOpen}
            >
                <DialogHeader className="justify-between">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Upload Files
                        </Typography>
                        <Typography color="gray" variant="small" className="pt-1 font-normal">
                            Upload The Files In the current Folder.
                        </Typography>
                    </div>
                    <IconButton
                        color="blue-gray"
                        size="lg"
                        variant="text"
                        onClick={handleOpen}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </IconButton>
                </DialogHeader>
                <DialogBody >
                    <Card
                        className="border-4 border-gray-300 sticky top-0 z-40 border-dotted shadow-xl"
                        onDrop={handleDrop}
                        onDragOver={(e) => { e.preventDefault(); setIsDropping(true) }}
                        onDragEnter={() => setIsDropping(true)}
                        onDragLeave={() => setIsDropping(false)}
                    >
                        <CardBody className={isDropping ? "bg-orange-300 bg-opacity-20" : "opacity-100"}> {/**bg-orange-300 bg-opacity-20 */}
                            <label htmlFor="upload" className="cursor-pointer">
                                <input type="file" id="upload" onChange={handleChange} ref={uploadBtnRef} className="hidden" multiple />
                                <div className="grid place-items-center gap-1">
                                    <Typography variant="h1" color="black">
                                        <IconButton variant="text" onClick={() => uploadBtnRef.current.click()}>
                                            <ArrowUpTrayIcon className="font-semibold h-8 w-8" />
                                        </IconButton>
                                    </Typography>
                                    <Typography variant="h6" className="text-gray-900 font-semibold flex ">
                                        Drag and Drop or &nbsp;
                                        <span className="underline underline-offset-4">Choose a Local File</span>
                                    </Typography>
                                    <p className="pt-2 text-sm opacity-85 font-sans font-thin">
                                        Supports All the formates: .png, .txt, .js and more..
                                    </p>
                                </div>
                            </label>
                        </CardBody>
                    </Card>
                    {fileNames.length > 0 && isLoaded && (
                        <div className="grid grid-cols-2 gap-4 py-4">
                            {
                                fileNames.map((file, i) => {
                                    return (
                                        <Card key={i} className={`hover:scale-95 hover:shadow-2xl duration-300 border border-gray-300 ${uploadDetails.isUploading && uploadDetails.fileName === file.name && "animate-pulse"}  rounded-lg shadow-none overflow-hidden relative`}>
                                            <div className={`absolute ${uploadedFiles.includes(file.name) ? "bg-green-600 w-[100%]" : "bg-blue-gray-300"} top-0 left-0 h-full w-0 opacity-50 duration-200 ${uploadDetails.isUploading && uploadDetails.fileName === file.name && `w-[90%]`}`}></div>
                                            <div className="grid grid-cols-[30%_auto] gap-2">
                                                <div className="max-w-full m-2 rounded-md w-16 h-16">
                                                    <Typography variant="h3" color="blue-gray" className="flex justify-center text-5xl" >
                                                        <ItemIcon fileName={file.name} />
                                                    </Typography>
                                                    <small className="mx-2 pt-1 font-bold text-center flex">
                                                        {file.size}
                                                    </small>
                                                </div>
                                                <Typography variant="small" color="blue-gray" className="py-4 text-start flex items-center">
                                                    {file.name.length > 40 ? file.name.slice(0, 40) + "..." : file.name}
                                                </Typography>
                                            </div>
                                            <div title={`Remove ${file.name} from this list.`} className="absolute right-1 top-4 transform -translate-y-1/2 cursor-pointer">
                                                <IconButton onClick={() => handleRemove(file.id)} variant="text" disabled={uploadDetails.fileIndex === i}>
                                                    <TrashIcon className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                                                </IconButton>
                                            </div>
                                        </Card>
                                    )
                                })
                            }
                        </div>
                    )} {fileNames.length > 0 && !isLoaded && <FileListSkeleton />}
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => handleOpen(null)}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button
                        variant="gradient"
                        className="bg-gradient-to-r from-black via-blue-gray-900-500 to-red-400"
                        disabled={Object.keys(fileNames).length < 1}
                        onClick={handleUpload}
                    >
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}