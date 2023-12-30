import React, { useEffect, useState } from "react";
import { Container, List, Paper } from "@mui/material";
import TodoHeader from "./components/TodoHeader";
import TodoItem from "./components/TodoItem";
import Auth from "./components/Auth";
import { useCookies } from "react-cookie";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;
  const [tasks, setTasks] = useState([]);


  //***Fetch all todos for user
  const getData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/todos/${userEmail}`
      );
      const json = await response.json();
      setTasks(json);
    } catch (err) {
      console.error(err);
    }
  };

  //Function to delete a todo
  const deleteItem = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/todos/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 200) {
        getData();
        setTasks((sortedTasks) => sortedTasks.filter((task) => task.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  //run getData, when authToken or userEmail are updated
  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, [authToken, userEmail]);

  const sortedTasks = tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Container maxWidth="sm">
      {!authToken && <Auth />}
      {authToken && (
        <>
          <p className="user-email">Welcome Back {userEmail}</p>
          <TodoHeader listName={"Todo List App"} getData={getData}></TodoHeader>
          <Paper sx={{ padding: "1rem", borderRadius: "0" }}>
            <List>
              {sortedTasks?.map((task) => (
                <TodoItem
                  key={task.id}
                  task={{ ...task }}
                  getData={getData}
                  deleteItem={deleteItem}
                ></TodoItem>
              ))}
            </List>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default App;
