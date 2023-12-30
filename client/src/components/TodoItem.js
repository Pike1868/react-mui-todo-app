import React, { useState } from "react";
import { Box, Button, ListItem } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckBoxOutlineBlankOutlined as BlankCheckBoxIcon,
} from "@mui/icons-material";
import Modal from "./Modal";

const TodoItem = ({ task, getData, deleteItem }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <ListItem
      className="list-item"
      sx={{
        border: "2px solid #c5c5c5",
        borderRadius: "1rem",
        marginBottom: "1rem",
        display: "flex",
        justifyContent: "space-between",
        padding: "0.5rem",
        backgroundColor: "#fff",
      }}
    >
      <Box className="info-container">
        <BlankCheckBoxIcon
          onClick={() => {
          }}
        />
        <p className="task-title">{task.title}</p>
        <strong>{task.progress}% Complete</strong>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          width: "25%",
          height: "100%",
        }}
      >
        <Button
          size="small"
          variant="contained"
          startIcon={<EditIcon />}
          color="secondary"
          sx={{ borderRadius: 5, fontSize: "0.8rem", marginBottom: "0.5rem" }}
          onClick={() => setShowModal(true)}
        >
          EDIT
        </Button>
        <Button
          size="small"
          variant="contained"
          startIcon={<DeleteIcon />}
          color="warning"
          sx={{ borderRadius: 5, fontSize: "0.8rem" }}
          onClick={() => {
            deleteItem(task.id);
          }}
        >
          Delete
        </Button>
      </Box>
      {showModal && (
        <Modal
          mode={"edit"}
          setShowModal={setShowModal}
          getData={getData}
          task={task}
        />
      )}
    </ListItem>
  );
};

export default TodoItem;
