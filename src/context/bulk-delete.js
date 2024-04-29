"use client";

import React, { createContext, useCallback, useContext, useState } from 'react';

export const BulkDeleteContext = createContext();

export const useBulkDeleteContext = () => {
    return useContext(BulkDeleteContext);
}

const BulkDeleteContextProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [isBtnHidden, setIsBtnHidden] = useState(true);

    return (
        <BulkDeleteContext.Provider value={{items, setItems, isBtnHidden, setIsBtnHidden}}>
            {children}
        </BulkDeleteContext.Provider>
    );
};

export default BulkDeleteContextProvider;
