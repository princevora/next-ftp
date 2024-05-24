import React, { useContext, useState, useEffect } from 'react';
import {
    Tooltip,
    Typography,
    IconButton,
    Checkbox,
} from "@material-tailwind/react";
import FilePermsDialog from "@/components/dialogs/file-permissions-dialog";
import TableNameItem from "@/components/table-name-item";
import RenameItem from "./table-action-components/rename-item";
import { RenameItemContext } from '../context/RenameItemContext';
import PreviousPath from "./table-action-components/previous-path";
import DeleteItem from "./table-action-components/delete-item";
import DownloadItem from "./table-action-components/download-item";
import path from 'path';
import { useSearchPathContext } from '../context/search-path';
import { useBulkSelectContext } from '../context/bulk-select';
import { useConfirmationContext } from '../context/confirmation';
import ContextManu from "./context-menu";
import { useContextMenu } from '@/context/context-menu';

function TableData (props){

    const context = useContext(RenameItemContext);
    const searchContext = useSearchPathContext();
    const deleteContext = useBulkSelectContext();
    const confirmation = useConfirmationContext();
    const currentPath = props.currentPath;
    const TABLE_HEADS = { "Filename": "", "Permissions": "hidden sm:table-cell", "Size": "hidden sm:table-cell", "Last Modified": "hidden sm:table-cell", "Actions": "" };
    const contextMenu = useContextMenu();

    const [fileItems, setFileItems] = useState();
    const [state, setState] = useState({
        isAllSelected: false,
        openPopover: false,
        modalPermsFIle: "",
        open: false,
        perms: null,
        renaming: {
            name: "",
            isRenaming: false,
            renamingName: "" //Used to track the state of rename input
        }
    });

    const parentPath = path.dirname(searchContext.state);

    useEffect(() => {

        // Close context menu on click..
        const handleContextMenuExit = () => {
            let value = contextMenu.isVisible;
            if (value) {
                contextMenu.setIsVisible(!value);
            }
        }


        const handleSetRename = (data) => {
            const fileName = data?.detail.file_name;
            setRenameElement(fileName);
        }

        window.addEventListener("click", handleContextMenuExit);
        window.addEventListener("set:rename_ele", handleSetRename);

        // Get object length.
        const len = Object.keys(deleteContext.items).length;

        // Check if the length is 0 or not
        if (len > 0) {
            deleteContext.setIsDisabled(false);
        } else {
            deleteContext.setIsDisabled(true);
        }

        //Set the Files, this will help to delete files in bulk. 
        for (const file of props.data) {
            setFileItems(prev => ({
                ...prev,
                [path.join(currentPath, file.name)]: file.type
            }))
        }

        return () => {
            window.removeEventListener("set:rename_ele", handleSetRename)
            window.removeEventListener("click", handleContextMenuExit);
        }

    }, [deleteContext.items])


    const handleClick = (filename, perms) => {
        setState(prevState => ({
            ...prevState,
            perms,
            open: !prevState.open,
            modalPermsFIle: filename
        }));
    };

    const handleSelectAll = () => {
        const rows = document.getElementsByClassName("selectFile");

        let i;

        for (i = 0; i < rows.length; i++) {
            rows[i].checked = !state.isAllSelected;
        }

        setState(prevState => ({
            ...prevState,
            isAllSelected: !prevState.isAllSelected
        }));

        setSelectItems();
    };

    const handleChangeSelect = (e) => {
        const rows = document.getElementsByClassName("selectFile");

        if (state.isAllSelected && !e.target.checked) {
            setState(({
                ...state,
                isAllSelected: false
            }))
        }

        setSelectItems();
    }

    const setSelectItems = () => {
        const checkedRows = document.querySelectorAll(".selectFile:checked");
        const normalRows = document.querySelectorAll(".selectFile");

        const rows = Array
            .from(checkedRows)
            .map(ele => ele.value); //Get Checkbox values that are checked.

        // Check if the length are same or not.
        const selectAllStateValue = normalRows.length === rows.length;

        setState(prev => ({
            ...prev,
            isAllSelected: selectAllStateValue
        }))

        let items = {};

        // check if the object key is available in the array and its checked
        // then put it in a new object

        for (const row of rows) {
            if (row in fileItems) {
                items[row] = fileItems[row];
            }
        };

        deleteContext.setItems(items);
    }

    const setRenameElement = (fileName) => {
        let isRenaming = !state.renaming.isRenaming;

        if (state.renaming.isRenaming && state.renaming.name !== fileName) {
            isRenaming = true;
        }

        // context may occur bugs so this is required to prevent these kind of bugs
        context.setItemName("", "");

        setState(prevState => ({
            ...prevState,
            renaming: {
                ...prevState.renaming,
                name: fileName,
                isRenaming: isRenaming
            }
        }));
    };

    // const handleRenameChange = (e) => {
    //     setState(prevState => ({
    //         ...prevState,
    //         renaming: {
    //             ...prevState.renaming,
    //             renamingName: e.target.value
    //         }
    //     }));
    // };

    const dateTime = (intTime) => {
        const options = { month: "short", day: "numeric", year: "numeric" };

        const time = new Date(intTime);
        return time.toLocaleString("en-us", options);
    };

    const getSize = (intSize) => {
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        let unitIndex = 0;

        while (intSize >= 1024 && unitIndex < sizes.length - 1) {
            intSize /= 1024;
            unitIndex++;

        }
        return Math.round(Number(intSize).toFixed(2)) + " " + sizes[unitIndex];
    }

    const handleRightClick = (e, file) => {
        e.preventDefault();
        const { isVisible } = contextMenu;
        contextMenu.setIsVisible(!isVisible);

        if (!isVisible === true) {
            contextMenu.setDisplay("block");
            contextMenu.setElement(file);

            // to call the setrename element we will save the function in the state.

            contextMenu.setPosition({
                x: e.clientX,
                y: e.clientY,
            })
        } else {
            contextMenu.setDisplay("none");
        }
    }

    const handleClickToSelect = (filePath, index) => {

        // Set the Items TO empty 
        deleteContext.setItems({});

        const rows = document.getElementsByClassName("selectFile");

        /**
         * Get Checked Rows While our selected (clicked) row might be checked or unchecked
         * So we will assign it true
         * then we will run a loop for the checked boxes as we given the selected row its true value
         * and even if our selected row might be exists in checked boxes
         * it will dont affect our app behaviour because we are running the loop for checked rows not for the all rows. 
         */
        const checkedRows = document.querySelectorAll(".selectFile:checked");

        for (const row of checkedRows) {
            row.checked = false;
        }

        rows[index].checked = true;


        deleteContext.setItems(filePath);
        setSelectItems();
    }

    const tableNameItemProps = {
        currentState: state.renaming,
        handleChangePath: props.handleChangePath,
        handleSubmitRename: props.handleSubmitRename,
    }

    return (
        <>
            {/* Context menu */}
            <ContextManu />

            <table className="overflow-hidden w-full text-left">
                <thead>
                    <tr>
                        <th className='border-b border-blue-gray-100 bg-blue-gray-50'>
                            <Checkbox onChange={handleSelectAll} checked={state.isAllSelected} />
                        </th>
                        {Object.entries(TABLE_HEADS).map((head, index) => (
                            <th key={index} className={`border-b border-blue-gray-100 bg-blue-gray-50 p-4 ${head[1]}`}>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal leading-none opacity-70"
                                >
                                    {head[0]}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className='max-w-full'>
                    {
                        currentPath !== "." && currentPath !== "/" &&

                        <PreviousPath previousPath={parentPath} />
                    }
                    {props.data.map((file, index) => {
                        const filePathName = path.join(currentPath, file.name)
                        const isSelected = Object.keys(deleteContext.items).includes(filePathName);

                        return (
                            <tr
                                onContextMenuCapture={(event) => handleRightClick(event, file)}
                                key={index}
                                className={`relative even:bg-blue-gray-50/50 hover:bg-blue-gray-50 ${isSelected ? "bg-gradient-to-l from-base-300 to-blue-gray-50" : "duration-[0.5s]"}`}
                            >
                                {/* {console.log()} */}
                                <td>
                                    <Checkbox className='selectFile' onChange={handleChangeSelect} value={filePathName} />
                                </td>
                                <td 
                                    className='flex py-4' 
                                    onClick={(e) => {
                                        if(file.type == 1) return false;

                                        handleClickToSelect(filePathName, index)
                                    }}
                                >
                                    <TableNameItem
                                        fileInfo={file}
                                        {...tableNameItemProps}
                                    />
                                </td>
                                <td className='sm:table-cell hidden'>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        <Tooltip content="View Permissions">
                                            <IconButton
                                                variant="text"
                                                onClick={
                                                    () => handleClick(file.name, file)
                                                }
                                                className="rounded-full h-10 w-10 bg-blue-gray-50" size='sm'>
                                                <i className="fas fa-info" />
                                            </IconButton>
                                        </Tooltip>
                                    </Typography>
                                </td>
                                <td className='sm:table-cell hidden'>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {
                                            file.type === 1 ? "Folder" : getSize(file.size)
                                        }
                                    </Typography>
                                </td>
                                <td className='sm:table-cell hidden'>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {dateTime(file.time)}
                                    </Typography>
                                </td>
                                <td>
                                    <div className="flex gap-3 ">
                                        <RenameItem fileName={file.name} setRenameElement={setRenameElement} />
                                        <DeleteItem fileName={file.name} type={file.type} />

                                        {file.type !== 1 && (
                                            <DownloadItem fileName={file.name} />
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table >

            {/* Modal */}
            {
                state.perms && (
                    <FilePermsDialog
                        handleClick={handleClick}
                        fileName={state.modalPermsFIle}
                        permissionData={state.perms}
                        open={state.open}
                    />
                )
            }
        </>
    );
};

export default TableData;
