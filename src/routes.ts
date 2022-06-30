import {Express, Request, Response} from 'express';
import { createUserSessionHandler } from './controller/session.controller';
import {createUserHandler} from './controller/user.controller';
import validateResources from './middleware/validateResources';
import { createUserSchema } from './schema/user.schema';
import { createSessionSchema } from './schema/session.schema';

function routes(app: Express){
    app.get('/healthcheck', (req:Request, res:Response) => {
        res.sendStatus(200);
        res.send('OK');
    });

    app.post('/api/users',validateResources(createUserSchema),createUserHandler);

    app.post('/api/sessions',validateResources(createSessionSchema),createUserSessionHandler);
}

export default routes