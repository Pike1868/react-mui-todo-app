import React from "react";
import TodoItem from "../components/TodoItem";
import { render, screen } from "@testing-library/react";

//Mock Task
const mockTask = {
  id: "0",
  user_email: "todo@test.com",
  title: "First Todo",
  progress: 10,
  date: "Tue Dec 26 2023 15:36:11 GMT-0500 (Eastern Standard Time)",
};

//Smoke Test
it("renders without crashing", () => {
  render(<TodoItem task={mockTask} />);
});

//Snapshot Test
it("matches snapshot", () => {
  const { asFragment } = render(<TodoItem task={mockTask} />);
  expect(asFragment()).toMatchSnapshot();
});
