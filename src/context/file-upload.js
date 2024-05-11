"use client";

import React, { createContext, useContext, useState } from 'react';

export const UploadFileContext = createContext();

export const useUploadFileContext = () => {
    return useContext(UploadFileContext);
}

const UploadFileContextProvider = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <UploadFileContext.Provider value={{isVisible, setIsVisible}}>
            {children}
        </UploadFileContext.Provider>
    );
};

export default UploadFileContextProvider;
