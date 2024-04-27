import React, { useContext, useState } from 'react';
import {
    Tooltip,
    Typography,
    IconButton,
    Checkbox,
} from "@material-tailwind/react";
import { TrashIcon } from '@heroicons/react/24/solid';
import FilePermsDialog from "@/components/dialogs/file-permissions-dialog";
import TableNameItem from "@/components/table-name-item";
import RenameItem from "./table-action-components/rename-item";
import { RenameItemContext } from '../context/renameItem/RenameItemContext';
import PreviousPath from "./table-action-components/previous-path";
import path from 'path';
import { useSearchPathContext } from '@/context/search-path';

const TableData = (props) => {

    const context = useContext(RenameItemContext);
    const searchContext = useSearchPathContext();
    const currentPath = props.currentPath;
    const TABLE_HEADS = ["Filename", "Permissions", "Size", "Last Modified", "Actions"];

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
        setState(prevState => ({
            ...prevState,
            isAllSelected: !prevState.isAllSelected
        }));

        let i;

        for (i = 0; i < rows.length; i++) {
            rows[i].checked = !state.isAllSelected;
        }
    };

    const setRenameElement = (fileName, e) => {
        e.preventDefault();

        let isRenaming = !state.renaming.isRenaming;

        if (state.renaming.isRenaming && state.renaming.name !== fileName) {
            isRenaming = true;
        }

        // context may occur bugs so this is required to prevent these kind of bugs
        context.setItemName("",""); 

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
                            <Checkbox onChange={handleSelectAll} value={state.isAllSelected} />
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

                        <PreviousPath previousPath={parentPath}/>
                    }
                    {props.data.map((file) => (
                        <tr key={file.name} className="even:bg-blue-gray-50/50 hover:bg-blue-gray-50 duration-[1.1s]">
                            <td>
                                <Checkbox className='selectFile' />
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
                                    <GetSize intSize={file.size} />
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
                                    <Typography as="a" href="#" variant="small" color="current" className="font-medium">
                                        <Tooltip content={`Delete: ${file.name}`}>
                                            <TrashIcon
                                                onClick={
                                                    (e) => setRenameElement(file.name, e)
                                                }
                                                height={15}
                                                width={15}
                                            />
                                        </Tooltip>
                                    </Typography>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {state.perms && (
                <FilePermsDialog
                    handleClick={handleClick}
                    fileName={state.modalPermsFIle}
                    permissionData={state.perms}
                    open={state.open}
                />
            )}
        </>
    );
};

export default TableData;
