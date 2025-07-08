import { Request, Response } from "express";
import { User } from "../entity/User";

export const createUser = async (req: Request, res: Response) => {

  const { userName, email, password } = req.body;

  const user = new User();
  user.userName = userName;
  user.email = email;
  user.password = password;

  await user.save()
    .then(() => console.log('done'))
    .catch((error) => console.error('Error creating user:', error));

  console.log('User created:', user);
  res.json(user);

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

