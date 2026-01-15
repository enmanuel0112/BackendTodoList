import { application, Request, Response } from "express";
import { AppDataSource } from "../config/data-sources";
import { Task } from "../entity/Task";
import { User } from "../entity/User";

export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user!.id);
    const { content, isCompleted = false } = req.body;

    const user = await AppDataSource.getRepository(User).findOneBy({
      id: userId,
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const sanitizeUser = (user_id: User) => {
      const { password, ...userWithoutPassword } = user_id;
      return userWithoutPassword;
    };
    const task = new Task();
    if (content) {
      task.content = content;
    }
    if (isCompleted !== undefined) {
      task.isCompleted = isCompleted;
    }
    if (user) {
      task.user = user;
    }

    await task.save();
    res.json({
      message: "Task created successfully",
      task: {
        ...task,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const pages = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (pages - 1) * limit;
    const tasks = await AppDataSource.getRepository(Task)

      .createQueryBuilder("task")
      .where("task.userId = :userId", { userId })
      .orderBy("task.createdAt", "ASC")
      .leftJoinAndSelect("task.user", "user")
      .skip(skip)
      .take(limit);

    const [data, total] = await tasks.getManyAndCount();

    const filterData = data.map((task) => {
      const { password, createdAt, updatedAt, ...userWithoutPassword } =
        task.user;

      return {
        ...task,
        user: userWithoutPassword,
      };
    });
    res.status(200).json({
      data: filterData,
      total,
      pages,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const editTask = async (req: Request, res: Response) => {
  const userId = Number(req.user!.id);
  const { content, isCompleted } = req.body;

  try {
    const task = await AppDataSource.getRepository(Task).findOneBy({
      taskId: parseInt(req.params.taskId),

      user: { id: userId },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    if (!userId) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    if (content) {
      task.content = content;
    }

    if (isCompleted !== undefined) {
      task.isCompleted = isCompleted;
    }

    await task.save();

    res.json({
      task,
      user: userId,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching task by ID:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const result = await AppDataSource.getRepository(Task).delete({
      taskId: parseInt(taskId),
    });
    if (result.affected === 0) {
      res.status(404).json({ error: "Task not found" });
    }
    res.json({
      message: "Task Deleted",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting task:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
