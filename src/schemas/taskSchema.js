import { z } from "zod";

export const taskSchema = z.object({
    specialInitiative: z.boolean().optional(),
    project: z.string().min(1, "Project is required"),
    taskTitle: z.string().min(1, "Task Title is required"),
    description: z.string().optional(),
    assignTo: z.string().min(1, "Assign To is required"),
    startDate: z.string().min(1, "Start Date is required"),
    dueDate: z.string().min(1, "Due Date is required"),
    priority: z.enum(["low", "medium", "high"]),
    tags: z.string().optional(),
    observer: z.string().optional(),
    attachments: z.any().optional(),
});