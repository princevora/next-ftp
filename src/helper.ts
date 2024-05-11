interface CallbackFunction {
    (value: any, path: any): { value: any, path: any };
}

export function findAndCheckOrSetValue(
    obj: any, 
    key: string, 
    callback: CallbackFunction, 
    paths: string[] = [],
    newValue: any = null
): any 
{
    let result;

    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (prop === key) {
                const path = paths.join(".") + "." + prop;
                if(newValue !== null){
                    obj[prop] = newValue
                }

                return callback(obj[prop], path)
                // return callback(obj[prop], path); // Return the result of the callback directly
            } else if (typeof obj[prop] === 'object') {
                result = findAndCheckOrSetValue(obj[prop], key, callback, [...paths, prop], newValue); // Recursive call
                // return callback
                if (result !== undefined && prop == key) {

                    if(newValue !== null){
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

export function findValueByObjectPath(object: object, obPath: string){
    const paths = obPath.split(".");
    let value: any = object;

    for(const path of paths){
        if(value && typeof value === "object" && path in value){
            value = value[path];
        } else {
            return null;
        }
    }

    return value;
}