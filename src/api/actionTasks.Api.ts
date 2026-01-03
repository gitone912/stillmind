import axios from 'axios';
import { BASE_URL_AUTH } from "./baseUrls";
const BASE_URL =  BASE_URL_AUTH;

interface TaskData {
  userId: string;
  taskName: string;
  completion_points: number;
}

export const createTaskApi = async (taskData: TaskData) => {
  const response = await axios.post(`${BASE_URL}/v1/tasks/create`, taskData);
  return response.data;
};

export const updateTaskCompletionApi = async (taskId: string, isCompleted: boolean) => {
  const response = await axios.patch(`${BASE_URL}/v1/tasks/complete/${taskId}`, { isCompleted });
  return response.data;
};

export const getTodaysTasksApi = async (userId: string) => {
  const response = await axios.post(`${BASE_URL}/v1/tasks/today-tasks`, { userId });
  return response.data;
};

export const reduceTaskCompletionApi = async (taskId: string) => {
  const response = await axios.patch(`${BASE_URL}/v1/tasks/reduce/${taskId}`, { isCompleted: false });
  return response.data;
};

export const deleteTaskApi = async (taskId: string) => {
  const response = await axios.delete(`${BASE_URL}/v1/tasks/delete/${taskId}`);
  return response.data;
};
