import { apiClient } from "./client";

export type Task = {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  status: "completed" | "inProgress" | "upComing";
  dueDate: string;
};

type GetTasksResponse = {
  tasks: Task[];
};

type FilterTasksResponse = {
  data: Task[];
};

export const getTasksApi = async (page: number) => {
  const response = await apiClient.get<GetTasksResponse>("/task/allTask", {
    params: { page },
  });
  return response.data.tasks;
};

export const createTaskApi = async (payload: {
  title: string;
  description: string;
  status: "completed" | "inProgress" | "upComing";
  dueDate: string;
}) => {
  const response = await apiClient.post("/task/createTask", payload);
  return response.data;
};

export const updateTaskApi = async (
  taskId: string,
  payload: {
    title: string;
    description: string;
    status: "completed" | "inProgress" | "upComing";
    dueDate: string;
  }
) => {
  // Backend route/controller can vary here.
  // Try `/updateTask/:id` first, then fallback to `/updateTask` with body id.
  try {
    const response = await apiClient.patch(`/task/updateTask/${taskId}`, payload);
    return response.data;
  } catch {
    const response = await apiClient.patch("/task/updateTask", {
      id: taskId,
      ...payload,
    });
    return response.data;
  }
};

export const filterTasksApi = async (status: "completed" | "inProgress" | "upComing") => {
  const response = await apiClient.get<FilterTasksResponse>("/task/filterTask", {
    params: { status },
  });
  return response.data.data || [];
};

export const deleteTasksApi = async (ids: string[]) => {
  const response = await apiClient.delete("/task/delete", {
    data: { ids },
  });
  return response.data;
};
