"use client";

import { useConfirmationContext } from '@/context/renameItem/confirmation';
import { ErrorContext } from '@/context/ftperrors-collapse/errors-collapse-context';
import { RenameItemContext } from "@/context/renameItem/RenameItemContext";
import { Card, Collapse, Tooltip, IconButton } from '@material-tailwind/react';
import { useFtpDetailsContext } from '@/context/ftp-details-context';
import Confirmation from "@/components/dialogs/confirmation";
import React, { useState, useEffect, useContext, useRef } from 'react';
import TableSkeleton from "@/components/skeletons/table-skeleton";
import SearchPath from "@/components/tableDataHeader/search-path";
import CreateItem from "@/components/tableDataHeader/create-item";
import CreateItemDialog from "@/components/dialogs/create-item";
import TableData from "@/components/table-data";
import toast from 'react-hot-toast';
import path, { resolve } from 'path';
import { usePasswordContext } from '@/context/encrypt-password';
import CryptoJs from "crypto-js";
import ImportHotToast from '@/components/import-toaster';
import CheckConnection from '@/components/check-connection';
import { useSearchPathContext } from '@/context/search-path';

function Connect({ params }) {

    const context = useContext(RenameItemContext);
    const errorContext = useContext(ErrorContext);
    const rContext = useConfirmationContext() //Rename confirmation context
    const renameInputRef = useRef(null);
    const ftpDetailsContext = useFtpDetailsContext();
    const password = usePasswordContext();
    const searchContext = useSearchPathContext();

    // Get Url Query Data.
    const encData = CryptoJs.AES.decrypt(decodeURIComponent(params.session), password);
    let rsp;
    
    // Prevent Errors.
    try {
        rsp = JSON.parse(encData.toString(CryptoJs.enc.Utf8));
    } catch (error) {
        rsp = null
    }

    const json = rsp;

    const apiEndpoint = "/api/ftp";

    const [state, setState] = useState({
        ftp_host: json?.ftp_host,
        ftp_username: json?.ftp_username,
        ftp_password: json?.ftp_password,
        is_table_hidden: null,
        ftp_files: null,
        searchPath: "/",
        ftp_path: "/",
    });

    // Set the FtpParams That will be used in Https Requests  
    let ftpParams = {
        host: state.ftp_host,
        user: state.ftp_username,
        pass: state.ftp_password,
        action: "fetch", //Default to fetch action
    };;

    useEffect(() => {

        const handleFetchFiles = (data) => {
            const path = data.detail.path ?? '/';
            loadFiles(path);
        }

        // Load Files when the files:fetch event is triggered.
        window.addEventListener("files:fetch", handleFetchFiles);

        loadFiles();

        return () => {
            window.removeEventListener("files:fetch", handleFetchFiles);
        }
    }, []);

    useEffect(() => {
        // To Use the ftp details like user,host, pass we will store these data to a context
        ftpDetailsContext.setState(prev => ({
            ...prev,
            host: state.ftp_host,
            user: state.ftp_username,
            pass: state.ftp_password,
            currentPath: state.ftp_path
        }));

    }, [state.ftp_path]);

    const loadFiles = async (path) => {

        // Show Toaster and load the files too.
        const response = fetchFileData(path ?? state.ftp_path);

        await toast.promise(
            response,
            {
                loading: "Fetching Files",
                success: "Files Loaded Successfully",
                error: (err) => err
            }
        )

        response.then((rsp) => {
            setState(prevState => (
                {
                    ...prevState,
                    is_table_hidden: false,
                    searchPath: path,
                    ftp_files: rsp
                })
            );
        })

    }

    const fetchFileData = (path = "/") => new Promise(async (resolve, reject) => {

        if (path === "") path = "/";

        setState(prevState => (
            {
                ...prevState,
                is_table_hidden: true,
                ftp_path: path
            })
        );

        const paramData = { ...ftpParams };
        paramData.path = path

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paramData),
            });

            if (!response.ok) {
                throw new Error("Unable To Complete The Request");
            }

            const responseData = await response.json();
            const sorted = Object.values(responseData.data.ftp_files).sort((a, b) => {
                return b.type - a.type;
            });

            resolve(sorted)

        } catch (error) {
            reject("Unable to complete the request please check your inputs");
        }
    })

    const handePath = (folderPath) => {
        let followingPath = path.join(state.ftp_path, folderPath);
        searchContext.setState(followingPath);

        setState(prevState => (
            {
                ...prevState,
                ftp_path: followingPath
            })
        );

        loadFiles(followingPath)
    };

    const handleSearch = () => {
        const query = searchContext.state;

        if(query == ""){
            return toast.error("The search path cannot be empty");
        }

        if (state.ftp_path !== query) { //Prevent refresh of files if the query is similar to ftp path.
            loadFiles(query);
        }

        setState(prevState => (
            {
                ...prevState,
                ftp_path: query
            })
        );
    };

    const handleSubmitRename = async (e) => {
        e.preventDefault();

        const toBaseName = path.basename(context.to);
        if(toBaseName == ""){
            return toast.error("The file name must not be empty");
        }
        else{
            rContext.setState(prev => ({
                ...prev,
                modalTitle: "Rename Confirmation",
                modalDesc: `Are you Sure? you are renaming a file: ${toBaseName}. please confirm your Action`,
                isVisible: true
            }));
        }
    }
    
    const renameFile = (from, to) => new Promise(async (resolve, reject) => {
        const toDomain = to.split(".").pop();

        const paramData = { ...ftpParams };
        paramData.action = "rename";
        paramData.from = from;
        paramData.to = to;

        try {
            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paramData)
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error("Unable To Rename the file.");
            }

            resolve({
                data,
                success: true
            });

        } catch (error) {
            reject({
                data: error,
                success: false
            })
        }
    })

    // renameConfirmation Handler
    const handleOnConfirm = async () => {
        const { from, to } = context;
        let inputField;

        const fromBaseName = path.basename(from);
        const domain = to.split(".").pop();
        const lDomain = domain.toLowerCase();
        const normalizedtoBaseName = to.replace(domain, lDomain); //This lines will change the UpperCase Domain names to lowercase.
        const toBaseName = path.basename(normalizedtoBaseName);

        if (toBaseName === "") {
            return toast.error("The File Name Must not be empty");
        }

        inputField = renameInputRef.current.querySelector("input")
        inputField.disabled = true;

        toast.promise(
            renameFile(from, normalizedtoBaseName),
            {
                loading: `Renaming file: ${fromBaseName}`,
                success: `Successfully Renamed the File to: ${toBaseName}`,
                error: "Unable to rename the file, please try again later"
            }
        ).then((rsp) => {
            if (rsp.data.success) {
                loadFiles(state.ftp_path);
            }
        });
    }



    const tableDataProps = {
        renameInputRef,
        handleSubmitRename,
        data: state.ftp_files,
        handleChangePath: handePath,
        currentPath: state.ftp_path
    }

    return (
        <header className="relative max-w-[1000px] mx-auto mt-5 columns-auto bg-white p-8">
            <div className="mx-auto">
                <div className="mx-auto pt-12 pb-24  text-center">
                    <Card className='mx-auto shadow-xl'>
                        {!state.is_table_hidden && state.ftp_files ? (
                            <>
                                <SearchPath handleClick={handleSearch} />
                                <div className="flex justify-end p-4">
                                    <CreateItem />
                                </div>
                                <Card className="h-auto w-full overflow-scroll md:overflow-hidden">
                                    <TableData
                                        {...tableDataProps}
                                    />
                                </Card>
                            </>
                        ) : (
                            <TableSkeleton />
                        )}
                    </Card>
                </div>
            </div>

            {/* Rename Confirmation Modal  */}
            <Confirmation handleOnConfirm={handleOnConfirm} />

            {/* Create item dialog */}
            <CreateItemDialog />

            {/* Import hot toast */}
            <ImportHotToast />

            {/* Internet connection Footer */}
            <CheckConnection />

        </header>
    );
};

export default Connect;