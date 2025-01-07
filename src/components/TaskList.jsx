import React, { useState } from "react";
import { Button, Typography, Checkbox } from "antd";
import { PlusCircleOutlined, EditOutlined,DeleteOutlined } from "@ant-design/icons";

const TaskList = ({ tasks, project, deleteTask, closeTask , handleAddTaskClick, handleEdit }) => {
   
  const [showEdit, setShowEdit] = useState(false);
  const { Title } = Typography;

  const projectTasks = tasks.filter((task) => task.projectId === project.id);

  return (
    <div className="mx-[150px] my-[50px]">
      <Title level={1}>{project.name}</Title>

      {projectTasks.map((task) => (
        <div
          key={task.id}
          className="p-2 border-b flex justify-between"
          onMouseEnter={() => setShowEdit(true)}
          onMouseLeave={() => setShowEdit(false)}
        >
          <div>
            <Checkbox onClick={() => closeTask(task.id)}></Checkbox>
            <strong className="p-2">{task.content}</strong>
            <p className="px-3 mx-3">{task.description}</p>
          </div>
          <div className="flex gap-3">
          {showEdit && <EditOutlined onClick={() => handleEdit(task.id)} />}
          {showEdit && <DeleteOutlined  onClick={() => deleteTask(task.id)} />}
          </div>
        </div>
      ))}

      <Button className="my-2 border-none" onClick={() => handleAddTaskClick("addTask", project.id)}>
        <PlusCircleOutlined className="text-red-700" />
        <span className="text-red-700">Add Task</span>
      </Button>
    </div>
  );
};

export default TaskList;