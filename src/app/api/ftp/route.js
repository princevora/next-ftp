import { tuple, z } from "zod";
import { headers as hs } from 'next/headers';
import jsftp from "jsftp";
import pathModule from "path";

// Functions
import {
    connectLogin,
    fetchFiles,
    ftpDestroy,
    setFtpConfig,
    createItem,
    renameFile,
    sendObjRes,
    deleteFile,
    bulkDelete,
    uploadFile,
    downloadFile,
    move
} from './api';
// Request schema
import {
    renameSchema,
    fetchSchema,
    createSchema,
    deleteSchema,
    bulkDeleteSchema,
    uploadSchema,
    getFileSchema,
    moveFileSchema
} from "./requet-schema";
import { NextResponse } from "next/server";

const VALID_ACTIONS = {
    "fetch": {
        schema: fetchSchema,
        func: fetchFiles
    },
    "rename": {
        schema: renameSchema,
        func: renameFile
    },
    "delete": {
        schema: deleteSchema,
        func: deleteFile
    },
    "create": {
        schema: createSchema,
        func: createItem
    },
    "deleteBulk": {
        schema: bulkDeleteSchema,
        func: bulkDelete
    },
    "upload": {
        schema: uploadSchema,
        func: uploadFile
    },
    "get_file": {
        schema: getFileSchema,
        func: downloadFile
    },
    "move": {
        schema: moveFileSchema,
        func: move
    }
};

export async function POST(request, res) {

    const actionSchema = z.object({
        action: z.string()
    })

    const header = hs();
    const contentType = header.get("content-type") || null;
    let data;
    let action;
    let isJsonReq = true;

    if (contentType && contentType.includes('multipart/form-data')) {
        data = await request.formData();
        action = data.get("action");
        isJsonReq = false;
    } else {
        data = await request.json()
        action = data?.action || "fetch";
    }

    const actionResponse = actionSchema.safeParse({ action });

    if (!actionResponse.success) {
        return sendResponse(sendObjRes({ error: { message: "Please Provide an action to complete the request." } }, 400, true), 400)
    }

    // Validate the Action if its valid or invalid.
    const rsp = await validateAction(action).catch(err => {
        return sendResponse(
            sendObjRes("The Provided Action is invalid.", 400, true),
            400);
    })

    // If everything is well then get a response from the request schema
    const response = VALID_ACTIONS[action].schema.safeParse(data);

    if (!response.success) {

        const errors = response.error.errors;
        let errMap = [];

        errors.map((err) => {
            errMap.push(err.path[0]);
        })

        return sendResponse(
            sendObjRes(
                `Please Check your provided fields Or Provide Required Fields, Fields: ${errMap.join(", ")}`,
                400,
                true
            ),
            400);
    }

    const { host, user, pass, path = "/", port = 21 } = response.data;

    const ftpConfig = {
        host,
        user,
        pass,
        port
    }

    // Main handler
    try {

        // Set FTP Config
        setFtpConfig(ftpConfig, path);

        // Login
        await connectLogin()

        const responseData = await VALID_ACTIONS[action].func(response.data);

        if (responseData.success) {
            await ftpDestroy(); //Destroy Ftp connection

            if (responseData?.stream !== undefined) {
                return sendResponse(responseData.stream, responseData.status || 200, responseData?.headers || null, true);
            } else {
                return sendResponse(responseData, responseData.status || 200);
            }
        }

        return sendResponse(responseData, responseData.status || 500)

    } catch (error) {
        return sendResponse(error, error.status);
    }
}

function validateAction(action) {
    return new Promise((resolve, reject) => {
        if (!VALID_ACTIONS.hasOwnProperty(action)) {
            reject(sendObjRes("The provided action is invalid", 400, true));
        }
        else {
            resolve(true);
        }
    });
}


/**
 * 
 * @param {string|object} res 
 * @param {number} status 
 */
function sendResponse(res, status, responseHeader = null, isStream = false) {
    let headers = {
        headers: {
            'Content-Type': "application/json"
        }
    }

    if (responseHeader !== null && typeof responseHeader == "object") {
        headers = responseHeader;
    }

    if (!isStream) {
        res = JSON.stringify(res)
    }

    const response = new NextResponse(res, {
        headers: headers,
        status: status
    });

    return response;
}
