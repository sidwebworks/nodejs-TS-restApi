//when the request come in we gonna create a schema and its going to validate the request against that schema
//for example when we create a user you require email and password you gonna make sure is present and they are string

import {Request, Response, NextFunction} from 'express';
import {AnyZodObject} from 'zod'

const validate = (schema:AnyZodObject) => (req:Request,res:Response,next:NextFunction) =>{
    try{
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    }
    catch(err:any){
        return res.status(400).send(err.message);
    }
}

export default validate;