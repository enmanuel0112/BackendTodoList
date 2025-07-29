import { Request, Response } from "express";
import { AppDataSource } from '../config/data-sources';
import { User } from "../entity/User";
import { generateToken } from "../utils/generateJwt";
export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await AppDataSource.getRepository(User).findOne({
      where: { email },
      relations: ["tasks"]
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

    const token = generateToken({ userId: user.id, email: user.email });

    res.json({
      message: 'Login successful',
      boolean: true,
      user: sanitizeUser(user),
      token
    });

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error logging in user:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

}
