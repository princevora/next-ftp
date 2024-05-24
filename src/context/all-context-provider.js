"use client"

import RenameContext from "./RenameItemContext";
import RenameConfirmationContext from "./confirmation";
import CreateItemContext from "./create-item";
import FtpDetailContext from "./ftp-details-context";
import PasswordContext from "./encrypt-password";
import SearchPathContextProvider from "./search-path";
import BulkSelectContext from "./bulk-select";
import SidebarContext from "./sidebar";
import UploadContext from "./file-upload";
import ContextMenuContext from "./context-menu";
import MoveItemContext from "./move-item";
import RefContext from "./ref";

const UseGlobalContext = ({ children }) => {
    return (
        <RefContext>
            <UploadContext>
                <MoveItemContext>
                    <SidebarContext>
                        <RenameContext>
                            <PasswordContext>
                                <CreateItemContext>
                                    <BulkSelectContext>
                                        <FtpDetailContext>
                                            <ContextMenuContext>
                                                <RenameConfirmationContext>
                                                    <SearchPathContextProvider>
                                                        {children}
                                                    </SearchPathContextProvider>
                                                </RenameConfirmationContext>
                                            </ContextMenuContext>
                                        </FtpDetailContext>
                                    </BulkSelectContext>
                                </CreateItemContext>
                            </PasswordContext>
                        </RenameContext>
                    </SidebarContext>
                </MoveItemContext>
            </UploadContext>
        </RefContext>
    );
};


export default UseGlobalContext;