import { RenameConfirmationContext } from "../../context/renameItem/RenameConfirmation";
import { RenameItemContext } from "../../context/renameItem/RenameItemContext";
import React, { useContext, useRef } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import path from "path";

export default function RenameConfirmation({ handleOnConfirm }) {

    const context = useContext(RenameConfirmationContext);
    const open = context.isVisible;
    const dialogElem = useRef(null);
    const rContext = useContext(RenameItemContext);

    const handleOpen = () => {
        context.setVisible(!open);
    };

    const handleConfirm = (value) => {
        context.setConfirm(value);
        
        if(value){
            return handleOnConfirm();
        }

        return;
    }

    return (
        <Dialog open={open} handler={handleOpen}>
            <DialogHeader>Are you Sure?, You want to rename: {rContext.from ? path.basename(rContext.from) : "Unknown"} File</DialogHeader>
            <DialogBody>
                You are renaming an existing file. Please confirm Your Action.
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    onClick={() => handleConfirm(false)}
                    className="mr-1"
                >
                    <span>Cancel</span>
                </Button>
                <Button variant="gradient" ref={dialogElem} color="green" onClick={() => handleConfirm(true)}>
                    <span>Confirm</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
}