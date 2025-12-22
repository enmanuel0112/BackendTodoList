import { Request, Response } from "express";
import { AppDataSource } from "../config/data-sources";
import { User } from "../entity/User";

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userName, email } = req.body;
    const userId = (req as any).user.id;
    const user = await AppDataSource.getRepository(User).findOneBy({
      id: userId,
    });
    console.log("User found:", user);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (userName) {
      user.userName = userName;
    }

    if (email) {
      user.email = email;
    }

    await user.save();

    const sanitizeUser = (user: User) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    };

    res.json({
      message: "User updated successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching user by ID:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const result = await AppDataSource.getRepository(User).delete({
      id: userId,
    });
    if (result.affected === 0) {
      res.status(404).json({ error: "User not found" });
    }
    res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting user:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
