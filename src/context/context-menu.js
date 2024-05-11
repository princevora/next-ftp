"use client";

import React, { createContext, useContext, useState } from 'react';

export const ContextMenu = createContext();

export const useContextMenu = () => {
    return useContext(ContextMenu);
}

const ContextMenuContextProvider = ({ children }) => {
    const [display, setDisplay] = useState("none");
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({
        x: 0, 
        y: 0
    });

    return (
        <ContextMenu.Provider value={{display, setDisplay, position, setPosition, isVisible, setIsVisible}}>
            {children}
        </ContextMenu.Provider>
    );
};

export default ContextMenuContextProvider;
