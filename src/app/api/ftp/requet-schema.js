import { z } from 'zod';

const createSen = (fieldName) => {
    return `The ${fieldName} Perameter is reqired`;
}

const mainParmas = {
    host: z.string({required_error: createSen("host")}),
    user: z.string({required_error: createSen("user")}),
    pass: z.string({required_error: createSen("pass")}),
}

export const renameSchema = z.object({
    ...mainParmas,
    from: z.string({required_error: createSen("from")}),
    to: z.string({required_error: createSen("to")})
})

export const fetchSchema = z.object({
    ...mainParmas,
    path: z.string().optional(),
})

export const createSchema = z.object({
    ...mainParmas,
    type: z.number({required_error: createSen("type")}),
    name: z.string({required_error: createSen("name")}),
})