import React, { useEffect, useState } from "react";
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
import { Input, List } from "antd";

const { Content } = Layout;

const HomePage = () => {
  const [view, setView] = useState("Inbox");
  const [taskModal, setTaskModal] = useState({
    visible: false,
    taskData: { content: "", description: "", projectId: "0" },
    editIndex: null,
  });
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectState, setProjectState] = useState({
    currentProject: null,
    editProject: {
      id: "",
      name: "",
      color: "",
      isFavorite: false,
      isEdit: false,
    },
    modalVisible: false,
  });
  const [filteredProjects, setFilteredProjects] = useState(projects);

  const { Title } = Typography;
  const { Search } = Input;

  useEffect(() => {
    fetchProjects(setProjects);
    fetchTasks(setTasks);
  }, []);

  const addProject = (project) => {
    if (project.isEdit) {
      updateProject(project.id, project, setProjects);

      setProjectState((prev) => ({
        ...prev,
        editProject: {
          id: "",
          name: "",
          color: "",
          isFavorite: false,
          isEdit: false,
        },
      }));
    } else {
      addNewProject(project, setProjects);
    }
  };

  const handleEditProjectClick = (project) => {
    setProjectState((prev) => ({
      ...prev,
      modalVisible: true,
      editProject: {
        id: project.id,
        name: project.name,
        color: project.color,
        isFavorite: project.isFavorite,
        isEdit: true,
      },
    }));
  };

  const updateSetEditProject = (key, value) => {
    setProjectState((prev) => ({
      ...prev,
      editProject: {
        ...prev.editProject,
        [key]: value,
      },
    }));
  };

  const removeProject = (project) => {
    deleteProject(project.id, setProjects);
    console.log("hello");
    setView("Inbox");
  };

  const handleMenuClick = (key, projectId = projects[0]?.id) => {
    if (key === "addTask") {
      setTaskModal({
        visible: true,
        taskData: { content: "", description: "", projectId },
        editIndex: null,
      });
    } else if (projects.some((project) => project.name === key)) {
      const selectedProject = projects.find((project) => project.name === key);
      if (selectedProject) {
        setView("projects");
        setProjectState((prev) => ({
          ...prev,
          currentProject: selectedProject,
        }));
      }
    } else {
      setView(key);
    }
  };

  const handleEditTaskClick = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);

    setTaskModal({
      visible: true,
      taskData: {
        ...taskModal.taskData,
        ...taskToEdit,
      },
      editIndex: id,
    });
  };

  const handleTaskChange = (key, value) => {
    setTaskModal((prev) => ({
      ...prev,
      taskData: { ...prev.taskData, [key]: value },
    }));
  };

  const addTask = () => {
    const data = taskModal.taskData;

    if (taskModal.taskData.content.trim()) {
      if (taskModal.editIndex !== null) {
        editTask(taskModal.editIndex, taskModal.taskData, setTasks);
      } else {
        addNewTask(data, setTasks);
      }

      setTaskModal({
        visible: false,
        taskData: { content: "", description: "", projectId: "0" },
      });
    } else {
      alert("Task name is required");
    }
  };

  const deleteTask = (id) => {
    del(id, setTasks);
  };

  const closeTask = (id) => {
    close(id, setTasks);
  };

  const listProjects = () => {
    setView("projects");
    setProjectState((prev) => ({
      ...prev,
      currentProject: null,
    }));
  };

  const onSearch = (value) => {

    if (value.trim()) {

      const searchText = value.toLowerCase();
      const updatedProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(searchText)
      );
        setFilteredProjects(updatedProjects);

    } else {
       setFilteredProjects(projects);
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      {projects.length > 0 && (
        <Sidebar
          tasks={tasks}
          projects={projects}
          onMenuClick={handleMenuClick}
          handleEditProjectClick={(project) => handleEditProjectClick(project)}
          removeProject={(id) => removeProject(id)}
          setProjectModalVisible={(visible) =>
            setProjectState((prev) => ({
              ...prev,
              modalVisible: visible,
            }))
          }
          listProjects={listProjects}
        />
      )}

      <Layout>
        <Content className="p-9 bg-white">
          {view === "Inbox" && projects.length > 0 && (
            <TaskList
              tasks={tasks}
              project={projects[0]}
              deleteTask={(index) => deleteTask(index)}
              closeTask={(index) => closeTask(index)}
              handleAddTaskClick={(key) => handleMenuClick(key)}
              handleEdit={(id) => handleEditTaskClick(id)}
            />
          )}

          {view === "today" && <p>There is no tasks for today</p>}
          {view === "upcoming" && <p>There is no upcoming tasks</p>}
          {view === "filters" && <p>No filters applied</p>}

          {view === "projects" && projectState.currentProject ? (
            <TaskList
              tasks={tasks}
              project={projectState.currentProject}
              deleteTask={(index) => deleteTask(index)}
              closeTask={(index) => closeTask(index)}
              handleAddTaskClick={(key, saveto) => handleMenuClick(key, saveto)}
              handleEdit={(id) => handleEditTaskClick(id)}
            />
          ) : (
            view === "projects" && (
              <div className="mx-[150px] my-[50px]">
                <Title level={1}>Projects</Title>
                <Search
                  placeholder="Search projects"
                  allowClear
                  onChange={(event)=> onSearch(event.target.value)}
                  style={{ marginBottom: "20px" }}
                />
                <ul>
                  {filteredProjects.map(
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
        visible={taskModal.visible}
        taskData={taskModal.taskData}
        projects={projects}
        onCancel={() =>
          setTaskModal({
            visible: false,
            taskData: { content: "", description: "", projectId: "0" },
          })
        }
        onOk={addTask}
        onChange={(key, value) => handleTaskChange(key, value)}
      />

      <ProjectModal
        visible={projectState.modalVisible}
        onCancel={() =>
          setProjectState((prev) => ({
            ...prev,
            modalVisible: false,
            editProject: {
              id: "",
              name: "",
              color: "",
              isFavorite: false,
              isEdit: false,
            },
          }))
        }
        onAddProject={addProject}
        editProject={projectState.editProject}
        updateEditProject={(key, value) => updateSetEditProject(key, value)}
      />
    </Layout>
  );
};

export default HomePage;
