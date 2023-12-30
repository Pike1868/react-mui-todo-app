import React from "react";
import App from "../App";
import { render } from "@testing-library/react";

//Smoke Test
it("renders without crashing", () => {
  render(<App />);
});

//Snapshot Test

it("matches snapshot", () => {
  const { asFragment } = render(<App />);

  expect(asFragment()).toMatchSnapshot();
});
