import { Request, Response } from "express";
import { AppDataSource } from '../config/data-sources';
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
      res.status(400).json({ error: 'User with this email already exists' });
      return
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

// export const getUsers = async (_req: Request, res: Response) => {

//   try {
//     const users = await AppDataSource.getRepository(User).find();
//     res.json(users);
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error('Error fetching users:', error.message);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

// }

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userName, email } = req.body;
    const user = await AppDataSource.getRepository(User).findOneBy({ id: parseInt(req.params.id) });
    console.log('User found:', user);

    if (!user) {

      res.status(404).json({ error: 'User not found' });
      return
    }

    if(userName){
      user.userName = userName;
    }

    if(email){
    user.email = email;
    }

    await user.save()

     const sanitizeUser = (user: User) => {
      const {
        password, ...userWithoutPassword } = user;
      return userWithoutPassword
    }

    res.json({
      message: 'User updated successfully',
      user: sanitizeUser(user)

    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching user by ID:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AppDataSource.getRepository(User).delete({ id: parseInt(id) });
    if (result.affected === 0) {
      res.status(404).json({ error: 'User not found' });

    }
  res.status(204).json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error deleting user:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

