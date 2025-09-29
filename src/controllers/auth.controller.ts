import { Request, Response } from "express";
import { AppDataSource } from '../config/data-sources';
import { User } from "../entity/User";
import { signAccessToke, signRefreshToken } from "../utils/generateJwt";
import jwt from 'jsonwebtoken';

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await AppDataSource.getRepository(User).findOne({
      where: { email },
    });
    const sanitizeUser = (user: User) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword
    }

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid password' });
    }

    const token = signAccessToke({ sub: user.id, email: user.email });
    // const refreshToken = signRefreshToken({ sub: user.id, email: user.email });
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
       path: "/"
    });
    res.json({
      message: 'Login successful',  
      userInfo: sanitizeUser(user),
    });

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

}
