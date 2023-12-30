import React from "react";
import Modal from "../components/Modal";
import { render } from "@testing-library/react";

//Smoke Test
it("renders without crashing", () => {
  render(<Modal />);
});

//Snapshot Test
it("matches snapshot", () => {
  const { asFragment } = render(<Modal />);
  expect(asFragment()).toMatchSnapshot();
});
