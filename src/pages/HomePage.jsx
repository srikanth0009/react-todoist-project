import React, { useEffect, useReducer, useState } from "react";
import { Layout, Typography } from "antd";
import Sidebar from "../components/Sidebar";
import TaskModal from "../components/TaskModal";
import ProjectModal from "../components/ProjectModal";
import {
  fetchTasks,
  addTask as addNewTask,
  editTask,
  deleteTask as del,
  closeTask as close,
} from "../components/Tasks";
import {
  fetchProjects,
  addProject as addNewProject,
  updateProject,
  deleteProject,
} from "../components/Projects";
import TaskList from "../components/TaskList";
import { Input } from "antd";

const { Content } = Layout;

const initialState = {
  view: "Inbox",
  taskModal: {
    visible: false,
    taskData: { content: "", description: "", projectId: "0" },
    editIndex: null,
  },
  tasks: [],
  projects: [],
  projectState: {
    currentProject: null,
    editProject: {
      id: "",
      name: "",
      color: "",
      isFavorite: false,
      isEdit: false,
    },
    modalVisible: false,
  },
  filteredProjects: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, view: action.payload };

    case "SET_TASKS":
      return { ...state, tasks: action.payload };

    case "ADD_TASKS":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };

    case "UPDATE_TASK": {
      const { id, content, description } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === id
            ? { ...task, content: content, description: description }
            : task
        ),
      };
    }

    case "DELETE_TASK": {
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    }

    case "SET_PROJECTS":
      return { ...state, projects: action.payload }; 

    case "ADD_PROJECT":
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };

    case "UPDATE_PROJECT": {
      const { id, name } = action.payload;
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === id ? { ...project, name: name } : project
        ),
      };
    }

    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter(
          (project) => project.id !== action.payload
        ),
      };

    case "UPDATE_TASK_MODAL":
      return { ...state, taskModal: { ...state.taskModal, ...action.payload } };

    case "UPDATE_TASK_MODAL_KEY_VALUE":
      return {
        ...state,
        taskModal: {
          ...state.taskModal,
          ...action.payload,
          taskData: {
            ...state.taskModal.taskData,
            ...(action.payload.taskData || {}),
          },
        },
      };

    case "SET_PROJECT_STATE":
      return {
        ...state,
        projectState: { ...state.projectState, ...action.payload },
      };

      case "UPDATE_PROJECT_STATE_KEY_VALUE":
      return {
        ...state,
        projectState: {
          ...state.projectState,
          ...action.payload,
          editProject: {
            ...state.projectState.editProject,
            ...(action.payload.editProject || {}),
          },
        },
      };

    case "SET_FILTERED_PROJECTS":
      return { ...state, filteredProjects: action.payload };

    default:
      return state;
  }
};

