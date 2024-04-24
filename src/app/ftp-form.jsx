"use client";
import React, { useState, useEffect } from 'react';
import FtpDataForm from '@/components/ftp-form';
import Connect from './connect-ftp';
import {
    Typography
} from "@material-tailwind/react";
import FormSkeleton from "@/components/skeletons/form-skeleton";
import RenameItemContextProvider from "@/context/renameItem/RenameItemContext";

const FtpForm = () => {
    const [formData, setFormData] = useState({
        ftp_host: "",
        ftp_username: "",
        ftp_password: "",
        isSubmitted: false,
        formHidden: true
    });

    // useEffect(() => {
    //     setTimeout(() => {
    //         setFormData(prevState => ({ ...prevState, formHidden: false }));
    //     }, 900);
    // }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormData(prevState => ({ ...prevState, isSubmitted: true }));
    }

    return (
        <RenameItemContextProvider>
            {!formData.isSubmitted ? (
                <Connect
                    ftp_host="ftpupload.net"
                    ftp_username="epiz_32392405"
                    ftp_password="62mNeNsZfkUe"
                    // ftp_host="files.000webhost.com"
                    // ftp_username="two-a-penny-buses"
                    // ftp_password="Princevora2007@"
                />
            ) : (
                <header className="mt-5 bg-white p-8">
                    <div className="w-w-full container mx-auto pt-12 pb-24 text-center">
                        <Typography
                            color="blue-gray"
                            className="mx-auto w-full text-[30px] lg:text-[48px] font-bold leading-[45px] lg:leading-[60px] lg:max-w-2xl"
                        >
                            Enter Your FTP Details To Continue
                        </Typography>
                        <div className="grid justify-center gap-2">
                            {formData.formHidden ? (
                                <FormSkeleton />
                            ) : (
                                <FtpDataForm
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                />
                            )}
                        </div>
                    </div>
                </header>
            )}
        </RenameItemContextProvider>
    );
}

export default FtpForm;
