import { Request, Response } from "express";
import { AppDataSource } from "../data-sources";
import { Task } from "../entity/Task";
import { User } from "../entity/User";

export const createTask = async (req: Request, res: Response) => {

  try {
    const { content, isCompleted, useId } = req.body;
    const user_id = await AppDataSource.getRepository(User).findOneBy({ use_id: useId });
    if (!user_id) {
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
    task.user = user_id;

    await task.save()
    res.json({
      message: 'Task created successfully',
      task: {
        ...task,
        user: sanitizeUser(user_id)
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
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching tasks:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const updateTask = async (req: Request, res: Response) => {
  const { content, isCompleted, useId } = req.body;
  const user_id = await AppDataSource.getRepository(User).findOneBy({ use_id: useId });
  try {
    const task = await Task.findOneBy({ task_id: parseInt(req.params.task_id) });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    if (!user_id) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    task.content = content;
    task.isCompleted = isCompleted;
    task.user = user_id;
    await task.save();

    res.json(task);
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
    const result = await Task.delete({ task_id: parseInt(task_id) });
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