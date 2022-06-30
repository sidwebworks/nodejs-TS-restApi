import { Request, Response } from 'express';
import { validatePassword } from '../service/user.service';
import { createSession } from '../service/session.service';
import signJwt from '../utils/jwt.utils';
import config from 'config';


export async function createUserSessionHandler(req: Request, res: Response) {

    //validate the users's password

    const user = await validatePassword(req.body.email, req.body.password);
    if (!user) {
        return res.status(401).json({
            message: 'Invalid email or password'
        });
    }

        //create a session for the user
        const session = await createSession(user._id , req.get("user-agent") || "");



        //create an access token for the user
        const accessToken = signJwt(
            {...user, session: (session)._id},
            {expiresIn:config.get("accessTokenttl")} //15 minutes
        );



        //create a refresh token for the user
        const refreshToken = signJwt(
            {...user, session: (session)._id},
            {expiresIn:config.get("accessTokenttl")} //15 minutes
        );

        //return access & refresh tokens
        
        return res.send({accessToken, refreshToken});


}

