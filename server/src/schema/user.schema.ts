import {object, string, TypeOf } from 'zod'

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        email:
 *          type: string
 *          default: furkan.meydan@hotmail.com
 *        name:
 *          type: string
 *          default: Furkan Meydan
 *        password:
 *          type: string
 *          default: 12341234
 *        passwordConfirmation:
 *          type: string
 *          default: 12341234
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        name:
 *          type: string
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */

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
