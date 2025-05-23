"use client";

import React from "react";

// Individual contexts
import RenameContext from "./RenameItemContext";
import RenameConfirmationContext from "./confirmation";
import CreateItemContext from "./create-item";
import MoveItemContext from "./move-item";
import UploadContext from "./file-upload";
import SidebarContext from "./sidebar";
import BulkSelectContext from "./bulk-select";
import ContextMenuContext from "./context-menu";
import RefContext from "./ref";
import FtpDetailContext from "./ftp-details-context";
import PasswordContext from "./encrypt-password";
import SearchPathContextProvider from "./search-path";

// Compose helper
const composeProviders = (...providers) =>
  providers.reduce(
    (Accumulated, Current) =>
      ({ children }) =>
        (
          <Accumulated>
            <Current>{children}</Current>
          </Accumulated>
        ),
    ({ children }) => <>{children}</>
  );

// Grouped providers for scalability
const FileSystemContexts = ({ children }) => (
  <RenameContext>
    <RenameConfirmationContext>
      <CreateItemContext>
        <MoveItemContext>
          <UploadContext>{children}</UploadContext>
        </MoveItemContext>
      </CreateItemContext>
    </RenameConfirmationContext>
  </RenameContext>
);

const UIContexts = ({ children }) => (
  <SidebarContext>
    <BulkSelectContext>
      <ContextMenuContext>{children}</ContextMenuContext>
    </BulkSelectContext>
  </SidebarContext>
);

// Final composition
const AllContexts = composeProviders(
  RefContext,
  FtpDetailContext,
  PasswordContext,
  SearchPathContextProvider,
  FileSystemContexts,
  UIContexts
);

const UseGlobalContext = ({ children }) => {
  return <AllContexts>{children}</AllContexts>;
};

export default UseGlobalContext;
