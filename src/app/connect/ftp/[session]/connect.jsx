"use client";

import { useState, useEffect, useContext, useRef } from 'react';
import { useConfirmationContext } from '@/context/confirmation';
import { RenameItemContext } from "@/context/RenameItemContext";
import { useFtpDetailsContext } from '@/context/ftp-details-context';
import { usePasswordContext } from '@/context/encrypt-password';
import { useSearchPathContext } from '@/context/search-path';
import { useBulkDeleteContext } from '@/context/bulk-delete';
import { useSideBarContext } from '@/context/sidebar';
import { findAndCheckOrSetValue } from "@/helper";
import Dialogs from "./modal-group/modals";
import Confirmation from "@/components/dialogs/confirmation";
import TableSkeleton from "@/components/skeletons/table-skeleton";
import TableData from "@/components/table-data";
import toast from 'react-hot-toast';
import CryptoJs from "crypto-js";
import * as pathModule from 'path';

function Connect({ params }) {

    const context = useContext(RenameItemContext);
    const rContext = useConfirmationContext() //Rename confirmation context
    const renameInputRef = useRef(null);
    const ftpDetailsContext = useFtpDetailsContext();
    const password = usePasswordContext();
    const searchContext = useSearchPathContext();
    const deleteContext = useBulkDeleteContext();
    const confirmation = useConfirmationContext();
    const sidebar = useSideBarContext();

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
        const obj = {
            has: {
                folder: {
                    prince: {
                        isVisible: true,
                        isfren: true,
                        std: 11
                    }
                }
            }
        }

        const handleFetchFiles = (data) => {
            const path = data?.detail?.path || '/';
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
        const response = fetchFileData(path || state.ftp_path);

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
        let isRootReq = false; //Check wether the path is empty and then set this to true. so we can set the root folders for sidebar. 

        if (path === "") {
            path = "/";
        }

        if (path === "/") {
            isRootReq = true;
        }

        // empty the selected items for for delete items component
        deleteContext.setItems([]);

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

            const responseData = await response.json();

            if (!response.ok) {
                const { message } = responseData.data;
                reject(message);
            }

            const sorted = Object.values(responseData.data.ftp_files).sort((a, b) => {
                return b.type - a.type;
            });

            // Set the root folder if its the root path.
            isRootReq && sidebar.roots == null && sidebar.setRoots(sorted);

            const currentPath = ftpDetailsContext.state.currentPath;

            // Set the current Path Roots. if the path isnt root path.
            const lastParse = pathModule.parse(currentPath);
            const crParse = pathModule.parse(path)
            const crBase = crParse.base; //Current Path basename
            const lrBase = lastParse.base; //Last Path basename
            const dirs = sorted.filter((dir) => { return dir.type == 1 });
            const { currentRoots } = sidebar
            let currentRootsPath = null;
            // Get the index of the current Basename (path).
            const indexs = path.split("/").filter((p) => { return p !== '' });
            const solidObjectPath = indexs.join(".");
            let currentValidPath;

            findAndCheckOrSetValue(currentRoots, indexs[indexs.length - 1], (v, p) => {
                if (p !== null) {
                    currentValidPath = p.split(".").shift();
                }
            }, []);

            if (!isRootReq && currentRoots !== null && dirs.length >= 1 && currentValidPath == indexs[0]) {
                const newKeys = {};
                dirs.forEach(dir => {
                    newKeys[dir.name] = {}
                });

                findAndCheckOrSetValue(currentRoots, indexs[indexs.length - 1], (v, p) => {
                    if (p !== null) {
                        currentRootsPath = p;
                    }
                }, [], newKeys);
            }
            else if (!isRootReq && dirs.length >= 1) {
                const roots = {}

                dirs.forEach(dir => {
                    if (!roots[crBase])
                        roots[crBase] = {}

                    roots[crBase][dir.name] = {}
                })

                sidebar.setCurrentRoots(roots)
            }

            // if (!isRootReq && crParse.dir.indexOf(lastParse.base) !== -1 && lastParse.base !== "") {

            //     // console.log("Roots: ", sidebar.currentRoots, "bse:", crBase);

            //     // if(findAndCheckOrSetValue(sidebar.currentRoots, crBase) !== undefined){
            //     //     console.log("If: ", findAndCheckOrSetValue(sidebar.currentRoots, crBase));
            //     //     findAndCheckOrSetValue(sidebar.currentRoots, crBase, {
            //     //         [crBase]: sorted
            //     //     })
            //     // }else{
            //     //     findAndCheckOrSetValue(sidebar.currentRoots, crBase, {
            //     //         [crBase]: sorted
            //     //     })
            //     // };
            //     // const newItem = sidebar.currentRoots.includes(crBase) ? curre

            //     // const newItem = sidebar.currentRoots[{
            //     //     [pathModule.basename(crParse)]: 
            //     // }]
            //     sidebar.setCurrentRoots(sorted);
            // }
            // else if (!isRootReq) {
            //     sidebar.setCurrentRoots(sorted);
            // }

            ftpDetailsContext.setState(prev => ({
                ...prev,
                currentPath: path
            }));

            resolve(sorted)

        } catch (error) {

            // Set back the files if found error.
            if (state.ftp_files !== null) {
                setState({
                    ...state,
                    is_table_hidden: false
                })
            }

            reject(error || "Unable to complete the request please check your inputs");
        }
    })

    const handePath = (folderPath) => {
        let followingPath = pathModule.join(state.ftp_path, folderPath);
        searchContext.setState(followingPath);
        ftpDetailsContext.setState(prev => ({
            ...prev,
            currentPath: folderPath
        }))

        setState(prevState => (
            {
                ...prevState,
                ftp_path: followingPath
            })
        );

        loadFiles(followingPath)
    };

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
        // Due to we are using context callbacks so we will hide the modal. to show the promise toast as below
        confirmation.setState(prev => ({
            ...prev,
            isVisible: false
        }));

        const { from, to } = context;
        let inputField;

        const fromBaseName = pathModule.basename(from);
        const domain = to.split(".").pop();
        const lDomain = domain.toLowerCase();
        const normalizedtoBaseName = to.replace(domain, lDomain); //This lines will change the UpperCase Domain names to lowercase.
        const toBaseName = pathModule.basename(normalizedtoBaseName);

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

    const handleSubmitRename = async (e) => {
        e.preventDefault();
        confirmation.setState(prev => ({
            ...prev,
            callback: handleOnConfirm
        }))

        const toBaseName = pathModule.basename(context.to);
        const fromBaseName = pathModule.basename(context.from);
        if (toBaseName == "") {
            return toast.error("The file name must not be empty");
        }
        else {
            rContext.setState(prev => ({
                ...prev,
                modalTitle: "Rename Confirmation",
                modalDesc: `Are you Sure? you are renaming a file: ${fromBaseName}. please confirm your Action`,
                isVisible: true
            }));
        }
    }

    const tableDataProps = {
        renameInputRef,
        handleSubmitRename,
        data: state.ftp_files,
        handleChangePath: handePath,
        currentPath: state.ftp_path
    }

    return (
        <>
            {!state.is_table_hidden && state.ftp_files ? (
                <section className='max-w-full w-[100%] text-blue-gray-400'>
                    <TableData
                        {...tableDataProps}
                    />
                </section>
            ) : (
                <TableSkeleton />
            )}

            {/* Rename Confirmation Modal  */}
            {
                confirmation.state.callback && (
                    <Confirmation />
                )
            }

            <Dialogs />
        </>
    );
};

export default Connect;