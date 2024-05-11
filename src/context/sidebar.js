"use client";

import React, { createContext, useContext, useState } from 'react';

export const SideBarContext = createContext();

export const useSideBarContext = () => {
    return useContext(SideBarContext);
}

const SideBarContextProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [roots, setRoots] = useState(null);
    const [currentRoots, setCurrentRoots] = useState(null);
    const [tree, setTree] = useState(null);

    return (
        <SideBarContext.Provider value={{open, setOpen, roots, setRoots, currentRoots, setCurrentRoots, tree, setTree}}>
            {children}
        </SideBarContext.Provider>
    );
};

export default SideBarContextProvider;
