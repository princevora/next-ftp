import path from "path";

interface CallbackFunction {
    (value: any, path: any): { value: any, path: any };
}

export function findAndCheckOrSetValue(
    obj: any,
    key: string,
    callback: CallbackFunction,
    paths: string[] = [],
    newValue: any = null
): any {
    let result;

    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (prop === key) {
                const path = paths.join(".") + "." + prop;
                if (newValue !== null) {
                    obj[prop] = newValue
                }

                return callback(obj[prop], path)
                // return callback(obj[prop], path); // Return the result of the callback directly
            } else if (typeof obj[prop] === 'object') {
                paths = [...paths, prop];
                result = findAndCheckOrSetValue(obj[prop], key, callback, paths, newValue); // Recursive call
                // return callback
                if (result !== undefined && prop == key) {

                    if (newValue !== null) {
                        obj[prop] = newValue;
                    }

                    const path = paths.join(".") + "." + prop;
                    return callback(obj[prop], path); // Return the result of the callback directly
                }
            }
        }
    }
    return callback(null, null);
}

export function findValueByObjectPath(object: object, obPath: string) {
    const paths = obPath.split(".");
    let value: any = object;

    for (const path of paths) {
        if (value && typeof value === "object" && path in value) {
            value = value[path];
        } else {
            return null;
        }
    }

    return value;
}

export function getRootUrl(): string {
    if (typeof window !== 'undefined') {
        const { protocol, hostname, port } = window.location;
        return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    }
    return '';
};

export const validExtensions: Record<string, number> = {
    // Image type
    "jpeg": 1,
    "png": 1,
    "jpg": 1,
    "svg": 1,

    // Video types
    "mp4": 2,
    "avi": 2,
    "mov": 2,
    "wmv": 2,

    // Audio types
    "mp3": 3,
    "wav": 3,
}

/**
 * @return {boolean}
 */
export function isMediaFile(fileName: string): boolean{
    const ext: any = path.extname(fileName).split(".").pop();

    return typeof validExtensions[ext] !== "undefined";
}