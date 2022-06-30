import {object, string, TypeOf } from 'zod'
export const createUserSchema = object({
    body: object({
        name: string({
            required_error: "name is required"
        }),

        email: string({
            required_error: "email is required"
        }).email('email is not valid'),

        password: string({
            required_error: "password is required"
        }).min(8, "password must be at least 8 characters long"),

        passwordConfirmation: string({
            required_error: "passwordConfirmation is required"
        }),
    }).refine((data) => data.password === data.passwordConfirmation, "password and passwordConfirmation must match")
});

export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>, "body.passwordconfirmation">;
