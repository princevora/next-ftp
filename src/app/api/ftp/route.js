import { z } from "zod";

// Functions.
import { 
    connectLogin, 
    fetchFiles, 
    ftpDestroy, 
    setFtpConfig, 
    createItem, 
    renameFile, 
    sendObjRes, 
    deleteFile,
    bulkDelete
} from './api';
// Request schema
import { 
    renameSchema, 
    fetchSchema, 
    createSchema, 
    deleteSchema, 
    bulkDeleteSchema 
} from "./requet-schema";

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
    }
};

export async function POST(request) {

    const actionSchema = z.object({
        action: z.string()
    })

    const data = await request.json()
        .catch((e) => {
            return sendResponse(sendObjRes({ error: { message: "Please check your provided fields." } }, 400, true), 400);
        });

    const actionResponse = actionSchema.safeParse(data);

    if (!actionResponse.success) {
        return sendResponse(sendObjRes({ error: { message: "Please Provide an action to complete the request." } }, 400, true), 400)
    }

    // If everything is well then get a response from the request schema

    const response = VALID_ACTIONS[data.action].schema.safeParse(data);

    if (!response.success) {

        const errors = response.error.errors;
        let errMap = [];

        errors.map((err) => {
            errMap.push(err.path[0]);
            console.log(err);
        })

        return sendResponse(
            sendObjRes(
                `Please Check your provided fields Or Provide Required Fields, Fields: ${errMap.join(", ")}`,
                400,
                true
            ),
            400);
    }

    const { host, user, pass, path = "/" } = response.data;
    const { action } = data;

    const ftpConfig = {
        host,
        user,
        pass,
    }

    // Set FTP Config
    setFtpConfig(ftpConfig, path);
    try {
        const validate = await validateAction(action)
        const actionFunction = VALID_ACTIONS[action];

        // Login
        await connectLogin()

        const responseData = await VALID_ACTIONS[action].func(response.data);

        if (responseData.success) {
            await ftpDestroy(); //Destroy Ftp connection
            return sendResponse(responseData, responseData.status ?? 200);
        }

        throw new Error(responseData)

    } catch (error) {
        return sendResponse(error, error.status);
    }
}

async function validateAction(action) {
    return new Promise((resolve, reject) => {
        if (!VALID_ACTIONS.hasOwnProperty(action)) {
            return reject({ error: { message: "The provided action is invalid" } }, 400);
        }
        else {
            return resolve(true);
        }
    });
}


/**
 * 
 * @param {string|object} res 
 * @param {number} status 
 */
function sendResponse(res, status) {

    const headers = {
        headers: {
            'Content-Type': "application/json"
        }
    }

    return new Response(JSON.stringify(res), {
        status: status,
        headers
    });
}