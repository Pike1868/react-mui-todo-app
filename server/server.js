const cors = require("cors");
const express = require("express");
const app = express();
const pool = require("./db");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  try {
    res.send("App is running");
  } catch (err) {
    console.error(err);
  }
});

//signup user
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const signUp = await pool.query(
      `INSERT INTO users (email, hashed_password) VALUES($1, $2)`,
      [email, hashedPassword]
    );

    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

    res.json({ email, token });
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      res.json({ detail: "User already exists, try logging in." });
    }
  }
});

//login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query(
      `
    SELECT * 
    FROM users 
    WHERE email=$1
    `,
      [email]
    );

    if (!user.rows.length) return res.json({ detail: `User does not exist!` });

    const passwordMatchSuccess = await bcrypt.compare(
      password,
      user.rows[0].hashed_password
    );

    if (passwordMatchSuccess) {
      const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
      res.json({ email: user.rows[0].email, token });
    } else {
      res.json({ detail: "Login failed" });
    }
  } catch (err) {
    console.error(err);
  }
});

//*** Get all todos
app.get("/todos/:userEmail", async (req, res) => {
  const { userEmail } = req.params;

  try {
    const todos = await pool.query(
      `
    SELECT * 
    FROM todos 
    WHERE user_email=$1
    `,
      [userEmail]
    );

    res.json(todos.rows);
  } catch (err) {
    console.error(err);
  }
});

//****Create a new todo
app.post("/todos", async (req, res) => {
  const { user_email, title, progress, date } = req.body;
  const id = uuid();
  try {
    const newToDo = await pool.query(
      "INSERT INTO todos(id, user_email, title, progress, date) VALUES($1,$2,$3,$4,$5) RETURNING title",
      [id, user_email, title, progress, date]
    );
    return res.json(newToDo);
  } catch (err) {
    console.error(err);
  }
});

//****Edit a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_email, title, progress, date } = req.body;

    const editToDo = await pool.query(
      `
        UPDATE todos
        SET user_email=$1, title=$2, progress=$3, date=$4
        WHERE id=$5
        RETURNING title, progress
      `,
      [user_email, title, progress, date, id]
    );
    return res.json(editToDo);
  } catch (err) {
    console.error(err);
  }
});

//*****Delete a todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteToDo = await pool.query(
      `
        DELETE FROM todos
        WHERE id=$1
      `,
      [id]
    );
    return res.json(deleteToDo);
  } catch (err) {
    console.error(err);
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
  });
}

module.exports = app;
