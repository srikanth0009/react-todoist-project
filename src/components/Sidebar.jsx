import React, { useState } from "react";
import { Menu, Badge, Layout, Typography } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  PlusCircleOutlined,
  SearchOutlined,
  InboxOutlined,
  CalendarOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Popover } from "antd";

const { Sider } = Layout;

const Sidebar = ({
  tasks,
  projects,
  onMenuClick,
  handleEditProjectClick,
  removeProject,
  setProjectModalVisible,
  listProjects,
}) => {
  const [projectsPopup, setProjectsPopup] = useState(null);

  const [collapsed, setCollapsed] = useState(false);

  const { Title } = Typography;

  const menuConfig = [
    {
      key: "profile",
      label: (
        <div className="flex items-center">
          <div className="rounded-full bg-blue-500 text-white w-8 h-8 flex items-center justify-center">
            S
          </div>
          <span className="ml-2">Srikanth</span>
        </div>
      ),
      disabled: true,
    },
    {
      key: "addTask",
      icon: <PlusCircleOutlined className="text-red-700" />,
      label: <span className="text-red-700">Add Task</span>,
    },
    {
      key: "search",
      icon: <SearchOutlined />,
      label: "Search",
    },
    {
      key: "Inbox",
      icon: <InboxOutlined />,
      label: (
        <span>
          Inbox{" "}
          <Badge
            count={
              tasks.filter((task) => task.projectId === projects[0].id).length
            }
            offset={[10, 0]}
          />
        </span>
      ),
    },
    {
      key: "today",
      icon: <CalendarOutlined />,
      label: (
        <span>
          Today{" "}
          <Badge
            count={tasks.filter((task) => task.status === "today").length}
            offset={[10, 0]}
          />
        </span>
      ),
    },
    {
      key: "upcoming",
      icon: <CalendarOutlined />,
      label: "Upcoming",
    },
    {
      key: "filters",
      icon: <AppstoreOutlined />,
      label: "Filters & Labels",
    },
    ...(projects.some((project) => project.isFavorite)
      ? [
          {
            key: "favorites",
            label: (
              <div className="flex justify-between">
                <Title level={5}>Favorites</Title>
              </div>
            ),
            children: projects
              .filter((project) => project.isFavorite)
              .map((project) => ({
                key: project.name,
                label: (
                  <div className="flex justify-between align-center">
                    <span>
                      {project.name}
                      <Badge
                        count={
                          tasks.filter((task) => task.projectId === project.id)
                            .length
                        }
                        offset={[10, 0]}
                      />
                    </span>{" "}
                    <div>
                      <strong
                        onClick={() =>
                          setProjectsPopup((prev) =>
                            prev === `favorites-${project.id}`
                              ? null
                              : `favorites-${project.id}`
                          )
                        }
                      >
                        ...
                      </strong>
                      <Popover
                        content={
                          <div>
                            <p
                              className="cursor-pointer"
                              onClick={() => {
                                setProjectsPopup(null); // Close the popover
                                handleEditProjectClick(project);
                              }}
                            >
                              Edit
                            </p>
                            <p
                              className="cursor-pointer"
                              onClick={() => {
                                setProjectsPopup(null); // Close the popover
                                removeProject(project);
                              }}
                            >
                              Delete
                            </p>
                          </div>
                        }
                        title="Options"
                        trigger="click"
                        open={projectsPopup === `favorites-${project.id}`} // Unique identifier for Projects
                        onOpenChange={(visible) =>
                          setProjectsPopup(
                            visible ? `favorites-${project.id}` : null
                          )
                        }
                      />
                    </div>
                  </div>
                ),
              })),
          },
        ]
      : []),
    {
      key: "projects",
      label: (
        <div className="flex justify-between">
          <Title level={5} onClick={() => listProjects()}>
            My Projects
          </Title>
          <PlusCircleOutlined onClick={() => setProjectModalVisible(true)} />
        </div>
      ),
      children: projects.map(
        (project) =>
          project.name !== "Inbox" && {
            key: project.name,
            label: (
              <div className="flex justify-between align-center">
                <span>
                  {project.name}
                  <Badge
                    count={
                      tasks.filter((task) => task.projectId === project.id)
                        .length
                    }
                    offset={[10, 0]}
                  />
                </span>{" "}
                <div>
                  <strong
                    onClick={() =>
                      setProjectsPopup((prev) =>
                        prev === `projects-${project.id}`
                          ? null
                          : `projects-${project.id}`
                      )
                    }
                  >
                    ...
                  </strong>
                  <Popover
                    content={
                      <div>
                        <p
                          className="cursor-pointer"
                          onClick={() => {
                            setProjectsPopup(null);
                            handleEditProjectClick(project);
                          }}
                        >
                          Edit
                        </p>
                        <p
                          className="cursor-pointer"
                          onClick={() => {
                            setProjectsPopup(null); 
                            removeProject(project);
                          }}
                        >
                          Delete
                        </p>
                      </div>
                    }
                    title="Options"
                    trigger="click"
                    open={projectsPopup === `projects-${project.id}`}
                    onOpenChange={(visible) =>
                      setProjectsPopup(
                        visible ? `projects-${project.id}` : null
                      )
                    }
                  />
                </div>
              </div>
            ),
          }
      ),
    },
  ];

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex h-screen">
      {
        <Sider
          className="bg-gray-100 border-r border-gray-300 transition-all duration-200"
          width={collapsed ? 0 : 250}
        >
          <div className="flex justify-between items-center p-2 bg-gray-100 border-b border-gray-300">
            <Typography.Text strong className="ml-2">
              Menu
            </Typography.Text>
            <button
              onClick={toggleCollapse}
              className="bg-transparent border-none cursor-pointer"
            >
              <MenuFoldOutlined />
            </button>
          </div>

          <Menu
            mode="inline"
            items={menuConfig}
            defaultSelectedKeys={["Inbox"]}
            onClick={({ key }) => onMenuClick(key)}
            className="bg-gray-100 font-medium"
          />
        </Sider>
      }

      {collapsed && (
        <div
          className="w-12 h-screen  flex items-start justify-center pt-2 cursor-pointer"
          onClick={toggleCollapse}
        >
          <MenuUnfoldOutlined />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
