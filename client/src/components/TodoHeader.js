import React, { useState } from "react";
import { AppBar, Box, Button, Typography } from "@mui/material";
import Modal from "./Modal";
import { useCookies } from "react-cookie";

const TodoHeader = ({ listName, getData }) => {
  const [showModal, setShowModal] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(null);

  const signOut = () => {
    console.log("Sign out button clicked");
    removeCookie("Email");
    removeCookie("AuthToken");

    // window.location.reload();
  };

  return (
    <AppBar
      position="static"
      color=""
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "1rem",
        backgroundColor: "#F1F1F1",
        borderRadius: "0",
      }}
    >
      <Typography variant="h6" color="warning" sx={{ p: 2 }}>
        {listName}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button
          variant="contained"
          color="success"
          sx={{ m: 2, borderRadius: 5, fontSize: "0.8rem" }}
          onClick={() => setShowModal(true)}
        >
          <Typography variant="body">ADD NEW</Typography>
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={signOut}
          sx={{ m: 2, borderRadius: 5, fontSize: "0.8rem" }}
        >
          Sign Out
        </Button>
      </Box>
      {showModal && (
        <Modal mode={"create"} setShowModal={setShowModal} getData={getData} />
      )}
    </AppBar>
  );
};

export default TodoHeader;
