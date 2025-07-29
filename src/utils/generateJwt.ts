import jwt, { Secret } from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: "1D"

  });
};