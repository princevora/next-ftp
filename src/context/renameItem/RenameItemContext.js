"use client";

import React, { createContext, useState } from 'react';

export const RenameItemContext = createContext();

const RenameItemContextProvider = ({ children }) => {
    
    const handleSetItemName = (fromPath, toPath) => {
        setState({
            ...state,
            from: fromPath,
            to: toPath,
        });
    };
    
    const [state, setState] = useState({
        from: "",
        to: "",
        setItemName: handleSetItemName,
    });


    return (
        <RenameItemContext.Provider value={state}>
            {children}
        </RenameItemContext.Provider>
    );
};

export default RenameItemContextProvider;
