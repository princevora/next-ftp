"use client"

import ErrorContextProvider from "./ftperrors-collapse/errors-collapse-context";
import RenameItemContextProvider from "./renameItem/RenameItemContext";
import RenameConfirmationContextProvider from "./renameItem/RenameConfirmation";
import CreateItemContextProvider from "./create-item";
import FtpDetailsContextProvider from "./ftp-details-context";
import PasswordContextProvider from "./encrypt-password";
import SearchPathContextProvider from "./search-path";

const UseGlobalContext = ({ children }) => {
    return (
        <FtpDetailsContextProvider> 
            <PasswordContextProvider>
                <RenameItemContextProvider>
                    <RenameConfirmationContextProvider>
                        <CreateItemContextProvider>
                            <SearchPathContextProvider>
                                <ErrorContextProvider>
                                    {children}
                                </ErrorContextProvider>
                            </SearchPathContextProvider>
                        </CreateItemContextProvider>
                    </RenameConfirmationContextProvider>
                </RenameItemContextProvider>
            </PasswordContextProvider>
        </FtpDetailsContextProvider>
    )
}

export default UseGlobalContext;