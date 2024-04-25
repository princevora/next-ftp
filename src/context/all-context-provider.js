"use client"

import ErrorContextProvider from "./ftperrors-collapse/errors-collapse-context";
import RenameItemContextProvider from "./renameItem/RenameItemContext";
import RenameConfirmationContextProvider from "./renameItem/RenameConfirmation";
import CreateItemContextProvider from "./create-item/create-item";
import FtpDetailsContextProvider from "./ftp-details-context";
import PasswordContextProvider from "./encrypt-password";

const UseGlobalContext = ({ children }) => {
    return (
        <FtpDetailsContextProvider>
            <PasswordContextProvider>
                <RenameItemContextProvider>
                    <RenameConfirmationContextProvider>
                        <CreateItemContextProvider>
                            <ErrorContextProvider>
                                {children}
                            </ErrorContextProvider>
                        </CreateItemContextProvider>
                    </RenameConfirmationContextProvider>
                </RenameItemContextProvider>
            </PasswordContextProvider>
        </FtpDetailsContextProvider>
    )
}

export default UseGlobalContext;