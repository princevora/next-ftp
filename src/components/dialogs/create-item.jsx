import React, { useContext, useRef, useState } from "react";
import {
  Button,
  Dialog,
  Spinner,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Radio,
} from "@material-tailwind/react";
import { useCreateItemContext } from "@/context/create-item";
import { useFtpDetailsContext } from "@/context/ftp-details-context";
import toast from "react-hot-toast";
import path from "path";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function CreateItemDialog() {

  const context = useCreateItemContext();
  const ftpContext = useFtpDetailsContext();

  const [type, setType] = useState(1);
  const [name, setName] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleOpen = () => {
    context.setIsVisible(!context.isVisible);

    setName("");
  };

  const handleChangeRadio = (e) => {
    const { value } = e.target;
    setType(parseInt(value));
  }

  const handleChange = (e) => {
    const { value } = e.target;
    setName(value);
  }

  const createItem = (data, endpoint) => new Promise(async (resolve, reject) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...data,
        action: "create"
      })
    })

    const json = await response.json();

    if (json.success) {
      resolve({
        success: true,
        message: json.data.message
      });
    }

    else {
      reject({
        success: false,
        message: json.data.message
      });
    }

  })

  const handleClick = async () => {

    const { user, pass, host, endpoint, currentPath } = ftpContext.state;
    const data = { host, user, pass, type, name: path.join(currentPath, name) }

    if (name == "") {

      context.setIsVisible(false)
      return toast.error("The File name must not be empty");
    }

    // Set the modal invisible but let it complete the request.
    context.setIsVisible(false)

    // disable the button to prevent spam clicks.
    setIsSending(true);

    // Show the toast.
    try {
      // Get response
      const response = createItem(data, endpoint);

      await toast.promise(
        response,
        {
          loading: "Creating New Item",
          success: (rsp) => rsp.message,
          error: (err) => err.message
        },
      ).then(() => {
        // Emit an event to load files.
        const event = new CustomEvent("files:fetch", {
          detail: {
            path: currentPath ?? "/"
          }
        })

        window.dispatchEvent(event);
      });

    } catch (error) {
    } finally {

      //Enable the button at the end.
      setIsSending(false)

      // We need to reset the state, because while changing the directories 
      // a new folder or file can be created without entering any text
      // with the previous text.

      setName("");
    }

  }

  return (
    <>
      <Dialog
        size="xs"
        open={context.isVisible}
        handler={handleOpen}
        className="bg-transparent shadosw-none z-50 overflow-auto"
      >
        <Card className="mx-auto max-w-[24rem] w-full">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Create New Item
            </Typography>
            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Enter Details for your new item.
            </Typography>
            <div className="flex">
              <Radio name="type" onChange={handleChangeRadio} checked={type === 0} label="New file" value="0" />
              <Radio name="type" onChange={handleChangeRadio} checked={type === 1} label="New folder" value="1" />
            </div>

            <Input onChange={handleChange} name="itemName" label="New file or folder name" size="lg" />
          </CardBody>
          <CardFooter className="pt-0">
            <div className="grid grid-cols-[20%_auto] sm:gap-2 gap-4 text-nowrap">
              <Button variant="text" className="bg-gray-100 flex justify-center gap-2" onClick={handleOpen} fullWidth>
                <XMarkIcon />
              </Button>
              <Button variant="gradient" className="flex justify-center gap-2" disabled={isSending} onClick={handleClick} fullWidth>
                Create
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}