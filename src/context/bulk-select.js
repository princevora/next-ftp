"use client";

import React, { createContext, useCallback, useContext, useState } from 'react';

export const BulkSelectContext = createContext();

export const useBulkSelectContext = () => {
    return useContext(BulkSelectContext);
}

const BulkSelectContextProvider = ({ children }) => {
    const [items, setItems] = useState({});
    const [isDisabled, setIsDisabled] = useState(true);
    
    /**
     * For Set the items to moving, will help to disable the button
     */
    const [isItemsMoving, setIsItemsMoving] = useState(false);
    const [movableItems, setMovableItems] = useState({});

    return (
        <BulkSelectContext.Provider value={{items, setItems, isDisabled, setIsDisabled, isItemsMoving, setIsItemsMoving, movableItems, setMovableItems}}>
            {children}
        </BulkSelectContext.Provider>
    );
};

export default BulkSelectContextProvider;
