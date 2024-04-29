"use client";

import React, { createContext, useContext, useState } from 'react';

export const ConfirmationContext = createContext();

export const useConfirmationContext = () => {
    return useContext(ConfirmationContext);
}

const ConfirmationContextProvider = ({ children }) => {

    const [state, setState] = useState({
        modalTitle: "Confirmation !",
        modalDesc: "Are you sure?",
        isVisible: false,
        isConfirmed: false,
        callback: null
    });

    return (
        <ConfirmationContext.Provider value={{state, setState}}>
            {children}
        </ConfirmationContext.Provider>
    );
};

export default ConfirmationContextProvider;
