// TodoHeader.test.js
import React from "react";
import { render } from "@testing-library/react";
import TodoHeader from "../components/TodoHeader";

// Smoke Test
it("renders without crashing", () => {
  render(<TodoHeader listName="My Todo List" getData={() => {}} />);
});

// Snapshot Test
it("matches snapshot", () => {
  const { asFragment } = render(
    <TodoHeader listName="My Todo List" getData={() => {}} />
  );
  expect(asFragment()).toMatchSnapshot();
});
