"use client"

import ErrorContextProvider from "./ftperrors-collapse/errors-collapse-context";
import RenameItemContextProvider from "./renameItem/RenameItemContext";
import RenameConfirmationContextProvider from "./renameItem/RenameConfirmation";
import CreateItemContextProvider from "./create-item/create-item";
import FtpDetailsContextProvider from "./ftp-details-context";

const UseGlobalContext = ({ children }) => {
    return (
        <FtpDetailsContextProvider>
            <RenameItemContextProvider>
                <RenameConfirmationContextProvider>
                    <CreateItemContextProvider>
                        <ErrorContextProvider>
                            {children}
                        </ErrorContextProvider>
                    </CreateItemContextProvider>
                </RenameConfirmationContextProvider>
            </RenameItemContextProvider>
        </FtpDetailsContextProvider>
    )
}

export default UseGlobalContext;