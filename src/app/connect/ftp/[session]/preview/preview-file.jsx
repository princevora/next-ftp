import ImageCompo from "next/image";
import { useEffect, useState } from "react";

function PreviewFile({ type, url }) {
    const [imageSize, setImageSize] = useState({
        height: 100,
        width: 100
    });

    useEffect(() => {

        // Check if the type is of image and get image height and width
        if (type == 1) {
            const image = new Image();
            image.src = url;
            image.onload = (e) => {
                setImageSize({
                    height: image.naturalHeight,
                    width: image.naturalWidth
                })
            }
        }

        const handleClose = () => {
            window.URL.revokeObjectURL(url);
        }

        window.addEventListener("beforeunload", handleClose);

        return () => {
            window.addEventListener("beforeunload", handleClose);
        }
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center">
            {type == 1 && (
                <ImageCompo
                    src={url}
                    alt="User Image Preview Request"
                    width={imageSize.width}
                    height={imageSize.height}
                />
            )}
            {type == 2 && (
                <video
                    src={url}
                    className="max-w-full max-h-full"
                    autoPlay
                    controls
                />
            )}
            {type == 3 && (
                <audio src={url} autoPlay controls />
            )}
        </div>

    )
}

export default PreviewFile;