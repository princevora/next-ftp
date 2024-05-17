import React from 'react';
import { Toaster } from 'react-hot-toast';

export default function ImportHotToast() {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
                // Define default options
                className: '',
                duration: 5000,
                style: {
                    zIndex: 9999,
                    background: '#363636',
                    color: '#fff',
                },

                // Default options for specific types
                success: {
                    duration: 3000,
                    theme: {
                        primary: 'green',
                        secondary: 'black',
                    },
                }, loading: {
                    duration: Infinity
                }
            }}
        />
    )
}