const HomePage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { Title } = Typography;
  const { Search } = Input;

  useEffect(() => {
    fetchProjects((projects) =>
      dispatch({ type: "SET_PROJECTS", payload: projects })
    );
    fetchTasks((tasks) => dispatch({ type: "SET_TASKS", payload: tasks }));
  }, []);

  const addProject = (project) => {
    if (project.isEdit) {
      updateProject(project.id, project, (updatedProjects) =>
        dispatch({ type: "UPDATE_PROJECT", payload: updatedProjects })
      );
      dispatch({
        type: "SET_PROJECT_STATE",
        payload: {
          editProject: {
            id: "",
            name: "",
            color: "",
            isFavorite: false,
            isEdit: false,
          },
        },
      });
    } else {
      addNewProject(project, (updatedProjects) =>
        dispatch({ type: "ADD_PROJECT", payload: updatedProjects })
      );
    }
  };


  const handleMenuClick = (key, projectId = state.projects[0]?.id) => {
    if (key === "addTask") {
      dispatch({
        type: "UPDATE_TASK_MODAL",
        payload: {
          visible: true,
          taskData: { content: "", description: "", projectId },
          editIndex: null,
        },
      });
    } else if (state.projects.some((project) => project.name === key)) {
      const selectedProject = state.projects.find(
        (project) => project.name === key
      );
      if (selectedProject) {
        dispatch({ type: "SET_VIEW", payload: "projects" });
        dispatch({
          type: "SET_PROJECT_STATE",
          payload: { currentProject: selectedProject },
        });
      }
    } else {
      dispatch({ type: "SET_VIEW", payload: key });
    }
  };

  const handleEditTaskClick = (id) => {
    const taskToEdit = state.tasks.find((task) => task.id === id);

    dispatch({
      type: "UPDATE_TASK_MODAL",
      payload: {
        visible: true,
        taskData: {
          content: taskToEdit.content,
          description: taskToEdit.description,
          projectId: taskToEdit.projectId,
        },
        editIndex: taskToEdit.id,
      },
    });
  };

  const handleTaskChange = (key, value) => {
    dispatch({
      type: "UPDATE_TASK_MODAL_KEY_VALUE",
      payload: {
        taskData: { [key]: value },
      },
    });
  };

  const addTask = () => {
    const data = state.taskModal.taskData;

    if (state.taskModal.taskData.content.trim()) {
      if (state.taskModal.editIndex !== null) {
        editTask(
          state.taskModal.editIndex,
          state.taskModal.taskData,
          (updatedTasks) =>
            dispatch({ type: "UPDATE_TASK", payload: updatedTasks })
        );
      } else {
        addNewTask(state.taskModal.taskData, (updatedTasks) =>
          dispatch({ type: "ADD_TASKS", payload: updatedTasks })
        );
      }

      dispatch({
        type: "UPDATE_TASK_MODAL",
        payload: {
          visible: false,
          taskData: { content: "", description: "", projectId: "0" },
        },
      });
     
    } else {
      alert("Task name is required");
    }
  };

  const listProjects = () => {
    dispatch({
      type: "SET_VIEW",
      payload: "projects",
    });

    dispatch({
      type: "SET_PROJECT_STATE",
      payload: { currentProject: null },
    });
  };

  const onSearch = (value) => {
    const searchText = value.trim().toLowerCase();
    const filtered = searchText
      ? state.projects.filter((project) =>
          project.name.toLowerCase().includes(searchText)
        )
      : state.projects;
    dispatch({ type: "SET_FILTERED_PROJECTS", payload: filtered });
  };

  return (
    <Layout style={{ height: "100vh" }}>
      {state.projects.length > 0 && (
        <Sidebar
          tasks={state.tasks}
          projects={state.projects}
          onMenuClick={(key) => handleMenuClick(key)}
          handleEditProjectClick={(project) =>
            dispatch({
              type: "SET_PROJECT_STATE",
              payload: {
                modalVisible: true,
                editProject: {
                  id: project.id,
                  name: project.name,
                  color: project.color,
                  isFavorite: project.isFavorite,
                  isEdit: true,
                },
              },
            })
          }
          removeProject={(id) =>
            deleteProject(id, (updatedProjects) =>
              dispatch({ type: "DELETE_PROJECT", payload: updatedProjects })
            )
          }
          setProjectModalVisible={(visible) =>
            dispatch({
              type: "SET_PROJECT_STATE",
              payload: { modalVisible: visible },
            })
          }
          listProjects={listProjects}
        />
      )}

      <Layout>
        <Content className="p-9 bg-white">
          {state.view === "Inbox" && state.projects.length > 0 && (
            <TaskList
              tasks={state.tasks}
              project={state.projects}
              deleteTask={(id) =>
                del(id, (updatedTasks) =>
                  dispatch({ type: "DELETE_TASK", payload: updatedTasks })
                )
              }
              closeTask={(id) =>
                close(id, (updatedTasks) =>
                  dispatch({ type: "DELETE_TASK", payload: updatedTasks })
                )
              }
              handleAddTaskClick={(key, saveto) => handleMenuClick(key, saveto)}
              handleEdit={(id) => handleEditTaskClick(id)}
            />
          )}

          {state.view === "today" && <p>There is no tasks for today</p>}
          {state.view === "upcoming" && <p>There is no upcoming tasks</p>}
          {state.view === "filters" && <p>No filters applied</p>}

          {state.view === "projects" && state.projectState.currentProject ? (
            <TaskList
              tasks={state.tasks}
              project={state.projectState.currentProject}
              deleteTask={(id) =>
                del(id, (updatedTasks) =>
                  dispatch({ type: "DELETE_TASK", payload: updatedTasks })
                )
              }
              closeTask={(id) =>
                close(id, (updatedTasks) =>
                  dispatch({ type: "DELETE_TASK", payload: updatedTasks })
                )
              }
              handleAddTaskClick={(key, saveto) => handleMenuClick(key, saveto)}
              handleEdit={(id) => handleEditTaskClick(id)}
            />
          ) : (
            state.view === "projects" && (
              <div className="mx-[150px] my-[50px]">
                <Title level={1}>Projects</Title>
                <Search
                  placeholder="Search projects"
                  allowClear
                  onChange={(event) => onSearch(event.target.value)}
                  style={{ marginBottom: "20px" }}
                />
                <ul>
                  {state.filteredProjects.map(
                    (project) =>
                      project.name !== "Inbox" && (
                        <li
                          className="m-2 p-2 hover:border hover:rounded-lg"
                          key={project.id}
                        >
                          <span
                            className="text-lg hover:cursor-pointer"
                            onClick={() => handleMenuClick(project.name)}
                          >
                            {project.name}
                          </span>
                        </li>
                      )
                  )}
                </ul>
              </div>
            )
          )}
        </Content>
      </Layout>

      <TaskModal
        visible={state.taskModal.visible}
        taskData={state.taskModal.taskData}
        projects={state.projects}
        onCancel={() =>
          dispatch({
            type: "UPDATE_TASK_MODAL",
            payload: {
              visible: false,
              taskData: { content: "", description: "", projectId: "0" },
            },
          })
        }
        onOk={addTask}
        onChange={(key, value) => handleTaskChange(key, value)}
      />

      <ProjectModal
        visible={state.projectState.modalVisible}
        onCancel={() =>
          dispatch({
            type: "SET_PROJECT_STATE",
            payload: {
              modalVisible: false,
              editProject: {
                id: "",
                name: "",
                color: "",
                isFavorite: false,
                isEdit: false,
              },
            },
          })
        }
        onAddProject={addProject}
        editProject={state.projectState.editProject}
        updateEditProject={(key, value) =>
          dispatch({
            type: "UPDATE_PROJECT_STATE_KEY_VALUE",
            payload: {
              editProject: {
                // ...state.projectState.editProject,
                [key]: value,
              },
            },
          })
        }
      />
    </Layout>
  );
};

export default HomePage;
