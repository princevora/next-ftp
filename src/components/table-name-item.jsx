import { Typography, Input, input } from "@material-tailwind/react";
import { useContext } from 'react';
import { RenameItemContext } from "../context/renameItem/RenameItemContext";
import ItemIcon from "./item-icons";
import path from "path";

const TableNameItem = (props) => {
    const context = useContext(RenameItemContext);
    const toPath = context.to;

    const handleChange = (e) => {

        const fromPath = path.join(props.currentPath, props.fileInfo.name);
        const inputValue = e.target.value;
        let toPath = "";

        if(inputValue !== ""){
            toPath  = path.join(props.currentPath, e.target.value);
        }
        
        context.setItemName(fromPath, toPath);
    };

    const showInput = (currentName, handleChange) => {
        return (
            <form onSubmit={props.handleSubmitRename}>
                <Input
                    ref={props.renameInputRef}
                    onChange={handleChange}
                    label={`Name for ${currentName.length > 15 ? currentName.substring(0, 15) + "..." : currentName}`}
                />
            </form>
        );
    };

    const nameWithLink = (name, type) => {
        return (
            <>
                <ItemIcon fileName={name} fileType={type}/>
                <Typography variant="small" color="blue-gray" className="font-normal px-2">
                    <a href='#' onClick={() => props.handleChangePath(name)}>
                        {printName(name)}
                    </a>
                </Typography>
            </>
        );
    };

    const name = (name, type) => {
        return (
            <>
                <ItemIcon fileName={name} fileType={type} />
                <Typography variant="small" as="a" color="blue-gray" className="font-normal px-2">
                    {printName(name)}
                </Typography>
            </>
        );
    };

    const printName = (fileName) => {
        return fileName.length > 32 ? fileName.substring(0, 32) + "..." : fileName;
    };

    return (
        <>
            {props.fileInfo.name === props.currentState.name && props.currentState.isRenaming ? (
                showInput(props.fileInfo.name, handleChange)
            ) : props.fileInfo.type === 1 ? (
                nameWithLink(props.fileInfo.name, props.fileInfo.type)
            ) : (
                name(props.fileInfo.name, props.fileInfo.type)
            )}
        </>
    );
};

export default TableNameItem;
