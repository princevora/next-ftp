"use client";

import React, { createContext, useContext, useRef } from 'react';

export const Refcontext = createContext();

export const useRefcontext = () => {
    return useContext(Refcontext);
}

const RefcontextContextProvider = ({ children }) => {
    const ref = useRef();

    return (
        <Refcontext.Provider value={ref}>
            {children}
        </Refcontext.Provider>
    );
};

export default RefcontextContextProvider;
