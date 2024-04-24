"use client";

import React, { createContext, useContext, useState } from 'react';

export const CreateItemContext = createContext();

export const useCreateItemContext = () => {
    return useContext(CreateItemContext);
}

const CreateItemContextProvider = ({ children }) => {
    
    const handleSetItemName = (data) => {
        setState(data);
    };
    
    const [state, setState] = useState({
        type: 1,
        itemName: "",
        isVisible: false //handle open for Dialog-modal
    });

    return (
        <CreateItemContext.Provider value={{state, setState}}>
            {children}
        </CreateItemContext.Provider>
    );
};

export default CreateItemContextProvider;
