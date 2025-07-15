import { Request, Response } from "express";
import { User } from "../entity/User";



export const registerUser = async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;

    const existingUser = await User.findOneBy({ email });

    const sanitizeUser = (user: User) => {
      const {
        password, ...userWithoutPassword } = user;
      return userWithoutPassword
    }
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const user = new User();
    user.userName = userName;
    user.email = email;
    user.password = password;

    await user.save()

    res.status(201).json({
      message: 'User created successfully',
      user: sanitizeUser(user)
    });

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

}

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      relations: ["tasks"]
    });
    const sanitizeUser = (user: User) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid password' });
    }

    res.json({
      message: 'Login successful',
      boolean: true,
      user: sanitizeUser(user),
    });

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error logging in user:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

}

export const getUsers = async (req: Request, res: Response) => {

  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching users:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;
    const user = await User.findOneBy({ use_id: parseInt(req.params.use_id) });
    console.log('User found:', user);

    if (!user) {

      res.status(404).json({ error: 'User not found' });
      return
    }


    user.userName = userName;
    user.email = email;
    user.password = password;

    await user.save()

    res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching user by ID:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { use_id } = req.params;
    const result = await User.delete({ use_id: parseInt(use_id) });
    if (result.affected === 0) {
      res.status(404).json({ error: 'User not found' });

    }

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error deleting user:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

