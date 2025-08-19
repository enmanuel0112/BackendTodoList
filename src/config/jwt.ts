import { Secret } from "jsonwebtoken";
import {env} from './env';


export const jwtConfig = {
  accessTttl: '1d',
  refreshTttl: '30d',
  accessSecret: env.JWT_ACCESS_SECRET ,
  refreshSecret: env.JWT_REFRESH_SECRET ,
}

