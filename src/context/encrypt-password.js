"use client";

import React, { createContext, useContext, useState } from 'react';

export const PasswordContext = createContext();

export const usePasswordContext = () => {
    return useContext(PasswordContext);
}

const PasswordContextProvider = ({ children }) => {
    const password = "XkhZG4fW2t2W";

    return (
        <PasswordContext.Provider value={password}>
            {children}
        </PasswordContext.Provider>
    );
};

export default PasswordContextProvider;
