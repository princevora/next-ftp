"use client"

import ErrorContextProvider from "./ftperrors-collapse/errors-collapse-context";
import RenameItemContextProvider from "./renameItem/RenameItemContext";
import RenameConfirmationContextProvider from "./renameItem/RenameConfirmation";
import CreateItemContextProvider from "./create-item/create-item";

const UseGlobalContext = ({ children }) => {
    return (
        <RenameItemContextProvider>
            <RenameConfirmationContextProvider>
                <CreateItemContextProvider>
                    <ErrorContextProvider>
                        {children}
                    </ErrorContextProvider>
                </CreateItemContextProvider>
            </RenameConfirmationContextProvider>
        </RenameItemContextProvider>
    )
}

export default UseGlobalContext;