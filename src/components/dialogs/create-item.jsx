import React, { useContext } from "react";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Radio,
} from "@material-tailwind/react";
import { useCreateItemContext } from "@/context/create-item/create-item";

export default function CreateItemDialog() {
  
  const context = useCreateItemContext();
  const state = context.state;

  const handleOpen = () => {
    context.setState({
      ...state,

    })
  };
  
  const handleChangeRadio = (e) => {
    const { value } = e.target;
    const prevState = context.state;

    context.setState({
      ...context.state,
      type: value
    })
  }

  const handleChange = (e) => {
    const { value } = e.target;

    context.setState({
      ...context.state,
      itemName: value
    })
  }

  const handleClick = () => {
    
  } 

  return (
    <>
      <Dialog
        size="xs"
        open={state.isVisible}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
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
              <Radio name="type" onChange={handleChangeRadio} label="New file" value="0" />
              <Radio name="type" onChange={handleChangeRadio} label="New folder" value="1" defaultChecked />
            </div>

            <Input onChange={handleChange} name="itemName" label="New file or folder name" size="lg" />
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={handleClick} fullWidth>
              Create
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}