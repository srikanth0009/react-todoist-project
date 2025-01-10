import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, addTask as addNewTask, editTask, deleteTask, openTaskModal, closeTaskModal } from "../features/tasks/tasksSlice";
import { fetchProjects, addProject as addNewProject, updateProject, deleteProject, openProjectModal, closeProjectModal } from "../features/projects/projectsSlice";
import { Layout, Typography } from "antd";
import Sidebar from "../components/Sidebar";
import TaskModal from "../components/TaskModal";
import ProjectModal from "../components/ProjectModal";
import TaskList from "../components/TaskList";

import { Input } from "antd";
const { Content } = Layout;

const HomePage = () => {

  const [view, setView] = useState("Inbox");
  const [currentProject, setCurrentProject] = useState("Inbox");

  const [taskModal,setTaskModal] = useState({
        visible: false,
        taskData : { content : "", description : "", projectId : "0"},
        editIndex : null,
  })

  const [projectModal, setProjectModal] = useState({
      visible: false,
      projectData: { name: "", color: "", isFavorite: false },
      editIndex: null,
  })

  const dispatch = useDispatch();
  const tasks = useSelector((state)=> state.tasks.tasks);
  const projects = useSelector((state)=> state.projects.projects);
  
  const [filteredProjects, setFilteredProjects] = useState(projects);


  const { Title } = Typography;
  const { Search } = Input;

  useEffect(() => {

    dispatch(fetchProjects());
    dispatch(fetchTasks());

  }, []);

  const addProject = () => {
  
    if (projectModal.editIndex !== null) {
      const projectId = projectModal.editIndex; 
      const updatedData = projectModal.projectData ;
      dispatch(updateProject({projectId, updatedData }));
    } else {
        dispatch(addNewProject(projectModal.projectData));
    }

    setProjectModal({ visible: false, projectData: { name: "", color: "", isFavorite: false }, editIndex: null });

  };


  const handleEditProjectClick = (pro) => {

    const projectToEdit = projects.find((project) => project.id === pro.id);  
       
    setProjectModal({ visible: true, projectData: projectToEdit, editIndex: projectToEdit.id });

  };

  const handleMenuClick = (key, projectId = projects[0]?.id) => {
    if (key === "addTask") {

      setTaskModal({
        visible: true,
        taskData: { content: "", description: "", projectId },
        editIndex: null,
      });

    } else if(key === "Inbox"){
      setView("Inbox");
      setCurrentProject(null);

    } else if (projects.some((project) => project.name === key)) {
      const selectedProject = projects.find(
        (project) => project.name === key
      );
      
      if (selectedProject) {

        setView("projects");
        setCurrentProject(selectedProject);
      }
    } else {
      setView(key);
      setCurrentProject(null);
    }
  };

  const handleEditTaskClick = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);

    setTaskModal({
      visible: true,
      taskData: {
        content: taskToEdit.content,
        description: taskToEdit.description,
        projectId: taskToEdit.projectId,
      },
      editIndex: taskToEdit.id,
    });    
  };

  const handleTaskChange = (key, value) => {
    
    setTaskModal((prev) => ({
      ...prev,
      taskData: { ...prev.taskData, [key]: value },
    }));
  };

  const addTask = () => {

    if (taskModal.taskData.content.trim()) {

      if (taskModal.editIndex !== null) {

        dispatch(editTask({ taskId: taskModal.editIndex, updatedData: taskModal.taskData }));
      
      } else {
        dispatch(addNewTask(taskModal.taskData));
      }
       setTaskModal({ visible: false, taskData: { content: "", description: "", projectId: "0" }, editIndex: null });


    } else {
      alert("Task name is required");
    }
  };

  const listProjects = () => {
    setView("projects");
    setCurrentProject(null);
  };

  const onSearch = (value) => {
    const searchText = value.trim().toLowerCase();
    const filtered = searchText
      ? projects.filter((project) =>
          project.name.toLowerCase().includes(searchText)
        )
      : projects;

    setFilteredProjects(filtered);
    };

  return (
    <Layout style={{ height: "100vh" }}>
      {projects.length > 0 && (
        <Sidebar
          tasks={tasks}
          projects={projects}
          onMenuClick={(key) => handleMenuClick(key)}
          handleEditProjectClick={ (project) => handleEditProjectClick(project) }
          removeProject={(id) => { dispatch(deleteProject(id)) } } 
          setProjectModalVisible={(visibility) => 
            setProjectModal((prev) => ({ ...prev, visible: visibility }))
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
              deleteTask={(id) => dispatch(deleteTask(id)) }
              closeTask={(id) => dispatch(deleteTask(id)) }
              handleAddTaskClick={(key, saveto) => handleMenuClick(key, saveto)}
              handleEdit={(id) => handleEditTaskClick(id)}
            />
          )}

          {view === "today" && <p>There is no tasks for today</p>}
          {view === "upcoming" && <p>There is no upcoming tasks</p>}
          {view === "filters" && <p>No filters applied</p>}

          {view === "projects" && currentProject ? (
            <TaskList
              tasks={tasks}
              project={currentProject}
              deleteTask={(id) =>  dispatch(deleteTask(id)) }
              closeTask={(id) => dispatch(deleteTask(id))}
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
                  onChange={(event) => onSearch(event.target.value)}
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
            editIndex: null,
          })
         }
        onOk={addTask}
        onChange={(key, value) => handleTaskChange(key, value)}
      />

      <ProjectModal
        visible={projectModal.visible}
        onCancel={() =>
          setProjectModal({
            visible: false,
            projectData: { name: "", color: "", isFavorite: false },
            editIndex: null,
          })
         }
        onAddProject={addProject}
        projectModal={projectModal}
        updateProjectData={(key, value) =>
          setProjectModal((prev) => ({
            ...prev,
            projectData: { ...prev.projectData, [key]: value },
          }))
        }
      />
    </Layout>
  );
};

export default HomePage;
