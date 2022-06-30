import {DocumentDefinition} from 'mongoose';
import UserModel,{ UserDocument } from '../models/user.model';
import {omit} from 'lodash';

export async function createUser(input: DocumentDefinition<Omit<UserDocument,'createdAt' | 
'updatedAt' | 'comparePassword'>>){
    try{
        const user =  await UserModel.create(input);

        return omit(user.toJSON(), 'password');
    }catch(e){
        throw e;
    }
}

export async function validatePassword(email: string, password: string){
    try{
        const user = await UserModel.findOne({email});
        if(!user){
            return false;
        }
        const isValid = await user.comparePassword(password);

        if(!isValid) return false;
        return omit(user.toJSON(), 'password');


    }catch(e){
        throw e;
    }
}