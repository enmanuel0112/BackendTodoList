import { Request, Response } from "express";
import { AppDataSource } from "../config/data-sources";
import { User } from "../entity/User";
import { signAccessToke } from "../utils/generateJwt";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;

    const existingUser = await User.findOneBy({ email });

    const sanitizeUser = (user: User) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    };
    if (existingUser) {
      res.status(400).json({ error: "User with this email already exists" });
      return;
    }

    const user = new User();
    user.userName = userName;
    user.email = email;
    user.password = password;

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await AppDataSource.getRepository(User).findOne({
      where: { email },
    });
    const sanitizeUser = (user: User) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    };

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid password" });
    }

    const token = signAccessToke({ sub: user.id, email: user.email });
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });
    res.json({
      message: "Login successful",
      userInfo: sanitizeUser(user),
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const profile = async (_req: Request, res: Response) => {
  const userId = (_req as any).user.id;

  try {
    const user = await AppDataSource.getRepository(User).findOneBy({
      id: userId,
    });

    const sanitizeUser = (user: User) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    };

    res.status(201).json({
      user: sanitizeUser(user!),
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching users:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const logout = async (_req: Request, res: Response) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.json({ message: "Logout successful" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
