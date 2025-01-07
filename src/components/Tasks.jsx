import { TodoistApi } from "@doist/todoist-api-typescript/dist";

const api = new TodoistApi("ec9761859e72ddd389c611948b9e63f46e8f5f61");

export const fetchTasks = async (setTasks) => {
  try {
    const tasks = await api.getTasks();
    setTasks(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

export const addTask = async (taskData, setTasks) => {
  try {
    const task = await api.addTask(taskData);
    setTasks(task);
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

export const editTask = async (taskId, updatedData, setTasks) => {
  try {
    const updatedTask = await api.updateTask(`${taskId}`, updatedData);
    setTasks(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

export const closeTask = async (taskId, setTasks) => {
  try {
    await api.closeTask(taskId);
    setTasks(taskId);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

export const deleteTask = async (taskId, setTasks) => {
  try {
    await api.deleteTask(taskId);
    setTasks(taskId);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};
