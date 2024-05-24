import React, { useState } from "react";
import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import SearchPath from "@/components/tableDataHeader/search-path";
import RefreshFiles from "@/components/tableDataHeader/refresh-files";
import CreateItem from "@/components/tableDataHeader/create-item";
import DeleteSelected from "@/components/tableDataHeader/delete-selected";
import UploadItems from "./tableDataHeader/upload-items";
import MoveItemsBulk from "./tableDataHeader/move-items";
import PasteItem from "./tableDataHeader/paste-item";
import { useSideBarContext } from "@/context/sidebar";
import { useBulkSelectContext } from "@/context/bulk-select";

export function Navbar() {
  const sideBarContext = useSideBarContext();
  const selectContext = useBulkSelectContext();
  const open = sideBarContext.open;

  const handleOpen = () => sideBarContext.setOpen((prev) => !prev);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && sideBarContext.setOpen(false)
    );
  }, []);

  return (
    <MTNavbar shadow={false} fullWidth className="max-w-full border-0 sticky top-0 z-50 shadow-lg overflow-clip overflow-x-hidden">
      <div className="flex justify-between items-center flex-wrap ">
        {/* Icon button and heading */}
        <div className="flex items-center">
          <Typography variant="small" color="blue-gray" className="font-bold">
            Next {'\u00B7'} FTP
          </Typography>

          <IconButton
            variant="text"
            color="gray"
            onClick={handleOpen}
            className="ml-2 lg:hidden flex items-center flex-none"
          >
            {open ? (
              <XMarkIcon strokeWidth={2} className="h-6 w-6" />
            ) : (
              <Bars3Icon strokeWidth={2} className="h-6 w-6" />
            )}
          </IconButton>
        </div>

        {/* Actions */}
        <div className=" sm:w-auto flex justify-end sm:justify-start items-center mt-2 sm:mt-0">
          <div className="flex items-center gap-2 border-gray-200 px-2 flex-wrap">
            <DeleteSelected />{
            console.log(selectContext.isItemsMoving , selectContext.movableItems)}
            {selectContext.isItemsMoving && Object.keys(selectContext.movableItems).length !== 0 && (
              <PasteItem />
            )}
            <MoveItemsBulk />
            <span className="divider divider-horizontal divide-neutral"></span>
            <RefreshFiles />
            <UploadItems />
            <CreateItem />
            <SearchPath />
          </div>
        </div>
      </div>
    </MTNavbar>
  );
}

export default Navbar;
