"use client";

import React, { createContext, useContext, useState } from 'react';

export const CreateItemContext = createContext();

export const useCreateItemContext = () => {
    return useContext(CreateItemContext);
}

const CreateItemContextProvider = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <CreateItemContext.Provider value={{isVisible, setIsVisible}}>
            {children}
        </CreateItemContext.Provider>
    );
};

export default CreateItemContextProvider;
