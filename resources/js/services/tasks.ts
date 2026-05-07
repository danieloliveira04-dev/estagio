import tasks from "@/routes/projects/tasks";
import api from "./api";
import { Task } from "@/types";

export const getTask = (projectId: number, taskId: number) => {
    return api.get<Task>(tasks.get({ project: projectId, task: taskId }).url);
};