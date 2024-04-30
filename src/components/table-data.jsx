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
import path from 'path';
import { useSearchPathContext } from '../context/search-path';
import { useBulkDeleteContext } from '../context/bulk-delete';
import { useConfirmationContext } from '../context/confirmation';

const TableData = (props) => {

    const context = useContext(RenameItemContext);
    const searchContext = useSearchPathContext();
    const deleteContext = useBulkDeleteContext();
    const confirmation = useConfirmationContext();
    const currentPath = props.currentPath;
    const TABLE_HEADS = ["Filename", "Permissions", "Size", "Last Modified", "Actions"];

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
        // Get object length.
        const len = Object.keys(deleteContext.items).length;
        
        // Check if the length is 0 or not
        if (len > 0) {
            deleteContext.setIsBtnHidden(false);
        } else {
            deleteContext.setIsBtnHidden(true);
        }

        //Set the Files, this will help to delete files in bulk. 
        for(const file of props.data){
            setFileItems(prev => ({
                ...prev,
                [path.join(currentPath, file.name)]: file.type
            }))
        }

    }, [deleteContext.items])


    const handleClick = (filename, perms) => {
        setState(prevState => ({
            ...prevState,
            perms: perms && Object.entries(perms),
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
        let i;


        if (state.isAllSelected && !e.target.checked) {
            setState(({
                ...state,
                isAllSelected: false
            }))
        } else if (!state.isAllSelected) { //Basic logic to cheeck wether the all checkboxes are checked.

            let selectedRows = 0;
            for (i = 0; i < rows.length; i++) {
                if (rows[i].checked) {
                    selectedRows++;
                }
            }

            if (selectedRows === rows.length) {
                setState(prev => ({
                    ...prev,
                    isAllSelected: true
                }))
            }
        }

        setSelectItems();
    }

    const setSelectItems = () => {
        const rows = Array
            .from(document.querySelectorAll(".selectFile:checked"))
            .map(ele => ele.value); //Get Checkbox values that are checked.

        let items = {};

        // check if the object key is available in the array and its checked
        // then put it in a new object
        for(const row of rows){
            if(row in fileItems){
                items[row] = fileItems[row];
            }
        };

        deleteContext.setItems(items);
    }

    const setRenameElement = (fileName, e) => {
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

    const handleRenameChange = (e) => {
        setState(prevState => ({
            ...prevState,
            renaming: {
                ...prevState.renaming,
                renamingName: e.target.value
            }
        }));
    };

    const dateTime = (intTime) => {
        const options = { month: "short", day: "numeric", year: "numeric" };

        const time = new Date(intTime);
        return time.toLocaleString("en-us", options);
    };

    const GetSize = ({ intSize }) => {
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        let unitIndex = 0;

        while (intSize >= 1024 && unitIndex < sizes.length - 1) {
            intSize /= 1024;
            unitIndex++;

        }
        return Math.round(Number(intSize).toFixed(2)) + " " + sizes[unitIndex];
    }

    const tableNameItemProps = {
        renameInputRef: props.renameInputRef,
        currentState: state.renaming,
        handleChangePath: props.handleChangePath,
        handleSubmitRename: props.handleSubmitRename
    }

    return (
        <>
            <table className="overflow-hidden w-full min-w-max text-left">
                <thead>
                    <tr>
                        <th className='border-b border-blue-gray-100 bg-blue-gray-50'>
                            <Checkbox onChange={handleSelectAll} checked={state.isAllSelected} />
                        </th>
                        {TABLE_HEADS.map((head) => (
                            <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal leading-none opacity-70"
                                >
                                    {head}
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
                    {props.data.map((file) => (
                        <tr key={file.name} className="even:bg-blue-gray-50/50 hover:bg-blue-gray-50 duration-[1.1s]" >
                            <td>
                                <Checkbox className='selectFile' onChange={handleChangeSelect} value={path.join(currentPath, file.name)} />
                            </td>
                            <td className='flex py-4'>
                                <TableNameItem
                                    fileInfo={file}
                                    {...tableNameItemProps}
                                />
                            </td>
                            <td>
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                    <Tooltip content="View Permissions">
                                        <IconButton
                                            variant="text"
                                            onClick={
                                                () => handleClick(file.name, file.userPermissions)
                                            }
                                            className="rounded-full h-10 w-10 bg-blue-gray-50" size='sm'>
                                            <i className="fas fa-info" />
                                        </IconButton>
                                    </Tooltip>
                                </Typography>
                            </td>
                            <td>
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                    {
                                        file.type === 1 ? "Folder" : <GetSize intSize={file.size} />
                                    }
                                </Typography>
                            </td>
                            <td>
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                    {dateTime(file.time)}
                                </Typography>
                            </td>
                            <td>
                                <div className="flex gap-3 ">
                                    <RenameItem fileName={file.name} setRenameElement={setRenameElement} />
                                    <DeleteItem fileName={file.name} type={file.type} />
                                </div>
                            </td>
                        </tr>
                    ))}
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
