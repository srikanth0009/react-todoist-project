import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TodoistApi } from "@doist/todoist-api-typescript/dist";

const api = new TodoistApi("ec9761859e72ddd389c611948b9e63f46e8f5f61");

export const fetchProjects = createAsyncThunk("projects/fetchProjects", async () => {
  const projects = await api.getProjects();
  return projects;
});

export const addProject = createAsyncThunk("projects/addProject", async (projectData) => {
  const project = await api.addProject({
    name: projectData.name,
    isFavorite: projectData.isFavorite,
  });
  return project;
});

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projectId, updatedData }) => {
    const updatedProject = await api.updateProject(projectId, updatedData);
    return { projectId, updatedProject };
  }
);

export const deleteProject = createAsyncThunk("projects/deleteProject", async (projectId) => {
  await api.deleteProject(projectId);
  return projectId;
});

const initialState = {
  projects: [],
  status: "idle", 
  error: null,
};

const projectSlice = createSlice({

  name: "projects",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const { projectId, updatedProject } = action.payload;
        const index = state.projects.findIndex((project) => project.id === projectId);
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project.id !== action.payload
        );
      });
  },
});

// export const { openProjectModal, closeProjectModal } = projectSlice.actions;

export default projectSlice.reducer;
