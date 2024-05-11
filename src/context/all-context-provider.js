"use client"

import ErrorContextProvider from "./ftperrors-collapse/errors-collapse-context";
import RenameItemContextProvider from "./RenameItemContext";
import RenameConfirmationContextProvider from "./confirmation";
import CreateItemContextProvider from "./create-item";
import FtpDetailsContextProvider from "./ftp-details-context";
import PasswordContextProvider from "./encrypt-password";
import SearchPathContextProvider from "./search-path";
import BulkDeleteContextProvider from "./bulk-delete";
import SideBarContextProvider from "./sidebar";
import UploadFileContextProvider from "./file-upload";
import ContextMenuContextProvider from "./context-menu";

const UseGlobalContext = ({ children }) => {
    return (
        <FtpDetailsContextProvider>
            <PasswordContextProvider>
                <RenameItemContextProvider>
                    <RenameConfirmationContextProvider>
                        <SearchPathContextProvider>
                            <CreateItemContextProvider>
                                <BulkDeleteContextProvider>
                                    <SideBarContextProvider>
                                        <UploadFileContextProvider>
                                            <ContextMenuContextProvider>
                                                {children}
                                            </ContextMenuContextProvider>
                                        </UploadFileContextProvider>
                                    </SideBarContextProvider>
                                </BulkDeleteContextProvider>
                            </CreateItemContextProvider>
                        </SearchPathContextProvider>
                    </RenameConfirmationContextProvider>
                </RenameItemContextProvider>
            </PasswordContextProvider>
        </FtpDetailsContextProvider>
    )
}

export default UseGlobalContext;