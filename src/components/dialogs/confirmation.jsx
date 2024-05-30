import { useConfirmationContext } from "../../context/confirmation";
import React, { useRef } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

export default function Confirmation() {

    const context = useConfirmationContext();
    const open = context.state.isVisible;
    const dialogElem = useRef(null);
    let title = context.state.modalTitle;
    title = title.length > 20 ? title.slice(0, 40) + "..." : title;

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
        <Dialog open={open} handler={handleOpen} className="h-auto">
            <DialogHeader>{title}</DialogHeader>
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