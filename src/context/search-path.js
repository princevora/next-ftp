"use client";

import React, { createContext, useContext, useState } from 'react';

export const SearchPathContext = createContext();

export const useSearchPathContext = () => {
    return useContext(SearchPathContext);
}

const SearchPathContextProvider = ({ children }) => {
    const [state, setState] = useState("/");

    return (
        <SearchPathContext.Provider value={{state, setState}}>
            {children}
        </SearchPathContext.Provider>
    );
};

export default SearchPathContextProvider;
