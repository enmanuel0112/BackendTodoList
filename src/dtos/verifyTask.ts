import {z} from "zod";


export const createTaskSchema = z.object({
    content : z.string().min(10, { message: "Content is required" }),
    isCompeleted: z.boolean().default(false),
});

export const updateTaskSchema = z.object({
    content : z.string().min(10, { message: "Content is required" }).optional(),
    isCompeleted: z.boolean().optional(),
});
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;

export type CreateTaskDto = z.infer<typeof createTaskSchema>;