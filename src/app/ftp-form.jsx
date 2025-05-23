"use client";
import React, { useState, useEffect } from 'react';
import FtpDataForm from '@/components/ftp-form';
import {
    Typography
} from "@material-tailwind/react";
import FormSkeleton from "@/components/skeletons/form-skeleton";
import ImportHotToast from '@/components/import-toaster';
import CryptoJs from "crypto-js";
import { usePasswordContext } from '@/context/encrypt-password';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const FtpForm = () => {
    const [formData, setFormData] = useState({
        ftp_host: "",
        ftp_username: "",
        ftp_password: "",
        ftp_port: 21,
        isSubmitted: false,
        formHidden: true,
        encryptedData: ""
    });

    const password = usePasswordContext();
    const router = useRouter();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setFormData(prevState => ({ ...prevState, formHidden: false }));
        }, 900);

        return () => {
            clearTimeout(timeoutId);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { ftp_host, ftp_username, ftp_password, ftp_port } = formData;

        if(!ftp_host || !ftp_username || !ftp_password || !ftp_port){
            setFormData(prev => ({
                ...prev,
                isSubmitted: false
            }));
            
            return toast.error('You must provide the credentials to proceed')
        }

        const data = { ftp_host, ftp_username, ftp_password, ftp_port };
        let eData = CryptoJs.AES.encrypt(JSON.stringify(data), password).toString(); //Encrypted Form Of Data

        setFormData(prevState => ({ ...prevState, isSubmitted: true, encryptedData: eData }));
        router.push(`connect/ftp/${encodeURIComponent(eData)}`);
    }

    return (
        <>
            <ImportHotToast />
            {/*           
            {formData.isSubmitted? (
                <Connect
                    {...formData}
                />
            ) : ( */}
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
                                formState={formData}
                            />
                        )}
                    </div>
                </div>
            </header>
            {/* )} */}
        </>
    );
}

export default FtpForm;
