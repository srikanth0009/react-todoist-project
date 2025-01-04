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
    setTasks((prev) => [...prev, task]);
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

export const editTask = async (taskId, updatedData, setTasks) => {
  console.log(taskId);
  console.log(updatedData);
  try {
    const updatedTask = await api.updateTask(`${taskId}`, updatedData);
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id ? { ...task, ...updatedData } : task
      )
    );
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

export const closeTask = async (taskId, setTasks) => {
  try {
    await api.closeTask(taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

export const deleteTask = async (taskId, setTasks) => {
  try {
    await api.deleteTask(taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};
