import React, { useState} from "react";
import { Modal, Input, Button, Switch } from "antd";

const ProjectModal = ({ visible, onCancel, onAddProject, projectModal, updateProjectData }) => {

const isEdit = projectModal.editIndex;

const handleAdd = () => {
    if (projectModal.projectData.name.trim()) {
      onAddProject();
      onCancel();
    } else {
      alert("Project name cannot be empty");
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Project" : "Add Project"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="add" type="primary" onClick={handleAdd}>
          {isEdit ? "Update Project" : "Add Project"}
        </Button>,
      ]}
    >
      <label>Name</label>
      <Input
        value={projectModal.projectData.name || ""}
        onChange={(e) => updateProjectData("name",e.target.value)}
      />
      <label>Color</label>
      <Input
        value={projectModal.projectData.color || ""}
        onChange={(e) => updateProjectData("color",e.target.value)}
      />
      <label>Add to favorites</label>
      <br />
      <Switch
        checked={projectModal.projectData.isFavorite || false}
        onChange={(checked) => updateProjectData("isFavorite",checked)}
      />{" "}
    </Modal>
  );
};

export default ProjectModal;
