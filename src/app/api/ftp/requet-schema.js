import { z } from 'zod';
import { zfd } from 'zod-form-data';

const createSen = (fieldName) => {
    return `The ${fieldName} Perameter is reqired`;
}

const mainParmas = {
    host: z.string({ required_error: createSen("host") }).nonempty(),
    user: z.string({ required_error: createSen("user") }).nonempty(),
    pass: z.string({ required_error: createSen("pass") }).nonempty(),
    port: z.number().default(21).optional(),
}

export const renameSchema = z.object({
    ...mainParmas,
    from: z.string({ required_error: createSen("from") }),
    to: z.string({ required_error: createSen("to") })
})

export const deleteSchema = z.object({
    ...mainParmas,
    type: z.number(),
    from: z.string(),
})

export const fetchSchema = z.object({
    ...mainParmas,
    path: z.string().optional(),
})

export const getFileSchema = z.object({
    ...mainParmas,
    path: z.string()
})

export const moveFileSchema = z.object({
    ...mainParmas,
    from: z.record(z.number()),
    to: z.string()
})

// Special schema for validating formdata / multipart
export const uploadSchema = zfd.formData({
    host: zfd.text(),
    user: zfd.text(),
    pass: zfd.text(),
    path: zfd.text().optional(),
    file: zfd.file()
})

export const bulkDeleteSchema = z.object({
    ...mainParmas,
    paths: z.record(z.number())
});

export const createSchema = z.object({
    ...mainParmas,
    type: z.number({ required_error: createSen("type") }),
    name: z.string({ required_error: createSen("name") }),
})