"use client";

import React, { createContext, useState } from 'react';

export const RenameConfirmationContext = createContext();

const RenameConfirmationContextProvider = ({ children }) => {
    
    const handleSetVisible = (value) => {
        setState({
            ...state,
            isVisible: value,
        });
    };

    const handleConfirmRename = (value) => {
        setState({
            ...state,
            isRenameConfirmed: value
        })
    }
    
    const [state, setState] = useState({
        isVisible: false,
        isRenameConfirmed: false,
        setVisible: handleSetVisible,
        setConfirm: handleConfirmRename
    });


    return (
        <RenameConfirmationContext.Provider value={state}>
            {children}
        </RenameConfirmationContext.Provider>
    );
};

export default RenameConfirmationContextProvider;
