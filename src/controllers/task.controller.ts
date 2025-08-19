import { application, Request, Response } from "express";
import { AppDataSource } from "../config/data-sources";
import { Task } from "../entity/Task";
import { User } from "../entity/User";

export const createTask = async (req: Request, res: Response) => {

  try {
    const userId = Number(req.user!.id);
    const { content, isCompleted = false } = req.body ;

    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return
    }

    const sanitizeUser = (user_id: User) => {
      const { password, ...userWithoutPassword } = user_id;
      return userWithoutPassword
    }
    const task = new Task();
    task.content = content;
    task.isCompleted = isCompleted;
    task.user = user;

    await task.save()
    res.json({
      message: 'Task created successfully',
      task: {
        ...task,
       user: sanitizeUser(user)
      }
    });

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating task:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }


}

export const getTasks = async (req: Request, res: Response) => {
  try {
   const userId = (req as any).user.id ;
   const tasks = await AppDataSource.getRepository(Task).find({
      where: {user: { id: userId}},
      order: { createdAt: 'DESC' },
    });
    res.json(tasks);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching tasks:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const updateTask = async (req: Request, res: Response) => {
  const userId = Number(req.user!.id);
  const { content, isCompleted} = req.body;

  try {
    const task = await AppDataSource.getRepository(Task).findOneBy({
       task_id: parseInt(req.params.task_id),
        user: { id: userId }
      });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    if (!userId) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    
    task.content = content;
    task.isCompleted = isCompleted;

    await task.save();

    res.json(
    {
      task,
      user: userId
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching task by ID:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { task_id } = req.params;
    const result = await AppDataSource.getRepository(Task).delete({ task_id: parseInt(task_id) });
    if (result.affected === 0) {
      res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error deleting task:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}