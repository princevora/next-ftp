import { RenameConfirmationContext } from '@/context/renameItem/RenameConfirmation';
import { ErrorContext } from '@/context/ftperrors-collapse/errors-collapse-context';
import { RenameItemContext } from "@/context/renameItem/RenameItemContext";
import { Card, Collapse, Tooltip, IconButton } from '@material-tailwind/react';
import RenameConfirmation from "@/components/dialogs/rename-confirmation";
import React, { useState, useEffect, useContext, useRef } from 'react';
import TableSkeleton from "@/components/skeletons/table-skeleton";
import SearchPath from "@/components/tableDataHeader/search-path";
import CreateItem from "@/components/tableDataHeader/create-item";
import ImportHotToast from "@/components/import-toaster"
import FtpErrors from "@/components/errors/errors";
import Action from "@/components/errors/errors-speed-dial"
import TableData from "@/components/table-data";
import toast from 'react-hot-toast';
import path from 'path';
import CreateItemDialog from "@/components/dialogs/create-item";

const Connect = (props) => {

  const context = useContext(RenameItemContext);
  const errorContext = useContext(ErrorContext);
  const rContext = useContext(RenameConfirmationContext); //Rename confirmation context

  const apiEndpoint = "/api/ftp";

  const [state, setState] = useState({
    ftp_host: props.ftp_host,
    ftp_username: props.ftp_username,
    ftp_password: props.ftp_password,
    is_table_hidden: null,
    ftp_files: null,
    ftp_path: "/",
    searchPath: "/",
    ftp_errors_collapse_open: false,
    ftp_errors: [
      "Cant Connect to your ftp server",
      "Unable to connect to ftp",
      "provided fields are empty",
      "Rename name must not be empty",
      "Please select files to delete",
    ]
  });

  const renameInputRef = useRef(null);

  let ftpParams = {
    host: state.ftp_host,
    user: state.ftp_username,
    pass: state.ftp_password,
    action: "fetch"
  };

  useEffect(() => {
    fetchFileData(state.ftp_path);

    // const fileExt = "htdocs/ppafas.PSDS";
    // console.log(fileExt.split(".").pop().toLowerCase());
  }, []);

  const fetchFileData = async (path = "/") => {
    if (path === "") path = "/";
    setState(prevState => (
      {
        ...prevState,
        is_table_hidden: true
      })
    );

    const paramData = { ...ftpParams };
    paramData.path = path

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paramData),
      });

      if (!response.ok) {
        throw new Error("Unable To Complete The Request");
      }

      const responseData = await response.json();
      const sorted = Object.values(responseData.data.ftp_files).sort((a, b) => {
        return b.type - a.type;
      });

      setState(prevState => (
        {
          ...prevState,
          is_table_hidden: false,
          searchPath: path,
          ftp_path: path,
          ftp_files: sorted
        })
      );

    } catch (error) {
      setState(prevState => (
        {
          ...prevState,
          ftp_errors: [
            ...prevState.ftp_errors,
            "Unable To Complete The Request"
          ]
        })
      );
    }
  };

  const handePath = (folderPath) => {
    let followingPath = path.join(state.ftp_path, folderPath);

    setState(prevState => (
      {
        ...prevState,
        ftp_path: followingPath
      })
    );

    fetchFileData(followingPath);
  };

  const handleSearchPath = (e) => {
    setState(prevState => (
      {
        ...prevState,
        searchPath: e.target.value
      })
    );
  };

  const handleSearch = () => {
    if (state.ftp_path !== state.searchPath) {
      fetchFileData(state.searchPath);
    }

    setState(prevState => (
      {
        ...prevState,
        ftp_path: state.searchPath
      })
    );
  };

  const handleSubmitRename = async (e) => {
    e.preventDefault();

    rContext.setVisible(true);
    return;
  }

  const handleOnConfirm = async () => {
    const { from, to } = context;
    let inputField;

    const fromBaseName = path.basename(from);
    const domain = to.split(".").pop();
    const lDomain = domain.toLowerCase();
    const normalizedtoBaseName = to.replace(domain, lDomain); //This lines will change the UpperCase Domain names to lowercase.
    const toBaseName = path.basename(normalizedtoBaseName);

    if (toBaseName === "") {
      return toast.error("The File Name Must not be empty");
    }

    inputField = renameInputRef.current.querySelector("input")
    inputField.disabled = true;

    toast.promise(
      renameFile(from, normalizedtoBaseName),
      {
        loading: `Renaming file: ${fromBaseName}`,
        success: `Successfully Renamed the File to: ${toBaseName}`,
        error: "Unable to rename the file, please try again later"
      }
    ).then((rsp) => {
      if (rsp.data.success) {
        fetchFileData(state.ftp_path);
      }
    })

    // const response = await renameFile(from, to);

    // if (response.success) {
    //   fetchFileData(state.ftp_path);
    // }
  }

  const renameFile = (from, to) => new Promise(async (resolve, reject) => {


    const toDomain = to.split(".").pop();

    const paramData = { ...ftpParams };
    paramData.action = "rename";
    paramData.from = from;
    paramData.to = to;

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paramData)
      })

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Unable To Rename the file.");
      }

      resolve({
        data,
        success: true
      });

    } catch (error) {
      reject({
        data: error,
        success: false
      })
    }
  })


  const tableDataProps = {
    renameInputRef,
    handleSubmitRename,
    data: state.ftp_files,
    handleChangePath: handePath,
    currentPath: state.ftp_path
  }

  return (
    <header className="relative max-w-[1000px] mx-auto mt-5 columns-auto bg-white p-8">
      {
        state.ftp_errors &&
        <Action />
      }
      <div className="mx-auto">
        <Collapse open={errorContext.state}>
          <FtpErrors title="The Below Ftp Errors Were Occurred." errors={state.ftp_errors} />
        </Collapse>
        <div className="mx-auto pt-12 pb-24  text-center">
          <Card className='mx-auto shadow-xl'>
            {!state.is_table_hidden && state.ftp_files ? (
              <>
                <SearchPath currentPath={state.searchPath} handleChange={handleSearchPath} handleClick={handleSearch} />
                <div className="flex justify-end p-4">
                  <CreateItem />
                </div>
                <Card className="h-auto w-full overflow-scroll md:overflow-hidden">
                  <TableData
                    {...tableDataProps}
                  />
                </Card>
              </>
            ) : (
              <TableSkeleton />
            )}
          </Card>
        </div>
      </div>

      {/* Rename Confirmation Modal  */}
      <RenameConfirmation handleOnConfirm={handleOnConfirm} />
      <ImportHotToast />
      <CreateItemDialog />

    </header>
  );
};

export default Connect;