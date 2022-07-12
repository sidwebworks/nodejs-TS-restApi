//burada database connection işlemlerini yapacağız. 
import cors from 'cors';
import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

async function connect() {
    const dbUri = config.get<string>("dbUri");

    try {
       await mongoose.connect(dbUri);
       console.log("MongoDB connected");
    }
    catch (err) {
        logger.error(err, 'could not connected to db');
        process.exit(1);
    }


        
}



export default connect;