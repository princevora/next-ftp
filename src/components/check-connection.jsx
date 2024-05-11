import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState } from 'react'

export default function CheckConnection() {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        setIsOnline(navigator.onLine);

        const handleCheck = () => {
            const status = navigator.onLine;
            
            setIsOnline(status);
            
            if(status){
                // Reload the files when the user is online 
                const event = new CustomEvent("files:fetch");
                window.dispatchEvent(event);
            }
        }

        window.addEventListener("online", handleCheck);
        window.addEventListener("offline", handleCheck);

        return () => {
            window.removeEventListener("online", handleCheck);
            window.removeEventListener("offline", handleCheck);
        }
    }, []);

    return (
        !isOnline && (
            <div className="fixed bottom-0 left-0 w-full bg-red-500 text-white py-2 px-4 flex items-center justify-center animate-fade-up">
                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                No internet connection
            </div>
        )
    )
}
