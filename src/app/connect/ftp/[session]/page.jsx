"use client";

import { RenameConfirmationContext } from '@/context/renameItem/RenameConfirmation';
import { ErrorContext } from '@/context/ftperrors-collapse/errors-collapse-context';
import { RenameItemContext } from "@/context/renameItem/RenameItemContext";
import { Card, Collapse, Tooltip, IconButton } from '@material-tailwind/react';
import { useFtpDetailsContext } from '@/context/ftp-details-context';
import RenameConfirmation from "@/components/dialogs/rename-confirmation";
import React, { useState, useEffect, useContext, useRef } from 'react';
import TableSkeleton from "@/components/skeletons/table-skeleton";
import SearchPath from "@/components/tableDataHeader/search-path";
import CreateItem from "@/components/tableDataHeader/create-item";
import CreateItemDialog from "@/components/dialogs/create-item";
import FtpErrors from "@/components/errors/errors";
import Action from "@/components/errors/errors-speed-dial"
import TableData from "@/components/table-data";
import toast from 'react-hot-toast';
import path, { resolve } from 'path';
import { usePasswordContext } from '@/context/encrypt-password';
import CryptoJs from "crypto-js";
import ImportHotToast from '@/components/import-toaster';

const Connect = ({ params }) => {

    const context = useContext(RenameItemContext);
    const errorContext = useContext(ErrorContext);
    const rContext = useContext(RenameConfirmationContext); //Rename confirmation context
    const renameInputRef = useRef(null);
    const ftpDetailsContext = useFtpDetailsContext();
    const password = usePasswordContext();
    const encData = CryptoJs.AES.decrypt(decodeURIComponent(params.session), password);
    const json = JSON.parse(encData.toString(CryptoJs.enc.Utf8));

    console.log(json);

    const apiEndpoint = "/api/ftp";

    const [state, setState] = useState({
        ftp_host: json.ftp_host,
        ftp_username: json.ftp_username,
        ftp_password: json.ftp_password,
        is_table_hidden: null,
        ftp_files: null,
        ftp_path: "/",
        searchPath: "/",
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
            currentPath: state.ftp_path,
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

        setState(prevState => (
            {
                ...prevState,
                ftp_path: followingPath
            })
        );

        loadFiles(followingPath)
    };

    const handleSearchPath = (e) => {
        let query = e.target.value;

        setState(prevState => (
            {
                ...prevState,
                searchPath: query
            })
        );
    };

    const handleSearch = () => {
        if (state.ftp_path !== state.searchPath) {
            loadFiles(state.searchPath);
        }

        setState(prevState => (
            {
                ...prevState,
                ftp_path: state.searchPath
            })
        );
    };

    const handleSubmitRename = async (e) => {
        e.preventDefault();

        rContext.setVisible(true);
        return;
    }

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
        })
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
                                <SearchPath currentPath={state.searchPath} handleChange={handleSearchPath} handleClick={handleSearch} />
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
            <RenameConfirmation handleOnConfirm={handleOnConfirm} />
            <CreateItemDialog />
            <ImportHotToast />

        </header>
    );
};

export default Connect;