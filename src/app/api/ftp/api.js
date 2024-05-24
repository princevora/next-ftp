import { File } from "buffer";
import jsftp from "jsftp";
import * as pathModule from "path"
import mime from "mime-types";
import { PassThrough } from "stream";

let ftp, user, pass, path;
// Create a JsFTP config

export const setFtpConfig = (data, filePath) => {
    ftp = new jsftp(data);
    user = data.user;
    pass = data.pass;
    path = filePath;
}

export const connectLogin = () => new Promise(async (resolve, reject) => {
    await ftp.auth(user, pass, (error, data) => {
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
            reject(
                sendObjRes(error.message, error.code, true)
            );
        }
        else {
            return resolve(res)
        }
    })
})

export const fetchFiles = async () => {
    try {

        // Fetch files if login gets success.
        const ftp_files = await getFtpFIles();

        // Send files
        return sendObjRes({ ftp_files }, 200, false)

    } catch (error) {

        // Send error if anything occurs wrong.
        return sendObjRes(error.data.message || "Unable to fetch", error.status || 400, true);
    }
}

export const tryPassive = () => {
    ftp.raw("PASV", (err, data) => {
        if (err) {
            return sendObjRes("Unable to switch to passive mode", err.code, true);
        }
    })
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

export const deleteFile = ({ from, type }) => new Promise(async (resolve, reject) => {
    if (type === 0) {
        ftp.raw("DELE", from, (err, data) => {
            if (err) {
                reject(sendObjRes(err.message, err.code, true));
            }
            else {
                resolve(sendObjRes("File has been successfully Deleted", 200));
            }
        })
    }
    else {
        const deleteDir = () => new Promise((resolve, reject) => {
            ftp.raw("RMD", from, (err, data) => {
                if (err) {
                    reject({
                        success: false,
                        message: err.message,
                        code: err.code
                    })
                }
                else {
                    resolve({
                        success: true,
                        message: "Directory Has been successfully deleted."
                    })
                }
            })
        })

        try {
            path = from;

            // Get the child folders and files.
            await fetchFiles()
                .then(async (rsp) => {
                    let promises = [];
                    let mainParent;

                    const files = rsp.data.ftp_files;

                    if (files.length !== 0) {
                        for (const file of files) {
                            const { name, type } = file;
                            if (file.type === 1) { //For the child folders
                                promises.push(deleteFile({ from: `${from}/${name}`, type }));
                            }
                            else { //for the child files
                                promises.push(deleteFile({ from: `${from}/${name}`, type }));
                            }
                        }

                        mainParent = pathModule.dirname(path);
                    }
                    else {
                        promises.push([]);
                    }

                    await Promise.all(promises)
                        .then(() => {
                            deleteDir()
                                .then((rsp) => resolve(sendObjRes("The Directory(ies) Has been Deleted Successfully.", 200)))
                        })
                });
        } catch (error) {
            reject(sendObjRes(error.message || "Unable to delete file", error.code || 500, true));
        }
    }
});

export const uploadFile = (prop) => new Promise(async (resolve, reject) => {
    if (!prop.file instanceof File) {
        reject(sendObjRes("Cannot Accept This file."));
    }
    else {
        try {
            const file = prop.file;
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const path = prop?.path || "/";
            const remotePath = pathModule.join(path, file.name).replaceAll("\\", "/");

            ftp.put(buffer, remotePath, (err) => {
                if (err) {
                    reject(sendObjRes(err.message, err.code, true));
                }
                else {
                    resolve(sendObjRes("The file has been uploaded successfully.", 200));
                }
            })

        } catch (error) {
            return sendObjRes("Unable to upload the file", 553, true);
        }
    }
})

/**
 * @param {array<string, number>} paths
 */
export const bulkDelete = async ({ paths }) => {
    let promises = [];
    for (const [path, type] of Object.entries(paths)) {
        promises.push(deleteFile({ from: path, type }));
    }

    return Promise.all(promises)
        .then((rsp) => sendObjRes("The files Has Been Deleted Successfuly.", 200))
        .catch((err) => sendObjRes(err.message || "Unable To Delete Files.", err.code || 550, true));
}

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

export const getFile = (path) => new Promise(async (resolve, reject) => {
    ftp.get(path, (err, socket) => {
        if (err) {
            reject(sendObjRes(err.message, err.code, true));
        }

        const stream = new PassThrough();
        socket.pipe(stream);

        // socket.on("error", () => {
        //     reject(sendObjRes("Can't resolve Stream, Unable to download file."));
        // })

        // let chunks = [];

        // socket.on("data", (buffer) => {
        //     chunks.push(buffer);
        // })

        // socket.on("close", () => {
        //     console.log("Lem: ", chunks.length);

        // })
        resolve(stream);

    });
});

export const downloadFile = ({ path }) => new Promise(async (resolve, reject) => {
    try {
        
        //Get file Size.
        await checkExists(path)
        .then(async (fileSize) => {
                let size = fileSize;
                const { base } = pathModule.parse(path);
                const mimeType = mime.lookup(base) || 'application/octet-stream';

                const headers = {
                    "File-Size": size,
                    "Content-type": mimeType,
                    "Content-Disposition": `attachment; filename="${base}"`
                }

                await getFile(path)
                .then((stream) => resolve({ success: true, stream, headers, status: 200 }))
            });


    } catch (error) {
        reject(error)
    }
})

export const move = ({ from, to }) => new Promise(async (resolve, reject) => {
    const promises = [];

    for (const filePath in from) {
        const basename = pathModule.basename(filePath);
        const toPath = pathModule.join(to, basename).replaceAll("\\", "/");

        promises.push(renameFtpFile(filePath, toPath));
    }

    Promise.all(promises)
        .then(() => resolve(sendObjRes(`The file(s) or Folder(s) Has been Moved Successfully to ${to || "/"}`, 200)))
        .catch(() => reject(sendObjRes("Unable to Move the file", 550, true)))
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