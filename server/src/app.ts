import express, {Request, Response} from "express";
import config from "config";
import cors from "cors";
import responseTime from "response-time";
import cookieParser from "cookie-parser";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import deserializeUser from "./middleware/deserializeUser";
import {restResponseTimeHistogram, startMetricsServer} from "./utils/metrics";
import swaggerDocs from "./utils/swagger";

const port = config.get<number>("port");

const app = express();

app.use(
  cors({
    origin: config.get("origin"),
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use(deserializeUser);

app.use(responseTime((req:Request,res:Response,time:number) =>{
if(req?.route?.path){
  restResponseTimeHistogram.observe({
    method: req.method,
    route: req.route.path,
    status_code: res.statusCode,
  },time * 1000) //seconda dönüştürmek laızm yoksa metricler şaşırıyor
}
}));

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();

  routes(app);

  startMetricsServer();

  swaggerDocs(app, port);
});