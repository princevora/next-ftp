import {
    Card,
    CardBody,
    CardFooter,
    Input,
    Button,
} from "@material-tailwind/react";

function FtpDataForm({ handleChange, handleSubmit, formState }) {
    return (
        <form onSubmit={handleSubmit}>
            <Card className="w-96 shadow-2xl mt-4">
                <CardBody className="flex flex-col gap-4">
                    <Input
                        name="ftp_host"
                        label="Ftp Host"
                        size="lg"
                        onChange={handleChange}
                    />
                    <Input
                        name="ftp_username"
                        label="Ftp Username"
                        size="lg"
                        onChange={handleChange}
                    />
                    <Input
                        name="ftp_password"
                        label="Ftp Password"
                        size="lg"
                        onChange={handleChange}
                    />
                    <Input
                        name="ftp_port"
                        label="Ftp Port"
                        size="lg"
                        value={formState.ftp_port}
                        onChange={handleChange}
                    />
                </CardBody>
                <CardFooter className="pt-3">
                    {/* {console.log(formState.isSubmitted.toString())} */}
                    <Button type="submit" variant="gradient" fullWidth className="flex gap-2 justify-center" disabled={formState.isSubmitted}>
                        {
                            formState.isSubmitted && 
                            <span className="loading loading-xs loading-spinner"></span>
                        }

                        Connect
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default FtpDataForm;