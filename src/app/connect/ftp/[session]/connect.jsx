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
        const handleFetchFiles = (data) => {
            const detail = data?.detail;
            const path = detail?.path || '/';
            const ignoreRootsUpdate = detail?.ignoreRootsUpdate || false;

            loadFiles(path, ignoreRootsUpdate);
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

    const loadFiles = async (path, ignoreRootsUpdate = false) => {

        // empty the selected items for for delete items component
        deleteContext.setItems([]);

        const filePath = path || state.ftp_path

        setState(prevState => (
            {
                ...prevState,
                is_table_hidden: true,
                ftp_path: filePath
            })
        );

        // Show Toaster and load the files too.
        const response = fetchFileData(filePath, ignoreRootsUpdate);

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

    /**
     * 
     * This is Main function to load the files and folder of a perticular path
     * 
     * @param {string} path 
     * @param {string} ignoreRootsUpdate 
     * 
     * @returns {Promise}
     */
    const fetchFileData = (path = "/", ignoreRootsUpdate = false) => new Promise(async (resolve, reject) => {
        let isRootReq = false; //Check wether the path is empty and then set this to true. so we can set the root folders for sidebar. 

        // Check if the path is empty so set it to "/"
        if (path === "") {
            path = "/";
        }

        if (path === "/") {
            isRootReq = true;
        }

        // Create a Unique object using spread.
        const paramData = { ...ftpParams };
        // Asign its Values.
        paramData.path = path

        try {
            // Create a fetch request
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paramData),
            });

            // fetch the json response
            const responseData = await response.json();

            // check if the response is failed so send the message.
            if (!response.ok) {
                const { message } = responseData.data;
                reject(message);
            }

            // Get sorted files and folder names by its type 
            const sorted = Object.values(responseData.data.ftp_files).sort((a, b) => {
                return b.type - a.type;
            });

            // Set the root folder if its the root path.
            isRootReq && sidebar.roots == null && sidebar.setRoots(sorted);

            let currentRootsPath = null;

            // Set the current Path Roots. if the path isnt root path.
            const crParse = pathModule.parse(path)
            const crBase = crParse.base; //Current Path basename

            // Filter the sorted files to get only the dirs.
            const dirs = sorted.filter((dir) => { return dir.type == 1 }); 
            
            // Get currentRoots state from sidebar Context.
            
            const { currentRoots } = sidebar
            // Get the index of the current Basename (path).
            const indexs = path.split("/").filter((p) => { return p !== '' });
1
            /**
             * Below code can be used in some conditions to prevent bugs..Currently not in use.
             * 
             * let currentValidPath;
             * 
             * findAndCheckOrSetValue(currentRoots, indexs[indexs.length - 1], (v, p) => {
             *   if (p !== null) {
             *       currentValidPath = p.split(".").shift();
             *   }
             * }, []);
             * 
             * && currentValidPath == indexs[0] 
             * 
             */

            if (!isRootReq && currentRoots !== null && dirs.length >= 1 && !ignoreRootsUpdate) {
                const newKeys = {};
                
                // Push every dir name to newKeys
                dirs.forEach(dir => {
                    newKeys[dir.name] = {}
                });

                // Create a duplicate of the currentRoots
                const current_roots = {...currentRoots};

                /** 
                 * The following helper function will helpful for changing child key's values recursively 
                 * */ 
                findAndCheckOrSetValue(current_roots, indexs[indexs.length - 1], (v, p) => {
                    /**
                     * our object's child values are changed
                     * now just update the context's state.
                     */

                    sidebar.setCurrentRoots(current_roots);
                }, [], newKeys); //Get the value and object path 
            }
            else if (!isRootReq && dirs.length >= 1 && !ignoreRootsUpdate) {
                const roots = {}

                dirs.forEach(dir => {
                    if (!roots[crBase])
                        roots[crBase] = {}

                    roots[crBase][dir.name] = {}
                })

                sidebar.setCurrentRoots(roots)
            }

            ftpDetailsContext.setState(prev => ({
                ...prev,
                currentPath: path,
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
        // Join the state path with the recived path..
        let followingPath = pathModule.join(state.ftp_path, folderPath);
        
        // Set the path in search context
        searchContext.setState(followingPath);

        // Also sset the path in ftp context.
        ftpDetailsContext.setState(prev => ({
            ...prev,
            currentPath: folderPath
        }))

        // Set the path in current Component State
        setState(prevState => (
            {
                ...prevState,
                ftp_path: followingPath
            })
        );

        // Load the files
        loadFiles(followingPath)
    };

    /**
     * 
     * @param {string} from 
     * @param {string} to 
     * @returns {void}
     */
    const renameFile = (from, to) => new Promise(async (resolve, reject) => {
        // Create a paramdata object from ftp params.
        const paramData = { ...ftpParams };

        // ReAsign their Values
        paramData.action = "rename";
        paramData.from = from;
        paramData.to = to;

        try {
            // Create A Fetch req.
            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paramData)
            })

            // Fetch json response
            const data = await response.json();

            // CHeck if the request is success
            if (!response.ok) {
                // throw the error
                throw new Error("Unable To Rename the file.");
            }

            // Resolve The recived Response.
            resolve({
                data,
                success: true
            });

        } catch (error) { //Catch error
            // Return reject the error
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

        // Get Basename of source Path
        const fromBaseName = pathModule.basename(from);
        // Get domain
        const domain = to.split(".").pop();
        // Create the domain to lowercase.
        const lDomain = domain.toLowerCase();
        // Normalize the domain 
        const normalizedtoBaseName = to.replace(domain, lDomain); //This lines will change the UpperCase Domain names to lowercase.

        // Get destination Basename.
        const toBaseName = pathModule.basename(normalizedtoBaseName);

        // Return error if the toBaseName is empty.
        if (toBaseName === "") {
            return toast.error("The File Name Must not be empty");
        }

        inputField = renameInputRef.current.querySelector("input")
        inputField.disabled = true;

        // Create a toast promise.
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