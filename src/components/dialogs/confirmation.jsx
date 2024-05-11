import { useConfirmationContext } from "../../context/confirmation";
import { RenameItemContext } from "../../context/RenameItemContext";
import React, { useContext, useRef } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { Html } from "next/document";

export default function Confirmation({ handleOnConfirm }) {

    const context = useConfirmationContext();
    const open = context.state.isVisible;
    const dialogElem = useRef(null);

    const handleOpen = () => {
        context.setState(prev => ({
            ...prev,
            isVisible: !open
        }))
    };

    const handleConfirm = (value) => {
        context.setState(prev => ({
            ...prev,
            isVisible: value
        }))

        if(value){
            context.state.callback();
        }
    }

    return (
        <Dialog open={open} handler={handleOpen}>
            <DialogHeader>{context.state.modalTitle}</DialogHeader>
            <DialogBody>
                {context.state.modalDesc}
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