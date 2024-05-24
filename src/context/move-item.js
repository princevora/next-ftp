"use client";

import React, { createContext, useContext, useState } from 'react';

export const MoveItemContext = createContext();

export const useMoveItemContext = () => {
    return useContext(MoveItemContext);
}

const MoveItemContextProvider = ({ children }) => {
    const [fromPath, setFromPath] = useState("");

    return (
        <MoveItemContext.Provider value={{fromPath, setFromPath}}>
            {children}
        </MoveItemContext.Provider>
    );
};

export default MoveItemContextProvider;
