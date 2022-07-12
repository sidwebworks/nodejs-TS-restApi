import { AnyArray, DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { omit } from "lodash";
import UserModel, { UserDocument } from "../models/user.model";
import config from "config"
import axios from "axios";
import qs from 'querystring'
import log from "../utils/logger";
import { CreateUserInput } from "../schema/user.schema";

export async function createUser(
  input: CreateUserInput['body']
) {
  try {
    const user = await UserModel.create(input);

    return omit(user.toJSON(), "password");
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}

interface GoogleOAuthTokenResult{
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export async function getGoogleOAuthTokens({code,}:{code:string}):
Promise<GoogleOAuthTokenResult>{
  const url = 'https://oauth2.googleapis.com/token';

  const values = {
    code,
    client_id: config.get('googleClientId') as string,
    client_secret: config.get('googleClientSecret') as string,
    redirect_uri: config.get('googleOAuthRedirectUrl') as string,
    grant_type: 'authorization_code' as string,
  };

  try{
      const res = await axios.post<GoogleOAuthTokenResult>(url,qs.stringify(values),{
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
      });
      return res.data
  }catch(e: any){
    log.error(e, 'Failed to getch google oauth tokens');
    throw new Error(e.message);

  }
}

interface GoogleUserResult{
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
    
}

export async function getGoogleUser({id_token, access_token}:{id_token:string, access_token: string}): Promise<GoogleUserResult>{
  try{
    const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,{
      headers: {
        Authorization: `Bearer ${id_token}`
      },

    });
    return res.data;
  }
  catch(e: any){
    log.error(e, 'Failed to getch google user');
    throw new Error(e.message);

  }
  
}

export async function findAndUpdateUser(
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions={}

){
  return UserModel.findOneAndUpdate(query, update, options);
}