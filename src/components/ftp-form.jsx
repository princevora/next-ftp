import {
    Card,
    CardBody,
    CardFooter,
    Input,
    Button,
} from "@material-tailwind/react";

function FtpDataForm({handleChange, handleSubmit}) {
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
                </CardBody>
                <CardFooter className="pt-3">
                    <Button type="submit" variant="gradient" fullWidth>
                        Connect
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default FtpDataForm;