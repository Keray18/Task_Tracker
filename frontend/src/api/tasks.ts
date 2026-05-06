import { apiClient } from "./client";

export type Task = {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  status: "completed" | "inProgress" | "upComing";
};

type GetTasksResponse = {
  tasks: Task[];
};

export const getTasksApi = async () => {
  const response = await apiClient.get<GetTasksResponse>("/task/allTask");
  return response.data.tasks;
};

export const createTaskApi = async (payload: {
  title: string;
  description: string;
  status: "completed" | "inProgress" | "upComing";
}) => {
  const response = await apiClient.post("/task/createTask", payload);
  return response.data;
};

export const deleteTasksApi = async (ids: string[]) => {
  const response = await apiClient.delete("/task/delete", {
    data: { ids },
  });
  return response.data;
};
