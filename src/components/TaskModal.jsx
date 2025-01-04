import React from 'react'
import { Modal } from 'antd';
import {Select, Button,Input} from 'antd'
import { addTask, editTask, deleteTask } from './Tasks';

const TaskModal = ({ visible, taskData, projects, onCancel, onOk, onChange }) => {

    const { content, description, projectId } = taskData;
    
    
  return (
    <Modal
        title="Add Task"
        open={visible}
        onCancel={onCancel}
        onOk={onOk}
        footer={[
          <div className="flex justify-between">

            <Select value={projects.id} onChange={(value) => onChange("projectId",value)} >
             {projects.map((project)=> <Select.Option key={project.id} value={project.id}> {project.name} </Select.Option> )}
            </Select>

            <div className="flex gap-3">
              <Button
                key="cancel"
                onClick={onCancel}
              >
                Cancel
              </Button>

              <Button key="ok" type="primary" onClick={onOk}>
                OK
              </Button>
            </div>
          </div>,
        ]}
      >
        <Input
          placeholder="Task Name"
          value={content}
          onChange={(e) => onChange("content", e.target.value)}
          className="mb-2"
        />
        <Input.TextArea
          placeholder="Description"
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </Modal>
  )
}

export default TaskModal