import {Express, Request, Response} from 'express';
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler, googleOauthHandler } from './controller/session.controller';
import {createUserHandler, getCurrentUser} from './controller/user.controller';
import validateResources from './middleware/validateResources';
import { createUserSchema } from './schema/user.schema';
import { createSessionSchema } from './schema/session.schema';
import requireUser from './middleware/requireUser';
import { createProductSchema, getProductSchema, updateProductSchema } from './schema/product.schema';
import { createProductHandler, deleteProductHandler, getProductHandler, updateProductHandler } from './controller/product.controller';

function routes(app: Express){


    /**
   * @openapi
   * /healthcheck:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
    app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));
/**
   * @openapi
   * '/api/users':
   *  post:
   *     tags:
   *     - User
   *     summary: Register a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */


    app.post('/api/users',validateResources(createUserSchema),createUserHandler);
    app.get('/api/me',requireUser,getCurrentUser);

    app.post('/api/sessions',validateResources(createSessionSchema),createUserSessionHandler);

    app.get('/api/sessions',requireUser, getUserSessionsHandler);
    app.delete('/api/sessions',requireUser, deleteSessionHandler);


    /**
   * @openapi
   * '/api/products/{productId}':
   *  get:
   *     tags:
   *     - Products
   *     summary: Get a single product by the productId
   *     parameters:
   *      - name: productId
   *        in: path
   *        description: The id of the product
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/Product'
   *       404:
   *         description: Product not found
   */
    app.post('/api/products',[requireUser, validateResources(createProductSchema),createProductHandler]);
    app.put('/api/products/productId',[requireUser, validateResources(updateProductSchema),updateProductHandler]);
    app.get('/api/products/:productId',validateResources(getProductSchema),getProductHandler);
    app.delete('/api/products',[requireUser, validateResources(getProductSchema),deleteProductHandler]);

    app.get('/api/sessions/oauth/google',googleOauthHandler);

}


export default routes;