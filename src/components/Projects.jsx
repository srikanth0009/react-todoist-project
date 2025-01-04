import { TodoistApi } from "@doist/todoist-api-typescript/dist";

const api = new TodoistApi("ec9761859e72ddd389c611948b9e63f46e8f5f61");

export const fetchProjects = async (setProjects) => {
  try {
    const projects = await api.getProjects();
    setProjects(projects);  
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};

export const addProject = async (projectData, setProjects) => {
  try {
    const project = await api.addProject({name : projectData.name, isFavorite: projectData.isFavorite});
    setProjects((prev) => [...prev, project]);
  } catch (error) {
    console.error("Error adding project:", error);
  }
};

export const updateProject = async (projectId, updatedData, setProjects) => {
  try {
    const updatedProject = await api.updateProject(`${projectId}`, updatedData);
    setProjects((prev) =>
      prev.map((project) =>
        project.id === updatedProject.id ? { ...project, ...updatedData } : project
      )
    );
  } catch (error) {
    console.error("Error updating project:", error);
  }
};

export const deleteProject = async (projectId, setProjects) => {
  try {
    await api.deleteProject(projectId);
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
  } catch (error) {
    console.error("Error deleting project:", error);
  }
};
