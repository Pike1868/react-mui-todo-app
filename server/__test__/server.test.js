const request = require("supertest");
const app = require("../server");
const pool = require("../db");
const bcrypt = require("bcrypt");

beforeEach(async () => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash("hashedPassword123", saltRounds);
  // Adding a test user
  await pool.query(
    `INSERT INTO users (email, hashed_password) VALUES('user@example.com', '${hashedPassword}');`
  );
  // Adding a test todo
  await pool.query(
    `INSERT INTO todos (id, user_email, title, progress, date) VALUES ('1', 'user@example.com', 'Test Todo', 50, '2021-01-01T00:00:00.000Z');`
  );
});

afterEach(async () => {
  // Delete all data from todos and users
  await pool.query(`DELETE FROM todos;`);
  await pool.query(`DELETE FROM users;`);
});

//==== Test server is running
describe("GET /", () => {
  it('responds with "App is running"', async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("App is running");
  });
});

//==== Test POST "/signup"
describe("POST /signup", () => {
  it("successfully signs up a new user", async () => {
    const newUser = { email: "newuser@example.com", password: "password123" };
    const response = await request(app).post("/signup").send(newUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.token).toBeDefined();
  });

  it("handles attempting to sign up an already existing user", async () => {
    const existingUser = {
      email: "user@example.com",
      password: "hashedPassword123",
    };
    const response = await request(app).post("/signup").send(existingUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.detail).toContain("User already exists");
  });
});

//==== Test POST "/login"
describe("POST /login", () => {
  it("successfully logs in a user", async () => {
    const credentials = {
      email: "user@example.com",
      password: "hashedPassword123",
    };
    const response = await request(app).post("/login").send(credentials);
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(credentials.email);
    expect(response.body.token).toBeDefined();
  });

  it("handles incorrect credentials", async () => {
    const credentials = {
      email: "user@example.com",
      password: "wrongPassword",
    };
    const response = await request(app).post("/login").send(credentials);
    expect(response.statusCode).toBe(200);
    expect(response.body.detail).toContain("Login failed");
  });
});

//==== Test  GET "/todos/:userEmail"
describe("GET /todos/:userEmail", () => {
  it("responds with todos for the user", async () => {
    const response = await request(app).get("/todos/user@example.com");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

//==== Test POST "/todos"

describe("POST /todos", () => {
  it("successfully creates a new todo", async () => {
    const newTodo = {
      user_email: "user@example.com",
      title: "New Todo",
      progress: 20,
      date: "2021-02-02T00:00:00.000Z",
    };
    const response = await request(app).post("/todos").send(newTodo);
    expect(response.statusCode).toBe(200);
    expect(response.body.rows[0].title).toBe(newTodo.title);
  });
});

//====Test PUT "/todos/:id"
describe("PUT /todos/:id", () => {
  it("successfully updates a todo", async () => {
    const updateData = {
      user_email: "user@example.com",
      title: "Updated Todo",
      progress: 70,
      date: "2021-03-03T00:00:00.000Z",
    };
    const response = await request(app).put("/todos/1").send(updateData);

    expect(response.statusCode).toBe(200);
    expect(response.body.rows[0].title).toBe(updateData.title);
    expect(response.body.rows[0].progress).toBe(updateData.progress);
  });
});

//==== Test DELETE "/todos/:id"
describe("DELETE /todos/:id", () => {
  it("successfully deletes a todo", async () => {
    const response = await request(app).delete("/todos/1");
    expect(response.statusCode).toBe(200);
    expect(response.body.rowCount).toBe(1);
    console.log(response.body);
  });
});
