import jsftp from "jsftp";
import * as pathModule from "path"

let ftp, user, pass, path;
// Create a JsFTP config

export const setFtpConfig = (data, filePath) => {
    ftp = new jsftp(data);
    user = data.user;
    pass = data.pass;
    path = filePath;
}

export const connectLogin = () => new Promise((resolve, reject) => {
    ftp.auth(user, pass, (error, data) => {
        if (error) {
            // Return Response
            reject(

                sendObjRes(error.message, error.code, true)
            );
        }
        else {
            resolve(data);
        }
    })
});

export const getFtpFIles = () => new Promise((resolve, reject) => {
    ftp.ls(path, (error, res) => {
        if (error) {
            return reject(
                sendObjRes(error.message, error.code, true)
            );
        }
        else {
            return resolve(res)
        }
    })
})

export const fetchFiles = async () => {
    // Declare A ftp files variable

    try {

        // Fetch files if login gets success.
        const ftp_files = await getFtpFIles();

        // Destroy connection
        await ftpDestroy(); //Destroy Ftp connection

        // Send files
        return sendObjRes({ ftp_files }, 200, false)

    } catch (error) {

        // Send error if anything occurs wrong.
        return sendObjRes(error, error.code ?? 400, true);
    }
}

const renameFtpFile = (from, to) => new Promise((resolve, reject) => {

    ftp.rename(from, to, function (err) {
        if (err) {
            reject(
                sendObjRes(err.message, 551, true)
            );
        } else {
            const baseFileFrom = pathModule.basename(from);
            const baseFileTo = pathModule.basename(to);

            resolve(
                sendObjRes(`Your File ${baseFileFrom} renamed to ${baseFileTo} successfully.`, 200)
            );
        }
    })
})

const checkExists = (filePath) => new Promise((resolve, reject) => {
    ftp.raw("SIZE", filePath, (err, data) => {
        if (!err) {
            const size = parseInt(data.text.slice(4));
            resolve(size);
        }
        else {
            reject(false);
        }
    })
})

export const createItem = ({ type, name }) => new Promise(async (resolve, reject) => {

    if (typeof type !== 'number' && ![0, 1].includes(type)) {
        return reject(sendObjRes("Invalid file type. Type must be 0 for file or 1 for directory.", 400, true));
    }

    if (type === 0) {

        try {
            // check if file exists 
            const isAvailable = await checkExists(name)

            reject(sendObjRes("The File Already Exists", 550, true));

        } catch (error) { //Catching the error means the file doesnt exists as our promise returned `false` as rejection
            const emptyBuffer = Buffer.from('');

            ftp.put(emptyBuffer, name, err => {
                if (err) {
                    reject(sendObjRes(err.message, err.status, true));
                }
                else {
                    resolve(sendObjRes({ message: "File has been successfully created." }, 200));
                }
            })
        }

    }
    else if (type === 1) {
        ftp.raw("mkd", name, (err, data) => {
            if (err) {
                reject(sendObjRes(err.message, err.code, true));
            }

            resolve(sendObjRes({ message: "New directory has been successfully created." }, data.code))
        })
    }
})


export const renameFile = async ({ from, to }) => {

    return await renameFtpFile(from, to);
}

export const ftpDestroy = () => {
    return ftp.destroy();
}

export function sendObjRes(data, status, isErr = false) {

    const base = {
        success: !isErr,
        data: {
        },
        status: status
    };

    if (isErr) {
        base.data.message = data;
    }
    else {
        base.data = data;
    }

    return base;
}