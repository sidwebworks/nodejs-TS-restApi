import {Express, Request, Response} from 'express';
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from './controller/session.controller';
import {createUserHandler} from './controller/user.controller';
import validateResources from './middleware/validateResources';
import { createUserSchema } from './schema/user.schema';
import { createSessionSchema } from './schema/session.schema';
import requireUser from './middleware/requireUser';
import { createProductSchema, getProductSchema, updateProductSchema } from './schema/product.schema';
import { createProductHandler, deleteProductHandler, getProductHandler, updateProductHandler } from './controller/product.controller';

function routes(app: Express){
    app.get('/healthcheck', (req:Request, res:Response) => {
        res.sendStatus(200);
        res.send('OK');
    });

    app.post('/api/users',validateResources(createUserSchema),createUserHandler);

    app.post('/api/sessions',validateResources(createSessionSchema),createUserSessionHandler);

    app.get('/api/sessions',requireUser, getUserSessionsHandler);
    app.delete('/api/sessions',requireUser, deleteSessionHandler);


    app.post('/api/products',[requireUser, validateResources(createProductSchema),createProductHandler]);
    app.put('/api/products/productId',[requireUser, validateResources(updateProductSchema),updateProductHandler]);
    app.get('/api/products/:productId',validateResources(getProductSchema),getProductHandler);
    app.delete('/api/products',[requireUser, validateResources(getProductSchema),deleteProductHandler]);
}


export default routes;