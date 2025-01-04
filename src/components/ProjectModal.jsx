import React, { useState} from "react";
import { Modal, Input, Button, Switch } from "antd";

const ProjectModal = ({ visible, onCancel, onAddProject, editProject, updateEditProject }) => {

const isEdit = editProject.isEdit;

const handleAdd = () => {
    if (editProject.name.trim()) {
      onAddProject(editProject);
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
        value={editProject.name || ""}
        onChange={(e) => updateEditProject("name",e.target.value)}
      />
      <label>Color</label>
      <Input
        value={editProject.color || ""}
        onChange={(e) => updateEditProject("color",e.target.value)}
      />
      <label>Add to favorites</label>
      <br />
      <Switch
        checked={editProject.isFavorite || false}
        onChange={(checked) => updateEditProject("isFavorite",checked)}
      />{" "}
    </Modal>
  );
};

export default ProjectModal;
