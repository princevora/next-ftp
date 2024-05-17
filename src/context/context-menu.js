"use client";

import React, { createContext, useContext, useState } from 'react';

export const ContextMenu = createContext();

export const useContextMenu = () => {
    return useContext(ContextMenu);
}

const ContextMenuContextProvider = ({ children }) => {
    const [display, setDisplay] = useState("none");
    const [isVisible, setIsVisible] = useState(false);
    const [element, setElement] = useState(0); //0th index as default.
    const [position, setPosition] = useState({
        x: 0, 
        y: 0
    });
    const [renameCallback, setRenameCallback] = useState(null);

    return (
        <ContextMenu.Provider value={
            {
                display, 
                setDisplay, 
                position, 
                setPosition, 
                isVisible, 
                setIsVisible, 
                element, 
                setElement,
                renameCallback, 
                setRenameCallback
            }
        }>
            {children}
        </ContextMenu.Provider>
    );
};

export default ContextMenuContextProvider;
